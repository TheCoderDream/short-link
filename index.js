const http = require("http");
const fs = require("fs");
const mongoose = require("mongoose");
const { shortenUrl, findActualUrl, getAllUrls } = require("./controllers/urlController");

mongoose
	.connect(
		"mongodb+srv://emre:8d4AKSzkaQdbPpfk@cluster0.gktxr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		}
	)
	.then(() => createAndRunServer());

function createAndRunServer() {
	let url = "";
	let history;

	const server = http.createServer(async (req, res) => {
		let response;
		try {
			response = await findActualUrl(req.url);
			if (response) {
				res.writeHead(301, { Location: response.url });
				return res.end();
			}
		} catch (err) {
			console.error(err);
		}

		res.setHeader("Content-type", "text/html");
		let path = "";
		res.statusCode = 200;

		switch (req.url) {
			case "/":
				history = await getAllUrls();
				path = "index.html";
				break;
			case "/shorten":
				path = "shortenlink.html";

				if (req.method == "POST") {
					let data = "";
					req.on("data", (chunk) => {
						data += chunk;
					}).on("end", () => {
						url = decodeURIComponent(data.toString());
					});
				}

				break;
			default:
				path = "error.html";
				res.statusCode = 404;
				break;
		}

		fs.readFile(`./views/${path}`, async (err, data) => {
			if (err) {
				console.error(err);
				res.write("Server Error");
				res.end();
			} else {
				url = url.replace("url=", "");
				let shortenURL = await shortenUrl(url);
				console.log(shortenURL);
				data = data.toString().replace("{{url}}", url);
				data = data.toString().replace(/{{shortenURL}}/
					, shortenURL.shortenUrl);
				if (history) {
					data = data.toString().replace("{{history}}", `
					 <ul>${history.reduce((acc, item) => acc + 
						`<li><strong>Actual link: </strong> <a href="${item.url}">${item.url}</a>, <strong>Shorted link</strong> <a href="${"http://localhost:8008" + item.shortenUrl}">${item.shortenUrl}</a>, <strong>Clicked: </strong> ${item.clicks}</li>`, '')}
					 </ul>
					`)
				}
				res.write(data, "utf-8");
				res.end();
			}
		});
	});

	server.listen(8008, "localhost", () => {
		console.log("Server is listening on 8008");
	});
}
