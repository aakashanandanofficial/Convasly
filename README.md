# Canvasly Background Studio

A small, self-contained Canva-inspired photo and background editor. It uses plain HTML, CSS, and JavaScript on the front end and a small Node.js server for local project saving. There are no package dependencies.

## Run it

1. Install Node.js 18 or later if it is not already installed.
2. Open this folder in Visual Studio Code.
3. Open the VS Code terminal in this folder and run `npm start`.
4. Visit <http://127.0.0.1:4173> in your browser.

You can also open `index.html` directly. Image, text, layout and export features work that way; server-backed project saving is available when started with `npm start`.

## Publish with Firebase Hosting

The included `firebase.json` publishes the editor front end and excludes the local Node server and saved project data. From this folder, create a Firebase project and run:

```sh
firebase login
firebase use --add
firebase deploy --only hosting
```

The hosted editor saves designs in each visitor's browser. To sync projects across devices or users, connect a cloud database such as Cloud Firestore and update the project API; Firebase Hosting does not run the local `server.js` file.

## What's included

- A Canva-inspired top toolbar, left tool rail, editing drawer, center canvas and contextual inspector.
- 670 original editable background template combinations (67 themes × 10 color palettes) across computer, flower, space, holiday, abstract, birthday, pattern, motivational, texture, minimal, nature and gradient themes. Browse in-app with search, category filters, sorting, and an “Edit this template” hover action.
- Background colors, gradients and grain, dot, line and grid textures.
- Image upload, image fit, brightness, contrast, saturation, blur, quick filters and canvas crop ratios.
- Editable text, font family, size, color, alignment, spacing, weight and shadow.
- Shapes, stickers, six text styles, 22 font choices, undo/redo, zoom and PNG/JPG export.
- Automatic browser saving, a local project library, and project deletion. Projects are stored in `data/projects.json` after the server is run.

The included template combinations are original to this app. Adobe Express artwork is not copied into this reusable template library.

This is a local starter app, not an online multi-user service. Uploaded photos are resized for project storage and saved with the design.
