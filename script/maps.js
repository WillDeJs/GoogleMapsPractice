var mymap;
// Attach your callback function to the `window` object
window.initMap = async function() {
    var location = new google.maps.LatLng(40.74, -73.98);

    mymap = new google.maps.Map(document.getElementById('map'), {
        center: location,
        zoom: 11,

        // hide the satelite and map buttons
        mapTypeControlOptions:{
            mapTypeIds:[null]
        },
        styles: [

            // hide business and transit
            {featureType: 'poi.business',stylers: [{visibility: 'off'}]},
            {featureType:'transit', stylers: [{ visibility: 'off' }]},
            {featureType:'transit.station',stylers: [{ visibility: 'off' }]},

            // Customize colors, aim for something lighter and bluish
            {elementType: 'geometry', stylers: [{color: '#f0f0f0'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#ffffff'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#0695c4'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#000000'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#005f5d'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#aff3d7'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#ffffff'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#ffffff'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#01adef'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#73d3f0'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ]
    });
    var res = await fetch('/api/all', {method:'GET'});
   
    var data = await res.json();
    console.log(data);
    for (var location of data.data){
        new google.maps.Marker({
            position:new google.maps.LatLng(location.latitude, location.longitude),
            map: mymap,
            label:location.name,
            // icon:'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        });
    }
};

var form = document.querySelector('form');

form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    var address = document.getElementById('addressinput').value;
    var name = document.getElementById('nameinput').value;
    if (address.trim()==='' || name.trim() === '' ) {
        alert('Please complete all fields');
        return;
    }
    var request = {'name': name, 'address':address};
    var res = await fetch('/api', {
        'method' : 'POST',
        'headers' :{'Content-Type' : 'application/json',},
        'body': JSON.stringify(request)
    });
    var response = await res.json();
    window.location.href="/";
    console.log(response);
})
