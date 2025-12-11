import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../../servicios/token';

@Component({
    selector: 'app-medico-layout',
    imports: [CommonModule, RouterLink, RouterOutlet],
    templateUrl: './medico-layout.html',
    styleUrl: './medico-layout.css',
})
export class MedicoLayout implements OnInit {

    sidebarCollapsed = false;
    medicoName = 'Doctor';
    imagenUrl = '';

    constructor(
        private tokenService: TokenService,
        private router: Router
    ) { }

    ngOnInit(): void {
        // Get doctor name from token if available
        const nombre = this.tokenService.getNombre();
        if (nombre) {
            this.medicoName = nombre;
        }
        this.imagenUrl = this.tokenService.getImagenUrl();
    }

    toggleSidebar(): void {
        this.sidebarCollapsed = !this.sidebarCollapsed;
    }

    logout(): void {
        this.tokenService.logout();
        this.router.navigate(['/login']);
    }
}
