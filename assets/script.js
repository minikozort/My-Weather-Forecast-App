let apiData = [];
const mainUrl = "https://api.openweathermap.org";
const cityEntered = document.getElementById("cityName");
const appendSearch = document.getElementById("appendSearch");
const searchButton = document.getElementById("searchButton");
const savedSearch = [];

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
  const displayArea = document.createElement("div");
  const cityButton = document.createElement("button");
  cityButton.textContent = `${searchText}`;
  cityButton.setAttribute('type' , 'button');
  cityButton.setAttribute('id', searchText);
  displayArea.append(cityButton);
  appendSearch.append(displayArea);

  cityEntered.value = "";


  cityButton.addEventListener('click' , function (event){
    event.preventDefault()
    
    getCityApi(searchText); // Pass the city name to getCityApi function
  
  });
}

// Using weather API to pull Lat and Lon of the city entered in the search box
function getCityApi(cityName) {
//   if (!cityName) {
//     alert("No city name provided.");
//     return;
// }

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
        console.error('Error fetching data:', error);
    });
}

function getCityWeather(coords) {
  //  Using Weather API to pull details of weather
  let urlLatLon = `${mainUrl}/data/2.5/forecast?cnt=1&units=imperial&lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}`;
  fetch(urlLatLon)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const temp = data.list[0].main.temp;
      const icon = data.list[0].weather[0].icon;
      const humidity = data.list[0].main.humidity;
      const wind = data.list[0].wind.speed;
      const cityName = data.city.name;

      const toRemove = document.getElementById("bodyDivClass");
    

      if (toRemove != null) {
        toRemove.remove();
      }

      const mainDiv = document.createElement("div");
      const secondDiv = document.createElement("div");
      const bodyDiv = document.createElement("div");
      bodyDiv.setAttribute("id", "bodyDivClass");
      const cityHeader = document.createElement("h2");
      const iconIcon = document.createElement("img");
      const tempHeader = document.createElement("p");
      const humidHeader = document.createElement("p");
      const windHeader = document.createElement("p");

      cityHeader.textContent = `${cityName}`;
      tempHeader.textContent = `Temp: ${temp} °F`;
      iconIcon.textContent = `${icon}`;
      humidHeader.textContent = `Humidity: ${humidity} % `;
      windHeader.textContent = `Wind Speed: ${wind} mph`;

      mainDiv.append(secondDiv);
      secondDiv.append(bodyDiv);
      bodyDiv.append(cityHeader, iconIcon, tempHeader, humidHeader, windHeader);
      document.body.appendChild(bodyDiv);
    });
}

function get5DayForecast(coords) {
  //  Using Weather API to pull details of weather
  let urlLatLon = `${mainUrl}/data/2.5/forecast?&units=imperial&lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}`;
  fetch(urlLatLon)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      cityData = data;
      const forecastDiv = document.createElement("div");
      const header = document.createElement("h2");
      header.textContent = "5-Day Forecast";
      forecastDiv.append(header);

      const toRemove = document.getElementById("containerDiv");


      if (toRemove != null) {
        toRemove.remove();
      }
      const container = document.createElement("div");
      container.setAttribute("id", "containerDiv");
      container.append(forecastDiv);

      for (var i = 1, len = data.list.length; i < len; i++) {
        const temp = data.list[i].main.temp;
        const icon = data.list[i].weather[0].icon;
        const humidity = data.list[i].main.humidity;
        const wind = data.list[i].wind.speed;
        const date = data.list[i].dt_txt;

        if (data.list[i].dt_txt.includes(`12:00:00`)) {
          const mainDiv = document.createElement("div");
          const secondDiv = document.createElement("div");
          const bodyDiv = document.createElement("div");
          const dateHeader = document.createElement("h2");
          const iconIcon = document.createElement("img");
          const tempHeader = document.createElement("p");
          const humidHeader = document.createElement("p");
          const windHeader = document.createElement("p");
          const dateFormatted = dayjs(date).format("MM/DD/YYYY");

          dateHeader.textContent = dateFormatted;
          tempHeader.textContent = `Temp: ${temp} °F`;
          iconIcon.textContent = `${icon}`;
          humidHeader.textContent = `Humidity: ${humidity} % `;
          windHeader.textContent = `Wind Speed: ${wind} mph`;

          mainDiv.append(secondDiv);
          secondDiv.append(bodyDiv);
          bodyDiv.append(
            dateFormatted,
            iconIcon,
            tempHeader,
            humidHeader,
            windHeader
          );

          container.append(bodyDiv);
          document.body.appendChild(container);
        }
      }
    });
}

searchButton.addEventListener("click", function (event) {
  event.preventDefault();
  getCityApi(cityEntered.value);
  saveCityNameandDisplay();   
});
