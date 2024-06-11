const axios = require("axios");

// ============= dictionary words =============

const searchDefinition = async (req, res) => {
    const word = req.body.word;
    let originUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/";
    originUrl += word;
    const options = {
        method: "GET",
        url: originUrl,
        headers: {
            "content-type": "application/json",
        },
    };
    try {
        const response = await axios.request(options);
        return res.status(200).json({
            success: true,
            message: "This is the definition !!",
            data: response.data
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong, try again later.",
        });
    }
};

const dictionaryController = {
    searchDefinition,
};
module.exports = dictionaryController;
