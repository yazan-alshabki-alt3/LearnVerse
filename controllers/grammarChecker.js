const axios = require("axios");

//  ======================  Grammar Checker ====================
const checkText = async (req, res) => {

    const text = req.body.text;
    const options = {
        method: "GET",
        url: `https://www.stands4.com/services/v2/grammar.php?uid=12516&tokenid=Qw3f7psXqFyg6r1S&text=${text}&format=json`,
        headers: {
            "content-type": "application/json",
        },
    };
    try {
        const response = await axios.request(options);
        let data = [];
        for (let i = 0; i < response.data.matches.length; i++) {
            data.push({
                index: response.data.matches[i].offset,
                length: response.data.matches[i].length,
                correct: response.data.matches[i].replacements[0]
            });
        }
        return res.status(201).json({
            success: true,
            message: `The text has been corrected !`,
            text: text,
            data: data
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong, try again later.",
        });
    }
}


const grammarCheckerController = {
    checkText
};
module.exports = grammarCheckerController;


