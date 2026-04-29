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
  emptyActionLabel: string;
  actions: Record<UserRole, PageAction[]>;
}

export const LIST_PAGE_CONFIG: Record<string, ListPageConfig> = {
  quotes: {
    title: 'Devis',
    subtitle: 'Suivi des devis du cycle commercial',
    headers: ['Titre', 'Client', 'Statut', 'Création', 'Version', 'Actions'],
    filters: ['Statut', 'Client'],
    emptyActionLabel: 'Créer un devis',
    actions: {
      COMMERCIAL: [{ label: 'Créer un devis' }],
      FINANCE: [],
      CLIENT: [],
    },
  },
  invoices: {
    title: 'Factures',
    subtitle: 'Suivi comptable et reste à charge',
    headers: ['Titre', 'Client', 'Statut', 'Échéance', 'Reste à charge', 'Actions'],
    filters: ['Statut', 'Client'],
    emptyActionLabel: 'Aucune facture',
    actions: {
      COMMERCIAL: [],
      FINANCE: [],
      CLIENT: [],
    },
  },
  payments: {
    title: 'Paiements',
    subtitle: 'Paiements enregistrés et remboursements',
    headers: ['Facture', 'Montant', 'Date', 'Mode', 'Statut'],
    filters: ['Statut'],
    emptyActionLabel: 'Enregistrer un paiement',
    actions: {
      COMMERCIAL: [],
      FINANCE: [{ label: 'Enregistrer un paiement' }],
      CLIENT: [],
    },
  },
  collections: {
    title: 'Relances',
    subtitle: 'Pilotage du recouvrement',
    headers: ['Facture', 'Retard', 'Niveau', 'Prochaine action'],
    filters: ['Niveau'],
    emptyActionLabel: 'Lancer une relance',
    actions: {
      COMMERCIAL: [],
      FINANCE: [],
      CLIENT: [],
    },
  },
  credits: {
    title: 'Avoirs',
    subtitle: 'Compensation et remboursement',
    headers: ['ID', 'Facture', 'Montant', 'Statut', 'Actions'],
    filters: ['Statut'],
    emptyActionLabel: 'Créer un avoir',
    actions: {
      COMMERCIAL: [],
      FINANCE: [],
      CLIENT: [],
    },
  },
  notifications: {
    title: 'Notifications',
    subtitle: 'Historique des envois',
    headers: ['Type', 'Destinataire', 'Statut', 'Horodatage', 'Actions'],
    filters: ['Type', 'Statut'],
    emptyActionLabel: 'Renvoyer une notification',
    actions: {
      COMMERCIAL: [],
      FINANCE: [],
      CLIENT: [],
    },
  },
  audit: {
    title: 'Audit',
    subtitle: 'Traçabilité des événements de domaine',
    headers: ['Événement', 'Document', 'Acteur', 'Horodatage', 'Actions'],
    filters: ['Type', 'Acteur'],
    emptyActionLabel: 'Exporter le journal',
    actions: {
      COMMERCIAL: [],
      FINANCE: [{ label: 'Exporter journal', variant: 'secondary' }],
      CLIENT: [],
    },
  },
};
