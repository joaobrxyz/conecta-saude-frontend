import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { AuthService } from './auth.service';
import { ROLE_PATH, Role } from './api.models';

// Providers for component creation tests; HTTP is never sent to live services.
export function portalTestProviders(role: Role) {
  return [provideRouter([]), provideHttpClient(), provideHttpClientTesting(), {
    provide: AuthService, useValue: {
      claims: { sub: 'test-user', role }, home: `/${ROLE_PATH[role]}/dashboard`,
      session: signal(null), expired: false, logout: () => {}
    }
  }];
}
