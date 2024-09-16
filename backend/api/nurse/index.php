<?php
include './NurseController.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];
$nurseController = new NurseController();
$requestUri = $_SERVER['REQUEST_URI'];

// Ajuste da verificação da URI para o novo caminho
if (strpos($requestUri, '/localizaenfpics/api') === 0 && strpos($requestUri, '/nurse') !== false) {
    // Atualize a substituição para refletir o novo caminho base
    $endpoint = str_replace('/localizaenfpics/api/nurse', '', $requestUri);

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

http_response_code(404);
echo json_encode(["message" => "Resource not found"]);
?>
