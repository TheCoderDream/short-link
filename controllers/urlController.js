const URLModel = require("../models/url");

async function shortenUrl(url) {
	try {
		let thisURL = await URLModel.find({ url: url });

		if (thisURL.length) {
			return thisURL[0].shortenUrl;
		} else {
			const newURL = new URLModel({ url: url});
			await newURL.save();
			return newURL.shortenUrl;
		}
	} catch (err) {
		console.error(err);
	}
}

async function findActualUrl(path) {
	try {
		let thisUrl = await URLModel.findOne({ shortenUrl: path });

		if (thisUrl !== null) {
			thisUrl.clicks++;
			await thisUrl.save();
			return thisUrl;
		} else {
			return null;
		}
	} catch (err) {
		console.error(err);
	}
}

function getAllUrls() {
	return URLModel.find({});
}

const urlController = {
	shortenUrl,
	findActualUrl,
	getAllUrls
};

module.exports = urlController;
