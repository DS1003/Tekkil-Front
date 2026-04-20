// Tekkil mock data — Senegalese competitive exam prep platform

export type Concours = {
  id: string
  nom: string
  abbr: string
  type: "Direct" | "Indirect" | "Libre"
  cycles: ("A" | "B")[]
  dateCloture: string
  statut: "Ouvert" | "Bientôt clos" | "Fermé"
  packs: number
  inscrits: number
}

export const concours: Concours[] = [
  {
    id: "ena",
    nom: "École Nationale d'Administration",
    abbr: "ENA",
    type: "Direct",
    cycles: ["A", "B"],
    dateCloture: "2026-08-15",
    statut: "Ouvert",
    packs: 12,
    inscrits: 4280,
  },
  {
    id: "douane",
    nom: "Concours de la Douane",
    abbr: "Douane",
    type: "Direct",
    cycles: ["A", "B"],
    dateCloture: "2026-07-30",
    statut: "Ouvert",
    packs: 9,
    inscrits: 3120,
  },
  {
    id: "cffe",
    nom: "Centre de Formation des Forces Économiques",
    abbr: "CFFE",
    type: "Indirect",
    cycles: ["A"],
    dateCloture: "2026-09-12",
    statut: "Ouvert",
    packs: 6,
    inscrits: 1540,
  },
  {
    id: "cfj",
    nom: "Centre de Formation Judiciaire",
    abbr: "CFJ",
    type: "Indirect",
    cycles: ["A", "B"],
    dateCloture: "2026-06-20",
    statut: "Bientôt clos",
    packs: 8,
    inscrits: 2210,
  },
  {
    id: "fastef",
    nom: "Faculté des Sciences et Tech. de l'Éducation",
    abbr: "FASTEF",
    type: "Libre",
    cycles: ["B"],
    dateCloture: "2026-10-05",
    statut: "Ouvert",
    packs: 5,
    inscrits: 980,
  },
  {
    id: "bac",
    nom: "Baccalauréat National",
    abbr: "BAC",
    type: "Libre",
    cycles: ["A"],
    dateCloture: "2026-05-30",
    statut: "Bientôt clos",
    packs: 14,
    inscrits: 6750,
  },
  {
    id: "bfem",
    nom: "Brevet de Fin d'Études Moyennes",
    abbr: "BFEM",
    type: "Libre",
    cycles: ["A"],
    dateCloture: "2026-06-10",
    statut: "Bientôt clos",
    packs: 11,
    inscrits: 5320,
  },
]

export type Pack = {
  id: string
  titre: string
  concours: string
  cycle: "A" | "B"
  matiere: string
  prix: number // FCFA
  acheteurs: number
  contenus: {
    cours: number
    resumes: number
    audios: number
    videos: number
    qcm: number
    flashcards: number
  }
  statut: "Publié" | "Brouillon" | "Archivé"
  miseAJour: string
  progression: number // % moyen des utilisateurs
}

