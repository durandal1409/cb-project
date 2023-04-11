"use strict";
const { v4: uuidv4 } = require("uuid");
const { LAT_BOUNDARIES, LNG_BOUNDARIES} = require("../batchImports/batchImportAdsAndUsers");

const { MongoClient } = require("mongodb");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const { MONGO_URI } = process.env;
const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

const dbName = "cb-project";
const adsCollection = "ads";
const usersCollection = "users";

const getSearchedAds = async (req, res) => {
    const {userId} = req.params;
    const {categories, search} = req.query;
    // make categories path string according to db format
    // (https://www.mongodb.com/docs/manual/tutorial/model-tree-structures-with-materialized-paths/)
    const path = categories === "/undefined" || categories === "/" ? null : categories.replaceAll("/", ",");
    const searchPhrase = (search === "undefined" || search === "null" || search === "") ? null : search;
    // console.log("CC:  ", path, searchPhrase, search, categories);
    const limit = 100;
    let agg;
    if (!searchPhrase && !path) {
        console.log("both")
        agg = [
            {
                '$limit': limit
            }
        ]
    } else if (!searchPhrase) {
        console.log("no-search")
        console.log("p: ", path.split())
        agg = [
            {
                $search: {
                    "regex": {
                        "query": `${path}(.*)`,
                        "path": "path"
                    }
                }
            },
            {
                '$limit': limit
            },
            { 
                $project : { _id : 1, name: 1, price: 1, address: 1, pic: {$first: "$pics"}, location: 1} 
            }
        ]
    } else if (!path) {
        console.log("no-path")
        agg = [
            {
                $search: {
                    'phrase': {
                        'path': ['name', 'description'],
                        'query': search
                    }
                }
            },
            {
                '$limit': limit
            },
            { 
                $project : { _id : 1, name: 1, price: 1, address: 1, pic: {$first: "$pics"}, location: 1} 
            }
        ]
    } else {
        console.log("all")
        agg = [
            {
                $search:  {
                    "compound": {
                        "must": [
                            {
                                'phrase': {
                                    'path': ['name', 'description'],
                                    'query': search
                                }
                            },
                            {
                                "regex": {
                                    "query": `${path}(.*)`,
                                    "path": "path"
                                }
                            }
                        ]
                    }
                }
            },
            {
                '$limit': limit
            },
            { 
                $project : { _id : 1, name: 1, price: 1, address: 1, pic: {$first: "$pics"}, location: 1} 
            }
        ]
    }

    try {
        const client = new MongoClient(MONGO_URI, options);
        await client.connect();
        const db = client.db(dbName);

        // add searchPhrase to user document
        if ( userId && search) {
            const upd = await db.collection(usersCollection).updateOne({_id: userId}, {$set: { "last_search" :  search}})
        }
    
        // find ads according to the search
        const ads = await db.collection(adsCollection).aggregate(agg).toArray();
        console.log("ads.length: ", ads.length, ads);
        client.close();
        if (ads) {
            res.status(200).json({
                status: 200,
                data: ads
            });
        } else {
            res.status(404).json({ status: 404, message: "Ads not found." });
        }
    } catch(err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, message: err.message });
    }
}
const getRecommended = async (req, res) => {
    const { userId } = req.params;
    console.log("user: ", userId);
    // if user is logged in and user ID has been passed
    // return ads according to the last search
    // else return 4 random ads
    try {
        const client = new MongoClient(MONGO_URI, options);
        await client.connect();
        const db = client.db(dbName);

        let ads = [];
        let lastSearch;

        // looking for the last search phrase of user
        if (req.params.userId) {
            lastSearch = await db.collection(usersCollection).findOne({_id: req.params.userId}, {projection: {last_search: 1}})
        }
        // making search request with this phrase
        // returning 4 documents
        if (lastSearch?.last_search) {
            const agg = [
                {
                    '$search': {
                        'phrase': {
                            'path': ['name', 'description'],
                            'query': lastSearch.last_search
                        }
                    }
                    
                },
                {
                    '$limit': 4
                },
                { 
                    $project : { _id : 1, name: 1, price: 1, address: 1, pic: {$first: "$pics"}} 
                }
            ];
            ads = await db.collection(adsCollection).aggregate(agg).toArray();
        // if no user or no last search
        // then return 4 random ads
        } else {
            ads = await db.collection(adsCollection).aggregate([{ $sample: { size: 4 } }, { $project : { _id : 1, name: 1, price: 1, address: 1, pic: {$first: "$pics"}} } ]).toArray();
        }
    
        client.close();
        if (ads.length) {
            res.status(200).json({
                status: 200,
                data: ads
            });
        } else {
            res.status(404).json({ status: 404, message: "Ads not found." });
        }
    } catch(err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, message: err.message });
    }
}
const getLatest = async (req, res) => {
    try {
        const client = new MongoClient(MONGO_URI, options);
        await client.connect();
        const db = client.db(dbName);
    
        const ads = await db.collection(adsCollection)
            .find().sort({"timestamp": -1}).limit(4)
            .project({ _id : 1, name: 1, price: 1, address: 1, pic: {$first: "$pics"}})
            .toArray();

        client.close();
        if (ads.length) {
            res.status(200).json({
                status: 200,
                data: ads
            });
        } else {
            res.status(404).json({ status: 404, message: "Ads not found." });
        }
    } catch(err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, message: err.message });
    }
}
const getSimilar = async (req, res) => {
    const {path, coordinates} = req.params;
    const coordinatesArr = coordinates.split(',');
    const agg = [
            {
                $geoNear: {
                    near: { type: "Point", coordinates: [ Number(coordinatesArr[0]), Number(coordinatesArr[1]) ] },
                    spherical: true,
                    query: { path: path },
                    distanceField: "calcDistance"
                }
            },
            {
                '$limit': 6
            },
            { 
                $project : { _id : 1, name: 1, price: 1, address: 1, pic: {$first: "$pics"}} 
            }
    ]
    try {
        const client = new MongoClient(MONGO_URI, options);
        await client.connect();
        const db = client.db(dbName);
    
        const ads = await db.collection(adsCollection).aggregate(agg).toArray();
        // console.log("ads: ", ads);
        client.close();
        if (ads) {
            res.status(200).json({
                status: 200,
                data: ads
            });
        } else {
            res.status(404).json({ status: 404, message: "Ads not found." });
        }
    } catch(err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, message: err.message });
    }
}
const getAd = async (req, res) => {
    const _id = req.params.adId;
    try {
        const client = new MongoClient(MONGO_URI, options);
        await client.connect();
        const db = client.db(dbName);
        
        const ad = await db.collection(adsCollection).findOne({ _id });
        if (!ad) {
            res.status(404).json({
                status: 404,
                data: {_id},
                message: "Ad with provided id not found.",
            });
        } else {
            res.status(200).json({
                status: 200,
                data: ad
            })
        }
        client.close();
    } catch(err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, message: err.message });
    }
}
const postAd = async (req, res) => {
    const { 
        userId, 
        name, 
        categories,
        description, 
        pics, 
        price, 
        address } = req.body;

    if (!userId || !name || !description || !pics || !price || !address || !categories) {
        res.status(422).json({
            status: 422, 
            data: req.body, 
            message: "Please, provide name, categories, description, pics, price and address."
        })
        return;
    }
    
    try {
        const client = new MongoClient(MONGO_URI, options);
        await client.connect();
        const db = client.db(dbName);

        // before sending data we need to change categories array to string
        // according to mongo Materialized Paths (https://www.mongodb.com/docs/manual/tutorial/model-tree-structures-with-materialized-paths/)
        // like this ["Men", "Top", "Jackets"] --> ",Men,Top,Jackets,"
        // 1. Check if there are empty stings and remove them
        let path = categories.filter(el => el !== "");
        // 2. Then make it a string and add commas at the beginning and the end
        path = "," + path.join(",").toLowerCase() + ",";
        // console.log("path: ", path);

        // need to make fake coordinates for ad to show it on the map
        const fakeLocation = {
            type: "Point",
            coordinates: [
                Math.random() * (LAT_BOUNDARIES[1] - LAT_BOUNDARIES[0]) + LAT_BOUNDARIES[0], 
                Math.random() * (LNG_BOUNDARIES[1] - LNG_BOUNDARIES[0]) + LNG_BOUNDARIES[0]
            ]
        }

        // add only what we need for ad, exclude any other info that might be in req.body
        const adObj = {
                _id: uuidv4(),
                userId, 
                name, 
                path,
                description, 
                pics, 
                price, 
                address,
                location: fakeLocation
            };
        const adsRes = await db.collection(adsCollection).insertOne(adObj);
        if (!adsRes.acknowledged) {
            res.status(404).json({
                status: 404,
                message: "Ad not created.",
            });
        } else {
            // adding ad id to user in users collection
            const usersRes = await db.collection(usersCollection).updateOne({_id: adObj.userId}, {$push: {ads: adObj._id}});
            console.log("usersRes: ", usersRes);
            res.status(201).json({
                status: 201,
                data: {_id: adObj._id},
                message: "Ad created."
            })
        }
        client.close();
    } catch(err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, message: err.message });
    }
}
const updateAd = async (req, res) => {
    const { 
        _id, 
        name, 
        categories,
        description, 
        pics, 
        price, 
        address } = req.body;

    if (!_id) {
        res.status(422).json({
            status: 422, 
            data: req.body, 
            message: "Please, provide ad id."
        })
        return;
    }
    
    try {
        const client = new MongoClient(MONGO_URI, options);
        await client.connect();
        const db = client.db(dbName);
        // before sending data we need to change categories array to string
        // according to mongo Materialized Paths (https://www.mongodb.com/docs/manual/tutorial/model-tree-structures-with-materialized-paths/)
        // like this ["Men", "Top", "Jackets"] --> ",Men,Top,Jackets,"
        // 1. Check if there are empty stings and remove them
        let path = categories?.filter(el => el !== "");
        // 2. Then make it a string and add commas at the beginning and the end
        path = "," + path.join(",") + ",";

       // update only defined properties and exclude any other info that might be in req.body
        const updateObj = {
            ...(name && {name}),
            ...(price && {price}),
            ...(description && {description}),
            ...(pics && {pics}),
            ...(address && {address}),
            ...(path && {path})
        }
        const adsRes = await db.collection(adsCollection).findOneAndUpdate({_id}, {$set: updateObj}, {returnDocument: "after"});
        console.log("mm:", adsRes);
        if (!adsRes.value) {
            res.status(409).json({
                status: 409, 
                data: {_id}, 
                message: "Ad update failed."
            })
        } else {
            res.status(200).json({
                status: 200,
                data: adsRes.value,
                message: "Ad updated."
            })
        }
        client.close();
    } catch(err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, message: err.message });
    }
}
const deleteAd = async (req, res) => {
    const { adId, userId } = req.body;

    if (!userId || !adId ) {
        res.status(422).json({
            status: 422, 
            data: req.body, 
            message: "Please, provide adId and userId."
        })
        return;
    }
    
    try {
        const client = new MongoClient(MONGO_URI, options);
        await client.connect();
        const db = client.db(dbName);

        // remove ad from user ads property
        const usersRes = await db.collection(usersCollection).updateOne({_id: userId}, {$pull: {ads: adId}});
        if (usersRes.matchedCount === 0) {
            res.status(404).json({
                status: 404, 
                data: {userId, adId}, 
                message: "User not found."
            })
        } else if (usersRes.modifiedCount === 0) {
            res.status(409).json({
                status: 409, 
                data: {userId, adId}, 
                message: "User update failed."
            })
        } else {
            // remove ad from ads collection
            const adsRes = await db.collection(adsCollection).deleteOne({_id: adId});
            if (adsRes.deletedCount === 0) {
                res.status(409).json({
                    status: 409, 
                    data: {userId, adId}, 
                    message: "User updated. But couldn't delete ad from ads collection."
                })
            } else {
                res.status(200).json({
                    status: 200,
                    data: {adId},
                    message: "Ad deleted."
                })
            }
        }
        client.close();
    } catch(err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, message: err.message });
    }
}

module.exports = {
    getSearchedAds,
    getRecommended,
    getLatest,
    // getFiltered,
    getSimilar,
    getAd,
    postAd,
    updateAd,
    deleteAd
}