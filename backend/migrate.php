<?php
include 'db_connect.php';

function applyMigration($migration) {
    global $conn;
    
    include $migration; // Inclui o arquivo de migração

    if (isset($up) && is_callable($up)) {
        echo "Applying migration: " . basename($migration) . PHP_EOL;
        $up($conn); // Chama a função de migração 'up'
    } else {
        echo "Migration file $migration is invalid." . PHP_EOL;
    }
}

function revertMigration($migration) {
    global $conn;
    
    include $migration; // Inclui o arquivo de migração

    if (isset($down) && is_callable($down)) {
        echo "Reverting migration: " . basename($migration) . PHP_EOL;
        $down($conn); // Chama a função de migração 'down'
    } else {
        echo "Migration file $migration is invalid." . PHP_EOL;
    }
}

function getAppliedMigrations($conn) {
    $sql = "CREATE TABLE IF NOT EXISTS migrations (migration VARCHAR(255) PRIMARY KEY)";
    $conn->query($sql);

    $result = $conn->query("SELECT migration FROM migrations");
    $migrations = [];
    while ($row = $result->fetch_assoc()) {
        $migrations[] = $row['migration'];
    }
    return $migrations;
}

function saveMigration($conn, $migration) {
    $conn->query("INSERT INTO migrations (migration) VALUES ('$migration')");
}

$migrations = glob('./migrations/*.php'); // Pega todos os arquivos de migração
$appliedMigrations = getAppliedMigrations($conn);

foreach ($migrations as $migration) {
    if (!in_array(basename($migration), $appliedMigrations)) {
        applyMigration($migration);
        saveMigration($conn, basename($migration));
    }
}

echo "All migrations applied." . PHP_EOL;
?>
