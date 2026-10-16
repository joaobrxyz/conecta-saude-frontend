import { Injectable, inject, signal } from '@angular/core';
import { ApiService, errorMessage } from './api.service';
import { AuthService } from './auth.service';
import { ROLE_RESOURCE, User } from './api.models';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private api = inject(ApiService); private auth = inject(AuthService);
  readonly user = signal<User | null>(null);
  readonly error = signal('');
  load() {
    const claims = this.auth.claims; this.user.set(null); this.error.set('');
    if (!claims) return;
    this.api.profile(ROLE_RESOURCE[claims.role]).subscribe({ next: user => { if (this.auth.claims?.sub === claims.sub) this.user.set(user); }, error: e => this.error.set(errorMessage(e)) });
  }
}
