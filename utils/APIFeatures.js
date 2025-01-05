class APIFeatures {
	constructor(queryStr, methodStr) {
		this.queryStr = queryStr;
		this.methodStr = methodStr;
	}

	search() {
		const queryObj = { ...this.methodStr };
		let tem = JSON.stringify(queryObj);
		return tem;
	}
}

module.exports = APIFeatures;
