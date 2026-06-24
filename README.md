# FormForge - Chrome Extension

FormForge is a Chrome Extension (Manifest V3) for intelligent form autofill with user profiles. Save time filling out job applications and forms with pre-configured profiles for different roles.

## Features

- **Multiple User Profiles**: Create profiles for AI Engineer, Software Engineer, Research, or Custom roles
- **Local Storage**: All data stored securely using Chrome Storage API
- **Master Password Protection**: Require password verification before autofilling sensitive fields
- **Form Detection**: Automatically detects common form fields (name, email, phone, LinkedIn, GitHub, skills, education)
- **Autofill**: One-click form population with selected profile
- **React + TypeScript**: Modern, type-safe UI components

## Project Structure

```
FormForge/
├── src/
│   ├── popup/                 # Popup UI (React)
│   │   ├── Popup.tsx
│   │   ├── index.tsx
│   │   ├── popup.html
│   │   ├── popup.css
│   │   └── components/
│   │       ├── ProfileList.tsx
│   │       ├── ProfileEditor.tsx
│   │       ├── MasterPasswordCheck.tsx
│   │       └── AutofillButton.tsx
│   ├── content/               # Content script
│   │   └── content.ts
│   ├── background/            # Background service worker
│   │   └── background.ts
│   ├── services/              # Business logic
│   │   ├── storageService.ts
│   │   ├── profileService.ts
│   │   ├── formDetectionService.ts
│   │   └── autofillService.ts
│   └── types/                 # TypeScript types
│       └── index.ts
├── public/
│   └── icons/                 # Extension icons
├── manifest.json              # Chrome Extension manifest
├── package.json
├── tsconfig.json
├── webpack.config.js
└── README.md
```

## Setup & Build

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
npm install
```

### Development Build

```bash
npm run dev
```

This watches for changes and rebuilds in development mode.

### Production Build

```bash
npm run build
```

### Type Checking

```bash
npm run type-check
```

## Loading the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (top right toggle)
3. Click **Load unpacked**
4. Select the `dist/` folder from this project
5. The FormForge extension should now appear in your extensions

## Usage

### Creating a Profile

1. Click the FormForge popup icon
2. Click **+ New** button
3. Fill in profile details:
   - Profile Name
   - Profile Type (AI, SWE, Research, Custom)
   - Personal info (name, email, phone, etc.)
   - Skills, education, experience
4. Click **Save Profile**

### Autofilling a Form

1. Navigate to a website with form fields
2. Click the FormForge popup
3. Select a profile
4. Click **Verify Password to Autofill**
5. Enter master password (default: "password")
6. Click **Autofill with [Profile Name]**
7. The extension will detect and fill matching form fields

### Managing Profiles

- **Edit**: Click the edit icon (✎) on any profile
- **Delete**: Click the delete icon (✕) on any profile
- **Select**: Click a profile to make it active

## Configuration

### Master Password

On first install, a default master password is set to `"password"`. To change it, you need to modify the `StorageService.ts`:

1. Edit the password hash in Chrome Storage directly, or
2. Implement a settings panel to change it (not included in MVP)

## Detected Form Fields

The extension automatically detects these fields:

- Full Name
- First Name
- Last Name
- Email
- Phone
- LinkedIn URL
- GitHub URL
- Skills
- Education
- Work Experience

Add more patterns in `formDetectionService.ts` to detect additional fields.

## Architecture

### Services

**StorageService**: Manages Chrome storage operations for profiles and master password

**ProfileService**: Creates, updates, and manages user profiles

**FormDetectionService**: Identifies form fields on web pages using pattern matching

**AutofillService**: Populates form fields with profile data

### Components

**Popup.tsx**: Main UI orchestrator

**ProfileList**: Displays and selects profiles

**ProfileEditor**: Creates and edits profiles

**MasterPasswordCheck**: Password verification before autofill

**AutofillButton**: Triggers the autofill action

## Security Considerations

- ⚠️ Master password uses simple hashing (MVP only - use bcrypt for production)
- ✓ Data stored locally using Chrome Storage API
- ✓ Password verification required before autofill
- ⚠️ No encryption of stored profiles (consider for production)

## Future Enhancements

- [ ] Cloud sync for profiles
- [ ] Settings page for master password management
- [ ] More form field detection patterns
- [ ] Profile templates and sharing
- [ ] Keyboard shortcuts
- [ ] Browser history for autofills
- [ ] Profile usage analytics
- [ ] Better password hashing with crypto-js

## Troubleshooting

### Extension not loading?
- Check `manifest.json` is valid JSON
- Ensure `dist/` folder exists with compiled files
- Reload the extension after rebuilding

### Autofill not working?
- Some websites may block content scripts
- Check if form fields have `name` or `id` attributes
- Add custom field patterns if needed

### Form fields not detected?
- Update patterns in `formDetectionService.ts`
- Check browser console for errors

## Development

### Add a new service
1. Create file in `src/services/`
2. Export class with static methods
3. Import and use in components/background

### Add a new component
1. Create file in `src/popup/components/`
2. Export React functional component
3. Import and use in `Popup.tsx`

## License

MIT

## Support

For issues or feature requests, please open an issue in the repository.
