// Here is where we declare the consts to be used in the functions
const apiKey = "4e1cc60636288c88c655b17fbd084dcc"
const mainUrl = "https://api.openweathermap.org";
const cityEntered = document.getElementById("cityName");
const appendSearch = document.getElementById("appendSearch");
const searchButton = document.getElementById("searchButton");
const mainElement = document.querySelector('main');
// Created an empty array to fill the search history with city names in function saveCityNameandDisplay
let savedSearch = []; 
// Created an empty array to fill the lat and log coordinates from the city api information in function getCityWeather
let apiData = [];

// Saving the searched cities in local storage, so when the user refreshes or comes back to the page later, they do not have to
// re-enter the city names
window.onload = function() {
  const savedSearchJSON = localStorage.getItem("savedSearch");
  if (savedSearchJSON) {
    savedSearch = JSON.parse(savedSearchJSON);
    savedSearch.forEach(cityName => {
      displaySavedCity(cityName); 
    });
  }
};

// A function to grab user's input and create a button with the inputted text(cityname) and populate it as a button under the search 
// button, therefore user can click on the cityname button to look for weather information later
function displaySavedCity(cityName) {
  const displayArea = document.createElement("div"); // Creating a display area for the search buttons
  const cityButton = document.createElement("button"); // Creating buttons with the entered city name as text inside the button
  cityButton.textContent = cityName;
  // Setting attributes for the city name buttons
  cityButton.setAttribute('type', 'button');
  cityButton.setAttribute('class', 'btn-info cityButton')
  cityButton.setAttribute('id', cityName);
  displayArea.append(cityButton);
  appendSearch.append(displayArea);

  // Adding an event listener for the city name buttons, so that user can search for the weather data again 
  cityButton.addEventListener('click', function (event) {
    event.preventDefault();
    getCityApi(cityName); // Pass the city name to getCityApi function
  });
}

// A function to save the user inputted city name and store it in the local storage for use later
function saveCityNameandDisplay() {
  const searchText = cityEntered.value.trim();

  if (!searchText) {
    alert("Please enter a city name");
    return;
  }

  // Check if the city is already saved and alert the user if it is not already entered
  if (savedSearch.includes(searchText)) {
    alert(
      "Entered city is already in search history. Please select it from the history."
    );
    return;
  }

  // Add the city to the savedSearch array
  savedSearch.push(searchText);

  // Store the saved search in localStorage
  localStorage.setItem("savedSearch", JSON.stringify(savedSearch));

  // Display the saved search
  displaySavedCity(searchText);
  // Clears the input text from the search box
  cityEntered.value = "";
}

// A function to pull Lat and Lon of the city entered in the search box using WeatherAPI
function getCityApi(cityName) {
  let url = `${mainUrl}/data/2.5/forecast?cnt=1&q=${cityName}&appid=${apiKey}`;

  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      localStorage.setItem("forecast", JSON.stringify(data));
      apiData.push(data);
      const location = data.city.coord; // This is where the city coordinates are stored
      return location;
    })
    .then(function(location) {
      getCityWeather(location); // Passing the coordinates to getCityWeather function
      get5DayForecast(location); // Passing the coordinates to get5DayForecast function
    })
    // Alert user if there is an error retrieving forecast data from WeatherAPI
    .catch(function(error) {
      alert('Error fetching data');
    });
}

