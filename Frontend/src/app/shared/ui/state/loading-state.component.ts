import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  template: `
    <div class="card state-block">
      <div class="loader"></div>
      <p>Chargement en cours...</p>
    </div>
  `,
})
export class LoadingStateComponent {}
