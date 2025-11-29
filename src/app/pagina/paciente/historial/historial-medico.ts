import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PacienteService } from '../../../servicios/paciente.service';
import { TokenService } from '../../../servicios/token';
import { HistorialMedicoDTO } from '../../../modelo/historial-medico-dto';

@Component({
  selector: 'app-historial-medico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial-medico.html',
  styleUrls: ['./historial-medico.css']
})
export class HistorialMedico implements OnInit {
  historial: HistorialMedicoDTO[] = [];
  isLoading = true;
  codigoPaciente = 0;

  constructor(
    private pacienteService: PacienteService,
    private tokenService: TokenService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.codigoPaciente = this.tokenService.getCodigo();
    this.loadHistorial();
  }

  loadHistorial(): void {
    this.isLoading = true;
    this.pacienteService.listarHistorialMedico(this.codigoPaciente).subscribe({
      next: (response) => {
        if (response.respuesta) {
          this.historial = response.respuesta;
        }
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error loading medical history:', error);
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }
}
