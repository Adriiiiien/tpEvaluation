# Gestion des missions et des candidatures
**Auteur :** Adrien SIMON  
**Projet :** Examen CCP2 – Développeur Web et Web Mobile

---

## 1️⃣ Présentation du projet

Cette plateforme permet aux bénévoles de postuler à des missions proposées par des associations.  
Deux types d’utilisateurs :  
- **Bénévoles** : peuvent consulter les missions et postuler.  
- **Associations** : peuvent créer, modifier, supprimer des missions et gérer les candidatures.

---

## 2️⃣ Fonctionnalités

### Authentification
- Inscription d’un utilisateur (`/auth/register`) : rôle `benevole` ou `association`.  
- Connexion (`/auth/login`) : renvoie un JWT pour authentifier les requêtes.

### Gestion des missions
- **Associations** : créer, modifier, supprimer des missions.  
- **Bénévoles** : consulter toutes les missions ou une mission spécifique.

### Gestion des candidatures
- **Bénévoles** : postuler à une mission, voir leurs propres candidatures.  
- **Associations** : voir toutes les candidatures pour leurs missions, accepter ou refuser une candidature.

---

## 3️⃣ Base de données

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
| utilisateur_id | INT | ID de l’association créatrice (FK vers `utilisateur`) |

### candidature
| Champ | Type | Description |
|-------|------|------------|
| id | INT AUTO_INCREMENT | Identifiant unique |
| date_candidature | DATE | Date de candidature |
| statut | ENUM('en attente', 'acceptée', 'refusée') | Statut de la candidature |
| utilisateur_id | INT | ID du bénévole (FK vers `utilisateur`) |
| mission_id | INT | ID de la mission (FK vers `mission`) |