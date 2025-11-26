import { Routes } from '@angular/router';
import { Inicio } from './pagina/inicio/inicio';
import { Login } from './pagina/login/login';
import { Registro } from './pagina/registro/registro';
import { AdminLayout } from './pagina/admin/layout/admin-layout';
import { Dashboard } from './pagina/admin/dashboard/dashboard';
import { ListarMedicos } from './pagina/admin/medicos/listar-medicos';
import { CrearMedico } from './pagina/admin/medicos/crear-medico';
import { ListarPqrs } from './pagina/admin/pqrs/listar-pqrs';
import { ListarCitas } from './pagina/admin/citas/listar-citas';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'registro', component: Registro },
    { path: 'inicio', component: Inicio },
    {
        path: 'admin',
        component: AdminLayout,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: Dashboard },
            { path: 'medicos', component: ListarMedicos },
            { path: 'medicos/crear', component: CrearMedico },
            { path: 'pqrs', component: ListarPqrs },
            { path: 'citas', component: ListarCitas }
        ]
    },
    { path: '**', redirectTo: '/login' }
];