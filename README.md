Markdown
# 🚢 Commodity Trading & Logistics Masterclass (Assas)

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Licence](https://img.shields.io/badge/licence-Academic-green.svg)
![Statut](https://img.shields.io/badge/statut-En_développement-orange.svg)

## 📖 À propos de ce projet

Cette application est le support de cours interactif développé pour la Masterclass **"Le Négoce International de Matières Premières : Du Physique au Papier"**, dispensée aux étudiants en Master à l'Université Paris-Panthéon-Assas.

L'objectif de cette plateforme n'est pas seulement d'afficher des diapositives, mais d'offrir une véritable **simulation opérationnelle**. Elle permet de visualiser l'architecture d'un trade, de calculer des expositions financières réelles (Hedging, Base, Cost of Carry) et d'animer une simulation de marché en direct.

---

## 🎯 Fonctionnalités de l'Application

L'application est divisée en plusieurs outils interactifs pour soutenir les 9 heures d'intervention :

* **Slide Deck Intégré :** Présentation du panorama, du vocabulaire et des concepts clés (Hard vs Soft commodities, Typologie des acteurs).
* **Calculateur d'Exposition (Hedging) :** Outil interactif permettant de simuler l'évolution d'une marge (P&L) en fonction des variations de la bourse et de la Base physique.
* **Simulateur de Fret & Surestaries :** Calcul automatisé de l'impact des retards logistiques (Demurrage) sur des contrats maritimes (FOB vs CIF).
* **Business Case "Live" (De la Cerise au Terminal) :** Un tableau de bord maître (pour le formateur) permettant d'injecter des chocs de marché (typhon, explosion de la bourse, régulation EUDR) pendant que les groupes d'étudiants négocient entre eux.

---

## 📚 Structure du Cours (Syllabus)

Le programme est divisé en 3 modules de 3 heures :

### Module 1 : L'Initiation et l'Échiquier (Le "Pourquoi")
* L'histoire et l'évolution du négoce de matières premières.
* L'échiquier mondial : Hard vs Soft Commodities et typologie des acteurs (ABCD).
* Le cycle de vie complet d'un Trade (documents logistiques, B/L, certificats).
* L'architecture d'un Desk (Front, Middle, Back Office) et gestion du P&L.

### Module 2 : Mécanique Opérationnelle & Risques (Le "Comment")
* La passerelle Physique/Papier (Futures, Options, Contango/Backwardation).
* Mathématiques du Hedging et calcul du *Cost of Carry*.
* Logistique avancée : Incoterms 2020 et affrètement maritime (Chartering).
* La matrice des 6 risques (Contrepartie, Logistique, Qualité, Météo, Politique, Prix).

### Module 3 : Expertise, Stratégie & Avenir (La "Pratique")
* Comprendre et modéliser la Supply & Demand (S&D).
* Le choc réglementaire (Règlementation Européenne EUDR sur la déforestation).
* **Simulation Finale :** Organisation de l'importation de 500 tonnes de Robusta (jeu de rôle interactif).

---

## 🛠️ Stack Technique

* **Frontend :** React.js / Next.js (pour la réactivité des calculatrices).
* **Styling :** Tailwind CSS (pour une interface épurée et moderne).
* **Visualisation de données :** Chart.js ou Recharts (pour les courbes Contango/Backwardation et S&D).
* **Déploiement :** Vercel

---

👨‍🏫 Auteur
Scanu Loic Head of trading & Intervenant - Université Paris-Panthéon-Assas

📄 Licence
Ce projet est conçu à des fins purement académiques et pédagogiques.

Copyright © 2026 Loic Scanu. Tous droits réservés pour le contenu du cours.