export const packs: Pack[] = [
  {
    id: "pack-001",
    titre: "Droit Administratif",
    concours: "ENA",
    cycle: "B",
    matiere: "Droit",
    prix: 15000,
    acheteurs: 842,
    contenus: { cours: 18, resumes: 18, audios: 12, videos: 14, qcm: 220, flashcards: 340 },
    statut: "Publié",
    miseAJour: "Il y a 2 jours",
    progression: 64,
  },
  {
    id: "pack-002",
    titre: "Économie Générale",
    concours: "ENA",
    cycle: "A",
    matiere: "Économie",
    prix: 18000,
    acheteurs: 1120,
    contenus: { cours: 22, resumes: 22, audios: 16, videos: 18, qcm: 280, flashcards: 420 },
    statut: "Publié",
    miseAJour: "Il y a 5 jours",
    progression: 71,
  },
  {
    id: "pack-003",
    titre: "Législation Douanière",
    concours: "Douane",
    cycle: "B",
    matiere: "Droit",
    prix: 12000,
    acheteurs: 690,
    contenus: { cours: 15, resumes: 15, audios: 10, videos: 12, qcm: 180, flashcards: 260 },
    statut: "Publié",
    miseAJour: "Hier",
    progression: 58,
  },
  {
    id: "pack-004",
    titre: "Culture Générale",
    concours: "ENA",
    cycle: "A",
    matiere: "Général",
    prix: 10000,
    acheteurs: 1540,
    contenus: { cours: 24, resumes: 24, audios: 20, videos: 16, qcm: 350, flashcards: 500 },
    statut: "Publié",
    miseAJour: "Il y a 1 semaine",
    progression: 82,
  },
  {
    id: "pack-005",
    titre: "Mathématiques Financières",
    concours: "CFFE",
    cycle: "A",
    matiere: "Maths",
    prix: 14000,
    acheteurs: 320,
    contenus: { cours: 16, resumes: 16, audios: 8, videos: 14, qcm: 200, flashcards: 280 },
    statut: "Publié",
    miseAJour: "Il y a 3 jours",
    progression: 49,
  },
  {
    id: "pack-006",
    titre: "Procédure Judiciaire",
    concours: "CFJ",
    cycle: "B",
    matiere: "Droit",
    prix: 16000,
    acheteurs: 410,
    contenus: { cours: 19, resumes: 19, audios: 11, videos: 13, qcm: 240, flashcards: 320 },
    statut: "Brouillon",
    miseAJour: "Aujourd'hui",
    progression: 0,
  },
  {
    id: "pack-007",
    titre: "Philosophie BAC",
    concours: "BAC",
    cycle: "A",
    matiere: "Philosophie",
    prix: 8000,
    acheteurs: 2840,
    contenus: { cours: 28, resumes: 28, audios: 24, videos: 20, qcm: 320, flashcards: 460 },
    statut: "Publié",
    miseAJour: "Il y a 4 jours",
    progression: 76,
  },
  {
    id: "pack-008",
    titre: "Histoire-Géographie BFEM",
    concours: "BFEM",
    cycle: "A",
    matiere: "Histoire-Géo",
    prix: 7500,
    acheteurs: 2210,
    contenus: { cours: 26, resumes: 26, audios: 18, videos: 22, qcm: 290, flashcards: 380 },
    statut: "Publié",
    miseAJour: "Il y a 6 jours",
    progression: 68,
  },
]

export type Utilisateur = {
  id: string
  nom: string
  email: string
  telephone: string
  ville: string
  inscriptionDate: string
  packsAchetes: number
  totalDepense: number
  derniereConnexion: string
  statut: "Actif" | "Suspendu" | "Bloqué"
  appareil: "Android" | "iOS" | "Web"
  scoreMoyen: number
}

export const utilisateurs: Utilisateur[] = [
  {
    id: "usr-001",
    nom: "Aïssatou Diop",
    email: "aissatou.diop@email.sn",
    telephone: "+221 77 123 45 67",
    ville: "Dakar",
    inscriptionDate: "2026-01-15",
    packsAchetes: 4,
    totalDepense: 58000,
    derniereConnexion: "Il y a 2h",
    statut: "Actif",
    appareil: "Android",
    scoreMoyen: 78,
  },
  {
    id: "usr-002",
    nom: "Mamadou Sarr",
    email: "m.sarr@email.sn",
    telephone: "+221 76 234 56 78",
    ville: "Thiès",
    inscriptionDate: "2026-02-03",
    packsAchetes: 2,
    totalDepense: 26000,
    derniereConnexion: "Hier",
    statut: "Actif",
    appareil: "iOS",
    scoreMoyen: 65,
  },
  {
    id: "usr-003",
    nom: "Fatou Ndiaye",
    email: "fatou.n@email.sn",
    telephone: "+221 78 345 67 89",
    ville: "Saint-Louis",
    inscriptionDate: "2026-01-22",
    packsAchetes: 6,
    totalDepense: 92000,
    derniereConnexion: "Il y a 30min",
    statut: "Actif",
    appareil: "Android",
    scoreMoyen: 88,
  },
  {
    id: "usr-004",
    nom: "Ibrahima Fall",
    email: "i.fall@email.sn",
    telephone: "+221 70 456 78 90",
    ville: "Dakar",
    inscriptionDate: "2025-12-10",
    packsAchetes: 1,
    totalDepense: 12000,
    derniereConnexion: "Il y a 3 jours",
    statut: "Suspendu",
    appareil: "Android",
    scoreMoyen: 42,
  },
  {
    id: "usr-005",
    nom: "Awa Cissé",
    email: "awa.cisse@email.sn",
    telephone: "+221 77 567 89 01",
    ville: "Kaolack",
    inscriptionDate: "2026-03-01",
    packsAchetes: 3,
    totalDepense: 41000,
    derniereConnexion: "Il y a 1h",
    statut: "Actif",
    appareil: "Web",
    scoreMoyen: 71,
  },
  {
    id: "usr-006",
    nom: "Cheikh Diouf",
    email: "cheikh.d@email.sn",
    telephone: "+221 76 678 90 12",
    ville: "Ziguinchor",
    inscriptionDate: "2025-11-28",
    packsAchetes: 0,
    totalDepense: 0,
    derniereConnexion: "Il y a 2 semaines",
    statut: "Bloqué",
    appareil: "Android",
    scoreMoyen: 0,
  },
  {
    id: "usr-007",
    nom: "Mariama Bâ",
    email: "m.ba@email.sn",
    telephone: "+221 78 789 01 23",
    ville: "Dakar",
    inscriptionDate: "2026-02-19",
    packsAchetes: 5,
    totalDepense: 74000,
    derniereConnexion: "Il y a 4h",
    statut: "Actif",
    appareil: "iOS",
    scoreMoyen: 84,
  },
  {
    id: "usr-008",
    nom: "Ousmane Sow",
    email: "o.sow@email.sn",
    telephone: "+221 77 890 12 34",
    ville: "Diourbel",
    inscriptionDate: "2026-01-05",
    packsAchetes: 2,
    totalDepense: 22000,
    derniereConnexion: "Aujourd'hui",
    statut: "Actif",
    appareil: "Android",
    scoreMoyen: 59,
  },
]

