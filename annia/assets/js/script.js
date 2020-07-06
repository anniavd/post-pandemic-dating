var cityFormEl = document.getElementById("city-form")
var textInputEl = document.getElementById("text-input");
var stateSelectEl = document.getElementById("state-select");
var submitButtonEl = document.getElementById("submit-button");
var deleteButtonEl = document.getElementById("delete-button");
var pastCitiesEl = document.getElementById("past-cities")
var victorEl = document.getElementById("victor");
var anniaEl = document.getElementById("annia");
var eventRowEl = document.getElementById("event-row")
var holidayInfoEl = document.getElementById("holiday-info");
var tylerEl = document.getElementById("tyler");
var joshuaEl = document.getElementById("joshua");
var weatherRowEl = document.getElementById("weather-row")
var formErrorsEl = document.getElementById("form-errors")
var currentCityEl = document.getElementById("current-city")
var inputCity = "";
var inputState = "";
var searchedCity = [];
var searchedState = [];
var checkStorageCity = JSON.parse(localStorage.getItem("city"))
var checkStorageState = JSON.parse(localStorage.getItem("state"))


var createCity = function(){
    formErrorsEl.innerHTML = ""
    var buttonName = inputCity.replace(/(^\w|\s\w)/g, m => m.toUpperCase()) + "," + inputState
    var cityButton = document.createElement("button")
        cityButton.className = "btn pink blue-grey"
        cityButton.textContent = buttonName
    pastCitiesEl.appendChild(cityButton);
    weatherRowEl.innerHTML = ""

    cityButton.addEventListener("click", function(event){
        event.preventDefault();
        formErrorsEl.innerHTML = ""
        weatherRowEl.innerHTML = "";
        placeArr = event.target.textContent.split(",")
        inputCity = placeArr[0]
        inputState = placeArr[1]
        getWeather(false);
    })
}
var getWeather = function(weather){
    fetch("https://api.weatherapi.com/v1/forecast.json?key=898f900d29334755948192951200207&days=3&hour=19&q=" + inputCity + "," + inputState).then(function(response){
        if (response.ok) {
            formErrorsEl.innerHTML = ""
            response.json().then(function(data) {
            // if it is a new item push into arrays and local storage and create button
            if (weather==true && !searchedCity.includes(inputCity) && data.location.country == "United States of America"){
                searchedCity.push(inputCity)
                localStorage.setItem("city", JSON.stringify(searchedCity))
                searchedState.push(inputState);
                localStorage.setItem("state", JSON.stringify(searchedState))
                createCity();
            } 
            //if button is already made this will run
           
            //if not useable
            if (data.location.country != "United States of America") {
                var errorOne = document.createElement("div")
                errorOne.className = "card col 12 red accent-4"
                errorOne.innerHTML = "<h2>City is not in the USA</h2>"
            formErrorsEl.appendChild(errorOne);
                inputCity = ""
                inputState = ""
                cityFormEl.reset();
                return
            }
            currentCityEl.innerHTML = "";
            var currentCityTitle = document.createElement("div")
                currentCityTitle.className = ""
                currentCityTitle.innerHTML = "<h2 class='col s12 card-panel pink lighten-1 center-align city-name'>" + inputCity.replace(/(^\w|\s\w)/g, m => m.toUpperCase()) + "," + inputState; + "</h2>"
                currentCityEl.appendChild(currentCityTitle);
           document.getElementById("weather").className = "row show"; 
            //else run the weather forcast
            for (var i=0; i< 3; i++) {
                var getForecast = data.forecast.forecastday[i]
              
                var forecastDate = moment(getForecast.date).format("MM/DD/YYYY")
                var weatherForecast = document.createElement("div")

                    weatherForecast.className = "col s12 m4";
                    weatherForecast.innerHTML =  "<div class='card blue-grey darken-1 z-depth-5'>"+
                        "<div class='card-content white-text'>" +
                        "<span class='card-title'>"+ forecastDate + "</span>" + "<div><img src='//cdn.weatherapi.com/weather/64x64/day/" + getForecast.day.condition.icon.slice(-7) + "'/></div>" +
                        "<p>High: "+ getForecast.day.maxtemp_f + "°F</p>"  +
                        "<p>Low: " + getForecast.day.mintemp_f + "°F</p>" + 
                        "<p>Rain: " + getForecast.day.daily_chance_of_rain + "%</p>" +
                    "</div>" +
                    "</div>"
                weatherRowEl.appendChild(weatherForecast)
                console.log(data)
                console.log(data.forecast.forecastday[0].day.avgtemp_f)
                
            }
            })  

            // if recieved a error     
        } else {
            var errorOne = document.createElement("div")
                errorOne.className = "col12 red accent-4"
                errorOne.textContent = "Something did not work. Try again."
            formErrorsEl.appendChild(errorOne);
            inputCity = ""
            inputState = ""
            cityFormEl.reset();
            return
        }
        
    })
    showEvent();
}

