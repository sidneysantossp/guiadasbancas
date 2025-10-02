import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rgqlncxrzwgjreggrjcq.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncWxuY3hyendnanJlZ2dyamNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTIyMzI5MywiZXhwIjoyMDc0Nzk5MjkzfQ.bdkHUKuaDQ22lZqMmFMT_3P3L0VAK11mGlJ6YkU3d6s';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTrigger() {
  console.log('🔍 Verificando trigger e criando perfil manualmente se necessário...\n');

  try {
    // Listar todos os usuários sem perfil
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('❌ Erro ao listar usuários:', usersError.message);
      return;
    }

    console.log(`📊 Total de usuários: ${users.users.length}\n`);

    for (const user of users.users) {
      // Verificar se já tem perfil
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.log(`⚠️  Erro ao verificar perfil de ${user.email}:`, profileError.message);
        continue;
      }

      if (!profile) {
        console.log(`❌ Usuário sem perfil: ${user.email}`);
        console.log(`   Criando perfil manualmente...`);

        const role = user.user_metadata?.role || 'cliente';
        const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || '';

        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            id: user.id,
            role: role,
            full_name: fullName,
            email_verified: user.email_confirmed_at !== null,
          });

        if (insertError) {
          console.log(`   ❌ Erro ao criar perfil:`, insertError.message);
        } else {
          console.log(`   ✅ Perfil criado com sucesso!`);
        }
      } else {
        console.log(`✅ Usuário com perfil: ${user.email} (role: ${profile.role || 'N/A'})`);
      }
    }

    console.log('\n✅ Verificação concluída!');

  } catch (error: any) {
    console.error('❌ Erro:', error.message);
  }
}

checkTrigger();
