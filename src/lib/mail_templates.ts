export function getResetPasswordTemplate(resetLink: string) {
    return `
    <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h1 style="color: #1a1a1a;">Password Reset Request</h1>
        <p>Hello,</p>
        <p>We received a request to reset the password for your Ayoola Property Management account.</p>
        <p>Click the button below to set a new password. This link is valid for 1 hour.</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
        </div>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="font-size: 12px; color: #666;">Ayoola Property Management & Sourcing Services Limited</p>
    </div>
    `;
}

export function getWelcomeTemplate(name: string) {
    return `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; color: #333;">
            <h1 style="color: #1a1a1a;">Welcome to Ayoola Property, ${name}!</h1>
            <p>We are thrilled to have you on board.</p>
            <p>You can now access your portal to view properties, manage leases, and more.</p>
             <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Go to Portal</a>
            </div>
             <p style="font-size: 12px; color: #666;">Ayoola Property Management & Sourcing Services Limited</p>
        </div>
    `;
}
