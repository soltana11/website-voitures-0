# Guide de Configuration Decap CMS

## Qu'est-ce que Decap CMS?

Decap CMS (anciennement Netlify CMS) est une interface d'administration simple pour gérer le contenu de votre site directement depuis un panneau d'administration professionnel.

## 📋 Prérequis

- Compte GitHub
- Projet déployé sur Netlify
- OAuth app configurée

## Étape 1: Configurer les Paramètres OAuth sur GitHub

### 1.1 Créer une OAuth App
1. Allez sur https://github.com/settings/developers
2. Cliquez sur "OAuth Apps" → "New OAuth App"
3. Remplissez les informations:
   - **Application name:** Auto Prestige Admin
   - **Homepage URL:** `https://votre-site.netlify.app`
   - **Authorization callback URL:** `https://api.netlify.com/auth/done`
4. Cliquez sur "Register application"

### 1.2 Copier les Credentials
- Copiez le **Client ID**
- Générez un nouveau **Client Secret** et copiez-le
- **Gardez-les en sécurité!**

## Étape 2: Configurer Netlify

### 2.1 Ajouter les Variables d'Environnement
1. Allez sur votre site Netlify
2. Settings → Environment
3. Cliquez sur "Edit variables"
4. Ajoutez:
   ```
   DECAP_CMS_OAUTH_CLIENT_ID = (votre Client ID)
   ```

### 2.2 Configurer la Fonction Auth Netlify
Les fonctions serverless de Netlify géreront l'authentification automatiquement.

## Étape 3: Structure du Projet

Votre projet devrait avoir:
```
.
├── admin/
│   ├── index.html          (ancien admin panel)
│   ├── index-cms.html      (Decap CMS)
│   └── config.yml          (config Decap)
├── _data/
│   └── (fichiers JSON des véhicules)
├── images/uploads/         (images des véhicules)
└── netlify.toml            (config Netlify)
```

## Étape 4: Accéder à Decap CMS

### Version locale (développement)
```
http://localhost:8000/admin/index-cms.html
```

### Après déploiement Netlify
```
https://votre-site.netlify.app/admin/index-cms.html
```

### Login
1. Cliquez sur "Login with GitHub"
2. Autorisez l'accès
3. Vous serez redirigé vers le tableau de bord Decap CMS

## Étape 5: Utiliser Decap CMS

### Ajouter un Véhicule:
1. Cliquez sur "Véhicules" dans le menu
2. Cliquez sur "New Vehicle"
3. Remplissez les informations:
   - Nom
   - Année
   - Kilométrage
   - Prix
   - Image (upload depuis votre ordinateur)
   - Description
4. Cliquez sur "Publish"

### Modifier un Véhicule:
1. Cliquez sur le véhicule dans la liste
2. Modifiez les informations
3. Cliquez sur "Publish"

### Supprimer un Véhicule:
1. Cliquez sur le véhicule
2. Cliquez sur "Delete"
3. Confirmez

## Configuration Avancée

Si vous voulez un contrôle plus granulaire, mettez à jour `admin/config.yml`:

```yml
backend:
  name: github
  repo: votre-utilisateur/website-voitures-O
  branch: main

media_folder: "images/uploads"
public_folder: "/images/uploads"

collections:
  - name: "vehicles"
    label: "Véhicules"
    folder: "_data/vehicles"
    create: true
    slug: "{{slug}}"
    fields:
      - { label: "Nom", name: "name", widget: "string" }
      - { label: "Année", name: "year", widget: "string" }
      - { label: "Kilométrage", name: "km", widget: "string" }
      - { label: "Prix", name: "price", widget: "string" }
      - { label: "Image", name: "image", widget: "image" }
      - { label: "Description", name: "description", widget: "textarea" }
```

## Dépannage

### "Login with GitHub ne fonctionne pas"
- Vérifiez que l'URL de callback est correcte: `https://api.netlify.com/auth/done`
- Attendez 5-10 minutes après la création de l'OAuth app

### "Les fichiers ne se sauvegardent pas"
- Vérifiez que votre référentiel GitHub est public
- Vérifiez que le token GitHub a les permissions nécessaires

### "Les images ne s'affichent pas"
- Vérifiez que le dossier `images/uploads/` existe
- Vérifiez que `public_folder` est configuré correctement

## Support

- **Documentation Decap:** https://decapcms.org/docs/intro/
- **GitHub Issues:** https://github.com/decaporg/decap-cms/issues
- **Community Chat:** https://decapcms.org/docs/community/

## Alternatives

Si Decap CMS est trop complexe, vous pouvez garder l'admin panel simple que j'ai créé:
- Accédez à `/admin/` (version avec localStorage)
- Plus simple, pas d'authentification externe nécessaire
- Données sauvegardées localement dans le navigateur
