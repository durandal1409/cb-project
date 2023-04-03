const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

const bigCategories = ["Men", "Women", "Kids"];
const clothingSubcategories = {
    "jackets and vests": {
        "parkas": {},
        "insulated & down": {},
        "vests": {},
        "rain jackets": {},
        "windbreakers": {}
    },
    "tops": {
        "long sleeve": {},
        "short sleeve": {},
        "t-shirts": {},
        "sweatshirts and hoodies": {}
    },
    "bottoms": {
        "pants": {},
        "shorts": {},
        "skirts": {},
        "leggins": {},

    },
    "dresses": "",
    "accessories": {
        "hats": {},
        "gloves": {},
        "bags": {}
    }
}
const womenSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const menSizes = ["S", "M", "L", "XL", "XXL", "XXXL"];
const kidsSizes = ["XS", "S", "M", "L", "XL"];
const toddlersSizes = ["2T", "3T", "4T"];
const babySizes = ["0-3m", "3-6m", "6-12m", "12-18m", "18-24m"];
const colors = ["black", "white", "red", "green", "blue", "yellow", "orange", "brown", "pink"];
// This function takes the objects from both companies.json and items.json and sends them to the Mongodb GroupProject database in their respective collection
const batchImport = async () =>{
    const client = new MongoClient(MONGO_URI, options);

    try{
        await client.connect();
        const db = client.db("cb-project");
        const collection = db.collection("categories");
        await collection.drop();

        await collection.insertMany([
            {
                type: "bigCategories",
                data: bigCategories
            },
            {
                type: "clothingSubcategories",
                data: clothingSubcategories
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