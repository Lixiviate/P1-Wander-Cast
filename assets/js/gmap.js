// Google Maps API secret
const googleMapsApiKey = 'AIzaSyBilrgRiv59bAFLwncacKtKSanLVkNmIEo';
// Selecting search input from DOM
const searchInput = document.querySelector("#search-input");
// Declare variables for Google Map and Places API
let autoComplete, map, infoWindow, placesService;

// Function to load the Google Maps API script
function loadGoogleMapsScript() {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&loading=async&libraries=places&callback=initMap`;
  script.defer = true;
  document.head.appendChild(script);
}

// Load the Google Maps script
loadGoogleMapsScript();

// Async function to initialize the map
async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  // Create Info Window to display restaurant info
  infoWindow = new google.maps.InfoWindow();

  // Display map as zoomed out on first load
  map = new Map(document.querySelector("#map"), {
    center: { lat: 0, lng: 0 },
    zoom: 2,
    mapId: "8e1d737c8c3da317",
  });

  // autocomplete for search input, restricted to cities only
  autoComplete = new google.maps.places.Autocomplete(searchInput, {
    types: ["(cities)"],
  });

  // Event listener to check for changed bounds in order to propagate restaurants when map is moved
  map.addListener("bounds_changed", function () {
    searchRestaurants(map.getCenter());
  });

  placesService = new google.maps.places.PlacesService(map);
}

// Search for a city and center the map on it
function searchCity(event) {
  event.preventDefault();
  const city = searchInput.value;
  const geocoder = new google.maps.Geocoder();

  // Geocoding the city name to get its location
  geocoder.geocode({ address: city }, function (results, status) {
    if (status === "OK") {
      map.setCenter(results[0].geometry.location);
      map.setZoom(15);
      searchRestaurants(results[0].geometry.location);
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });

  return false; // Prevent form submission
}

// Search for restaurants near a given location and create markers using the Places API
function searchRestaurants(location) {
  const request = {
    location: location,
    radius: "2500",
    types: ["bar", "cafe", "restaurant"],
  };

  placesService.nearbySearch(request, function (results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      results.forEach(createMarker);
    }
  });
}

// Create a marker on the map
function createMarker(place) {
  const markerIcon = {
    url: './assets/images/foodMarker.png', // URL of the icon image
    scaledSize: new google.maps.Size(32, 32) // Size of the icon (width, height)
  };
  const marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    icon: markerIcon,
    });

  // Add click event listener to display place details
  google.maps.event.addListener(marker, "click", function () {
    fetchPlaceDetails(place.place_id, marker);
  });
}

// Fetch and display details of a restaurant in an InfoWindow
function fetchPlaceDetails(placeId, marker) {
  const request = {
    placeId: placeId,
    fields: ["name", "vicinity", "photos"],
  };

  // Get details of the place using PlacesService and adding that content to the info window
  placesService.getDetails(request, function (place, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      const photoUrl =
        place.photos && place.photos.length > 0
          ? place.photos[0].getUrl()
          : "https://via.placeholder.com/150";
      const placeName = place.name.replace(/'/g, "");
      const placeVicinity = place.vicinity.replace(/'/g, "");
      const content = `<div style="color: black;">
        <strong style="color: black;">${placeName}</strong><br>
        <span style="color: black;">${placeVicinity}</span><br>
        <img src="${photoUrl}" alt="${placeName}" style="width:100px;height:100px;"><br>
        <button class="button is-primary is-small" onclick="saveToFavList('${placeName}', '${placeVicinity}')">Add to Favorites</button>
      </div>`;
      infoWindow.setContent(content);
      infoWindow.open(map, marker);
    }
  });
}

// Saves favorited restaurants to local storage
function saveToFavList(name, vicinity) {
  let favoriteListStorage = JSON.parse(localStorage.getItem("favorites")) || [];
  let favorite = { name: name, vicinity: vicinity };
  let alreadyFavorited = false;
  for (let i = 0; i < favoriteListStorage.length; i++) {
    if (
      favoriteListStorage[i].name === name &&
      favoriteListStorage[i].vicinity === vicinity
    ) {
      alreadyFavorited = true;
      break;
    }
  }

  if (!alreadyFavorited) {
    favoriteListStorage.push(favorite);
    localStorage.setItem("favorites", JSON.stringify(favoriteListStorage));
    alert("Restaurant added to favorites list!");
    renderRestaurantList(); // Update the list
  } else {
    alert("Restaurant already in favorites list!");
  }
}

// Delete restaurant from list
function deleteFromFavList(i) {
  let favoriteListStorage = JSON.parse(localStorage.getItem("favorites")) || [];
  favoriteListStorage.splice(i, 1);
  localStorage.setItem("favorites", JSON.stringify(favoriteListStorage));
  renderRestaurantList();
}

// Renders the favorite restaurant list
function renderRestaurantList() {
  let favoriteList = JSON.parse(localStorage.getItem("favorites")) || [];
  let listElement = document.querySelector("#favorite-restaurant-list");
  listElement.innerHTML = "";

  favoriteList.forEach(function (favorite, i) {
    let listItem = document.createElement("li");
    listItem.innerHTML = `${favorite.name} - ${favorite.vicinity} <button onclick="deleteFromFavList(${i})" class="button is-small is-danger">X</button>`;
    listElement.appendChild(listItem);
  });
}

// Clears all favorites restaurants from local storage
document.querySelector("#clear-restaurant-list").addEventListener("click", function clearRestaurantList() {
  localStorage.removeItem("favorites");
  renderRestaurantList();
});

// Search city on submit
document.querySelector("#input").addEventListener("submit", searchCity);

// Initialize map and render favorite list when page loads
renderRestaurantList();