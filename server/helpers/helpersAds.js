"use strict";
const { v4: uuidv4 } = require("uuid");

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
    const path = categories.replaceAll("/", ",") + ",";
    console.log("CC:  ", path, search);
    const p = ",kids,bottoms,"

    // prepare search object
    const agg = [
        {
            '$search': {
                'phrase': {
                    'path': ['name', 'description'],
                    'query': search
                }
            }
        }
    ];
    // const agg = [
    //     {
    //         $search: {
    //             'phrase': {
    //                 'path': ['name', 'description'],
    //                 'query': search
    //             },
    //             "regex": {
    //                 "query": `${path}(.*)`,
    //                 "path": "path"
    //             }
    //         }
    //     }
    // ]
    // const agg = [
    //     {
    //         $search:  {
    //             "compound": {
    //                 "must": [
    //                     {
    //                         'text': {
    //                             'path': ['name', 'description'],
    //                             'query': search
    //                         }
    //                     }
    //                     // {
    //                     //     "regex": {
    //                     //         "query": `${path}(.*)`,
    //                     //         "path": "path"
    //                     //     }
    //                     // }
    //                 ]
    //             }
    //         }
    //     }
    // ]

    try {
        const client = new MongoClient(MONGO_URI, options);
        await client.connect();
        const db = client.db(dbName);

        // add searchPhrase to user document
        if ( userId && search) {
            const upd = await db.collection(usersCollection).updateOne({_id: userId}, {$set: { "last_search" :  search}})
        }
    
        // find ads according to the search
        const ads = await db.collection(adsCollection).aggregate(agg).limit(48).toArray();
        // const ads = await db.collection(adsCollection).find( { path: /^,tops,/ } )
        console.log("adsS: ", ads);
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
const getRecommended = async (req, res) => {
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
// const getFiltered = async (req, res) => {
    
// }
const getSimilar = async (req, res) => {
    // search for words from current ad title
    const { title } = req.params;
    // preparing search object
    const agg = [
        {
            "$search": {
                // "compound":{
                //     "should":[{
                        "moreLikeThis": {
                            "like": {name: title}
                        }
                //     }],
                //     "mustNot":[{
                //         "equals": {
                //             "path": "_id",
                //             "value": adId
                //         }
                //     }]
                // }
            }
        },
        { 
            "$limit": 6
        },
        { 
            $project : { _id : 1, name: 1, price: 1, address: 1, pic: {$first: "$pics"}} 
        }
    ];

    try {
        const client = new MongoClient(MONGO_URI, options);
        await client.connect();
        const db = client.db(dbName);
    
        const ads = await db.collection(adsCollection).aggregate(agg).toArray();
    
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
        path = "," + path.join(",") + ",";
        // console.log("path: ", path);

        // add only what we need for ad, exclude any other info that might be in req.body
        const adObj = {
                _id: uuidv4(),
                userId, 
                name, 
                path,
                description, 
                pics, 
                price, 
                address
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
    
}
const deleteAd = async (req, res) => {
    
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