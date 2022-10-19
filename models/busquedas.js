import fs, { readFileSync } from 'fs';
import axios from "axios";

class Busquedas{
    historial = ['Madrid' , 'Madrir', 'San Jose'];
    dbPath = './db/database.json'

    constructor(){
        // TODO: leer DB si existe
        this.leerDB();
    }

    get historialCapitalizado(){
        //capitalizar
        return this.historial.map( lugar =>{

            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase()+p.substring(1) );

            return palabras.join(' ');
        });
    }

    get paramsMapbox(){
        return {
            'language' : 'es',
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5
        }
    };

    get paramsOpenWeater(){
        return {
            'appid': process.env.OPENWEATER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    };

    async ciudad( lugar= '' ){
        // peticion http
        try {
            const intance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox
            });
    
            const resp = await intance.get();
            return resp.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }));

        } catch (error) {
            return [];
        }

    }

    async climaLugar( lat, lon ){
        try {
            
            // intance axios.create
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsOpenWeater, lat, lon }
            });
            
            const resp = await instance.get();
            const { weather, main:{ temp, temp_min, temp_max } } = resp.data;

            return {
                desc: weather[0].description,
                min: temp_min,
                max: temp_max,
                temp
            }


        } catch (error) {
            console.log( error );   
        }
    }

    agregarHistorial(lugar = ''){
        // TODO: prevenir duplicados

        if (this.historial.includes( lugar.toLocaleLowerCase() )) {
            return;
        }

        this.historial = this.historial.splice(0,5);

        this.historial.unshift( lugar.toLocaleLowerCase() );
        // Grabar en DB
        this.guardarDB();
    }

    guardarDB(){

        const payload = {
            historial: this.historial
        };

        fs.writeFileSync( this.dbPath, JSON.stringify( payload ));

    }

    leerDB(){
        // debe de existir...
        if (!fs.existsSync( this.dbPath )) return;

        const info = readFileSync( this.dbPath, {encoding: 'utf-8'});

        const data = JSON.parse(info);
        this.historial = data.historial;
    }

}

export {
    Busquedas
}