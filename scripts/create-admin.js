const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function createAdminUser() {
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Missing environment variables. Check .env file');
    console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const email = 'tooldockerdev@gmail.com';
  const password = 'tooldocker@dev';

  console.log('Creating admin user...');
  console.log('Email:', email);

  try {
    // Create user via Admin API (service role key)
    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Skip email verification
      user_metadata: {
        role: 'admin',
        full_name: 'Tooldocker Admin'
      }
    });

    if (error) {
      if (error.message.includes('already exists')) {
        console.log('⚠️  Admin user already exists:', email);
        console.log('Verifying user details...');
        
        // Fetch existing user
        const { data: users, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) {
          console.error('Error fetching users:', listError.message);
          process.exit(1);
        }
        
        const adminUser = users.users.find(u => u.email === email);
        if (adminUser) {
          console.log('✅ User found:');
          console.log('  - ID:', adminUser.id);
          console.log('  - Email:', adminUser.email);
          console.log('  - Role:', adminUser.user_metadata?.role);
          console.log('  - Confirmed:', adminUser.email_confirmed_at ? 'Yes' : 'No');
        }
      } else {
        console.error('❌ Error creating user:', error.message);
        process.exit(1);
      }
    } else {
      console.log('✅ Admin user created successfully!');
      console.log('  - ID:', data.user.id);
      console.log('  - Email:', data.user.email);
      console.log('  - Role:', data.user.user_metadata?.role);
      console.log('  - Email Confirmed:', data.user.email_confirmed_at ? 'Yes' : 'No');
    }

    // Verify profile was created by trigger
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Error checking profile:', profileError.message);
    } else if (profile) {
      console.log('\n✅ Profile created:');
      console.log('  - Role:', profile.role);
      console.log('  - Full Name:', profile.full_name);
      console.log('  - Active:', profile.is_active);
    }

    console.log('\n🎉 Setup complete!');
    console.log('You can now login at: /tooldocker-admin/login');
    console.log('  Email:', email);
    console.log('  Password:', password);

  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    process.exit(1);
  }
}

createAdminUser();
