<?php
include 'conexion_db.php';

$nombre_dispotivo = "arduino";
$motor_estatus = "OFF";
$tiempoSuceso = date('Y-m-d H:i:s'); 

$sql = "INSERT INTO datos_motor (nombre_dispositivo, tiempo, estatus_motor) VALUES ('$nombre_dispotivo','$tiempoSuceso','$led_estatus')";

if ($conn->query($sql) === TRUE) {
  echo "Se ha creado un nuevo registro";
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>
