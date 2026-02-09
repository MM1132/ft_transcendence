# Frontend TODO

## 1. Initial Setup & Design Decisions
- [ ] Decide on first landing page (LoginPage or separate Home/Landing page?)
- [ ] Plan overall design system (colors, typography, spacing)
- [ ] Create reusable component library structure
- [ ] Decide on form handling approach (shared component vs separate forms)

## 2. Reusable Components
- [ ] Review current components (Button, Input, LoginForm)
- [ ] Create/enhance shared components:
  - [ ] Form component (for Login/SignUp reuse)
  - [ ] Header/Navigation component (currently duplicated across pages)
  - [ ] Footer component (currently duplicated)
  - [ ] Error/validation message component
  - [ ] Loading/spinner component
  - [ ] Card/Container component

## 3. Authentication & Login
- [ ] Login form validation
  - [ ] Username validation (required, min/max length, pattern)
  - [ ] Password validation (required, min length, strength?)
  - [ ] Display error messages
- [ ] Connect to backend API
  - [ ] Implement POST /session (login endpoint)
  - [ ] Handle success response (store session/token)
  - [ ] Handle error responses (401, 500, etc.)
- [ ] Session management
  - [ ] Integrate authStore with login flow
  - [ ] Store authentication state
  - [ ] Handle token/cookie storage
- [ ] Redirect logic
  - [ ] Redirect to dashboard on successful login
  - [ ] Stay on login with errors displayed

## 4. Sign Up / Registration
- [ ] Decide: Reuse LoginForm component or create separate SignUpForm?
- [ ] Design sign-up form fields:
  - [ ] Username
  - [ ] Password
  - [ ] Confirm password
  - [ ] Email? Display name? Avatar upload?
  - [ ] Terms & conditions acceptance?
- [ ] Form validation for sign-up
- [ ] Connect to backend registration endpoint
- [ ] Handle success (auto-login or redirect to login?)
- [ ] Handle errors (username taken, validation errors)

## 5. Protected Routes & Auth Guard
- [ ] Add route protection logic
- [ ] Redirect unauthenticated users to login
- [ ] Check auth state on app load
- [ ] Handle session expiration/logout

## 6. Dashboard Page
- [ ] Design dashboard layout
- [ ] Decide on dashboard content/features:
  - [ ] User profile summary?
  - [ ] Quick stats/game history?
  - [ ] Recent activity?
  - [ ] Navigation to other features?
- [ ] Implement dashboard components
- [ ] Connect to backend APIs for dashboard data

## 7. Settings Page
- [ ] Design settings layout
- [ ] Implement settings sections:
  - [ ] Profile settings (username, avatar, bio?)
  - [ ] Account settings (password change, email)
  - [ ] Privacy settings?
  - [ ] Game preferences?
  - [ ] Delete account?
- [ ] Form handling for each setting
- [ ] Connect to backend update endpoints
- [ ] Success/error feedback
- [ ] Save/cancel buttons

## 8. Design & Styling
- [ ] Refine overall visual design
- [ ] Consistent header/footer across all pages
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Form styling consistency
- [ ] Button states (hover, active, disabled)
- [ ] Color scheme and theme
- [ ] Typography hierarchy
- [ ] Loading states and animations
- [ ] Error state styling

## 9. Routing Enhancement (Later)
- [ ] Decide: Keep hash routing or switch to history routing?
- [ ] If history: Configure Vite for SPA fallback
- [ ] Test all navigation flows
- [ ] Handle 404/not found pages

## 10. Testing & Polish
- [ ] Test all form validations
- [ ] Test all navigation flows
- [ ] Test authentication flow end-to-end
- [ ] Error handling coverage
- [ ] Browser compatibility
- [ ] Performance optimization

---

## Questions to Answer:
1. **Landing page**: Should users see LoginPage first, or a separate marketing/home page?
2. **Sign-up form**: Same component as login or separate? What fields are needed?
3. **Reusable components**: Which components are worth abstracting now vs later?
4. **Design priority**: Should design be finalized before implementation or iteratively?
