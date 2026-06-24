# FormForge Development Guide

## Quick Start

```bash
# Install dependencies
npm install

# Start development build with watch mode
npm run dev

# In another terminal, load the extension
# 1. Open chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select the dist/ folder
```

## File Organization

### `src/types/index.ts`
TypeScript interfaces for type safety:
- `Profile`: User profile with metadata and form data
- `ProfileData`: Actual user information (name, email, etc.)
- `FormField`: Detected form field with type and value
- `Message`: Communication protocol between scripts

### `src/services/`
Business logic layer - completely independent from UI:

**storageService.ts**
- `getProfiles()`: Fetch all profiles
- `saveProfile()`: Create or update a profile
- `deleteProfile()`: Remove a profile
- `verifyMasterPassword()`: Check password
- `setActiveProfile()`: Remember which profile to use

**profileService.ts**
- `createProfile()`: Create new profile object
- `getDefaultProfiles()`: Initialize with default profiles
- `getProfile()`: Get profile by ID
- `updateProfile()`: Update specific profile

**formDetectionService.ts**
- `detectFields()`: Scan page for form fields
- `findFieldElement()`: Locate element by ID or name
- Regex patterns for common field names

**autofillService.ts**
- `fillField()`: Set value and trigger change events
- `autofillForm()`: Populate multiple fields from profile

### `src/content/`
**content.ts** - Content script runs in page context:
- Listens for messages from popup/background
- Handles `DETECT_FIELDS` to scan forms
- Handles `AUTOFILL_FORM` to fill detected fields
- Safely isolated from page scripts

### `src/background/`
**background.ts** - Service worker runs in extension context:
- Initializes default profiles on install
- Routes messages from popup to storage
- Handles user authentication
- Manages active profile selection

### `src/popup/`
React UI for extension popup:

**Popup.tsx** - Main orchestrator component
- State management for profiles and views
- Routes between: profiles, editor, password check
- Communicates with background service worker

**components/ProfileList.tsx**
- Display all profiles
- Select active profile
- Edit/delete buttons
- Create new button

**components/ProfileEditor.tsx**
- Form to create/edit profiles
- Input fields for all profile data
- Save and cancel actions

**components/MasterPasswordCheck.tsx**
- Password verification before autofill
- Error handling and user feedback

**components/AutofillButton.tsx**
- Detects fields in active tab
- Autofills form with selected profile
- Shows status messages

## Message Protocol

Communication between components uses Chrome's messaging API:

```typescript
// From popup to background
chrome.runtime.sendMessage({
  type: 'GET_PROFILES' | 'SAVE_PROFILE' | 'DELETE_PROFILE' | 'VERIFY_MASTER_PASSWORD',
  payload: any
})

// From popup to content script
chrome.tabs.sendMessage(tabId, {
  type: 'DETECT_FIELDS' | 'AUTOFILL_FORM',
  payload: any
})
```

## Adding Features

### Add a new form field type

1. Add pattern to `formDetectionService.ts`:
```typescript
static fieldPatterns = {
  // ... existing patterns
  certifications: /certifications|licenses/i,
};
```

2. Add case to `getValueForField()` in `autofillService.ts`:
```typescript
case 'certifications':
  return data.certifications?.join(', ') || '';
```

3. Add to `ProfileData` interface in `types/index.ts`:
```typescript
interface ProfileData {
  // ... existing fields
  certifications?: string[];
}
```

4. Add input field to `ProfileEditor.tsx`:
```typescript
<div className="form-group">
  <label>Certifications</label>
  <textarea
    name="certifications"
    value={formData.data.certifications?.join(', ') || ''}
    onChange={(e) => {
      // handle update
    }}
  />
</div>
```

### Add a new profile type

1. Update `Profile` type in `types/index.ts`:
```typescript
type: 'AI' | 'SWE' | 'Research' | 'Custom' | 'NewType'
```

2. Add default profile in `profileService.ts`:
```typescript
{
  id: this.generateId(),
  name: 'New Type',
  type: 'NewType',
  data: { /* ... */ },
  // ...
}
```

3. Update ProfileEditor select options

## Testing Workflow

1. **Make a change** to service or component
2. **Run `npm run dev`** - watch mode rebuilds
3. **Reload extension** in chrome://extensions
4. **Test in popup** - check UI works
5. **Test on form page** - verify autofill works

## Debug Tips

### View background service worker logs
1. Go to chrome://extensions
2. Click "Details" on FormForge
3. Scroll to "Inspect views" → "service worker"

### View content script logs
1. Open DevTools on any page (F12)
2. Console tab shows content script messages

### View popup logs
1. Open popup
2. Right-click → Inspect → console

### Check stored data
1. DevTools → Application → Local Storage
2. Filter by extension ID
3. View `formforge_profiles` key

## Common Issues

**"Cannot find FormForge"**
- Make sure `dist/` folder exists
- Run `npm run build` first

**Form fields not filling**
- Check field name/id/placeholder matches patterns
- Look for errors in content script console
- Add custom pattern if needed

**Password always wrong**
- Default is "password" (case-sensitive)
- Check hash function in storageService.ts

**Extension crashes on load**
- Check manifest.json syntax
- Ensure all imports are correct
- Look at service worker console

## Performance Notes

- Form detection uses simple regex (not slow)
- Storage operations are async (non-blocking)
- Content scripts run in isolated context
- No memory leaks (cleanup on unload)

## Next Steps for Production

- [ ] Replace simple password hashing with crypto-js or similar
- [ ] Add encryption for stored profiles
- [ ] Implement settings page
- [ ] Add error boundaries in React
- [ ] Write unit tests
- [ ] Set up CI/CD
- [ ] Add analytics
- [ ] Consider cloud sync
