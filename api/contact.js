/**
 * VIDO Social — Contact API Handler
 * Vercel Serverless Function for processing contact form submissions
 *
 * Environment variables required:
 * - SENDGRID_API_KEY or RESEND_API_KEY
 * - CONTACT_EMAIL_TO
 *
 * Usage: POST /api/contact
 * Body: { name, company, email, phone, need, message }
 */

// Validate request method
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      code: 'METHOD_NOT_ALLOWED',
      message: 'Only POST requests are supported',
    });
  }

  // Extract form data
  const { name, company, email, phone, need, message, startedAt } = req.body;

  // Validate required fields
  const errors = [];
  if (!name) errors.push('name is required');
  if (!company) errors.push('company is required');
  if (!email) errors.push('email is required');
  if (!phone) errors.push('phone is required');

  if (errors.length > 0) {
    return res.status(400).json({
      code: 'VALIDATION_ERROR',
      message: 'Missing required fields',
      errors,
    });
  }

  // Check if email service is configured
  const hasEmailService = process.env.SENDGRID_API_KEY || process.env.RESEND_API_KEY;
  if (!hasEmailService) {
    return res.status(503).json({
      code: 'EMAIL_NOT_CONFIGURED',
      message: 'Email service is not configured. Please try again later or use the email fallback.',
    });
  }

  try {
    // Calculate form fill time
    const fillTime = startedAt ? Date.now() - parseInt(startedAt) : null;

    // Prepare email content
    const emailSubject = `VIDO kartoituspyyntö — ${company}`;
    const emailBody = `
Uusi kartoituspyyntö VIDO-sivustolta:

**Yhteyden ottaja:**
- Nimi: ${name}
- Yritys: ${company}
- Sähköposti: ${email}
- Puhelinnumero: ${phone}

**Palvelutarve:**
${need}

**Tilanne:**
${message || '(ei kuvausta)'}

---
Lomaketäyttöaika: ${fillTime ? Math.round(fillTime / 1000) : 'tuntematon'} sekuntia
IP: ${req.headers['x-forwarded-for'] || 'tuntematon'}
`;

    // Send email using Resend (recommended) or SendGrid
    if (process.env.RESEND_API_KEY) {
      const response = await sendEmailResend(
        {
          to: process.env.CONTACT_EMAIL_TO || 'ville@vidosocial.com',
          from: 'noreply@vidosocial.com',
          subject: emailSubject,
          text: emailBody,
          replyTo: email,
        },
        process.env.RESEND_API_KEY
      );

      if (!response.success) {
        throw new Error(`Resend API error: ${response.error}`);
      }
    } else if (process.env.SENDGRID_API_KEY) {
      const response = await sendEmailSendGrid(
        {
          to: process.env.CONTACT_EMAIL_TO || 'ville@vidosocial.com',
          from: 'noreply@vidosocial.com',
          subject: emailSubject,
          text: emailBody,
          replyTo: email,
        },
        process.env.SENDGRID_API_KEY
      );

      if (!response.success) {
        throw new Error(`SendGrid API error: ${response.error}`);
      }
    }

    // Send confirmation email to user
    await sendConfirmationEmail(email, name, process.env.RESEND_API_KEY || process.env.SENDGRID_API_KEY);

    // Return success
    return res.status(200).json({
      code: 'SUCCESS',
      message: 'Kartoituspyyntö lähetetty onnistuneesti',
      data: {
        name,
        company,
        email,
      },
    });
  } catch (error) {
    console.error('Contact form error:', error);

    return res.status(500).json({
      code: 'INTERNAL_ERROR',
      message: 'Viestin lähettäminen epäonnistui. Yritä uudelleen myöhemmin.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

/**
 * Send email using Resend API
 */
async function sendEmailResend(emailData, apiKey) {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Send email using SendGrid API
 */
async function sendEmailSendGrid(emailData, apiKey) {
  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: emailData.to }],
            subject: emailData.subject,
          },
        ],
        from: { email: emailData.from },
        content: [
          {
            type: 'text/plain',
            value: emailData.text,
          },
        ],
        replyToList: [{ email: emailData.replyTo }],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.errors?.[0]?.message || 'Unknown error' };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Send confirmation email to user
 */
async function sendConfirmationEmail(userEmail, userName, apiKey) {
  const isResend = process.env.RESEND_API_KEY === apiKey;

  const confirmationBody = `
Kiitos kartoituspyynnöstäsi, ${userName}!

Olemme vastaanottaneet pyyntösi ja otamme sinuun yhteyttä pian.
Yleensä vastaus saapuu 1-2 työpäivän kuluessa.

Mikäli sinulla on kiireellisiä kysymyksiä, voit lähettää viestin WhatsAppissa:
https://wa.me/358xxxxxxxxx

Ystävällisin terveisin,
VIDO-tiimi
---
VIDO Social | Kotisivut ja markkinointi rakennusalalle
Y-tunnus 3581471-7
`;

  try {
    if (isResend) {
      await sendEmailResend(
        {
          to: userEmail,
          from: 'noreply@vidosocial.com',
          subject: 'VIDO: Kartoituspyyntösi vastaanotettu',
          text: confirmationBody,
        },
        apiKey
      );
    } else {
      await sendEmailSendGrid(
        {
          to: userEmail,
          from: 'noreply@vidosocial.com',
          subject: 'VIDO: Kartoituspyyntösi vastaanotettu',
          text: confirmationBody,
        },
        apiKey
      );
    }
  } catch (error) {
    // Log but don't fail - confirmation email is nice to have but not critical
    console.warn('Failed to send confirmation email:', error);
  }
}
