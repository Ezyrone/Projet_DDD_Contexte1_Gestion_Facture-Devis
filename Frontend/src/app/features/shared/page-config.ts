import { UserRole } from '../../core/auth/auth.types';

export interface PageAction {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  critical?: boolean;
}

export interface ListPageConfig {
  title: string;
  subtitle: string;
  headers: string[];
  filters: string[];
  rows: string[][];
  emptyActionLabel: string;
  actions: Record<UserRole, PageAction[]>;
}

export const LIST_PAGE_CONFIG: Record<string, ListPageConfig> = {
  quotes: {
    title: 'Devis',
    subtitle: 'Suivi des devis du cycle commercial',
    headers: ['Titre', 'Client', 'Statut', 'Création', 'Version', 'Actions'],
    filters: ['Statut', 'Client', 'Période'],
    rows: [['Devis audit DDD - Martin', 'Lucie Martin', 'Envoyé', '2026-04-12', 'V2', 'Voir | Modifier']],
    emptyActionLabel: 'Créer un devis',
    actions: {
      COMMERCIAL: [{ label: 'Créer un devis' }],
      FINANCE: [{ label: 'Voir', variant: 'secondary' }],
      CLIENT: [{ label: 'Approuver', variant: 'primary' }, { label: 'Refuser', variant: 'danger', critical: true }],
    },
  },
  invoices: {
    title: 'Factures',
    subtitle: 'Suivi comptable et reste à charge',
    headers: ['Titre', 'Client', 'Statut', 'Échéance', 'Reste à charge', 'Actions'],
    filters: ['Statut', 'Retard', 'Client', 'Période'],
    rows: [['Facture Devis audit DDD', 'Lucie Martin', 'Émise', '2026-05-30', '500 €', 'Voir | Exporter']],
    emptyActionLabel: 'Créer une facture',
    actions: {
      COMMERCIAL: [{ label: 'Voir', variant: 'secondary' }],
      FINANCE: [
        { label: 'Exporter PDF', variant: 'secondary' },
        { label: 'Annuler', variant: 'danger', critical: true },
      ],
      CLIENT: [{ label: 'Payer' }],
    },
  },
  payments: {
    title: 'Paiements',
    subtitle: 'Paiements enregistrés et remboursements',
    headers: ['Facture', 'Montant', 'Date', 'Mode', 'Statut'],
    filters: ['Client', 'Période', 'Statut'],
    rows: [['FAC-2026-004', '200 €', '2026-04-26', 'Virement', 'Accepté']],
    emptyActionLabel: 'Enregistrer un paiement',
    actions: {
      COMMERCIAL: [],
      FINANCE: [{ label: 'Enregistrer un paiement' }, { label: 'Rembourser', variant: 'danger', critical: true }],
      CLIENT: [],
    },
  },
  collections: {
    title: 'Relances',
    subtitle: 'Pilotage du recouvrement',
    headers: ['Facture', 'Retard', 'Niveau', 'Prochaine action'],
    filters: ['Niveau', 'Jours de retard', 'Client'],
    rows: [['FAC-2026-001', '3 jours', 'Niveau 1', 'Relance niveau 2']],
    emptyActionLabel: 'Lancer une relance',
    actions: {
      COMMERCIAL: [],
      FINANCE: [
        { label: 'Envoyer relance niveau 1', variant: 'secondary' },
        { label: 'Envoyer relance niveau 2', variant: 'secondary' },
        { label: 'Déclencher mise en demeure', variant: 'danger', critical: true },
      ],
      CLIENT: [],
    },
  },
  credits: {
    title: 'Avoirs',
    subtitle: 'Compensation et remboursement',
    headers: ['ID', 'Client', 'Montant', 'Statut', 'Actions'],
    filters: ['Statut', 'Client', 'Période'],
    rows: [['AV-2026-001', 'Lucie Martin', '100 €', 'Disponible', 'Voir | Rembourser']],
    emptyActionLabel: 'Créer un avoir',
    actions: {
      COMMERCIAL: [],
      FINANCE: [
        { label: 'Appliquer sur facture' },
        { label: 'Rembourser', variant: 'danger', critical: true },
        { label: 'Annuler', variant: 'danger', critical: true },
      ],
      CLIENT: [],
    },
  },
  notifications: {
    title: 'Notifications',
    subtitle: 'Historique des envois',
    headers: ['Type', 'Destinataire', 'Statut', 'Horodatage', 'Actions'],
    filters: ['Type', 'Statut', 'Période'],
    rows: [['Facture', 'lucie.martin@example.com', 'Échec', '2026-04-28 09:15', 'Renvoyer | Détail']],
    emptyActionLabel: 'Renvoyer une notification',
    actions: {
      COMMERCIAL: [{ label: 'Voir détail', variant: 'secondary' }],
      FINANCE: [{ label: 'Renvoyer', variant: 'secondary' }],
      CLIENT: [],
    },
  },
  audit: {
    title: 'Audit',
    subtitle: 'Traçabilité des événements de domaine',
    headers: ['Événement', 'Objet', 'Acteur', 'Horodatage', 'Actions'],
    filters: ['Type', 'Période', 'Acteur'],
    rows: [['DevisApprouve', 'Devis #Q-2026-11', 'Lucie Martin', '2026-04-27 16:44', 'Voir détail']],
    emptyActionLabel: 'Exporter le journal',
    actions: {
      COMMERCIAL: [{ label: 'Voir détail', variant: 'secondary' }],
      FINANCE: [{ label: 'Exporter journal', variant: 'secondary' }],
      CLIENT: [],
    },
  },
};
