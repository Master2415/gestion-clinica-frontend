import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../modelo/mensaje-dto';

@Injectable({
  providedIn: 'root',
})
export class ImagenService {
  private apiUrl = 'http://localhost:8080/api/imagenes';

  constructor(private http: HttpClient) {}

  public subir(imagen: File): Observable<MensajeDTO<any>> {
    const formData = new FormData();
    formData.append('file', imagen);
    return this.http.post<MensajeDTO<any>>(`${this.apiUrl}/subir`, formData);
  }

  public eliminar(id: string): Observable<MensajeDTO<any>> {
    return this.http.delete<MensajeDTO<any>>(`${this.apiUrl}/eliminar`, { body: { id } });
  }
}
