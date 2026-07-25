import { supabase } from './supabase';

export const submitLead = async (leadData) => {
  let dbSuccess = false;

  if (supabase) {
    if (leadData.inquiry_type) {
      // Submit to a dedicated 'contacts' table instead of leads
      const { error } = await supabase.from('contacts').insert([{
        name: leadData.name,
        email: leadData.email,
        inquiry_type: leadData.inquiry_type,
        message: leadData.message
      }]);
      dbSuccess = !error;
    } else {
      // 1. Save data into the Supabase 'leads' table natively (upsert to handle returning leads safely)
      const { error } = await supabase.from('leads').upsert([{
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        city: leadData.city
      }], { onConflict: 'email' });
      // Error 23505 is Unique Violation, but upsert handles it. Just in case fallback is triggered.
      dbSuccess = !error || error.code === '23505';
    }

    // 2. Safely trigger the Edge Function for Email Dispatch
    if (dbSuccess) {
      try {
        await supabase.functions.invoke('send-email', {
          body: {
            name: leadData.name,
            email: leadData.email,
            type: leadData.inquiry_type ? 'contact' : 'training'
          }
        });
        console.log('Resend email pushed to queue successfully.');
      } catch (funcError) {
        console.error('Edge Function failed to dispatch email:', funcError);
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
