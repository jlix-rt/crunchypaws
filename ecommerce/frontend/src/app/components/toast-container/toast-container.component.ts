import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, ToastrModule],
  template: `
    <div class="toast-container">
      <!-- Toastr will render here -->
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
    }
  `]
})
export class ToastContainerComponent {}



