
let apiData = [];
const mainUrl = "https://api.openweathermap.org";
const cityEntered = document.getElementById("cityName");
const appendSearch = document.getElementById("appendSearch");
const searchButton = document.getElementById("searchButton");
const mainElement = document.querySelector('main');
let savedSearch = []; 

window.onload = function() {
  const savedSearchJSON = localStorage.getItem("savedSearch");
  if (savedSearchJSON) {
    savedSearch = JSON.parse(savedSearchJSON);
    savedSearch.forEach(cityName => {
      displaySavedCity(cityName);
    });
  }
};

function displaySavedCity(cityName) {
  const displayArea = document.createElement("div");
  const cityButton = document.createElement("button");
  cityButton.textContent = cityName;
  cityButton.setAttribute('type', 'button');
  cityButton.setAttribute('class', 'btn-info cityButton')
  cityButton.setAttribute('id', cityName);
  displayArea.append(cityButton);
  appendSearch.append(displayArea);

  cityButton.addEventListener('click', function (event) {
    event.preventDefault();
    getCityApi(cityName); // Pass the city name to getCityApi function
  });
}

function saveCityNameandDisplay() {
  const searchText = cityEntered.value.trim();

  if (!searchText) {
    alert("Please enter a city name");
    return;
  }

  // Check if the city is already saved
  if (savedSearch.includes(searchText)) {
    alert(
      "Entered city is already in search history. Please select it from the history."
    );
    return;
  }

  // Add the city to the saved search
  savedSearch.push(searchText);

  // Store the saved search in localStorage
  localStorage.setItem("savedSearch", JSON.stringify(savedSearch));

  // Display the saved search
  displaySavedCity(searchText);

  cityEntered.value = "";
}

// Using weather API to pull Lat and Lon of the city entered in the search box
function getCityApi(cityName) {
  let url = `${mainUrl}/data/2.5/forecast?cnt=1&q=${cityName}&appid=${apiKey}`;

  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      localStorage.setItem("forecast", JSON.stringify(data));
      apiData.push(data);
      const location = data.city.coord;
      return location;
    })
    .then(function(location) {
      getCityWeather(location);
      get5DayForecast(location);
    })
    .catch(function(error) {
      alert('Error fetching data');
    });
}

function getCityWeather(coords) {
  let urlLatLon = `${mainUrl}/data/2.5/forecast?cnt=1&units=imperial&lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}`;
  fetch(urlLatLon)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const temp = data.list[0].main.temp;
      const iconCode = data.list[0].weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
      const humidity = data.list[0].main.humidity;
      const wind = data.list[0].wind.speed;
      const cityName = data.city.name;
      const date = data.list[0].dt_txt; // Get the date

      const toRemove = document.getElementById("bodyDivClass");

      if (toRemove != null) {
        toRemove.remove();
      }

      const mainDiv = document.createElement("div");
      const secondDiv = document.createElement("div");
      const bodyDiv = document.createElement("div");
      bodyDiv.setAttribute("id", "bodyDivClass");
      bodyDiv.setAttribute('class', "today card bg-light ");
      const mainDivHeader = document.createElement('h2');
      mainDivHeader.textContent = ("Current Weather");

      const cityHeader = document.createElement("h2");
      const iconImage = document.createElement("img");
      const tempHeader = document.createElement("p");
      const humidHeader = document.createElement("p");
      const windHeader = document.createElement("p");
      const dateHeader = document.createElement("h2"); // Create dateHeader element

      // Format the date
      const dateFormatted = dayjs(date).format("MM/DD/YYYY");
      dateHeader.textContent = dateFormatted; // Set the formatted date

      cityHeader.textContent = `${cityName}`;
      tempHeader.textContent = `Temp: ${temp} °F`;
      iconImage.src = iconUrl;
      iconImage.alt = "Weather Icon";
      humidHeader.textContent = `Humidity: ${humidity} % `;
      windHeader.textContent = `Wind Speed: ${wind} mph`;

      mainDiv.append(secondDiv);
      secondDiv.append(bodyDiv);
      bodyDiv.append(dateHeader, cityHeader, iconImage, tempHeader, humidHeader, windHeader); // Include dateHeader
      mainElement.appendChild(bodyDiv);
    });
}


function get5DayForecast(coords) {
  let urlLatLon = `${mainUrl}/data/2.5/forecast?&units=imperial&lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}`;
  fetch(urlLatLon)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      cityData = data;

      
      const toRemove = document.getElementById("containerDiv");

      if (toRemove != null) {
        toRemove.remove();
      }

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
      

      for (var i = 1, len = data.list.length; i < len; i++) {
        const temp = data.list[i].main.temp;
        const iconCode = data.list[i].weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
        const humidity = data.list[i].main.humidity;
        const wind = data.list[i].wind.speed;
        const date = data.list[i].dt_txt;

        if (data.list[i].dt_txt.includes(`12:00:00`)) {
          const mainDiv = document.createElement("div");
          mainDiv.classList.add("forecast-card"); // Add class for styling
          const dateHeader = document.createElement("h2");
          dateHeader.setAttribute('class', 'date-header');
          const iconImage = document.createElement("img");
          const tempHeader = document.createElement("p");
          const humidHeader = document.createElement("p");
          const windHeader = document.createElement("p");
          const dateFormatted = dayjs(date).format("MM/DD/YYYY");

          dateHeader.textContent = dateFormatted;
          tempHeader.textContent = `Temp: ${temp} °F`;
          iconImage.src = iconUrl;
          iconImage.alt = "Weather Icon";
          humidHeader.textContent = `Humidity: ${humidity} % `;
          windHeader.textContent = `Wind Speed: ${wind} mph`;

          mainDiv.append(dateHeader, iconImage, tempHeader, humidHeader, windHeader);

          // Append each forecast card to the forecast container
          forecastContainer.appendChild(mainDiv);
        }
      }

      // Append the container to the body
      document.body.appendChild(container);
    });
}


searchButton.addEventListener("click", function (event) {
  event.preventDefault();
  getCityApi(cityEntered.value);
  saveCityNameandDisplay();   
});