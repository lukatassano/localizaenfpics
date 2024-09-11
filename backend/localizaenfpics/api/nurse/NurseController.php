<?php
include './db_connect.php';

class NurseController {

    public function getNursesInArea($params) {
        $sql = $this->buildQueryForArea($params);
        $result = $this->executeQuery($sql);
        $nurses = $this->processQueryResults($result);
        $this->outputJson($nurses);
    }
    
    public function getNurseById($id) {
        $sql = $this->buildQueryForNurseById($id);
        $result = $this->executeQuery($sql);
        $nurse = $this->processQueryResult($result);
        $this->outputJson($nurse);
    }

    public function saveOrUpdateNurse() {
        global $conn;
    
        $data = json_decode(file_get_contents('php://input'), true);
        $cpf = $conn->real_escape_string($data['cpf']);
        $existingNurse = $this->getNurseByCpf($cpf);
        $preparedData = $this->prepareNurseData($data);

        if ($existingNurse) {
            $this->updateNurse($existingNurse['id'], $preparedData);
            $response = $this->buildNurseResponse((int)$existingNurse['id'], $preparedData);
        } else {
            $insertedId = $this->insertNurse($preparedData);
            $response = $this->buildNurseResponse((int)$insertedId, $preparedData);
        }
    
        $this->outputJson($response);
        // echo json_encode($response);
    }

    private function buildQueryForNurseById($id) {
        global $conn;
        
        $id = $conn->real_escape_string($id);
    
        return "SELECT id, uuid, name, cpf, phone, email, instagram, facebook, twitter, linkedin, birthday, gender, coren, 
                CAST(specialties AS CHAR) AS specialties, lgpd, zipCode, type, street, district, complement, city, state, country, 
                number, latitude, longitude, exactLocation, created_at FROM nurse WHERE id = $id";
    }
    
    private function getNurseByCpf($cpf) {
        global $conn;
        $sql = "SELECT id FROM nurse WHERE cpf = '$cpf'";
        $result = $conn->query($sql);
    
        if ($result === false) {
            die("Error executing SQL: " . $conn->error);
        }
    
        return $result->fetch_assoc();
    }
    
    private function prepareNurseData($data) {
        global $conn;
    
        return [
            "uuid" => isset($data['uuid']) ? $conn->real_escape_string($data['uuid']) : '',
            "name" => isset($data['name']) ? $conn->real_escape_string($data['name']) : '',
            "cpf" => isset($data['cpf']) ? $conn->real_escape_string($data['cpf']) : '',
            "phone" => isset($data['phone']) ? $conn->real_escape_string($data['phone']) : '',
            "email" => isset($data['email']) ? $conn->real_escape_string($data['email']) : '',
            "instagram" => isset($data['instagram']) ? $conn->real_escape_string($data['instagram']) : '',
            "facebook" => isset($data['facebook']) ? $conn->real_escape_string($data['facebook']) : '',
            "twitter" => isset($data['twitter']) ? $conn->real_escape_string($data['twitter']) : '',
            "linkedin" => isset($data['linkedin']) ? $conn->real_escape_string($data['linkedin']) : '',
            "birthday" => isset($data['birthday']) ? $conn->real_escape_string($data['birthday']) : '',
            "gender" => isset($data['gender']) ? $conn->real_escape_string($data['gender']) : '',
            "coren" => isset($data['coren']) ? $conn->real_escape_string($data['coren']) : '',
            "specialties" => isset($data['specialties']) ? $conn->real_escape_string(json_encode($data['specialties'])) : '',
            "lgpd" => isset($data['lgpd']) ? $conn->real_escape_string($data['lgpd']) : 0,
            "zipCode" => isset($data['zipCode']) ? $conn->real_escape_string($data['zipCode']) : '',
            "type" => isset($data['type']) ? $conn->real_escape_string($data['type']) : '',
            "street" => isset($data['street']) ? $conn->real_escape_string($data['street']) : '',
            "district" => isset($data['district']) ? $conn->real_escape_string($data['district']) : '',
            "complement" => isset($data['complement']) ? $conn->real_escape_string($data['complement']) : '',
            "city" => isset($data['city']) ? $conn->real_escape_string($data['city']) : '',
            "state" => isset($data['state']) ? $conn->real_escape_string($data['state']) : '',
            "country" => isset($data['country']) ? $conn->real_escape_string($data['country']) : '',
            "number" => isset($data['number']) ? $conn->real_escape_string($data['number']) : '',
            "latitude" => isset($data['latitude']) ? $conn->real_escape_string($data['latitude']) : 'NULL',
            "longitude" => isset($data['longitude']) ? $conn->real_escape_string($data['longitude']) : 'NULL',
            "exactLocation" => isset($data['exactLocation']) ? $conn->real_escape_string($data['exactLocation']) : 0
        ];
    }
    
