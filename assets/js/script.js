const searchInput = document.querySelector('#search-input')
let autoComplete;
let map;
let infoWindow;
let placesService;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  infoWindow = new google.maps.InfoWindow();

  map = new Map(document.querySelector("#map"), {
    center: { lat: 0, lng: 0 },
    zoom: 2,
    MapId: '8e1d737c8c3da317',
  });
  
  // City auto-complete within search-input
  autoComplete = new google.maps.places.Autocomplete(searchInput, {
    types: ['(cities)']
  });
}

function searchCity(event) {
  event.preventDefault();
  const city = document.getElementById('search-input').value;
  const geocoder = new google.maps.Geocoder();

  geocoder.geocode({ address: city }, function(results, status) {
    if (status === 'OK') {
      map.setCenter(results[0].geometry.location);
      map.setZoom(15);
      searchRestaurants(results[0].geometry.location);
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });

  return false;
}

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

function createMarker(place) {
  const marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
  });

  google.maps.event.addListener(marker, 'click', function() {
    fetchPlaceDetails(place.place_id, marker);
  });
}

function fetchPlaceDetails(placeId, marker) {
  const request = {
    placeId: placeId,
    fields: ['name', 'vicinity', 'photos']
  };

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