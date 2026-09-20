// COPYTIGHT YEAR

const currentYear = new Date().getFullYear();

const yearElement = document.querySelector("#currentyear");

yearElement.textContent = currentYear;

// LAST MODIFIED DATE
const modifiedElement = document.querySelector("#lastModified");
modifiedElement.textContent = document.lastModified;

// MAIN CONTENT
const directory = document.querySelector("#directory");
const gridBtn = document.querySelector("#gridBtn");
const listBtn = document.querySelector("#listBtn");

// Only run directory logic on the directory page
if (directory && gridBtn && listBtn) {
  //Fetch and render once the page loads
  async function loadCompanies() {
    try {
      const response = await fetch("data/members.json");
      const companies = await response.json();
      displayCompanies(companies);
    } catch (error) {
      console.error("Error loading companies:", error);
      directory.textContent = "Failed to load company data.";
    }
  }

  // COMPANY DISPLAY FUNCTION
  function displayCompanies(companies) {
    directory.innerHTML = "";

    companies.forEach((company) => {
      const card = document.createElement("div");
      card.classList.add("company-card");

      card.innerHTML = `
      <img src="${company.image}" alt="${company.name} logo" class="card-image">
      <div class="card-body">
          <h3>${company.name}</h3>
          <p class="tagline">${company.tag}</p>        
          <p class="detail"><strong>EMAIL:</strong> <a href="mailto:${company.email}"> ${company.email}</a></p>
          <p class="detail"><strong>PHONE:</strong> ${company.phone}</p>
          <p class="detail"><strong>URL:</strong> <a href="${company.url}" target="_blank"> ${company.url}</a></p>
          <span class="badge ${company.membership}">🏅 ${company.membership.toUpperCase()} MEMBER</span>
      </div>
      `;

      directory.appendChild(card);
    });
  }

  //Grid / List toggle
  gridBtn.addEventListener("click", () => {
    directory.classList.add("grid");
    directory.classList.remove("list");
    gridBtn.classList.add("active");
    listBtn.classList.remove("active");
  });

  listBtn.addEventListener("click", () => {
    directory.classList.add("list");
    directory.classList.remove("grid");
    listBtn.classList.add("active");
    gridBtn.classList.remove("active");
  });

  loadCompanies();
}

//THEME TOGGLE — always starts in light mode on every page load
const themeToggle = document.querySelector(".theme-toggle");
const root = document.documentElement;

root.removeAttribute("data-theme"); // force light mode on load, no saved preference restored

themeToggle.addEventListener("click", () => {
  const isDark = root.getAttribute("data-theme") === "dark";

  if (isDark) {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", "dark");
  }
});

// NAVIGATION BUTTON
const navButton = document.querySelector("#ham-btn");
const navlinks = document.querySelector("#nav-bar");

navButton.addEventListener("click", () => {
  navButton.classList.toggle("show");
  navlinks.classList.toggle("show");
});

// ============================
// UTILITY — escape user-supplied text before inserting as HTML
// ============================
function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// WEATHER SECTION

const lat = 6.61; // Lagos, Nigeria latitude
const lon = 3.35; // lagos, Nigeria longitude
const API_KEY = "385fcdaf0c3aecef6cce40d5fbd00265";
async function fetchCurrentWeather() {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) throw new Error("Weather data not available");

    const data = await response.json();
    displayCurrentWeather(data);
  } catch (error) {
    console.error("Error fetching current weather:", error);
    const weatherIcon = document.getElementById("weatherIcon");
    const currentTemp = document.getElementById("currentTemp");
    const weatherDescription = document.getElementById("weatherDescription");

    if (weatherIcon) weatherIcon.alt = "Weather unavailable";
    if (currentTemp) currentTemp.textContent = "N/A";
    if (weatherDescription)
      weatherDescription.textContent = "Unable to load weather data";
  }
}

function displayCurrentWeather(data) {
  const weatherIcon = document.getElementById("weatherIcon");
  const currentTemp = document.getElementById("currentTemp");
  const weatherDescription = document.getElementById("weatherDescription");
  const highTemp = document.getElementById("highTemp");
  const lowTemp = document.getElementById("lowTemp");
  const humidity = document.getElementById("humidity");
  const sunrise = document.getElementById("sunrise");
  const sunset = document.getElementById("sunset");

  if (weatherIcon) {
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.alt = data.weather[0].description;
  }

  if (currentTemp) currentTemp.textContent = `${Math.round(data.main.temp)}°F`;
  if (weatherDescription)
    weatherDescription.textContent = data.weather[0].description;
  if (highTemp) highTemp.textContent = `${Math.round(data.main.temp_max)}°F`;
  if (lowTemp) lowTemp.textContent = `${Math.round(data.main.temp_min)}°F`;
  if (humidity) humidity.textContent = `${data.main.humidity}%`;

  if (sunrise) {
    const sunriseTime = new Date(data.sys.sunrise * 1000);
    sunrise.textContent = sunriseTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  if (sunset) {
    const sunsetTime = new Date(data.sys.sunset * 1000);
    sunset.textContent = sunsetTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
}

// ============================
// HOME PAGE - WEATHER FORECAST
// ============================
async function fetchWeatherForecast() {
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) throw new Error("Forecast data not available");

    const data = await response.json();
    displayWeatherForecast(data);
  } catch (error) {
    console.error("Error fetching weather forecast:", error);
    const forecastList = document.getElementById("forecastList");
    if (forecastList) {
      forecastList.innerHTML = "<p>Unable to load forecast data</p>";
    }
  }
}

