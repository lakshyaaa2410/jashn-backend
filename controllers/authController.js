const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const sendMail = require("../utils/email");
const crypto = require("crypto");

require("dotenv").config();

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: "7d",
	});
};

const createSendToken = (user, statusCode, res) => {
	const token = signToken(user._id);
	res.status(statusCode).json({
		status: "success",
		token,
		data: {
			user,
		},
	});
};

exports.signup = async function (req, res) {
	const newUser = {
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
		passwordChangedAt: req.body.passwordChangedAt,
		role: req.body.role,
	};

	try {
		const data = await User.create(newUser);
		if (data) {
			const token = signToken(data._id);
			return res.status(201).json({
				status: "success",
				token: token,
				data: {
					data,
				},
			});
		}

		return res.status(404).json({
			status: "failed",
			message: "Cannot Create A User, Please Try Again",
		});
	} catch (err) {
		res.status(500).json({
			status: "failed",
			message: err.message,
		});
	}
};
exports.signup = async function (req, res) {
	const newUser = {
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
		passwordChangedAt: req.body.passwordChangedAt || null,
		role: req.body.role,
	};

	try {
		const data = await User.create(newUser);
		if (data) {
			console.log("User Created Successfully!");

			const token = signToken(data._id);
			return res.status(201).json({
				status: "success",
				token: token,
				data: {
					data,
				},
			});
		}

		return res.status(404).json({
			status: "failed",
			message: "Cannot Create A User, Please Try Again",
		});
	} catch (err) {
		res.status(500).json({
			status: "failed",
			message: err.message,
		});
	}
};

exports.login = async function (req, res) {
	// 1. Checking If Email And Password Are Present
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(502).json({
			status: "failed",
			message: "Please Enter Email And Password",
		});
	}

	// 2. Checking If The User Exists And Password Is Correct
	const user = await User.findOne({ email }).select("+password");
	if (!user || !(await user.checkPassword(password, user.password))) {
		return res.status(502).json({
			status: "failed",
			message: "Incorrect Email Or Password",
		});
	}

	// 3. Everything Okay!
	const token = signToken(user._id);
	res.status(200).json({
		status: "sucess",
		token,
	});
};

exports.protect = async function (req, res, next) {
	let token;

	// 1. Checking If The Token Exists.
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	}

	if (!token) {
		return res.status(401).json({
			status: "failed",
			message: "You Are Not Logged In, Please Login To Continue",
		});
	}

	// 2. Verification Of The Token
	let decodedPayload;
	try {
		decodedPayload = await promisify(jwt.verify)(
			token,
			process.env.JWT_SECRET
		);
	} catch (err) {
		return res.status(401).json({
			status: "failed",
			message: "Token verification failed. Please log in again!",
		});
	}

	// 3. Checking If The User Still Exists
	const freshUser = await User.findById(decodedPayload.id);
	if (!freshUser) {
		return res.status(401).json({
			status: "failed",
			message: "The User Belonging To This Token Does Not Exists",
		});
	}

	// 4. Checking If The Password Was Changed Ater TOKEN Assigned
	if (freshUser.checkForPasswordChange(decodedPayload.iat)) {
		return res.status(401).json({
			status: "failed",
			message: "Password Changed Recently, Please Login Again!",
		});
	}

	req.user = freshUser;
	next();
};

exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			res.status(403).json({
				status: "failed",
				message: "You Do Not Have The Access To Perform This Action",
			});
		}

		next();
	};
};

exports.forgotPassword = async function (req, res, next) {
	const { email } = req.body;
	const user = await User.findOne({ email });

	if (!user) {
		return res.status(404).json({
			status: "failed",
			message: "No User Found With This Email Address",
		});
	}

	const resetToken = user.createPasswordResetToken();
	await user.save({ validateBeforeSave: false });

	const resetURL = `${req.protocol}://${req.get(
		"host"
	)}/api/v1/users/resetPassword/${resetToken}`;

	const message = `Forgot Your Password? Sumbit A PATCH Request With Your New Password And Password Confirm To: ${resetURL}`;

	try {
		await sendMail({
			email: user.email,
			subject: "Password Reset Token For Jashn (Valid For 10 Minutes)",
			message,
		});

		res.status(200).json({
			status: "success",
			message: "Token Sent To Email",
		});
	} catch (err) {
		console.log(err.message);
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save({ validateBeforeSave: false });

		res.status(500).json({
			status: "failed",
			message: "Error While Sending Mail",
		});
	}
};

exports.resestPassword = async function (req, res, next) {
	const hashedToken = crypto
		.createHash("sha256")
		.update(req.params.token)
		.digest("hex");

	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() },
	});

	if (!user) {
		return res.status(400).json({
			status: "failed",
			message: "Token Is Invalid Or Expired",
		});
	}

	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;

	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;

	await user.save();

	const token = signToken(user._id);
	res.status(200).json({ status: "success", token });
};

exports.updatePassword = async function (req, res, next) {
	const user = await User.findById(req.user.id).select("+password");

	if (!(await user.checkPassword(req.body.passwordCurrent, user.password))) {
		return res.status(401).json({
			status: "failed",
			message: "The Entered Password Is Incorrect",
		});
	}

	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;

	await user.save();

	createSendToken(user, 200, res);
};
