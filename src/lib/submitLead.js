import { supabase } from './supabase';

export const submitLead = async (leadData) => {
  let dbSuccess = false;
  
  if (supabase) {
    // 1. Save data into the Supabase 'leads' table natively
    const { error } = await supabase.from('leads').insert([leadData]);
    dbSuccess = !error;
    
    // 2. Direct Resend Dispatch via Frontend (Note: CORS may block this in browser!)
    if (dbSuccess) {
      const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;
      if (RESEND_API_KEY) {
        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify({
               from: 'Acme <onboarding@resend.dev>',
               to: leadData.email,
               subject: 'Successfully Registered!',
               html: `<p>Thanks ${leadData.name}, your registration is confirmed.</p>`
            })
          });
          console.log('Direct Resend dispatched via frontend.');
        } catch(e) {
          console.error('Direct Resend failed (CORS/Network error):', e);
        }
      }
    }
  } else {
    // Graceful fallback mocking behavior
    console.log("Mock lead recorded locally.", leadData);
    console.log("Mock Resend Email Dispatched locally to: ", leadData.email);
    dbSuccess = true; 
  }

  return dbSuccess;
};
