let apiData =[];
let cityData = [];
const mainUrl = 'https://api.openweathermap.org'
const requestUrl = `https://api.openweathermap.org/data/2.5/weather?lat=40.6499974&lon=-74.33916531&appid=4e1cc60636288c88c655b17fbd084dcc`;
const cityEntered = document.getElementById('#cityName');

//

// Using weather API to pull Lat and Lon of the city entered in the search box
function getCityApi(){

   let url = `${mainUrl}/data/2.5/forecast?cnt=5&q=westfield&appid=${apiKey}`;

    fetch(url)
      .then(function (response) {
        
        return response.json();
      })
      .then(function (data) {
       localStorage.setItem('forecast', JSON.stringify(data));
       apiData.push(data);
       //console.log(apiData);
       //const lat = apiData[0].city.coord.lat
       //const lon = apiData[0].city.coord.lon
       const location = apiData[0].city.coord
        return location;
      //  coords.push(apiData[0].city.coord.lat, );
       //console.log(coords)
  })

    .then(function(location){
      // console.log(location);
      // const lat = location.lat
      // const lon = location.lon
      const forecast = getCityWeather(location);
      console.log(forecast)
    })
};

function getCityWeather(coords){
      //  Using Weather API to pull details of weather
      let urlLatLon = `${mainUrl}/data/2.5/forecast?cnt=5&lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}`
      fetch(urlLatLon)
      .then(function(response){
        return response.json();
    
      })
      .then(function(data){
        // localStorage.setItem('citydata', JSON.stringify(data));
        // cityData.push(data.list[0].main.temp);
        // console.log(cityData);
        return data;
      })
}
 getCityApi();



  // function getForecast(){

  //   localStorage.getItem('forecast' , JSON.parse(data));

  // const lat = apiData[0].city.coord.lat
  // const lon = apiData[0].city.coord.lon
  // let urlLatLon = `${mainUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`
  // // api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
  //     fetch(urlLatLon)
  //     .then(function(response){
  //       return response.json();
  //     })
  //     .then(function(data){
  //       localStorage.setItem('citydata', JSON.stringify(data));
  //       cityData.push(data);
  //       console.log(cityData)

  //     })

  // };
  // getForecast();