import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  if (isAuthenticated) {
    return true;
  } else {
    
    window.location.href = '/login';
    return false;
  }

};

  

