'use strict';

const express = require('express');
const morgan = require('morgan');

const {
  getBigCategories,
  getSubcategories,
  getSearchedAds,
  getSizes,
  getRecommended,
  getLatest,
  getFiltered,
  getSimilar,
  getAd,
  getUser,
  postAd,
  updateAd,
  deleteAd
} = require("./helpers");

const PORT = 8000;



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

  .get("/api/big-categories", getBigCategories)
  .get("/api/subcategories", getSubcategories)
  .get("/api/ads/search", getSearchedAds)
  .get("/api/sizes", getSizes)
  .get("/api/ads/recommended/:userId", getRecommended)
  .get("/api/ads/latest", getLatest)
  .get("/api/ads/filtered", getFiltered)
  .get("/api/ads/similar", getSimilar)
  .get("/api/ads/:adId", getAd)
  .get("/api/users/:userI d", getUser)
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

  .listen(PORT, () => console.info(`Listening on port ${PORT}`));
