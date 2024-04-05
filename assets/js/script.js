// Retrieve searchHistory from localStorage
let searchHistory = JSON.parse(localStorage.getItem("history"));
const APIKey = '179026b93e96ef40496274d5a2f9d1e9';
const DATES = getDates();

function handleQuery(event) {
    event.preventDefault();

    // Get the city name
    let city = $('#city-search').val();

    
    $('#city-search').prop('value','');
    addToHistory(city);
    queryFetch(city);
}

function parseWeatherData(data) {
    return 0;
}

function displayDashboard(data,dateIndex,date) {
    weatherData = parseWeatherData(data);
    // Display data
}

function queryFetch(city) {
    for (let i = 0; i < DATES.length; ++i) {
        let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&day=${DATES[i]}&units=imperial`;
        fetch(url).then(function (response) {
            if (response.ok) {
                response.json().then(function (data){
                    displayDashboard(data,i,DATES[i]);
                });
            }
        });
    }
}

function addToHistory(city) {
    // Log searched city
    createHistoryItem(city);
}

function createHistoryItem(city) {
}

function renderHistory() {
    // Get all searched cities
    // loop createHistoryItem
}

function renderDashboard() {
    // Get last searched city
    // queryFetch city
}

function getDates() {
    let dates = []
    for (let i = 0; i < 6; ++i) {
        dates.push(dayjs().add(i,'day').format('YYYY-MM-DD'));
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