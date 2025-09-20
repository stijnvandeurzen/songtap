export async function onRequest(context) {
  const { request } = context;
  try {
    // 1. Parse JSON body (await the promise to get the actual data)
    const { code, verifier } = await request.json();
    if (!code || !verifier) {
      return new Response(JSON.stringify({ error: "Missing code or verifier" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 2. Prepare URL-encoded form data for Spotify token request
    const params = new URLSearchParams({
      client_id: "YOUR_SPOTIFY_CLIENT_ID",              // e.g. d9496da4c257489e8a23ab7d41069b15
      grant_type: "authorization_code",
      code: code,
      redirect_uri: "https://song-tap.com/callback.html",
      code_verifier: verifier
    });

    // 3. Send POST request to Spotify’s token endpoint with proper headers
    const spotifyRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString()  // send form-encoded data (URLSearchParams -> "key=value&...")
    });

    // 4. Read Spotify’s response and forward it back to the client
    const responseBody = await spotifyRes.text();  // Spotify responds with JSON string
    return new Response(responseBody || "{}", {
      status: spotifyRes.status,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    // Handle any unexpected errors
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
