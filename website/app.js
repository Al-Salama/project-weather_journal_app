/* Global Variables */
const weatherBaseUrl = "https://api.openweathermap.org";
const API_KEY = "7a2b4711bae65c310fafd08611fc2792";
const UNIT = "metric";

// Element selectors
const generateButton = document.getElementById("generate");
const zipCodeInput = document.getElementById("zip");
const feelingInput = document.getElementById("feelings");

const dateHolder = document.getElementById("date");
const tempHolder = document.getElementById("temp");
const contentHolder = document.getElementById("content");

// Gets the lat & lon required to get the weather data by zip/post code.
async function getGeographicalCoordinates(zipCode = "", countryCode = "US") {
  let data = null;

  // formatting the url using URL class
  const url = new URL("/geo/1.0/zip", weatherBaseUrl);
  url.searchParams.append("zip", `${zipCode},${countryCode}`);
  url.searchParams.append("appid", API_KEY);

  try {
    const response = await fetch(url);
    data = await response.json();
  } catch (error) {
    console.error(error);
    alert("Something wrong happened with the weather API. Please try again.");
  }

  return data;
}

// Gets the weather information by passing lat and lon of a location.
async function getCurrentWeatherData(lat = "", lon = "") {
  let data = null;

  // formatting the url using URL class
  const url = new URL("/data/3.0/onecall", weatherBaseUrl);
  url.searchParams.append("lat", lat);
  url.searchParams.append("lon", lon);
  url.searchParams.append("units", UNIT);
  // exclude unnecessary data from the API.
  url.searchParams.append("exclude", "minutely,hourly,daily,alerts")
  url.searchParams.append("appid", API_KEY);

  try {
    const response = await fetch(url);
    data = await response.json();
  } catch (error) {
    console.error(error);
    alert("Something wrong happened with the weather API. Please try again.");
  }

  return data;
}

// Posts the data to our api
async function postData(data = {}) {
  let apiData = null;

  try {
    const response = await fetch("/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    apiData = await response.json();
  } catch (error) {
    console.error(error);
    alert("Something wrong happened with the weather API. Please try again.");
  }

  return apiData
}

// Retrieves the data from our api
async function retrieveData() {
  let data = null;

  try {
    const response = await fetch("/all");
    data = await response.json();

    // update the ui with the new data
    dateHolder.textContent = data.date;
    tempHolder.textContent = data.temperature;
    contentHolder.textContent = data.content;
  } catch (error) {
    console.error(error);
    alert("Something wrong happened with the weather API. Please try again.");
  }

  return data
}

function onGenerateClick(event = MouseEvent.prototype) {
  generateButton.disabled = true;

  const zipCode = zipCodeInput.value;
  getGeographicalCoordinates(zipCode)
  .then(geoData => {
    return getCurrentWeatherData(geoData.lat, geoData.lon)
  })
  .then(weatherData => {
    // current weather
    const currentW = weatherData.current

    const apiDate = new Date(currentW.dt * 1000);

    // Format the date in a readable and good-looking way.
    const dateString = apiDate.toLocaleDateString("en-UK", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long"
    })
    const temperature = Math.round(currentW.temp) + "°C"
    console.log(contentHolder)
    const content = feelingInput.value;

    // the data to be posted to our api
    const data = {
      date: dateString,
      temperature,
      content
    }

    return postData(data)
  })
  .then(() => {
    return retrieveData()
  })
  .catch((error) => {
    console.error(error);
    alert("Unknown error has occurred.");
  })

  generateButton.disabled = false;
}

generateButton.addEventListener("click", onGenerateClick);