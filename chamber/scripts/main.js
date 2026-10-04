// COPYTIGHT YEAR

const currentYear = new Date().getFullYear();

const yearElement = document.querySelector("#currentyear");

yearElement.textContent = currentYear;

// LAST MODIFIED DATE
const modifiedElement = document.querySelector("#lastModified");
modifiedElement.textContent = document.lastModified;

// ============================================================
// UTILITY — escape user-supplied text before inserting as HTML.
// Prevents special characters (<, >, &, quotes) from breaking
// the markup or allowing injected tags.
// ============================================================
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

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

      // Fall back to "member" if membership level is missing, so
      // .toUpperCase() never throws on an undefined value.
      const level = company.membership || "member";

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

// ============================================================
// THEME TOGGLE — always starts in light mode on every page load
// (no saved preference is restored from localStorage, by design).
// ============================================================
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

// ============================================================
// HAMBURGER NAVIGATION — toggles the mobile nav menu open/closed.
// ============================================================
const navButton = document.querySelector("#ham-btn");
const navlinks = document.querySelector("#nav-bar");

navButton.addEventListener("click", () => {
  navButton.classList.toggle("show");
  navlinks.classList.toggle("show");
});

// ============================================================
// HOME PAGE — CURRENT WEATHER
// ============================================================
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

// ============================================================
// HOME PAGE — 3-DAY WEATHER FORECAST
// ============================================================
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

// ============================================================
// JOIN PAGE — stamps the hidden #timestamp field right at submit
// time (not page load), so it reflects when the form was actually sent.
// ============================================================

/**
 * Sets the current date and time in the hidden timestamp field on join.html.
 */
function setFormTimestamp() {
  // Only run if the timestamp field element exists
  const timestampField = document.getElementById("timestamp");
  if (timestampField) {
    // Use ISO String for precise, standardized date/time submission
    timestampField.value = new Date().toISOString();
  }
}

/**
 * Displays submitted form data on the thankyou.html page.
 */
function displayThankYouData() {
  const displaySection = document.getElementById("form-data-display");

  // Only run if we are on the thankyou page
  if (!displaySection) return;

  const params = new URLSearchParams(window.location.search);

  // Define the required fields to display (must match 'name' attributes in join.html form)
  const fieldsToDisplay = {
    fname: "First Name",
    lname: "Last Name",
    email: "Email Address",
    phone: "Mobile Number",
    orgname: "Business Name",
    timestamp: "Application Time",
  };

  let htmlContent = "<ul>";

  for (const [paramName, friendlyName] of Object.entries(fieldsToDisplay)) {
    const value = params.get(paramName);
    if (value) {
      let displayValue = value;

      // Format the timestamp for better readability
      if (paramName === "timestamp") {
        try {
          const date = new Date(value);
          displayValue =
            date.toLocaleDateString("en-US") +
            " at " +
            date.toLocaleTimeString("en-US");
        } catch (e) {
          // Fallback to raw value
        }
      }

      htmlContent += `<li><strong>${friendlyName}:</strong> ${displayValue}</li>`;
    }
  }

  htmlContent += "</ul>";

  // Append content, preserving any initial message in the div
  displaySection.innerHTML += htmlContent;
}

// ============================================================
// JOIN PAGE — modal dialogs for membership benefit details.
// Uses the native <dialog> element's showModal()/close() methods.
// ============================================================
function setupModals() {
  const modalButtons = document.querySelectorAll(".modal-link[data-modal]");

  modalButtons.forEach((button) => {
    const modalId = button.getAttribute("data-modal");
    const modal = document.getElementById(modalId);
    if (!modal) return;

    button.addEventListener("click", () => modal.showModal());

    const closeButton = modal.querySelector(".close-modal");
    if (closeButton) {
      closeButton.addEventListener("click", () => modal.close());
    }

    modal.addEventListener("click", (e) => {
      const dialogDimensions = modal.getBoundingClientRect();
      if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
      ) {
        modal.close();
      }
    });
  });
}

// ===================================
// RUN JOIN / THANK YOU PAGE LOGIC
// ===================================
setupModals();

// Set the timestamp right when the form is submitted, not on page load,
// so it reflects the actual submission time
const membershipForm = document.querySelector(".membership-form");
if (membershipForm) {
  membershipForm.addEventListener("submit", () => {
    setFormTimestamp();
  });
}

displayThankYouData(); // safe no-op on pages without #form-data-display

// ============================================================
// DISCOVER PAGE — attractions grid
// ============================================================
async function loadAttractions() {
  const attractionsGrid = document.getElementById("attractionsGrid");
  if (!attractionsGrid) return; // not on this page

  try {
    // Fetch attractions data
    const response = await fetch("data/attractions.json");
    if (!response.ok) throw new Error("Network response was not ok");

    const attractions = await response.json();
    displayAttractions(attractions, attractionsGrid);
  } catch (error) {
    console.error("Error loading attractions:", error);
    attractionsGrid.innerHTML =
      "<p>Error loading attractions. Please try again later.</p>";
  }
}

/**
 * Display attractions in grid
 */
function displayAttractions(attractions, container) {
  container.innerHTML = "";

  attractions.forEach((attraction) => {
    const card = document.createElement("div");
    card.className = "attraction-card";

    card.innerHTML = `
            <h2>${escapeHtml(attraction.name)}</h2>
            <figure>
                <img src="${attraction.image}" 
                     alt="${escapeHtml(attraction.name)}" 
                     loading="lazy"
                     width="300" 
                     height="200">
            </figure>
            <address>${escapeHtml(attraction.address)}</address>
            <p>${escapeHtml(attraction.description)}</p>
            <button type="button" onclick="window.open('https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(attraction.address)}', '_blank')">
                Learn More
            </button>
        `;

    container.appendChild(card);
  });
}

// ============================================================
// DISCOVER PAGE — "last visited" message using localStorage.
// ============================================================
function displayVisitMessage() {
  const visitMessageContainer = document.getElementById("visitMessage");
  if (!visitMessageContainer) return; // not on this page

  const now = Date.now();
  const lastVisit = localStorage.getItem("lastVisitDiscover");

  let message = "";

  if (!lastVisit) {
    // First visit
    message = "🎉 Welcome! Let us know if you have any questions.";
  } else {
    const lastVisitTime = parseInt(lastVisit);
    const timeDiff = now - lastVisitTime;
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (daysDiff < 1) {
      // Less than a day
      message = "👋 Back so soon! Awesome!";
    } else if (daysDiff === 1) {
      // Exactly 1 day
      message = `📅 You last visited 1 day ago.`;
    } else {
      // More than 1 day
      message = `📅 You last visited ${daysDiff} days ago.`;
    }
  }

  // Store current visit
  localStorage.setItem("lastVisitDiscover", now.toString());

  // Display message
  visitMessageContainer.textContent = message;
}

// ============================================================
// SINGLE INITIALIZATION ENTRY POINT
// Each init function internally checks whether its elements exist,
// so it's safe to call all of them on every page — only the
// relevant ones actually do anything on a given page.
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  // Discover page widgets
  if (document.getElementById("attractionsGrid")) {
    displayVisitMessage();
    loadAttractions();
  }

  // Mark lazy-loaded images once they've actually loaded (useful if you
  // want to fade them in via a [data-loaded="true"] CSS selector)
  document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
    img.addEventListener("load", () => img.setAttribute("data-loaded", "true"));
  });
});
