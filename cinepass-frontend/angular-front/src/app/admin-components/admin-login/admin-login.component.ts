import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import * as bcrypt from 'bcryptjs';


@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  loginForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      subsidiaryCode: ['', [Validators.required]]
    });
  }

  async onSubmit(): Promise<void> {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    const subsidiary = sessionStorage.getItem('subsidiary');
    if (!subsidiary) {
      alert('Sucursal no seleccionada');
      return;
    }

    const subsidiaryCodeFromSession = JSON.parse(subsidiary).subsidiaryCode;
    const subsidiaryCodeFromForm = this.loginForm.value.subsidiaryCode;

    const isSubsidiaryCodeValid = await bcrypt.compare(subsidiaryCodeFromForm, subsidiaryCodeFromSession);
    if (!isSubsidiaryCodeValid) {
      alert('El código de sucursal ingresado no coincide con el seleccionado');
      return;
    }

    try {
      await this.authService.login(this.loginForm.value);
      this.router.navigate(['admin/dashboard']);
    } catch (error: any) {
      console.log(error);
      const errorMessage = error?.error?.message || error.message || 'Error desconocido';
      if (errorMessage === 'Contraseña incorrecta') {
        alert('Contraseña incorrecta');
      } else if (errorMessage === 'Sucursal o administrador incorrecto') {
        alert('Sucursal o administrador incorrecto');
      } else if (errorMessage === 'Administrador no encontrado') {
        alert('Administrador no encontrado');
      } else {
        alert('Error desconocido');
      }
    }
  }
}