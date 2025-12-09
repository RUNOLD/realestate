import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
        const data = await resend.emails.send({
            from: 'Ayoola Property <onboarding@resend.dev>', // Update this with verified domain later
            to: to,
            subject: subject,
            html: html,
        });

        return { success: true, data };
    } catch (error) {
        console.error("Failed to send email:", error);
        return { success: false, error };
    }
}
