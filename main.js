
document.addEventListener("DOMContentLoaded", function () {
  // =========================
  // 1. PRODUCTS
  // =========================

  const products = [
    {
      id: 1,
      name: "Organic Avocados",
      category: "Fruits",
      price: 4.50,
      oldPrice: 5.50,
      rating: 4.9,
      badge: "BESTSELLER",
      image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&h=600&fit=crop",
      description: "Creamy, naturally ripened avocados, perfect for salads, toast and everyday meals."
    },
    {
      id: 2,
      name: "Fresh Strawberries",
      category: "Fruits",
      price: 3.80,
      oldPrice: null,
      rating: 4.8,
      badge: "FRESH PICK",
      image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&h=600&fit=crop",
      description: "Sweet and juicy strawberries, carefully selected for their fresh taste."
    },
    {
      id: 3,
      name: "Garden Tomatoes",
      category: "Vegetables",
      price: 2.90,
      oldPrice: null,
      rating: 4.7,
      badge: "",
      image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=600&h=600&fit=crop",
      description: "Beautiful garden tomatoes for fresh salads, sauces and home cooking."
    },
    {
      id: 4,
      name: "Green Broccoli",
      category: "Vegetables",
      price: 3.20,
      oldPrice: 3.90,
      rating: 4.8,
      badge: "SAVE 18%",
      image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=600&h=600&fit=crop",
      description: "Fresh green broccoli, a versatile favorite for steaming and roasting."
    },
    {
      id: 5,
      name: "Farm Fresh Eggs",
      category: "Dairy",
      price: 5.20,
      oldPrice: null,
      rating: 4.9,
      badge: "FARM PICK",
      image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=600&h=600&fit=crop",
      description: "A kitchen staple for breakfast, baking and all your favorite recipes."
    },
    {
      id: 6,
      name: "Natural Honey",
      category: "Pantry",
      price: 7.50,
      oldPrice: null,
      rating: 5.0,
      badge: "",
      image: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=600&h=600&fit=crop",
      description: "Golden honey with a naturally rich flavor. Lovely in tea or breakfast bowls."
    },
    {
      id: 7,
      name: "Fresh Red Apples",
      category: "Fruits",
      price: 3.40,
      oldPrice: 4.00,
      rating: 4.8,
      badge: "SAVE 15%",
      image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&h=600&fit=crop",
      description: "Crisp red apples for snacks, lunchboxes and fresh fruit bowls."
    },
    {
      id: 8,
      name: "Green Spinach",
      category: "Vegetables",
      price: 2.60,
      oldPrice: null,
      rating: 4.7,
      badge: "",
      image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&h=600&fit=crop",
      description: "Fresh leafy greens for salads, smoothies and delicious home-cooked meals."
    }
  ];

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    Array.from(parent.querySelectorAll(selector));

  const productGrid = $("#productGrid");
  const emptyState = $("#emptyState");
  const searchInput = $("#searchInput");
  const sortSelect = $("#sortSelect");

  let activeFilter = "All";
  let searchTerm = "";
  let favoritesOnly = false;
  let toastTimeout;

  // =========================
  // 2. SAVED DATA
  // =========================

  function loadSavedData(key, fallback) {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function saveData(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn("Unable to save data in this browser.");
    }
  }

  let cart = loadSavedData("organiCart", []);
  let favorites = loadSavedData("organiFavorites", []);

  if (!Array.isArray(cart)) cart = [];
  if (!Array.isArray(favorites)) favorites = [];

  cart = cart.filter(item =>
    products.some(product => product.id === item.id) &&
    Number.isInteger(item.qty) &&
    item.qty > 0
  );

  favorites = favorites.filter(id =>
    products.some(product => product.id === id)
  );

  // =========================
  // 3. TOAST MESSAGE
  // =========================

  function showToast(message) {
    const toast = $("#toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(function () {
      toast.classList.remove("show");
    }, 2600);
  }

  // =========================
  // 4. RENDER PRODUCTS
  // =========================

  function getFilteredProducts() {
    let result = products.filter(function (product) {
      const matchesCategory =
        activeFilter === "All" ||
        product.category === activeFilter;

      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm);

      const matchesFavorites =
        !favoritesOnly ||
        favorites.includes(product.id);

      return (
        matchesCategory &&
        matchesSearch &&
        matchesFavorites
      );
    });

    const sort = sortSelect ? sortSelect.value : "featured";

    if (sort === "low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }

  function renderProducts() {
    const result = getFilteredProducts();

    productGrid.innerHTML = result.map(function (product, index) {
      const isFavorite = favorites.includes(product.id);

      return `
        <article class="product-card" style="animation-delay:${index * 50}ms">
          <div class="product-image" data-quick-view="${product.id}">
            ${
              product.badge
                ? `<span class="product-badge ${product.oldPrice ? "sale" : ""}">${product.badge}</span>`
                : ""
            }

            <img
              src="${product.image}"
              alt="${product.name}"
              loading="lazy"
            >

            <div class="product-actions">
              <button
                class="product-action ${isFavorite ? "is-favorite" : ""}"
                data-favorite="${product.id}"
                aria-label="${isFavorite ? "Remove from favorites" : "Add to favorites"}"
                aria-pressed="${isFavorite}"
                type="button"
              >${isFavorite ? "♥" : "♡"}</button>

              <button
                class="product-action"
                data-quick-view="${product.id}"
                aria-label="Quick view ${product.name}"
                type="button"
              >⌕</button>
            </div>
          </div>

          <div class="product-info">
            <span class="product-category">${product.category}</span>
            <h3>${product.name}</h3>

            <div class="product-rating">
              ★★★★★ <span>(${product.rating.toFixed(1)})</span>
            </div>

            <div class="product-price-row">
              <div class="product-price">
                $${product.price.toFixed(2)}
                ${
                  product.oldPrice
                    ? `<del>$${product.oldPrice.toFixed(2)}</del>`
                    : ""
                }
              </div>

              <button
                class="add-cart-btn"
                data-add-cart="${product.id}"
                type="button"
              >+ Add to cart</button>
            </div>
          </div>
        </article>
      `;
    }).join("");

    emptyState.hidden = result.length !== 0;
    productGrid.hidden = result.length === 0;

    const showAllButton = $("#showAllProducts");

    if (showAllButton) {
      showAllButton.textContent = favoritesOnly
        ? "Back to shopping"
        : "Explore the harvest ↗";
    }

    observeRevealElements();
  }

  // =========================
  // 5. CATEGORY FILTERS
  // =========================

  $$("#filterList .filter-btn").forEach(function (button) {
    button.addEventListener("click", function () {
      activeFilter = button.dataset.filter;
      favoritesOnly = false;

      $$("#filterList .filter-btn").forEach(function (item) {
        item.classList.toggle("active", item === button);
      });

      $("#showFavorites").classList.remove("is-active");

      renderProducts();
    });
  });

  $$(".category-card").forEach(function (card) {
    card.addEventListener("click", function () {
      activeFilter = card.dataset.category;
      favoritesOnly = false;

      $$("#filterList .filter-btn").forEach(function (button) {
        button.classList.toggle(
          "active",
          button.dataset.filter === activeFilter
        );
      });

      renderProducts();
    });
  });

  if (sortSelect) {
    sortSelect.addEventListener("change", renderProducts);
  }

  // =========================
  // 6. SEARCH
  // =========================

  const searchBar = $("#searchBar");

  $("#searchToggle").addEventListener("click", function () {
    searchBar.classList.toggle("open");

    if (searchBar.classList.contains("open")) {
      searchInput.focus();
    }
  });

  $("#closeSearch").addEventListener("click", function () {
    searchBar.classList.remove("open");
    searchInput.value = "";
    searchTerm = "";
    renderProducts();
  });

  searchInput.addEventListener("input", function () {
    searchTerm = searchInput.value.trim().toLowerCase();
    favoritesOnly = false;
    renderProducts();
  });

  // =========================
  // 7. FAVORITES
  // =========================

  function updateFavorites() {
    saveData("organiFavorites", favorites);

    $("#favoriteCount").textContent = favorites.length;

    renderProducts();
  }

  function toggleFavorite(id) {
    if (favorites.includes(id)) {
      favorites = favorites.filter(item => item !== id);
      showToast("Removed from favorites");
    } else {
      favorites.push(id);
      showToast("Added to favorites ♥");
    }

    updateFavorites();
  }

  $("#showFavorites").addEventListener("click", function () {
    favoritesOnly = !favoritesOnly;

    if (favoritesOnly) {
      activeFilter = "All";
      searchTerm = "";
      searchInput.value = "";

      $$("#filterList .filter-btn").forEach(function (button) {
        button.classList.toggle(
          "active",
          button.dataset.filter === "All"
        );
      });

      $("#showFavorites").classList.add("is-active");
      $("#shop").scrollIntoView({ behavior: "smooth" });
    } else {
      $("#showFavorites").classList.remove("is-active");
    }

    renderProducts();
  });

  // =========================
  // 8. CART OPERATIONS
  // =========================

  function saveCart() {
    saveData("organiCart", cart);
    renderCart();
  }

  function addToCart(id) {
    const product = products.find(item => item.id === id);

    if (!product) return;

    const existing = cart.find(item => item.id === id);

    if (existing) {
      existing.qty++;
    } else {
      cart.push({ id: id, qty: 1 });
    }

    saveCart();
    showToast(product.name + " added to your basket");
  }

  function changeQuantity(id, amount) {
    const item = cart.find(product => product.id === id);

    if (!item) return;

    item.qty += amount;

    if (item.qty <= 0) {
      cart = cart.filter(product => product.id !== id);
    }

    saveCart();
  }

  function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    showToast("Product removed from basket");
  }

  function getCartCount() {
    return cart.reduce((total, item) => total + item.qty, 0);
  }

  function getCartTotal() {
    return cart.reduce(function (total, item) {
      const product = products.find(product => product.id === item.id);

      return total + (product ? product.price * item.qty : 0);
    }, 0);
  }

  function renderCart() {
    const cartItems = $("#cartItems");
    const cartEmpty = $("#cartEmpty");
    const cartFooter = $("#cartFooter");

    const count = getCartCount();
    const total = getCartTotal();

    $("#cartCount").textContent = count;
    $("#drawerCartCount").textContent = `(${count})`;
    $("#cartSubtotal").textContent = `$${total.toFixed(2)}`;

    cartEmpty.hidden = count !== 0;
    cartFooter.hidden = count === 0;

    cartItems.innerHTML = cart.map(function (item) {
      const product = products.find(product => product.id === item.id);

      if (!product) return "";

      return `
        <article class="cart-item">
          <img src="${product.image}" alt="${product.name}">

          <div>
            <h3>${product.name}</h3>
            <small>$${product.price.toFixed(2)} each</small>

            <div class="quantity-control">
              <button data-quantity="${product.id}" data-change="-1" aria-label="Decrease quantity">−</button>
              <span>${item.qty}</span>
              <button data-quantity="${product.id}" data-change="1" aria-label="Increase quantity">+</button>
            </div>

            <button class="remove-item" data-remove="${product.id}">Remove</button>
          </div>

          <div class="cart-item-price">
            $${(product.price * item.qty).toFixed(2)}
          </div>
        </article>
      `;
    }).join("");

    const shippingGoal = 50;
    const remaining = Math.max(0, shippingGoal - total);
    const percentage = Math.min(100, (total / shippingGoal) * 100);

    $("#shippingProgress").style.width = percentage + "%";

    $("#shippingMessage").textContent =
      remaining > 0
        ? `You're $${remaining.toFixed(2)} away from free shipping.`
        : "Wonderful! You've unlocked free shipping.";

    saveData("organiCart", cart);
  }

  // =========================
  // 9. CART DRAWER
  // =========================

  const cartDrawer = $("#cartDrawer");
  const overlay = $("#overlay");

  function openCart() {
    cartDrawer.classList.add("open");
    overlay.classList.add("active");
    cartDrawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    $("#closeCart").focus();
  }

  function closeCart() {
    cartDrawer.classList.remove("open");
    overlay.classList.remove("active");
    cartDrawer.setAttribute("aria-hidden", "true");

    if (!$("#quickView").classList.contains("open")) {
      document.body.classList.remove("no-scroll");
    }
  }

  $("#cartToggle").addEventListener("click", openCart);
  $("#closeCart").addEventListener("click", closeCart);

  $("#continueShopping").addEventListener("click", function () {
    closeCart();
    $("#shop").scrollIntoView({ behavior: "smooth" });
  });

  // =========================
  // 10. QUICK VIEW
  // =========================

  const quickView = $("#quickView");

  function openQuickView(id) {
    const product = products.find(item => item.id === id);

    if (!product) return;

    $("#quickViewBody").innerHTML = `
      <div class="quick-product">
        <img src="${product.image}" alt="${product.name}">

        <div>
          <span class="product-category">${product.category}</span>
          <h2>${product.name}</h2>

          <div class="product-rating">
            ★★★★★ <span>${product.rating.toFixed(1)} / 5</span>
          </div>

          <div class="product-price">
            $${product.price.toFixed(2)}
            ${
              product.oldPrice
                ? `<del>$${product.oldPrice.toFixed(2)}</del>`
                : ""
            }
          </div>

          <p>${product.description}</p>

          <button class="btn btn-primary" data-add-cart="${product.id}">
            Add to basket <span>↗</span>
          </button>
        </div>
      </div>
    `;

    quickView.classList.add("open");
    quickView.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  }

  function closeQuickView() {
    quickView.classList.remove("open");
    quickView.setAttribute("aria-hidden", "true");

    if (!cartDrawer.classList.contains("open")) {
      document.body.classList.remove("no-scroll");
    }
  }

  $("#closeQuickView").addEventListener("click", closeQuickView);

  quickView.addEventListener("click", function (event) {
    if (event.target === quickView) {
      closeQuickView();
    }
  });

  // =========================
  // 11. PRODUCT CLICK EVENTS
  // =========================

  document.addEventListener("click", function (event) {
    const addButton = event.target.closest("[data-add-cart]");

    if (addButton) {
      addToCart(Number(addButton.dataset.addCart));
      return;
    }

    const favoriteButton = event.target.closest("[data-favorite]");

    if (favoriteButton) {
      toggleFavorite(Number(favoriteButton.dataset.favorite));
      return;
    }

    const quantityButton = event.target.closest("[data-quantity]");

    if (quantityButton) {
      changeQuantity(
        Number(quantityButton.dataset.quantity),
        Number(quantityButton.dataset.change)
      );
      return;
    }

    const removeButton = event.target.closest("[data-remove]");

    if (removeButton) {
      removeFromCart(Number(removeButton.dataset.remove));
      return;
    }

    const quickButton = event.target.closest("[data-quick-view]");

    if (quickButton) {
      openQuickView(Number(quickButton.dataset.quickView));
    }
  });

  $("#resetProducts").addEventListener("click", function () {
    activeFilter = "All";
    searchTerm = "";
    favoritesOnly = false;

    searchInput.value = "";

    $$("#filterList .filter-btn").forEach(function (button) {
      button.classList.toggle(
        "active",
        button.dataset.filter === "All"
      );
    });

    $("#showFavorites").classList.remove("is-active");

    renderProducts();
  });

  $("#showAllProducts").addEventListener("click", function (event) {
    event.preventDefault();

    activeFilter = "All";
    searchTerm = "";
    favoritesOnly = false;

    searchInput.value = "";

    $$("#filterList .filter-btn").forEach(function (button) {
      button.classList.toggle(
        "active",
        button.dataset.filter === "All"
      );
    });

    $("#showFavorites").classList.remove("is-active");

    renderProducts();
  });

  // =========================
  // 12. MOBILE MENU
  // =========================

  const menuToggle = $("#menuToggle");
  const mainNav = $("#mainNav");

  menuToggle.addEventListener("click", function () {
    const isOpen = mainNav.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  $$("#mainNav a").forEach(function (link) {
    link.addEventListener("click", function () {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  // =========================
  // 13. SCROLL ANIMATIONS
  // =========================

  let revealObserver;

  function observeRevealElements() {
    const elements = $$(".category-card, .product-card, .journal-card, .benefit");

    elements.forEach(function (element) {
      if (element.dataset.revealReady) return;

      element.dataset.revealReady = "true";
      element.classList.add("reveal");

      if (revealObserver) {
        revealObserver.observe(element);
      } else {
        element.classList.add("visible");
      }
    });
  }

  if ("IntersectionObserver" in window) {
    revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: "0px 0px -35px 0px"
    });

    $$(".section, .promo-strip, .benefits, .deal-section, .newsletter-section")
      .forEach(function (element) {
        element.classList.add("reveal");
        revealObserver.observe(element);
      });
  } else {
    $$(".reveal").forEach(element => element.classList.add("visible"));
  }

  // =========================
  // 14. BACK TO TOP
  // =========================

  const backToTop = $("#backToTop");

  window.addEventListener("scroll", function () {
    backToTop.classList.toggle("visible", window.scrollY > 450);
  }, { passive: true });

  backToTop.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  // =========================
  // 15. TESTIMONIAL SLIDER
  // =========================

  const testimonialTrack = $("#testimonialTrack");
  const testimonials = $$(".testimonial", testimonialTrack);
  const testimonialDots = $$("#testimonialDots button");

  let testimonialIndex = 0;

  function updateTestimonials() {
    const mobile = window.matchMedia("(max-width: 760px)").matches;

    if (mobile && testimonials.length) {
      const cardHeight = testimonials[0].getBoundingClientRect().height;
      const gap = parseFloat(getComputedStyle(testimonialTrack).rowGap) || 0;

      testimonialTrack.style.transform =
        `translateY(-${testimonialIndex * (cardHeight + gap)}px)`;
    } else {
      testimonialTrack.style.transform = "translateY(0)";
    }

    testimonialDots.forEach(function (dot, index) {
      dot.classList.toggle("active", index === testimonialIndex);
    });
  }

  function moveTestimonial(amount) {
    testimonialIndex =
      (testimonialIndex + amount + testimonials.length) % testimonials.length;

    updateTestimonials();
  }

  $("#testimonialPrev").addEventListener("click", function () {
    moveTestimonial(-1);
  });

  $("#testimonialNext").addEventListener("click", function () {
    moveTestimonial(1);
  });

  testimonialDots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      testimonialIndex = index;
      updateTestimonials();
    });
  });

  window.addEventListener("resize", updateTestimonials);

  // =========================
  // 16. ANIMATED STATISTICS
  // =========================

  const statNumbers = $$("[data-count]");

  function animateCounter(element) {
    const target = Number(element.dataset.count);
    const duration = 1400;
    const startTime = performance.now();

    function updateCounter(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      element.textContent = Math.floor(target * eased).toLocaleString("en-US");

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target.toLocaleString("en-US");
      }
    }

    requestAnimationFrame(updateCounter);
  }

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(element => counterObserver.observe(element));
  } else {
    statNumbers.forEach(animateCounter);
  }

  // =========================
  // 17. NEWSLETTER DEMO
  // =========================

  $("#newsletterForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const emailInput = $("#emailInput");
    const message = $("#newsletterMessage");

    if (!emailInput.checkValidity()) {
      emailInput.reportValidity();
      return;
    }

    message.textContent =
      "Thanks for joining us! This is a front-end demo; no email was sent.";

    emailInput.value = "";
  });

  // =========================
  // 18. CHECKOUT DEMO
  // =========================

  $("#checkoutBtn").addEventListener("click", function () {
    if (cart.length === 0) {
      showToast("Your basket is empty");
      return;
    }

    showToast("Checkout is a demo. No payment was processed.");
  });

  // =========================
  // 19. KEYBOARD CONTROLS
  // =========================

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeCart();
      closeQuickView();
      searchBar.classList.remove("open");
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });

  // =========================
  // 20. INITIALIZE WEBSITE
  // =========================

  renderProducts();
  renderCart();
  updateFavorites();
  updateTestimonials();
  observeRevealElements();
});
