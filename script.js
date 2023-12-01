class WeatherApiClient {
    #weaterUrl;
    #forecastUrl;
    #iconUrl;

    constructor() {
        this.#weaterUrl = "https://api.openweathermap.org/data/2.5/weather?q={city}&appid=7ded80d91f2b280ec979100cc8bbba94&units=metric&lang=en";
        this.#forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q={city}&appid=7ded80d91f2b280ec979100cc8bbba94&units=metric&lang=en";
        this.#iconUrl = "https://openweathermap.org/img/wn/{iconName}@2x.png";

        this.#setListeners();
    }

    #getCurrWeatherAndForecast(city) {
        const xmlRequest = new XMLHttpRequest();
        xmlRequest.open("GET", this.#weaterUrl.replace("{city}", city), true);
        xmlRequest.send();

        xmlRequest.addEventListener("load", (_) => {
            if (xmlRequest.status === 200) {
                document.getElementById("weather-header").style.display = block;
                this.#displayCurrentWeather(JSON.parse(xmlRequest.response));
            } else {
                document.getElementById("weather-header").style.display = none;
                alert("Fetching current weather informations failed");
            }
        });

        fetch(this.#forecastUrl.replace("{city}", city))
            .then(response => {
                if (response.status === 200) {
                    return response.json()
                } else {
                    throw new Error();
                }
            }).then(response => {
                document.getElementById("forecast-header").style.display = block;
                this.#displayForecast(response.list);
            })
            .catch(_ => {
                document.getElementById("weather-header").style.display = none;
                alert("Fetching forecast informations failed")
            });
    }

    #displayCurrentWeather(currentWeather) {
        const currWeatherInfoContainer = document.getElementById("current-weather-info-container");
        const weatherContainer = this.#buildWeatherContainer(currentWeather);
        currWeatherInfoContainer.innerHTML = '';
        currWeatherInfoContainer.appendChild(weatherContainer);
    }

    #displayForecast(forecastArray) {
        const forecastContainer = document.getElementById("forecast-info-container");
        forecastContainer.innerHTML = '';

        for (let forecastItem of forecastArray) {
            const weatherContainer = this.#buildWeatherContainer(forecastItem);
            forecastContainer.appendChild(weatherContainer);
        }
    }

    #buildWeatherContainer(currentWeather) {
        const container = document.createElement("div");
        container.classList.add("weather-container");
        const informationContainer = document.createElement("div");
        informationContainer.classList.add("information-container");
        const date = new Date(currentWeather.dt * 1000);

        const dateSpan = document.createElement("span");
        dateSpan.innerText = `Date: ${date.toLocaleDateString("en-EN")}`;
        informationContainer.appendChild(dateSpan);

        const timeSpan = document.createElement("span");
        timeSpan.innerText = `Time: ${date.toLocaleTimeString("en-EN")}`;
        informationContainer.appendChild(timeSpan);

        const temp = document.createElement("span");
        temp.innerText = `Temp: ${currentWeather.main.temp}*C`;
        informationContainer.appendChild(temp);

        const feelTemp = document.createElement("span");
        feelTemp.innerText = `Feels like: ${currentWeather.main.feels_like}*C`;
        informationContainer.appendChild(feelTemp);

        const weatherIcon = document.createElement("img");
        weatherIcon.src = this.#iconUrl.replace("{iconName}", currentWeather.weather[0].icon);

        container.appendChild(informationContainer);
        container.appendChild(weatherIcon);

        return container;
    }

    #setListeners() {
        const button = document.getElementById("check-weather-button");
        
        button.addEventListener("click", () => {
            const input = document.getElementById("input");
            
            this.#getCurrWeatherAndForecast(input.value);
       })
    }
}

new WeatherApiClient();
