const { MongoClient } = require("mongodb");
const { faker } = require('@faker-js/faker/locale/en_CA');
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { cloudinaryPicsArr, taxonomy, makeRandomPath } = require("./batchHelpers.js");

require("dotenv").config({ path: path.join(__dirname, "../.env") });
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

const NEW_ADS_NUM = 1000;
const NEW_USERS_NUM = NEW_ADS_NUM / 10;

const LAT_BOUNDARIES = [45.50, 45.67];
const LNG_BOUNDARIES = [-73.5778, -73.5586];
const MAX_PICS_NUM = 6;

const randPath = makeRandomPath(taxonomy);

const batchImport = async () =>{
    const client = new MongoClient(MONGO_URI, options);

    try{
        await client.connect();
        const db = client.db("cb-project");
        
        // dropping old ads and users collection
        await db.collection('ads').deleteMany({});
        await db.collection('users').deleteMany({});

        const users = [];
        // creating new user objects and pushing them to users array
        for (let i = 0; i < NEW_USERS_NUM; i++) {
            const fname = faker.name.firstName();
            const lname = faker.name.lastName();
            const email = faker.internet.email(fname, lname);
            const newUser = {
                _id: uuidv4(),
                fname,
                lname,
                email,
                avatar: faker.internet.avatar(),
                ads: [],
                last_search: ""
            }
            users.push(newUser);
        }

        const ads = [];
        // creating new ad objects and pushing them to ads array
        for (let i = 0; i < NEW_ADS_NUM; i++) {
            const picsNum = Math.ceil(Math.random() * MAX_PICS_NUM);
            const picsArr = [...Array(picsNum)].map(pic => cloudinaryPicsArr[Math.floor(Math.random() * cloudinaryPicsArr.length)]);
            const randomUserId = users[Math.floor(Math.random() * users.length)]._id;
            const newAd = {
                _id: uuidv4(),
                timestamp: faker.date.recent(30),
                name: faker.commerce.productName(),
                brand: faker.company.name(),
                color: faker.color.human(),
                userId: randomUserId,
                price: faker.commerce.price(1, 200),
                description: faker.commerce.productDescription(),
                pics: picsArr,
                address: faker.address.streetAddress(),
                path: makeRandomPath(taxonomy),
                location: {
                    type: "Point",
                    coordinates: [
                        Number(faker.address.latitude(LAT_BOUNDARIES[1], LAT_BOUNDARIES[0], 5)), 
                        Number(faker.address.longitude(LNG_BOUNDARIES[1], LNG_BOUNDARIES[0], 5))
                    ]
                }
            }
            ads.push(newAd);
            // adding newAd id to user ads property
            users.find(user => user._id === randomUserId).ads.push(newAd._id);
        }

        // adding newly created ads and users to collections
        await db.collection("users").insertMany(users);
        await db.collection("ads").insertMany(ads);

        client.close();
        
    } catch(err){
        console.log(err.stack);
    }
}

batchImport();