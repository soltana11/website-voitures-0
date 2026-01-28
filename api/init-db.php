<?php
// init-db.php - Initialize SQLite database and migrate data from cars.json

// Database file path
$dbFile = __DIR__ . '/../cars.db';

// Create database connection
try {
    $pdo = new PDO('sqlite:' . $dbFile);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Database connection established.\n";
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage() . "\n");
}

// Create cars table
$createTableSQL = "
CREATE TABLE IF NOT EXISTS cars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    year TEXT NOT NULL,
    km TEXT NOT NULL,
    price TEXT NOT NULL,
    image TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'available'
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
                    $car['year'] ?? '',
                    $car['km'] ?? '',
                    $car['price'] ?? '',
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
