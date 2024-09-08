<?php
$up = function($conn) {
    $sql = "CREATE TABLE nurse (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        cpf VARCHAR(20) NOT NULL,
        phone VARCHAR(20),
        email VARCHAR(255),
        instagram VARCHAR(255),
        facebook VARCHAR(255),
        twitter VARCHAR(255),
        linkedin VARCHAR(255),
        birthday VARCHAR(50),
        gender VARCHAR(20),
        coren VARCHAR(80),
        specialties JSON,
        lgpd BOOLEAN DEFAULT FALSE,
        zipCode VARCHAR(30),
        type VARCHAR(30),
        street VARCHAR(255),
        district VARCHAR(255),
        complement VARCHAR(255),
        city VARCHAR(100),
        state VARCHAR(100),
        country VARCHAR(100),
        number VARCHAR(10),
        latitude DOUBLE,
        longitude DOUBLE,
        exactLocation BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";

    if ($conn->query($sql) === TRUE) {
        echo "Table 'nurse' created successfully." . PHP_EOL;
    } else {
        echo "Error creating table 'nurse': " . $conn->error . PHP_EOL;
    }
};

$down = function($conn) {
    $sql = "DROP TABLE IF EXISTS nurse";

    if ($conn->query($sql) === TRUE) {
        echo "Table 'nurse' dropped successfully." . PHP_EOL;
    } else {
        echo "Error dropping table 'nurse': " . $conn->error . PHP_EOL;
    }
};
?>
