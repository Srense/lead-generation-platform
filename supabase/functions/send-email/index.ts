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
        const { name, email, type } = await req.json();

        let subject = '';
        let htmlContent = '';

        if (type === 'contact') {
            subject = 'We received your inquiry - HarshBahti';
            htmlContent = `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Message Received! 📨</h2>
                <p>Hi <strong>${name}</strong>,</p>
                <p>Thank you for reaching out to us. Our support team has received your message and will get back to you shortly.</p>
                <br/>
                <p style="color: #666; font-size: 12px;">- The HarshBahti Team</p>
              </div>
            `;
        } else {
            subject = 'Successfully Registered for HarshBahti Digital Training!';
            htmlContent = `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Registration Confirmed! 🎉</h2>
                <p>Hi <strong>${name}</strong>,</p>
                <p>Thank you for submitting your details. Our team has received your application and will review it shortly. The next steps will unlock powerful insights into building your future on the internet.</p>
                <p>We'll be in touch soon.</p>
                <br/>
                <p style="color: #666; font-size: 12px;">- The HarshBahti Team</p>
              </div>
            `;
        }

        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'HarshBahti Training <onboarding@resend.dev>', // Update this with your verified Resend domain
                to: [email],
                subject: subject,
                html: htmlContent,
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
