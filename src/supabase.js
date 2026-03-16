import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hkpslpgbiqzxyzdpvuts.supabase.co'
const supabaseKey = 'sb_publishable_S_QBOREB4apo_to9J86fKA_vLnPKAP0'

export const supabase = createClient(supabaseUrl, supabaseKey)