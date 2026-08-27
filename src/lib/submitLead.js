import { supabase } from './supabase';

export const submitLead = async (leadData) => {
  let dbSuccess = false;
  let isDuplicate = false;

  if (supabase) {
    if (leadData.inquiry_type) {
      // Submit to a dedicated 'contacts' table instead of leads
      const { error } = await supabase.from('contacts').insert([{
        id: crypto.randomUUID(),
        name: leadData.name,
        email: leadData.email,
        inquiry_type: leadData.inquiry_type,
        message: leadData.message
      }]);
      dbSuccess = !error;
      if (error && error.code === '23505') isDuplicate = true;
    } else {
      // 1. Save data into the Supabase 'leads' table natively with exact valid columns
      const leadPayload = {
        id: crypto.randomUUID(),
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        city: leadData.city
      };
      
      const { error } = await supabase.from('leads').insert([leadPayload]);
      dbSuccess = !error;
      if (error && error.code === '23505') isDuplicate = true;
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

  return { success: dbSuccess, isDuplicate };
};

export const checkLeadStatus = async (email) => {
  if (!email || !supabase) return null;
  try {
    const cleanEmail = email.trim().toLowerCase();
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .ilike('email', cleanEmail)
      .limit(1);

    if (error) {
      console.warn("Supabase query error in checkLeadStatus:", error.message);
      return null;
    }

    if (data && data.length > 0) {
      return data[0];
    }
  } catch (err) {
    console.error("Error checking lead status:", err);
  }
  return null;
};

export const updateLeadProgress = async (email, updates) => {
  if (!email || !supabase) return false;
  try {
    const cleanEmail = email.trim().toLowerCase();
    const { error } = await supabase
      .from('leads')
      .update(updates)
      .ilike('email', cleanEmail);
    if (error) {
      console.warn("Could not update progress in Supabase (run SQL migration if columns are missing):", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Error updating lead progress:", err);
    return false;
  }
};


