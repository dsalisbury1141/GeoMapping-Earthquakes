//API for all EQ https://www.usgs.gov/natural-hazards/earthquake-hazards/earthquakes

// Store our API endpoint inside queryUrl
var EQUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the EQUrl
d3.json(EQUrl,function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
  console.log(data);
});


  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>Earthquake:" + feature.properties.place +
      "</h3><hr><p>Date/Time:" + new Date(feature.properties.time) +
       "</p><hr><p>Magnitude:" + (feature.properties.mag) + 
       "</p><hr><p>Coordinates:" + (feature.geometry.coordinates) + "</p>") // not too sure about this one
  }
  
    
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
  
});

  createMap(earthquakes);
}

function createMap(earthquakes) {

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
    Earthquakes: earthquakes,
    //Faultlines: tectonicPlates

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
var tectonicUrl = "https://https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";
//   // d3.json(tectonicPlates, function(faultlines)
  
//Perform a GET request to the titonicURL
d3.json(tectonicUrl,function(plateData) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(plateData.features);
  console.log(plateData);
});

d3.json(EQUrl,function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
  console.log(data);
});

// var tectonicPlates = L.geoJSON(plateData, {
//   color: "orange", 
//   weight: 3
// })

// tectonicPlates.addTo(map)