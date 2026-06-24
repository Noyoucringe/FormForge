# FormForge - File Reference

This document lists every file in the project with a brief description.

## 📋 Configuration & Build Files

| File | Purpose |
|------|---------|
| `manifest.json` | Chrome Extension Manifest V3 configuration |
| `package.json` | npm dependencies and build scripts |
| `tsconfig.json` | TypeScript compiler configuration |
| `webpack.config.js` | Webpack bundler configuration |
| `.gitignore` | Git ignore rules |

## 📚 Documentation Files (In Recommended Reading Order)

| File | Purpose | Audience |
|------|---------|----------|
| `START_HERE.md` | Overview and quick links | Everyone (start here!) |
| `QUICK_START.md` | 5-minute setup guide | First-time users |
| `README.md` | Complete project documentation | Everyone |
| `DEVELOPMENT.md` | Developer guide and best practices | Contributors |
| `ARCHITECTURE.md` | Design decisions and technical details | Advanced developers |
| `FILE_STRUCTURE.md` | Visual project organization | Navigating the code |
| `CHANGELOG.md` | Version history and roadmap | Project planning |
| `FILE_REFERENCE.md` | This file - all files listed | Navigation |

## 🚀 Build & Deploy Scripts

| File | Platform | Purpose |
|------|----------|---------|
| `build.sh` | macOS/Linux | One-command build script |
| `build.bat` | Windows | One-command build script |

## 🧪 Test Assets

| File | Purpose |
|------|---------|
| `test-form.html` | Local test form to verify autofill |

## 📦 Source Code - Core Types

| File | Purpose |
|------|---------|
| `src/types/index.ts` | TypeScript interfaces for entire project |

### Types Defined:
- `Profile` - User profile with metadata
- `ProfileData` - Actual user information
- `FormField` - Detected form field on page
- `Message` - Message protocol for communication
- `Education` - Education entry
- `WorkExperience` - Work experience entry

## 🔧 Services - Business Logic Layer

| File | Methods | Purpose |
|------|---------|---------|
| `src/services/storageService.ts` | getProfiles() saveProfile() deleteProfile() setMasterPassword() verifyMasterPassword() setActiveProfile() getActiveProfile() | Manages Chrome Storage API interactions |
| `src/services/profileService.ts` | createProfile() getDefaultProfiles() initializeDefaultProfiles() updateProfile() getProfile() getActiveProfileData() | Profile CRUD operations and defaults |
| `src/services/formDetectionService.ts` | detectFields() findFieldElement() getFieldType() | Detects form fields on web pages using regex |
| `src/services/autofillService.ts` | fillField() autofillForm() getValueForField() | Populates form fields with profile data |

## 🎨 UI - React Components & Styles

| File | Type | Purpose |
|------|------|---------|
| `src/popup/index.tsx` | Entry | React app entry point |
| `src/popup/Popup.tsx` | Component | Main orchestrator component |
| `src/popup/popup.html` | HTML | Popup HTML template |
| `src/popup/popup.css` | CSS | All popup styling (~500 lines) |
| `src/popup/components/ProfileList.tsx` | Component | Display and select profiles |
| `src/popup/components/ProfileEditor.tsx` | Component | Create/edit profile form |
| `src/popup/components/MasterPasswordCheck.tsx` | Component | Password verification modal |
| `src/popup/components/AutofillButton.tsx` | Component | Autofill trigger button |

### Component Hierarchy:
```
Popup (orchestrator)
├── ProfileList (displays profiles)
├── ProfileEditor (edit/create form)
├── MasterPasswordCheck (password modal)
└── AutofillButton (fill trigger)
```

## 🔌 Extension Scripts

| File | Context | Purpose |
|------|---------|---------|
| `src/content/content.ts` | Page | Listens for messages, detects/fills forms |
| `src/background/background.ts` | Extension | Initializes, routes messages, manages state |

## 📁 Assets

| File | Purpose |
|------|---------|
| `public/icons/README.md` | Instructions for creating extension icons |
| `public/icons/icon-16.png` | 16x16 extension icon (placeholder) |
| `public/icons/icon-48.png` | 48x48 extension icon (placeholder) |
| `public/icons/icon-128.png` | 128x128 extension icon (placeholder) |

## 📁 Generated (After Build)

After running `npm run build`, these are generated in `dist/`:

