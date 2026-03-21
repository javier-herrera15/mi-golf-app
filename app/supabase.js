import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto'; // <--- ¡ESTO ES CRUCIAL!

const supabaseUrl = 'https://cjfzakzivjwpfmowrixw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqZnpha3ppdmp3cGZtb3dyaXh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwODkxNzEsImV4cCI6MjA4OTY2NTE3MX0.UT6GF447_ChPL3YgbFXZHMN8b04ssqYLTi7LFWAjAyk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Esto evita errores de almacenamiento en el móvil por ahora
  },
});