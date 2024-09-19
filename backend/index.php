<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json; charset=utf-8');

$requestUri = $_SERVER['REQUEST_URI'];

$frontendBuildPath = './';

if ($requestUri === '/localizaenfpics/') {
    $indexPath = $frontendBuildPath . '/index.html';
    
    if (file_exists($indexPath)) {
        header('Content-Type: text/html; charset=utf-8');
        readfile($indexPath);
        exit;
    } else {
        echo json_encode(["message" => "Frontend build not found."]);
        exit;
    }
}

http_response_code(404);
echo json_encode(["message" => "Resource not found"]);
?>
