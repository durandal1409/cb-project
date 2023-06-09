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

const getUser = async (req, res) => {
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
        } else {
            res.status(200).json({
                status: 200,
                data: user,
                message: "User found."
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
        avatar } = req.body;

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
                favourites: [],
                ads: [],
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
    
        const userUpdateRes = await db.collection(usersCollection).findOneAndUpdate({_id}, {$set: updateObj}, {returnDocument: "after"});
        if (!userUpdateRes.value) {
            res.status(409).json({
                status: 409, 
                data: {_id}, 
                message: "User update failed."
            })
        } else {
            res.status(200).json({
                status: 200,
                data: userUpdateRes.value,
                message: "User updated."
            })
        }
        client.close();
    } catch(err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, message: err.message });
    }
}
const updateUserFavourites = async (req, res) => {
    const { userId, adId } = req.params;
    console.log("u: ", userId, adId);

    if (!userId || !adId) {
        res.status(422).json({
            status: 422, 
            data: {userId, adId},
            message: "Please, provide user id and ad id."
        })
        return;
    }
    
    try {
        const client = new MongoClient(MONGO_URI, options);
        await client.connect();
        const db = client.db(dbName);
    
        const userUpdateRes = await db.collection(usersCollection).findOneAndUpdate(
            {_id: userId},
            [
                {
                    $set: {
                        favourites: {
                            $cond: [
                                {
                                    $in: [adId, "$favourites"]
                                },
                                {
                                    $setDifference: ["$favourites", [adId]]
                                },
                                {
                                    $concatArrays: ["$favourites", [adId]]
                                }
                            ]
                        }
                    }
                }
            ], 
            {returnDocument: "after"}
        );
        if (!userUpdateRes.value) {
            res.status(409).json({
                status: 409, 
                data: {_id}, 
                message: "User update failed."
            })
        } else {
            res.status(200).json({
                status: 200,
                data: {favourites: userUpdateRes.value.favourites},
                message: "User's favourite ads array updated."
            })
        }
        client.close();
    } catch(err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, message: err.message });
    }
}


module.exports = {
    getUser,
    addUser,
    updateUserFavourites,
    updateUser
}