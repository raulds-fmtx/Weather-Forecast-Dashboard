// Retrieve searchHistory from localStorage
let searchHistory = JSON.parse(localStorage.getItem("history"));
const APIKey = '179026b93e96ef40496274d5a2f9d1e9';
const DATES = getDates();

function handleQuery(event) {
    event.preventDefault();
    let city = $('#city-search').val();

    if (city === '') {
        console.log('Error: Please enter a city name.');
    } else {
        $('#city-search').prop('value','');
        queryFetch(city);
    }
}

function renderDashboard(data) {

}

function addToHistory(city) {

}

function renderHistory(data) {
    console.log(data);
}

function queryFetch(city,date) {
}

function verifyQuery(weatherData) {
    return true;
} 

function getDates() {
    let dates = []
    for (let i = 0; i < 6; ++i) {
        dates.push(dayjs().add(i,'day').format('YYYY-MM-DD'));
    }
    return dates
}

// Submission Handler (Query Server, Fill Dashboard, Manage History)
// Query Verification Function (Verify city searched is valid)
// Server Query Function (Query the server and organize queried data into usable form)
// Create/Edit History Function (Saves Search to local storage and calls function to create history item)
// Create History jQuery Item Function (Create search history item)
// Render Forecast information to dashboard
// Render Search History and last searched item function

$(document).ready(function () {
    // Render Search history and last searched item
    $('#submit-query').on('click', handleQuery);
    // Enable Search for City Upon submission
});