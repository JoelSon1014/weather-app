let weather = {
    
    fetchWeather: function (city) {
        fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + config.apiKey)
            .then(response => response.json())
            .then(data => {
                // Handle the weather data here
                this.display_weather(data);
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
            });
    },

    display_weather: function (data) {
        const {name} = data;
        const {icon, description} = data.weather[0];
        const {temp, humidity} = data.main;
        const {speed} = data.wind;
        document.querySelector(".city").innerText = "Weather in " + name;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".temp").innerText = temp + "°F";
        document.querySelector(".condition").innerText = description;
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".wind-speed").innerText = "Wind Speed: " + speed + " m/h";
    }
};
