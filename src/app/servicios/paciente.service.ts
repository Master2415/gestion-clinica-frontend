import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../modelo/mensaje-dto';
import { CitaPacienteDTO } from '../modelo/cita-paciente-dto';
import { AgendarCitaDTO } from '../modelo/agendar-cita-dto';
import { HistorialMedicoDTO } from '../modelo/historial-medico-dto';
import { CrearPqrsDTO } from '../modelo/crear-pqrs-dto';
import { ItemMedicoDTO } from '../modelo/item-medico-dto';
import { ItemPqrsDTO } from '../modelo/item-pqrs-dto';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private pacienteURL = 'http://localhost:8080/api/paciente';

  constructor(private http: HttpClient) {}

  public listarCitasPaciente(codigoPaciente: number): Observable<MensajeDTO<CitaPacienteDTO[]>> {
    return this.http.get<MensajeDTO<CitaPacienteDTO[]>>(`${this.pacienteURL}/listar-citas/${codigoPaciente}`);
  }

  public agendarCita(dto: AgendarCitaDTO): Observable<MensajeDTO<number>> {
    return this.http.post<MensajeDTO<number>>(`${this.pacienteURL}/agendar-cita`, dto);
  }

  public verDetalleCita(codigoCita: number): Observable<MensajeDTO<any>> {
    return this.http.get<MensajeDTO<any>>(`${this.pacienteURL}/detalle-cita/${codigoCita}`);
  }

  public cancelarCita(codigoCita: number, codigoPaciente: number): Observable<MensajeDTO<string>> {
    return this.http.put<MensajeDTO<string>>(`${this.pacienteURL}/cancelar-cita/${codigoCita}/${codigoPaciente}`, {});
  }

  public listarHistorialMedico(codigoPaciente: number): Observable<MensajeDTO<HistorialMedicoDTO[]>> {
    return this.http.get<MensajeDTO<HistorialMedicoDTO[]>>(`${this.pacienteURL}/historial-medico/${codigoPaciente}`);
  }

  public crearPqrs(dto: CrearPqrsDTO): Observable<MensajeDTO<number>> {
    return this.http.post<MensajeDTO<number>>(`${this.pacienteURL}/crear-pqrs`, dto);
  }

  public listarPqrsPaciente(codigoPaciente: number): Observable<MensajeDTO<ItemPqrsDTO[]>> {
    return this.http.get<MensajeDTO<ItemPqrsDTO[]>>(`${this.pacienteURL}/listar-pqrs/${codigoPaciente}`);
  }

  public listarMedicosDisponibles(): Observable<MensajeDTO<ItemMedicoDTO[]>> {
    return this.http.get<MensajeDTO<ItemMedicoDTO[]>>(`${this.pacienteURL}/listar-medicos-disponibles`);
  }

  public verDetallePQRS(codigo: number): Observable<MensajeDTO<any>> {
    return this.http.get<MensajeDTO<any>>(`${this.pacienteURL}/detalle-pqrs/${codigo}`);
  }

  public responderPQRS(respuesta: any): Observable<MensajeDTO<string>> {
    return this.http.post<MensajeDTO<string>>(`${this.pacienteURL}/responder-pqrs`, respuesta);
  }
}
