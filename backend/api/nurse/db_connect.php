<?php
$servername = getenv('DB_URL') ?: 'bdlivre.ufrgs.br';
$port = getenv('DB_PORT') ?: 3306;
$dbname = getenv('DB_NAME') ?: 'enfpics';
$username = getenv('DB_USER') ?: 'enfpics';
$password = getenv('DB_PASS') ?: 'OqjWhpsMD6M7';

$conn = new mysqli($servername, $username, $password, $dbname, $port);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

?>
