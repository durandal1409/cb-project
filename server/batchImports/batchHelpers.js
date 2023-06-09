// pics public_id array from Cloudinary
const cloudinaryPicsArr = [
    "xa5ahglrsbcqabwx9udh",
    "d0lo1z870xvdl08gjzgn",
    "g7xcmgykjv9m9kbzoxip",
    "ecofcoowpl2ei6hvgezo",
    "d1zj1j3j0i8rsjumwtxr",
    "lglpavnkcga1eoly3k23",
    "uh1qng7lzxuxuss83goo",
    "vsduozyibnayr3oj1trd",
    "hvq6xvbsqa7lcpb5suoq",
    "cjwje3sniu9grrnvaexh",
    "hqbpyylxjstldoj8jfjj",
    "ckxmsadfkyqfeunkkmiz",
    "tado2ljuq3erdjpjaj9h",
    "z8zgyd1vu7wcec0zya2j",
    "ztrn7n1urofua44usffv",
    "dta5dojhpsd6ffbutaqu",
    "dopvrrjyclsrkml45s1x",
    "rnfj5ybtygr7x1kpn6sd",
    "aaeldarepgbq0ipw57o7",
    "gmzsxl9baeibrx5s7nxr",
    "gww1rgrcz7jy4t7adhzy",
    "izn3vxie8ofrh7or8c5z",
    "yudyu2afcvxat5awgt9t",
    "auw6pxmdvgdr4e8tk3u1",
    "l3a8ud5bfmmb0c5m9xdd",
    "mvqjcvci3snvkqbapqvw",
    "psitrhskkt0gqpno7rgj",
    "l5xlxuavgayxgovjjptd",
    "xeaapevyxqbyxcifewb7",
    "kp9gilvyrc8xtb9vhsyd",
    "cld-sample-5",
    "accessories-bag",
    "leather-bag-gray",
    "shoes",
    "lm9qd0o6vloazrtkdv4t"
]

// coordinates boundaries for creating ads in batchImportAdsAndUsers 
// and for postAd in helpersAds
const LAT_BOUNDARIES = [45.50, 45.67];
const LNG_BOUNDARIES = [-73.9344, -73.3599];

// clothing categories object
const taxonomy = {
    "Women" : {
        "jackets and vests": {
            "parkas": {},
            "insulated and down": {},
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
            "insulated and down": {},
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
            "insulated and down": {},
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
const colors = ["black", "white", "red", "green", "blue", "yellow", "orange", "brown", "pink"];

// function generates random categories path for ads (like ",Men,Top,jackets,")
// for each ad we need to generate categories path 
// according to mongo Materialized Paths (https://www.mongodb.com/docs/manual/tutorial/model-tree-structures-with-materialized-paths/)

const makeRandomPath = (categoriesObj) => {
    if (Object.keys(categoriesObj).length === 0) {
        return ","
    } else {
        // getting random nested category
        // and adding it to the path
        const objKeysArr = Object.keys(categoriesObj);
        const randomKeyNum = Math.floor(Math.random() * objKeysArr.length);
        const randomCategory = Object.keys(categoriesObj)[randomKeyNum];
        return "," + randomCategory.toLowerCase() + makeRandomPath(categoriesObj[randomCategory])
    }
}

module.exports = {
    cloudinaryPicsArr,
    LAT_BOUNDARIES,
    LNG_BOUNDARIES,
    taxonomy,
    womenSizes,
    menSizes,
    kidsSizes,
    toddlersSizes,
    babySizes,
    colors,
    makeRandomPath
};