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

const getUserAndAds = async (req, res) => {
    const _id = req.params.userId;
    try {
        const client = new MongoClient(MONGO_URI, options);
        await client.connect();
        const db = client.db(dbName);
    
        // serch user in db
        const user = await db.collection(usersCollection).findOne({ _id });
        if (!user) {
            res.status(404).json({
                status: 404,
                data: {_id},
                message: "User with provided id not found.",
            });
        } else if (!user.ads.length) {
            res.status(200).json({
                status: 200,
                data: {user, ads: null},
                message: "User has no ads."
            })
        } else {
            // search user ads
            const userAds = await db.collection(adsCollection)
                .find( { _id : { $in : user.ads } } )
                .project({ _id : 1, name: 1, price: 1, address: 1, pic: {$first: "$pics"}})
                .toArray();
            if (!userAds) {
                res.status(404).json({
                    status: 404,
                    data: {user, ads: null},
                    message: "Ads not found."
                })
            } else {
                res.status(200).json({
                    status: 200,
                    data: {user, ads: userAds},
                    message: "User and ads found."
                })
            }
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

        console.log("received id: ", _id);

        // if user already exists return their data
        const userInDb = await db.collection(usersCollection).findOne({_id});
        if (userInDb) {
            res.status(200).json({
                status: 200,
                data: userInDb,
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
                ads,
                last_search: ""
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
                data: userObj,
                message: "User created."
            })
        }
        client.close();
    } catch(err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, message: err.message });
    }
}
const updateUser = async (req, res) => {
    console.log("body: ", req.body);
    const { 
        _id, 
        fname, 
        lname,
        // avatar,
        email } = req.body;

    if (!_id) {
        res.status(422).json({
            status: 422, 
            data: req.body, 
            message: "Please, provide user id."
        })
        return;
    }

    // add only defined properties and exclude any other info that might be in req.body
    const updateObj = {
        ...(fname && {fname}),
        ...(lname && {lname}),
        // ...(avatar && {avatar}),
        ...(email && {email})
    }
    
    try {
        const client = new MongoClient(MONGO_URI, options);
        await client.connect();
        const db = client.db(dbName);
    
        const userUpdateRes = await db.collection(usersCollection).updateOne({_id}, {$set: updateObj});
        if (userUpdateRes.matchedCount === 0) {
            res.status(404).json({
                status: 404, 
                data: {_id}, 
                message: "User not found."
            })
        } else if (userUpdateRes.modifiedCount === 0) {
            res.status(409).json({
                status: 409, 
                data: {_id}, 
                message: "User update failed."
            })
        } else {
            res.status(200).json({
                status: 200, 
                data: {_id}, 
                message: "User updated."
            })
        }
        client.close();
    } catch(err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, message: err.message });
    }
}

module.exports = {
    getUserAndAds,
    addUser,
    updateUser
}