var searchHistory = JSON.parse(localStorage.getItem("search")) || [];
const history = document.querySelector("#history");

let weather ={
    apiKey: "fe4fff594a4888855d1b1cb52405061f",
    fetchWeather: function (city) {
        fetch("https://api.openweathermap.org/data/2.5/forecast?q="
        + city + "&units=metric&appid=" + this.apiKey
        ).then((response) => response.json()).then((data) =>
        this.displayWeather(data));//when "weather.fetchWeather()" is entered in the console or called, it will fetch the data from the weather api
    },
    displayWeather: function(data) {
        console.log(data);
        //breaking down the data object into variables that I can work with
        const cityName = data.city.name;
        const temperature = data.list[0].main.temp;
        const humidity = data.list[0].main.humidity;
        const windSpeed = data.list[0].wind.speed;
        const icon = data.list[0].weather[0].icon;
        //replacing the default text with search results info
        document.querySelector("#cityName").innerText = cityName;
        document.querySelector("#temperature").innerText = temperature + "°C";
        document.querySelector("#currentIcon").src = "https://openweathermap.org/img/wn/" + icon +"@2x.png";
        document.querySelector("#humidity").innerHTML = "Humidity: " + humidity + "%";
        document.querySelector("#windSpeed").innerHTML = "Wind Speed: " + windSpeed + "km/h";
        document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?"+ cityName + "')";


        var today = new Date(data.list[0].dt*1000);
        //console.log(today);
        var day = today.getDate();
        var month = today.getMonth() + 1;
        var year = today.getFullYear();

        document.querySelector("#date").innerHTML = "(" + month + "/" + day + "/" + year + ")";

        const fiveDayForecast = document.querySelectorAll(".five-day-forecast");
        for(var c = 0; c < fiveDayForecast.length; c++){
            var fiveDayForecastDate = new Date(data.list[c * 8 + 4].dt * 1000);
            /*
            Open weather api object data has a day time value that must be converted to be read easily.
            However, the default hour is always set to 8pm (from what I can tell so far).
            This means that to get the accurate 5 day forecast, the time mut be manipulated to an extent,
            to read the future data easily.
            (multiplying the index by 8 gives data of 4am every day, therefore adding 4 to that value
                yeilds the data for a much more desirably 8am)
            */
            //Date of this index
            var fiveDayForecastDay = fiveDayForecastDate.getDate();
            var fiveDayForecastMonth = fiveDayForecastDate.getMonth() + 1;
            var fiveDayForecastYear = fiveDayForecastDate.getFullYear();
            var fiveDayForecastDateEl = document.createElement("p");
            fiveDayForecastDateEl.innerHTML = fiveDayForecastMonth + "/" + fiveDayForecastDay + "/" + fiveDayForecastYear;
            
            //Temperature of this index
            var fiveDayForecastTemperature = document.createElement("p");
            fiveDayForecastTemperature.innerHTML = "Temp: " + data.list[c * 8 + 4].main.temp;
            //Humidity of this index
            var fiveDayForecastHumidity = document.createElement("p");
            fiveDayForecastHumidity.innerHTML = "Humidity: " + data.list[c * 8 + 4].main.humidity;
            //Windspeed of this index
            var fiveDayForecastWindSpeed = document.createElement("p");
            fiveDayForecastWindSpeed.innerHTML = "Windspeed: " + data.list[c * 8 + 4].wind.speed;
            //Weather Icon of this index
            var fiveDayForecastIcon = document.createElement("img");
            fiveDayForecastIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + data.list[c * 8 + 4].weather[0].icon +"@2x.png");
            //appending in appropriate order
            fiveDayForecast[c].append(fiveDayForecastDateEl);
            fiveDayForecast[c].append(fiveDayForecastIcon);
            fiveDayForecast[c].append(fiveDayForecastTemperature);
            fiveDayForecast[c].append(fiveDayForecastHumidity);
            fiveDayForecast[c].append(fiveDayForecastWindSpeed);

        }
    },
    search: function (city){
        this.fetchWeather(city);
        searchHistory.push(city);
        localStorage.setItem("search", JSON.stringify(searchHistory));
        loadHistory();
    }
};

document.querySelector("#searchBtn").addEventListener("click", function() {
    clearCurrentForecast();
    clearFiveDayForecast();
    weather.search(document.querySelector("#searchCity").value);//search with button click
});

document.querySelector("#searchCity").addEventListener("keyup", function(event) {
    if(event.key== "Enter"){
        clearCurrentForecast();
        clearFiveDayForecast();
        weather.search(document.querySelector("#searchCity").value);//search with button click
    }
});

function clearFiveDayForecast(){
    /*
    The following is made to fix a bug where the forecast card's dont clear on every search but rather
    keeps appending underneath the older searches in the same session. This is ofcourse not desirable.
    Solution: delete cards on every search and add new, clean, empty ones.
    */
    var e = document.querySelector(".FiveDayForecast");
    var child = e.lastElementChild;
    while(child){
        e.removeChild(child);
        child = e.lastElementChild;
    }

    var forecastCards = document.createElement("div");
    forecastCards.setAttribute("class", "col five-day-forecast");
    e.appendChild(forecastCards.cloneNode(true));
    e.appendChild(forecastCards.cloneNode(true));
    e.appendChild(forecastCards.cloneNode(true));
    e.appendChild(forecastCards.cloneNode(true));
    e.appendChild(forecastCards.cloneNode(true));
}

function clearCurrentForecast(){
    document.querySelector("#cityName").innerText = "";
    document.querySelector("#temperature").innerText = "°C";
    document.querySelector("#currentIcon").src = "";
    document.querySelector("#humidity").innerHTML = "%";
    document.querySelector("#windSpeed").innerHTML = "km/h";
    document.querySelector("#date").innerHTML = "";
}

function loadHistory(){
    history.innerHTML = "";
    searchHistory = [...new Set(searchHistory)];
    for(var c = 0; c < searchHistory.length; c++){
        console.log(searchHistory[c] + " " + c);
        let searched = document.createElement("input");
        searched.setAttribute("type", "text");
        searched.setAttribute("readonly", true);
        searched.setAttribute("class", "searched-item");
        searched.setAttribute("value", searchHistory[c]);
        searched.addEventListener("click", function(){
            clearCurrentForecast();
            clearFiveDayForecast();
            document.querySelector("#searchCity").value = searched.value;
            weather.search(searched.value);
            console.log(searched.value);
        });
        history.append(searched);
    }
    
}


//Default load Toronto's weather info
weather.fetchWeather("Toronto");
//localStorage.clear();