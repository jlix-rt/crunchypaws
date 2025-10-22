import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  showDemoCredentials = environment.showDemoCredentials;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['admin@crunchypaws.com', [Validators.required, Validators.email]],
      password: ['password', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password, rememberMe } = this.loginForm.value;
      console.log('Login attempt:', { email, password, rememberMe });

      this.authService.login({ email, password }).subscribe({
        next: (response) => {
          console.log('Login successful!', response);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Login failed:', error);
          if (error.status === 401) {
            alert('Credenciales inválidas. Verifica tu email y contraseña.');
          } else {
            alert('Error al iniciar sesión. Intenta nuevamente.');
          }
        }
      });
    } else {
      console.error('Form is invalid');
      this.loginForm.markAllAsTouched();
    }
  }

  clearStorage(): void {
    // Limpiar específicamente las claves de autenticación
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    console.log('Auth storage cleared');
    alert('Storage de autenticación limpiado. Recarga la página.');
  }
}