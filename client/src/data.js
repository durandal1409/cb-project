export const smallAdsArr = [
    {
        "_id": "823d0733-9383-4121-bd81-d9786f13e672",
        "timestamp": "2023-03-13T21:08:58.605Z",
        "name": "Licensed Granite Chips",
        "authorId": "",
        "price": "4.00",
        "description": "The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients",
        "pics": [
            "https://loremflickr.com/640/480/fashion?lock=86761",
            "https://loremflickr.com/640/480/fashion?lock=71482"
        ],
        "address": "690 Arlie Ferry",
        "location": {
            "type": "Point",
            "coordinates": [
                "45.54420",
                "-73.55862"
            ]
        }
    },
    {
        "_id": "94d7a0c3-780c-4ffa-a3b5-f93ec087b589",
        "timestamp": "2023-03-09T13:04:58.168Z",
        "name": "Licensed Granite Chicken",
        "authorId": "",
        "price": "75.00",
        "description": "The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J",
        "pics": [
            "https://loremflickr.com/640/480/fashion?lock=7880"
        ],
        "address": "79611 Bahringer Mission",
        "location": {
            "type": "Point",
            "coordinates": [
                "45.62698",
                "-73.57537"
            ]
        }
    },
    {
        "_id": "c0070ac4-2e3e-4b45-b278-33591031e938",
        "timestamp": "2023-03-31T10:05:23.191Z",
        "name": "Ergonomic Wooden Bacon",
        "authorId": "",
        "price": "61.00",
        "description": "New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart",
        "pics": [],
        "address": "30915 Austin Common",
        "location": {
            "type": "Point",
            "coordinates": [
                "45.64015",
                "-73.56977"
            ]
        }
    },
    {
        "_id": "d375d0fa-daa1-45ee-9571-a23566f2ae45",
        "timestamp": "2023-03-31T02:22:41.341Z",
        "name": "Oriental Fresh Salad",
        "authorId": "",
        "price": "138.00",
        "description": "Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
        "pics": [
            "https://loremflickr.com/640/480/fashion?lock=72772",
            "https://loremflickr.com/640/480/fashion?lock=13131",
            "https://loremflickr.com/640/480/fashion?lock=67195",
            "https://loremflickr.com/640/480/fashion?lock=72216"
        ],
        "address": "45940 Mekhi Road",
        "location": {
            "type": "Point",
            "coordinates": [
                "45.65078",
                "-73.56329"
            ]
        }
    },
    {
        "_id": "bf46aea8-ce09-48a5-b2b4-181ba02f85a1",
        "timestamp": "2023-03-30T21:45:01.971Z",
        "name": "Refined Bronze Soap",
        "authorId": "",
        "price": "18.00",
        "description": "Carbonite web goalkeeper gloves are ergonomically designed to give easy fit",
        "pics": [
            "https://loremflickr.com/640/480/fashion?lock=45632",
            "https://loremflickr.com/640/480/fashion?lock=98580",
            "https://loremflickr.com/640/480/fashion?lock=87495"
        ],
        "address": "469 Cleta Cliffs",
        "location": {
            "type": "Point",
            "coordinates": [
                "45.54913",
                "-73.57033"
            ]
        }
    },
    {
        "_id": "836cdc64-48c2-45a0-9a35-74400c7cdb38",
        "timestamp": "2023-03-30T10:08:43.801Z",
        "name": "Unbranded Bronze Hat",
        "authorId": "",
        "price": "65.00",
        "description": "The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality",
        "pics": [
            "https://loremflickr.com/640/480/fashion?lock=69036",
            "https://loremflickr.com/640/480/fashion?lock=95315"
        ],
        "address": "7694 Rath Loop",
        "location": {
            "type": "Point",
            "coordinates": [
                "45.55934",
                "-73.56723"
            ]
        }
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

const taxonomy1 = {
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


export const taxonomy = {
    "Women" : {
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
        "dresses": {},
        "accessories": {
            "hats": {},
            "gloves": {},
            "bags": {}
        }
    },
    "Men" : {
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
            "shorts": {}
        },
        "accessories": {
            "hats": {},
            "gloves": {},
            "bags": {}
        }
    },
    "Kids" : {
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
        "dresses": {},
        "accessories": {
            "hats": {},
            "gloves": {},
            "bags": {}
        }
    }
}

const womenSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const menSizes = ["S", "M", "L", "XL", "XXL", "XXXL"];
const kidsSizes = ["XS", "S", "M", "L", "XL"];
const toddlersSizes = ["2T", "3T", "4T"];
const babySizes = ["0-3m", "3-6m", "6-12m", "12-18m", "18-24m"];
const colors = [];
export const mainCategories = ["Women", "Men", "Kids"];
export const smallCategories = {
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
    "dresses": {},
    "accessories": {
        "hats": {},
        "gloves": {},
        "bags": {}
    }
}
