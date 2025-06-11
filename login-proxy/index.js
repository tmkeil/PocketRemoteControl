const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  next();
});

app.get("/check-status", async (req, res) => {
  const newURL = req.query.newURL;
  try {
    const cloudflareUrl = `${newURL}/validate`;

    const response = await fetch(cloudflareUrl, {
      method: "GET",
      headers: {
        Authorization: req.headers.authorization,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    console.log("Data: ", data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error" });
  }
});

app.get("/status", async (req, res) => {
  const newURL = req.query.newURL;
  try {
    const cloudflareUrl = `${newURL}/status`;

    const response = await fetch(cloudflareUrl, {
      method: "GET",
      headers: {
        Authorization: req.headers.authorization,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error" });
  }
});

app.post("/shutdown", async (req, res) => {
  const newURL = req.query.newURL;
  try {
    const cloudflareUrl = `${newURL}/shutdown`;

    const response = await fetch(cloudflareUrl, {
      method: "POST",
      headers: {
        Authorization: req.headers.authorization,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy-Server running on http://local_ip:${PORT}`);
});
