<?php
include 'conexion_db.php';

$device_name = "arduino";
$led_status = "ON";
$timestamp = date('Y-m-d H:i:s'); 

$sql = "INSERT INTO led_data (device_name, timestamp, led_status) VALUES ('$device_name', '$timestamp', '$led_status')";

if ($conn->query($sql) === TRUE) {
  echo "Se ha creado un nuevo registro";
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>
