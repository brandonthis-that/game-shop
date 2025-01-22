// API endpoints
const API_BASE_URL = "http://localhost:3000";

// State management
let currentUser = null;
let games = [];
let currentFilters = {
  categories: [],
  minPrice: 0,
  maxPrice: 100,
  rating: [],
};

// Authentication functions
async function login(username, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    currentUser = username;
    localStorage.setItem("username", username);
    updateAuthUI();
    closeAuthModal();
  } catch (error) {
    showError(error.message);
  }
}

async function register(username, email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    showSuccess("Registration successful! Please login.");
    switchAuthTab("login");
  } catch (error) {
    showError(error.message);
  }
}

// Game fetching and rendering
async function fetchGames() {
  try {
    const response = await fetch(`${API_BASE_URL}/games`);
    if (!response.ok) throw new Error("Failed to fetch games");
    games = await response.json();
    renderGames(games);
  } catch (error) {
    showError("Error loading games. Please try again later.");
  }
}

function renderGames(gamesToRender) {
  const gamesGrid = document.querySelector(".games-grid");
  gamesGrid.innerHTML = gamesToRender
    .map(
      (game) => `
        <div class="game-card">
            <img src="/public/assets/images/16.9/${game.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")}.jpg" 
                 alt="${game.title}"
                 onerror="this.src='/public/assets/images/placeholder.jpg'">
            <div class="game-info">
                <h3 class="game-title">${game.title}</h3>
                <p class="game-description">${game.description}</p>
                <div class="game-price">$${game.price.toFixed(2)}</div>
                <div class="game-rating">
                    ${"★".repeat(Math.floor(game.rating))}${"☆".repeat(
        5 - Math.floor(game.rating)
      )}
                    ${game.rating.toFixed(1)}
                </div>
                <div class="game-release-date">
                    Released: ${new Date(
                      game.release_date
                    ).toLocaleDateString()}
                </div>
            </div>
        </div>
    `
    )
    .join("");
}

// UI functions
function updateAuthUI() {
  const accountIcon = document.querySelector(".account-icon-wrapper");
  if (currentUser) {
    accountIcon.innerHTML = `
            <div class="user-menu">
                <span>${currentUser}</span>
                <button onclick="logout()">Logout</button>
            </div>
        `;
  } else {
    accountIcon.innerHTML = `
            <img class="account-icon" src="../public/assets/account-icon.svg" 
                 alt="account-icon-svg" onclick="openAuthModal()">
        `;
  }
}

function showError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.textContent = message;
  document.body.appendChild(errorDiv);
  setTimeout(() => errorDiv.remove(), 3000);
}

function showSuccess(message) {
  const successDiv = document.createElement("div");
  successDiv.className = "success-message";
  successDiv.textContent = message;
  document.body.appendChild(successDiv);
  setTimeout(() => successDiv.remove(), 3000);
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const body = document.body;
  const sortSelect = document.querySelector(".sort-select");
  const filterInputs = document.querySelectorAll(".filter-option input");
  const minPrice = document.getElementById("min-price");
  const maxPrice = document.getElementById("max-price");
  const applyFiltersBtn = document.querySelector(".apply-filters");

  // Initialize
  fetchGames();
  const savedUsername = localStorage.getItem("username");
  if (savedUsername) {
    currentUser = savedUsername;
    updateAuthUI();
  }

  // Auth modal event listeners
  document.querySelectorAll(".auth-tab").forEach((tab) => {
    tab.addEventListener("click", () => switchAuthTab(tab.dataset.tab));
  });

  document
    .getElementById("login-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      await login(formData.get("username"), formData.get("password"));
    });

  document
    .getElementById("register-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      await register(
        formData.get("username"),
        formData.get("email"),
        formData.get("password")
      );
    });

  // Sorting
  sortSelect.addEventListener("change", (e) => {
    let sortedGames = [...games];
    switch (e.target.value) {
      case "price-low":
        sortedGames.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sortedGames.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sortedGames.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        sortedGames.sort(
          (a, b) => new Date(b.release_date) - new Date(a.release_date)
        );
        break;
    }
    renderGames(sortedGames);
  });

  // Filtering
  filterInputs.forEach((input) => {
    input.addEventListener("change", (e) => {
      const value = e.target.value;
      const type = e.target.name;

      if (type === "category") {
        if (e.target.checked) {
          currentFilters.categories.push(value);
        } else {
          currentFilters.categories = currentFilters.categories.filter(
            (cat) => cat !== value
          );
        }
      } else if (type === "rating") {
        if (e.target.checked) {
          currentFilters.rating.push(Number(value));
        } else {
          currentFilters.rating = currentFilters.rating.filter(
            (r) => r !== Number(value)
          );
        }
      }
    });
  });

  // Price range
  minPrice.addEventListener("input", (e) => {
    currentFilters.minPrice = Number(e.target.value);
  });

  maxPrice.addEventListener("input", (e) => {
    currentFilters.maxPrice = Number(e.target.value);
  });

  applyFiltersBtn.addEventListener("click", () => {
    const filteredGames = filterGames();
    renderGames(filteredGames);
  });

  // Theme toggle
  function toggleTheme() {
    const isDarkMode = body.classList.contains("dark-mode");
    body.className = isDarkMode ? "light-mode" : "dark-mode";
    localStorage.setItem("theme", isDarkMode ? "light-mode" : "dark-mode");
    updateThemeIcon(!isDarkMode);
  }

  function updateThemeIcon(isDarkMode) {
    themeToggleBtn.textContent = isDarkMode ? "🌜" : "🌞";
  }

  themeToggleBtn.addEventListener("click", toggleTheme);

  // Search
  const searchInput = document.querySelector(".search-box");
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredGames = games.filter(
      (game) =>
        game.title.toLowerCase().includes(searchTerm) ||
        game.description.toLowerCase().includes(searchTerm)
    );
    renderGames(filteredGames);
  });
});

// Filter function
function filterGames() {
  let filteredGames = games;

  if (currentFilters.categories.length > 0) {
    filteredGames = filteredGames.filter((game) =>
      currentFilters.categories.includes(game.category)
    );
  }

  filteredGames = filteredGames.filter(
    (game) =>
      game.price >= currentFilters.minPrice &&
      game.price <= currentFilters.maxPrice
  );

  if (currentFilters.rating.length > 0) {
    filteredGames = filteredGames.filter((game) =>
      currentFilters.rating.some((rating) => game.rating >= rating)
    );
  }

  return filteredGames;
}
