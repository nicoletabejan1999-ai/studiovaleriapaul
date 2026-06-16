# Studio Valeria Paul — Landing Page

Landing page premium, interactive et orientée conversion pour un studio de
**maquillage permanent** (sourcils, eyeliner, lèvres), en **français**, pensée
pour une clientèle locale en France.

## ✨ Caractéristiques

- **Design luxe & féminin** — palette ivoire, nude, beige, rose pâle, accents or.
- **Mobile-first** et responsive.
- **Interactif & dynamique** :
  - Comparateur **Avant / Après** glissable (souris, tactile, clavier) avec onglets par prestation.
  - Animations de révélation au défilement (IntersectionObserver).
  - Compteurs animés (statistiques de confiance).
  - Carrousel de témoignages auto-rotatif.
  - FAQ en accordéon.
  - Barre de progression de lecture + navigation collante + bouton d'action fixe sur mobile.
- **Conversion** : un seul CTA principal (« Réserver ma consultation ») répété, formulaire court (nom, téléphone, prestation, message) avec validation.
- **Accessibilité** : navigation clavier, `prefers-reduced-motion`, contrastes soignés.
- **Zéro dépendance / build** : HTML + CSS + JS purs.

## 📁 Structure

```
.
├── index.html            # Toutes les sections de la page
├── assets/
│   ├── css/styles.css    # Styles & charte graphique (variables CSS)
│   ├── js/main.js        # Interactions
│   └── img/              # Photographies
└── README.md
```

## 🖼️ Remplacer les photos

Les visuels sont pilotés par des **variables CSS** en haut de `assets/css/styles.css`
(bloc `:root`). Deux photos d'exemple sont déjà intégrées (`hero-portrait.png`,
`lips.png`). Les autres emplacements affichent un dégradé élégant tant qu'aucune
photo n'est fournie.

Pour ajouter vos vraies photos :

1. Déposez vos images dans `assets/img/` (idéalement `.webp` ou `.jpg` optimisés).
2. Dé-commentez / mettez à jour les variables correspondantes :

```css
--hero-img:  url("../img/hero-portrait.png");  /* portrait héro */
--brows-img: url("../img/brows.png");          /* prestation sourcils + avant/après */
--liner-img: url("../img/eyeliner.png");       /* prestation eyeliner */
--lips-img:  url("../img/lips.png");           /* prestation lèvres */
--about-img: url("../img/studio.png");         /* portrait / studio */
```

Pour le comparateur Avant/Après, vous pouvez aussi définir les versions « avant » :
`--brows-before`, `--liner-before`, `--lips-before` (mêmes cadrages que les « après »).

## 🔌 Brancher le formulaire

Le formulaire affiche actuellement une confirmation de démonstration (aucun
back-end). Dans `assets/js/main.js`, section *Formulaire de réservation*,
remplacez la logique par un envoi vers votre outil (Calendly, Planity, e-mail,
API, etc.).

## 🚀 Lancer en local

Ouvrez simplement `index.html`, ou servez le dossier :

```bash
python3 -m http.server 8000
# puis ouvrez http://localhost:8000
```

## 📝 À personnaliser

- Coordonnées (e-mail, téléphone, adresse) dans le pied de page d'`index.html`.
- Tarifs « dès … € » et durées dans la section *Prestations*.
- Témoignages, statistiques et certifications avec vos données réelles.
