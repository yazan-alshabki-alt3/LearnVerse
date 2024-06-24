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
        try {
            const response = await axios.request(options);
            let responseFinal = response.data;
            for (let i = 0; i < responseFinal.length; i++) {
                for (let key in responseFinal[i]) {
                    if (Array.isArray(responseFinal[i][key]) && responseFinal[i][key].length === 0) {
                        responseFinal[i][key] = ["null"]
                    }
                    for (let key2 in responseFinal[i][key]) {
                        if (Array.isArray(responseFinal[i][key][key2]) && responseFinal[i][key][key2].length === 0) {
                            responseFinal[i][key][key2] = ["null"]
                        }
                        for (let key3 in responseFinal[i][key][key2]) {
                            if (Array.isArray(responseFinal[i][key][key2][key3]) && responseFinal[i][key][key2][key3].length === 0) {
                                responseFinal[i][key][key2][key3] = ["null"]
                            }
                            for (let key4 in responseFinal[i][key][key2][key3]) {
                                if (Array.isArray(responseFinal[i][key][key2][key3][key4]) && responseFinal[i][key][key2][key3][key4].length === 0) {
                                    responseFinal[i][key][key2][key3][key4] = ["null"]
                                }
                                for (let key5 in responseFinal[i][key][key2][key3][key4]) {
                                    if (Array.isArray(responseFinal[i][key][key2][key3][key4][key5]) && responseFinal[i][key][key2][key3][key4][key5].length === 0) {
                                        responseFinal[i][key][key2][key3][key4][key5] = ["null"]
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return res.status(200).json({
                success: true,
                message: "This is the definition !!",
                data: responseFinal
            });

        } catch (err) {
            return res.status(404).json({
                success: false,
                message: "Sorry, we couldn't find definitions for the word you were looking for."
            });
        }

    } catch (error) {
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
