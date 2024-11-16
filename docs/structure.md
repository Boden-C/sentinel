# Project Folder Structure

api/
- app.py
- config.py
- database/
  - __init__.py
  - reservations.py
- exceptions.py
- routes/
  - __init__.py
  - authenticate.py
  - reservations.py
- typedef.py
- wrappers.py

src/
- App.jsx
- assets/
  - parking_bg.jpg
  - react.svg
  - vite.svg
- components/
  - AuthContext.jsx
  - Components.jsx
  - PrivateRoute.jsx
  - ThemeProvider.tsx
  - ui/
    - alert.tsx
    - button.tsx
    - calendar.tsx
    - card.tsx
    - checkbox.tsx
    - datetimepicker.tsx
    - dropdown-menu.tsx
    - icons.tsx
    - input.tsx
    - label.tsx
    - mode-toggle.tsx
    - popover.tsx
    - scroll-area.tsx
- lib/
  - utils.ts
- main.jsx
- pages/
  - AuthenticationPages.jsx
  - DashboardPage.jsx
  - LandingPage.jsx
  - ReservationPage.jsx
  - SigninPage.jsx
  - SignupPage.jsx
- scripts/
  - api.js
  - auth.js
  - firebaseConfig.js
  - types.js
  - utils.js
- styles/
  - example.css
  - index.css

tests/
- api.test.js
- auth.test.js
- setup.js

Config files are in root
