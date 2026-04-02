<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
require_once 'config.php';

$action = $_GET['action'] ?? '';

switch($action) {
    case 'list':
        $filter = sanitize($_GET['filter'] ?? 'all');
        $where = $filter === 'all' ? '' : "WHERE category = '$filter'";
        $stmt = $pdo->query("SELECT * FROM videos $where ORDER BY uploaded_at DESC LIMIT 20");
        echo json_encode(['videos' => $stmt->fetchAll()]);
        break;
        
    case 'view':
        $id = (int)$_GET['id'];
        $pdo->query("UPDATE videos SET views = views + 1 WHERE id = $id");
        break;
}
?>
