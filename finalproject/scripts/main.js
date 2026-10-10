// COPYTIGHT YEAR

const currentYear = new Date().getFullYear();

const yearElement = document.querySelector("#currentyear");

yearElement.textContent = currentYear;

// LAST MODIFIED DATE
const modifiedElement = document.querySelector("#lastModified");
modifiedElement.textContent = document.lastModified;

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

function setFormTimestamp() {
  // Only run if the timestamp field element exists
  const timestampField = document.getElementById("timestamp");
  if (timestampField) {
    // Use ISO String for precise, standardized date/time submission
    timestampField.value = new Date().toISOString();
  }
}

setFormTimestamp();

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

setupModals();

function displayThankYouData() {
  const displaySection = document.getElementById("form-data-display");

  // Only run if we are on the thankyou page
  if (!displaySection) return;

  const params = new URLSearchParams(window.location.search);

  // Define the required fields to display (must match 'name' attributes in the contact form)
  const fieldsToDisplay = {
    fname: "First Name",
    lname: "Last Name",
    email: "Email Address",
    phone: "Mobile Number",
    skill: "Skill Type",
    level: "Skill Level Needed",
    timestamp: "Message Time",
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

displayThankYouData();

// ============================================================
// PORTFOLIO PAGE
// Everything below only runs when #projectsGrid exists, so the
// other pages (home, contact, thank you) never touch it and the
// visit counter only counts real portfolio visits.
// ============================================================

// Select the parts of the portfolio page JavaScript needs to update.
const projectsGrid = document.querySelector("#projectsGrid");
const filterButtons = document.querySelectorAll(".filter-btn");
const visitMessage = document.querySelector("#visitMessage");

// All projects read from data/projects.json are stored here,
// so the filter buttons can reuse them without fetching again.
let allProjects = [];

// ------------------------------------------------------------
// 1. LOAD PROJECTS FROM THE JSON FILE
// ------------------------------------------------------------
async function loadProjects() {
  try {
    const response = await fetch("data/projects.json");

    // fetch() does not throw on 404/500, so check the status ourselves.
    if (!response.ok) {
      throw new Error(`Could not load projects (status ${response.status})`);
    }

    allProjects = await response.json();

    displayProjects(allProjects);
  } catch (error) {
    console.error("Error loading projects:", error);

    projectsGrid.textContent =
      "Sorry, the projects could not be loaded right now. Please try again later.";
  }
}

// ------------------------------------------------------------
// 2. DISPLAY PROJECTS
// Create a project card for every project in the list.
// ------------------------------------------------------------
function displayProjects(projectList) {
  // Remove the previous cards before showing new ones.
  projectsGrid.replaceChildren();

  // Show a message if the selected category has no projects.
  if (projectList.length === 0) {
    const message = document.createElement("p");

    message.textContent = "No projects found in this category.";

    projectsGrid.appendChild(message);

    return;
  }

  projectList.forEach((project) => {
    // Card
    const card = document.createElement("article");
    card.classList.add("project-card");

    // Image
    const image = document.createElement("img");
    image.src = project.image;
    image.alt = project.title;
    image.loading = "lazy";

    // Text area
    const content = document.createElement("div");
    content.classList.add("project-content");

    const title = document.createElement("h2");
    title.textContent = project.title;

    const category = document.createElement("p");
    category.classList.add("project-category");
    category.textContent = project.category;

    const description = document.createElement("p");
    description.textContent = project.description;

    const tools = document.createElement("p");
    tools.classList.add("project-tools");
    tools.textContent = `Tools: ${project.tools.join(", ")}`;

    // View Project BUTTON: sends the visitor to the project's link.
    // It opens in a new tab so the portfolio stays open.
    // (To open in the same tab instead, use: window.location.href = project.link;)
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add("project-btn");
    button.textContent = "View Project";
    button.setAttribute("aria-label", `View project: ${project.title}`);

    button.addEventListener("click", () => {
      window.open(project.link, "_blank", "noopener,noreferrer");
    });

    // Put it all together
    content.append(title, category, description, tools, button);
    card.append(image, content);
    projectsGrid.appendChild(card);
  });
}

// ------------------------------------------------------------
// 3. FILTER PROJECTS
// Display only the projects matching the selected button.
// ------------------------------------------------------------
function filterProjects(category) {
  // If All is selected, keep every project.
  // Otherwise, keep only projects in the chosen category.
  const filteredProjects =
    category === "All"
      ? allProjects
      : allProjects.filter((project) => project.category === category);

  displayProjects(filteredProjects);
}

// ------------------------------------------------------------
// 4. COUNT VISITS WITH LOCAL STORAGE
// Counts how many times this browser has opened the portfolio page.
// This measures page visits, not authenticated logins.
// ------------------------------------------------------------
function showVisitMessage() {
  const storageKey = "dAnalystPortfolioVisits";

  try {
    const previousVisits = Number(localStorage.getItem(storageKey)) || 0;
    const totalVisits = previousVisits + 1;

    localStorage.setItem(storageKey, String(totalVisits));

    visitMessage.textContent =
      totalVisits === 1
        ? "Welcome! This is your first visit to my portfolio."
        : `Welcome back! You have visited this portfolio ${totalVisits} times.`;
  } catch (error) {
    // Keep the page usable if browser storage is unavailable.
    visitMessage.textContent = "Welcome to my portfolio.";
  }
}

// ------------------------------------------------------------
// 5. START THE PORTFOLIO PAGE
// ------------------------------------------------------------
if (projectsGrid) {
  // Filter button events: run the filter whenever a button is clicked.
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Read the category stored in the clicked button.
      filterProjects(button.dataset.category);

      // Update which button appears selected.
      filterButtons.forEach((item) => {
        const isActive = item === button;

        item.classList.toggle("active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });
    });
  });

  if (visitMessage) {
    showVisitMessage();
  }

  loadProjects();
}
