import { Resend } from 'resend';

interface SendEmailProps {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailProps) {
    const apiKey = process.env.RESEND_API_KEY;

    // Fallback if no API key is present (Dev Mode)
    if (!apiKey || apiKey === 're_123...' || apiKey.startsWith('re_mock')) {
        console.log("---------------------------------------------------");
        console.log("📧 [MOCK EMAIL SERVICE]");
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log("--- Body Start ---");
        console.log(html); // In a real app we might strip HTML tags for readability
        console.log("--- Body End ---");
        console.log("---------------------------------------------------");
        return { success: true, id: 'mock-id' };
    }

    try {
        const resend = new Resend(apiKey);
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'info@send.ayoolapropertymanagement.com';
        const isDomainVerified = process.env.RESEND_DOMAIN_VERIFIED === 'true';

        // If domain is not verified, Resend requires 'onboarding@resend.dev'
        const finalFrom = isDomainVerified ? `Ayoola Property <${fromEmail}>` : 'Ayoola Property <onboarding@resend.dev>';

        if (!isDomainVerified) {
            console.warn("⚠️ [RESEND NOTICE] Domain not marked as verified in .env. Falling back to onboarding@resend.dev.");
            console.warn("   To use your company email, verify your domain in Resend and set RESEND_DOMAIN_VERIFIED=true");
        }

        const data = await resend.emails.send({
            from: finalFrom,
            to: to,
            subject: subject,
            html: html,
        });

        if (data.error) {
            console.error("❌ Resend Service Error:", data.error);
            return { success: false, error: data.error };
        }

        console.log(`✅ Email Sent Successfully to ${to}. ID: ${data.data?.id}`);
        return { success: true, data };
    } catch (error) {
        console.error("❌ Critical Email Failure:", error);
        return { success: false, error };
    }
}
