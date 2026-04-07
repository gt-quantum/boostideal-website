export async function onRequestPost(context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  try {
    const { name, email, company, market } = await context.request.json();
    const webhookUrl = context.env.SLACK_WEBHOOK_URL;
    if (!webhookUrl) {
      return new Response(JSON.stringify({ error: 'Webhook not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    const payload = {
      blocks: [
        {
          type: 'header',
          text: { type: 'plain_text', text: '🎯 New design partner application', emoji: true }
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: '*Name*\n' + (name || '—') },
            { type: 'mrkdwn', text: '*Email*\n' + (email || '—') },
            { type: 'mrkdwn', text: '*Company*\n' + (company || '—') },
            { type: 'mrkdwn', text: '*Sells into*\n' + (market || '—') }
          ]
        },
        {
          type: 'context',
          elements: [{ type: 'mrkdwn', text: 'Submitted ' + new Date().toUTCString() }]
        }
      ]
    };
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return new Response(JSON.stringify({ ok: response.ok }), {
      status: response.ok ? 200 : 502,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to submit' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
