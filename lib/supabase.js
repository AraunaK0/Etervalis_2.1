import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'SUA_URL';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'SUA_ANON_KEY';

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);
