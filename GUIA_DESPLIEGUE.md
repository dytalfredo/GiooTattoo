# 🚀 Guía de Despliegue en Firebase Hosting

Esta guía te llevará paso a paso para desplegar tu portafolio "Ink & Shadow" en Firebase con soporte para Analytics.

## 1. Preparación del Proyecto (¡Ya realizado!)
He configurado automáticamente los siguientes archivos en tu proyecto:
- `firebase.json`: Configuración de hosting optimizada para Vite (SPA).
- `src/services/firebaseConfig.ts`: Archivo de conexión con Firebase.
- Instalación de la librería `firebase`.

## 2. Crear Proyecto en Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/).
2. Haz clic en **"Agregar proyecto"**.
3. Ponle un nombre (ej. `gio-portfolio`).
4. **Habilita Google Analytics** cuando te lo pida (esto es importante para lo que pediste).
5. Selecciona o crea una cuenta de Google Analytics y finaliza.

## 3. Obtener Credenciales
Una vez creado el proyecto:
1. En el panel izquierdo, haz clic en el engranaje ⚙️ > **Configuración del proyecto**.
2. Baja hasta **"Tus apps"** y haz clic en el icono web (`</>`).
3. Registra la app (ponle un apodo, ej. "Web").
4. **IMPORTANTE**: Copia los valores que aparecen en `const firebaseConfig = { ... }`.
5. Abre el archivo `src/services/firebaseConfig.ts` en tu editor y reemplaza los marcadores (ej. `TU_API_KEY`) con tus valores reales.
   - *O mejor aún*: Crea un archivo `.env.local` y ponlos ahí (es más seguro):
     ```env
     VITE_FIREBASE_API_KEY=tu_api_key_copiada
     VITE_FIREBASE_PROJECT_ID=tu_project_id
     ...etc
     ```

## 4. Instalación de Herramientas (En tu terminal)
Necesitas las herramientas de Firebase (si no las tienes):

```bash
npm install -g firebase-tools
```

## 5. Login e Inicialización
En la terminal de tu proyecto:

1. **Inicia sesión**:
   ```bash
   firebase login
   ```
2. **Inicializa el proyecto**:
   ```bash
   firebase init hosting
   ```
   - Te preguntará: *Are you ready to proceed?* -> **Y**
   - *Please select an option*: -> **Use an existing project** (Selecciona el proyecto que creaste en el paso 2).
   - *What do you want to use as your public directory?* -> Escribe **dist** (¡Importante!).
   - *Configure as a single-page app (rewrite all urls to /index.html)?* -> **Yes (y)**.
   - *Set up automatic builds and deploys with GitHub?* -> **No (n)** (por ahora).
   - *File dist/index.html already exists. Overwrite?* -> **No (n)** (Si pregunta).

## 6. Despliegue (Deploy)
Cada vez que quieras subir cambios, ejecuta estos dos comandos:

1. **Construir la versión final**:
   ```bash
   npm run build
   ```
2. **Subir a Firebase**:
   ```bash
   firebase deploy
   ```

¡Listo! Firebase te dará una URL (ej. `https://gio-portfolio.web.app`) donde tu web estará online.
