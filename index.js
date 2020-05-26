var express = require('express');
var app = express();
var pub = require('pug');
var path = require('path');
var api = require('./api.js');   // api requset route
var bp = require('body-parser');

// load environment variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// make static files public like scrip
app.use(express.static(path.join(__dirname, '/script')));

// post request pass json data so we most parse it
// body parser is used for these purposes
app.use(bp.json());  

app.listen(3001, ()=>{
    console.log("Server initialized...");
});

// routes for website showing locations
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.get('/', (req, resp)=>{
    console.log(req.ip);
    var key = process.env.GOOGLE_MAPS_API_KEY;
    resp.render('home', {key : 'https://maps.googleapis.com/maps/api/js?key=' + key +'&callback=initMap'});
});


// handle request for the API separate
app.use("/api", api);