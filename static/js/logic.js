// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
//var tectonicPlates = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json"
// d3.json(tectonicPlates, function(faultlines)

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
  console.log(data);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>Earthquake:" + feature.properties.place +
      "</h3><hr><p>Date/Time:" + new Date(feature.properties.time) +
       "</p><hr><p>Magnitude:" + (feature.properties.mag) + 
       "</p><hr><p>Coordinates:" + (feature.geometry.coordinates) + "</p>") // not too sure about this one
  }
  
 
  function circleSize(mag) {
    if (mag <= 1) {
        return(4);
    } else if ((mag > 1) && (mag <= 2)) {
        return(8);
    } else if ((mag > 2) && (mag <= 3)) {
        return(12);
    } else if ((mag > 3) && (mag <= 4)) {
        return(16);
    } else if ((mag > 4) && (mag <= 5)) {
        return(20);
    } else {
        return(24);
    };
  }
 
  function circleColor(mag) {
  if (mag <= 1) {
    return("#f8fc0c");
} else if ((mag > 1) && (mag <= 2)) {
    return("#f9ed0b");
} else if ((mag > 2) && (mag <= 3)) {
    return("#fbd309");
} else if ((mag > 3) && (mag <= 4)) {
    return("#fab508");
} else if ((mag > 4) && (mag <= 5)) {
    return("#f99c08");
} else {
    return("#f78e08");
};
}

  function createCircleMarkers(feature, latlng) {
    return new L.CircleMarker(latlng, {
        radius: circleSize(feature.properties.mag),
        color: circleColor(feature.properties.mag),
        fillOpacity: 0.75
    });
}
  
   // Create a GeoJSON layer containing the features for earthquakeData 
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: createCircleMarkers
  // var earthquakes = L.geoJSON(earthquakeData, {
  //   onEachFeature: oneEachFeature,
  //   pointToLayer: createCircleMarkers
  // });

});

  createMap(earthquakes);
}

function createMap(earthquakes) {
//STOP
  // Define map layers
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

  var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
   });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
    "Satellite": satellite,
    };;

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 3,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control , to pass baseMaps and overlayMaps
 
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  
 
//Create and add legend
var legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  var limits = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
  var colors = ["#f8fc0c","#f9ed0b", "#fbd309", "#fab508","#f99c08", "#f78e08"];
  var labels = [];
  

    // Add min & max
    var legendInfo = "<h3>Earthquake Magnitude</h3>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  legend.addTo(myMap);

};

 // //Create and add legend
  // var legend = L.control({ position: "bottomright" });
  // legend.onAdd = function() {
  //   var div = L.DomUtil.create("div", "info legend");
  //   var limits = [1,2,3,4,5];
  //   var colors = ["green","blue", "red", "yellow"];
  //   var labels = ["1", "2", "3", "4", "5>"];


// will need to style the divs to make inline will need a class style for div
// <li><div style= background-color:color></div><div>limit[index], limit[index + 1]</div>"
    // colors.forEach(function(color, index) {
    //   labels.push("<li><div style=\"background-color: " + color + "\">"+ limits[index] + "</li>");
    // });
  //   colors.forEach(function(color, index) {
  //     labels.push(`<li><div style= "background-color:${color};display:'inline-block';height:75px; width:50px"></div><div>${limits[index]}, limit[index + 1]</div>`);
  //   });

  //   div.innerHTML += "<ul>" + labels.join("") + "</ul>";
  //   return div;
  // };

  // Adding legend to the map
  


// var earthquakes =L.geoJson(earthquakeData, {
    //   pointToLayer: function (latlng) {
    //     return L.circleMarker(latlng, earthquakeData);
    //     }
      
    // })
  //     onEachFeature: onEachFeature,
  //   })
  // var earthquakes = L.geoJSON(earthquakeData, {
  //   pointToLayer: function (feature.geometry.coordinates) {
  //     return L.circleMarker(latlng, earthquakeData)
  // //   onEachFeature: onEachFeature,
  // //   pointToLayer:createCircleLayer

  // });

    // Sending our earthquakes layer to the createMap function
//    createMap(earthquakes);

// // new GeoJson layer for earthquake array
  //function createCircleLayer() { 
//   return {
  
  // var createCircleLayer = L.circle(feature, coordinate)
  //   radius: feature.properties.mag * 5,
  //   fillColor: chooseColor,
  //   color: chooseColor,
  //   weight: 1,
  //   opacity: 1,
  //   fillOpacity: 0.5
  //  }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array