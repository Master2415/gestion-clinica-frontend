import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { MensajeDTO } from '../modelo/mensaje-dto';
import { Ciudad } from '../modelo/ciudad';
import { TipoSangre } from '../modelo/tipo-sangre';
import { Especialidad } from '../modelo/especialidad';

@Injectable({
    providedIn: 'root',
})
export class ClinicaService {

    private clinicaURL = `${environment.apiUrl}/clinica`;

    // Cache para evitar llamadas repetidas
    private ciudadesCache: Ciudad[] | null = null;
    private tiposSangreCache: TipoSangre[] | null = null;
    private especialidadesCache: Especialidad[] | null = null;

    constructor(private http: HttpClient) { }

    listarCiudades(): Observable<MensajeDTO<Ciudad[]>> {
        if (this.ciudadesCache) {
            return of({ respuesta: this.ciudadesCache, error: false });
        }
        return this.http.get<MensajeDTO<Ciudad[]>>(`${this.clinicaURL}/lista-ciudades`)
            .pipe(
                tap(response => {
                    if (response.respuesta) {
                        this.ciudadesCache = response.respuesta;
                    }
                })
            );
    }

    listarTiposSangre(): Observable<MensajeDTO<TipoSangre[]>> {
        if (this.tiposSangreCache) {
            return of({ respuesta: this.tiposSangreCache, error: false });
        }
        return this.http.get<MensajeDTO<TipoSangre[]>>(`${this.clinicaURL}/lista-tipo-sangre`)
            .pipe(
                tap(response => {
                    if (response.respuesta) {
                        this.tiposSangreCache = response.respuesta;
                    }
                })
            );
    }

    listarEspecialidades(): Observable<MensajeDTO<Especialidad[]>> {
        if (this.especialidadesCache) {
            return of({ respuesta: this.especialidadesCache, error: false });
        }
        return this.http.get<MensajeDTO<Especialidad[]>>(`${this.clinicaURL}/lista-especializacion`)
            .pipe(
                tap(response => {
                    if (response.respuesta) {
                        this.especialidadesCache = response.respuesta;
                    }
                })
            );
    }
}
