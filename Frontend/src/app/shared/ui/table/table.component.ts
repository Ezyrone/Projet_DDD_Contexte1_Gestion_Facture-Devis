import { Component, input } from '@angular/core';

@Component({
  selector: 'app-table',
  standalone: true,
  template: `
    <div class="card table-wrap">
      <table class="table">
        <thead>
          <tr>
            @for (header of headers(); track header) {
              <th>{{ header }}</th>
            }
          </tr>
        </thead>
        <tbody>
          <ng-content />
        </tbody>
      </table>
    </div>
  `,
})
export class TableComponent {
  readonly headers = input.required<string[]>();
}