    private function insertNurse($data) {
        global $conn;
        
        $lgpdValue = $data['lgpd'] ? 1 : 0;
        $exactLocation = $data['exactLocation'] ? 1 : 0;

        $sql = "INSERT INTO nurse (
                    uuid, name, cpf, phone, email, instagram, facebook, twitter, linkedin, 
                    birthday, gender, coren, specialties, lgpd, zipCode, type, street, district, 
                    complement, city, state, country, number, latitude, longitude, exactLocation
                ) VALUES (
                    '{$data['uuid']}', 
                    '{$data['name']}', 
                    '{$data['cpf']}', 
                    '{$data['phone']}', 
                    '{$data['email']}', 
                    '{$data['instagram']}', 
                    '{$data['facebook']}', 
                    '{$data['twitter']}', 
                    '{$data['linkedin']}', 
                    '{$data['birthday']}', 
                    '{$data['gender']}', 
                    '{$data['coren']}', 
                    '{$data['specialties']}', 
                    {$lgpdValue}, 
                    '{$data['zipCode']}', 
                    '{$data['type']}', 
                    '{$data['street']}', 
                    '{$data['district']}', 
                    '{$data['complement']}', 
                    '{$data['city']}', 
                    '{$data['state']}', 
                    '{$data['country']}', 
                    '{$data['number']}', 
                    {$data['latitude']}, 
                    {$data['longitude']}, 
                    {$exactLocation}
                )";
    
