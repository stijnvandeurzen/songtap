// functions/token-exchange.js
export async function onRequest(context) {
  const req = context.request;
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }
  
  let payload;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
  
  const { code, verifier } = payload;
  if (!code || !verifier) {
    return new Response(JSON.stringify({ error: 'Missing code or verifier' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
  
  // Prepare form parameters for Spotify token exchange:contentReference[oaicite:11]{index=11}:contentReference[oaicite:12]{index=12}
  const params = new URLSearchParams({
    client_id: 'd9469dc4e627498e8c23ab7641069b15',
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: 'https://song-tap.com/callback.html',
    code_verifier: verifier
  });
  
  // Call Spotify API
  const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
  
  const result = await tokenResponse.json();
  const status = tokenResponse.ok ? 200 : tokenResponse.status;
  return new Response(JSON.stringify(result), { status, headers: { 'Content-Type': 'application/json' } });
}
