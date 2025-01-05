const User = require("../models/userModel");

const filterObj = (reqObj, ...allowedFields) => {
	const newObj = {};
	Object.keys(reqObj).forEach((ele) => {
		if (allowedFields.includes(ele)) {
			newObj[ele] = reqObj[ele];
		}
	});
	return newObj;
};

exports.getAllUsers = async (req, res, next) => {
	const users = await User.find();
	res.status(200).json({
		status: "success",
		data: {
			users,
		},
	});
};

exports.updateMe = async (req, res, next) => {
	// 1. Check If The User Tries To Change The Password
	if (req.body.password || req.body.confirmPassword) {
		return res.status(405).json({
			status: "failed",
			message:
				"This Route Is Not For Password Update, Please Use /updateMyPassword",
		});
	}

	// 2. Update User's Informartion
	const filteredObj = filterObj(req.body, "name", "email");
	const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredObj, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		status: "success",
		data: {
			user: updatedUser,
		},
	});
};

exports.deleteMe = async (req, res, next) => {
	await User.findByIdAndUpdate(req.user.id, { active: false });

	res.status(204).json({
		status: "success",
		message: "User Deleted Successfully",
	});
};
