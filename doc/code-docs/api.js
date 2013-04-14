YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "oauth",
        "server"
    ],
    "modules": [
        "del",
        "deleteAll",
        "errcode",
        "get",
        "index.js",
        "insert.js",
        "load-oauth-secrets",
        "populate-oauth-secrets",
        "queryValidation",
        "requestHandler",
        "router",
        "update"
    ],
    "allModules": [
        {
            "displayName": "del",
            "name": "del",
            "description": "Delete function</br>\nPurpose: This method is to delete a single record from\nthe database based on the object id passed to it. This function\nconnects to the database through mongoClient."
        },
        {
            "displayName": "deleteAll",
            "name": "deleteAll",
            "description": "Delete ALL function</br>\nPurpose: This method is to delete all the records from\nthe database. This function connects to the database through mongoClient."
        },
        {
            "displayName": "errcode",
            "name": "errcode",
            "description": "This file defines mappings between the internal error codes used by this application \nand the respective messages and status codes. This file should reflect tables \n6 and 7 in the API document."
        },
        {
            "displayName": "get",
            "name": "get",
            "description": "Get function</br>\nPurpose: This method is for retrieving a record from\nthe database that matches the query(i.e. expression). This function\nconnects to the database through mongoClient."
        },
        {
            "displayName": "index.js",
            "name": "index.js",
            "description": "Main class of the CERES application. From here the program initializes\nthe server, router, loads O-AUTH secrets and start listening for requests.\nStarting index.js starts up the node server as per the node_config file and \nconnects to the database based on the mongo_config file."
        },
        {
            "displayName": "insert.js",
            "name": "insert.js",
            "description": "Insert function</br>\nPurpose: This method is for inserting a record into\nthe database. This function\nconnects to the database through mongoClient."
        },
        {
            "displayName": "load-oauth-secrets",
            "name": "load-oauth-secrets",
            "description": "Loads OAuth secrets from the mongo collection specified in the \noauth_collection variable of the ../config/mongodb.json config file.\nThis should be called by index.js."
        },
        {
            "displayName": "populate-oauth-secrets",
            "name": "populate-oauth-secrets",
            "description": "Loads OAuth consumer keys and secrets into MongoDB.\nThey will be loaded into the collection specified as the oauth_collection in the mongodb.json config file.\nThis will REPLACE all oauth secrets in Mongo.\nThe oauth secrets are loaded from the file config/oauth-secrets.json .  After this script is executed, the oauth secrets in this file will\nbe the ONLY oauth secrets stored in Mongo.\n\nTo run, put all of the keys that you want in the db into the config file mentioned above and run:\n$ node populate-oauth-secrets.js"
        },
        {
            "displayName": "queryValidation",
            "name": "queryValidation",
            "description": "NOTE: This function is to be inplemted by the user to verify that the data\nfits the schema for this application.</br>\nPurpose: This method is to validate the data and return boolean."
        },
        {
            "displayName": "requestHandler",
            "name": "requestHandler",
            "description": "This is the main program that accepts client requests and call other functions."
        },
        {
            "displayName": "router",
            "name": "router",
            "description": "Used to route the requests to the specified call."
        },
        {
            "displayName": "update",
            "name": "update",
            "description": "Insert function</br>\nPurpose: This method is to update an existing record in \nthe database using the object id. This function\nconnects to the database through mongoClient."
        }
    ]
} };
});