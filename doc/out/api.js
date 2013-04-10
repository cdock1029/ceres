YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [],
    "modules": [
        "index.js",
        "insert"
    ],
    "allModules": [
        {
            "displayName": "index.js",
            "name": "index.js",
            "description": "This is the main class in the CERES application. From here the program initializes\nthe server, router and start listening for requests for the server."
        },
        {
            "displayName": "insert",
            "name": "insert",
            "description": "INSERT FUNCTION\nThis function calls the mongo database to insert the data and timestamp\nparameter. It also add a server utc to record when the data was inserted\ninto the database."
        }
    ]
} };
});