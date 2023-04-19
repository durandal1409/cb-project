'use strict';

const express = require('express');
const morgan = require('morgan');

const { getCategories } = require("./helpers/helpersCategories");
const {
  getSearchedAds,
  getRecommended,
  getLatest,
  // getFiltered,
  getSimilar,
  getAd,
  postAd,
  updateAd,
  deleteAd
} = require("./helpers/helpersAds");
const {
  getUserAndAds,
  addUser,
  updateUser
} = require("./helpers/helpersUsers");

require("dotenv").config();
const port = process.env.PORT || 8000;



express()
  .use(function(req, res, next) {
    res.header(
      'Access-Control-Allow-Methods',
      'OPTIONS, HEAD, GET, PUT, POST, DELETE'
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  })
  .use(morgan('tiny'))
  .use(express.static('./server/assets'))
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use('/', express.static(__dirname + '/'))
  .use(cors())

  .get("/api/categories", getCategories)
  .get("/api/ads/search/:userId", getSearchedAds)
  .get("/api/ads/recommended/:userId", getRecommended)
  .get("/api/ads/latest", getLatest)
  // .get("/api/ads/filtered", getFiltered)
  .get("/api/ads/similar/:path/:coordinates", getSimilar)
  .get("/api/ads/:adId", getAd)
  .get("/api/users/:userId", getUserAndAds)
  .post("/api/users", addUser)
  .patch("/api/users", updateUser)
  .post("/api/ads", postAd)
  .patch("/api/ads", updateAd)
  .delete("/api/ads", deleteAd)


  
  // this is our catch all endpoint.
  .get("*", (req, res) => {
    res.status(404).json({
    status: 404,
    message: "This is obviously not what you are looking for.",
    });
  })

  .listen(port, () => console.info(`Listening on port ${port}`));
