import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators'

const API_URL = "http://localhost:3000/account"

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http : HttpClient) { }
  
  private resp

  authenticate(user: string, password: string){
    return this.http.get(API_URL, {observe: 'response'})
      // Verificar se esta autenticado durante o retorno, interceptar a chamada - Utilizado para capturar um token de autenticação e guardar em cache com outro serviço
      .pipe(
        tap (res => {
          this.resp = res
          this.resp.map(res => {
            if(res.email == user || res.password == password){
              return true
            }else{
              return false
            }
          })
      })
      )
  }

}
