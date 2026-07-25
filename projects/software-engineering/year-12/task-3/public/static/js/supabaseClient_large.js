import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = 'https://nvljnkgdtutfrngaknnu.supabase.co';
const supabaseAnonKey = 'sb_publishable_8Kq_O79qC5FntFHECkKINA_yXDzpzim';

const supabase = supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('YOUR_SUPABASE_URL')
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (typeof window !== 'undefined') {
  window.supabase = supabase;
}

export default supabase;
