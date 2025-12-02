import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MensajeDTO } from '../modelo/mensaje-dto';
import { ItemMedicoDTO } from '../modelo/item-medico-dto';
import { DetalleMedicoDTO } from '../modelo/detalle-medico-dto';
import { RegistroMedicoDTO } from '../modelo/registro-medico-dto';
import { ItemPqrsAdminDTO } from '../modelo/item-pqrs-admin-dto';
import { InfoPQRSDTO } from '../modelo/info-pqrs-dto';
import { RespuestaAdminDTO } from '../modelo/respuesta-admin-dto';
import { CitaDTOAdmin } from '../modelo/cita-dto-admin';

@Injectable({
  providedIn: 'root',
})
export class AdministradorService {
  private adminURL = `${environment.apiUrl}/administrador`;

  constructor(private http: HttpClient) {}

  // Gestión de Médicos
  listarMedicos(): Observable<MensajeDTO<ItemMedicoDTO[]>> {
    return this.http.get<MensajeDTO<ItemMedicoDTO[]>>(`${this.adminURL}/listar-medicos`);
  }

  obtenerMedico(codigo: number): Observable<MensajeDTO<DetalleMedicoDTO>> {
    return this.http.get<MensajeDTO<DetalleMedicoDTO>>(`${this.adminURL}/detalle-medico/${codigo}`);
  }

  crearMedico(medico: RegistroMedicoDTO): Observable<MensajeDTO<string>> {
    return this.http.post<MensajeDTO<string>>(`${this.adminURL}/crear-medico`, medico);
  }

  actualizarMedico(medico: DetalleMedicoDTO): Observable<MensajeDTO<string>> {
    return this.http.put<MensajeDTO<string>>(`${this.adminURL}/actualizar-medico`, medico);
  }

  eliminarMedico(codigo: number): Observable<MensajeDTO<string>> {
    return this.http.delete<MensajeDTO<string>>(`${this.adminURL}/eliminar-medico/${codigo}`);
  }

  // Gestión de PQRS
  listarPQRS(): Observable<MensajeDTO<ItemPqrsAdminDTO[]>> {
    return this.http.get<MensajeDTO<ItemPqrsAdminDTO[]>>(`${this.adminURL}/listar-pqrs`);
  }

  verDetallePQRS(codigo: number): Observable<MensajeDTO<InfoPQRSDTO>> {
    return this.http.get<MensajeDTO<InfoPQRSDTO>>(`${this.adminURL}/ver-detalle-pqrs/${codigo}`);
  }

  responderPQRS(respuesta: RespuestaAdminDTO): Observable<MensajeDTO<string>> {
    return this.http.post<MensajeDTO<string>>(`${this.adminURL}/responder-pqrs`, respuesta);
  }

  cambiarEstadoPQRS(codigoPQRS: number, codigoEstado: number): Observable<MensajeDTO<string>> {
    return this.http.put<MensajeDTO<string>>(
      `${this.adminURL}/cambiar-estado-pqrs/${codigoPQRS}/${codigoEstado}`,
      {}
    );
  }

  // Gestión de Citas
  listarCitas(): Observable<MensajeDTO<CitaDTOAdmin[]>> {
    return this.http.get<MensajeDTO<CitaDTOAdmin[]>>(`${this.adminURL}/listar-citas`);
  }
}
