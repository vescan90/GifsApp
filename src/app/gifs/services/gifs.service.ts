import { HttpClient, HttpParams } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey: string = 'YzczlI0BjxaJwYgAhEl8hLouUYbdWBhe';
  private servicioUrl = 'https://api.giphy.com/v1/gifs';
  private _historial: string[] = [];

  public resultados: Gif[] = [];

  get historial() {
    return [...this._historial];
  }


  //inyecto el http
  constructor( private http: HttpClient ) {

    // **** cargar el localstorage ****

    //otra forma de hacerlo:
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse( localStorage.getItem('resultados')!) || [];

    

    //esta es una forma de hacerlo:
    //if( localStorage.getItem('historial') ){
      //this._historial = JSON.parse ( localStorage.getItem('historial')!)
    // } 

  }

  //con el = de abajo nos aseguramos que siempre tenga un valor
  buscarGifs( query: string = ''){

    //almaceno todo en minuscula para que no reciba el mismo valor en mayuscula
    query = query.trim().toLocaleLowerCase();

    //el if es para evitar que se repitan los mismos valores en el input
    if( !this._historial.includes( query )) {
      this._historial.unshift( query );
      //la siguiente línea es para limitar la cantidad de etiquetas al lado izquierdo en este caso 10
      this._historial = this._historial.splice(0,10);

      //Para almacenar en el localstorage
      localStorage.setItem('historial', JSON.stringify( this._historial ) );
      
    }

    const params = new HttpParams()
          .set('api_key', this.apiKey)
          .set('limit', '10')
          .set('q', query);



    this.http.get<SearchGifsResponse>(`${ this.servicioUrl }/search`, { params } )
      .subscribe( ( resp )=> {
        console.log(resp.data);
        this.resultados = resp.data;
        localStorage.setItem('resultados', JSON.stringify( this.resultados) );
      });
  

  }

}
