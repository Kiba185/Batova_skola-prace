<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");


$servername = "db.db049.endora.cz";
$username = "bataskola_hys_cz";
$password = "Qwertz123.";
$dbname = "bataskola.hys.cz";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);
$user = $conn->real_escape_string($data["username"]);
$score = intval($data["score"]);

$sql = "INSERT INTO scores (username, score) VALUES ('$user', $score)
        ON DUPLICATE KEY UPDATE score = GREATEST(score, VALUES(score))";

if ($conn->query($sql)) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => $conn->error]);
}
$conn->close();
?>
