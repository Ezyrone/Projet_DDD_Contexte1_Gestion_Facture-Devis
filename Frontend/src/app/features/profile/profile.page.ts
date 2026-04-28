import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../shared/ui/button/button.component';

@Component({
  standalone: true,
  imports: [FormsModule, ButtonComponent],
  template: `
    <section class="page-header">
      <div>
        <h1>Profil</h1>
        <p>Préférences et gestion du compte.</p>
      </div>
    </section>

    <form class="card form-grid">
      <label><span>Email</span><input class="form-input" value="lucie.martin@example.com" /></label>
      <label><span>Username</span><input class="form-input" value="luciem" /></label>
      <label><span>Rôle</span><input class="form-input" value="CLIENT" readonly /></label>
      <label><span>Langue</span><input class="form-input" value="fr-FR" /></label>
      <label><span>Format de date</span><input class="form-input" value="dd/MM/yyyy" /></label>
    </form>

    <div class="actions">
      <app-button>Mettre à jour</app-button>
      <app-button variant="secondary">Changer mot de passe</app-button>
      <app-button variant="danger">Se déconnecter</app-button>
    </div>
  `,
})
export class ProfilePageComponent {}
