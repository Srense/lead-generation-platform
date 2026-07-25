const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local natively for credentials
const envFile = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envFile.match(/VITE_SUPABASE_URL="(.+?)"/);
const keyMatch = envFile.match(/VITE_SUPABASE_ANON_KEY="(.+?)"/);

if (!urlMatch || !keyMatch) {
    console.error("Failed to parse Env Configuration.");
    process.exit(1);
}

const supabase = createClient(urlMatch[1], keyMatch[1]);

async function generateAdmin() {
    console.log("Connecting to Supabase...");

    // Auto-create Admin User seamlessly
    const { data, error } = await supabase.auth.signUp({
        email: 'admin@harshbhati.com',
        password: 'H@rshBh@t!Secure2026',
    });

    if (error) {
        if (error.message.includes('already registered')) {
            console.log("Admin account already registered and secure!");
        } else {
            console.error("Registration fail:", error.message);
        }
    } else {
        console.log("Secure Admin Identity Generated Successfully!");
    }
}

generateAdmin();