        if ($conn->query($sql) === TRUE) {
            return $conn->insert_id;
        } else {
            die(json_encode(["message" => "Error saving nurse record: " . $conn->error]));
        }
    }
    
    private function updateNurse($id, $data) {
        global $conn;
        
        $setClause = $this->buildSetClause($data);
        $sql = "UPDATE nurse SET $setClause WHERE id = $id";
    
        if ($conn->query($sql) === FALSE) {
            die(json_encode(["message" => "Error updating nurse record: " . $conn->error]));
        }
    }

    private function buildSetClause($data) {
        $lgpdValue = $data['lgpd'] ? 1 : 0;
        $exactLocation = $data['exactLocation'] ? 1 : 0;

        $setClauses = [
            "uuid" => "'" . stripslashes($data['uuid']) . "'",
            "name" => "'" . stripslashes($data['name']) . "'",
            "phone" => "'" . stripslashes($data['phone']) . "'",
            "email" => "'" . stripslashes($data['email']) . "'",
            "instagram" => "'" . stripslashes($data['instagram']) . "'",
            "facebook" => "'" . stripslashes($data['facebook']) . "'",
            "twitter" => "'" . stripslashes($data['twitter']) . "'",
            "linkedin" => "'" . stripslashes($data['linkedin']) . "'",
            "birthday" => "'" . stripslashes($data['birthday']) . "'",
            "gender" => "'" . stripslashes($data['gender']) . "'",
            "coren" => "'" . stripslashes($data['coren']) . "'",
            "specialties" => "'" . stripslashes($data['specialties']) . "'",
            "zipCode" => "'" . stripslashes($data['zipCode']) . "'",
            "lgpd" => $lgpdValue,
            "type" => "'" . stripslashes($data['type']) . "'",
            "street" => "'" . stripslashes($data['street']) . "'",
            "district" => "'" . stripslashes($data['district']) . "'",
            "complement" => "'" . stripslashes($data['complement']) . "'",
            "city" => "'" . stripslashes($data['city']) . "'",
            "state" => "'" . stripslashes($data['state']) . "'",
            "country" => "'" . stripslashes($data['country']) . "'",
            "number" => "'" . stripslashes($data['number']) . "'",
            "latitude" => $data['latitude'],
            "longitude" => $data['longitude'],
            "exactLocation" => $exactLocation
        ];

        $setClauseString = '';
        foreach ($setClauses as $column => $value) {
            $setClauseString .= "$column = $value, ";
        }
    
        $setClauseString = rtrim($setClauseString, ', ');
    
        return $setClauseString;
    }
    
    private function buildNurseResponse($id, $data) {
        $specialties = json_decode(stripslashes($data['specialties']), true);
        
        $uuid = stripslashes($data['uuid']);
        $name = stripslashes($data['name']);
        $cpf = stripslashes($data['cpf']);
        $phone = stripslashes($data['phone']);
        $email = stripslashes($data['email']);
        $instagram = stripslashes($data['instagram']);
        $facebook = stripslashes($data['facebook']);
        $twitter = stripslashes($data['twitter']);
        $linkedin = stripslashes($data['linkedin']);
        $birthday = stripslashes($data['birthday']);
        $gender = stripslashes($data['gender']);
        $coren = stripslashes($data['coren']);
        $zipCode = stripslashes($data['zipCode']);
        $type = stripslashes($data['type']);
        $street = stripslashes($data['street']);
        $district = stripslashes($data['district']);
        $complement = stripslashes($data['complement']);
        $city = stripslashes($data['city']);
        $state = stripslashes($data['state']);
        $country = stripslashes($data['country']);
        $number = stripslashes($data['number']);
    
        $lgpd = $data['lgpd'] !== 'NULL' ? (boolean)$data['lgpd'] : null;
        $latitude = $data['latitude'] !== 'NULL' ? (float)$data['latitude'] : null;
        $longitude = $data['longitude'] !== 'NULL' ? (float)$data['longitude'] : null;
        $exactLocation = $data['exactLocation'] !== 'NULL' ? (boolean)$data['exactLocation'] : null;
    
        return [
            "id" => $id,
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
            "specialties" => $specialties,
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
            "latitude" => $latitude,
            "longitude" => $longitude,
            "exactLocation" => $exactLocation
        ];
    }    

    private function buildQueryForArea($params) {
        global $conn;
        $sql = "SELECT id, uuid, name, cpf, phone, email, instagram, facebook, twitter, linkedin, birthday, gender, coren, 
                CAST(specialties AS CHAR) AS specialties, lgpd, zipCode, type, street, district, complement, city, state, country, 
                number, latitude, longitude, exactLocation, created_at FROM nurse";
        $conditions = [];
    
        if (isset($params['northEastLat'], $params['northEastLng'], $params['southWestLat'], $params['southWestLng'])) {
            $northEastLat = $conn->real_escape_string($params['northEastLat']);
            $northEastLng = $conn->real_escape_string($params['northEastLng']);
            $southWestLat = $conn->real_escape_string($params['southWestLat']);
            $southWestLng = $conn->real_escape_string($params['southWestLng']);
    
            $conditions[] = "latitude BETWEEN $southWestLat AND $northEastLat";
            $conditions[] = "longitude BETWEEN $southWestLng AND $northEastLng";
        }
    
        if (!empty($conditions)) {
            $sql .= " WHERE " . implode(' AND ', $conditions);
        }
    
        return $sql;
    }
    
    private function executeQuery($sql) {
        global $conn;
        $result = $conn->query($sql);
    
        if (!$result) {
            die("Error executing SQL: " . $conn->error);
        }
    
        return $result;
    }
    
    private function processQueryResults($result) {
        $nurses = [];
        while ($row = $result->fetch_assoc()) {
            $nurses[] = $this->buildNurseResponse((int)$row['id'], $row);
        }
        return $nurses;
    }

    private function processQueryResult($result) {
        if ($result->num_rows > 0) {
            $nurse = $result->fetch_assoc();
            return $this->buildNurseResponse((int)$nurse['id'], $nurse);
        } else {
            return ["message" => "Nurse not found"];
        }
    }    
    
    private function outputJson($data) {
        $json_output = json_encode($data, JSON_UNESCAPED_UNICODE);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            die("Error encoding JSON: " . json_last_error_msg());
        }
    
        echo $json_output;
    }

}

?>
