<?php
// getCars.php - Read and return cars.json data

// Set JSON response header
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Path to cars.json
$carsFile = __DIR__ . '/../cars.json';

// Check if file exists
if (!file_exists($carsFile)) {
    // Return empty array if file doesn't exist
    echo json_encode([]);
    exit;
}

// Read the file
$jsonContent = file_get_contents($carsFile);

// Validate JSON
$cars = json_decode($jsonContent, true);

if ($cars === null) {
    // Return empty array if JSON is invalid
    echo json_encode([]);
    exit;
}

// Return the cars data
echo json_encode($cars);
?>
