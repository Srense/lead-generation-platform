import { supabase } from './supabase';

export const submitLead = async (leadData) => {
  let dbSuccess = false;

  if (supabase) {
    // 1. Save data into the Supabase 'leads' table natively
    const { error } = await supabase.from('leads').insert([leadData]);
    dbSuccess = !error;

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
