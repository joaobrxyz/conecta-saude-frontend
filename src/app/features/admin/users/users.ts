import { Component } from '@angular/core';
import { UsersPage } from '../../../shared/users-page';
@Component({ selector: 'app-admin-users', standalone: true, imports: [UsersPage], templateUrl: './users.html' })
export class Users {}
