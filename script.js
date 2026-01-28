// Load cars from JSON and display them on vehicles page
async function loadCars() {
  try {
    // Fetch from PHP API to get fresh data and bypass browser cache
    // This ensures all users see the latest updates from admin
    const response = await fetch('api/getCars.php?t=' + new Date().getTime());
    const cars = await response.json();
    displayCars(cars);
    displaySoldVehicles(cars);
  } catch (error) {
    console.error('Error loading cars:', error);
  }
}

// Display cars in the vehicles grid
function displayCars(cars) {
  const vehiclesGrid = document.querySelector('.vehicles-grid');
  if (!vehiclesGrid) return;

  vehiclesGrid.innerHTML = '';

  // Filter only available cars
  const availableCars = cars.filter(car => car.status !== 'sold');

  availableCars.forEach(car => {
    const carCard = document.createElement('div');
    carCard.className = 'car-card';

    carCard.innerHTML = `
      <img src="${car.image}" alt="${car.name}" class="car-image">
      <div class="car-info">
        <h3 class="car-name">${car.name}</h3>
        <div class="car-details">
          <span>${car.year}</span>
          <span>${car.km}</span>
        </div>
        <div class="car-price">${car.price}</div>
        <p class="car-description">${car.description}</p>
        <a href="https://wa.me/33650336533?text=Je suis intéressé par ${car.name}" class="whatsapp-btn" target="_blank">
          Contacter via WhatsApp
        </a>
      </div>
    `;

    vehiclesGrid.appendChild(carCard);
  });
}

// Display sold vehicles
function displaySoldVehicles(cars) {
  const soldVehiclesGrid = document.querySelector('.sold-vehicles-grid');
  if (!soldVehiclesGrid) return;

  // Filter only sold cars
  const soldCars = cars.filter(car => car.status === 'sold');

  // Only update if there are sold cars in the database
  // Otherwise keep the existing static cards
  if (soldCars.length > 0) {
    soldVehiclesGrid.innerHTML = '';
    
    soldCars.forEach(car => {
      const soldVehicleCard = document.createElement('div');
      soldVehicleCard.className = 'sold-vehicle-card';

      soldVehicleCard.innerHTML = `
        <img src="${car.image}" alt="${car.name}">
        <div class="sold-vehicle-info">
          <h3>${car.name}</h3>
          <p class="status">✓ Vendu</p>
        </div>
      `;

      soldVehiclesGrid.appendChild(soldVehicleCard);
    });
  }
}

// Form validation for contact page
function validateForm(event) {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    alert('Veuillez remplir tous les champs.');
    return false;
  }

  if (!isValidEmail(email)) {
    alert('Veuillez entrer une adresse email valide.');
    return false;
  }

  // For now, just show a success message
  alert('Merci pour votre message ! Nous vous contacterons bientôt.');
  document.getElementById('contact-form').reset();
  return false;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Smooth scrolling for navigation links
function smoothScroll(target) {
  const element = document.querySelector(target);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Load cars if on vehicles page
  if (document.querySelector('.vehicles-grid')) {
    loadCars();
  }

  // Form validation
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', validateForm);
  }

  // Smooth scrolling for nav links
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = this.getAttribute('href');
      smoothScroll(target);
    });
  });

  // Auto-refresh vehicle data every 30 seconds if on vehicles page
  // This ensures public users see latest updates from admin
  if (document.querySelector('.vehicles-grid')) {
    setInterval(loadCars, 30000);
  }
});
