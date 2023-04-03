const { MongoClient } = require("mongodb");
const { faker } = require('@faker-js/faker/locale/en_CA');
const { v4: uuidv4 } = require("uuid");

require("dotenv").config({ path: path.join(__dirname, "../.env") });
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

const NEW_ADS_NUM = 100;

const LAT_BOUNDARIES = [45.50, 45.67];
const LNG_BOUNDARIES = [-73.5586, -73.5778];
const MAX_PICS_NUM = 6;

// This function takes the objects from both companies.json and items.json and sends them to the Mongodb GroupProject database in their respective collection
const batchImport = async () =>{
    const client = new MongoClient(MONGO_URI, options);



    try{
        await client.connect();
        const db = client.db("cb-project");
        const collection = db.collection("ads");
        collection.drop();

        const ads = [];

        for (let i = 0; i < NEW_ADS_NUM; i++) {
            const picsNum = Math.floor(Math.random() * MAX_PICS_NUM);
            const picsArr = [...Array(picsNum)].map(pic => faker.image.fashion(640, 480, true))
            const newAd = {
                _id: uuidv4(),
                timestamp: faker.date.recent(30),
                name: faker.commerce.productName(),
                authorId: "",
                price: faker.commerce.price(1, 200),
                description: faker.commerce.productDescription(),
                pics: picsArr,
                address: faker.address.streetAddress(),
                location: {
                    type: "Point",
                    coordinates: [
                        faker.address.latitude(LAT_BOUNDARIES[1], LAT_BOUNDARIES[0], 5), 
                        faker.address.longitude(LNG_BOUNDARIES[1], LNG_BOUNDARIES[0], 5)
                    ]
                }
            }
            ads.push(newAd);
        }

        await collection.insertMany(ads);

        client.close();
        
    }catch(err){
        console.log(err.stack);
    }
}

batchImport();