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

function parseWeatherData(data) {
    return 0;
}

function displayDashboard(data,dateIndex,date,city) {
    weatherData = parseWeatherData(data);
    // Display data
}

function fetchRequest(city,render) {
    for (let i = 0; i < DATES.length; ++i) {
        // Create fetch request
        let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&day=${DATES[i]}&units=imperial`;
        // Perform fetch request
        fetch(url).then(function (response) {
            if (response.ok) { // If no errors occur
                response.json().then(function (data){
                    // Add city to search history
                    if (i === 0 && render === false) addToHistory(city);
                    // Display weather information
                    displayDashboard(data,i,DATES[i],city);
                });
            }
        });
    }
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