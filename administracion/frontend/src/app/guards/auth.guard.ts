import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    // Esperar un momento para que el AuthService se inicialice
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const isAuthenticated = this.authService.isAuthenticated();
        const isTokenValid = this.authService.isTokenValid();
        
        console.log('AuthGuard check:', { isAuthenticated, isTokenValid, route: state.url });
        
        if (isAuthenticated && isTokenValid) {
          resolve(true);
        } else {
          console.log('Redirecting to login');
          this.router.navigate(['/login']);
          resolve(false);
        }
      }, 100); // Esperar 100ms para la inicialización
    });
  }
}