export type Paiement = {
  id: string
  reference: string
  utilisateur: string
  pack: string
  montant: number
  methode: "Orange Money" | "Wave" | "Carte Bancaire" | "Free Money"
  statut: "Réussi" | "En attente" | "Échoué" | "Remboursé"
  date: string
}

export const paiements: Paiement[] = [
  {
    id: "pay-001",
    reference: "TKL-OM-9847",
    utilisateur: "Aïssatou Diop",
    pack: "Droit Administratif",
    montant: 15000,
    methode: "Orange Money",
    statut: "Réussi",
    date: "2026-04-19 14:32",
  },
  {
    id: "pay-002",
    reference: "TKL-WV-9846",
    utilisateur: "Mamadou Sarr",
    pack: "Économie Générale",
    montant: 18000,
    methode: "Wave",
    statut: "Réussi",
    date: "2026-04-19 13:15",
  },
  {
    id: "pay-003",
    reference: "TKL-OM-9845",
    utilisateur: "Fatou Ndiaye",
    pack: "Culture Générale",
    montant: 10000,
    methode: "Orange Money",
    statut: "Réussi",
    date: "2026-04-19 11:48",
  },
  {
    id: "pay-004",
    reference: "TKL-CB-9844",
    utilisateur: "Awa Cissé",
    pack: "Mathématiques Financières",
    montant: 14000,
    methode: "Carte Bancaire",
    statut: "En attente",
    date: "2026-04-19 10:22",
  },
  {
    id: "pay-005",
    reference: "TKL-WV-9843",
    utilisateur: "Mariama Bâ",
    pack: "Philosophie BAC",
    montant: 8000,
    methode: "Wave",
    statut: "Réussi",
    date: "2026-04-19 09:05",
  },
  {
    id: "pay-006",
    reference: "TKL-OM-9842",
    utilisateur: "Ibrahima Fall",
    pack: "Législation Douanière",
    montant: 12000,
    methode: "Orange Money",
    statut: "Échoué",
    date: "2026-04-18 22:14",
  },
  {
    id: "pay-007",
    reference: "TKL-FM-9841",
    utilisateur: "Ousmane Sow",
    pack: "Histoire-Géographie BFEM",
    montant: 7500,
    methode: "Free Money",
    statut: "Réussi",
    date: "2026-04-18 19:33",
  },
  {
    id: "pay-008",
    reference: "TKL-OM-9840",
    utilisateur: "Cheikh Diouf",
    pack: "Droit Administratif",
    montant: 15000,
    methode: "Orange Money",
    statut: "Remboursé",
    date: "2026-04-18 16:50",
  },
]

// Charts data
export const revenueData = [
  { mois: "Nov", revenus: 1240000, transactions: 142 },
  { mois: "Déc", revenus: 1820000, transactions: 198 },
  { mois: "Jan", revenus: 2410000, transactions: 264 },
  { mois: "Fév", revenus: 3120000, transactions: 328 },
  { mois: "Mar", revenus: 3890000, transactions: 412 },
  { mois: "Avr", revenus: 4580000, transactions: 487 },
]

