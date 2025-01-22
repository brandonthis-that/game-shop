const games = [
  {
    id: 1,
    title: "Call of Duty: Warzone",
    price: 59.99,
    rating: 4.5,
    category: "action",
    image: "../public/assets/images/16.9/cod-warzone.png",
  },
  // Add more games here
];

document.addEventListener("DOMContentLoaded", () => {
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const body = document.body;

  const gamesGrid = document.querySelector(".games-grid");
  const sortSelect = document.querySelector(".sort-select");
  const filterInputs = document.querySelectorAll(".filter-option input");
  const priceRange = document.getElementById("price-range");
  const minPrice = document.getElementById("min-price");
  const maxPrice = document.getElementById("max-price");
  const applyFiltersBtn = document.querySelector(".apply-filters");

  let currentFilters = {
    categories: [],
    minPrice: 0,
    maxPrice: 100,
    rating: [],
  };

  function renderGames(gamesToRender) {
    gamesGrid.innerHTML = gamesToRender
      .map(
        (game) => `
            <div class="game-card">
                <img src="${game.image}" alt="${game.title}">
                <div class="game-info">
                    <h3 class="game-title">${game.title}</h3>
                    <div class="game-price">$${game.price.toFixed(2)}</div>
                    <div class="game-rating">
                        ${"★".repeat(Math.floor(game.rating))}${"☆".repeat(
          5 - Math.floor(game.rating)
        )}
                        ${game.rating.toFixed(1)}
                    </div>
                </div>
            </div>
        `
      )
      .join("");
  }

  function filterGames() {
    let filteredGames = games;

    // Apply category filters
    if (currentFilters.categories.length > 0) {
      filteredGames = filteredGames.filter((game) =>
        currentFilters.categories.includes(game.category)
      );
    }

    // Apply price filter
    filteredGames = filteredGames.filter(
      (game) =>
        game.price >= currentFilters.minPrice &&
        game.price <= currentFilters.maxPrice
    );

    // Apply rating filter
    if (currentFilters.rating.length > 0) {
      filteredGames = filteredGames.filter((game) =>
        currentFilters.rating.some((rating) => game.rating >= rating)
      );
    }
    return filteredGames;
  }

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
        sortedGames.sort((a, b) => b.id - a.id); // Assuming id represents newest
        break;
    }
    renderGames(sortedGames);
  });

  // Filter input event listeners
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

  // Price range event listeners
  minPrice.addEventListener("input", (e) => {
    currentFilters.minPrice = Number(e.target.value);
    priceRange.min = e.target.value;
  });

  maxPrice.addEventListener("input", (e) => {
    currentFilters.maxPrice = Number(e.target.value);
    priceRange.max = e.target.value;
  });

  // Apply filters button event listener
  applyFiltersBtn.addEventListener("click", () => {
    const filteredGames = filterGames();
    renderGames(filteredGames);
  });

  // Initial render
  renderGames(games);

  // Check for saved theme preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    body.className = savedTheme;
    updateThemeIcon(savedTheme === "dark-mode");
  } else {
    // Default to light mode
    body.className = "light-mode";
    updateThemeIcon(false);
  }

  // Toggle theme function
  function toggleTheme() {
    const isDarkMode = body.classList.contains("dark-mode");
    body.className = isDarkMode ? "light-mode" : "dark-mode";
    localStorage.setItem("theme", isDarkMode ? "light-mode" : "dark-mode");
    updateThemeIcon(!isDarkMode);
  }

  // Update button icon based on theme
  function updateThemeIcon(isDarkMode) {
    themeToggleBtn.textContent = isDarkMode ? "🌜" : "🌞";
  }

  // Add click event listener to theme toggle button
  themeToggleBtn.addEventListener("click", toggleTheme);

  const searchContainer = document.querySelector(".search-on-menu");
  const searchInput = document.querySelector(".search-box");
  const searchIcon = document.querySelector(".search-icon");

  // Function to expand search
  function expandSearch() {
    searchContainer.classList.add("expanded");
    searchInput.classList.add("expanded");
  }

  // Function to collapse search
  function collapseSearch() {
    if (searchInput.value === "") {
      searchContainer.classList.remove("expanded");
      searchInput.classList.remove("expanded");
    }
  }

  // Event listeners for search interaction
  searchContainer.addEventListener("click", expandSearch);
  searchInput.addEventListener("focus", expandSearch);
  searchInput.addEventListener("blur", collapseSearch);

  // Prevent search collapse when clicking inside
  searchInput.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // Navbar scroll functionality
  const navbar = document.querySelector(".navbar");
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    // Scrolling down
    if (currentScroll > lastScroll && currentScroll > 50) {
      navbar.style.transform = "translateY(-100%)";
    }
    // Scrolling up
    else {
      navbar.style.transform = "translateY(0)";
    }

    lastScroll = currentScroll;
  });
});
