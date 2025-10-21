<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$servername = "db.db049.endora.cz";
$username = "bataskola.hys.cz";
$password = "Qwertz123.";
$dbname = "bataskola.hys.cz";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$result = $conn->query("SELECT username, score FROM scores ORDER BY score DESC LIMIT 10");
$scores = [];
while ($row = $result->fetch_assoc()) {
    $scores[] = $row;
}
echo json_encode($scores);
$conn->close();
?>
