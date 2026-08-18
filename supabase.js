const SUPABASE_URL =
    "https://lxmmltjdfmkttocoucyi.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_0_SzHiCQPbdjlCxSFCEtUA_O9bFhecz";

window.supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );