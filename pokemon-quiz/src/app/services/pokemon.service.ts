import {Injectable} from '@angular/core';
import {catchError, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Pokemon} from '../models/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private base: string = 'https://tyradex.vercel.app/api/v1/pokemon';

  constructor(private http: HttpClient) {}

  getPokemon(id: number): Observable<Pokemon> {
    const url = `${this.base}/${id}`;
    return this.http.get<Pokemon>(url).pipe(catchError((error) => {
      throw 'Error in source. Details: ' + error;
    }));
  }

  getRandomId() {
    return Math.floor(Math.random() * 1025) + 1;
  }
}
