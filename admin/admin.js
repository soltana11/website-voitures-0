// Admin Panel Script (Firestore version)
import { db, app } from '../firebase-config.js';
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
  console.log('handleFormSubmit called');

  try {
    // Step 1: Get form values
    const name = document.getElementById('carName').value.trim();
    const brand = document.getElementById('carBrand').value.trim();
    const year = document.getElementById('carYear').value.trim();
    const km = document.getElementById('carKm').value.trim();
    const price = document.getElementById('carPrice').value.trim();
    const description = document.getElementById('carDescription').value.trim();
    const status = document.getElementById('carStatus').value;

    // Step 2: Validate required fields
    if (!name || !brand || !year || !km || !price || !description) {
      alert('Veuillez remplir tous les champs requis.');
      return;
    }

    // Step 3: Initialize image URL - use existing image if editing, otherwise default placeholder
    let imageUrl = '';
    if (editingId) {
      // If editing, get the existing car's image URL to preserve it if no new image is uploaded
      const cars = JSON.parse(localStorage.getItem('cars')) || [];
      const existingCar = cars.find(c => c.id === editingId);
      imageUrl = existingCar ? existingCar.image || '' : '';
    }
    // If no image URL yet, set to default placeholder
    if (!imageUrl) {
      imageUrl = 'https://via.placeholder.com/300x200?text=No+Image+Available'; // Default placeholder image URL
    }

    // Step 4: Handle image upload if a file is selected
    const fileInput = document.getElementById('carFile');
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      console.log('File selected:', file.name, 'Size:', file.size, 'Type:', file.type);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image valide.');
        console.error('Invalid file type:', file.type);
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image ne doit pas dépasser 5MB.');
        console.error('File too large:', file.size);
        return;
      }

      console.log('Initializing Firebase Storage...');
      const storage = getStorage(app);
      console.log('Storage initialized:', storage);

      // Create a unique filename to avoid conflicts
      const fileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const storagePath = `cars/${Date.now()}_${fileName}`;
      console.log('Storage path:', storagePath);

      const storageRef = ref(storage, storagePath);
      console.log('Storage ref created:', storageRef);

      try {
        console.log('Starting upload to Firebase Storage...');
        // Upload the file using async/await - Firebase handles retries internally to prevent "retry-limit-exceeded"
        const snapshot = await uploadBytes(storageRef, file);
        console.log('Upload successful! Snapshot:', snapshot);

        console.log('Getting download URL from Firebase Storage...');
        // Get the download URL after successful upload
        imageUrl = await getDownloadURL(snapshot.ref);
        console.log('Download URL obtained:', imageUrl);

      } catch (uploadError) {
        console.error('Upload error details:', uploadError);
        console.error('Error code:', uploadError.code);
        console.error('Error message:', uploadError.message);

        // Handle specific Firebase Storage errors to prevent retry issues
        let errorMessage = 'Erreur lors du téléchargement de l\'image: ';
        if (uploadError.code === 'storage/unauthorized') {
          errorMessage += 'Accès non autorisé. Vérifiez les règles de stockage Firebase.';
        } else if (uploadError.code === 'storage/canceled') {
          errorMessage += 'Téléchargement annulé.';
        } else if (uploadError.code === 'storage/quota-exceeded') {
          errorMessage += 'Quota dépassé.';
        } else if (uploadError.code === 'storage/retry-limit-exceeded') {
          errorMessage += 'Limite de tentatives dépassée. Vérifiez votre connexion internet.';
        } else {
          errorMessage += uploadError.message;
        }

        alert(errorMessage + ' Le véhicule sera ajouté avec l\'image par défaut.');
        // Continue with default image URL (already set above)
      }
    } else {
      console.log('No new image file selected, using existing or default image URL');
    }
    
    // Step 5: Prepare car data with the image URL
    const carData = {
      name,
      brand,
      year,
      km,
      price,
      description,
      status,
      image: imageUrl, // This will be the uploaded URL or default placeholder
      createdAt: new Date().toISOString()
    };

    console.log('Final car data to save:', carData);

    // Step 6: Save to Firestore
    if (editingId) {
      console.log('Updating existing car with ID:', editingId);
      await updateDoc(doc(db, 'cars', editingId), carData);
      console.log('Car updated successfully');
      editingId = null;
    } else {
      console.log('Adding new car to Firestore');
      await addDoc(collection(db, 'cars'), carData);
      console.log('Car added successfully');
    }

    // Step 7: Reset form and clear preview
    document.getElementById('vehicleForm').reset();
    const previewDiv = document.getElementById('imagePreview');
    if (previewDiv) previewDiv.innerHTML = '';

    // Step 8: Reload vehicles list and show success message
    loadAdminVehicles();
    showSuccessMessage('Véhicule sauvegardé avec succès!');

  } catch (error) {
    console.error('Unexpected error in handleFormSubmit:', error);
    console.error('Error stack:', error.stack);
    alert('Erreur inattendue lors de la sauvegarde: ' + error.message);
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

