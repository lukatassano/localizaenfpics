<?php
$servername = 'bdlivre.ufrgs.br';
$port = 3306;
$dbname = 'enfpics';
$username = 'enfpics';
$password = 'OqjWhpsMD6M7';

$conn = new mysqli($servername, $username, $password, $dbname, $port);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

?>
