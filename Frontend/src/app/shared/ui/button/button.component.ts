import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button class="btn" [class]="cssClass()" [type]="type()">
      <ng-content />
    </button>
  `,
})
export class ButtonComponent {
  readonly variant = input<'primary' | 'secondary' | 'danger' | 'ghost'>('primary');
  readonly type = input<'button' | 'submit'>('button');

  cssClass(): string {
    return `btn-${this.variant()}`;
  }
}
