import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../servicios/auth';
import { TokenService } from '../../servicios/token';
import { LoginDTO } from '../../modelo/login-dto';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  loginDTO: LoginDTO = new LoginDTO();
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: Auth,
    private tokenService: TokenService,
    private router: Router
  ) { }

  login(): void {
    if (!this.loginDTO.correo || !this.loginDTO.contrasenia) {
      this.errorMessage = 'Por favor complete todos los campos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginDTO).subscribe({
      next: (response) => {
        if (response.respuesta && response.respuesta.token) {
          this.tokenService.setToken(response.respuesta.token);
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.errorMessage = 'Error al iniciar sesión';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error de login:', error);
        this.errorMessage = error.error?.respuesta || 'Error al iniciar sesión. Verifique sus credenciales.';
        this.isLoading = false;
      }
    });
  }
}

