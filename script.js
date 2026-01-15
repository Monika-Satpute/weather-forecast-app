let loadedCities = new Set();
const apiKey = "2cfe9cb0fdf1c88617748eec42b2e369";

const topWeather = document.getElementById("topWeather");
const weatherCards = document.getElementById("weatherCards");
const historyContainer = document.getElementById("historyContainer");
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherAnim = document.getElementById("weatherAnimation");

let cities = [
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad",
  "Kolkata", "Pune", "Jaipur", "Ahmedabad", "Nagpur",
  "London", "New York", "Tokyo", "Paris", "Dubai"
];

let searchHistory = [];

async function getWeather(city){
    try{
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        if(!res.ok) throw new Error("City not found");
        return await res.json();
    } catch(err){ alert(err.message); return null; }
}

function getWeatherVisuals(weather){
    weather = weather.toLowerCase();
    let bg = "";
    if(weather.includes("rain") || weather.includes("drizzle") || weather.includes("thunderstorm")){
        bg = "linear-gradient(to right, #4e54c8, #8f94fb)";
    } else if(weather.includes("cloud") || weather.includes("mist") || weather.includes("fog")){
        bg = "linear-gradient(to right, #bdc3c7, #2c3e50)";
    } else if(weather.includes("sun") || weather.includes("clear")){
        bg = "linear-gradient(to right, #fceabb, #f8b500)";
    } else if(weather.includes("snow")){
        bg = "linear-gradient(to right, #83a4d4, #b6fbff)";
    } else if(weather.includes("hot") || weather.includes("warm")){
        bg = "linear-gradient(to right, #f83600, #f9d423)";
    } else {
        bg = "linear-gradient(to right, #74ebd5, #9face6)";
    }
    return {bg};
}

function createCardHTML(data){
    const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    return `
        <div class="weather-card">
            <h3>${data.name}</h3>
            <img src="${icon}" alt="Weather Icon">
            <p>${data.weather[0].description}</p>
            <p>🌡 Temp: ${data.main.temp} °C</p>
            <p>💧 Humidity: ${data.main.humidity}%</p>
            <p>🌬 Wind: ${data.wind.speed} m/s</p>
        </div>
    `;
}

// --- Set weather animation ---
function setWeatherAnimation(weather){
    weatherAnim.innerHTML = "";
    weather = weather.toLowerCase();
    if(weather.includes("rain") || weather.includes("drizzle") || weather.includes("thunderstorm")){
        weatherAnim.className = "rain";
        for(let i=0;i<80;i++){
            const drop = document.createElement("div");
            drop.className = "drop";
            drop.style.left = Math.random()*100 + "vw";
            drop.style.animationDuration = 0.5 + Math.random()*0.5 + "s";
            drop.style.height = 10 + Math.random()*20 + "px";
            weatherAnim.appendChild(drop);
        }
    }
    else if(weather.includes("cloud") || weather.includes("mist") || weather.includes("fog")){
        weatherAnim.className = "cloudy";
        for(let i=0;i<5;i++){
            const cloud = document.createElement("div");
            cloud.className = "cloud";
            cloud.style.top = Math.random()*50 + "px";
            cloud.style.animationDuration = 30 + Math.random()*30 + "s";
            weatherAnim.appendChild(cloud);
        }
    }
    else if(weather.includes("sun") || weather.includes("clear")){
        weatherAnim.className = "sunny-animation";
    }
    else if(weather.includes("snow")){
        weatherAnim.className = "snow";
        for(let i=0;i<50;i++){
            const flake = document.createElement("div");
            flake.className = "flake";
            flake.style.left = Math.random()*100 + "vw";
            flake.style.animationDuration = 2 + Math.random()*3 + "s";
            flake.style.width = 3 + Math.random()*3 + "px";
            flake.style.height = flake.style.width;
            weatherAnim.appendChild(flake);
        }
    }
    else if(weather.includes("hot") || weather.includes("warm")){
        weatherAnim.className = "heat-wave";
    }
    else { weatherAnim.className = ""; }
}

// --- Load top weather ---
async function loadTopWeather(city){
    const data = await getWeather(city);
    if(!data) return;
    topWeather.innerHTML = createCardHTML(data);

    const visuals = getWeatherVisuals(data.weather[0].description);
    document.body.style.background = visuals.bg;
    document.querySelector('.search-history').style.background = "rgba(255,255,255,0.25)";

    setWeatherAnimation(data.weather[0].description);

    if(!searchHistory.includes(data.name)){
        searchHistory.unshift(data.name);
        if(searchHistory.length>5) searchHistory.pop();
        updateHistoryUI();
    }
}

// --- Horizontal scroll cards ---
async function loadHorizontalCards(){
    weatherCards.innerHTML = "";
    loadedCities.clear();
    for(let city of cities){
        const data = await getWeather(city);
        if(data && !loadedCities.has(data.name)){
            weatherCards.innerHTML += createCardHTML(data);
            loadedCities.add(data.name);
        }
    }
}

// --- Search History ---
function updateHistoryUI(){
    historyContainer.innerHTML = "";
    searchHistory.forEach(city=>{
        const div = document.createElement("div");
        div.className="history-item";
        div.textContent = city;
        div.onclick = ()=> loadTopWeather(city);
        historyContainer.appendChild(div);
    });
}

// --- Search ---
searchBtn.addEventListener("click", async ()=>{
    const city = cityInput.value.trim();
    if(!city) return alert("Enter city name");
    const data = await getWeather(city);
    if(!data) return;
    loadTopWeather(city);
    if(!loadedCities.has(data.name)){
        weatherCards.innerHTML += createCardHTML(data);
        loadedCities.add(data.name);
    }
    cityInput.value="";
});

// --- Initialize ---
window.addEventListener("load", ()=>{
    loadTopWeather("Pune");
    loadHorizontalCards();
});
