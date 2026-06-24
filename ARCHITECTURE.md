# FormForge Architecture & Decisions

## Design Principles

### 1. Separation of Concerns
- **Presentation Layer**: React components in `src/popup/`
- **Business Logic Layer**: Services in `src/services/`
- **Communication Layer**: Message handlers in `src/background/` and `src/content/`
- **Data Layer**: Chrome Storage API abstraction

### 2. Type Safety
- Strict TypeScript mode enabled
- All interfaces defined in `src/types/index.ts`
- No implicit `any` types
- End-to-end type checking

### 3. Modularity
- Each service handles one responsibility
- Easy to test and extend
- Clear dependencies
- No circular imports

## Architecture Decisions

### Why Services Layer?
- Decouples UI from business logic
- Can be reused in background worker
- Easy to unit test
- No framework dependencies

### Why React for Popup?
- Small, focused component structure
- Hooks for state management
- Easy to maintain and extend
- Functional components only (no class components)

### Why Message-Based Communication?
- Chrome Extension isolation requirement
- Popup can't directly access content scripts
- Content scripts can't access popup DOM
- Async message handling for all operations

### Why Webpack?
- Handles TypeScript compilation
- Bundles React and dependencies
- Separates entry points (popup, content, background)
- Dev mode with watch and hot rebuild

## Security Considerations

### Current Implementation (MVP)
- Master password stored with simple hash
- Profiles stored in plain text in Chrome Storage
- No encryption of stored data
- No HTTPS requirement (all local)

### Future Improvements Needed
- Replace simple hash with crypto-js or bcrypt
- Encrypt profile data at rest
- Add encryption key management
- Consider key derivation functions (KDF)
- Add security headers review

## Performance Characteristics

### Form Detection
- O(n) where n = number of form fields on page
- Uses regex patterns (fast)
- No network calls
- Runs in content script context

### Autofill
- O(m) where m = number of detected fields to fill
- Direct DOM manipulation
- Event triggering for form validation
- No re-renders on page

### Storage
- Async operations (non-blocking)
- Chrome Storage synced across tabs
- No size limits exceeded for MVP

## Extension Permissions

### Requested
- `storage`: Read/write Chrome local storage
- `activeTab`: Access current tab ID
- `scripting`: Inject content scripts
- `<all_urls>`: Access all websites

### Rationale
- `storage`: Store profiles locally
- `activeTab`: Detect forms on current page
- `scripting`: Inject form detection
- `<all_urls>`: Works on all job application sites

## Scalability Notes

### Current Limits (MVP)
- Max 50 profiles before performance degrades
- Max 100 form fields per page
- Field detection regex patterns are extensible

### Future Improvements
- Lazy load profiles
- Paginate profile list
- Cache field detection results
- Implement profile search/filter

## Testing Strategy

### Manual Testing
1. Create profiles with different types
2. Visit test-form.html
3. Test autofill with each profile
4. Verify master password blocking
5. Test profile edit/delete

### What to Test
- [ ] Profile creation
- [ ] Profile editing
- [ ] Profile deletion
- [ ] Master password verification
- [ ] Form field detection
- [ ] Autofill functionality
- [ ] Multiple profiles switching
- [ ] Extension persistence (reload)

### Automated Testing (Future)
- Jest for service unit tests
- React Testing Library for components
- E2E tests with Playwright

## Code Style & Standards

### TypeScript
- Strict mode enabled
- No implicit any
- Interfaces over types
- Explicit return types on functions

### React
- Functional components only
- Hooks for all state management
- Props destructuring
- CSS Modules or scoped CSS

### Naming Conventions
- Services: PascalCase + Service suffix
- Components: PascalCase
- Variables/functions: camelCase
- Constants: UPPER_SNAKE_CASE
- Interfaces: PascalCase + optional I prefix

## Debugging

### View Logs
1. **Popup**: Right-click popup → Inspect
2. **Content**: DevTools on any page (F12)
3. **Background**: chrome://extensions → Details → Inspect views

### Common Issues
- Content script can't find elements: Check selectors
- Message not received: Check sender/receiver
- Storage not syncing: Check Storage tab in DevTools

## Git & Version Control

### Commit Strategy
- Feature branches for new functionality
- Semantic versioning (MAJOR.MINOR.PATCH)
- Changelog updated with each release

### Sensitive Data
- .gitignore includes node_modules, dist
- No .env files committed
- Manifest.json safe to commit

## Deployment Checklist

Before releasing to Chrome Web Store:
- [ ] Update version in manifest.json
- [ ] Update CHANGELOG.md
- [ ] Run type-check: npm run type-check
- [ ] Production build: npm run build
- [ ] Test in clean Chrome profile
- [ ] Create extension ZIP
- [ ] Test on 3+ websites
- [ ] Update README with version

## Future Roadmap

### Phase 1 (Current - MVP)
- ✅ Basic profile management
- ✅ Form autofill
- ✅ Master password

### Phase 2 (Enhancement)
- [ ] Cloud sync
- [ ] Profile templates
- [ ] Custom field matching
- [ ] Settings page

### Phase 3 (Advanced)
- [ ] AI field detection
- [ ] Form field extraction
- [ ] Profile sharing
- [ ] Analytics

## References & Resources

- Manifest V3 Docs: https://developer.chrome.com/docs/extensions/mv3/
- React Docs: https://react.dev
- TypeScript Docs: https://www.typescriptlang.org/docs/
- Webpack Docs: https://webpack.js.org
