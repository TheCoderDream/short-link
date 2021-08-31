const { shortenUrl, findActualUrl } = require("../controllers/urlController");
const URLModel = require("../models/url");

jest.mock("../models/url");

URLModel.find = jest.fn();
URLModel.findOne = jest.fn();

describe("Test for shrotenUrl", () => {
	it("should create shortened-url when url does not exist in a database", async () => {
		const save = jest.fn();

		URLModel.find.mockImplementation(() => []);
		// console.log(URLModel);
		URLModel.mockImplementation(() => ({ save }));

		let response = await shortenUrl("https://www.testurl.test");
		expect(response).toBeDefined();
		expect(response.length).toBe(6);
		expect(save).toHaveBeenCalled();
		expect(URLModel.find).toHaveBeenCalled();
	});

	it("should return shortened-url when url exist in database", async () => {
		const save = jest.fn();

		URLModel.find.mockImplementation(() => [{ shortenUrl: "/Uea23" }]);
		// console.log(URLModel);
		URLModel.mockImplementation(() => ({ save }));

		let response = await shortenUrl("https://www.testurl.test");
		expect(URLModel.find).toHaveBeenCalled();
		expect(response).toBeDefined();
		expect(response.length).toBe(6);
		expect(save).not.toHaveBeenCalled();
	});
});

describe("Test for findShortenUrl", () => {
	it("should return actual-url if it exist in database", async () => {
		URLModel.findOne.mockImplementation(() => ({ url: "https://www.testurl.test" }));

		let response = await findActualUrl("/Uea23");
		expect(URLModel.findOne).toHaveBeenCalled();
		expect(response).toBeDefined();
		expect(response).toBe("https://www.testurl.test");
	});

	it("should return null if it does not exist in database", async () => {
		URLModel.findOne.mockImplementation((res) => {
			expect(res.shortenUrl).toBeDefined();
			return null;
		});

		let response = await findActualUrl(".Uea23");
		expect(URLModel.findOne).toHaveBeenCalled();
		expect(response).toBeNull();
	});
});
