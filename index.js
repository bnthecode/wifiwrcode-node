const express = require("express");
const app = express();
const port = 8080;
const cors = require("cors");
app.use(cors());
require("dotenv").config();

const nodemailer = require("nodemailer");

app.get("/qrcode", async (req, res) => {
  const qrcode = require("wifi-qr-code-generator");

  const pr = await qrcode.generateWifiQRCode({
    ssid: process.env.WIFI_SSID,
    password: process.env.WIFI_PASSWORD,
    encryption: "WPA",
    hiddenSSID: false,
    outputFormat: { type: "image/png" },
  });

  const generateEmail = async () => {
    var transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
    });

    transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: process.env.RECEIVER_EMAIL,
      subject: "Hello friend, here is your QR Code",
      text: "QR Code",
      html: `<img src=${pr} />`,
    });
  };

  generateEmail();
  res.status(200).send(pr);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
