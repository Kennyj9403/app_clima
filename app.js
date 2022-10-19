import { 
    inquirerMenu, 
    leerInput, 
    listarLugares, 
    pausa}
from "./helpers/inquirer.js";
import dotenv from 'dotenv'
import { Busquedas } from "./models/busquedas.js";

dotenv.config()

const main = async() =>{
    let opt;

    const busquedas = new Busquedas();

    do {

        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                // Mostrar mensaje
    
                const termino = await leerInput('Ciudad: ');
    
                // Buscar lugares

                const lugares = await busquedas.ciudad( termino );
                
                // Seleccionar el lugar
                const id = await listarLugares( lugares );
                if (id === 0) continue;

                // Guardar DB
               
                const lugarSel = lugares.find( l => l.id === id );
                busquedas.agregarHistorial( lugarSel.nombre );

                // console.log(lugarSel);
    
                // Clima
                const clima = await busquedas.climaLugar( lugarSel.lat, lugarSel.lng );

                // Mostrar resultado
                console.clear();
                console.log('\nInfo de la ciudad\n'.green);
                console.log('Ciudad:', lugarSel.nombre.green);
                console.log('Lat:', lugarSel.lat);
                console.log('Lng: ', lugarSel.lng);
                console.log('Temperatura: ', clima.temp);
                console.log('Mínima: ', clima.min);
                console.log('Máxima: ', clima.max);
                console.log('Como está el clima: ', clima.desc.green);
            break;
    
            case 2:
                //historial capitalizado

                busquedas.historialCapitalizado.forEach( (lugar, i) =>{
                    const idx = `${ i + 1}.`.green;
                    console.log( `${ idx }  ${ lugar } ` )
                } )
                
            break;
        
            
        }
        
        if ( opt !== 0 ) await pausa();
        
    } while ( opt !== 0 );

}

main();