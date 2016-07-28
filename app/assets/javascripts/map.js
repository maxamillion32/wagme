// defaults set here

your_location_label = 'You are here!'
// if the user doesn't allow location access, where do we center?
default_center = {lat: 42.360, lng: -71.062} // center on Boston

initial_map_zoom_level = 15 // the higher the number the closer you are

search_radius = 1800 // search nearby places within 2000 meters
// see google places api doc for legal "types"
// for instance cafe, zoo, pet_store, school
search_for_type = 'park' // search for google type of "park"
search_for_other_type = 'school' // search for google type of "park"




// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.

var pos
var infoWindow
var map

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: default_center,
    zoom: initial_map_zoom_level
  });
  infoWindow = new google.maps.InfoWindow({map: map});

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent(your_location_label);
      map.setCenter(pos);
      var service = new google.maps.places.PlacesService(map);
      // search for places twice
      service.nearbySearch({
        location: pos,
        radius: search_radius,
       type: [search_for_type]
      }, callback);
      service.nearbySearch({
        location: pos,
        radius: search_radius,
       type: [search_for_other_type]
      }, callback);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  }
  // this function is called via callback when the nearby locations are found
  function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }
    }
  }

  function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
    //  infoWindow.setContent(place.name);

      var contentString = '<div id="content">'+
         '<div id="siteNotice"></div>'+
         '<h4 id="firstHeading" class="firstHeading">' + place.name + '</h4>'+
         '<div id="bodyContent">'+ place.vicinity +
         '<br><b><a href="http://localhost:3000/changeThisToRouteName?place=' + place.name +
         '\&lat=' + place.geometry.location.lat() + '\&lng=' + place.geometry.location.lng() +
         '\&place_id=' + place.place_id + '\&vicinity=' + place.vicinity +
          '">' +
         'Make a meetup now! </a></b>'+
         '</div>';

      infoWindow.setContent(contentString)
      infoWindow.open(map, this);
    });
  }