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

export function getWelcomeTemplate(name: string, password?: string) {
    return `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; color: #333;">
            <h1 style="color: #1a1a1a;">Welcome to Ayoola Property, ${name}!</h1>
            <p>We are thrilled to have you on board.</p>
            <p>Your account has been created successfully. You can use the following credentials to login:</p>
            
            ${password ? `
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0;">
                <p style="margin: 0; font-weight: bold;">Initial Password: ${password}</p>
                <p style="margin: 5px 0 0 0; font-size: 13px; color: #666;">Please change this password after your first login.</p>
            </div>
            ` : ''}

            <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Login to Portal</a>
            </div>
             <p style="font-size: 12px; color: #666;">Ayoola Property Management & Sourcing Services Limited</p>
        </div>
    `;
}
