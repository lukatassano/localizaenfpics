<?php

// include '../../db_connect.php';
include '../../backend/controllers/NurseController.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    if (isset($_GET['id'])) {
        echo json_encode(["message" => "Invalid request method"]);
        $nurseController = new NurseController();
        $nurseController->getNurseById($_GET['id']);
    } else {
        $nurseController = new NurseController();
        $nurseController->getNursesInArea($_GET);
    }
} elseif ($method == 'POST') {
    $nurseController = new NurseController();
    $nurseController->saveOrUpdateNurse();
} else {
    echo json_encode(["message" => "Invalid request method"]);
}
?>
