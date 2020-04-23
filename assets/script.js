$(document).ready(function () {

    //Calling last searched city out of local storage
    var weather = JSON.parse(localStorage.getItem("weather")) || []
    if (weather[weather.length] > 0) {
    current(weather[weather.length - 1])
    }


    //When the city is searched, it is added to the list of searched cities
    $(".list").on("click", ".list-group-item", function () {
        var cityClicked = $(this).attr("data-name")
        current(cityClicked, "old")
    })

    //Searched city becomes a card in a list
    function cityInfo() {

        var city = JSON.parse(localStorage.getItem("weather"))
        var theList = $("<ul>").addClass("list-group")
        if (city) {

            for (var i = 0; i < city.length; i++) {
                var nameDiv = $('<li>').addClass("list-group-item")
                nameDiv.text(city[i])
                nameDiv.attr("data-name", city[i])
                theList.prepend(nameDiv)

            }
            $(".list").html("")
            $(".list").append(theList)
        }
    }
    $("#searchBTN").click(function () {
        event.preventDefault();
        var cityToSearch = $("#search").val()
        var cityID = $("#search").val()
        current(cityToSearch, "new")
    })

    //Five-day forecast
    function fiveDay(cityID) {
        var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=c55054d69fe933e8a6f2b946136a8302&units=imperial"
        $.get(fiveDayURL).then(function (response) {
            var title = $("<h3>").text("5-Day Forecast")
            $("#info").append(title)
            for (var i = 0; i < response.list.length; i++) {
                var icon = $("<img src='https://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png'>")
                var current = moment(response.list[i].dt_txt)
                if (response.list[i].dt_txt.includes("15:00:00")) {
                    var day = $("<div>").addClass("card col-sm-2 ml-1 float-left text-white bg-primary")
                    $("#info").append(day)
                    var date = $('<div>').text(current.format('l'))
                    var temp = $('<div>').text("Temp: " + response.list[i].main.temp + " \xB0F")
                    var humidity = $("<div>").text("Humidity: " + response.list[i].main.humidity + "%")
                    day.append(date)
                    day.append(icon)
                    day.append(temp)
                    day.append(humidity)
                }

            }
        })
    }

    //Current city's information and icon
    function current(cityToSearch, age) {
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityToSearch + "&appid=c55054d69fe933e8a6f2b946136a8302&units=imperial"
        $.get(queryURL).then(function (results) {

            var currentWeather = $('<div>').addClass("card pl-2")
            var now = moment().format('l');
            var $h2 = $("<h2>").text(results.name + " (" + now + ")");
            $h2.text(results.name + " (" + now + ")")
            var icon = $("<img src='https://openweathermap.org/img/wn/" + results.weather[0].icon + "@2x.png'>")
            $h2.append(icon)
            var temp = $("<div>").text("Temperature: " + results.main.temp + " \xB0F")
            var humidity = $("<div>").text("Humidity: " + results.main.humidity + "%")
            var windSpeed = $("<div>").text("Wind Speed: " + results.wind.speed + " MPH")

            fiveDay(results.id)
            currentWeather.append($h2)
            currentWeather.append(temp)
            currentWeather.append(humidity)
            currentWeather.append(windSpeed)

            //UV Index
            var uv = "https://api.openweathermap.org/data/2.5/uvi?appid=c55054d69fe933e8a6f2b946136a8302&lat=" + results.coord.lat + "&lon=" + results.coord.lon
            $.get(uv).then(function (uvresults) {
                var uvnum = $("<span>").text(uvresults.value)
                var uvi = $("<div>").text("UV Index: ")
                currentWeather.append(uvi)

                if (uvresults.value <= 2) {
                    var fair = $(uvnum).addClass("badge bg-success text-white")
                    uvi.append(fair)
                }
                if (uvresults.value > 2 && uvresults.value < 7) {
                    var mod = $(uvnum).addClass("badge bg-warning")
                    uvi.append(mod)
                }
                if (uvresults.value > 7) {
                    var sev = $(uvnum).addClass("badge bg-danger text-white")
                    uvi.append(sev)
                }
            })

            //Empties the previous current weather
            $("#info").text("") 
            $("#info").append(currentWeather)
            if (age === "new") {
                var local = JSON.parse(localStorage.getItem("weather"))
                if (!local) {
                    local = []
                }
                if (local.length === 5) {
                    local.shift();
                }
                local.push(results.name)
                localStorage.setItem("weather", JSON.stringify(local))
                cityInfo()
            }
        })
    }
    function start(){
        var previous = JSON.parse(localStorage.getItem("weather"))
        if(previous){
            current(previous[previous.length-1], "old")
        }
    }
    cityInfo()
    start()
});

