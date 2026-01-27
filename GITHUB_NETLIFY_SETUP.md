# Guide de Configuration GitHub et Netlify

## 1. Configuration GitHub

### Étape 1: Créer un référentiel sur GitHub
1. Allez sur [github.com](https://github.com) et connectez-vous
2. Cliquez sur le "+" en haut à droite → "New repository"
3. Nommez le référentiel: `website-voitures-O`
4. Cliquez sur "Create repository"

### Étape 2: Ajouter votre référentiel distant
```bash
git remote add origin https://github.com/votre-utilisateur/website-voitures-O.git
git branch -M main
git push -u origin main
```

Remplacez `votre-utilisateur` par votre nom d'utilisateur GitHub.

## 2. Déploiement sur Netlify

### Étape 1: Connecter Netlify à GitHub
1. Allez sur [netlify.com](https://netlify.com)
2. Cliquez sur "Sign up" et choisissez "Sign up with GitHub"
3. Autorisez Netlify à accéder à votre compte GitHub

### Étape 2: Déployer le site
1. Cliquez sur "New site from Git"
2. Sélectionnez votre référentiel `website-voitures-O`
3. Les paramètres de déploiement sont déjà configurés
4. Cliquez sur "Deploy site"

Votre site sera déployé et vous obtiendrez une URL comme `https://xxxxx.netlify.app`

## 3. Panel d'Administration Client

Le panel d'administration est accessible à l'adresse:
```
https://votre-site.netlify.app/admin/
```

### Fonctionnalités:
- ✅ Ajouter des véhicules
- ✅ Modifier des véhicules existants
- ✅ Supprimer des véhicules
- ✅ Les données sont sauvegardées dans le navigateur (localStorage)

### Comment utiliser:
1. Allez sur `/admin/`
2. Remplissez le formulaire avec les informations du véhicule
3. Cliquez sur "Ajouter/Mettre à jour"
4. Le véhicule apparaîtra immédiatement sur la page des véhicules

## 4. Mise à jour du site

Pour mettre à jour le site après des modifications:
```bash
git add .
git commit -m "Description de vos modifications"
git push origin main
```

Netlify redéploiera automatiquement le site à chaque push.

## 5. Note importante sur les données

**Stockage actuel:** Les données des véhicules sont sauvegardées dans `localStorage` du navigateur.

**Limitation:** Chaque navigateur/appareil aura sa propre copie des données. Pour une solution plus robuste avec une base de données centrale, considérez:
- Firebase (Firestore)
- Supabase
- MongoDB Atlas
- Une API Node.js personnalisée

## Contacts Netlify Support
- Site: https://netlify.com/support
- Email: support@netlify.com

## Commandes Git utiles

```bash
# Voir l'état des changements
git status

# Voir l'historique des commits
git log

# Voir les modifications apportées
git diff
```
