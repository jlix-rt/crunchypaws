import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { ToastrService } from 'ngx-toastr';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);
  
  return next(req).pipe(
    catchError(error => {
      let errorMessage = 'Ha ocurrido un error inesperado';
      
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Don't show toast for 401 errors (handled by auth interceptor)
      if (error.status !== 401) {
        toastr.error(errorMessage, 'Error');
      }
      
      return throwError(() => error);
    })
  );
};



