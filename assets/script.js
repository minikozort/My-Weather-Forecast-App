let apiData =[];
let cityData = [];
const mainUrl = 'https://api.openweathermap.org'
const cityEntered = document.getElementById('#cityName');



// Using weather API to pull Lat and Lon of the city entered in the search box
function getCityApi(){

   let url = `${mainUrl}/data/2.5/forecast?cnt=6&q=westfield&appid=${apiKey}`;

    fetch(url)
      .then(function (response) {
        
        return response.json();
      })
      .then(function (data) {
       localStorage.setItem('forecast', JSON.stringify(data));
       apiData.push(data);

       const location = apiData[0].city.coord
        return location;

  })

    .then(function(location){
        getCityWeather(location);
    })
};

function getCityWeather(coords){
      //  Using Weather API to pull details of weather
      let urlLatLon = `${mainUrl}/data/2.5/forecast?cnt=6&units=imperial&lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}`
      fetch(urlLatLon)
      .then(function(response){
        return response.json();
    
      })
      .then(function(data){
        // localStorage.setItem('citydata', JSON.stringify(data));
        cityData.push(data);
        console.log(cityData);


       
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