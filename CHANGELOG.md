# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-XX

### Added
- Initial MVP release of FormForge
- Manifest V3 Chrome extension architecture
- Multiple user profiles (AI, SWE, Research, Custom types)
- Profile creation, editing, and deletion
- Chrome Storage API for local persistence
- Master password protection for autofill
- Form field detection with 10+ common patterns
- One-click autofill functionality
- React + TypeScript popup UI
- Responsive design with CSS styling
- Background service worker for message handling
- Content script for page manipulation
- TypeScript types for type safety
- Modular service architecture
- Comprehensive documentation
- Development build with watch mode
- Production build optimization

### Features
- Profile Management
  - Create new profiles
  - Edit existing profiles
  - Delete profiles
  - Select active profile
  - 3 default profile templates

- Form Detection
  - Detects: name, email, phone, LinkedIn, GitHub, skills, education
  - Pattern-based field matching
  - ID and name attribute support
  - Placeholder text recognition

- Autofill
  - One-click form population
  - Master password verification required
  - Proper event triggering for form validation
  - Support for text inputs and textareas

- UI
  - Clean, intuitive popup interface
  - Profile list with quick selection
  - Profile editor with form validation
  - Password verification modal
  - Status messages and feedback
  - Responsive design

- Storage
  - Local Chrome storage
  - Profile persistence
  - Active profile tracking
  - Master password hashing (basic)

### Architecture
- Services layer for business logic
- Components layer for UI
- Message-based communication
- Isolated contexts (popup, content, background)
- TypeScript for type safety
- Modular, extensible design

### Documentation
- README.md - Full project documentation
- QUICK_START.md - 5-minute setup guide
- DEVELOPMENT.md - Development guide
- CHANGELOG.md - This file

## Future Versions

### [1.1.0] - Planned
- [ ] Settings page for master password management
- [ ] Import/export profiles
- [ ] Cloud sync support
- [ ] Keyboard shortcuts
- [ ] Additional form field patterns
- [ ] Profile usage statistics

### [1.2.0] - Planned
- [ ] Profile sharing
- [ ] Advanced field matching with ML
- [ ] Browser history for autofills
- [ ] Form templates
- [ ] Custom field mapping

### [2.0.0] - Long term
- [ ] Firefox support (Manifest V3 equivalent)
- [ ] Safari support
- [ ] Mobile companion app
- [ ] Team collaboration features
- [ ] Advanced analytics
- [ ] Encryption for stored data
- [ ] Zero-knowledge sync

## Known Limitations (MVP)

- Master password uses simple hashing (not production-grade)
- No encryption for stored profiles
- No cloud backup/sync
- Limited form field detection (can be extended)
- No profile sharing
- No keyboard shortcuts

## Notes for Contributors

- Follow TypeScript strict mode
- Use React functional components with hooks
- Add services for new features (not UI logic)
- Update types when adding fields
- Update documentation with new features
- Test on various websites before release

## Version History

| Version | Date | Status |
|---------|------|--------|
| 1.0.0 | 2024-01-XX | Initial MVP |
