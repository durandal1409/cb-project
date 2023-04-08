const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const { MONGO_URI } = process.env;
const { taxonomy } = require("./batchHelpers.js");

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };


// This function takes the objects from both companies.json and items.json and sends them to the Mongodb GroupProject database in their respective collection
const batchImport = async () =>{
    const client = new MongoClient(MONGO_URI, options);

    try{
        await client.connect();
        const db = client.db("cb-project");
        const collection = db.collection("categories");
        await db.collection('categories').deleteMany({});

        await collection.insertMany([
            {
                type: "taxonomy",
                data: taxonomy
            },
            {
                type: "colors",
                data: colors
            },
            {
                type: "clothingSizes",
                data: {
                    womenSizes,
                    menSizes,
                    kidsSizes,
                    toddlersSizes,
                    babySizes
                }
            }
        ]);

        client.close();
        
    }catch(err){
        console.log(err.stack);
    }
}

batchImport();

module.exports = { taxonomy };