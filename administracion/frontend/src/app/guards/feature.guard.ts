import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class FeatureGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const requiredFeatures = route.data['features'] as string[];
    
    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {
        if (!user) {
          this.router.navigate(['/login']);
          return false;
        }

        if (!requiredFeatures || requiredFeatures.length === 0) {
          return true;
        }

        const hasFeature = requiredFeatures.some(feature => 
          user.features?.includes(feature)
        );
        
        if (!hasFeature) {
          this.router.navigate(['/feature-disabled']);
          return false;
        }

        return true;
      })
    );
  }
}



