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
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
                <h2 style="color: #10B981;">Message Received! 📨</h2>
                <p>Hi <strong>${name || 'there'}</strong>,</p>
                <p>Thank you for reaching out to us. Our support team has received your message and will get back to you shortly.</p>
                <br/>
                <p style="color: #666; font-size: 12px;">- The HarshBahti Team</p>
              </div>
            `;
        } else if (type === 'reset_password') {
            subject = 'Password Reset Request - HarshBahti Digital Training';
            htmlContent = `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #222; border-radius: 16px; background-color: #09090B; color: #FFFFFF;">
                <h2 style="color: #10B981; margin-bottom: 8px;">Password Reset Request 🔐</h2>
                <p style="color: #E2E8F0;">Hi <strong>${name || 'Learner'}</strong>,</p>
                <p style="color: #94A3B8; line-height: 1.6;">We received a request to reset your account password for your HarshBahti Training portal.</p>
                <div style="background-color: #18181B; border: 1px solid #27272A; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
                  <p style="color: #94A3B8; font-size: 13px; margin: 0 0 12px 0;">Click the button below or visit the website to set your new password:</p>
                  <a href="https://harshbahti.in/#auth-gate" style="display: inline-block; background-color: #10B981; color: #000000; font-weight: bold; font-size: 14px; text-decoration: none; padding: 12px 24px; border-radius: 10px;">Reset My Password</a>
                </div>
                <p style="color: #64748B; font-size: 12px;">If you did not request a password reset, you can safely ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #27272A; margin: 20px 0;" />
                <p style="color: #64748B; font-size: 11px;">- HarshBahti Digital Platform</p>
              </div>
            `;
        } else {
            subject = 'Successfully Registered for HarshBahti Digital Training!';
            htmlContent = `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
                <h2 style="color: #10B981;">Registration Confirmed! 🎉</h2>
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
                from: 'HarshBahti Training <support@harshbahti.in>', // Using verified custom domain
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
