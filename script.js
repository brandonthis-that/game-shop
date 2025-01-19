window.onload = function () {
  window.scrollTo(0, 0);
};

// Game details data
const gameDetails = {
  "slide-1": {
    title: "Call of Duty: Warzone",
    description:
      "A free-to-play battle royale game released in 2020. It is a part of the Call of Duty series and is based on the Modern Warfare universe.",
    price: "$0.00",
    releaseDate: "March 10, 2020",
    genre: "Battle Royale, First-Person Shooter",
  },
  "slide-2": {
    title: "Call of Duty: Black Ops",
    description:
      "Experience the next generation of the Black Ops franchise, featuring a gripping single-player campaign and multiplayer combat.",
    price: "$60.00",
    releaseDate: "November 13, 2020",
    genre: "First-Person Shooter",
  },
  "slide-3": {
    title: "EA FC25",
    description:
      "EA FC25 is a football simulation video game developed by EA Vancouver and published by Electronic Arts. It is the 25th installment in the FIFA series.",
    price: "$59.99",
    releaseDate: "October 9, 2020",
    genre: "Sports",
  },
  "slide-4": {
    title: "FIFA 23",
    description:
      "FIFA 23 is a football simulation video game developed by EA Vancouver and published by Electronic Arts. It is the 23rd installment in the FIFA series.",
    price: "$59.99",
    releaseDate: "October 9, 2022",
    genre: "Sports",
  },
  "slide-5": {
    title: "Grand Theft Auto V",
    description:
      "Grand Theft Auto V is a 2013 action-adventure game developed by Rockstar North and published by Rockstar Games.",
    price: "$29.99",
    releaseDate: "September 17, 2013",
    genre: "Action-Adventure",
  },
  "slide-6": {
    title: "Need for Speed",
    description:
      "Need for Speed is a racing video game franchise published by Electronic Arts and currently developed by Criterion Games.",
    price: "$59.99",
    releaseDate: "November 8, 2019",
    genre: "Racing",
  },
  "slide-7": {
    title: "Watch Dogs: Legion",
    description:
      "Watch Dogs: Legion is an action-adventure game developed by Ubisoft Toronto and published by Ubisoft. It is the third installment in the Watch Dogs series.",
    price: "$59.99",
    releaseDate: "October 29, 2020",
    genre: "Action-Adventure",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".slider");
  const slides = document.querySelectorAll(".slider img");
  const prevButton = document.querySelector(".prev-button");
  const nextButton = document.querySelector(".next-button");
  const detailsSelection = document.querySelector(".details-section");
  const navDots = document.querySelectorAll(".slider-nav a");

  let currentSlide = 0;
  const totalSlides = slides.length;

  // update Game details
  function updateGameDetails(slideId) {
    const details = gameDetails[slideId];
    if (details) {
      detailsSelection.innerHTML = `
            <h2>${details.title}</h2>
            <p class="description">${details.description}</p>
            <div class="game-info">
                <p><strong>Price:</strong> ${details.price}</p>
                <p><strong>Release Date:</strong> ${details.releaseDate}</p>
                <p><strong>Genre:</strong> ${details.genre}</p>
            </div>
            <button class="buy-button">Buy Now</button>
            `;
    }
  }

  // update active slide
  function updateSlide(index) {
    currentSlide = index;
    const slideId = slides[currentSlide].id;

    // update slider position
    slides[currentSlide].scrollIntoView({
      behavior: "smooth",
      inline: "start",
    });

    // update nav dots (active)
    navDots.forEach((dot, i) => {
      dot.style.opacity = i === currentSlide ? "1" : "0.75";
    });

    // update game details
    updateGameDetails(slideId);
  }

  // Event Listeners for butons
  nextButton.addEventListener("click", () => {
    currentSlide = (currentSlide + 1) % totalSlides; // Correct increment for next button
    updateSlide(currentSlide); // Update the slide
  });

  prevButton.addEventListener("click", () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlide(currentSlide);
  });

  //Event Listeners for nav dots
  navDots.forEach((dot, index) => {
    dot.addEventListener("click", (e) => {
      e.preventDefault();
      updateSlide(index);
    });
  });

  // Initialize first slide
  updateSlide(0);

  // auto-update details when the user scrolls manually
  slider.addEventListener("scroll", () => {
    const index = Math.round(slider.scrollLeft / slider.offsetWidth);
    if (index !== currentSlide) {
      currentSlide = index;
      const slideId = slides[currentSlide].id;
      updateGameDetails(slideId);
      navDots.forEach((dot, i) => {
        dot.style.opacity = i === currentSlide ? "1" : "0.75";
      });
    }
  });

  // Buy button click event
  detailsSelection.addEventListener("click", (e) => {
    if (e.target.classList.contains("buy-button")) {
      alert("Game purchased successfully!");
    }
  });

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
