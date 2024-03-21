$(document).ready(function () {
    // Populate city dropdown
    populateCityDropdown();

    // Handle button click event
    $('#getForecastBtn').click(function () {
        const selectedCity = $('#city').val();
        getWeatherForecast(selectedCity);
    });
});

function populateCityDropdown() {
    const cities = [
        { latitude: 52.367, longitude: 4.904, city: "Amsterdam", country: "Netherlands" },
        { latitude: 39.933, longitude: 32.859, city: "Ankara", country: "Turkey" },
        { latitude: 56.134, longitude: 12.945, city: "Åstorp", country: "Sweden" },
        { latitude: 37.983, longitude: 23.727, city: "Athens", country: "Greece" },
        { latitude: 54.597, longitude: -5.930, city: "Belfast", country: "Northern Ireland" },
        { latitude: 41.387, longitude: 2.168, city: "Barcelona", country: "Spain" },
        { latitude: 52.520, longitude: 13.405, city: "Berlin", country: "Germany" },
        { latitude: 46.948, longitude: 7.447, city: "Bern", country: "Switzerland" },
        { latitude: 43.263, longitude: -2.935, city: "Bilbao", country: "Spain" },
        { latitude: 50.847, longitude: 4.357, city: "Brussels", country: "Belgium" },
        { latitude: 47.497, longitude: 19.040, city: "Bucharest", country: "Romania" },
        { latitude: 59.329, longitude: 18.068, city: "Budapest", country: "Hungary" },
        { latitude: 51.483, longitude: -3.168, city: "Cardiff", country: "Wales" },
        { latitude: 50.937, longitude: 6.96, city: "Cologne", country: "Germany" },
        { latitude: 55.676, longitude: 12.568, city: "Copenhagen", country: "Denmark" },
        { latitude: 51.898, longitude: -8.475, city: "Cork", country: "Ireland" },
        { latitude: 53.349, longitude: -6.260, city: "Dublin", country: "Ireland" },
        { latitude: 55.953, longitude: -3.188, city: "Edinburgh", country: "Scotland" },
        { latitude: 43.7696, longitude: 11.255, city: "Florence", country: "Italy" },
        { latitude: 50.110, longitude: 8.682, city: "Frankfurt", country: "Germany" },
        { latitude: 43.254, longitude: 6.637, city: "French Riviera", country: "France" },
        { latitude: 32.650, longitude: -16.908, city: "Funchal", country: "Portugal" },
        { latitude: 36.140, longitude: -5.353, city: "Gibraltar", country: "" },
        { latitude: 57.708, longitude: 11.974, city: "Gothenburg", country: "Sweden" },
        { latitude: 53.548, longitude: 9.987, city: "Hamburg", country: "Germany" },
        { latitude: 60.169, longitude: 24.938, city: "Helsinki", country: "Finland" },
        { latitude: 39.020, longitude: 1.482, city: "Ibiza", country: "Spain" },
        { latitude: 50.450, longitude: 30.523, city: "Kyiv", country: "Ukraine" },
        { latitude: 61.115, longitude: 10.466, city: "Lillehammer", country: "Norway" },
        { latitude: 38.722, longitude: -9.139, city: "Lisbon", country: "Portugal" },
        { latitude: 51.507, longitude: -0.127, city: "London", country: "England" },
        // Add more cities here
    ];

    cities.forEach(city => {
        $('#city').append(`<option value="${city.city}" data-latitude="${city.latitude}" data-longitude="${city.longitude}">${city.city}, ${city.country}</option>`);
    });
}


async function getWeatherForecast(city) {
    const latitude = $('#city option:selected').data('latitude'); // Get latitude from selected option
    const longitude = $('#city option:selected').data('longitude'); // Get longitude from selected option

    const url = `http://www.7timer.info/bin/api.pl?lon=${longitude}&lat=${latitude}&product=civillight&output=json&tzshift=0&city=${city}`;

    try {
        const response = await fetch(url);
        const data = await response.json(); // Parse response as JSON
        console.log('API Response:', data);
        const forecast = processWeatherData(data);
        displayWeatherForecast(forecast);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function processWeatherData(data) {
    const forecast = data.dataseries;

    return forecast.map(day => ({
        date: formatDate(day.date), // Format the date
        minTemperature: day.temp2m.min,
        maxTemperature: day.temp2m.max,
        weather: day.weather,
        weatherIcon: getWeatherIcon(day.weather)
    }));
}

function formatDate(dateNumber) {
    // Convert the date number to a string
    const dateString = dateNumber.toString();

    // Extract the year, month, and day from the date string
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);

    // Construct a valid date string in the format "YYYY-MM-DD"
    const formattedDate = `${year}-${month}-${day}`;

    // Parse the date string and create a Date object
    const parsedDate = new Date(formattedDate);

    // Check if the parsed date is valid
    if (isNaN(parsedDate.getTime())) {
        return "Invalid Date";
    } else {
        // Format the date as desired
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDateString = parsedDate.toLocaleDateString('en', options);
        return formattedDateString;
    }
}




function getWeatherIcon(weather) {
    switch (weather.toLowerCase()) {
        case 'ts':
            return 'icons/ts.png';
        case 'lightrain':
            return 'icons/lightrain.png';
        case 'cloudy':
            return 'icons/cloudy.png';
        case 'mcloudy':
            return 'icons/mcloudy.png';
        case 'ishower':
            return 'icons/ishower.png';
        case 'pcloudy':
            return 'icons/pcloudy.png';
        case 'humid':
            return 'icons/humid.png';
        case 'clear':
            return 'icons/clear.png';
        case 'rain':
            return 'icons/rain.png';
        case 'oshower':
            return 'icons/oshower.png';
        case 'lightsnow':
            return 'icons/lightsnow.png';

        default:
            return 'icons/default.png'; // Default icon if weather type is not recognized
    }
}

function displayWeatherForecast(forecast) {
    const weatherForecastDiv = $('#weatherForecast');
    weatherForecastDiv.html('');

    forecast.forEach(day => {
        const forecastCard = `
            <div class="col-lg-2"> 
                <div class="card forecast-card">
                    <div class="card-body">
                        <h5 class="card-title">${day.date}</h5>
                        <img src="${day.weatherIcon}" class="weather-icon" alt="${day.weather}">
                        <br/> <br/>
                        <p class = 'card-text'> ${(day.weather).toUpperCase()}</p><br/>
                        <p class="card-text">Temperature: <p class = 'card-temp'> ${day.minTemperature}°C - ${day.maxTemperature}°C</p></p>
                     
                    </div>
                </div>
            </div>
        `;
        weatherForecastDiv.append(forecastCard);
    });
}

