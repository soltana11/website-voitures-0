// Admin Panel Script (Firestore version)
import { db } from '../firebase-config.js';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js';

let editingId = null; // will store document ID when editing

console.log('Admin panel script loaded (Firestore)');



document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, loading vehicles from Firestore...');
  loadAdminVehicles();

  const form = document.getElementById('vehicleForm');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }
});

// Load vehicles from Firestore
async function loadAdminVehicles() {
  const vehiclesList = document.getElementById('vehiclesList');
  if (!vehiclesList) return;

  vehiclesList.innerHTML = '<p>Chargement...</p>';

  try {
    const querySnapshot = await getDocs(collection(db, 'cars'));
    const cars = [];
    querySnapshot.forEach(docSnap => {
      cars.push({ id: docSnap.id, ...docSnap.data() });
    });
    localStorage.setItem('cars', JSON.stringify(cars));
    displayAdminVehicles(cars);
  } catch (error) {
    console.error('Erreur Firestore:', error);
    vehiclesList.innerHTML = '<p style="color:red;">Impossible de charger les véhicules.</p>';
  }
}

// Display vehicles
function displayAdminVehicles(cars) {
  const vehiclesList = document.getElementById('vehiclesList');
  vehiclesList.innerHTML = '';

  if (!cars || cars.length === 0) {
    vehiclesList.innerHTML = '<p style="text-align:center;color:#999;padding:2rem;">Aucun véhicule trouvé. Ajoutez-en un avec le formulaire.</p>';
    return;
  }

  cars.forEach((car, index) => {
    const statusBadge = car.status === 'sold' ? '<span class="status-badge sold">VENDU</span>' : '<span class="status-badge available">DISPONIBLE</span>';
    const vehicleItem = document.createElement('div');
    vehicleItem.className = 'vehicle-item';
    vehicleItem.innerHTML = `
      <h3>${car.name} ${statusBadge}</h3>
      <p><strong>Marque:</strong> ${car.brand || ''}</p>
      <p><strong>Année:</strong> ${car.year || ''}</p>
      <p><strong>Kilométrage:</strong> ${car.km || ''}</p>
      <p><strong>Prix:</strong> ${car.price || ''}</p>
      <p><strong>Description:</strong> ${car.description || ''}</p>
      <p><strong>Statut:</strong> ${car.status === 'sold' ? 'Vendu' : 'Disponible'}</p>
      <div class="vehicle-actions">
        <button class="btn-edit" onclick="editVehicle('${car.id}')">Modifier</button>
        <button class="btn-delete" onclick="deleteVehicle('${car.id}')">Supprimer</button>
      </div>
    `;
    vehiclesList.appendChild(vehicleItem);
  });
}

// Make functions global so buttons can call them
window.editVehicle = editVehicle;
window.deleteVehicle = deleteVehicle;

function editVehicle(id) {
  const cars = JSON.parse(localStorage.getItem('cars')) || [];
  const car = cars.find(c => c.id === id);
  if (!car) return;

  document.getElementById('carName').value = car.name;
  document.getElementById('carBrand').value = car.brand || '';
  document.getElementById('carYear').value = car.year || '';
  document.getElementById('carKm').value = car.km || '';
  document.getElementById('carPrice').value = car.price || '';
  document.getElementById('carImage').value = car.image || '';
  document.getElementById('carDescription').value = car.description || '';
  document.getElementById('carStatus').value = car.status || 'available';

  // show existing image preview
  const previewDiv = document.getElementById('imagePreview');
  if (previewDiv && car.image) {
    previewDiv.innerHTML = `<img src="${car.image}" alt="Preview" style="max-width:200px;max-height:150px;object-fit:contain;">`;
  }

  // clear file input since we are using existing image URL unless changed
  const fileInput = document.getElementById('carFile');
  if (fileInput) fileInput.value = '';

  editingId = id;
  document.getElementById('vehicleForm').scrollIntoView({ behavior: 'smooth' });
}

async function deleteVehicle(id) {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce véhicule?')) return;
  try {
    await deleteDoc(doc(db, 'cars', id));
    showSuccessMessage('Véhicule supprimé avec succès!');
    loadAdminVehicles();
  } catch (err) {
    console.error('delete error', err);
  }
}

async function handleFormSubmit(event) {
  event.preventDefault();

  // prepare image URL, might come from hidden field or upload
  let imageUrl = document.getElementById('carImage').value || '';
  const fileInput = document.getElementById('carFile');

  // if file provided, upload to Firebase Storage
  if (fileInput && fileInput.files && fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const storage = getStorage();
    const storageRef = ref(storage, `cars/${Date.now()}_${file.name}`);
    try {
      const snapshot = await uploadBytes(storageRef, file);
      imageUrl = await getDownloadURL(snapshot.ref);
    } catch (uploadErr) {
      console.error('Upload failed', uploadErr);
    }
  }

  const carData = {
    name: document.getElementById('carName').value,
    brand: document.getElementById('carBrand').value,
    year: document.getElementById('carYear').value,
    km: document.getElementById('carKm').value,
    price: document.getElementById('carPrice').value,
    image: imageUrl,
    description: document.getElementById('carDescription').value,
    status: document.getElementById('carStatus').value
  };

  try {
    if (editingId) {
      await updateDoc(doc(db, 'cars', editingId), carData);
      editingId = null;
    } else {
      await addDoc(collection(db, 'cars'), carData);
    }
    document.getElementById('vehicleForm').reset();
    // clear preview image
    const previewDiv = document.getElementById('imagePreview');
    if (previewDiv) previewDiv.innerHTML = '';
    showSuccessMessage('Véhicule sauvegardé avec succès!');
    loadAdminVehicles();
  } catch (err) {
    console.error('save error', err);
  }
}

function showSuccessMessage(message) {
  const successMessage = document.getElementById('successMessage');
  successMessage.textContent = message;
  successMessage.classList.add('show');
  setTimeout(() => {
    successMessage.classList.remove('show');
  }, 3000);
}

