//Constructores
function Seguro(marca, year, tipo) {
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
};
//Prototype de seguro, metodo para realizar el calculo de la cotizacion.
Seguro.prototype.cotizarSeguro = function() {
    /*
    1 = Americano 1.15
    2 = Asiatico 1.05
    3 = Europeo 1.35
    */
   let cantidad;
   const base = 2000;

   switch (this.marca) {
    case "1": cantidad = base * 1.15;
    break;
    
    case "2": cantidad = base * 1.05;
    break;
    
    case "3": cantidad = base * 1.35;
    break;

    default:
        break;
   }

   //Sacar la antiguedad del auto
   const diferencia = new Date().getFullYear() - this.year;
   //Con cada year de antiguedad el costo se reduce 3%
   cantidad -= (cantidad * 0.03) * diferencia;

   /*
   Si el seguro es basico, el total subira un 30%
   Si el seguro es completo, el total subira un 50%
   */

   if(this.tipo === 'basico'){
    cantidad *= 1.30;
   } else {
    cantidad *= 1.50;
   }

   return cantidad;
}

function UI() {};

UI.prototype.llenarOpciones = function() {
    const max = new Date().getFullYear(),
          min = max - 20;
    
    const selectYear = document.querySelector('#year');
    for (let i = max; i > min; i--) {
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
}
//Muestra alertas en la pantalla
UI.prototype.mostrarMensaje = (mensaje, tipo) => {
    const div = document.createElement('div');
    //Agregar clases
    div.classList.add('mensaje', 'mt-10');
    //Agregar texto
    div.textContent = mensaje;
    //Condicional
    if (tipo === 'error'){
        div.classList.add('error');
    } else {
        div.classList.add('correcto');
    }
    //Agregar al HTML
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.insertBefore(div, document.querySelector('#resultado'));
    //Temporizador para borrar mensaje
    setTimeout(() => {
        div.remove();
    }, 3000);

}
//Mostrar la cotizacion
UI.prototype.mostrarResultado = (seguro, total) => {
    //Extraer los datos de la instancia de Seguro, con destructuring
    const {marca, year, tipo} = seguro;
    //Convertir el valor numerico de marca a texto con la estructura switch
    let textoMarca;
    switch(marca) {

        case "1":
            textoMarca = "Americano"
            break;
        
        case "2":
            textoMarca = "Asiatico"
            break;
        
        case "3":
            textoMarca = "Europeo"
            break;

        default:
            break;
    };
    //crear el resultado
    const div = document.createElement('div');
    div.classList.add('mt-10');
    div.innerHTML = `
          <p class="header">Tu resumen</p>
          <p class="font-bold">Marca: <span class="font-normal">${textoMarca}</span></p>
          <p class="font-bold">Year: <span class="font-normal">${year}</span></p>
          <p class="font-bold">Tipo: <span class="font-normal capitalize">${tipo}</span></p>
          <p class="font-bold">Total: <span class="font-normal">$ ${total}</span></p>
    `;
    //Tomar el div padre donde insertaremos este div
    const resultadoDiv = document.querySelector('#resultado');
    
    //Mostrar un spinner
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';

    setTimeout(() => {
        spinner.style.display = 'none'; //Se elimina el spinner
        resultadoDiv.appendChild(div); //Se incrusta el div con el resulatdo
    }, 3000)

}
//Instancias
const ui = new UI();

//Eventos
document.addEventListener('DOMContentLoaded', () => {
    ui.llenarOpciones(); /*Al cargar el DOMe ejecuta este metodo, 
    que es una funcion que llena las opciones del select year*/
});

eventListeners();
function eventListeners() {
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro);
}

//Funciones

function cotizarSeguro(e) {
    e.preventDefault();
    //Tomar la marca
    const marca = document.querySelector('#marca').value;
    //Tomar year
    const year = document.querySelector('#year').value;
    //Tomar tipo de seguro
    const tipo = document.querySelector('input[name="tipo"]:checked').value;
    
    if(marca === "" || year === "" || tipo === "") {
        ui.mostrarMensaje('Todos los campos son obligatorios', 'error');
        return;
    } 
    ui.mostrarMensaje('Cotizando...', 'exito');
    //Ocultar las cotizaciones pasadas
    const cotizacion = document.querySelector('#resultado div');
    if (cotizacion != null) {
        cotizacion.remove();
    }
    //Instanciar el seguro
    const seguro = new Seguro(marca, year, tipo);
    const total = seguro.cotizarSeguro();

    //Usar el prototype que va a cotizar
    ui.mostrarResultado(seguro, total);
}


