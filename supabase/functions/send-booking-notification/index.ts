import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Phone validation regex (international format)
const PHONE_REGEX = /^[\d\s\-+()]{0,20}$/;

/**
 * Validates email format
 */
function isValidEmail(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 255 && EMAIL_REGEX.test(value);
}

/**
 * Validates phone format (optional field)
 */
function isValidPhone(value: unknown): boolean {
  if (value === null || value === undefined || value === '') return true;
  return typeof value === 'string' && PHONE_REGEX.test(value);
}

/**
 * Sanitizes a string for safe HTML display (prevents XSS)
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sanitizes and truncates a string
 */
function sanitizeString(value: unknown, maxLength: number = 500): string {
  if (typeof value !== 'string') return '';
  return escapeHtml(value.slice(0, maxLength));
}

/**
 * Validates booking object structure
 */
function isValidBooking(booking: unknown): booking is {
  name: string;
  email: string;
  company: string;
  role: string;
  phone?: string;
  preferredTime: string;
  specificNeeds?: string;
} {
  if (!booking || typeof booking !== 'object') return false;
  const b = booking as Record<string, unknown>;
  return (
    typeof b.name === 'string' && b.name.length > 0 && b.name.length <= 200 &&
    isValidEmail(b.email) &&
    typeof b.company === 'string' && b.company.length > 0 && b.company.length <= 200 &&
    typeof b.role === 'string' && b.role.length > 0 && b.role.length <= 100 &&
    isValidPhone(b.phone) &&
    typeof b.preferredTime === 'string' && b.preferredTime.length <= 100
  );
}

/**
 * Validates service object structure
 */
function isValidService(service: unknown): service is {
  type: string;
  title: string;
  priority: string;
  reasoning?: string;
  nextSteps?: string[];
} {
  if (!service || typeof service !== 'object') return false;
  const s = service as Record<string, unknown>;
  const validTypes = ['consultation', 'workshop', 'assessment', 'implementation'];
  const validPriorities = ['high', 'medium', 'low'];
  return (
    typeof s.type === 'string' && validTypes.includes(s.type) &&
    typeof s.title === 'string' && s.title.length > 0 && s.title.length <= 200 &&
    typeof s.priority === 'string' && validPriorities.includes(s.priority)
  );
}

/**
 * Validates lead score object structure
 */
