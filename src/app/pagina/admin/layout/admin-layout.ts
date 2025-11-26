import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../../servicios/token';

@Component({
    selector: 'app-admin-layout',
    imports: [CommonModule, RouterLink, RouterOutlet],
    templateUrl: './admin-layout.html',
    styleUrl: './admin-layout.css',
})
export class AdminLayout implements OnInit {

    isSidebarOpen = true;
    adminName = 'Administrador';

    constructor(
        private tokenService: TokenService,
        private router: Router
    ) { }

    ngOnInit(): void {
        // Aquí podrías obtener el nombre del admin desde el token
    }

    toggleSidebar(): void {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    logout(): void {
        this.tokenService.removeToken();
        this.router.navigate(['/login']);
    }
}
