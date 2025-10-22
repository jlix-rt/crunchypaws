import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="bg-gray-900 text-white">
      <!-- Main Footer -->
      <div class="container mx-auto px-4 py-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Company Info -->
          <div>
            <div class="flex items-center space-x-2 mb-4">
              <img src="assets/images/logo-white.png" alt="CrunchyPaws" class="h-8 w-auto">
              <span class="text-xl font-bold">CrunchyPaws</span>
            </div>
            <p class="text-gray-300 mb-4">
              La mejor tienda de mascotas en Guatemala. Alimentos, accesorios, juguetes y más para perros y gatos.
            </p>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-300 hover:text-white">📘</a>
              <a href="#" class="text-gray-300 hover:text-white">📷</a>
              <a href="#" class="text-gray-300 hover:text-white">📱</a>
              <a href="#" class="text-gray-300 hover:text-white">🐦</a>
            </div>
          </div>
          
          <!-- Quick Links -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul class="space-y-2">
              <li><a routerLink="/catalogo" class="text-gray-300 hover:text-white">Catálogo</a></li>
              <li><a routerLink="/ofertas" class="text-gray-300 hover:text-white">Ofertas</a></li>
              <li><a routerLink="/nosotros" class="text-gray-300 hover:text-white">Nosotros</a></li>
              <li><a routerLink="/contacto" class="text-gray-300 hover:text-white">Contacto</a></li>
              <li><a routerLink="/ayuda" class="text-gray-300 hover:text-white">Ayuda</a></li>
            </ul>
          </div>
          
          <!-- Categories -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Categorías</h3>
            <ul class="space-y-2">
              <li><a routerLink="/catalogo/perros" class="text-gray-300 hover:text-white">🐕 Perros</a></li>
              <li><a routerLink="/catalogo/gatos" class="text-gray-300 hover:text-white">🐱 Gatos</a></li>
              <li><a routerLink="/catalogo/accesorios" class="text-gray-300 hover:text-white">🎾 Accesorios</a></li>
              <li><a routerLink="/catalogo/juguetes" class="text-gray-300 hover:text-white">🧸 Juguetes</a></li>
              <li><a routerLink="/catalogo/salud" class="text-gray-300 hover:text-white">💊 Salud</a></li>
            </ul>
          </div>
          
          <!-- Contact Info -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Contacto</h3>
            <div class="space-y-2 text-gray-300">
              <p>📞 +502-1234-5678</p>
              <p>✉️ info@crunchypaws.com</p>
              <p>📍 Guatemala, Guatemala</p>
              <p>🕒 Lun - Vie: 8:00 - 18:00</p>
              <p>🕒 Sáb: 8:00 - 16:00</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Bottom Footer -->
      <div class="border-t border-gray-800">
        <div class="container mx-auto px-4 py-6">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <div class="text-gray-300 text-sm">
              © 2024 CrunchyPaws. Todos los derechos reservados.
            </div>
            <div class="flex space-x-6 text-sm text-gray-300 mt-4 md:mt-0">
              <a href="#" class="hover:text-white">Términos y Condiciones</a>
              <a href="#" class="hover:text-white">Política de Privacidad</a>
              <a href="#" class="hover:text-white">Política de Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .container {
      max-width: 1200px;
    }
  `]
})
export class FooterComponent {}



