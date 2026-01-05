# Debugging Delete Functionality

If delete is not working, follow these steps to debug:

## Step 1: Check Browser Console

1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Try to delete a project
4. Look for any error messages

## Step 2: Check Network Tab

1. Open Developer Tools (F12)
2. Go to the Network tab
3. Try to delete a project
4. Find the DELETE request to `/api/projects`
5. Click on it and check:
   - **Status Code**: Should be 200 (success) or 403 (unauthorized)
   - **Request Headers**: Check if `Cookie` header includes `admin_session=...`
   - **Request Payload**: Should include `{"id": <number>}`
   - **Response**: Check the error message if status is not 200

## Step 3: Verify Admin Login

1. Make sure you see "Logout" button (not "Admin Login")
2. If you see "Admin Login", click it and enter your admin token
3. After login, verify you see "Logout" button

## Step 4: Check Server Logs

If running locally:
1. Check your terminal where `pnpm dev` is running
2. Look for console.log messages when you try to delete
3. Check for any error messages

## Common Issues

### Issue: "Unauthorized - Invalid or missing admin token"

**Causes:**
- Not logged in as admin
- Cookie expired (login again)
- ADMIN_TOKEN environment variable not set
- Cookie not being sent with request

**Solutions:**
1. Log out and log back in
2. Check that ADMIN_TOKEN is set in your `.env.local` file
3. Clear browser cookies and try again
4. Check browser console for cookie-related errors

### Issue: "Project not found"

**Causes:**
- ID mismatch (number vs string)
- Project already deleted
- Wrong ID being sent

**Solutions:**
1. Refresh the page to reload projects
2. Check console logs to see what ID is being sent
3. Verify the project exists in `tmp/projects.json`

### Issue: No response / Network error

**Causes:**
- Server not running
- Network connectivity issue
- CORS issue

**Solutions:**
1. Make sure dev server is running (`pnpm dev`)
2. Check network connectivity
3. Try refreshing the page

## Testing Steps

1. **Start dev server:**
   ```bash
   pnpm dev
   ```

2. **Set admin token in `.env.local`:**
   ```
   ADMIN_TOKEN=your_token_here
   ```

3. **Open browser console (F12)**

4. **Navigate to `/work` page**

5. **Login as admin:**
   - Click "Admin Login"
   - Enter your admin token
   - Verify "Logout" appears

6. **Try to delete:**
   - Click "Delete" on any project
   - Confirm deletion
   - Watch console for logs
   - Check Network tab for request/response

7. **Check server logs:**
   - Look at terminal running `pnpm dev`
   - Check for DELETE request logs

## Expected Console Output

When delete works correctly, you should see:
```
doDelete called with ID: 1767612331469 Type: number isAdmin: true
Sending DELETE request for ID: 1767612331469
Delete response status: 200 OK
Delete response data: {ok: true, deletedId: 1767612331469}
Delete successful, updating UI
Items before: 1 Items after: 0
```

If there's an error, you'll see:
```
Delete failed: 403 {error: "Unauthorized - Invalid or missing admin token"}
```

## Still Not Working?

1. **Check `.env.local` file exists and has ADMIN_TOKEN**
2. **Restart dev server** after changing environment variables
3. **Clear browser cache and cookies**
4. **Check file permissions** on `tmp/projects.json`
5. **Verify you can write to `tmp/` directory**

