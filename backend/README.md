# Innovista Backend Documentation

## Quick Start

```bash
cd backend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in the backend directory:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/innovista_idt
JWT_SECRET=your_secret_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

## Project Structure

### Models
All database models are defined in `/models`:
- **User.js**: Base user model for all roles
- **Student.js**: Student-specific details
- **Mentor.js**: Mentor information and assignments
- **Batch.js**: Batch/cohort management
- **Group.js**: Project groups
- **Project.js**: Project details
- **Attendance.js**: Attendance records
- **Marks.js**: Grading records
- **DailyUpdate.js**: Daily progress updates
- **WeeklyUpdate.js**: Weekly summaries

### Controllers
API logic in `/controllers`:
- **authController.js**: Registration, login, profile management
- **studentController.js**: Student dashboard and updates
- **mentorController.js**: Mentor operations
- **adminController.js**: System administration

### Routes
API endpoints in `/routes`:
- `/auth` - Authentication routes
- `/student` - Student-only routes
- `/mentor` - Mentor-only routes
- `/admin` - Admin-only routes

### Middleware
- **auth.js**: JWT verification and role-based access

## Key Workflows

### Registration Flow
1. User provides: name, email, password, role
2. Password is hashed using bcryptjs
3. User document created in MongoDB
4. JWT token generated and returned
5. Token stored in frontend localStorage

### Student Submission Flow
1. Student submits daily/weekly update
2. Verified student record fetched
3. Update document created with timestamp
4. Response sent to frontend

### Attendance Marking Flow
1. Mentor marks attendance for student
2. Status validated (present/absent/late)
3. Attendance record created
4. Mentor reference added
5. Statistics can be aggregated

## Database Relationships

```
User → Student → Batch
            ↓
          Group → Project
            ↓
         Mentor
            
Attendance (student + date + status)
Marks (student + mentor + evaluation)
DailyUpdate (student + date)
WeeklyUpdate (student + week + year)
```

## API Response Format

All responses follow this format:

**Success (200)**:
```json
{
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

**Error (400, 401, 500)**:
```json
{
  "message": "Error description"
}
```

## Authentication

All protected endpoints require:
```
Authorization: Bearer <jwt_token>
```

JWT payload contains:
```json
{
  "id": "user_id",
  "role": "student|mentor|admin"
}
```

## Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Change JWT_SECRET to strong random string
- [ ] Use production MongoDB instance
- [ ] Set secure CORS origins
- [ ] Enable HTTPS
- [ ] Set up error logging
- [ ] Add rate limiting
- [ ] Enable request validation

### Deploy to Heroku

```bash
heroku create innovista-idt-backend
git push heroku main
heroku config:set JWT_SECRET=your_production_secret
heroku logs --tail
```

## Testing APIs

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"pass123","role":"student"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"pass123"}'

# Get user (with token)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

## Common Issues

### MongoDB Connection Failed
- Check if MongoDB is running
- Verify connection string in .env
- Check network firewall

### JWT Errors
- Token expired: User needs to login again
- Invalid token: Check JWT_SECRET matches
- Missing token: Ensure Authorization header is sent

### Permission Denied
- Verify user role matches required role
- Check token is valid
- Ensure role is correctly assigned

## Best Practices

1. **Always hash passwords** - Use bcryptjs
2. **Validate input** - Use express-validator
3. **Handle errors** - Use try-catch blocks
4. **Log important events** - For debugging
5. **Use MongoDB indexes** - For performance
6. **Pagination** - For large datasets
7. **Rate limiting** - Prevent abuse
8. **HTTPS** - For production

## Performance Tips

1. Add database indexes on frequently queried fields
2. Use pagination for list endpoints
3. Cache frequently accessed data
4. Use MongoDB aggregation for complex queries
5. Implement request compression
6. Monitor database performance

---

**Backend Version**: 1.0.0  
**Last Updated**: 2024
