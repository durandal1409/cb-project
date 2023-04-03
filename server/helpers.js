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
        const ads = [];
        let cursor = await db.collection(adsCollection).aggregate(agg);
        await cursor.forEach((doc) => ads.push(doc));
    
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
    // if uses is logged in and user ID has been passed
    // return ads according to the last search
    // else return 4 random ads
    try {
        const client = new MongoClient(MONGO_URI, options);
        await client.connect();
        const db = client.db(dbName);

        const ads = [];
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
                }
            ];
            let cursor = await db.collection(adsCollection).aggregate(agg);
            await cursor.forEach((doc) => ads.push(doc));
        // if no user or no last search
        // then return 4 random ads
        } else {
            let cursor = await db.collection(adsCollection).aggregate([{ $sample: { size: 4 } }])
            await cursor.forEach((doc) => ads.push(doc));
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
    
        const ads = [];

        let cursor = await db.collection(adsCollection).find().sort({"timestamp": -1}).limit(4);
        await cursor.forEach((doc) => ads.push(doc));

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
    const { title, adId } = req.body;
    // preparing search object
    const agg = [
        {
            "$search": {
                "compound":{
                    "must":[{
                        "moreLikeThis": {
                            "like": {name: title}
                        }
                    }],
                    "mustNot":[{
                        "equals": {
                            "path": "_id",
                            "value": adId
                        }
                    }]
                }
            }
        }
    ];

    try {
        const client = new MongoClient(MONGO_URI, options);
        await client.connect();
        const db = client.db(dbName);
    
        const ads = [];
        let cursor = await db.collection(adsCollection).aggregate(agg);
        await cursor.forEach((doc) => ads.push(doc));
    
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
const postAd = async (req, res) => {
    
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
    postAd,
    updateAd,
    deleteAd
}