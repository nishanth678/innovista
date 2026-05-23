# Innovista Frontend Documentation

## Quick Start

```bash
cd frontend
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
src/
├── components/
│   ├── Navbar.js          # Top navigation with user info
│   ├── Sidebar.js         # Side navigation menu
│   └── Common.js          # Reusable UI components
├── pages/
│   ├── Login.js
│   ├── StudentDashboard.js
│   ├── DailyUpdates.js
│   ├── WeeklyUpdates.js
│   ├── StudentAttendance.js
│   ├── StudentMarks.js
│   ├── MentorDashboard.js
│   └── AdminDashboard.js
├── services/
│   └── api.js             # Axios API calls
├── context/
│   └── AuthContext.js     # Global auth state
├── App.js                 # Main routing
├── index.js               # React entry point
└── index.css              # Tailwind styles
```

## Key Components

### Navbar
- User name and role display
- Logout button
- Responsive mobile menu

### Sidebar
- Dynamic menu based on user role
- Navigation to all role-specific pages
- Icons for better UX

### Reusable Components (Common.js)
- `Card` - Container for content
- `Button` - Styled button
- `Input` - Form input field
- `TextArea` - Multi-line text input
- `Table` - Data table with columns
- `StatCard` - Statistics card
- `Badge` - Status indicator
- `Modal` - Popup dialog
- `Alert` - Success/error messages
- `LoadingSpinner` - Loading indicator

## Authentication Flow

### Login Process
1. User enters email and password
2. Calls `login()` from AuthContext
3. API sends credentials to backend
4. Backend verifies and returns JWT token
5. Token stored in localStorage
6. User redirected to dashboard

### Protected Routes
- All routes except `/login` are protected
- `ProtectedRoute` component checks authentication
- If not authenticated, redirects to login
- If wrong role, redirects to login

### Session Management
- Token stored in localStorage
- Added to all API requests via interceptor
- Automatically sent as `Authorization: Bearer <token>`

## API Integration

### API Service (api.js)

```javascript
import { studentAPI, mentorAPI, adminAPI } from '../services/api'

// Usage
const response = await studentAPI.getDashboard()
const data = response.data
```

### Axios Interceptor
- Automatically adds JWT token to headers
- Handles errors globally
- Can be extended for logging

## State Management

### AuthContext
Provides:
- `user` - Current user object
- `token` - JWT token
- `loading` - Loading state
- `isAuthenticated` - Auth status
- `login()` - Login function
- `logout()` - Logout function
- `register()` - Registration function

Usage:
```javascript
const { user, login, logout } = useAuth()
```

## Styling with Tailwind CSS

### Configured Classes
- Responsive grid: `grid grid-cols-1 md:grid-cols-4`
- Spacing: `p-8`, `mb-8`, `gap-4`
- Colors: `bg-blue-600`, `text-gray-700`
- Responsive text: `text-2xl md:text-3xl`

### Custom Colors in tailwind.config.js
```javascript
colors: {
  primary: '#3B82F6',    // Blue
  secondary: '#10B981',  // Green
  danger: '#EF4444',     // Red
  warning: '#F59E0B',    // Yellow
}
```

## Form Handling

### Input Component
```javascript
<Input
  label="Email"
  type="email"
  placeholder="Enter email"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  required
/>
```

### TextArea Component
```javascript
<TextArea
  label="Description"
  placeholder="Enter description"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

## Data Display

### Table Component
```javascript
const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'status', label: 'Status', render: (row) => <Badge>{row.status}</Badge> }
]

<Table columns={columns} data={data} />
```

### StatCard Component
```javascript
<StatCard
  label="Total Students"
  value={250}
  icon={FiUsers}
  color="blue"
/>
```

## Page Examples

### Student Dashboard
1. Displays student info
2. Shows statistics (attendance, marks, updates)
3. Displays project details
4. Shows mentor and guide info

### Daily Updates
1. Submit new daily update
2. View previous updates
3. Filter by status
4. See work completed and issues

### Admin Dashboard
1. System-wide statistics
2. Attendance summary
3. Project progress stats

## Responsive Design

Mobile-first approach using Tailwind breakpoints:
- `sm:` - 640px
- `md:` - 768px
- `lg:` - 1024px
- `xl:` - 1280px

Example:
```javascript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
```

## Performance Optimization

1. **Lazy Load Pages** - Code splitting for routes
2. **Memoization** - React.memo for components
3. **useCallback** - Optimize callback functions
4. **useMemo** - Expensive computations
5. **Image Optimization** - Use optimized images

## Environment Variables

Create `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_JWT_TOKEN_KEY=jwt_token
```

## Common Patterns

### Fetching Data
```javascript
const [data, setData] = useState(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')

useEffect(() => {
  fetchData()
}, [])

const fetchData = async () => {
  try {
    const response = await studentAPI.getDashboard()
    setData(response.data)
  } catch (err) {
    setError(err.response?.data?.message)
  } finally {
    setLoading(false)
  }
}
```

### Form Submission
```javascript
const [formData, setFormData] = useState({})
const [loading, setLoading] = useState(false)

const handleSubmit = async (e) => {
  e.preventDefault()
  try {
    setLoading(true)
    await studentAPI.submitUpdate(formData)
    // Success
  } catch (err) {
    setError(err.response?.data?.message)
  } finally {
    setLoading(false)
  }
}
```

## Testing

### Manual Testing Checklist
- [ ] Login with different roles
- [ ] Verify role-based redirects
- [ ] Test all forms and submissions
- [ ] Check responsive design
- [ ] Test error handling
- [ ] Verify token persistence
- [ ] Test logout functionality

## Deployment

### Build for Production
```bash
npm run build
```

Creates optimized build in `build/` directory.

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload build folder to Netlify
```

## Troubleshooting

### Blank Page After Login
- Check if API URL is correct in .env
- Check browser console for errors
- Verify token is being stored

### Components Not Displaying
- Check imports are correct
- Verify component names match
- Check for typos in file paths

### Styling Not Applied
- Ensure Tailwind CSS is imported
- Clear build cache: `npm run build`
- Check tailwind.config.js

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

**Frontend Version**: 1.0.0  
**Last Updated**: 2024

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
