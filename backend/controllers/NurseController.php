<?php
include 'db_connect.php';

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
    
        echo json_encode($response);
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
                    {$data['lgpd']}, 
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
                    {$data['exactLocation']}
                )";
    
        if ($conn->query($sql) === TRUE) {
            return $conn->insert_id;
        } else {
            die(json_encode(["message" => "Error saving nurse record: " . $conn->error]));
        }
    }
    
    private function updateNurse($id, $data) {
        global $conn;
        
        $sql = "UPDATE nurse SET 
                    uuid = '{$data['uuid']}', 
                    name = '{$data['name']}', 
                    phone = '{$data['phone']}', 
                    email = '{$data['email']}', 
                    instagram = '{$data['instagram']}', 
                    facebook = '{$data['facebook']}', 
                    twitter = '{$data['twitter']}', 
                    linkedin = '{$data['linkedin']}', 
                    birthday = '{$data['birthday']}', 
                    gender = '{$data['gender']}', 
                    coren = '{$data['coren']}', 
                    specialties = '{$data['specialties']}', 
                    lgpd = {$data['lgpd']}, 
                    zipCode = '{$data['zipCode']}', 
                    type = '{$data['type']}', 
                    street = '{$data['street']}', 
                    district = '{$data['district']}', 
                    complement = '{$data['complement']}', 
                    city = '{$data['city']}', 
                    state = '{$data['state']}', 
                    country = '{$data['country']}', 
                    number = '{$data['number']}', 
                    latitude = {$data['latitude']}, 
                    longitude = {$data['longitude']}, 
                    exactLocation = {$data['exactLocation']} 
                WHERE id = $id";
    
        if ($conn->query($sql) === FALSE) {
            die(json_encode(["message" => "Error updating nurse record: " . $conn->error]));
        }
    }
    
    private function buildNurseResponse($id, $data) {
        return [
            "id" => $id,
            "uuid" => $data['uuid'],
            "name" => $data['name'],
            "cpf" => $data['cpf'],
            "phone" => $data['phone'],
            "email" => $data['email'],
            "instagram" => $data['instagram'],
            "facebook" => $data['facebook'],
            "twitter" => $data['twitter'],
            "linkedin" => $data['linkedin'],
            "birthday" => $data['birthday'],
            "gender" => $data['gender'],
            "coren" => $data['coren'],
            "specialties" => json_decode($data['specialties'], true),
            "lgpd" => $data['lgpd'],
            "zipCode" => $data['zipCode'],
            "type" => $data['type'],
            "street" => $data['street'],
            "district" => $data['district'],
            "complement" => $data['complement'],
            "city" => $data['city'],
            "state" => $data['state'],
            "country" => $data['country'],
            "number" => $data['number'],
            "latitude" => $data['latitude'] !== 'NULL' ? (float)$data['latitude'] : null,
            "longitude" => $data['longitude'] !== 'NULL' ? (float)$data['longitude'] : null,
            "exactLocation" => $data['exactLocation']
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
            foreach ($row as $key => $value) {
                if (is_string($value)) {
                    $row[$key] = mb_convert_encoding($value, 'UTF-8', 'UTF-8');
                }
            }
    
            if (isset($row['specialties']) && !is_null($row['specialties'])) {
                $specialties = json_decode($row['specialties'], true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $row['specialties'] = $specialties;
                } else {
                    $row['specialties'] = null;
                }
            }
    
            $nurses[] = $row;
        }
    
        return $nurses;
    }

    private function processQueryResult($result) {
        if ($result->num_rows > 0) {
            $nurse = $result->fetch_assoc();
    
            foreach ($nurse as $key => $value) {
                if (is_string($value)) {
                    $nurse[$key] = mb_convert_encoding($value, 'UTF-8', 'UTF-8');
                }
            }
    
            if (isset($nurse['specialties']) && !is_null($nurse['specialties'])) {
                $specialties = json_decode($nurse['specialties'], true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $nurse['specialties'] = $specialties;
                } else {
                    $nurse['specialties'] = null;
                }
            }
    
            return $nurse;
        } else {
            return ["message" => "Nurse not found"];
        }
    }    
    
    private function outputJson($data) {
        $json_output = json_encode($data);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            die("Error encoding JSON: " . json_last_error_msg());
        }
    
        echo $json_output;
    }

}

?>