export const inscriptionsData = [
  { jour: "Lun", inscriptions: 124, conversions: 38 },
  { jour: "Mar", inscriptions: 168, conversions: 52 },
  { jour: "Mer", inscriptions: 142, conversions: 41 },
  { jour: "Jeu", inscriptions: 198, conversions: 64 },
  { jour: "Ven", inscriptions: 234, conversions: 78 },
  { jour: "Sam", inscriptions: 312, conversions: 102 },
  { jour: "Dim", inscriptions: 287, conversions: 94 },
]

export const concoursRepartition = [
  { name: "ENA", value: 4280, fill: "var(--chart-1)" },
  { name: "Douane", value: 3120, fill: "var(--chart-2)" },
  { name: "BAC", value: 6750, fill: "var(--chart-3)" },
  { name: "BFEM", value: 5320, fill: "var(--chart-4)" },
  { name: "Autres", value: 4730, fill: "var(--chart-5)" },
]

export const paiementMethodes = [
  { methode: "Orange Money", value: 48 },
  { methode: "Wave", value: 32 },
  { methode: "Carte Bancaire", value: 14 },
  { methode: "Free Money", value: 6 },
]

export const examensBlancs = [
  {
    id: "eb-001",
    titre: "Examen Blanc ENA — Cycle B 2026",
    concours: "ENA",
    cycle: "B",
    duree: 240,
    questions: 80,
    participants: 1240,
    moyenneScore: 62,
    statut: "Actif" as const,
    dateCreation: "2026-04-12",
  },
  {
    id: "eb-002",
    titre: "Simulation Douane — Cycle A",
    concours: "Douane",
    cycle: "A",
    duree: 180,
    questions: 60,
    participants: 890,
    moyenneScore: 58,
    statut: "Actif" as const,
    dateCreation: "2026-04-08",
  },
  {
    id: "eb-003",
    titre: "BAC Blanc — Toutes séries",
    concours: "BAC",
    cycle: "A",
    duree: 300,
    questions: 100,
    participants: 3120,
    moyenneScore: 71,
    statut: "Actif" as const,
    dateCreation: "2026-04-15",
  },
  {
    id: "eb-004",
    titre: "BFEM Blanc — Math & Sciences",
    concours: "BFEM",
    cycle: "A",
    duree: 150,
    questions: 50,
    participants: 2410,
    moyenneScore: 64,
    statut: "Programmé" as const,
    dateCreation: "2026-04-18",
  },
]

export const notifications = [
  {
    id: "n-001",
    titre: "Rappel — Révision Droit Administratif",
    type: "Rappel",
    cible: "Acheteurs Pack ENA",
    envoyees: 842,
    ouvertes: 614,
    date: "2026-04-19 08:00",
    statut: "Envoyée" as const,
  },
  {
    id: "n-002",
    titre: "Nouveau pack disponible : Procédure Judiciaire",
    type: "Annonce",
    cible: "Tous les utilisateurs",
    envoyees: 12480,
    ouvertes: 4892,
    date: "2026-04-18 18:30",
    statut: "Envoyée" as const,
  },
  {
    id: "n-003",
    titre: "Examen blanc ENA dans 3 jours",
    type: "Événement",
    cible: "Cycle B",
    envoyees: 2140,
    ouvertes: 1820,
    date: "2026-04-18 12:00",
    statut: "Envoyée" as const,
  },
  {
    id: "n-004",
    titre: "Date limite Douane approche",
    type: "Urgence",
    cible: "Inscrits Douane",
    envoyees: 0,
    ouvertes: 0,
    date: "2026-04-22 09:00",
    statut: "Programmée" as const,
  },
]

export const securityEvents = [
  {
    id: "se-001",
    utilisateur: "Ibrahima Fall",
    evenement: "Tentative de capture d'écran",
    severite: "Moyenne" as const,
    date: "Il y a 2h",
    action: "Avertissement envoyé",
  },
  {
    id: "se-002",
    utilisateur: "Cheikh Diouf",
    evenement: "Connexion multi-appareils",
    severite: "Haute" as const,
    date: "Hier",
    action: "Compte bloqué",
  },
  {
    id: "se-003",
    utilisateur: "Inconnu",
    evenement: "Tentative de partage de session",
    severite: "Haute" as const,
    date: "Il y a 6h",
    action: "Session révoquée",
  },
  {
    id: "se-004",
    utilisateur: "Mamadou Sarr",
    evenement: "Tentative copier-coller",
    severite: "Faible" as const,
    date: "Il y a 1 jour",
    action: "Bloqué silencieusement",
  },
]

export function fcfa(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value) + " FCFA"
}
