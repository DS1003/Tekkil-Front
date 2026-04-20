# 🚀 Dossier de Cadrage Stratégique et Technique - Application Mobile Tekkil

## 1. Introduction Générale
Ce document constitue le dossier de cadrage stratégique et technique exhaustif pour le projet d'application mobile **"Tekkil"**. Il formalise la vision du projet, ses objectifs, ses fonctionnalités clés, son architecture préliminaire et les workflows utilisateurs. Ce dossier sert de référence unique pour toutes les parties prenantes.

---

## 2. Vision et Objectifs du Projet

### 2.1. Objectifs Stratégiques
*   **Accroître le Taux de Réussite** : Fournir des contenus pédagogiques optimisés.
*   **Démocratiser l'Accès** : Plateforme flexible avec modèles de paiement adaptés (Mobile Money).
*   **Sécurité du Contenu** : Mécanismes robustes contre la copie et le partage non autorisé.
*   **Évolutivité** : Architecture permettant l'ajout facile de nouveaux concours et matières.
*   **Expérience Utilisateur Engagement** : Interface intuitive, suivi de progression et chatbot IA.

---

## 3. Public Cible et Catégories de Contenu

L'application s'adresse aux étudiants et professionnels préparant :
*   **Examens** : Examens nationaux (BAC, BFEM, CFFE).
*   **Concours** : ENA (Cycle A et B), Douane, CFJ, FASTEF.
*   **Certifications** : Certifications professionnelles variées.

### 📂 Structure des Packs
Les contenus sont organisés par **Type d'accès** (Direct/Indirect) et par **Cycle** (A/B). Chaque pack est une unité pédagogique complète.

---

## 4. Structure Détaillée des Contenus (Packs)

Chaque matière intègre six piliers pédagogiques :

| Élément | Description | Objectif |
| :--- | :--- | :--- |
| **Cours** | Documents textuels exhaustifs | Acquisition des bases |
| **Résumés** | Synthèses, fiches mémo, cartes mentales | Révision rapide |
| **Audio** | Podcasts et leçons enregistrées | Apprentissage en mobilité |
| **Vidéo** | Tutoriels et cours magistraux filmés | Visualisation des concepts |
| **QCM** | Questionnaires interactifs avec correction | Auto-évaluation |
| **Flashcards** | Cartes mémoire numériques | Mémorisation active |

---

## 5. Modèle de Monétisation

### 5.1. Aperçu Gratuit
*   Accès gratuit jusqu'à **3 cours par matière**.
*   Objectif : Acquisition et conversion utilisateur.

### 5.2. Accès Payant
*   Achat de pack : Déblocage illimité (6 éléments + Chatbot).
*   **Validité** : Accès limité jusqu'à la date du concours.
*   **Révocation automatique** une fois le concours passé.

### 5.3. Systèmes de Paiement
*   **Mobile Money** : Orange Money, Wave (Sénégal).
*   **Cartes Bancaires** : Stripe / Passerelles sécurisées.

---

## 6. Fonctionnalités Clés

*   **Examens Blancs** : Simulations chronométrées avec analyse détaillée.
*   **Chatbot Intelligent** : Contextuel au pack acheté, illimité après achat.
*   **Tableau de Bord** : Suivi des scores, temps passé et recommandations.
*   **Notifications** : Rappels de révision et alertes dates de concours.

---

## 7. Sécurité et Protection (Anti-Fraude)

La protection de la propriété intellectuelle est prioritaire :
*   **Connexion Unique** : Une seule session active par compte.
*   **Anti-Capture d'écran** : Blocage technique sur iOS, Android et Web.
*   **Zéro Export** : Désactivation du copier-coller et protection des flux médias.
*   **Filigranes Dynamiques** : Affichage de l'ID utilisateur sur les contenus.
*   **Système de Pénalités** : Détection des tentatives de fraude et bannissement.

---

## 8. Architecture Technique

### 🛠 Stack Technique
*   **Plateformes** : Android (Natif/Hybride), iOS (Natif/Hybride), Version Web Responsive.
*   **Backend** : Architecture microservices / API RESTful ou GraphQL.
*   **Base de Données** : Relationnelle (PostgreSQL) ou NoSQL (MongoDB).
*   **Cloud** : AWS / Google Cloud (PaaS) avec Auto-scaling.
*   **CMS** : Headless CMS pour la gestion autonome des contenus.

---

## 9. Workflow Utilisateur (User Flow)

1.  **Entrée** : Sélection de la catégorie (Concours/Examens).
2.  **Exploration** : Choix du cycle et consultation des cours gratuits.
3.  **Achat** : Paiement via Mobile Money ou Carte.
4.  **Apprentissage** : Accès complet aux ressources et au chatbot.
5.  **Évaluation** : QCM et Examens blancs.
6.  **Clôture** : Fin d'accès automatique après le concours.

---

## 10. Roadmap Préliminaire

1.  **Validation** du dossier de cadrage.
2.  **Conception UI/UX** (Wireframes & Maquettes).
3.  **Spécifications Techniques** détaillées.
4.  **Développement & Tests** unitaires/sécurité.
5.  **Déploiement** sur les Stores et Maintenance.
