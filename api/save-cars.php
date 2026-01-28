<?php
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

// Path to cars.json file
$filePath = dirname(__DIR__) . '/cars.json';

// Ensure the file is writable
if (!is_writable(dirname($filePath))) {
    http_response_code(500);
    echo json_encode(['error' => 'Cannot write to cars.json file']);
    exit;
}

// Write the data to cars.json with nice formatting
$json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
if (file_put_contents($filePath, $json) !== false) {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Cars data saved successfully']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save cars.json']);
}
?>
