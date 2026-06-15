function healthcheck(req, res) {
  const data = {
    status: 'ok',
    timestamp: new Date().toISOString(),
  };

  const accept = req.headers.accept || '';
  const prefersHtml =
    accept.includes('text/html') && !accept.includes('application/json');

  if (prefersHtml) {
    return res.status(200).type('html').send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Healthcheck</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      background: #f5f5f5;
      color: #1a1a1a;
      margin: 2rem;
    }
    h1 { color: #1a1a1a; }
    pre {
      background: #fff;
      border: 1px solid #ddd;
      padding: 1rem;
      border-radius: 4px;
      color: #1a1a1a;
    }
    a { color: #0066cc; }
  </style>
</head>
<body>
  <h1>API Status: ${data.status}</h1>
  <p>Timestamp: ${data.timestamp}</p>
  <pre>${JSON.stringify(data, null, 2)}</pre>
  <p><a href="/api-docs">API Documentation</a></p>
</body>
</html>`);
  }

  res.status(200).json(data);
}

module.exports = {
  healthcheck,
};
