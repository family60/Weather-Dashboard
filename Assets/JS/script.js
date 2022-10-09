let weather ={
    apiKey: "fe4fff594a4888855d1b1cb52405061f",
    fetchWeather: function (city) {
        fetch("http://api.openweathermap.org/data/2.5/forecast?q="
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
        console.log(cityName, temperature, humidity, windSpeed, icon);
        //replacing the default text with search results info
        document.querySelector("#cityName").innerText = "Weather in " + cityName;
        document.querySelector("#temperature").innerText = temperature + "°C";
        document.querySelector("#currentIcon").src = "https://openweathermap.org/img/wn/" + icon +"@2x.png";
        document.querySelector("#humidity").innerHTML = "Humidity: " + humidity + "%";
        document.querySelector("#windSpeed").innerHTML = "Wind Speed: " + windSpeed + "km/h";
        document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?"+ cityName + "')";

        /*
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = mm + '/' + dd + '/' + yyyy;
        console.log(today);
        */

        var today = new Date(data.list[0].dt*1000);
        console.log(today);
        var day = today.getDate();
        var month = today.getMonth();
        var year = today.getFullYear();

        document.querySelector("#date").innerHTML = "(" + month + "/" + day + "/" + year + ")";
    },
    search: function (){
        this.fetchWeather(document.querySelector("#searchCity").value);
    }
};

document.querySelector("#searchBtn").addEventListener("click", function() {
    weather.search();//search with button click
});

document.querySelector("#searchCity").addEventListener("keyup", function(event) {
    if(event.key== "Enter"){
        weather.search();//search with button click
    }
});

//Default load Toronto's weather info
weather.fetchWeather("Toronto");