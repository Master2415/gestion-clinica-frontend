export interface HorarioDTO {
  dia: {
    codigo: number;
    nombre: string;
  };
  horaInicio: string; // Format: "HH:mm"
  horaFin: string; // Format: "HH:mm"
  duracionMinutos: number;
}
