const path = require('path');

const get = async (req, res) => {
    try {
        res.sendFile(path.join(__dirname + "/../views/index.html"));

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

module.exports.get = get;