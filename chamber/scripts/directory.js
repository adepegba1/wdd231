// COPYTIGHT YEAR

const currentYear = new Date().getFullYear();

const yearElement = document.querySelector("#currentyear");

yearElement.textContent = currentYear;

// LAST MODIFIED DATE
const modifiedElement = document.querySelector("#lastModified");
modifiedElement.textContent = document.lastModified;

const directory = document.querySelector("#directory");
const gridBtn = document.querySelector("#gridBtn");
const listBtn = document.querySelector("#listBtn");

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

const themeToggle = document.querySelector(".theme-toggle");
const root = document.documentElement;

// Apply saved theme on page load (before user even clicks)
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  root.setAttribute("data-theme", "dark");
}

// Toggle theme on click
themeToggle.addEventListener("click", () => {
  const isDark = root.getAttribute("data-theme") === "dark";

  if (isDark) {
    root.removeAttribute("data-theme");
    localStorage.setItem("theme", "light");
  } else {
    root.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  }
});

const navButton = document.querySelector("#ham-btn");
const navlinks = document.querySelector("#nav-bar");

navButton.addEventListener("click", () => {
  navButton.classList.toggle("show");
  navlinks.classList.toggle("show");
});
