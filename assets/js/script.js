const searchInput = document.querySelector('#search-input')
let map;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  
  map = new Map(document.getElementById("map"), {
    center: { lat: 0, lng: 0 },
    zoom: 2,
    MapId: '8e1d737c8c3da317',
  });
  
  // City auto-complete
  autocomplete = new google.maps.places.Autocomplete(searchInput, {
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
      new google.maps.Marker({
        map: map,
        position: results[0].geometry.location
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}