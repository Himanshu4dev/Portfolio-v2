# Admin Features Documentation

## Overview

Your portfolio now includes full admin functionality for managing testimonials and projects. When logged in as admin, you can delete and edit content directly from the public-facing pages.

## Admin Login

### How to Login

1. **On the Testimonials Section:**
   - Scroll to the Testimonials section on the homepage
   - Click the "Admin Login" button in the top right
   - Enter your admin token when prompted
   - Click OK

2. **On the Work Page:**
   - Navigate to `/work` page
   - Click the "Admin Login" button in the top right
   - Enter your admin token when prompted
   - Click OK

### Admin Token

- Your admin token is stored in the `ADMIN_TOKEN` environment variable
- Generate a new token using: `node scripts/generate-admin-token.js`
- Keep your token secure and never share it publicly

## Features Available When Logged In

### Testimonials Management

**Location:** Homepage → Testimonials Section

**Available Actions:**
- ✅ **Delete Testimonials:** Click the "Delete" button on any testimonial
- ✅ **Reply to Testimonials:** Click "Reply" to respond to testimonials
- ✅ **View All Testimonials:** See all testimonials with admin controls

**How to Delete:**
1. Log in as admin (see above)
2. Find the testimonial you want to delete
3. Click the red "Delete" button
4. Confirm deletion in the popup
5. The testimonial will be removed immediately

### Projects Management

**Location:** `/work` page

**Available Actions:**
- ✅ **Add Projects:** Use the admin form at the top of the page
- ✅ **Edit Projects:** Click "Edit" on any project card
- ✅ **Delete Projects:** Click "Delete" on any project card
- ✅ **Search Projects:** Use the search bar to find specific projects
- ✅ **Filter by Category:** Click category buttons to filter
- ✅ **Sort Projects:** Sort by newest, oldest, or title

**How to Add a Project:**
1. Log in as admin
2. Fill out the form at the top:
   - Select a category/section
   - Enter project title
   - Add Google Drive link (required)
   - Add thumbnail URL (optional)
   - Add description (optional)
3. Click "Add Project"
4. The project appears immediately

**How to Edit a Project:**
1. Log in as admin
2. Find the project you want to edit
3. Click the "Edit" button
4. The form will populate with current values
5. Make your changes
6. Click "Save Changes"
7. Or click "Cancel" to discard changes

**How to Delete a Project:**
1. Log in as admin
2. Find the project you want to delete
3. Click the red "Delete" button
4. Confirm deletion in the popup
5. The project will be removed immediately

## Enhanced Work Page Features

### Search Functionality
- Search across project titles, descriptions, and categories
- Real-time filtering as you type
- Shows count of matching results

### Sorting Options
- **Newest First:** Most recently added projects first
- **Oldest First:** Oldest projects first
- **Sort by Title:** Alphabetical order

### Category Filtering
- Filter by specific categories (Video Editing, Web Development, etc.)
- "All" option to show everything
- Only shows categories that have projects

### Improved UX
- Better visual feedback on hover
- Clearer admin controls
- Responsive design for mobile and desktop
- Smooth transitions and animations

## Security

- Admin sessions are stored in secure HTTP-only cookies
- Sessions expire after 7 days
- Admin token is never exposed to client-side JavaScript
- All admin actions require authentication
- Failed authentication attempts return 403 errors

## Logout

To log out:
- Click the "Logout" button (appears when logged in)
- Your session will be cleared
- You'll need to log in again to access admin features

## Troubleshooting

### Can't Delete Items
- **Check:** Are you logged in? Look for "Logout" button
- **Solution:** Log in again using admin token

### Changes Not Saving
- **Check:** Browser console for errors
- **Check:** Network tab for failed requests
- **Solution:** Ensure environment variables are set correctly

### Session Expired
- **Check:** Has it been more than 7 days?
- **Solution:** Log in again

## Best Practices

1. **Keep Your Token Secure**
   - Never commit it to git
   - Don't share it publicly
   - Rotate it if compromised

2. **Regular Backups**
   - Consider exporting data periodically
   - Current implementation uses file storage (may not persist on Vercel)

3. **Test Before Production**
   - Test all admin features locally first
   - Verify environment variables are set correctly

4. **Monitor Activity**
   - Check your site regularly
   - Review testimonials and projects

---

**Need Help?** Check the deployment guide or review the code comments.

