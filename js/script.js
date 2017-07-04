var btn = document.getElementById('btn');
var forecast = document.getElementById('forecast');
var welcome = document.getElementById('welcome');
var foreIcon = document.getElementById('fore_icon');
var farenheit = document.getElementById('far');
var celsius = document.getElementById('cel');
var weatherIcon = document.getElementById('icon');
var weather = document.getElementById('weather');
var head = document.getElementById('head');
var typo = document.getElementById('typo');


//geolocation detected onload + hide/show
window.addEventListener('load', function() {
    var locate = new XMLHttpRequest();
    locate.open('GET', 'https://freegeoip.net/json/');
    locate.onload = function() {
        var data = JSON.parse(locate.responseText);
        var currentCity = data.city;
        photo(currentCity);
    }
    document.getElementById('search').style.display = "block";
    document.getElementsByClassName('cf')[0].style.display = "block";
    locate.send();
})

// stop Enter from refreshing page
document.getElementById("city").addEventListener("keypress", function(event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        btn.click();
    }
});

//fetch photo w/ cityname tag
function photo(city) {
    var photoRequest = new XMLHttpRequest();
    photoRequest.open('GET', 'https://pixabay.com/api/?key=5792557-d11e60511dda64c6a5d3e5ae9&q=' + city + '&image_type=photo');
    photoRequest.onload = function() {
        var photoData = JSON.parse(photoRequest.responseText);

        //if pixabay has only few pics of current city
        if (photoData.totalHits < 3) {
            random = Math.round((Math.random() * 2) + 1);
        }

        var random = Math.round((Math.random() * 19) + 1);
        var photoUrl = photoData.hits[random].webformatURL;
        document.body.style.backgroundImage = 'url(' + photoUrl + ')';
        getWeather(city);
    }
    photoRequest.send();
}

//city search by name, button eventlistener
btn.addEventListener('click', function() {
    var city = document.getElementById('city').value;
    var photoRequestOnClick = new XMLHttpRequest();
    photoRequestOnClick.open('GET', 'https://pixabay.com/api/?key=5792557-d11e60511dda64c6a5d3e5ae9&q=' + city + '&image_type=photo');
    photoRequestOnClick.onload = function() {
        var photoDataClick = JSON.parse(photoRequestOnClick.responseText);

        //if pixabay has only few pics of current city
        if (photoDataClick.totalHits === 0) {
            weather.style.display = "none";
            head.style.display = "none";
            typo.style.display = "block";
        } else if (photoDataClick.totalHits < 3) {
            var randomClick = Math.round((Math.random() * 3) + 1);
        }

        var randomClick = Math.round((Math.random() * 19) + 1);
        var photoUrlClick = photoDataClick.hits[randomClick].webformatURL;
        typo.style.display = "none";
        head.style.display = "block";
        weather.style.display = "flex";
        document.body.style.backgroundImage = 'url(' + photoUrlClick + ')';
        getWeather(city);
    }
    photoRequestOnClick.send();
})

//main f() that renders weather
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
        var random = '';

        foreIcon.style.display = 'none';

        if (myData.cod == 404) {
            welcome.innerHTML = 'Must be a Mistake in Spelling..'
        }

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

        //to F:
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