submitButtonEl.addEventListener("click", function(event){
    if (stateSelectEl.value == 0) {
        alert("You missed a perameter try again")
        formEl.reset();
    }
    event.preventDefault();
    inputCity = document.querySelector("input[name='city']").value.trim().toLowerCase();
    inputState = stateSelectEl.value
    cityFormEl.reset();
    getWeather(true);
}) 



//list of event by city     

function showEvent() {

    //key for the api
    var apikey = "4rwvR5WRLvh2Sb5c";
   
    // call for show events card
    document.getElementById("events").className = "row show";
    //call the API request
    //fetch(`https://api.eventful.com/json/events/search?app_key=${apikey}&keywords=music&location=${inputCity},${inputState}&date=Today`)
    fetch(`https://api.eventful.com/json/events/search?app_key=${apikey}&keywords=music&location=${inputCity},${inputState}&date=Today`)
        .then(function (response) {
                    
        if(response.ok){
           response.json().then(function (data) {
                console.log(data)
    
                for (var i = 0; i < 3; i++) {
    
                    //create element for event Info
                    var eventCity=document.createElement("div")
                    var eventInfo=document.createElement("div")
                    var divEventContainer=document.createElement("div")
                    var divEventLink=document.createElement("div")

                   //create element for show the event date
                   var dateStarClose = document.createElement("p")

                    //create element for show  the event address             
                   var eventaddress = document.createElement("p")
                    // add title to eventInfo
                    // class assignment
                    eventCity.className="col s12 m4"   
                    divEventContainer.className="card blue-grey z-depth-5"                
                    eventInfo.className="card-content white-text"  
                    divEventLink.className="card-action"           
    
                   //conditional for the event don't have date for close event
                    if (data.events.event[i].stop_time === null || data.events.event[i].stop_time === " ") {                         
                       dateStarClose.innerHTML = "Start date of the event:" + " " + moment(data.events.event[i].start_time.split(" ")[0]).format("MM/DD/YYYY");
                    }
                    else { 
                        dateStarClose.innerHTML = "Start:" + " " + moment(data.events.event[i].start_time.split(" ")[0]).format("MM/DD/YYYY") + " " +
                            "End:" + " " + moment(data.events.event[i].stop_time.split(" ")[0]).format("MM/DD/YYYY");
                    }
    
                        //condicional for the event address is emty
                    if (data.events.event[i].venue_address === null || data.events.event[i].venue_address === " ") {
    
                        eventaddress.innerHTML= "Address: Dear user more specifications on the site 😏";
                    }
                    else {
                        eventaddress.innerHTML ="Address: " + data.events.event[i].venue_address+ ".";
                    }

                     //event url for see more info
                    divEventLink.innerHTML="<a href ='"+ data.events.event[i].url +"'  target= _blank > Click here for more information. </a> "
                    
                     //event title
                    eventInfo.innerHTML= "<span class='card-title truncate'> "+ data.events.event[i].title +"</span>" ;
                    // event date
                    eventInfo.appendChild(dateStarClose) 
                    // event address
                    eventInfo.appendChild(eventaddress) 
                    //conatiner the event info
                    divEventContainer.appendChild(eventInfo)
                    divEventContainer.appendChild(divEventLink)
                    //all info
                    eventCity.appendChild(divEventContainer)
                    //all info append on page
                    eventRowEl.appendChild(eventCity)
                    
                }
             })
        }else{
            alert("Error connect to the API")
        }
    }).catch(function (error) {

        alert("Error" + " " + error.statusText)
      })
      //clear the information
      eventRowEl.innerHTML = "";  
}

  

//deletes buttons created and local storage
deleteButtonEl.addEventListener("click", function(){
    searchedCity = [];
    localStorage.setItem("city", "[]")
    localStorage.setItem("state", "[]")
    inputCity = ""
    inputState = ""
    pastCitiesEl.innerHTML = "";
    cityFormEl.reset();
})
// gets local storage data and creates buttons for those items
var oldSearchHistory = function() {
    if (!checkStorageCity || !checkStorageState) {
        return; 
    } else {
        localStorage.clear();
        for (var i =0; i < checkStorageCity.length; i++) {
            searchedCity.push(checkStorageCity[i]); 
            searchedState.push(checkStorageState[i]); 
            inputCity = checkStorageCity[i].replace(/(^\w|\s\w)/g, m => m.toUpperCase());
            inputState = checkStorageState[i];
            createCity();
        }  
        // puts all items made in for loop into localStorage
        localStorage.setItem("city", JSON.stringify(searchedCity));
        localStorage.setItem("state", JSON.stringify(searchedState))
    }   
}
oldSearchHistory();