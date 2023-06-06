// Obtenemos las referencias a los elementos de la pagina

let botonConexion = document.getElementById('btnConexion');
let botonDesconexion = document.getElementById('btnDesconexion');
let terminalContainer = document.getElementById('terminal');
let formulario = document.getElementById('formulario');
let campoInput = document.getElementById('comandos');
let cacheDispositivo = null; // inicializamos el cache del dispositivo BT en null por defecto

// Conectamos el dispositivo al pulsar sobre conectar

botonConexion.addEventListener('click', function() {
  connectar();
});

// desconectamos el dispositivo al pulsar sobre conectar

botonDesconexion.addEventListener('click', function() {
  desconectar();
});

// Gestionamos el evento del formulario

formulario.addEventListener('submit', function(event) {
  event.preventDefault(); // Lo primero, prevenimos el envio por defecto del formulario
  enviar(campoInput.value); // Enviamos el contenido del formulario, por medio de enviar un parametro a la función enviar
  campoInput.value = '';  // Inicializamos el campo con valor el blanco
  campoInput.focus();     // Focus en el campo de texto
});

/**
 * Crearemos una función que contenga promises, esto se debe a que dado que la conexión
 * BT - dispositvo puede demorarse, no se realizará de forma sincronica sino asincrona
 * En caso de crear funciones estandar, desenvocaría en errores por no realizarse
 * en tiempo sincrono.
 */

// Funcion para lanzar servicio BT y conexion

function connectar() {
  /**en caso de que ya tengamos el dispotivo guardado en nuestro cache, resolvemos true, 
   * en caso contrario llamamos a la funcion solicitarDispotivoBt
  *
  */
//lanzamos la promesa y se resuelve de ser not null cacheDispotivo
  return (cacheDispositivo ? Promise.resolve(cacheDispositivo) : 
//en caso de ser nulo, lanzamos la función solicitarDispositivoBT()
solicitarDispositivoBt()).
  then(dispositivo => conectarDispositivoYAlmacenarCaracteristica(dispositivo)).
  then(caracteristicas => inicioNotificaciones(caracteristicas)).
  catch(error => mostrar(error));

}

//funcion para solicitar la vinculacion al BT por medio de  Web Bluetooth API 
  /**
   * De cara a usar la API Web Bluetooth para solicitar un dispositivo, 
   * necesitamos emplear navigator.bluetooth.requestDevice()
   * Esta función toma un objeto de configuración como argumento, 
   * que describe qué tipo de dispositivos Bluetooth estamos buscando.
   */

function solicitarDispositivoBt() {

mostrar('Requesting bluetooth device...');

return navigator.bluetooth.requestDevice({
  filters: [{services: [0xFFE0]}],
}).
then(dispositivo => {
  mostrar('"' + dispositivo.name + '" dispositivo BT seleccionado');
  cacheDispositivo = dispositivo;
  
  return cacheDispositivo;

});

}

//cache de las caracteristicas del dispotivo

let carateristicasCache = null;

// Conectar al dispositivo especificado, obtener el servicio y la característica
function conectarDispositivoYAlmacenarCaracteristica(dispositivo) {

  if(dispositivo.gatt.connected && carateristicasCache){

    return Promise.resolve(carateristicasCache);
  }

  mostrar('Conectando al servicio GATT....');

  return dispositivo.gatt.connect().
  then(servidor =>{
    mostrar('GATT server conectado, obteniendo servicio...')
    return servidor.getPrimaryService(0xFFE0);

  }).
  then(servicio => {
    mostrar('Servicio encontrado, obteniendo caracteristicas....');
    return servicio.getCharacteristic(0xFFE1);

  }).
  then(caracteristicas =>{
    mostrar('Caracteristicas encontradas');
    carateristicasCache = caracteristicas;
  });
  
}

// Habilitar la notificación de cambios en la característica
function inicioNotificaciones(caracteristicas) {
  mostrar('Starting notifications...');

  return caracteristicas.inicioNotificaciones().
  then(() =>{
    mostrar('Notificaciones iniciadas');
  });
}

// Salida al terminal, especifico type como valor en blanco para diferente tratamiento de colo posterior según el color
function mostrar(data, type = '') {
  terminal.insertAdjacentHTML('beforeend',
      '<div' + (type ? ' class="' + type + '"' : '') + '>' + data + '</div>');
}

// Desconectamos del dispositivo
function desconectar() {
  //
}

// Funcion para enviar datos
function enviar(data) {
  //
}