var btn = document.getElementById('btn');
// var search = document.getElementById('search')
// var tempMin = document.getElementById('temp_min');
// var tempMax = document.getElementById('temp_max');
var forecast = document.getElementById('forecast');
var welcome = document.getElementById('welcome');
var foreIcon = document.getElementById('fore_icon');
var farenheit = document.getElementById('far');
var celsius = document.getElementById('cel');
var weatherIcon = document.getElementById('icon');
//var cf = document.getElementsByClassName('cf')[0];


//geolocation detected onload
window.addEventListener('load', function() {
    navigator.geolocation.getCurrentPosition(function(position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        geolocation(lat, lon); //pass to f() that finds city by given lat and lon
        document.getElementById('search').style.display = "block";
        document.getElementsByClassName('cf')[0].style.display = "block";
        document.getElementsByClassName('permition')[0].style.display = "none";
    });
})

// stop Enter from refreshing page
document.getElementById("city").addEventListener("keypress", function(event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        btn.click();
    }
});

function geolocation(lat, lon) {
    var requestCurrent = new XMLHttpRequest();
    requestCurrent.open('GET', 'http://api.geonames.org/findNearbyPlaceNameJSON?lat=' + lat + '&lng=' + lon + '&username=effgen');
    requestCurrent.onload = function() {
        var geoData = JSON.parse(requestCurrent.responseText);
        var currentCity = geoData.geonames[0].name;
        photo(currentCity);
    }
    requestCurrent.send();
}

function photo(city) {
    var photoRequest = new XMLHttpRequest();
    photoRequest.open('GET', 'https://pixabay.com/api/?key=5792557-d11e60511dda64c6a5d3e5ae9&q=' + city + '&image_type=photo');
    photoRequest.onload = function() {
        var photoData = JSON.parse(photoRequest.responseText);
        var random = Math.round((Math.random() * 5) + 1);
        var photoUrl = photoData.hits[random].webformatURL;
        document.body.style.backgroundImage = 'url(' + photoUrl + ')';
        getWeather(city);
    }
    photoRequest.send();
}

//search res
btn.addEventListener('click', function() {
    var city = document.getElementById('city').value;
    var photoRequestOnClick = new XMLHttpRequest();
    photoRequestOnClick.open('GET', 'https://pixabay.com/api/?key=5792557-d11e60511dda64c6a5d3e5ae9&q=' + city + '&image_type=photo');
    photoRequestOnClick.onload = function() {
        var photoDataClick = JSON.parse(photoRequestOnClick.responseText);
        var randomClick = Math.round((Math.random() * 5) + 1);
        var photoUrlClick = photoDataClick.hits[randomClick].webformatURL;
        document.body.style.backgroundImage = 'url(' + photoUrlClick + ')';
        getWeather(city);
    }
    photoRequestOnClick.send();
})

//main f() that displays weather
function getWeather(city) {
    city = city.charAt(0).toUpperCase() + city.slice(1);
    var myRequest = new XMLHttpRequest();
    myRequest.open('GET', 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metric&APPID=53f23142a8763c921f438a9baee0b016')
    myRequest.onload = function celsius() {
        var myData = JSON.parse(myRequest.responseText);
        var country = myData.sys.country;
        var currTemp = Math.round(myData.main.temp);
        var minTemp = Math.round(myData.main.temp_min);
        var maxTemp = Math.round(myData.main.temp_max);

        foreIcon.style.display = 'none';
        icon.innerHTML = '<i class="wi wi-owm-' + myData.weather[0].id + '"></i>';
        welcome.innerHTML = 'Hey! How Is It In ' + city + ', ' + country + '?';
        temp.innerHTML = 'Current ' + '<span>' + '</br>' + currTemp + '</span>' + '&degC';
        temp_min.innerHTML = 'Low ' + '<span>' + '</br>' + minTemp + '</span>' + '&degC';
        temp_max.innerHTML = 'High ' + '<span>' + '</br>' + maxTemp + '</span>' + '&degC';

        if (myData.weather[0].main === 'Clear') {
            forecast.innerHTML = 'Conditions Are Clear';
        } else if (myData.weather[0].main === 'Clouds') {
            forecast.innerHTML = 'Looking At Some Clouds Up There';
        } else if (myData.weather[0].main === 'Rain') {
            forecast.innerHTML = 'Consider Taking an Umbrella';
        }

        //to farenheit:
        far.addEventListener('click', function() {
                var currTempF = Math.round((currTemp * 1.8) + 32);
                var minTempF = Math.round((minTemp * 1.8) + 32);
                var maxTempF = Math.round((maxTemp * 1.8) + 32);
                temp.innerHTML = 'Current ' + '<span>' + '</br>' + currTempF + '</span>' + '&degF';
                temp_min.innerHTML = 'Low ' + '<span>' + '</br>' + minTempF + '</span>' + '&degF';
                temp_max.innerHTML = 'Low ' + '<span>' + '</br>' + maxTempF + '</span>' + '&degF';
            })
            //back to C:
        cel.addEventListener('click', celsius);
    }
    myRequest.send();
}