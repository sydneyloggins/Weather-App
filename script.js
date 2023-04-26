//API key
var key = 'd91f90fd08eb1b800a68add91b40fe84';
var city = 'Austin';

//Variables for current day
var date = moment().format('dddd, MMMM Do YYYY');
var currentTime = moment().format('YYYY-MM-DD HH:MM:SS');

//Saves text input of city searched and stores into an array in local storage
var cityInputs = [];
$('.search').on('click', function (event) {
    event.preventDefault();
    city = $(this).parent('.btnPar').siblings('.textVal').val().trim();
    if (city === '') {
        return;
    };
    cityInputs.push(city);
    localStorage.setItem('city', JSON.stringify(cityInputs));
    fiveDayForecastEl.empty();
    getHistory();
    todaysWeather();
});

//Displays city history buttons
var constHistEl = $('.cityHist');
function getHistory() {
    constHistEl.empty();
    for (var i = 0; i < cityInputs.length; i++) {
        
        var rowEl = $('<row>');
        var btnEl = $('<button>').text(`${cityInputs[i]}`);

        rowEl.addClass('row histBtnRow');
        btnEl.addClass('btn btn-outline-secondary histBtn');
        btnEl.attr('type', 'button');

        constHistEl.prepend(rowEl);
        rowEl.append(btnEl);
    } if (!city) {
        return;
    }
    //When city history button is clicked, it displays the weather for that city
    $('.histBtn').on('click', function (event) {
        event.preventDefault();
        city = $(this).text();
        fiveDayForecastEl.empty();
        todaysWeather();
});
};
//Displays current day weather
var cardCurrentDay = $('.cardCurrentDay'); 
//Displays current day weather and five day forecast 
function todaysWeather() { 
    var getUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`;

    $(cardCurrentDay).empty();

    $.ajax({
        url: getUrlCurrent,
        method: 'GET',
    }).then(function (response) {
        $('.cardCurrentCityName').text(response.name);
        $('.cardCurrentDate').text(date);
        $('.icons').attr('src', 'http://openweathermap.org/img/w/' + response.weather[0].icon + '.png');
        //City temperature
        var pEl = $('<p>').text('Temperature: ' + response.main.temp + '°F');
        $(cardCurrentDay).append(pEl);
        //City feels like temperature
        var pElTemp = $('<p>').text('Feels Like: ' + response.main.feels_like + '°F');
        $(cardCurrentDay).append(pElTemp);
       //City humidity
        var pElHumidity = $('<p>').text('Humidity: ' + response.main.humidity + '%');
        $(cardCurrentDay).append(pElHumidity);
       //City wind speed
        var pElWind = $('<p>').text('Wind Speed: ' + response.wind.speed + ' MPH');
        $(cardCurrentDay).append(pElWind);
}); 
    fiveDayForecast();
};

//Variable for five day forecast element
var fiveDayForecastEl = $('.fiveDayForecast');

//Displays five day forecast
function fiveDayForecast () {
    var getUrlFiveDay = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${key}`;

    $.ajax({ 
        url: getUrlFiveDay,
        method: 'GET',
}).then(function (response) {
    var fiveDayArr = response.list;
    var myWeather = [];
    $.each(fiveDayArr, function (index, value) {
        testObj = {
            date: value.dt_txt.split(' ')[0],
            time: value.dt_txt.split(' ')[1],
            temp: value.main.temp,
            feels_like: value.main.feels_like,
            icon: value.weather[0].icon,
            humidity: value.main.humidity,
        }

        if (value.dt_txt.split(' ')[1] === '12:00:00') {
            myWeather.push(testObj);
        }
    });
    //Displays the cards for the five day forecast
    for (let i = 0; i < myWeather.length; i++) {

        var cardEl = $('<div>');
        cardEl.attr('class', 'card text-white bg-info mb-3 cardOne');
        cardEl.attr('style', 'max-width: 18rem;');
        fiveDayForecastEl.append(cardEl);

        var cardElHeader = $('<div>');
        cardElHeader.attr('class', 'card-header');
        var m = moment(`${myWeather[i].date}`).format('MM-DD-YYYY');
        cardElHeader.text(m);
        cardEl.append(cardElHeader);

        var cardElBody = $('<div>');
        cardElBody.attr('class', 'card-body');
        cardEl.append(cardElBody);

        var iconEl = $('<img>');
        iconEl.attr('class', 'icons');
        iconEl.attr('src', 'http://openweathermap.org/img/w/' + myWeather[i].icon + '.png');
        cardElBody.append(iconEl);

        var tempEl = $('<p>').text(`Temperature: ${myWeather[i].temp}°F`);
        cardElBody.append(tempEl);
        var feelsLikeEl = $('<p>').text(`Feels Like: ${myWeather[i].feels_like}°F`);
        cardElBody.append(feelsLikeEl);
        var humidityEl = $('<p>').text(`Humidity: ${myWeather[i].humidity}%`);
        cardElBody.append(humidityEl);
    }
});
};

//Example data from Austin loads when page is refreshed
function exampleData() {

	var cityHistStore = JSON.parse(localStorage.getItem('city'));

	if (cityHistStore !== null) {
		cityHist = cityHistStore
	}
	getHistory();
	todaysWeather();
    
};

exampleData();