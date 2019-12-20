const database = require('../database/connection');
const imgur = require('imgur');
const config = require('../helpers/config');

imgur.setCredentials(config.imgur_username, config.imgur_password, config.imgur_clientId);

exports.upload_image = (req, res) => {
    try {
        var image = req.body.image;

        imgur.uploadBase64(image)
            .then((json) => {
                console.log(json.data.link);
                res.status(200).json({ image: json.data.link });
            })
            .catch(function (err) {
                console.error(err.message);
                res.status(202).json({ message: "Không xử lý được yêu cầu" });
            });
    } catch (e) {
        console.dir(e);
        res.status(500).json({ message: "Đã có lỗi xảy ra" });
    }
};

