# SpaceHarmonize — AI Room Organization & Decluttering Coach

SpaceHarmonize is an intelligent full-stack spatial organization planner designed to transform cluttered, overwhelming spaces into serene, functional, and balanced environments. By uploading photos of any room (living rooms, bedrooms, closets, offices, kitchens, and more), users receive customized organizational scoring, fast-action "quick wins," detailed step-by-step action plans, curated storage product advice, and interior layout optimizations.

Integrated with a contextual coaching companion, **Aura**, users can converse in real-time about their scanned rooms, gain motivational coaching, discuss step-by-step solutions, and discover storage tools on a budget.

---

## ✨ Features & Functionality

### 1. Scene Analysis & Harmony Scoring
* **Clutter Assessment**: Uses computer vision to analyze room images, evaluating clutter density, cable organization, and floor space usage.
* **Harmony Score**: Renders an intuitive organization rating (from 1 to 10) representing the current spatial state.
* **Empathetic Observations**: Delivers a warm, compassionate evaluation of the room, detailing what works well and what creates sensory overload.

### 2. Tailored Cleanliness Checklists (Bento-Style)
* **Quick Wins (5-10 Mins)**: Low-friction tasks (like gathering loose cables, sorting mail, or clearing flat surfaces) designed to build immediate momentum.
* **Sequential Action Plan**: A 5-step, comprehensive decluttering recipe going from initial sorting to deep organizing and final aesthetic styling.
* **Real-Time Progress Gauge**: Interactive checklists allow users to mark tasks as completed, instantly updating the space's organization progress percentage.

### 3. Spatial & Storage Recommendations
* **Curated Storage Solutions**: Generates customized product suggestions (e.g. woven storage cubes, vertical shelving systems, or labeled bins) tailored directly to the room's clutter profile.
* **Spatial Layout Optimizations**: Expert structural recommendations for furniture placement, traffic flow, lighting, and geometric orientation to maximize the room's apparent size.

### 4. Interactive Coaching (Coach Aura)
* **Grounded Chat**: Our virtual organization companion is automatically synced to the context of your scanned space. You can ask her to elaborate on specific steps, recommend budget solutions, or guide you through emotional attachment hurdles.
* **Interactive Suggestion Chips**: Quick-click starters to instantly discuss folding methods, closet organization principles, or small-space storage tricks.

---

## 🛠️ Technology Stack

* **Frontend**:
  * **React 19 & TypeScript**: Safe, modular, state-driven interfaces.
  * **Tailwind CSS**: High-fidelity utility classes coupled with customized Inter and Space Grotesk display fonts.
  * **Motion**: Fluid animations for checklist toggles, loading views, and smooth screen transitions.
  * **Lucide Icons**: Crisp, uniform vector illustration assets.
* **Backend**:
  * **Express & Node.js**: Clean server routes handling high-volume base64 uploads and serving built frontend bundles.
  * **Modern Gemini SDK**: Integrates the state-of-the-art `@google/genai` TypeScript SDK for lightning-fast inference.
  * **Esbuild & CJS Bundling**: Out-of-the-box support for compiling TypeScript files into standalone CommonJS modules (`dist/server.cjs`), eliminating Node's native relative path import errors in container hosting environments.

---

## 🚀 How to Run locally

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **npm** or another modern package manager
* **Gemini API Key**: Retrieve an API key from your credentials dashboard.

### 1. Set Up Environment Variables
Create a `.env` file in the project's root folder (or duplicate `.env.example`):
```env
GEMINI_API_KEY="your_api_key_here"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```
The server will boot up, and the live application will be served at `http://localhost:3000`.

### 4. Build and Run in Production
```bash
# Build the React app and compile server.ts to CommonJS CJS
npm run build

# Start the compiled self-contained server
npm run start
```

---

## 📐 Project Structure

```text
SpaceHarmonize/
├── src/
│   ├── components/
│   │   ├── Header.tsx           # Sticky top navigation bar and tabs
│   │   ├── Dashboard.tsx        # Saved spaces, stats trackers, progress cards, and hero
│   │   ├── RoomAnalyzer.tsx     # Custom drag-drop photo uploader, challenge checklist, and style configs
│   │   ├── AnalysisResults.tsx  # Dynamic interactive checklists, storage solutions, layout advice
│   │   └── ChatCoach.tsx        # Contextual conversation coach with Aura and starter prompt suggestions
│   ├── types.ts                 # Shared structural TypeScript contracts & enums
│   ├── App.tsx                  # Core state manager, tab routers, and client-side local storage engines
│   ├── index.css                # Global styling entries (Inter & Space Grotesk font injections)
│   └── main.tsx                 # App mount point
├── server.ts                    # Backend endpoints for Gemini image vision and supportive conversation chats
├── package.json                 # Core script definitions & dependency declarations
└── README.md                    # Project documentation
```

---

## 🛡️ Best Practices & Quality Measures
* **Offline-First Resilience**: All scanned spaces, interactive checklists, and conversation records are stored locally in the browser's `localStorage` to guard against unexpected connection losses or browser refreshes.
* **Surgical Size Handling**: Designed to safely compress and handle large, high-resolution modern camera uploads (up to 15MB) using scalable Express payload thresholds.
* **Modular Cleanliness**: Components are strictly isolated with dedicated types, ensuring high readability, ease of expansion, and robust execution in any target browser view.
