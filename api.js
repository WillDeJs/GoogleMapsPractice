var express = require('express');
var api = express();
var sqlite = require('sqlite3');
var db = new sqlite.Database(__dirname + '/db/placesdb.db');
var http = require('https');

// load environment variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
// acccess google geo coding api
class GoogleGeoCoding {
    constructor(key) {
        this.apikey = key;
    }
    
    getGeoCodedAddres(address){
        let result = {success:false, data:[]}
        let request = 'https://maps.googleapis.com/maps/api/geocode/json?new_forward_geocoder=true&address=' + address.replace(/\s/g,"+") + '&key=' + this.apikey;

        let requestCAll = new Promise((resolve, reject)=>{
            http.get(request, (res)=>{
                let data = "";
                res.on('data', (chunk)=>{
                    data+=chunk;
                });
                res.on('end', ()=>{
                    resolve(JSON.parse(data))
                });
            }).on('error', function(error){
                reject({success:false,data:[]})
            });
        });
        return requestCAll; 
    }
}

var google = new GoogleGeoCoding(process.env.GOOGLE_MAPS_API_KEY);

api.get('/', (req, resp)=>{
    db.get('SELECT * FROM PLACES WHERE NAME = ?', [req.query.name], (error, rows)=> {
        if(error) {
            resp.status(500).json({
                success:false,
                data:[]
            })
        } else {
            resp.status(200).json(
                {
                    sucess: true,
                    data:rows
                }
            );
        }
    });
});


api.get('/all', (req, resp)=>{
    db.all('SELECT * FROM PLACES', [], (error, rows)=> {
        if(error) {
            resp.status(500).json({
                success:false,
                data:[]
            })
        } else {
            resp.status(200).json(
                {
                    sucess: true,
                    data:rows
                }
            );
        }
    });
});


// handle POST requests
api.post('/', async (req, resp) => {
    if (!req.body) {
        resp.status(400).json({
            success: false,
            data: "No data passed loading"
        })
    } else {
        try {
            var message = await insertToDatabase(req.body);
            resp.status(200).json(JSON.stringify(message));
        } catch(error) {
            resp.status(200).json(JSON.stringify(error));
        }
    }
})


async function insertToDatabase(body) {
    let promise = new Promise(async (resolve, reject)=>{
        try {
            var geoLoc = await google.getGeoCodedAddres(body.address);
            if (geoLoc.status !== 'OK') {
                return {success:false, data:"Invalid address"};
            } 
            db.run('INSERT INTO PLACES ( NAME, LATITUDE, LONGITUDE, ADDRESS) VALUES (?, ?, ?, ?)', 
                    [body.name, geoLoc.results[0].geometry.location.lat, geoLoc.results[0].geometry.location.lng, geoLoc.results[0].formatted_address],
                    (error) => {
                if (error){
                    if (error.errno === 19)
                        reject({sucess:false, data:"Entry already exists"});
                    else
                        reject({success:false, data:"Cannot commit entry, Server error"});
                } else {
                    resolve({success:true, data:"Updated successful"});
                }
            });
        } catch(err){
            reject({success:false, data:err});
        }
    })

    return promise;
    
}

// export router so its usable from 'require'
module.exports = api;