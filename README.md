# Access Control Onboarding System

A desktop-focused React application for enterprise access control management, featuring phone authentication with OTP verification and comprehensive role-based user management.

## Features

### Authentication Flow
- 📱 **Phone Number Authentication**: E.164 formatted input with country code selection
- 🔐 **OTP Verification**: 6-digit segmented input with auto-advance functionality
- ⏱️ **Smart Resend Logic**: 60-second countdown with failed attempt lockout (5 attempts = 5-minute lockout)
- 📋 **SMS Auto-Capture**: Automatic OTP detection from clipboard when supported

### Admin Dashboard
- 🎯 **Unified Interface**: Combined role creation and user management in a single form
- 👥 **User Management**: Full CRUD operations for user accounts with detailed information
- 🔑 **Role Builder**: Comprehensive permission matrix across 8 business modules
- 🏢 **Club Assignment**: Searchable dropdown for club-specific user assignments
- 📊 **Permission Control**: Tri-state access control (Forbidden/Read-only/Full Access)
- ✏️ **Bulk Operations**: Mass permission updates with "All Full Access", "All Read-only", "All Forbidden"
- 🔍 **Advanced Search**: Filter and search across roles, users, and permissions

### Role & Permission System
**Eight Core Modules:**
1. Booking Management
2. Member Services
3. Subscription Handling
4. Commercial Operations
5. Administrative Functions
6. Franchise Management
7. Access & Permissions
8. Personal Info & Configuration

### UI/UX Design
- 🎨 **Material Design**: Clean, professional UI optimized for desktop business environments
- 🖥️ **Desktop-Optimized**: Fixed layouts designed for minimum 1024px width screens
- ✨ **Smooth Transitions**: Fade animations and professional interaction patterns
- 🏷️ **Real-time Feedback**: Live validation, badge counters, and status indicators

## Demo Instructions

- Enter any valid 10-digit phone number
- Use verification code **123456** for instant verification
- Other codes have a 70% success rate for testing error handling

## Installation & Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open your browser to `http://localhost:3000`

## Tech Stack

- **React 18** - Frontend framework
- **Material-UI v5** - Component library and design system
- **Emotion** - CSS-in-JS styling solution for desktop-optimized themes

## Architecture & Components

```
src/
├── App.js                    # Main application router and state management
├── index.js                  # React application entry point  
├── theme.js                  # Desktop-optimized Material-UI theme
└── components/
    ├── PhoneNumberInput.js   # E.164 phone input with country selection
    ├── OTPVerification.js    # 6-digit OTP with auto-advance
    ├── AdminDashboard.js     # Main dashboard with unified form
    ├── UserDetailsCard.js    # User information input card (35% width)
    ├── RoleBuilderPanel.js   # Permission matrix panel (65% width)
    ├── RoleManagement.js     # Role CRUD operations and listing
    ├── UserManagement.js     # User CRUD operations and filtering
    ├── SuccessPage.js        # Post-creation confirmation page
    └── LogoIcon.js           # Branded logo component
```

## System Requirements

- **Minimum Screen Width**: 1024px (desktop/laptop optimized)
- **Target Environment**: Business desktop applications
- **Browser Support**: Modern desktop browsers (Chrome, Firefox, Safari, Edge)
- **Input Methods**: Mouse and keyboard interaction

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

## Development Workflow

### User Flow Summary
1. **Authentication**: Phone number input → OTP verification  
2. **Admin Dashboard**: Combined role builder and user details form
3. **Success Page**: Confirmation with options to create more or view listings

### Business Rules
- **Role Templates**: Client Services, Sr. Leadership, General Manager, Front Desk
- **Permission Matrix**: 8 modules with tri-state access control
- **Validation**: Live email uniqueness checking, required field validation
- **Club Management**: Searchable dropdown limited to admin-manageable clubs
- **Security**: Failed OTP lockout, session management, role-based access

### Design Principles
- **Desktop-First**: Fixed layouts, no mobile responsiveness
- **Professional UI**: Material Design optimized for business environments  
- **Efficient Workflow**: Minimal clicks, bulk operations, inline editing
- **Real-time Feedback**: Live validation, counters, status indicators