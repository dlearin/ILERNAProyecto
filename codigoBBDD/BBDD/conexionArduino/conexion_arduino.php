<?php
include 'conexion_db.php';

$nombre_dispotivo = "arduino";
$conexion_estatus = "CONECTADO";
$tiempoSuceso = date('Y-m-d H:i:s'); 

$sql = "INSERT INTO conexion_arduino (nombre_dispositivo, tiempo, estatus_conexion) VALUES ('$nombre_dispotivo','$tiempoSuceso','$conexion_estatus')";

if ($conn->query($sql) === TRUE) {
  echo "Se ha creado un nuevo registro";
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>
