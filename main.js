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
  
  //linea añadida para la reconexion

  cacheDispositivo.addEventListener('gattserverdisconnected',
    manejadorDesconexion);

// retornamos el cacheDispositivo
  return cacheDispositivo;

});

}

function manejadorDesconexion(event){

let dispositivo = event.target;

mostrar('"' + dispositivo.name +
        '" El dispositivo Bt se ha desconectado, intentando reconectar...');

conectarDispositivoYAlmacenarCaracteristica(dispositivo).
then(caracteristicas => inicioNotificaciones(caracteristicas)).
catch(error=>log(error));

}

//cache de las caracteristicas del dispotivo

let caracteristicasCache = null;

// Conectar al dispositivo especificado, obtener el servicio y la característica
function conectarDispositivoYAlmacenarCaracteristica(dispositivo) {

  if(dispositivo.gatt.connected && caracteristicasCache){

    return Promise.resolve(caracteristicasCache);
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
    caracteristicasCache = caracteristicas;
    mostrar(caracteristicasCache);
    return caracteristicasCache;
  });
  
}

// Habilitar la notificación de cambios en la característica
function inicioNotificaciones(caracteristicas) {
  mostrar('Iniciando notificaciones...');

  return caracteristicas.startNotifications().
  then(() =>{
    mostrar('Notificaciones iniciadas');
    //insertamos un evenlistener a caracteristicas para notificar cuando esta cambie
    caracteristicas.addEventListener('characteristicvaluechanged', manejadorCambioValorCaracteristicas);
  });
}

// Salida al terminal, especifico type como valor en blanco para diferente tratamiento de colo posterior según el color
function mostrar(data, type = '') {
  terminal.insertAdjacentHTML('beforeend',
      '<div' + (type ? ' class="' + type + '"' : '') + '>' + data + '</div>');
}

// Desconectamos del dispositivo
function desconectar() {
if(cacheDispositivo){
  mostrar('Desconectando de "'+ cacheDispositivo.name + '"');
  cacheDispositivo.removeEventListener('gattserverdisconnected',manejadorDesconexion);
  if(cacheDispositivo.gatt.connected){
    cacheDispositivo.gatt.disconnect();
    mostrar('"'+cacheDispositivo.name+'" dispositivo desconectado');
  }
  else{
    mostrar('"' + cacheDispositivo.name + '" el dispositivo ya esta desconectado');

  }
}

if(caracteristicasCache){

  caracteristicasCache.removeEventListener('characteristicvaluechanged',manejadorCambioValorCaracteristicas);
caracteristicasCache = null;
}

cacheDispositivo = null;

}

// funcion espeficia para la recepcion de datos
function manejadorCambioValorCaracteristicas(event){
// lo primero es crear un objeto textdecoder o interfa api de codificacion que proporciona decodificacion de texto desde un flujo de bytes.
  let valor = new TextDecoder().decode(event.target.value); //cnvertirmos el flujo de bytes en string de texto
mostrar(valor, 'entrante');

}

// Funcion para enviar datos
/**
 * 
 * Para enviar data unicamente necesitamos usar el metodo writeValue() del objeto 
 * con arraybuffer como argumento. para convertir
 * arraybuffer de string a arraybuffer usaremos texteconder
 */
function enviar(datos) {

  datos = String(datos);

  if(!datos || !caracteristicasCache){
    return;
  }

  escribeEnCaracteristicas(caracteristicasCache, datos);
  mostrar(datos,'saliente');

}

function escribeEnCaracteristicas(caracteristicas, data){
  caracteristicas.writeValue(new TextEncoder().encode(datos));
}