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
        document.querySelector(".temp").innerText = Math.round(temp) + "°F";
        document.querySelector(".condition").innerText = description;
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".wind-speed").innerText = "Wind Speed: " + Math.round(speed) + " mph";
        document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?${name}')`
    },

    search: function () {
        this.fetchWeather(document.querySelector(".search-bar").value);
    },

    calc_levenshtein_Distance: function (a, b) {

        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;

        const matrix = [];

        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                const cost = a[j - 1] === b[i - 1] ? 0 : 1;
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + cost
                );
            }
        }

        return matrix[b.length][a.length];
    },

    start_speech_recognition: function () {
        const recognition = new webkitSpeechRecognition();
        const search_bar = document.getElementsByClassName("search-bar")[0];
        const valid_places = ["New York", "Michigan", "Seattle", "Korea", "Florida", "California", "San Diego", "Canton", "France", "San Francisco"]
        // Can expand into as many cities as needed
        recognition.continuous = false;
        recognition.onresult = (event) => {
            const result = event.results[0][0].transcript.toLowerCase();

            let closest_place = null;
            let min_distance = Infinity;

            for (const place of valid_places) {
                const distance = this.calc_levenshtein_Distance(place.toLowerCase(), result);
                if (distance < min_distance) {
                    min_distance = distance;
                    closest_place = place;
                }
            }

            console.log(closest_place)

            if (closest_place) {
                search_bar.value = closest_place;
                weather.search();
            }
            else {
                console.log("No matches found :(");
            }
        }

        recognition.start();

        setTimeout(function() {
            recognition.stop();
            console.log("Speech recognition stopped after 15 seconds.");

        }, 15000);
    }
};

document.querySelector(".search button").addEventListener("click", function () {
    weather.search();
})

document.querySelector(".search-bar").addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
        weather.search();
    }
})
