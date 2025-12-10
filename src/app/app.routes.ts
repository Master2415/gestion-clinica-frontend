import { Routes } from '@angular/router';
import { Inicio } from './pagina/inicio/inicio';
import { Login } from './pagina/login/login';
import { Registro } from './pagina/registro/registro';
import { authGuard } from './guards/auth.guard';
import { AdminLayout } from './pagina/admin/layout/admin-layout';
import { Dashboard } from './pagina/admin/dashboard/dashboard';
import { ListarMedicos } from './pagina/admin/medicos/listar-medicos';
import { CrearMedico } from './pagina/admin/medicos/crear-medico';
import { ListarCitas } from './pagina/admin/citas/listar-citas';
import { ListarPqrs } from './pagina/admin/pqrs/listar-pqrs';
import { DetallePqrs } from './pagina/admin/pqrs/detalle-pqrs';
import { MedicoLayout } from './pagina/medico/layout/medico-layout';
import { MedicoDashboard } from './pagina/medico/dashboard/medico-dashboard';
import { CitasPendientes } from './pagina/medico/citas/citas-pendientes';
import { AtenderCita } from './pagina/medico/citas/atender-cita';
import { HistorialCitas } from './pagina/medico/historial/historial-citas';
import { Agenda } from './pagina/medico/agenda/agenda';
import { PacienteLayout } from './pagina/paciente/layout/paciente-layout';
import { PacienteDashboard } from './pagina/paciente/dashboard/paciente-dashboard';
import { AgendarCita } from './pagina/paciente/citas/agendar-cita';
import { MisCitas } from './pagina/paciente/citas/mis-citas';
import { HistorialMedico } from './pagina/paciente/historial/historial-medico';
import { CrearPqrs } from './pagina/paciente/dashboard/pqrs/crear-pqrs';
import { MisPqrs } from './pagina/paciente/dashboard/pqrs/mis-pqrs';
import { DetallePqrsPaciente } from './pagina/paciente/dashboard/pqrs/detalle-pqrs';

export const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'inicio', component: Inicio },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'medicos', component: ListarMedicos },
      { path: 'medicos/crear', component: CrearMedico },
      { path: 'medicos/editar/:codigo', component: CrearMedico },
      { path: 'citas', component: ListarCitas },
      { path: 'pqrs', component: ListarPqrs },
      { path: 'pqrs/:codigo', component: DetallePqrs },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  {
    path: 'medico',
    component: MedicoLayout,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: MedicoDashboard },
      { path: 'citas-pendientes', component: CitasPendientes },
      { path: 'atender-cita/:codigo', component: AtenderCita },
      { path: 'historial', component: HistorialCitas },
      { path: 'agenda', component: Agenda },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  {
    path: 'paciente',
    component: PacienteLayout,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: PacienteDashboard },
      { path: 'agendar-cita', component: AgendarCita },
      { path: 'mis-citas', component: MisCitas },
      { path: 'historial', component: HistorialMedico },
      { path: 'crear-pqrs', component: CrearPqrs },
      { path: 'mis-pqrs', component: MisPqrs },
      { path: 'mis-pqrs/:codigo', component: DetallePqrsPaciente },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
