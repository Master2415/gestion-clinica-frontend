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

    isSidebarOpen = true;
    medicoName = 'Doctor';

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
    }

    toggleSidebar(): void {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    logout(): void {
        this.tokenService.removeToken();
        this.router.navigate(['/login']);
    }
}
