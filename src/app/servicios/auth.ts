import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginDTO } from '../modelo/login-dto';
import { RegistroPacienteDTO } from '../modelo/registro-paciente-dto';
import { MensajeDTO } from '../modelo/mensaje-dto';
import { TokenDTO } from '../modelo/token-dto';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private authURL = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) { }

  login(loginDTO: LoginDTO): Observable<MensajeDTO<TokenDTO>> {
    return this.http.post<MensajeDTO<TokenDTO>>(`${this.authURL}/login`, loginDTO);
  }

  registrarse(registroDTO: RegistroPacienteDTO): Observable<MensajeDTO<string>> {
    return this.http.post<MensajeDTO<string>>(`${this.authURL}/registrarse`, registroDTO);
  }
}

