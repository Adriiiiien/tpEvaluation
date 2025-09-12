# Gestion des missions et des candidatures
**Auteur :** Adrien SIMON  
**Projet :** Examen CCP2 – Développeur Web et Web Mobile

---

## I. Présentation du projet

Cette plateforme permet aux bénévoles de postuler à des missions proposées par des associations.  
Il existe deux types d’utilisateurs :  
- **Bénévoles** : peuvent consulter les missions et postuler.  
- **Associations** : peuvent créer, modifier, supprimer des missions et gérer les candidatures.

---

## II Fonctionnalités

### Authentification
- Inscription d’un utilisateur (`/auth/register`) : rôle `benevole` ou `association`.  
- Connexion (`/auth/login`) : renvoie un JWT pour authentifier les requêtes (et pouvoir en effectuer certaines plus tard).

### Gestion des missions
- **Associations** : créer, modifier, supprimer des missions.  
- **Bénévoles** : consulter toutes les missions ou une mission spécifique.

### Gestion des candidatures
- **Bénévoles** : postuler à une mission, voir leurs propres candidatures.  
- **Associations** : voir toutes les candidatures pour leurs missions, accepter ou refuser une candidature.

---

## III Base de données

### utilisateur
| Champ | Type | Description |
|-------|------|------------|
| id | INT AUTO_INCREMENT | Identifiant unique |
| nom | VARCHAR(100) | Nom de l’utilisateur |
| prenom | VARCHAR(100) | Prénom de l’utilisateur |
| pseudo | VARCHAR(100) | Pseudo facultatif |
| email | VARCHAR(150) | Email unique |
| mot_de_passe | VARCHAR(255) | Mot de passe hashé |
| role | ENUM('benevole', 'association') | Rôle de l’utilisateur |

### mission
| Champ | Type | Description |
|-------|------|------------|
| id | INT AUTO_INCREMENT | Identifiant unique |
| titre | VARCHAR(200) | Titre de la mission |
| description | TEXT | Description détaillée |
| date_debut | DATE | Date de début |
| date_fin | DATE | Date de fin |
| utilisateur_id | INT | ID de l’association (FK vers `utilisateur`) |

### candidature
| Champ | Type | Description |
|-------|------|------------|
| id | INT AUTO_INCREMENT | Identifiant unique |
| date_candidature | DATE | Date de candidature |
| statut | ENUM('en attente', 'acceptée', 'refusée') | Statut de la candidature |
| utilisateur_id | INT | ID du bénévole (FK vers `utilisateur`) |
| mission_id | INT | ID de la mission (FK vers `mission`) |

## Routes API

---

### IV Les Routes

### 1 Utilisateurs

| Route | Méthode | Body | Accès | Description |
|-------|---------|------|-------|-------------|
| `/auth/register` | POST | `{ "nom", "prenom", "pseudo", "email", "password", "role" }` | Public | Inscription d'un utilisateur avec rôle `benevole` ou `association`. |
| `/auth/login` | POST | `{ "identifier" (email ou pseudo), "password" }` | Public | Connexion et récupération d'un JWT. |

---

### 2 Missions

| Route | Méthode | Body | Accès | Description |
|-------|---------|------|-------|-------------|
| `/missions` | GET | – | Tout utilisateur connecté | Récupère toutes les missions. |
| `/missions/:id` | GET | – | Tout utilisateur connecté | Récupère une mission spécifique par ID. |
| `/missions` | POST | `{ "titre", "description", "date_debut", "date_fin" }` | Association | Crée une nouvelle mission. |
| `/missions/:id` | PUT | `{ "titre", "description", "date_debut", "date_fin" }` | Association propriétaire | Modifie une mission existante. |
| `/missions/:id` | DELETE | – | Association propriétaire | Supprime une mission. |

---

### 3 Candidatures

| Route | Méthode | Body | Accès | Description |
|-------|---------|------|-------|-------------|
| `/candidatures` | POST | `{ "missionId" }` | Bénévole | Crée une candidature pour une mission. Le statut initial est "en attente". |
| `/candidatures/mes-candidatures` | GET | – | Bénévole | Récupère toutes les candidatures du bénévole connecté. |
| `/candidatures/mission/:missionId` | GET | – | Association | Récupère toutes les candidatures pour une mission spécifique. |
| `/candidatures/:candidatureId` | PUT | `{ "statut" }` | Association | Met à jour le statut d'une candidature (`acceptée` ou `refusée`). |

---

### Notes importantes

- Toutes les routes **sauf `/auth/register` et `/auth/login`** nécessitent un JWT dans le header :  

- Les rôles sont contrôlés :
- **Bénévole** : ne peut créer/modifier/supprimer des missions, ni voir toutes les candidatures d’une mission.  
- **Association** : ne peut pas postuler, mais peut voir toutes les candidatures pour ses missions et gérer leur statut.