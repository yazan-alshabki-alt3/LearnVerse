const axios = require("axios");

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
    console.log(response.data.translations.translation);
    return res.status(201).json({
      success: true,
      message: "Text Is Translated Successfully",
      data: response.data.translations.translation,
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
