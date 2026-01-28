// Admin Panel Script
let editingIndex = null;

// Load vehicles when page loads
document.addEventListener('DOMContentLoaded', function() {
  loadAdminVehicles();
  
  // Form submission
  document.getElementById('vehicleForm').addEventListener('submit', handleFormSubmit);
});

// Load vehicles in admin panel
function loadAdminVehicles() {
  // Try to load from localStorage first (persistent storage)
  let cars = localStorage.getItem('cars');
  
  if (!cars) {
    // If not in localStorage, fetch from cars.json
    fetch('../cars.json')
      .then(response => response.json())
      .then(data => {
        localStorage.setItem('cars', JSON.stringify(data));
        displayAdminVehicles(data);
      })
      .catch(error => console.error('Error loading cars:', error));
  } else {
    displayAdminVehicles(JSON.parse(cars));
  }
}

// Display vehicles in admin panel
function displayAdminVehicles(cars) {
  const vehiclesList = document.getElementById('vehiclesList');
  vehiclesList.innerHTML = '';

  cars.forEach((car, index) => {
    const statusBadge = car.status === 'sold' ? '<span class="status-badge sold">VENDU</span>' : '<span class="status-badge available">DISPONIBLE</span>';
    const vehicleItem = document.createElement('div');
    vehicleItem.className = 'vehicle-item';
    vehicleItem.innerHTML = `
      <h3>${car.name} ${statusBadge}</h3>
      <p><strong>Année:</strong> ${car.year}</p>
      <p><strong>Kilométrage:</strong> ${car.km}</p>
      <p><strong>Prix:</strong> ${car.price}</p>
      <p><strong>Description:</strong> ${car.description}</p>
      <p><strong>Statut:</strong> ${car.status === 'sold' ? 'Vendu' : 'Disponible'}</p>
      <div class="vehicle-actions">
        <button class="btn-edit" onclick="editVehicle(${index})">Modifier</button>
        <button class="btn-delete" onclick="deleteVehicle(${index})">Supprimer</button>
      </div>
    `;
    vehiclesList.appendChild(vehicleItem);
  });
}

// Edit vehicle
function editVehicle(index) {
  const cars = JSON.parse(localStorage.getItem('cars'));
  const car = cars[index];
  
  // Fill form with car data
  document.getElementById('carName').value = car.name;
  document.getElementById('carYear').value = car.year;
  document.getElementById('carKm').value = car.km;
  document.getElementById('carPrice').value = car.price;
  document.getElementById('carImage').value = car.image;
  document.getElementById('carDescription').value = car.description;
  document.getElementById('carStatus').value = car.status || 'available';
  
  editingIndex = index;
  
  // Scroll to form
  document.getElementById('vehicleForm').scrollIntoView({ behavior: 'smooth' });
}

// Delete vehicle
function deleteVehicle(index) {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce véhicule?')) {
    let cars = JSON.parse(localStorage.getItem('cars'));
    cars.splice(index, 1);
    localStorage.setItem('cars', JSON.stringify(cars));
    
    // Save to server so changes appear to all public users
    saveCarsToServer(cars);
    
    loadAdminVehicles();
    showSuccessMessage('Véhicule supprimé avec succès!');
  }
}

// Handle form submission
function handleFormSubmit(event) {
  event.preventDefault();

  const newCar = {
    name: document.getElementById('carName').value,
    year: document.getElementById('carYear').value,
    km: document.getElementById('carKm').value,
    price: document.getElementById('carPrice').value,
    image: document.getElementById('carImage').value,
    description: document.getElementById('carDescription').value,
    status: document.getElementById('carStatus').value
  };

  let cars = JSON.parse(localStorage.getItem('cars')) || [];

  if (editingIndex !== null) {
    // Update existing car
    cars[editingIndex] = newCar;
    editingIndex = null;
  } else {
    // Add new car
    cars.push(newCar);
  }

  // Save to localStorage
  localStorage.setItem('cars', JSON.stringify(cars));

  // Save to server (cars.json) so changes appear to all public users
  saveCarsToServer(cars);

  // Reset form
  document.getElementById('vehicleForm').reset();

  // Reload vehicles list
  loadAdminVehicles();

  // Show success message
  showSuccessMessage('Véhicule sauvegardé avec succès!');
}

// Save cars data to server
function saveCarsToServer(cars) {
  fetch('../api/save-cars.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(cars)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('Cars saved to server');
    } else {
      console.error('Error saving to server:', data.error);
    }
  })
  .catch(error => console.error('Error:', error));
}
}

// Show success message
function showSuccessMessage(message) {
  const successMessage = document.getElementById('successMessage');
  successMessage.textContent = message;
  successMessage.classList.add('show');

  setTimeout(() => {
    successMessage.classList.remove('show');
  }, 3000);
}

// Override loadCars to load from localStorage if available
const originalLoadCars = window.loadCars;
window.loadCars = async function() {
  const cars = localStorage.getItem('cars');
  if (cars) {
    displayCars(JSON.parse(cars));
  } else {
    originalLoadCars();
  }
};
