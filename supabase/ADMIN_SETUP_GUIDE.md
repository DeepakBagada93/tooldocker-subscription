# Admin User Setup Guide

## Admin Credentials
- **Email:** tooldockerdev@gmail.com
- **Password:** tooldocker@dev

---

## Setup Instructions (Manual - Required Due to Supabase Security)

Due to Supabase's security model, passwords cannot be set via SQL migrations. You **must** create the user manually through the Supabase Dashboard.

### Step-by-Step: Create Admin User

1. **Go to Supabase Dashboard**
   - Open: https://app.supabase.com
   - Login to your account

2. **Select Your Project**
   - Find and click on: **tooldocker-4-march-**

3. **Navigate to Authentication**
   - In the left sidebar, click: **Authentication** > **Users**

4. **Create New User**
   - Click the **"Add User"** button (top right)
   - Select **"Create new user"**

5. **Fill in User Details**
   - **Email:** `tooldockerdev@gmail.com`
   - **Password:** `tooldocker@dev`
   - ✅ **Check "Auto Confirm User"** (IMPORTANT - skip email verification)
   - **User Metadata** (JSON format):
     ```json
     {
       "role": "admin",
       "full_name": "Tooldocker Admin"
     }
     ```

6. **Create User**
   - Click **"Create User"** button

✅ **Done!** The database trigger (`handle_new_user`) will automatically create the profile in the `public.profiles` table.

---

## Verify Setup

### Option 1: Via Supabase SQL Editor

1. Go to **SQL Editor** in Supabase Dashboard
2. Click **"New Query"**
3. Run this verification query:

```sql
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  u.raw_user_meta_data->>'role' as auth_role,
  p.role as profile_role,
  p.full_name,
  p.is_active
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'tooldockerdev@gmail.com';
```

You should see:
- `auth_role`: admin
- `profile_role`: admin
- `full_name`: Tooldocker Admin
- `is_active`: true

### Option 2: Test Login

1. Go to your app's admin login page: `/tooldocker-admin/login`
2. Enter:
   - Email: `tooldockerdev@gmail.com`
   - Password: `tooldocker@dev`
3. Click **Login**
4. You should be redirected to `/admin` dashboard

---

## Troubleshooting

### Profile was not created automatically

If the profile doesn't exist (rare), create it manually:

```sql
INSERT INTO public.profiles (id, email, role, full_name, is_active, created_at, updated_at)
SELECT id, email, 'admin', 'Tooldocker Admin', true, NOW(), NOW()
FROM auth.users 
WHERE email = 'tooldockerdev@gmail.com';
```

### Can't login to admin dashboard

1. Verify the user exists in **Authentication > Users**
2. Check that email is confirmed (green checkmark)
3. Verify **User Metadata** has `"role": "admin"`
4. Run the verification query above

### Wrong role set

If the role is not `admin`, update it:

```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'tooldockerdev@gmail.com';
```

### Change password

If you need to reset the password:
1. Go to **Authentication > Users**
2. Find `tooldockerdev@gmail.com`
3. Click the **...** menu (right side)
4. Select **"Change Password"**
5. Enter new password: `tooldocker@dev`

---

## Files in This Folder

1. `migrations/20260405130000_add_admin_user.sql` - Migration file (informational only)
2. `create-admin-quick.sql` - Reference SQL script (manual creation still required)
3. `ADMIN_SETUP_GUIDE.md` - This guide

---

## Security Notes

⚠️ **Important:** 
- These credentials are for initial setup only
- **Change the default password after first login**
- Never commit production passwords to version control
- Use strong, unique passwords in production
- Consider implementing 2FA for admin accounts
