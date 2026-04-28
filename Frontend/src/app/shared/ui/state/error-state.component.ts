import { Component, input, output } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <div class="card state-block">
      <h3>{{ title() }}</h3>
      <p>{{ description() }}</p>
      <app-button variant="secondary" (click)="retry.emit()">Reessayer</app-button>
    </div>
  `,
})
export class ErrorStateComponent {
  readonly title = input("Une erreur est survenue");
  readonly description = input("Impossible de charger les données. Merci de réessayer.");
  readonly retry = output<void>();
}