function displayWeatherForecast(data) {
  const forecastList = document.getElementById("forecastList");
  if (!forecastList) return;

  // Get forecasts for the next 3 days (at noon)
  const dailyForecasts = [];
  const processedDates = new Set();

  for (let item of data.list) {
    const date = new Date(item.dt * 1000);
    const dateString = date.toLocaleDateString();
    const hour = date.getHours();

    // Get one forecast per day around midday (11am-1pm)
    if (
      hour >= 11 &&
      hour <= 13 &&
      !processedDates.has(dateString) &&
      dailyForecasts.length < 3
    ) {
      dailyForecasts.push({
        day: date.toLocaleDateString("en-US", { weekday: "long" }),
        temp: Math.round(item.main.temp),
        icon: item.weather[0].icon,
        description: item.weather[0].description,
      });
      processedDates.add(dateString);
    }
  }

  forecastList.innerHTML = dailyForecasts
    .map(
      (forecast) => `
        <div class="forecast-item">
            <span class="forecast-day-name">${forecast.day}</span>
            <span class="forecast-temp">${forecast.temp}°F</span>
        </div>
    `,
    )
    .join("");
}

// ============================
// HOME PAGE - MEMBER SPOTLIGHTS
// ============================
async function loadSpotlights() {
  const spotlightsGrid = document.getElementById("spotlightsGrid");
  if (!spotlightsGrid) return;

  try {
    const response = await fetch("data/members.json");
    if (!response.ok) throw new Error("Network response was not ok");

    const members = await response.json();
    displaySpotlights(members, spotlightsGrid);
  } catch (error) {
    console.error("Error loading spotlights:", error);
    spotlightsGrid.innerHTML =
      "<p>Error loading member spotlights. Please try again later.</p>";
  }
}

function displaySpotlights(members, container) {
  // Filter for Gold and Silver members only
  const qualifiedMembers = members.filter(
    (member) => member.membership === "gold" || member.membership === "silver",
  );

  // Randomly select 2 or 3 members per assignment requirements
  const numSpotlights = Math.random() > 0.5 ? 3 : 2;
  const selectedMembers = getRandomMembers(qualifiedMembers, numSpotlights);

  container.innerHTML = selectedMembers
    .map((member) => {
      const badgeClass =
        member.membership === "gold" ? "badge-gold" : "badge-silver";
      const badgeText =
        member.membership === "gold" ? "🥇 Gold Member" : "🥈 Silver Member";

      return `
            <div class="spotlight-card">
                <div class="spotlight-header">
                    <h3 class="spotlight-name">${escapeHtml(member.name)}</h3>
                    <p class="spotlight-tagline">${escapeHtml(member.tag || "")}</p>
                </div>
                <div class="spotlight-content">
                    <div class="spotlight-image-wrapper">
                        <img src="${member.image}" alt="${escapeHtml(member.name)}" class="spotlight-image" loading="lazy">
                    </div>
                    <div class="spotlight-contact">
                        ${member.email ? `<p><strong>EMAIL:</strong> <a href="mailto:${member.email}">${escapeHtml(member.email)}</a></p>` : ""}
                        ${member.phone ? `<p><strong>PHONE:</strong> ${escapeHtml(member.phone)}</p>` : ""}
                        ${member.url ? `<p><strong>URL:</strong> <a href="${member.url}" target="_blank" rel="noopener">${escapeHtml(member.url)}</a></p>` : ""}
                        <span class="badge ${badgeClass} spotlight-badge">${badgeText}</span>
                    </div>
                </div>
            </div>
        `;
    })
    .join("");
}

function getRandomMembers(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// ============================
// INITIALIZE HOME PAGE WIDGETS (only runs if their elements exist)
// ============================
if (document.getElementById("weatherIcon")) {
  fetchCurrentWeather();
  fetchWeatherForecast();
}
if (document.getElementById("spotlightsGrid")) {
  loadSpotlights();
}
