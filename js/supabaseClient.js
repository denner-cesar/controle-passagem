import { createClient } from 
"https://esm.sh/@supabase/supabase-js@2";


const supabaseUrl =
"https://dmmzndngdpmlcxosfzin.supabase.co";


const supabaseKey =
"sb_publishable_j9NaTQohufo2kfqPLlZKuQ_VWgBiPeF";



export const supabase =
createClient(
    supabaseUrl,
    supabaseKey
);


