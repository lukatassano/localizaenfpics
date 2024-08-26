<?php
// Inclua a configuração de conexão com o banco de dados
$servername = "db";
$username = "my_user";
$password = "my_password";
$dbname = "my_database";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

class NurseController {

    public function getNursesInArea($params) {
        global $conn;
    
        // Inicialize a consulta
        $sql = "SELECT id, uuid, name, cpf, phone, email, instagram, facebook, twitter, linkedin, birthday, gender, coren, 
                CAST(specialties AS CHAR) AS specialties, lgpd, zipCode, type, street, district, complement, city, state, country, 
                number, latitude, longitude, exactLocation, created_at FROM nurse";
        $conditions = [];
    
        // Verifique se os parâmetros estão definidos e prepare a consulta com condições
        if (isset($params['northEastLat'], $params['northEastLng'], $params['southWestLat'], $params['southWestLng'])) {
            $northEastLat = $conn->real_escape_string($params['northEastLat']);
            $northEastLng = $conn->real_escape_string($params['northEastLng']);
            $southWestLat = $conn->real_escape_string($params['southWestLat']);
            $southWestLng = $conn->real_escape_string($params['southWestLng']);
    
            $conditions[] = "latitude BETWEEN $southWestLat AND $northEastLat";
            $conditions[] = "longitude BETWEEN $southWestLng AND $northEastLng";
        }
    
        // Se houver condições, adicione-as à consulta
        if (!empty($conditions)) {
            $sql .= " WHERE " . implode(' AND ', $conditions);
        }
    
        // Execute a consulta
        $result = $conn->query($sql);
    
        if (!$result) {
            die("Error executing SQL: " . $conn->error);
        }
    
        $nurses = [];
        while ($row = $result->fetch_assoc()) {
            // Converta todos os valores de string para UTF-8 para evitar problemas de codificação
            foreach ($row as $key => $value) {
                if (is_string($value)) {
                    $row[$key] = mb_convert_encoding($value, 'UTF-8', 'UTF-8');
                }
            }
    
            // Decodifique o campo specialties de JSON para um array associativo
            if (isset($row['specialties']) && !is_null($row['specialties'])) {
                $specialties = json_decode($row['specialties'], true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $row['specialties'] = $specialties;
                } else {
                    $row['specialties'] = null;  // ou trate o erro de outra forma, conforme necessário
                }
            }
            $nurses[] = $row;
        }
    
        // Verifique se o JSON de saída está bem formatado
        $json_output = json_encode($nurses);
        if (json_last_error() !== JSON_ERROR_NONE) {
            die("Error encoding JSON: " . json_last_error_msg());
        }
    
        echo $json_output;
    }
    
    
    public function getNurseById($id) {
        global $conn;

        // Modifique a consulta para usar CAST em specialties
        $sql = "SELECT id, uuid, name, cpf, phone, email, instagram, facebook, twitter, linkedin, birthday, gender, coren, 
                CAST(specialties AS CHAR) AS specialties, lgpd, zipCode, type, street, district, complement, city, state, country, 
                number, latitude, longitude, exactLocation, created_at FROM nurse WHERE id = ?";
        $stmt = $conn->prepare($sql);

        if ($stmt === false) {
            die("Error preparing SQL: " . $conn->error);
        }

        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $nurse = $result->fetch_assoc();

            // Decodifique o campo specialties de JSON para um array associativo
            if (isset($nurse['specialties']) && !is_null($nurse['specialties'])) {
                $nurse['specialties'] = json_decode($nurse['specialties'], true);
            }

            echo json_encode($nurse);
        } else {
            echo json_encode(["message" => "Nurse not found"]);
        }
    }

    public function saveOrUpdateNurse() {
        global $conn;
    
        $data = json_decode(file_get_contents('php://input'), true);
        $cpf = $conn->real_escape_string($data['cpf']);
    
        // Verificar se o enfermeiro já existe, usando CAST para converter o campo specialties em CHAR
        $sql = "SELECT id, uuid, name, cpf, phone, email, instagram, facebook, twitter, linkedin, birthday, gender, coren, 
                CAST(specialties AS CHAR) AS specialties, lgpd, zipCode, type, street, district, complement, city, state, country, 
                number, latitude, longitude, exactLocation, created_at 
                FROM nurse WHERE cpf = '$cpf'";
        $result = $conn->query($sql);
    
        if ($result === false) {
            die("Error executing SQL: " . $conn->error);
        }
    
        // Encode specialties para uma string JSON
        $specialties = $conn->real_escape_string(json_encode($data['specialties']));
    
        if ($result->num_rows > 0) {
            // Atualizar o registro existente
            $sql = "UPDATE nurse SET 
                        uuid = '{$conn->real_escape_string($data['uuid'])}', 
                        name = '{$conn->real_escape_string($data['name'])}', 
                        phone = '{$conn->real_escape_string($data['phone'])}', 
                        email = '{$conn->real_escape_string($data['email'])}', 
                        instagram = '{$conn->real_escape_string($data['instagram'])}', 
                        facebook = '{$conn->real_escape_string($data['facebook'])}', 
                        twitter = '{$conn->real_escape_string($data['twitter'])}', 
                        linkedin = '{$conn->real_escape_string($data['linkedin'])}', 
                        birthday = '{$conn->real_escape_string($data['birthday'])}', 
                        gender = '{$conn->real_escape_string($data['gender'])}', 
                        coren = '{$conn->real_escape_string($data['coren'])}', 
                        specialties = '$specialties', 
                        lgpd = {$conn->real_escape_string($data['lgpd'])}, 
                        zipCode = '{$conn->real_escape_string($data['address']['zipCode'])}', 
                        type = '{$conn->real_escape_string($data['address']['type'])}', 
                        street = '{$conn->real_escape_string($data['address']['street'])}', 
                        district = '{$conn->real_escape_string($data['address']['district'])}', 
                        complement = '{$conn->real_escape_string($data['address']['complement'])}', 
                        city = '{$conn->real_escape_string($data['address']['city'])}', 
                        state = '{$conn->real_escape_string($data['address']['state'])}', 
                        country = '{$conn->real_escape_string($data['address']['country'])}', 
                        number = '{$conn->real_escape_string($data['address']['number'])}', 
                        latitude = {$conn->real_escape_string($data['address']['latitude'])}, 
                        longitude = {$conn->real_escape_string($data['address']['longitude'])}, 
                        exactLocation = {$conn->real_escape_string($data['address']['exactLocation'])} 
                    WHERE cpf = '$cpf'";
        } else {
            // Inserir um novo registro
            $sql = "INSERT INTO nurse (
                        uuid, name, cpf, phone, email, instagram, facebook, twitter, linkedin, 
                        birthday, gender, coren, specialties, lgpd, zipCode, type, street, district, 
                        complement, city, state, country, number, latitude, longitude, exactLocation
                    ) VALUES (
                        '{$conn->real_escape_string($data['uuid'])}', 
                        '{$conn->real_escape_string($data['name'])}', 
                        '$cpf', 
                        '{$conn->real_escape_string($data['phone'])}', 
                        '{$conn->real_escape_string($data['email'])}', 
                        '{$conn->real_escape_string($data['instagram'])}', 
                        '{$conn->real_escape_string($data['facebook'])}', 
                        '{$conn->real_escape_string($data['twitter'])}', 
                        '{$conn->real_escape_string($data['linkedin'])}', 
                        '{$conn->real_escape_string($data['birthday'])}', 
                        '{$conn->real_escape_string($data['gender'])}', 
                        '{$conn->real_escape_string($data['coren'])}', 
                        '$specialties', 
                        {$conn->real_escape_string($data['lgpd'])}, 
                        '{$conn->real_escape_string($data['address']['zipCode'])}', 
                        '{$conn->real_escape_string($data['address']['type'])}', 
                        '{$conn->real_escape_string($data['address']['street'])}', 
                        '{$conn->real_escape_string($data['address']['district'])}', 
                        '{$conn->real_escape_string($data['address']['complement'])}', 
                        '{$conn->real_escape_string($data['address']['city'])}', 
                        '{$conn->real_escape_string($data['address']['state'])}', 
                        '{$conn->real_escape_string($data['address']['country'])}', 
                        '{$conn->real_escape_string($data['address']['number'])}', 
                        {$conn->real_escape_string($data['address']['latitude'])}, 
                        {$conn->real_escape_string($data['address']['longitude'])}, 
                        {$conn->real_escape_string($data['address']['exactLocation'])}
                    )";
        }
    
        // Execute a consulta SQL
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Nurse record saved successfully"]);
        } else {
            echo json_encode(["message" => "Error saving nurse record: " . $conn->error]);
        }
    }    

}

?>
