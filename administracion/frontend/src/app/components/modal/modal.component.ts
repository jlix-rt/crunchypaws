import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() confirmText = 'Confirmar';
  @Input() cancelText = 'Cancelar';
  @Input() showFooter = true;
  @Input() closeOnOverlayClick = true;
  @Input() disableConfirm = false;

  @Output() onClose = new EventEmitter<void>();
  @Output() onConfirm = new EventEmitter<void>();

  closeModal(): void {
    this.onClose.emit();
  }

  confirmModal(): void {
    this.onConfirm.emit();
  }

  onOverlayClick(event: Event): void {
    if (this.closeOnOverlayClick) {
      this.closeModal();
    }
  }
}