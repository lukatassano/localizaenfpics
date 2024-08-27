<?php
include './controllers/NurseController.php';

$method = $_SERVER['REQUEST_METHOD'];
$nurseController = new NurseController();
$requestUri = $_SERVER['REQUEST_URI'];

$frontendBuildPath = './dist';

if (strpos($requestUri, '/api') === 0 && strpos($requestUri, '/nurse') !== false) {
    $endpoint = str_replace('/api/nurse', '', $requestUri);

    if ($method == 'GET') {
        if (isset($_GET['id'])) {
            $nurseController->getNurseById($_GET['id']);
        } else {
            $nurseController->getNursesInArea($_GET);
        }
    } elseif ($method == 'POST') {
        $nurseController->saveOrUpdateNurse();
    } else {
        echo json_encode(["message" => "Invalid request method"]);
    }

    exit;
}

if ($requestUri === '/') {
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

$requestedFilePath = $frontendBuildPath . $requestUri;
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

http_response_code(404);
echo json_encode(["message" => "Resource not found"]);
?>
