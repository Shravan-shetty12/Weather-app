const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");

const weatherIcon = document.querySelector(".weather-icon");
const weatherSection = document.querySelector(".weather");
const errorSection = document.querySelector(".error");
const errorMessage = document.querySelector(".error p");


// ===============================
// WEATHER FUNCTION
// ===============================

async function checkWeather(city) {

    // Remove extra spaces
    city = city.trim();

    // Check empty input
    if (city === "") {
        showError("Please enter a city name.");
        return;
    }

    // Show loading state
    searchBtn.disabled = true;
    searchBtn.textContent = "...";

    errorSection.style.display = "none";

    try {

        // Call our Netlify serverless function
        const response = await fetch(
            `/api/weather?city=${encodeURIComponent(city)}`
        );

        const data = await response.json();

        console.log("Weather API Response:", data);


        // Handle errors
        if (!response.ok) {

            if (response.status === 404) {
                showError("City not found. Please check the city name.");
            }
            else if (response.status === 401) {
                showError("Weather API authentication failed.");
            }
            else if (response.status === 429) {
                showError("Too many requests. Please try again later.");
            }
            else {
                showError(data.message || "Unable to fetch weather data.");
            }

            return;
        }


        // ===============================
        // DISPLAY WEATHER DATA
        // ===============================

        document.querySelector(".temp").textContent =
            Math.round(data.main.temp) + "°C";


        document.querySelector(".city").textContent =
            data.name + ", " + data.sys.country;


        document.querySelector(".humudity").textContent =
            data.main.humidity + "%";


        // OpenWeather gives wind speed in m/s.
        // Convert m/s → km/h
        const windSpeed = (data.wind.speed * 3.6).toFixed(1);

        document.querySelector(".wind_speed").textContent =
            windSpeed + " km/h";


        // ===============================
        // WEATHER ICON
        // ===============================

        const weatherCondition = data.weather[0].main;

        if (weatherCondition === "Clouds") {
            weatherIcon.src = "images/cloudy.png";
        }

        else if (weatherCondition === "Clear") {
            weatherIcon.src = "images/clear-sky.png";
        }

        else if (weatherCondition === "Rain") {
            weatherIcon.src = "images/rain.png";
        }

        else if (weatherCondition === "Drizzle") {
            weatherIcon.src = "images/drizzle.png";
        }

        else if (
            weatherCondition === "Mist" ||
            weatherCondition === "Fog" ||
            weatherCondition === "Haze" ||
            weatherCondition === "Smoke"
        ) {
            weatherIcon.src = "images/fog.png";
        }

        else if (weatherCondition === "Snow") {
            weatherIcon.src = "images/snow.png";
        }

        else {
            // Default icon
            weatherIcon.src = "images/cloudy.png";
        }


        // Show weather section
        weatherSection.style.display = "block";
        errorSection.style.display = "none";

    }

    catch (error) {

        console.error("Frontend Error:", error);

        showError(
            "Unable to connect to the weather service. Please try again."
        );

    }

    finally {

        // Restore search button
        searchBtn.disabled = false;
        searchBtn.textContent = "Search";
    }
}


// ===============================
// ERROR FUNCTION
// ===============================

function showError(message) {

    errorMessage.textContent = message;

    errorSection.style.display = "block";

    weatherSection.style.display = "none";
}


// ===============================
// SEARCH BUTTON
// ===============================

searchBtn.addEventListener("click", () => {

    checkWeather(searchBox.value);

});


// ===============================
// ENTER KEY SEARCH
// ===============================

searchBox.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        checkWeather(searchBox.value);
    }

});
