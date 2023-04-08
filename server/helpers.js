"use strict";
const { v4: uuidv4 } = require("uuid");

const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

const dbName = "cb-project";
const adsCollection = "ads";
const usersCollection = "users";
const categoriesCollection = "categories";

const getBigCategories = async (req, res) => {
    try {
        const client = new MongoClient(MONGO_URI, options);
        await client.connect();
        const db = client.db(dbName);
    
        const bigCategories = await db.collection(categoriesCollection).findOne({type: "bigCategories"});
    
        client.close();
        if (bigCategories) {
            res.status(200).json({
                status: 200,
                data: bigCategories.data
            });
        } else {
            res.status(404).json({ status: 404, message: "Big categories not found." });
        }
    } catch(err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, message: err.message });
    }
}
const getSubcategories = async (req, res) => {
    try {
        const client = new MongoClient(MONGO_URI, options);
        await client.connect();
        const db = client.db(dbName);
    
        const subcategories = await db.collection(categoriesCollection).findOne({type: "clothingSubcategories"});
    
        client.close();
        if (subcategories) {
            res.status(200).json({
                status: 200,
                data: subcategories.data
            });
        } else {
            res.status(404).json({ status: 404, message: "Subcategories not found." });
        }
    } catch(err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, message: err.message });
    }
}
const getSizes = async (req, res) => {
    try {
        const client = new MongoClient(MONGO_URI, options);
        await client.connect();
        const db = client.db(dbName);
    
        const sizes = await db.collection(categoriesCollection).findOne({type: "clothingSizes"});
    
        client.close();
        if (sizes) {
            res.status(200).json({
                status: 200,
                data: sizes.data
            });
        } else {
            res.status(404).json({ status: 404, message: "Sizes not found." });
        }
    } catch(err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, message: err.message });
    }
}
const getSearchedAds = async (req, res) => {
    // taking searchphrase out of query
    const searchPhrase = req.query.q.split("%20").join(" ");
    // preparing search object
    const agg = [
        {
            '$search': {
                'phrase': {
                    'path': ['name', 'description'],
                    'query': searchPhrase
                }
            }
        }
    ];

    try {
        const client = new MongoClient(MONGO_URI, options);
        await client.connect();
        const db = client.db(dbName);

        // add searchPhrase to user document
        if (req.body.userId) {
            const upd = await db.collection(usersCollection).updateOne({_id: req.body.userId}, {$set: { "last_search" :  searchPhrase}})
        }
    
        // find ads according to the search
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
    
        const ads = await db.collection(adsCollection).find().sort({"timestamp": -1}).limit(4).project({ _id : 1, name: 1, price: 1, address: 1, pic: {$first: "$pics"}}).toArray();

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
const getFiltered = async (req, res) => {
    
}
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
            "$limit": 4
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
const getUser = async (req, res) => {
    const _id = req.params.userId;
    try {
        const client = new MongoClient(MONGO_URI, options);
        await client.connect();
        const db = client.db(dbName);
    
        const user = await db.collection(usersCollection).findOne({ _id });
        if (!user) {
            res.status(404).json({
                status: 404,
                data: {_id},
                message: "User with provided id not found.",
            });
        } else {
            res.status(200).json({
                status: 200,
                data: user
            })
        }
        client.close();
    } catch(err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, message: err.message });
    }
}
const addUser = async (req, res) => {
    const { 
        _id, 
        fname, 
        lname,
        email, 
        avatar, 
        ads } = req.body;

    if (!_id) {
        res.status(422).json({
            status: 422, 
            data: req.body, 
            message: "Please, provide user id."
        })
        return;
    }
    
    try {
        const client = new MongoClient(MONGO_URI, options);
        await client.connect();
        const db = client.db(dbName);

        // check if user already exists
        const userInDb = await db.collection(usersCollection).findOne({_id});
        if (userInDb) {
            res.status(409).json({
                status: 409,
                data: {_id},
                message: "User already exists."
            })
            client.close();
            return
        }
    
        // add only what we need for user, exclude any other info that might be in req.body
        const userObj = {
                _id, 
                fname, 
                lname,
                email, 
                avatar, 
                ads
            };
        const userInsertRes = await db.collection(usersCollection).insertOne(userObj);
        if (!userInsertRes.acknowledged) {
            res.status(404).json({
                status: 404,
                message: "User not created.",
            });
        } else {
            res.status(201).json({
                status: 201,
                data: {_id},
                message: "User created."
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
        // categories,
        description, 
        pics, 
        price, 
        address } = req.body;

    if (!userId || !name || !description || !pics || !price || !address) {
        console.log("dd: ", userId, name, description, pics, price, address);
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
    
        // add only what we need for ad, exclude any other info that might be in req.body
        const adObj = {
                _id: uuidv4(),
                userId, 
                name, 
                // categories,
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
    getBigCategories,
    getSubcategories,
    getSearchedAds,
    getSizes,
    getRecommended,
    getLatest,
    getFiltered,
    getSimilar,
    getAd,
    getUser,
    addUser,
    postAd,
    updateAd,
    deleteAd
}