const axios = require("axios");
const fs = require('fs');
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
const gTTS = require("gtts");

// ====================== Translate and get the voice =============================

const translateText = async (req, res) => {
  const { text, language } = req.body;
  const options = {
    method: "POST",
    url: "https://api.translateplus.io/v1/translate",
    headers: {
      "content-type": "application/json",
      "X-API-KEY": "3a2cf99ba08121d9866db3e69d31a76e2ac117c7",
    },
    data: {
      text: text,
      source: "auto",
      target: language,
    },
  };
  try {
    const response = await axios.request(options);

    const sourceOutputFilePath = Date.now() + "output.mp3";
    const targetOutputFilePath = Date.now() + "01" + "output.mp3";

    let sourceURL;
    let targetURL;

    const sourceVoicePromise = new Promise((resolve, reject) => {
      let sourceVoice = new gTTS(text, response.data.translations.source);
      sourceVoice.save(sourceOutputFilePath, async (err, result) => {
        if (err) {
          fs.unlinkSync(sourceOutputFilePath);
          reject(new Error(err));
        } else {
          const uploadResult = await cloudinary.uploader.upload(sourceOutputFilePath, {
            resource_type: "video",
          });
          sourceURL = uploadResult.secure_url;
          fs.unlinkSync(sourceOutputFilePath);
          resolve();
        }
      });
    });

    const targetVoicePromise = new Promise((resolve, reject) => {
      let targetVoice = new gTTS(response.data.translations.translation, response.data.translations.target);
      targetVoice.save(targetOutputFilePath, async (err, result) => {
        if (err) {
          fs.unlinkSync(targetOutputFilePath);
          reject(new Error(err));
        } else {
          const uploadResult = await cloudinary.uploader.upload(targetOutputFilePath, {
            resource_type: "video",
          });
          targetURL = uploadResult.secure_url;
          fs.unlinkSync(targetOutputFilePath);
          resolve();
        }
      });
    });

    await Promise.all([sourceVoicePromise, targetVoicePromise]);

    return res.status(201).json({
      success: true,
      message: "Text Is Translated Successfully",
      data: response.data.translations.translation,
      audios: { sourceURL, targetURL }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, try again later.",
    });
  }
};

const translateController = {
  translateText,
};
module.exports = translateController;
