import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { name, email } = await req.json();

        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'HarshBhati Training <onboarding@resend.dev>', // Update this with your verified Resend domain
                to: [email],
                subject: 'Successfully Registered for HarshBhati Digital Training!',
                html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Registration Confirmed! 🎉</h2>
            <p>Hi <strong>${name}</strong>,</p>
            <p>Thank you for submitting your details. Our team has received your application and will review it shortly. The next steps will unlock powerful insights into building your future on the internet.</p>
            <p>We'll be in touch soon.</p>
            <br/>
            <p style="color: #666; font-size: 12px;">- The HarshBhati Team</p>
          </div>
        `,
            }),
        });

        const data = await res.json();
        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }
});
