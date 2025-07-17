# Semantic Versioning Configuration

## Version Format: MAJOR.MINOR.PATCH

### Version Bump Rules

#### MAJOR Version (X.0.0)
Increment when making incompatible API changes:
- Breaking changes to existing functionality
- Removal of deprecated features
- Major architectural changes
- Database schema breaking changes
- Authentication/authorization changes

**Examples:**
- Changing API endpoint structure
- Removing supported parameters
- Changing authentication method
- Major UI/UX overhaul

#### MINOR Version (X.Y.0)
Increment when adding functionality in backward-compatible manner:
- New features
- New API endpoints
- New UI components
- Enhanced existing functionality
- Performance improvements

**Examples:**
- Adding multi-camera video selector
- New dashboard components
- Additional export formats
- Enhanced search capabilities

#### PATCH Version (X.Y.Z)
Increment for backward-compatible bug fixes:
- Bug fixes
- Security patches
- Performance optimizations
- Documentation updates
- Code refactoring without functional changes

**Examples:**
- Fixing video player issues
- Correcting validation errors
- UI styling fixes
- Memory leak fixes

### Version Analysis Algorithm

To determine appropriate version bump, analyze git diff between master and dev:

```bash
# Get diff statistics
git diff master..dev --stat
git diff master..dev --name-only

# Analyze changes by category:
# 1. Check for breaking changes
# 2. Check for new features
# 3. Check for bug fixes only
```

### Change Impact Analysis

#### Breaking Changes Indicators:
- Modified API endpoints (not new)
- Changed database schema
- Removed or renamed functions/components
- Changed authentication flow
- Modified configuration format

#### New Features Indicators:
- New API endpoints
- New UI components
- New functionality
- Enhanced existing features
- New integrations

#### Bug Fixes Indicators:
- Fixed existing functionality
- Corrected validation
- Improved error handling
- Performance optimizations
- Security patches

### Version Comparison Logic

```bash
# Get current version from master
CURRENT_VERSION=$(git tag --sort=-v:refname | head -1 | sed 's/v//')
MAJOR=$(echo $CURRENT_VERSION | cut -d. -f1)
MINOR=$(echo $CURRENT_VERSION | cut -d. -f2)
PATCH=$(echo $CURRENT_VERSION | cut -d. -f3)

# Determine new version based on changes
if [ "$BREAKING_CHANGES" = "true" ]; then
    NEW_MAJOR=$((MAJOR + 1))
    NEW_MINOR=0
    NEW_PATCH=0
elif [ "$NEW_FEATURES" = "true" ]; then
    NEW_MAJOR=$MAJOR
    NEW_MINOR=$((MINOR + 1))
    NEW_PATCH=0
else
    NEW_MAJOR=$MAJOR
    NEW_MINOR=$MINOR
    NEW_PATCH=$((PATCH + 1))
fi

NEW_VERSION="$NEW_MAJOR.$NEW_MINOR.$NEW_PATCH"
```

### Changelog Generation

#### Template for Version Tags
```
Version <version>: <summary>

BREAKING CHANGES:
- <breaking-change-1>
- <breaking-change-2>

NEW FEATURES:
- <feature-1>
- <feature-2>

BUG FIXES:
- <bugfix-1>
- <bugfix-2>

TECHNICAL IMPROVEMENTS:
- <improvement-1>
- <improvement-2>

MIGRATION NOTES:
- <migration-note-1>
- <migration-note-2>
```

### Version History Examples

#### v1.0.0 (Initial Release)
```
Version 1.0.0: Initial DOM CCTV MVP Release

NEW FEATURES:
- ANPR event detection and management
- Video player with basic controls
- User authentication system
- Company management
- Metadata entry system
- Dashboard with statistics
- Chilean RUT and license plate validation

TECHNICAL FEATURES:
- Node.js backend with Express
- React frontend with Material-UI
- MySQL database with Prisma ORM
- JWT authentication
- Video file management
```

#### v1.1.0 (Multi-Camera Feature)
```
Version 1.1.0: Multi-Camera Event Tracking

NEW FEATURES:
- Multi-camera event correlation by license plate
- Camera selector in event detail modal
- Dynamic camera switching in video player
- Timeline view of detections
- Vehicle event grouping by temporal proximity

TECHNICAL IMPROVEMENTS:
- New VehicleEvent and Detection models
- Enhanced TypeScript types
- Improved video player modal
- Better event data visualization

BUG FIXES:
- Fixed video player loading issues
- Corrected event timestamp handling
- Improved error handling in event services
```

#### v1.1.1 (Bug Fixes)
```
Version 1.1.1: Bug Fixes and Improvements

BUG FIXES:
- Fixed camera selector not appearing in some events
- Corrected video modal close button behavior
- Fixed duplicate event detection logic
- Improved error handling for missing videos

TECHNICAL IMPROVEMENTS:
- Enhanced logging for debugging
- Optimized database queries
- Better error messages for users
- Code cleanup and refactoring
```

### Release Notes Template

#### For Dev Team
```
# Release v<version>

## Changes Summary
- <summary-of-changes>

## Database Changes
- <database-migrations-if-any>

## API Changes
- <api-changes-if-any>

## Configuration Changes
- <config-changes-if-any>

## Testing Instructions
- <testing-instructions>

## Deployment Notes
- <deployment-specific-notes>
```

#### For End Users
```
# DOM CCTV v<version> Release Notes

## New Features
- <user-facing-features>

## Improvements
- <user-facing-improvements>

## Bug Fixes
- <user-facing-bug-fixes>

## Known Issues
- <known-limitations>

## Support
- <support-information>
```

### Version Validation

#### Pre-Release Checks
- All tests passing
- Build successful
- No console errors
- Documentation updated
- Migration scripts tested

#### Post-Release Validation
- Deployment successful
- Core functionality working
- No critical errors in logs
- User acceptance testing passed

---

This versioning system ensures clear communication of changes and proper semantic versioning for production deployments.