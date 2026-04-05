const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function createBuyerUser() {
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Missing environment variables. Check .env file');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const email = 'demobuyer@gmail.com';
  const password = 'demobuyer@123';

  console.log('Creating demo buyer user...');
  console.log('Email:', email);

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        role: 'buyer',
        full_name: 'Demo Buyer'
      }
    });

    if (error) {
      if (error.message.includes('already exists')) {
        console.log('⚠️  Buyer user already exists:', email);
      } else {
        console.error('❌ Error creating user:', error.message);
        process.exit(1);
      }
    } else {
      console.log('✅ Buyer user created successfully!');
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (profile) {
      console.log('\n✅ Profile verified:');
      console.log('  - Role:', profile.role);
      console.log('  - Full Name:', profile.full_name);
    }

    console.log('\n🎉 Setup complete!');
    console.log('You can now login at: /buyer/login');
    console.log('  Email:', email);
    console.log('  Password:', password);

  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    process.exit(1);
  }
}

createBuyerUser();
