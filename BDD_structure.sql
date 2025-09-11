CREATE DATABASE emplois;
USE emplois;

CREATE TABLE utilisateur (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    pseudo VARCHAR(100),
    email VARCHAR(150) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    role ENUM('benevole', 'association') NOT NULL
);

CREATE TABLE mission (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(200) NOT NULL,
    description TEXT,
    date_debut DATE NOT NULL,
    date_fin DATE,
    utilisateur_id INT NOT NULL,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id)
);

CREATE TABLE candidature (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date_candidature DATE NOT NULL,
    statut ENUM('en attente', 'acceptée', 'refusée') DEFAULT 'en attente',
    utilisateur_id INT NOT NULL,
    mission_id INT NOT NULL,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id),
    FOREIGN KEY (mission_id) REFERENCES mission(id)
);

INSERT INTO utilisateur (nom, prenom, pseudo, email, mot_de_passe, role) VALUES
('Simon', 'Adrien', 'asimon', 'adrien-simon@outlook.com', 'mdp123', 'benevole'),
('Gander', 'Tabata', 'tgander', 'takaraa1996@gmail.com', 'mdp123', 'benevole'),
('Rodrigues', 'Kenny', 'asso_solidarite', 'contact@solidarite.fr', 'mdp123', 'association'),
('Simon', 'Françoise', 'asso_aide', 'contact@aidehuma.fr', 'mdp123', 'association');

INSERT INTO mission (titre, description, date_debut, date_fin, utilisateur_id) VALUES
('Collecte alimentaire', 'Aider à distribuer des repas aux sans-abris', '2025-09-24', '2025-11-15', 3),
('Soutien scolaire', 'Donner des cours de soutien à des enfants en difficulté', '2025-11-01', '2025-12-15', 4);

INSERT INTO candidature (date_candidature, statut, utilisateur_id, mission_id) VALUES
('2025-09-10', 'en attente', 1, 1),
('2025-09-11', 'acceptée', 2, 1),
('2025-09-11', 'refusée', 1, 2);