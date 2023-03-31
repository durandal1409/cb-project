export const smallAdsArr = [
    {
        _id: 1,
        pic: "/assets/red-shoes.jpg",
        price: 5,
        name: "Red shoes like new",
        address: "13 Rue des Oblats, LaSalle, QC H8R 3K9"
    },
    {
        _id: 2,
        pic: "/assets/red-shoes.jpg",
        price: 5,
        name: "Red shoes like new",
        address: "13 Rue des Oblats, LaSalle, QC H8R 3K9"
    },
    {
        _id: 3,
        pic: "/assets/red-shoes.jpg",
        price: 5,
        name: "Red shoes like new",
        address: "13 Rue des Oblats, LaSalle, QC H8R 3K9"
    },
    {
        _id: 4,
        pic: "/assets/red-shoes.jpg",
        price: 5,
        name: "Red shoes like new",
        address: "13 Rue des Oblats, LaSalle, QC H8R 3K9"
    }

]

export const userDocument = {
    "_id": 1,
    "fname": "Rony",
    "lname": "Kordahi",
    "email": "q@w.com",
    "googleId": "",
    "avatar": "/assets/avatar.jpg",
    "ads": [
        "adId-1",
        "adId-2"
    ]
}

export const adDocument = {
    "_id": "adId-1",
    "name": "Red shoes size 10",
    "authorId": 1,
    "price": 15,
    "description": "orem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
    "address": "13 Rue des Oblats, LaSalle, QC H8R 3K9",
    "posted": "2023-01-01 13:10",
    "categoriesIds": [
        1, 4, 5, 6, 9
    ],
    "categories": ["women", "bottoms", "pants", "L", "black"],
    "location": {
        "type": "Point",
        "coordinates": [-73.856077, 40.848447]
    }
}

const taxonomy = {
    category: [
        {
            _id: 1,
            name: "men",
            subcategories: [
                {
                    _id: 4,
                    name: "shoes",
                    subcategories: [
                        {
                            _id: 5,
                            name: "shoe-sizes",
                            subcategories: [
                                {
                                    _id: 6,
                                    size: 10
                                },
                                {
                                    _id: 7,
                                    size: 11
                                },
                                {
                                    _id: 8,
                                    size: 12
                                }
                            ]
                        },
                        {
                            _id: 6,
                            name: "shoe-colors",
                            subcategories: [
                                {
                                    _id: 9,
                                    size: "red"
                                },
                                {
                                    _id: 10,
                                    size: "green"
                                },
                                {
                                    _id: 11,
                                    size: "blue"
                                }
                            ]
                        }
                        
                    ]
                },
                {
                    jackets: [
                        
                    ]
                },
                {
                    pants: [
                        
                    ]
                }
            ]
        },
        {
            _id: 2,
            name: "women",
            subcategories: [

            ]
        },
        {
            _id: 3,
            name: "kids",
            subcategories: [

            ]
        }
    ]
}


const women = {
    "jackets and vests": {
        "parkas": "",
        "insulated & down": "",
        "vests": "",
        "rain jackets": "",
        "windbreakers": ""
    },
    "tops": {
        "long sleeve": "",
        "short sleeve": "",
        "t-shirts": "",
        "sweatshirts and hoodies": ""
    },
    "bottoms": {
        "pants": "",
        "shorts": "",
        "skirts": "",
        "leggins": "",

    },
    "dresses": "",
    "accessories": {
        "hats": "",
        "gloves": "",
        "bags": ""
    }
}

const womenSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const menSizes = ["S", "M", "L", "XL", "XXL", "XXXL"];
const kidsSizes = ["XS", "S", "M", "L", "XL"];
const toddlersSizes = ["2T", "3T", "4T"];
const babySizes = ["0-3m", "3-6m", "6-12m", "12-18m", "18-24m"];
const colors = [];
