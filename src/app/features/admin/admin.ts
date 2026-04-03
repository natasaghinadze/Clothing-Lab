import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AdminSidebar } from './admin-sidebar/admin-sidebar';
import { AdminHeader } from './admin-header/admin-header';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, AdminSidebar, AdminHeader, RouterOutlet],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {}