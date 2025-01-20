document.addEventListener("DOMContentLoaded", () => {
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const body = document.body;

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
