var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


function getColor(depth) {
    if (depth < 10 ) {
        return "red"
     }
    else if (depth < 20 ) { 
      return "aqua"
    }
    else if (depth < 30 ) { 
      return "yellow"
    }
    else if (depth < 40 ) { 
      return "lightBlue"
    }
    else { 
        return "orange"
  }
}
// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
  console.log(data.features);
  // Using the features array sent back in the API data, create a GeoJSON layer and add it to the map
  var geoLayer = L.geoJSON(data.features,
    {
      onEachFeature: function(feature, layer) {
        layer.bindPopup(
          `<h2>Place :${feature.properties.place}<hr>Magnitude: ${feature.properties.mag} <hr>Date: ${feature.properties.time}</h2>`
        );
      },
      pointToLayer:function(feature,latlon){
          return L.circleMarker(latlon)
      },
      style: function(feature) {
          return {
              fillColor:getColor(feature.geometry.coordinates[2]),
              radius:feature.properties.mag*4,
              weight:0.5,
              color:"black"
          }
      }
    }
  );

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  var overlayMaps = {
    Earthquakes: geoLayer
  };

  // Create a new map
  myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, geoLayer]
  });

  // Create a layer control containing our baseMaps
  // Be sure to add an overlay Layer containing the earthquake GeoJSON
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Set up the legend
var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");

//var depth = [9,30,49,69,89,400]
var colors = ['red','aqua','yellow','lightBlue','orange','gold']
 var display = ['-10-10','10-30','30-50' ,'50-70', '70-90' ,'90+'  ];
var labels = [];

  var legendInfo = "<h1>Depth</h1>" 
   div.innerHTML = legendInfo;
   

  colors.forEach(function(color, index) {
   labels.push("<li style=\" list-style-type: none; padding : 5px 10px ;background-color: " + colors[index] + "\">"+ display[index]+"</li>");
   }); 

   div.innerHTML += "<ul>" + labels.join("") + "</ul>";
  return div;
 };

// // Adding legend to the map
 legend.addTo(myMap);

});