// A function to pull today's forecast then dynamically display it on the page for the user
function getCityWeather(coords) {
  let urlLatLon = `${mainUrl}/data/2.5/forecast?cnt=1&units=imperial&lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}`;
  fetch(urlLatLon)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const temp = data.list[0].main.temp; // Get temperature
      const iconCode = data.list[0].weather[0].icon; // Get icon code
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`; // Get icon image
      const humidity = data.list[0].main.humidity; // Get humidity
      const wind = data.list[0].wind.speed; // Get wind speed
      const cityName = data.city.name; // Get city name
      const date = data.list[0].dt_txt; // Get the date

      // Remove if the page is already populated with previous city forecast
      const toRemove = document.getElementById("bodyDivClass");

      if (toRemove != null) {
        toRemove.remove();
      }

      // Create elements and set attributes dynamically to display on the page
      const mainDiv = document.createElement("div");
      const secondDiv = document.createElement("div");
      const bodyDiv = document.createElement("div");
      bodyDiv.setAttribute("id", "bodyDivClass");
      bodyDiv.setAttribute('class', "today card bg-light ");
      const mainDivHeader = document.createElement('h2');
      mainDivHeader.textContent = ("Current Weather");

      const cityHeader = document.createElement("h2"); // Create cityheader element
      const iconImage = document.createElement("img"); // Create iconimage element
      const tempHeader = document.createElement("p");  // Create temperatureheader element
      const humidHeader = document.createElement("p"); // Create humidityheader element
      const windHeader = document.createElement("p");  // Create windheader element
      const dateHeader = document.createElement("h2"); // Create dateHeader element

      // Format the date
      const dateFormatted = dayjs(date).format("MM/DD/YYYY");
      dateHeader.textContent = dateFormatted; // Set the formatted date

      cityHeader.textContent = `${cityName}`; // Set text content of cityheader
      tempHeader.textContent = `Temp: ${temp} °F`; // Set text content of temperatureheader
      iconImage.src = iconUrl; // Retrieve the image URL
      iconImage.alt = "Weather Icon"; // Set the icon as image
      humidHeader.textContent = `Humidity: ${humidity} % `; // Set the text content of humidityheader
      windHeader.textContent = `Wind Speed: ${wind} mph`; // Set the text content of windheader

      // Append appropriate element to their belonging divs and main element in the HTML
      mainDiv.append(secondDiv);
      secondDiv.append(bodyDiv);
      bodyDiv.append(dateHeader, cityHeader, iconImage, tempHeader, humidHeader, windHeader);
      mainElement.appendChild(bodyDiv);
    });
}

// A function to pull 5 days forecast after today's date then dynamically display it on the page for the user
function get5DayForecast(coords) {
  let urlLatLon = `${mainUrl}/data/2.5/forecast?&units=imperial&lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}`; 
  fetch(urlLatLon)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      cityData = data;

      // Remove if 5 day forecast container is already populated
      const toRemove = document.getElementById("containerDiv");

      if (toRemove != null) {
        toRemove.remove();
      }

      // Create the card header and set the text content
      const header = document.createElement("h2");
      header.setAttribute('id', 'sticky-top');
      header.textContent = "5-Day Forecast";

      const container = document.createElement("div");
      container.setAttribute("id", "containerDiv");
      container.setAttribute("class", "container-Div justify-space-between");

      // Append header to the container
      container.appendChild(header);

      // Create a div to hold forecast cards
      const forecastContainer = document.createElement("div");
      forecastContainer.classList.add("forecast-container"); // Add class for styling
      container.appendChild(forecastContainer);
      
      // Crate a different card for each date after today's date at 12:00:00 weather forecast information
      for (var i = 1, len = data.list.length; i < len; i++) {
        const temp = data.list[i].main.temp; // Get temperature
        const iconCode = data.list[i].weather[0].icon; // Get icon code
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`; // Get icon image
        const humidity = data.list[i].main.humidity; // Get humidity
        const wind = data.list[i].wind.speed; // Get wind speed
        const date = data.list[i].dt_txt; // Get the date

        
        if (data.list[i].dt_txt.includes(`12:00:00`)) {
          const mainDiv = document.createElement("div"); // Create mainDiv element and set attribute
          mainDiv.setAttribute('class' ,"forecast-card"); 
          const dateHeader = document.createElement("h2"); // Create dateHeader element and set attribute
          dateHeader.setAttribute('class', 'date-header');
          const iconImage = document.createElement("img"); // Create iconimage element
          const tempHeader = document.createElement("p"); // Create temperatureheader element
          const humidHeader = document.createElement("p"); // Create humidityheader element
          const windHeader = document.createElement("p"); // Create windheader element
          // Format the date
          const dateFormatted = dayjs(date).format("MM/DD/YYYY");// Create dateHeader element
          dateHeader.textContent = dateFormatted;// Set the formatted date
          tempHeader.textContent = `Temp: ${temp} °F`; // Set text content of temperatureheader
          iconImage.src = iconUrl; // Retrieve the image URL
          iconImage.alt = "Weather Icon";// Set the icon as image
          humidHeader.textContent = `Humidity: ${humidity} % `; // Set the text content of humidityheader
          windHeader.textContent = `Wind Speed: ${wind} mph`; // Set the text content of windheader
          // Append appropriate elements to mainDiv
          mainDiv.append(dateHeader, iconImage, tempHeader, humidHeader, windHeader);

          // Append each forecast card to the forecast container
          forecastContainer.appendChild(mainDiv);
        }
      }

      // Append the container to the body
      document.body.appendChild(container);
    });
}

// An event listener for the search button to get information from WeatherAPI forecast data
searchButton.addEventListener("click", function (event) {
  event.preventDefault();
  getCityApi(cityEntered.value);
  saveCityNameandDisplay();   
});