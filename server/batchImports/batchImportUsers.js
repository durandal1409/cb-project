const { MongoClient } = require("mongodb");
const { faker } = require('@faker-js/faker/locale/en_CA');
const { v4: uuidv4 } = require("uuid");

require("dotenv").config({ path: path.join(__dirname, "../.env") });
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

const NEW_USERS_NUM = 100;

// This function takes the objects from both companies.json and items.json and sends them to the Mongodb GroupProject database in their respective collection
const batchImport = async () =>{
    const client = new MongoClient(MONGO_URI, options);

    try{
        await client.connect();
        const db = client.db("cb-project");
        const collection = db.collection("users");
        collection.drop();

        const users = [];

        for (let i = 0; i < NEW_USERS_NUM; i++) {
            const fname = faker.name.firstName();
            const lname = faker.name.lastName();
            const email = faker.internet.email(fname, lname);
            const newUser = {
                _id: uuidv4(),
                fname,
                lname,
                email,
                googleId: "",
                avatar: faker.internet.avatar(),
                ads: [
                    
                ]
            }
            users.push(newUser);
        }

        await collection.insertMany(users);

        client.close();
        
    }catch(err){
        console.log(err.stack);
    }
}

batchImport();