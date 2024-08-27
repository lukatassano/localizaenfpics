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
    
        // Verificar se o enfermeiro já existe e obter o ID se existir
        $sql = "SELECT id, COUNT(*) as count FROM nurse WHERE cpf = '$cpf'";
        $result = $conn->query($sql);
    
        if ($result === false) {
            die("Error executing SQL: " . $conn->error);
        }
    
        // Obter o número de registros encontrados com o mesmo CPF
        $row = $result->fetch_assoc();
        $recordCount = $row['count'];
        $existingId = isset($row['id']) ? $row['id'] : null;
    
        // Verifique e sanitize todos os dados
        $uuid = isset($data['uuid']) ? $conn->real_escape_string($data['uuid']) : '';
        $name = isset($data['name']) ? $conn->real_escape_string($data['name']) : '';
        $phone = isset($data['phone']) ? $conn->real_escape_string($data['phone']) : '';
        $email = isset($data['email']) ? $conn->real_escape_string($data['email']) : '';
        $instagram = isset($data['instagram']) ? $conn->real_escape_string($data['instagram']) : '';
        $facebook = isset($data['facebook']) ? $conn->real_escape_string($data['facebook']) : '';
        $twitter = isset($data['twitter']) ? $conn->real_escape_string($data['twitter']) : '';
        $linkedin = isset($data['linkedin']) ? $conn->real_escape_string($data['linkedin']) : '';
        $birthday = isset($data['birthday']) ? $conn->real_escape_string($data['birthday']) : '';
        $gender = isset($data['gender']) ? $conn->real_escape_string($data['gender']) : '';
        $coren = isset($data['coren']) ? $conn->real_escape_string($data['coren']) : '';
        $specialties = isset($data['specialties']) ? $conn->real_escape_string(json_encode($data['specialties'])) : '';
        $lgpd = isset($data['lgpd']) ? $conn->real_escape_string($data['lgpd']) : 0;
    
        // Verificar e sanitize todos os campos de endereço diretamente
        $zipCode = isset($data['zipCode']) ? $conn->real_escape_string($data['zipCode']) : '';
        $type = isset($data['type']) ? $conn->real_escape_string($data['type']) : '';
        $street = isset($data['street']) ? $conn->real_escape_string($data['street']) : '';
        $district = isset($data['district']) ? $conn->real_escape_string($data['district']) : '';
        $complement = isset($data['complement']) ? $conn->real_escape_string($data['complement']) : '';
        $city = isset($data['city']) ? $conn->real_escape_string($data['city']) : '';
        $state = isset($data['state']) ? $conn->real_escape_string($data['state']) : '';
        $country = isset($data['country']) ? $conn->real_escape_string($data['country']) : '';
        $number = isset($data['number']) ? $conn->real_escape_string($data['number']) : '';
        $latitude = isset($data['latitude']) ? $conn->real_escape_string($data['latitude']) : 'NULL';
        $longitude = isset($data['longitude']) ? $conn->real_escape_string($data['longitude']) : 'NULL';
        $exactLocation = isset($data['exactLocation']) ? $conn->real_escape_string($data['exactLocation']) : 0;
    
        if ($recordCount > 0 && $existingId !== null) {
            // Atualizar o registro existente
            $sql = "UPDATE nurse SET 
                        uuid = '$uuid', 
                        name = '$name', 
                        phone = '$phone', 
                        email = '$email', 
                        instagram = '$instagram', 
                        facebook = '$facebook', 
                        twitter = '$twitter', 
                        linkedin = '$linkedin', 
                        birthday = '$birthday', 
                        gender = '$gender', 
                        coren = '$coren', 
                        specialties = '$specialties', 
                        lgpd = $lgpd, 
                        zipCode = '$zipCode', 
                        type = '$type', 
                        street = '$street', 
                        district = '$district', 
                        complement = '$complement', 
                        city = '$city', 
                        state = '$state', 
                        country = '$country', 
                        number = '$number', 
                        latitude = $latitude, 
                        longitude = $longitude, 
                        exactLocation = $exactLocation 
                    WHERE cpf = '$cpf'";
    
            if ($conn->query($sql) === TRUE) {
                // Retornar o objeto atualizado com o ID
                $updatedNurse = [
                    "id" => $existingId,
                    "uuid" => $uuid,
                    "name" => $name,
                    "cpf" => $cpf,
                    "phone" => $phone,
                    "email" => $email,
                    "instagram" => $instagram,
                    "facebook" => $facebook,
                    "twitter" => $twitter,
                    "linkedin" => $linkedin,
                    "birthday" => $birthday,
                    "gender" => $gender,
                    "coren" => $coren,
                    "specialties" => json_decode($specialties, true),
                    "lgpd" => $lgpd,
                    "zipCode" => $zipCode,
                    "type" => $type,
                    "street" => $street,
                    "district" => $district,
                    "complement" => $complement,
                    "city" => $city,
                    "state" => $state,
                    "country" => $country,
                    "number" => $number,
                    "latitude" => $latitude !== 'NULL' ? (float)$latitude : null,
                    "longitude" => $longitude !== 'NULL' ? (float)$longitude : null,
                    "exactLocation" => $exactLocation
                ];
    
                echo json_encode($updatedNurse);
            } else {
                echo json_encode(["message" => "Error updating nurse record: " . $conn->error]);
            }
        } else {
            // Inserir um novo registro
            $sql = "INSERT INTO nurse (
                        uuid, name, cpf, phone, email, instagram, facebook, twitter, linkedin, 
                        birthday, gender, coren, specialties, lgpd, zipCode, type, street, district, 
                        complement, city, state, country, number, latitude, longitude, exactLocation
                    ) VALUES (
                        '$uuid', 
                        '$name', 
                        '$cpf', 
                        '$phone', 
                        '$email', 
                        '$instagram', 
                        '$facebook', 
                        '$twitter', 
                        '$linkedin', 
                        '$birthday', 
                        '$gender', 
                        '$coren', 
                        '$specialties', 
                        $lgpd, 
                        '$zipCode', 
                        '$type', 
                        '$street', 
                        '$district', 
                        '$complement', 
                        '$city', 
                        '$state', 
                        '$country', 
                        '$number', 
                        $latitude, 
                        $longitude, 
                        $exactLocation
                    )";
    
            if ($conn->query($sql) === TRUE) {
                // Obter o ID do registro recém-inserido
                $insertedId = $conn->insert_id;
    
                // Construir o objeto de retorno diretamente dos dados
                $savedNurse = [
                    "id" => $insertedId,
                    "uuid" => $uuid,
                    "name" => $name,
                    "cpf" => $cpf,
                    "phone" => $phone,
                    "email" => $email,
                    "instagram" => $instagram,
                    "facebook" => $facebook,
                    "twitter" => $twitter,
                    "linkedin" => $linkedin,
                    "birthday" => $birthday,
                    "gender" => $gender,
                    "coren" => $coren,
                    "specialties" => json_decode($specialties, true),
                    "lgpd" => $lgpd,
                    "zipCode" => $zipCode,
                    "type" => $type,
                    "street" => $street,
                    "district" => $district,
                    "complement" => $complement,
                    "city" => $city,
                    "state" => $state,
                    "country" => $country,
                    "number" => $number,
                    "latitude" => $latitude !== 'NULL' ? (float)$latitude : null,
                    "longitude" => $longitude !== 'NULL' ? (float)$longitude : null,
                    "exactLocation" => $exactLocation
                ];
    
                echo json_encode($savedNurse);
            } else {
                echo json_encode(["message" => "Error saving nurse record: " . $conn->error]);
            }
        }
    }
    

}

?>
