import nodeMailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const HTML_TEMPLATE = ({ userName, code, userId }) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Learn Verse</title>
  <style>
    body {
      padding: 0px;
      margin: 0px;
    }
    a {
      text-decoration: none;
    }
    .brandSection {
      width: 100%;
      background-color: #7c3e66;
      padding: 30px;
      text-align: left;
    }
    .brand {
      width: 70%;
      font-size: 40px;
      color: #f6f2f2;
    }
    .content {
      padding: 5px;
      background-color: #fffaf4 !important;
      color: #530554;
      border: solid #7c3e66;
      font-size: large;
      line-height: 22pt;
    }
    .activate {
      border: none;
      border-radius: 5px;
      padding: 10px;
      background-color: #7c3e66;
      color: #f6f6f6;
      cursor: pointer;
    }
    .activate:hover {
      background-color: #ffe7cc;
      color: #7c3e66;
    }
    .details {
      width: 70%;
      color: #530554;
    }
    .center {
      text-align: center;
    }
    .ContentLabel {
      color: #530554;
      margin-top: 10px;
      font-weight: 900;
      font-size: larger;
    }
    .title{
      color: #f6f6f6;
    }
    td {
      padding: 15px;
    }
  </style>
</head>

<body>
  <table>
    <tr>
      <td colspan="3" class="brandSection">
        <h1 class="title">LearnVerse</h1>
      </td>
      <td></td>
    </tr>
    <tr>
      <td><label class="ContentLabel" for="content">Content:</label></td>
    </tr>
    <tr>
      <td>
        <p class="content" name="content">
          Hello ${userName},<br />
          You have registered on our website to activate your account, please
          click on the button below.
        </p>
      </td>
    </tr>
    <tr>
      <td colspan="1" class="center">
        <a href="${process.env.URL_HOST}/user/login/${code}/${userId}">
          <button class="activate">Activate Account</button></a
        >
      </td>
    </tr>
  </table>
</body>
</html>  
  `;
};
const transporter = nodeMailer.createTransport({
  host: process.env.HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
const sendEmail = async (mailDetails, callback) => {
  try {
    const info = await transporter.sendMail(mailDetails);
    callback(info);
  } catch (err) {
    console.log(err);
  }
};
export default async (email, userName, code, userId) => {
  const options = {
    from: `LearnVerse < ${process.env.EMAIL} >`, // sender address
    to: email, // receiver email
    subject: "Here we activate your account in LearnVerse website",
    html: HTML_TEMPLATE({ userName, code, userId }),
  };
  await sendEmail(options, (info) => {
    console.log(info.messageId);
  });
};
