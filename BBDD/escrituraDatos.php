<?php
include 'conexion_db.php';

$nombre_dispotivo = "arduino";
$led_estatus = "ON";
$tiempoSuceso = date('Y-m-d H:i:s'); 

$sql = "INSERT INTO led_data (device_name, timestamp, led_status) VALUES ('$nombre_dispotivo', '$led_estatus', '$tiempoSuceso')";

if ($conn->query($sql) === TRUE) {
  echo "Se ha creado un nuevo registro";
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>
