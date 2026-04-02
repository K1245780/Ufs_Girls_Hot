<?php
header('Content-Type: application/json');
require_once 'config.php';

$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? '';

if($action === 'login') {
    $email = sanitize($input['email']);
    $password = $input['password'];
    
    // Simple auth (Production: use JWT + bcrypt)
    if($email === 'admin@saxvideogirls.com' && $password === 'admin123') {
        $token = base64_encode($email . time());
        echo json_encode(['success' => true, 'token' => $token]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
    }
}
?>
