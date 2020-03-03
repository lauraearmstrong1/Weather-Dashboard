$(document).ready(function () {

    $(".list").on("click",".list-group-item", function(){
       var cityClicked = $(this).attr("data-name")
       current(cityClicked ,"old")
    })
    function cityInfo() {

        var city = JSON.parse(localStorage.getItem("weather"))
   
       
        var theList = $("<ul>").addClass("list-group")
        if(city){

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
        var cityToSearch = $("#search").val()
        current(cityToSearch, "new")
    })

    //function fiveDay(cityID)

    function current(cityToSearch, age) {
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityToSearch + "&appid=c55054d69fe933e8a6f2b946136a8302&units=imperial"
        $.get(queryURL).then(function (results) {
            var currentWeather = $('<div>').addClass("card")
            var now = moment().format('l');
            var $h2 = $("<h2>").text(results.name + " (" + now + ")");
            $h2.text(results.name + " (" + now + ")")
            var icon = $("<img src='http://openweathermap.org/img/wn/" + results.weather[0].icon + "@2x.png'>")
            $h2.append(icon)
            var temp = $("<div>").text("Temperature: " + results.main.temp + " F")
            var humidity = $("<div>").text("Humidity: " + results.main.humidity + "%")
            var windSpeed = $("<div>").text("Wind Speed: " + results.wind.speed + " MPH")
            currentWeather.append($h2)
            currentWeather.append(temp)
            currentWeather.append(humidity)
            currentWeather.append(windSpeed)
            $("#info").text("") //empties the previous current weather
            $("#info").append(currentWeather)
            if(age ==="new"){
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
                //fiveDay(cityID)
            }
        })
    }
    cityInfo()

});

