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
const categoriesCollection = "categories";

const getCategories = async (req, res) => {
    try {
        const client = new MongoClient(MONGO_URI, options);
        await client.connect();
        const db = client.db(dbName);
    
        const categories = await db.collection(categoriesCollection)
            .findOne({type: "taxonomy"}, {_id: 0, data: 1});
    
        client.close();
        if (categories) {
            res.status(200).json({
                status: 200,
                data: categories.data,
                message: "Found categories."
            });
        } else {
            res.status(404).json({ status: 404, message: "Categories not found." });
        }
    } catch(err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, message: err.message });
    }
}

module.exports = {
    getCategories
}