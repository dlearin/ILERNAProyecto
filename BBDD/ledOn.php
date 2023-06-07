<?php
include 'conexion_db.php';

$nombre_dispotivo = "arduino";
$led_estatus = "ON";
$tiempoSuceso = date('Y-m-d H:i:s'); 

$sql = "INSERT INTO datos_led (nombre_dispositivo, tiempo, estatus_led) VALUES ('$nombre_dispotivo','$tiempoSuceso','$led_estatus')";

if ($conn->query($sql) === TRUE) {
  echo "Se ha creado un nuevo registro";
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>
