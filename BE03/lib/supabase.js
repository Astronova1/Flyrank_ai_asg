const port = process.env.PORT || 3000;
const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_KEY
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default supabase