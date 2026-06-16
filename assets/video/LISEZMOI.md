# Vidéo témoignage

Placez ici la vidéo du témoignage et nommez-la **exactement** :

```
temoignage-sourcils.mp4
```

C'est le nom attendu par la page (section « Avis & témoignages »).
Vous pouvez aussi changer le nom dans `index.html` (balise `<source src="...">`).

## Format recommandé (web)
- **Format** : MP4 (codec H.264 + audio AAC)
- **Résolution** : 720p (ou 1080p max)
- **Poids** : idéalement < 10 Mo (max ~25 Mo)
- **Vertical** (9:16) fonctionne très bien pour un témoignage filmé au téléphone.

## Réduire le poids de la vidéo

### Option 1 — En ligne (le plus simple)
Allez sur un compresseur gratuit (ex. *FreeConvert*, *Veed*, *CapCut*) et exportez en
720p, qualité « web/medium ».

### Option 2 — ffmpeg (ordinateur)
```bash
ffmpeg -i original.mp4 -vf "scale=-2:1280" -c:v libx264 -crf 28 \
  -preset slow -c:a aac -b:a 96k -movflags +faststart temoignage-sourcils.mp4
```
- `-crf 28` : plus le chiffre est haut, plus le fichier est léger (23–30 = bon compromis).
- `scale=-2:1280` : limite la hauteur à 1280px (vidéo verticale).
- `+faststart` : permet la lecture immédiate sur le web.

### Option 3 — HandBrake (logiciel gratuit, interface simple)
Preset « Fast 720p30 », format MP4, puis exporter.

## Poster (image de couverture)
Par défaut, la page affiche `assets/img/brows-after.jpg` avant la lecture.
Pour utiliser une autre image, modifiez l'attribut `poster="..."` dans `index.html`.
