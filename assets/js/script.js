const APIKey = '179026b93e96ef40496274d5a2f9d1e9';
const DATES = getDates();
const historyContainer = $('#history-container');

function handleQuery(event) {
    event.preventDefault();

    // Get the city name
    let city = $('#city-search').val();
    // Reset form values
    $('#city-search').prop('value','');
    // Submit fetch request
    fetchRequest(city,false);
}

function parseForecastData(data) {
    let forecastData = [];
    for (let i = 0; i < data.list.length; ++i) {
        let weather;
        for (let j = 0; j < DATES.length; ++j) {
            timestamp = dayjs.unix(data.list[i].dt).format('MM/DD/YYYY-HH');
            if (DATES[j] + '-13' === timestamp) {
                weather = {
                    date: dayjs.unix(data.list[i].dt).format('M/D/YYYY'),
                    temp: data.list[i].main.temp,
                    wind: data.list[i].wind.speed,
                    humidity: data.list[i].main.humidity,
                    weatherIcon: data.list[i].weather[0].icon
                };
                forecastData.push(weather);
            }
        }
    }
    return forecastData;
}

function displayForecast(data) {
    forecastData = parseForecastData(data);
    for (let i = 0; i < 5; ++i) {
        $(`#date-${i+1}`).text(`${forecastData[i].date}`);
        $(`#icon-${i+1}`).attr('src',`https://openweathermap.org/img/wn/${forecastData[i].weatherIcon}@2x.png`);
        $(`#temp-${i+1}`).text(`Temp: ${forecastData[i].temp} °F`);
        $(`#wind-${i+1}`).text(`Wind: ${forecastData[i].wind} MPH`);
        $(`#humidity-${i+1}`).text(`Humidity: ${forecastData[i].humidity} %`);
    }
}

function parseWeatherData(data) {
    let weather = {
        date: dayjs.unix(data.dt).format('M/D/YYYY'),
        temp: data.main.temp,
        wind: data.wind.speed,
        humidity: data.main.humidity,
        weatherIcon: data.weather[0].icon
    };
    return weather
} 

function displayWeather(data,city) {
    weatherData = parseWeatherData(data);
    $('#main-display').text(`${city} (${weatherData.date})`);
    $('#main-icon').attr('src',`https://openweathermap.org/img/wn/${weatherData.weatherIcon}@2x.png`);
    $('#temp-main').text(`Temp: ${weatherData.temp} °F`);
    $('#wind-main').text(`Wind: ${weatherData.wind} MPH`);
    $('#humidity-main').text(`Humidity: ${weatherData.humidity} %`);
}

function fetchRequest(city,render) {
    let urlWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=imperial`;
    let urlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}&units=imperial`;
    // Perform fetch request
    fetch(urlWeather).then(function (response) {
        if (response.ok) { // If no errors occur
            response.json().then(function (data){
                // Add city to search history
                if (render === false) addToHistory(city);
                // Display weather information
                displayWeather(data,city);
            });
        }
    });
    fetch(urlForecast).then(function (response) {
        if (response.ok) { // If no errors occur
            response.json().then(function (data){
                // Display forecast information
                displayForecast(data);
            });
        }
    });
}

function addToHistory(city) {
    // retreive search history data
    let searchHistory = JSON.parse(localStorage.getItem("history"));
    if (searchHistory === null) { // For empty history
        searchHistory = [city];
    } else { // For existing history
        searchHistory.push(city)
    }
    // Save data
    localStorage.setItem("history", JSON.stringify(searchHistory));
    // Delete 10th most recent search display item
    if (searchHistory.length > 10) {
        historyContainer.children()[9].remove();
    }
    // Log most recent search
    createHistoryItem(city);
}

function createHistoryItem(city) {
    // Create card
    let card = $('<div class="card my-1 mx-3 text-center history-card"></div>');
    let cardBody = $('<div class="card-body p-1"></div>');
    cardBody.append($(`<p class="m-0">${city}</p>`));
    card.append(cardBody);
    // Add card to top of search history
    historyContainer.prepend(card);
}

function renderHistory() {
    // Get all searched cities
    let searchHistory = JSON.parse(localStorage.getItem("history"));
    // Render 10 most recent searches
    if (searchHistory !== null) {
        for (let i = searchHistory.length-10; i < searchHistory.length; ++i) {
            if (i >= 0) createHistoryItem(searchHistory[i]);
        }
    }
}

function renderDashboard() {
    // Get last searched city
    let searchHistory = JSON.parse(localStorage.getItem("history"));
    if (searchHistory !== null) {
        let lastCity = searchHistory[searchHistory.length-1];
        // fetchRequest city
        fetchRequest(lastCity,true);
    }
}

function getDates() {
    let dates = []
    for (let i = 0; i < 6; ++i) {
        dates.push(dayjs().add(i,'day').format('MM/DD/YYYY'));
    }
    return dates
}

$(document).ready(function () {
    // Render Search history and last searched item
    renderHistory();
    renderDashboard();
    // Enable Search for City Upon submission
    $('#submit-query').on('click', handleQuery);
});