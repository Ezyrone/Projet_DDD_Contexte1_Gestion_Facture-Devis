import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="card state-block">
      <h3>{{ title() }}</h3>
      <p>{{ description() }}</p>
      <ng-content />
    </div>
  `,
})
export class EmptyStateComponent {
  readonly title = input('Aucune donnée');
  readonly description = input('Aucun enregistrement disponible pour ces filtres.');
}
