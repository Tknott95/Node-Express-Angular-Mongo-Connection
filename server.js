var http = require('http');
var path = require ('path');
var express = require('express');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var $ = require('jquery');

var router = express();

// ng route
router.use(express.static(path.resolve(__dirname, 'frontend/dist')));
router.use(bodyParser.json());

// db
var LOCALEVENTS_POSTS_COLLECTION = 'posts'; // collection name
var LOCALEVENTS_CATEGORIES_COLLECTION = 'categories'; // collection name
var dbURI = 'mongodb://localhost:27017/nodeblog'; // db name
var db;
mongodb.MongoClient.connect(dbURI, function(err, database) {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    // save database object for resuse
    db = database;
    console.log("DB connection ready");
});

// Start server
var server = http.createServer(router);
server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
    var addr = server.address();
    console.log("Frontend server listening at", addr.address + ":" + addr.port);
});

// api routes
// error handler
function handleError(res, reason, message, code) {
    console.log("Error: " + reason);
    res.status(code || 500).json({"error": message});
}

router.get("api/nodeblog", function(req, res) {
    db.collection(LOCALEVENTS_POSTS_COLLECTION).find({}).toArray(function(err, docs) {
        if (err) {
            handleError(res, err.message, "Failed to get POSTS");
        } else {
            res.status(200).json(docs);
        }
    });
    db.collection(LOCALEVENTS_CATEGORIES_COLLECTION).find({}).toArray(function(err, docs) {
        if (err) {
            handleError(res, err.message, "Failed to get CATEGORIES");
        } else {
            res.status(200).json(docs);
        }
    });
});
