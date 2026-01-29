<?php
// getCars.php - Read and return cars data from SQLite database

// Set JSON response header
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Database file path
$dbFile = __DIR__ . '/../cars.db';

try {
    // Create database connection
    $pdo = new PDO('sqlite:' . $dbFile);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Query all cars
    $stmt = $pdo->query("SELECT id, name, year, km, price, image, description, status FROM cars ORDER BY id");
    $cars = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return the cars data
    echo json_encode($cars);
} catch (PDOException $e) {
    // Return empty array on error
    echo json_encode([]);
}
?>
