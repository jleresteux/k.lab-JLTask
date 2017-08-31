# k.lab-JLTask
K.lab Challenge

How to start
  install node js
  install package "Twit" from npm
  install MongoDB
  install ElasticSearch
  
  Launch mongod in your MongoDB folder using a terminal
  In terminal, navigate to where is situated server.js and launch it with command "node server.js"
  Launch your favorite browser and open page "localhost:8000"
  
  Once loaded, click displayed button
  
Design decision
    Front end is displayed by nodejs
    When search request is emitted, node connect to Tweeter API and collect datas which are stored in MongoDB database.
    Once finished, DB is accessed one more time to retrieve desired data and displayed on Front End.
    
    MongoDB is used because it is a very scalable db and nosql.
    In Front End, JQuery is used to send an Ajax request on the searching event.

