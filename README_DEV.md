# 📘 Guide du Développeur - Projet ESPA

Bienvenue dans l'écosystème technique du projet **ESPA**. Cette documentation est conçue pour aider tout nouveau développeur à comprendre rapidement l'architecture du projet, les standards de code et les flux de données.

---

## 📑 Table des Matières

1.  [📁 Architecture du Projet](#-architecture-du-projet)
2.  [⚛️ Concepts Core (React & Next.js)](#️-concepts-core-react--nextjs)
3.  [🔄 Flux de Données & API](#-flux-de-données--api)
4.  [🎨 Bibliothèque UI](#-bibliothèque-ui)
5.  [👨‍🍳 Recettes du Développeur (How-to)](#-recettes-du-développeur-how-to)
6.  [💅 Style & Design](#-style--design)

---

## 📁 Architecture du Projet

Nous utilisons une **Feature-Based Architecture**. Au lieu de tout mélanger par "type" de fichier (tous les boutons ensemble, toutes les pages ensemble), nous regroupons le code par **Fonctionnalité Métier**. Cela rend le projet extrêmement scalable et facile à maintenir.

### Hiérarchie des dossiers :

*   `src/app/` : Gère le **Routing** et les **Layouts**. C'est ici que sont définies les URLs de l'application.
*   `src/config/` : Contient les constantes globales, les logos, et les paramètres de marque (branding).
*   `src/components/ui/` : Composants UI globaux (Sidebar, Navbar, Footer).
*   `src/features/` : **Le cœur du projet.**
    *   `auth/` : Gestion du login et de la session utilisateur.
    *   `rapports/` : Toute la logique de création, vue, et export des rapports.
    *   `admin/` : Tableaux de bord et gestion des utilisateurs pour les administrateurs.
    *   `common/` : Composants et utilitaires partagés entre plusieurs features (ex: `AppSelect`).

> [!TIP]
> **Règle d'or** : Si vous travaillez sur une nouvelle fonctionnalité (ex: "Messagerie"), créez un nouveau dossier dans `src/features/messagerie` et placez-y ses propres composants, hooks et services.

---

## ⚛️ Concepts Core (React & Next.js)

### Hooks 🪝
Nous utilisons massivement les hooks pour gérer l'état et la logique :
*   `useState` : Pour l'état local (ex: ouvrir une modale).
*   `useEffect` : Pour les actions au montage du composant (ex: fetch de données).
*   **Hooks Personnalisés** : Centralisent la logique métier.
    *   `useUser` : Accès global aux infos de l'utilisateur connecté via un `Context`.
    *   `usePeriodes` : Récupère les périodes de calendrier disponibles.

### Client vs Server Components 🖥️
*   **'use client'** : Indispensable en haut d'un fichier dès qu'il y a de l'interactivité (clic, état, hooks). La majorité de nos composants UI sont des Client Components.
*   **Server Components** : Utilisés par défaut dans `src/app` pour le SEO et la performance lors du premier rendu.

### Hydratation & Pattern 'Mounted' 💧
Pour éviter les erreurs "Hydration Mismatch" (quand le serveur et le client ne sont pas d'accord sur le HTML), nous utilisons souvent ce pattern :

```tsx
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);

if (!mounted) return null; // Attend le montage client
```

---

## 🔄 Flux de Données & API

### La Couche Services
Chaque appel vers le backend Symfony passe par un service.
*   Exemple : `src/features/rapports/services/rapportService.ts`
*   Nous utilisons un **Proxy Next.js** (configuré dans `next.config.mjs`) pour rediriger les appels `/api/*` vers le bon serveur backend de manière sécurisée.

### Circulation des données
1.  **Service** : Fait le `fetch`.
2.  **Hook** : Appelle le service et gère les états `isLoading` et `error`.
3.  **Composant** : Affiche les données en utilisant le hook.

---

## 🎨 Bibliothèque UI

Pour garder un design "Premium" et cohérent, utilisez nos composants génériques situés dans `src/features/common/components/ui/` :

*   **`AppSelect`** : Un sélecteur stylisé avec état de chargement intégré.
*   **`AppTableSkeleton`** : Un effet de "shimmer" (vibration lumineuse) à afficher pendant le chargement des tableaux.

**Comment ajouter un nouveau sélecteur ?**
```tsx
<AppSelect
  label="Ma Sélection"
  options={[{ id: 1, label: "Option A" }]}
  onValueChange={(val) => console.log(val)}
  isLoading={isLoading}
/>
```

---

## 👨‍🍳 Recettes du Développeur (How-to)

### 🚀 Ajouter un lien dans la Sidebar
1.  Ouvrez `src/components/ui/Sidebar.tsx`.
2.  Ajoutez un objet dans la constante `ALL_LINKS`.
3.  Précisez les `roles` autorisés à voir ce lien.

### 🏷️ Changer le nom ou le logo de l'application
Modifiez le fichier [constants.ts](file:///home/zo-kely/Documents/Studies/ITU/Stage/ESPA/Mr-RADO/rapport-frontend/src/config/constants.ts) :
*   `APP_CONSTANTS.appName` : Nom de l'app.
*   `IMAGES.LOGO_MESUPRES` : Chemin vers le logo.

### 📄 Créer une nouvelle page
1.  Créez un dossier dans `src/app/` (ex: `src/app/profil`).
2.  Créez-y un fichier `page.tsx`.
3.  Utilisez `DashboardLayout` pour conserver la Sidebar et la Navbar.

---

## �️ Guide de Maintenance et d'Évolution

Ce guide répertorie les points d'entrée techniques pour faire évoluer l'application.

### 1. Authentification & Sécurité
*   **Action** : Changer la durée de session ou la logique du token
    *   **Fichier** : [src/features/auth/services/authService.ts](file:///home/zo-kely/Documents/Studies/ITU/Stage/ESPA/Mr-RADO/rapport-frontend/src/features/auth/services/authService.ts)
    *   **Composant** : `authService`
    *   **Explication** : Gère les appels au backend pour le login et la vérification de session.

*   **Action** : Modifier les permissions (Rôles)
    *   **Fichier** : [src/features/auth/types/index.ts](file:///home/zo-kely/Documents/Studies/ITU/Stage/ESPA/Mr-RADO/rapport-frontend/src/features/auth/types/index.ts)
    *   **Composant** : Type `User` (Champ `role`)
    *   **Explication** : Définit les chaines autorisées. Les accès visuels sont orchestrés dans `Sidebar.tsx`.

### 2. Système de Rapports (Le flux complet)
*   **Action** : Ajouter un champ dans le formulaire
    *   **Fichier** : [src/features/rapports/components/form/RapportForm.tsx](file:///home/zo-kely/Documents/Studies/ITU/Stage/ESPA/Mr-RADO/rapport-frontend/src/features/rapports/components/form/RapportForm.tsx)
    *   **Variable** : `onSubmit` / `register` (React Hook Form)
    *   **Explication** : Ajoutez le HTML du champ et liez-le avec `register`.

*   **Action** : Ajouter une nouvelle fonctionnalité de recherche
    *   **Fichier** : [src/app/dashboard/rapports/recherche/page.tsx](file:///home/zo-kely/Documents/Studies/ITU/Stage/ESPA/Mr-RADO/rapport-frontend/src/app/dashboard/rapports/recherche/page.tsx)
    *   **Service** : [src/features/rapports/services/rechercheService.ts](file:///home/zo-kely/Documents/Studies/ITU/Stage/ESPA/Mr-RADO/rapport-frontend/src/features/rapports/services/rechercheService.ts)
    *   **Explication** : Le module de recherche permet de filtrer les rapports par une date unique. Le service fait appel à `/api/rapports/recherche?date=...`.

*   **Action** : Modifier la logique de calcul des stats
    *   **Fichier** : [src/features/admin/services/adminService.ts](file:///home/zo-kely/Documents/Studies/ITU/Stage/ESPA/Mr-RADO/rapport-frontend/src/features/admin/services/adminService.ts)
    *   **Composant** : `adminService.getAllUtilisateurs`
    *   **Explication** : Les calculs de ratios se font souvent dynamiquement dans les composants utilisant ces données (ex: `AdminDashboard.tsx`).

*   **Action** : Changer le design du sélecteur de période
    *   **Fichier** : [src/features/config/components/PeriodeSelect.tsx](file:///home/zo-kely/Documents/Studies/ITU/Stage/ESPA/Mr-RADO/rapport-frontend/src/features/config/components/PeriodeSelect.tsx)
    *   **Composant** : `AppSelect`
    *   **Explication** : Ce sélecteur utilise le composant générique `AppSelect`.

### 3. Export PDF & Impression
*   **Action** : Changer l'entête du PDF (Logo, Titre)
    *   **Fichier** : [src/features/rapports/components/vision/sub/RapportHeader.tsx](file:///home/zo-kely/Documents/Studies/ITU/Stage/ESPA/Mr-RADO/rapport-frontend/src/features/rapports/components/vision/sub/RapportHeader.tsx)
    *   **Composant** : `RapportHeader`
    *   **Explication** : C'est le template visuel utilisé au sommet de chaque rapport exporté.

*   **Action** : Modifier les marges ou la police du PDF
    *   **Fichier** : [src/features/rapports/components/vision/RapportView.tsx](file:///home/zo-kely/Documents/Studies/ITU/Stage/ESPA/Mr-RADO/rapport-frontend/src/features/rapports/components/vision/RapportView.tsx)
    *   **Variable** : Sélecteur `.a4-container`
    *   **Explication** : Contient les styles CSS simulant le format papier A4.

*   **Action** : Changer la bibliothèque d'export
    *   **Fichier** : [src/features/rapports/utils/exportUtils.ts](file:///home/zo-kely/Documents/Studies/ITU/Stage/ESPA/Mr-RADO/rapport-frontend/src/features/rapports/utils/exportUtils.ts)
    *   **Explication** : C'est ici que `jspdf` et `html2canvas` sont importés et orchestrés.

### 4. Pilotage & Admin
*   **Action** : Ajouter un nouveau graphique ou indicateur
    *   **Fichier** : [src/features/admin/components/AdminDashboard.tsx](file:///home/zo-kely/Documents/Studies/ITU/Stage/ESPA/Mr-RADO/rapport-frontend/src/features/admin/components/AdminDashboard.tsx)
    *   **Composant** : `StatCard`
    *   **Explication** : Utilisez les `StatCard` existants ou insérez de nouveaux composants visuels dans la grille.

*   **Action** : Changer la source de données d'un tableau admin
    *   **Fichier** : [src/features/admin/services/adminService.ts](file:///home/zo-kely/Documents/Studies/ITU/Stage/ESPA/Mr-RADO/rapport-frontend/src/features/admin/services/adminService.ts)
    *   **Composant** : `adminService`
    *   **Explication** : Centralise les appels vers `/api/utilisateurs` et `/api/manquants`.

### 5. Branding & UI Globale
*   **Action** : Changer les couleurs du thème
    *   **Fichier** : [src/app/globals.css](file:///home/zo-kely/Documents/Studies/ITU/Stage/ESPA/Mr-RADO/rapport-frontend/src/app/globals.css)
    *   **Variable** : `@theme inline` / `--background`, etc.
    *   **Explication** : Configuration directe via Tailwind CSS v4.

*   **Action** : Modifier le comportement de la Sidebar (Bleu actif)
    *   **Fichier** : [src/components/ui/SidebarItem.tsx](file:///home/zo-kely/Documents/Studies/ITU/Stage/ESPA/Mr-RADO/rapport-frontend/src/components/ui/SidebarItem.tsx)
    *   **Variable** : `isActive`
    *   **Explication** : Utilise `usePathname` pour une comparaison stricte. La couleur est puisée dans `APP_CONSTANTS.colors.mesupres`.

### 6. Changement de mot de passe (Profil)
*   **Action** : Accéder au changement de mot de passe
    *   **Fichier** : [src/components/ui/Navbar.tsx](file:///home/zo-kely/Documents/Studies/ITU/Stage/ESPA/Mr-RADO/rapport-frontend/src/components/ui/Navbar.tsx)
    *   **Composant** : `mon compte` (Dropdown)
    *   **Explication** : Le menu utilisateur est situé en haut à droite. Il contient le lien vers les paramètres de sécurité.

*   **Action** : Gérer l'API de changement de mot de passe
    *   **Fichier** : [src/features/profile/services/profileService.ts](file:///home/zo-kely/Documents/Studies/ITU/Stage/ESPA/Mr-RADO/rapport-frontend/src/features/profile/services/profileService.ts)
    *   **Méthode** : `updatePassword`
    *   **API Utilisée** : `/api/utilisateurs/changerMdp` (POST)
    *   **Explication** : Envoie le nouveau mot de passe au backend.
    *   **Gestion des erreurs** : Le frontend affiche le champ `message` renvoyé par l'API en cas d'erreur.

---

## �💅 Style & Design

*   **Tailwind CSS** : Nous n'utilisons pas de fichiers CSS séparés par composant. Tout est géré par les classes Tailwind.
*   **Aesthetics** : Nous privilégions le "Glassmorphism" (transparence), les bordures discrètes (`slate-100`) et le bleu institutionnel MESUPRES (`#003366`).
*   **Responsiveness** : Le dashboard est optimisé pour les écrans EliteBook (14-16 pouces) et les tablettes. Utilisez toujours les préfixes `md:`, `lg:` pour vos layouts.

---

> [!IMPORTANT]
> **Qualité de Code** : Toujours utiliser TypeScript. Ne jamais ignorer les erreurs de typage. Privatisez la logique dans des hooks pour garder les composants visuels "propres".