```
dist/
├── manifest.json
├── popup/
│   ├── popup.html
│   └── popup.js
├── content/
│   └── content.js
├── background/
│   └── background.js
├── icons/
│   ├── icon-16.png
│   ├── icon-48.png
│   └── icon-128.png
```

The `dist/` folder is what you load into Chrome.

## 📊 File Statistics

### By Type
- **TypeScript (.ts/.tsx)**: 13 files (~1,000 lines)
- **CSS (.css)**: 1 file (~500 lines)
- **HTML (.html)**: 2 files (~200 lines)
- **JSON (.json)**: 2 files (manifest, package)
- **Markdown (.md)**: 7 files (documentation)
- **Shell Scripts**: 2 files (build.sh, build.bat)

### By Category
- **Source Code**: 13 files
- **Documentation**: 7 files
- **Configuration**: 5 files
- **Build Scripts**: 2 files
- **Test Assets**: 1 file
- **Icons**: 3 files (+ README)

## 🗂️ How Files Connect

```
manifest.json (entry point)
    ↓
    ├─→ dist/popup/popup.js (webpack builds from src/popup/index.tsx)
    │   └─→ Popup.tsx (orchestrator)
    │       ├─→ ProfileList.tsx
    │       ├─→ ProfileEditor.tsx
    │       ├─→ MasterPasswordCheck.tsx
    │       └─→ AutofillButton.tsx
    │           └─→ formDetectionService.ts
    │
    ├─→ dist/content/content.js (webpack builds from src/content/content.ts)
    │   └─→ formDetectionService.ts
    │   └─→ autofillService.ts
    │
    └─→ dist/background/background.js (webpack builds from src/background/background.ts)
        └─→ All services (storage, profile, etc.)
```

## 🔍 Finding What You Need

### "I want to..."

| Task | Find File |
|------|-----------|
| Understand the project | README.md |
| Get it running quickly | QUICK_START.md |
| Add a form field type | formDetectionService.ts |
| Change UI colors | popup.css |
| Add profile field | ProfileEditor.tsx + types/index.ts |
| Change master password | storageService.ts |
| Add a React component | Create in src/popup/components/ |
| Add a service method | Edit appropriate service file |
| Debug an issue | DEVELOPMENT.md |
| Understand architecture | ARCHITECTURE.md |

## 📝 File Templates

### Adding a New Service

Create file: `src/services/newService.ts`

```typescript
export class NewService {
  static async methodName(): Promise<void> {
    // Implementation
  }
}
```

### Adding a New Component

Create file: `src/popup/components/NewComponent.tsx`

```typescript
import React from 'react';

interface Props {
  // Props here
}

const NewComponent: React.FC<Props> = ({ }) => {
  return <div>{/* JSX here */}</div>;
};

export default NewComponent;
```

## 🚀 Quick File Navigation

### To Modify User Interface
- Edit `src/popup/components/*.tsx` (React components)
- Edit `src/popup/popup.css` (styling)
- Edit `src/popup/Popup.tsx` (routing between views)

### To Modify Business Logic
- Edit `src/services/*.ts` (where most logic lives)
- Edit `src/types/index.ts` (add new interfaces)

### To Modify Form Detection
- Edit `src/services/formDetectionService.ts` (field patterns)
- Edit `src/services/autofillService.ts` (value mapping)

### To Modify Data Storage
- Edit `src/services/storageService.ts` (storage operations)
- Edit `src/background/background.ts` (message routing)

### To Modify Content Script
- Edit `src/content/content.ts` (page interaction)

## 📖 Documentation Cross-References

| If You Want To... | Read This | Also See |
|------------------|-----------|----------|
| Get started | START_HERE.md | QUICK_START.md |
| Understand project | README.md | ARCHITECTURE.md |
| Develop features | DEVELOPMENT.md | FILE_STRUCTURE.md |
| Debug issues | DEVELOPMENT.md | Architecture section in README |
| Plan changes | CHANGELOG.md | ARCHITECTURE.md |
| Find files | FILE_STRUCTURE.md | This file |
| See version history | CHANGELOG.md | README.md (Status section) |

---

**Total Files**: 35+ files (including generated)
**Total Size**: ~2,500 lines of code + 2,000 lines of documentation
**Build Output**: dist/ folder (~150 KB uncompressed)

Last Updated: 2024-01-XX
