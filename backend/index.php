<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];
$requestUri = $_SERVER['REQUEST_URI'];

$frontendBuildPath = './dist';

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

$requestedFilePath = $frontendBuildPath . '/dist';

if (file_exists($requestedFilePath)) {
    $fileExtension = pathinfo($requestedFilePath, PATHINFO_EXTENSION);
    
    switch ($fileExtension) {
        case 'css':
            header('Content-Type: text/css; charset=utf-8');
            break;
        case 'js':
            header('Content-Type: application/javascript; charset=utf-8');
            break;
        case 'png':
            header('Content-Type: image/png');
            break;
        case 'jpg':
        case 'jpeg':
            header('Content-Type: image/jpeg');
            break;
        case 'svg':
            header('Content-Type: image/svg+xml');
            break;
        case 'json':
            header('Content-Type: application/json; charset=utf-8');
            break;
        default:
            header('Content-Type: application/octet-stream');
    }

    readfile($requestedFilePath);
    exit;
}
?>
