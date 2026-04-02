<?php
// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'sax_video_girls');
define('DB_USER', 'root');
define('DB_PASS', '');

try {
    $pdo = new PDO("mysql:host=".DB_HOST.";dbname=".DB_NAME.";charset=utf8mb4", DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die(json_encode(['error' => 'Database connection failed']));
}

// Create Tables
function initTables($pdo) {
    $pdo->exec("CREATE TABLE IF NOT EXISTS videos (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255),
        category VARCHAR(50),
        video_path VARCHAR(500),
        thumbnail_path VARCHAR(500),
        views INT DEFAULT 0,
        duration VARCHAR(20),
        status ENUM('published','draft') DEFAULT 'published',
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    
    $pdo->exec("CREATE TABLE IF NOT EXISTS categories (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100),
        slug VARCHAR(100),
        PRIMARY KEY (id)
    )");
}
initTables($pdo);

function sanitize($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}
?>
