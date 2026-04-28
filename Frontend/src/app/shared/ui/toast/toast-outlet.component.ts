import { Component, inject } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast-outlet',
  standalone: true,
  template: `
    <div class="toast-host">
      @for (message of toastService.messages(); track message.id) {
        <div class="toast" [class]="'toast toast-' + message.kind">
          <span>{{ message.text }}</span>
        </div>
      }
    </div>
  `,
})
export class ToastOutletComponent {
  readonly toastService = inject(ToastService);
}
