const CLIENT_ID = "2e2965c7459f4bc19f041cf2bb6095c6";
const CLIENT_SECRET = "bc5a853e4367432595aa97e5b942f660";
const REDIRECT_URI = "https://inquisitive-semolina-2138f1.netlify.app/callback";

exports.handler = async (event) => {
  const code = event.queryStringParameters?.code;
  if (!code) {
    return { statusCode: 400, body: "Missing code" };
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
    },
    body: body.toString(),
  });

  const data = await response.json();

  if (!response.ok) {
    return { statusCode: 500, body: JSON.stringify(data) };
  }

  return {
    statusCode: 302,
    headers: {
      Location: `/?token=${data.access_token}`,
    },
    body: "",
  };
};
