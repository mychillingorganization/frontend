# Bugkathon - Dynamic SVG Certificate & Asset Generator

Bugkathon is a powerful, React-based web application designed for creating, managing, and bulk-generating digital certificates and graphic assets. This frontend module runs entirely in the browser using `localStorage` and `Konva.js`, allowing users to design templates, map dynamic variables, upload datasets, and generate `.zip` archives of PDFs.

---

## 🚀 Features

### 1. Advanced Template Editor (Canva-like Experience)
- **Interactive Canvas:** Built heavily on `react-konva`. Drag, drop, scale, and rotate design elements freely.
- **Rich Elements:** Add dynamic Text blocks, specific Shapes (Rectangles, Circles, Triangles, Stars, Lines), and upload custom local Images.
- **Design Configuration:** Edit precise parameters in real-time including X/Y coordinates, scale, Font Family, Font Size, Alignment, and Hex/RGBA Colors.
- **Dynamic Variables:** Inject placeholders like `{{name}}` or `{{role}}` directly into text layers. Any defined `{{variable}}` string will instantly become a mapped column during dataset generation!
- **Undo/Redo System:** Built-in history state management allows for completely reversible design actions.

### 2. Template Management
- **Persistent Storage:** Your custom templates are securely saved into your browser's local sandbox, persisting across sessions.
- **My Templates Library:** Browse your designs, duplicate existing layouts as starting points, or delete old ones.
- **Pre-loaded Designs:** Comes injected with 3 fully-functional, pre-made template examples out of the box.

### 3. Bulk Generation & Execution Workflows
- **Dual Data Sources:**
  - **Local CSV Upload:** Import a real `.csv` file directly into the browser.
  - **Google Sheets:** Paste a public Google Sheets link. The system dynamically converts the URL, fetches the live data, and parses it natively into the UI over HTTP.
- **Workflow Pipeline:** 
  - **Create PDF Archive:** Renders high-resolution PDFs using `jspdf` and packages them into a `.zip` archive using `jszip`.
  - **Google Drive Sync (Mock):** Simulates uploading the output payload seamlessly to a connected drive.
  - **Send Emails (Mock):** Select an extracted email column from your dataset drop-down, and watch the system simulate dispatching personalized certificates to all recipients!
- **Live Preview Dashboard:** As you map your variables to your Data Source, the exact look of your output updates instantly on a preview certificate canvas.
- **Batch Exporting Engine:** 
  - Iterates silently through your entire dataset using a hidden, off-screen Konva stage.
  - Normalizes international and Vietnamese character accents automatically for clean `[id]_[name].pdf` filenames.
  - Replaces all dynamic text layers with personalized data flawlessly!

### 4. Authentication Pipeline Mockup
- **Simulated OAuth:** The Login page features a mock Google Sign-in flow that visually replicates the authentic OAuth redirect, delays, and state provisioning.
- **Complete Mock Ecosystem:** `ProfilePage.js` is equipped with functional state controls to Delete Account or standard Sign-out, fully tied into a `useAuth` conceptual lifecycle.

---

## 🛠️ Tech Stack & Dependencies

- **Framework:** React.js (Create React App)
- **Routing:** `react-router-dom` v6
- **Canvas Rendering:** `konva`, `react-konva`, `use-image`
- **PDF & Export Engine:** `jspdf`, `jszip`, `file-saver`
- **Data Parsing:** `papaparse`
- **HTTP Client (Future Preparation):** `axios`

---

## 💻 Running the Application Locally

1. **Clone the repository** and navigate to the `frontend` folder.
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the Development Server:**
   ```bash
   npm start
   ```
4. **Access the App:** Open `http://localhost:3000` in your browser.

---

## 🗄️ Backend Integration Setup

Right now, this frontend acts as an independent prototype simulating authentication, sessions, and databases inside `localStorage`. 

**This frontend is pre-configured and ready to be hooked into a real backend.**
Inside `src/config/api.js`, you will find an intricate Axios configuration containing:
- JWT Authorization Header interceptors.
- Global 401 token-expiry interceptors.
- Pre-built Placeholder API export services (e.g., `TemplatesAPI.create()`).

**To integrate:**
1. Supply your backend server address into the `.env` file via `REACT_APP_API_URL`.
2. Swap the `localStorage` mocking loops inside `ProfilePage.js` and `CreatePage.js` with the corresponding `api.js` endpoint functions.

> For an in-depth checklist on migrating to a Node/Python backend, check the comments inside `src/config/api.js`.
