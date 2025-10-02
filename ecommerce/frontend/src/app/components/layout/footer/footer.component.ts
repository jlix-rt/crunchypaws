import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <footer class="bg-neutral-900 text-white">
      <div class="container mx-auto px-4 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Brand -->
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center space-x-2 mb-4">
              <img src="/assets/images/logo-white.png" alt="CrunchyPaws" class="h-8 w-auto">
              <span class="text-xl font-display font-bold">CrunchyPaws</span>
            </div>
            <p class="text-neutral-300 mb-4 max-w-md">
              Los mejores productos deshidratados para perros y gatos. 
              100% naturales, sin conservantes. Snacks saludables que tu mascota adorará.
            </p>
            <div class="flex space-x-4">
              <button mat-icon-button class="text-neutral-300 hover:text-white">
                <mat-icon>facebook</mat-icon>
              </button>
              <button mat-icon-button class="text-neutral-300 hover:text-white">
                <mat-icon>instagram</mat-icon>
              </button>
              <button mat-icon-button class="text-neutral-300 hover:text-white">
                <mat-icon>whatsapp</mat-icon>
              </button>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="font-semibold mb-4">Enlaces Rápidos</h3>
            <ul class="space-y-2">
              <li>
                <a routerLink="/catalogo" class="text-neutral-300 hover:text-white transition-colors">
                  Catálogo
                </a>
              </li>
              <li>
                <a routerLink="/informacion" class="text-neutral-300 hover:text-white transition-colors">
                  Información
                </a>
              </li>
              <li>
                <a routerLink="/contacto" class="text-neutral-300 hover:text-white transition-colors">
                  Contacto
                </a>
              </li>
              <li>
                <a routerLink="/auth/register" class="text-neutral-300 hover:text-white transition-colors">
                  Crear Cuenta
                </a>
              </li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div>
            <h3 class="font-semibold mb-4">Contacto</h3>
            <ul class="space-y-2 text-neutral-300">
              <li class="flex items-center space-x-2">
                <mat-icon class="text-sm">phone</mat-icon>
                <span>+502 1234-5678</span>
              </li>
              <li class="flex items-center space-x-2">
                <mat-icon class="text-sm">email</mat-icon>
                <span>info@crunchypaws.com</span>
              </li>
              <li class="flex items-center space-x-2">
                <mat-icon class="text-sm">location_on</mat-icon>
                <span>Guatemala, Guatemala</span>
              </li>
              <li class="flex items-center space-x-2">
                <mat-icon class="text-sm">schedule</mat-icon>
                <span>Lun - Vie: 8:00 - 18:00</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom bar -->
        <div class="border-t border-neutral-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p class="text-neutral-400 text-sm mb-4 md:mb-0">
            © {{ currentYear }} CrunchyPaws. Todos los derechos reservados.
          </p>
          <div class="flex space-x-6 text-sm">
            <a href="#" class="text-neutral-400 hover:text-white transition-colors">
              Términos y Condiciones
            </a>
            <a href="#" class="text-neutral-400 hover:text-white transition-colors">
              Política de Privacidad
            </a>
            <a href="#" class="text-neutral-400 hover:text-white transition-colors">
              Política de Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: block;
    }

    .container {
      max-width: 1200px;
    }

    mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
