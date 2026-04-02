<?php
header('Content-Type: application/json');
require_once 'config.php';

// Admin Token Check
$token = $_POST['token'] ?? '';
if($token !== 'admin_token_123456') { // Production: JWT verify
    http_response_code(401);
    exit(json_encode(['success' => false, 'message' => 'Unauthorized']));
}

if(isset($_FILES['video'])) {
    $title = sanitize($_POST['title']);
    $category = sanitize($_POST['category']);
    
    $uploadDir = '../uploads/videos/' . date('Y/m/');
    if(!file_exists($uploadDir)) mkdir($uploadDir, 0777, true);
    
    $videoName = uniqid() . '.mp4';
    $videoPath = $uploadDir . $videoName;
    
    if(move_uploaded_file($_FILES['video']['tmp_name'], $videoPath)) {
        $stmt = $pdo->prepare("INSERT INTO videos (title, category, video_path) VALUES (?, ?, ?)");
        $stmt->execute([$title, $category, $videoPath]);
        
        echo json_encode(['success' => true, 'message' => 'Video uploaded']);
    }
}
?>
