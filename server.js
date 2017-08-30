var http = require('http');  
var fs = require('fs'); //module to read html file
var Twit = require('twit'); //package to facilitate communication with Tweeter API
var config = require('./config'); //Tweeter account config file
var MongoClient = require('mongodb').MongoClient; //MongoDB module

var T = new Twit(config); //instantiating new Twit object for access to API

var tweets; //Data from Teeter
var params = { //parameters of the request to API
    q: '#meinunterricht', //request 
    count: 100 //number of results desired
}

function onRequest(request, response){ 
    if(request.url=='/search') { //if request is search
        search(retrieveData);    //launch search, if successful, launch retrieveData
    } else { //if url is default
        response.writeHead(200, {'Content-Type': 'text/html'}); //perpare to display html content 
        fs.readFile('./index.html', null, function(error, data){ //read read html file and get data
            if(error){ //if error 
                response.writeHead(404);
                response.write('File not found');
            } else { //if success 
                response.write(data); //display html file data
            }
        response.end(); //end editing html file
        });
    }



    function retrieveData(){ //retrieves data from DB and display it
        // Connect to the db
        MongoClient.connect("mongodb://localhost:27017/klab", function (err, db) { //connect to db klab
            if(err) { // error handling
                console.log("connect error");
                throw err;
            } else 
            {
                var collection = db.collection('Tweets', function (err, collection) { //get the collection "Tweets"

                collection.find().toArray(function(err, items) { //find all items in "Tweets" collection and parse it to an array
                    if(err) { // error handling
                        console.log("toArray error");
                        throw err;
                    } 
                    else { //if success
                        for(var i=0; i<items.length; i++){ //loop through array of items
                            //response.write(items[i]); //display data in html file
                        }
                        response.end(); //end file editing
                    }
                    });
                });
                 collection.remove(); //remove data from db (not needed anymore ones displayed)
            }
        });       
    }
}



function search(success){ //function launching the search
    console.log("System is on"); //for debug
    T.get('search/tweets', params, gotData); //get from Tweeter API data according to request parameters.
    success(true); //retrun true to launch the callback function 
}

function gotData(err, data, response) { //callback function handling data from Teeter API
    tweets = data.statuses; //keep the statuses
    
    // Create/Connect to the db "klab"
    MongoClient.connect("mongodb://localhost:27017/klab", function (err, db) {
        if(err) { //error handling
            console.log("connect error");
            throw err;
        } else 
        {
            console.log("db connected"); //for debug
            var collection = db.collection('Tweets'); //create or select the "Tweets" collection

            for(var i=0; i<tweets.length; i++){ //loop through tweets and insert in collection the desired fields
                collection.insert({text: tweets[i].text}); //actual tweet
                collection.insert({created: tweets[i].created_at}); //date of posting
                collection.insert({id: tweets[i].id}); //id of post
                collection.insert({user: tweets[i].user}); //id of post
            }
            
            db.collection('Tweets').count(function (err, count) { //count the total rows of collection
            if (err) {
                console.log("count error");
                throw err;
            }

            console.log('Total Rows: ' + count); //for debug
            });
        }
    });
}

http.createServer(onRequest).listen(8000); //Creating node server and listening to port 8000 -> connect to localhost:8000 to proceed
                                            //if a request is sent, onRequest is launched