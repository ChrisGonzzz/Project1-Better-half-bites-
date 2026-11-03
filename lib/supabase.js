import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://mivxurvcrqztskyipwqk.supabase.co"
const supabaseAnonKey = "sb_publishable_oSzkzrQhRJlfVaonNAdbFQ_imxlewd5"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)