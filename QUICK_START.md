# FormForge Quick Start Guide

Get FormForge up and running in 5 minutes!

## Prerequisites

- Node.js 16 or higher
- npm (comes with Node.js)
- Google Chrome browser

## Step 1: Install Dependencies

```bash
npm install
```

Expected output: Should complete without errors.

## Step 2: Build the Extension

**On macOS/Linux:**
```bash
./build.sh
```

**On Windows:**
```bash
build.bat
```

**Or manually:**
```bash
npm run build
```

This creates a `dist/` folder with all compiled files.

## Step 3: Load Into Chrome

1. **Open Chrome** and navigate to `chrome://extensions/`
2. **Enable Developer Mode** - Toggle switch in the top-right corner
3. **Click "Load unpacked"** - Button in the top-left
4. **Select the `dist/` folder** from this project
5. **Done!** FormForge icon appears in your extensions

## Step 4: Test It Out

### Create Your First Profile

1. Click the **FormForge icon** (appears in Chrome toolbar)
2. Click **+ New** button
3. Fill in:
   - **Profile Name**: "My Profile"
   - **Type**: "Custom" (or choose another)
   - **Full Name**: Your name
   - **Email**: Your email
   - **Skills**: JavaScript, React, TypeScript
4. Click **Save Profile**

### Autofill a Test Form

1. Go to any website with a form (try [form.fillout.com](https://form.fillout.com) for testing)
2. Click the **FormForge icon**
3. Your profile should be selected (highlighted)
4. Click **"Verify Password to Autofill"**
5. Enter password: **`password`** (default master password)
6. Click **"Autofill with My Profile"**
7. Watch the form fields populate! ✨

## Development Mode (Hot Reload)

Want to make changes and see them live?

```bash
npm run dev
```

This runs webpack in watch mode. Every time you save a file:
1. Files are rebuilt automatically
2. Go to chrome://extensions
3. Click the refresh icon on FormForge
4. Changes appear instantly!

## Project Structure

```
FormForge/
├── src/
│   ├── popup/         ← UI components (React)
│   ├── services/      ← Business logic
│   ├── content/       ← Page script
│   ├── background/    ← Service worker
│   └── types/         ← Type definitions
├── dist/              ← Built extension (load this in Chrome)
├── manifest.json      ← Extension config
├── package.json       ← Dependencies
└── webpack.config.js  ← Build config
```

## Default Settings

| Setting | Default Value |
|---------|---------------|
| Master Password | `password` |
| Default Profiles | AI, SWE, Research |
| Storage | Chrome Local Storage |

## Keyboard Shortcuts

- Coming in future versions

## Troubleshooting

### "Extension not showing up?"
- Ensure `dist/` folder exists
- Check Step 3 again
- Try reloading chrome://extensions

### "Fields not filling?"
- Check that form has proper field names
- Some websites may block content scripts
- Try test form first

### "Password doesn't work?"
- Default is exactly: `password`
- Case-sensitive
- See [DEVELOPMENT.md](./DEVELOPMENT.md) to change it

### "Extension crashes?"
- Open chrome://extensions
- Click Details on FormForge
- Look for error messages
- Check browser console (F12)

## Next: Customize Your Extension

See [DEVELOPMENT.md](./DEVELOPMENT.md) for:
- Adding new form fields
- Changing master password
- Debugging tips
- Architecture details

## Quick Commands Reference

```bash
npm install       # Install dependencies
npm run build     # Build for production
npm run dev       # Build for development (watch mode)
npm run type-check # Check TypeScript types
```

## What's Included (MVP)

✅ Create multiple profiles
✅ Edit and delete profiles
✅ Form field detection
✅ One-click autofill
✅ Master password protection
✅ Local storage (Chrome Storage API)
✅ React + TypeScript architecture
✅ Responsive UI

## Not Included (Future Versions)

- Cloud sync
- Import/export
- Settings page
- Advanced field matching
- Browser history

## Support

- Check [README.md](./README.md) for full documentation
- See [DEVELOPMENT.md](./DEVELOPMENT.md) for technical details
- Open the browser console (F12) for error messages

## Tips for Best Results

1. **Profile Names**: Use clear names like "LinkedIn Applications"
2. **Field Names**: Most sites use standard field names (your profile will auto-detect)
3. **Multiple Profiles**: Create different profiles for different job types
4. **Password Security**: Change master password (see DEVELOPMENT.md)
5. **Test First**: Try on non-critical forms first

## Feedback & Issues

Found a bug? Have suggestions? Let us know!

---

**Happy Autofilling! 🚀**
