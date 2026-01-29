<?php
// init-db.php - Initialize MySQL database and migrate data from cars.json

require_once __DIR__ . '/../config.php';

// Create database connection
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Database connection established.\n";
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage() . "\n");
}

// Create cars table
$createTableSQL = "
CREATE TABLE IF NOT EXISTS cars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    year INT NOT NULL,
    km INT NOT NULL,
    price INT NOT NULL,
    image VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'available'
);
";

try {
    $pdo->exec($createTableSQL);
    echo "Cars table created successfully.\n";
} catch (PDOException $e) {
    die("Error creating table: " . $e->getMessage() . "\n");
}

// Migrate data from cars.json if it exists
$carsJsonFile = __DIR__ . '/../cars.json';
if (file_exists($carsJsonFile)) {
    $jsonContent = file_get_contents($carsJsonFile);
    $cars = json_decode($jsonContent, true);

    if ($cars && is_array($cars)) {
        // Check if data already exists
        $stmt = $pdo->query("SELECT COUNT(*) FROM cars");
        $count = $stmt->fetchColumn();

        if ($count == 0) {
            // Insert data
            $insertSQL = "INSERT INTO cars (name, year, km, price, image, description, status) VALUES (?, ?, ?, ?, ?, ?, ?)";
            $stmt = $pdo->prepare($insertSQL);

            foreach ($cars as $car) {
                $stmt->execute([
                    $car['name'] ?? '',
                    (int)($car['year'] ?? 0),
                    (int)($car['km'] ?? 0),
                    (int)($car['price'] ?? 0),
                    $car['image'] ?? '',
                    $car['description'] ?? '',
                    $car['status'] ?? 'available'
                ]);
            }
            echo "Data migrated from cars.json successfully.\n";
        } else {
            echo "Data already exists in database, skipping migration.\n";
        }
    } else {
        echo "Invalid or empty cars.json file.\n";
    }
} else {
    echo "cars.json not found, no data to migrate.\n";
}

echo "Database initialization complete.\n";
?>
