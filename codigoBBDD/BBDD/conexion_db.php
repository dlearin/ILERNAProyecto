<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "blueduino";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Comprobar conexión
if ($conn->connect_error) {
  die("La conexion a la base de datos ha fallado: " . $conn->connect_error);
}
else echo "Conectado";
?>
