<?php
// save-cars.php - Save cars data to SQLite database

// Allow cross-origin requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get the JSON data from request body
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || !is_array($data)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON data']);
    exit;
}

// Database file path
$dbFile = dirname(__DIR__) . '/cars.db';

try {
    // Create database connection
    $pdo = new PDO('sqlite:' . $dbFile);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Begin transaction
    $pdo->beginTransaction();

    // Clear existing data
    $pdo->exec("DELETE FROM cars");

    // Insert new data
    $insertSQL = "INSERT INTO cars (name, year, km, price, image, description, status) VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($insertSQL);

    foreach ($data as $car) {
        $stmt->execute([
            $car['name'] ?? '',
            $car['year'] ?? '',
            $car['km'] ?? '',
            $car['price'] ?? '',
            $car['image'] ?? '',
            $car['description'] ?? '',
            $car['status'] ?? 'available'
        ]);
    }

    // Commit transaction
    $pdo->commit();

    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Cars data saved successfully']);
} catch (PDOException $e) {
    // Rollback on error
    if (isset($pdo)) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save data: ' . $e->getMessage()]);
}
?>
