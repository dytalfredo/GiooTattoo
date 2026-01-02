<div align="center">
  <h1 align="center">Ink & Shadow | GIO Portafolio</h1>
  <p align="center">
    <strong>Portafolio Inmersivo de Tatuajes - Blackwork & Realismo Oscuro</strong>
  </p>
  <p align="center">
    Una experiencia web minimalista y atmosférica diseñada para exhibir arte corporal de alta gama.
  </p>
</div>

## 🌑 Sobre el Proyecto

**Ink & Shadow** es más que un portafolio web; es una extensión digital de la identidad artística de GIO. Este proyecto busca capturar la esencia del tatuaje *Blackwork* y el *Realismo Oscuro* a través de una interfaz inmersiva, elegante y moderna. 

La aplicación destaca por su estética cuidada, atención al detalle y una experiencia de usuario fluida que invita a la contemplación.

### ✨ Características Principales

- **Diseño Atmosférico**: Estética "Ink & Shadow" con modos Claro/Oscuro dinámicos.
- **Experiencia Sonora**: Pista de ambiente integrada con controles de reproducción para una inmersión total.
- **Wizard de Consultas**: Sistema interactivo para agendar citas y consultas.
- **Inteligencia Artificial**: Integración de **Google Gemini API** (`@google/genai`) para potenciar la interacción.
- **Animaciones Suaves**: Efectos de humo (`SmokeEffect`), scroll revelators y transiciones fluidas.
- **Tipografía Premium**: Uso de fuentes 'Syncopate' e 'Inter' para una jerarquía visual impactante.
- **Optimización**: Construido sobre Vite para tiempos de carga instantáneos.

---

## 🛠️ Stack Tecnológico

Este proyecto utiliza tecnologías web modernas para asegurar rendimiento y mantenibilidad:

- **Core**: [React 19](https://react.dev/)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Estilos**: 
  - [Tailwind CSS](https://tailwindcss.com/) (CDN integration)
  - Variables CSS nativas para theming dinámico (Dark/Light Mode)
- **AI Integration**: [Google Gemini SDK](https://ai.google.dev/) (`@google/genai`)
- **Fuentes**: Google Fonts (Inter, Syncopate)

---

## 🚀 Instalación y Ejecución

Sigue estos pasos para ejecutar el proyecto localmente:

### Prerrequisitos
- Node.js (versión LTS recomendada)

### Pasos

1.  **Clonar el repositorio o descargar el código.**

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno:**
    Crea un archivo `.env.local` en la raíz del proyecto y añade tu API Key de Gemini:
    ```env
    GEMINI_API_KEY=tu_api_key_aqui
    ```

4.  **Ejecutar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

5.  **Abrir en el navegador:**
    Visita `http://localhost:3000` (o el puerto que indique la terminal).

---

## 📂 Estructura del Proyecto

```
/
├── components/         # Componentes React (Hero, Gallery, Wizard, etc.)
├── services/           # Lógica de servicios y API (Gemini, etc.)
├── App.tsx             # Componente raíz y orquestador de lógica principal
├── index.html          # HTML base con integración de Tailwind CDN y fuentes
├── index.css           # Estilos globales y reset
└── vite.config.ts      # Configuración de Vite
```

---

<div align="center">
  <p>&copy; 2026 GIO ARCHIVO DE TATUAJES. Todos los derechos reservados.</p>
</div>
