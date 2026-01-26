# Auto Prestige - Plateforme de Vente de Véhicules

Une plateforme web moderne pour la vente de véhicules d'occasion avec gestion administrative.

## Fonctionnalités

- Page d'accueil attractive avec hero section
- Catalogue de véhicules dynamique
- Section services
- Page de contact centralisée
- Interface d'administration pour gérer les véhicules
- Responsive design
- Intégration WhatsApp

## Installation locale

1. Clonez le référentiel:
```bash
git clone https://github.com/votre-utilisateur/website-voitures-O.git
cd website-voitures-O
```

2. Lancez un serveur local:
```bash
python -m http.server 8000
```

3. Accédez à `http://localhost:8000`

## Admin Panel

Pour accéder au panneau d'administration:
1. Allez sur `/admin/`
2. Vous pouvez ajouter, modifier et supprimer des véhicules
3. Les données sont sauvegardées localement dans le navigateur

**Note:** Sur Netlify, utilisez Netlify CMS pour une gestion persistante des données.

## Déploiement sur Netlify

1. Connectez votre référentiel GitHub à Netlify
2. Les paramètres de déploiement sont automatiquement configurés
3. Chaque push sur `main` déclenche un redéploiement

## Structure du projet

```
.
├── index.html           # Page d'accueil
├── vehicles.html        # Catalogue de véhicules
├── services.html        # Services proposés
├── contact.html         # Page de contact
├── admin/              # Panneau d'administration
│   └── index.html
├── cars.json           # Données des véhicules
├── script.js           # Scripts JavaScript
├── style.css           # Styles CSS
├── netlify.toml        # Configuration Netlify
└── images/             # Images du projet
```

## Technologies utilisées

- HTML5
- CSS3
- JavaScript (Vanilla)
- Font Awesome pour les icônes
- Google Fonts

## Licence

Tous droits réservés © 2023 Auto Prestige
