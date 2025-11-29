import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MensajeDTO } from '../modelo/mensaje-dto';
import { ConsultaDTO } from '../modelo/consulta-dto';
import { DetalleAtencionMedicaDTO } from '../modelo/detalle-atencion-medica-dto';
import { RegistroAtencionDTO } from '../modelo/registro-atencion-dto';
import { DiaLibreDTO } from '../modelo/dia-libre-dto';

@Injectable({
    providedIn: 'root',
})
export class MedicoService {

    private medicoURL = `${environment.apiUrl}/medico`;

    constructor(private http: HttpClient) { }

    // Appointments Management
    listarCitasPendientes(codigoMedico: number): Observable<MensajeDTO<ConsultaDTO[]>> {
        return this.http.get<MensajeDTO<ConsultaDTO[]>>(`${this.medicoURL}/listar-citas-pendientes/${codigoMedico}`);
    }

    listarCitasRealizadas(codigoMedico: number): Observable<MensajeDTO<DetalleAtencionMedicaDTO[]>> {
        return this.http.get<MensajeDTO<DetalleAtencionMedicaDTO[]>>(`${this.medicoURL}/listar-citas-realizadas/${codigoMedico}`);
    }

    verDetalleAtencion(codigoCita: number): Observable<MensajeDTO<DetalleAtencionMedicaDTO>> {
        return this.http.get<MensajeDTO<DetalleAtencionMedicaDTO>>(`${this.medicoURL}/detalle-consulta/${codigoCita}`);
    }

    atenderCita(registro: RegistroAtencionDTO): Observable<MensajeDTO<string>> {
        return this.http.post<MensajeDTO<string>>(`${this.medicoURL}/atender-cita`, registro);
    }

    // Patient History
    listarHistorialPaciente(codigoPaciente: number): Observable<MensajeDTO<DetalleAtencionMedicaDTO[]>> {
        return this.http.get<MensajeDTO<DetalleAtencionMedicaDTO[]>>(`${this.medicoURL}/historial-atenciones-paciente/${codigoPaciente}`);
    }

    // Schedule Management
    agendarDiaLibre(diaLibre: DiaLibreDTO): Observable<MensajeDTO<string>> {
        return this.http.post<MensajeDTO<string>>(`${this.medicoURL}/agendar-dia-libre`, diaLibre);
    }
}