function isValidLeadScore(score: unknown): score is {
  overall: number;
  qualification: Record<string, number>;
  readiness: Record<string, number>;
  engagement: Record<string, number>;
} {
  if (!score || typeof score !== 'object') return false;
  const s = score as Record<string, unknown>;
  return (
    typeof s.overall === 'number' && s.overall >= 0 && s.overall <= 100 &&
    typeof s.qualification === 'object' && s.qualification !== null &&
    typeof s.readiness === 'object' && s.readiness !== null &&
    typeof s.engagement === 'object' && s.engagement !== null
  );
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse and validate request body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      console.error('Invalid JSON in request body');
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!body || typeof body !== 'object') {
      return new Response(
        JSON.stringify({ error: 'Request body must be an object' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { booking, service, leadScore, sessionId } = body as {
      booking?: unknown;
      service?: unknown;
      leadScore?: unknown;
      sessionId?: unknown;
    };

    // Validate all required fields
    if (!isValidBooking(booking)) {
      console.warn('Invalid booking data received');
      return new Response(
        JSON.stringify({ error: 'Invalid booking data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!isValidService(service)) {
      console.warn('Invalid service data received');
      return new Response(
        JSON.stringify({ error: 'Invalid service data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!isValidLeadScore(leadScore)) {
      console.warn('Invalid leadScore data received');
      return new Response(
        JSON.stringify({ error: 'Invalid lead score data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (typeof sessionId !== 'string' || sessionId.length === 0 || sessionId.length > 100) {
      console.warn('Invalid sessionId');
      return new Response(
        JSON.stringify({ error: 'Invalid session ID' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing booking notification', { 
      serviceType: service.type, 
      leadScore: leadScore.overall,
      sessionId: sessionId.substring(0, 8)
    });

    // Create booking request record with sanitized data
    const { error: bookingError } = await supabase
      .from('booking_requests')
      .upsert({
        session_id: sanitizeString(sessionId, 100),
        service_type: service.type,
        service_title: sanitizeString(service.title, 200),
        contact_name: sanitizeString(booking.name, 200),
        contact_email: booking.email.toLowerCase().trim(),
        company_name: sanitizeString(booking.company, 200),
        role: sanitizeString(booking.role, 100),
        phone: booking.phone ? sanitizeString(booking.phone, 20) : null,
        preferred_time: sanitizeString(booking.preferredTime, 100),
        specific_needs: booking.specificNeeds ? sanitizeString(booking.specificNeeds, 1000) : null,
        lead_score: Math.min(100, Math.max(0, Math.round(leadScore.overall))),
        priority: service.priority,
        status: 'pending'
      });

    if (bookingError) {
      console.error('Error saving booking request:', bookingError);
    }

    // Prepare email content with escaped HTML
    const serviceTypeMap: Record<string, string> = {
      consultation: 'Executive AI Strategy Session',
      workshop: 'AI Leadership Workshop',
      assessment: 'AI Readiness Assessment',
      implementation: 'AI Implementation Partnership'
    };

    const priorityEmoji: Record<string, string> = {
      high: '🔥',
      medium: '⭐',
      low: '📋'
    };

    const safeName = sanitizeString(booking.name, 200);
    const safeEmail = escapeHtml(booking.email);
    const safeCompany = sanitizeString(booking.company, 200);
    const safeRole = sanitizeString(booking.role, 100);
    const safePhone = booking.phone ? sanitizeString(booking.phone, 20) : 'Not provided';
    const safePreferredTime = sanitizeString(booking.preferredTime, 100);
    const safeSpecificNeeds = booking.specificNeeds ? sanitizeString(booking.specificNeeds, 1000) : '';
    const safeReasoning = service.reasoning ? sanitizeString(service.reasoning, 1000) : '';
    const safeNextSteps = (service.nextSteps || []).slice(0, 10).map((step: string) => sanitizeString(step, 200));

    const emailSubject = `${priorityEmoji[service.priority] || '📋'} New ${serviceTypeMap[service.type] || 'Service'} Booking Request - Lead Score: ${leadScore.overall}`;

    const emailHtml = `
      <h2>New Booking Request</h2>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Service Details</h3>
        <p><strong>Service:</strong> ${escapeHtml(service.title)}</p>
        <p><strong>Priority:</strong> ${service.priority.toUpperCase()} ${priorityEmoji[service.priority] || '📋'}</p>
        <p><strong>Lead Score:</strong> ${leadScore.overall}/100</p>
      </div>

      <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Contact Information</h3>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
        <p><strong>Company:</strong> ${safeCompany}</p>
        <p><strong>Role:</strong> ${safeRole}</p>
        <p><strong>Phone:</strong> ${safePhone}</p>
        <p><strong>Preferred Time:</strong> ${safePreferredTime}</p>
      </div>

      <div style="background: #f3e5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Lead Qualification Breakdown</h3>
        <ul>
          <li><strong>Business Readiness:</strong> ${(leadScore.qualification.budget || 0) + (leadScore.qualification.authority || 0) + (leadScore.qualification.need || 0) + (leadScore.qualification.timeline || 0)}/100</li>
          <li><strong>AI Readiness:</strong> ${(leadScore.readiness.aiMaturity || 0) + (leadScore.readiness.teamReadiness || 0) + (leadScore.readiness.organizationSize || 0)}/50</li>
          <li><strong>Engagement Level:</strong> ${Math.min((leadScore.engagement.sessionDuration || 0) + (leadScore.engagement.messageCount || 0) + (leadScore.engagement.topicsExplored || 0), 30)}/30</li>
        </ul>
      </div>

      ${safeSpecificNeeds ? `
        <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Specific Needs</h3>
          <p>${safeSpecificNeeds}</p>
        </div>
      ` : ''}

      <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>AI Recommendation Reasoning</h3>
        <p>${safeReasoning}</p>
        
        <h4>Recommended Next Steps:</h4>
        <ul>
          ${safeNextSteps.map((step: string) => `<li>${step}</li>`).join('')}
        </ul>
      </div>

      <div style="margin-top: 30px; padding: 20px; background: #f5f5f5; border-radius: 8px;">
        <p><strong>Session ID:</strong> ${sanitizeString(sessionId, 100)}</p>
        <p><em>This booking was generated from the AI Assessment Chat based on the user's conversation and qualification scores.</em></p>
      </div>
    `;

    // Send email using Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'AI Assessment <noreply@fractional-ai.com>',
        to: ['hello@fractional-ai.com'],
        subject: emailSubject,
        html: emailHtml,
        reply_to: booking.email
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error('Resend API error:', errorData);
      throw new Error(`Email sending failed: ${emailResponse.status}`);
    }

    const emailResult = await emailResponse.json();
    console.log('Email sent successfully:', emailResult.id);

    // Send confirmation email to the user
    const confirmationHtml = `
      <h2>Thank you for your booking request!</h2>
      
      <p>Hi ${safeName},</p>
      
      <p>We've received your request for <strong>${escapeHtml(service.title)}</strong> and will contact you within 24 hours to schedule your session.</p>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>What's Next?</h3>
        <ul>
          ${safeNextSteps.map((step: string) => `<li>${step}</li>`).join('')}
        </ul>
      </div>
      
      <p>Based on your AI Assessment, we've identified this as a ${service.priority} priority opportunity for your organization.</p>
      
      <p>If you have any immediate questions, feel free to reply to this email or call us at +1 (234) 567-8900.</p>
      
      <p>Best regards,<br>
      The Fractional AI Team</p>
    `;

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Fractional AI <hello@fractional-ai.com>',
        to: [booking.email],
        subject: `Confirmation: Your ${escapeHtml(service.title)} Request`,
        html: confirmationHtml
      }),
    });

    // Log the successful booking for analytics (no sensitive data in metadata)
    await supabase
      .from('security_audit_log')
      .insert({
        action: 'booking_request_submitted',
        resource_type: 'booking',
        metadata: {
          service_type: service.type,
          lead_score: leadScore.overall,
          priority: service.priority,
          session_id: sessionId.substring(0, 20)
        }
      });

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResult.id 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Error in booking notification function:', error);
    // Don't expose internal error details
    return new Response(JSON.stringify({ 
      error: 'Failed to process booking notification'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
