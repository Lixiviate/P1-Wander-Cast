// Selecting search input from DOM
const searchInput = document.querySelector('#search-input');
// Declare variables
let autoComplete;
let map;
let infoWindow;
let placesService;

// Async function to initialize the map
async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  // Create Info Window to display restaurant info
  infoWindow = new google.maps.InfoWindow();

  // Display map as zoomed out on first load
  map = new Map(document.querySelector("#map"), {
    center: { lat: 0, lng: 0 },
    zoom: 2,
    MapId: '8e1d737c8c3da317',
  });

  // autocomplete for search input, restricted to cities only
  autoComplete = new google.maps.places.Autocomplete(searchInput, {
    types: ['(cities)']
  });
}

// Search for a city and center the map on it
function searchCity(event) {
  event.preventDefault();
  const city = searchInput.value;
  const geocoder = new google.maps.Geocoder();

  // Geocoding the city name to get its location
  geocoder.geocode({ address: city }, function(results, status) {
    if (status === 'OK') {
      map.setCenter(results[0].geometry.location);
      map.setZoom(15);
      searchRestaurants(results[0].geometry.location);
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });

  return false; // Unknown if needed??
}

// Search for restaurants near a given location and create markers using the Places API
function searchRestaurants(location) {
  const request = {
    location: location,
    radius: '1500',
    type: ['restaurant']
  };

  placesService = new google.maps.places.PlacesService(map);
  placesService.nearbySearch(request, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (let i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }
    }
  });
}

// Create a marker on the map
function createMarker(place) {
  const marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
  });

  // Add click event listener to display place details
  google.maps.event.addListener(marker, 'click', function() {
    fetchPlaceDetails(place.place_id, marker);
  });
}

// Fetch and display details of a restaurant in an InfoWindow
function fetchPlaceDetails(placeId, marker) {
  const request = {
    placeId: placeId,
    fields: ['name', 'vicinity', 'photos']
  };

  // Get details of the place using PlacesService and adding that content to the info window
  placesService.getDetails(request, function(place, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      const photoUrl = place.photos[0].getUrl();
      const placeName = place.name;
      const placeVicinity = place.vicinity;
      const content = `<div style="color: black;">
        <strong style="color: black;">${placeName}</strong><br>
        <span style="color: black;">${placeVicinity}</span><br>
        <img src="${photoUrl}" alt="${placeName}" style="width:100px;height:100px;"><br>
        <button class="button is-primary is-small" onclick="saveToFavorites('${placeName}', '${placeVicinity}')">Add to Favorites</button>
      </div>`;
      infoWindow.setContent(content);
      infoWindow.open(map, marker);
    }
  });
}