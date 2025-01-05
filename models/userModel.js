const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: [true, "Please Enter A Email"],
		lowercase: true,
		unique: true,
		validate: [validator.isEmail, "Please Provide A Valid Email"],
	},
	role: {
		type: String,
		enum: ["user", "organizer", "admin"],
		default: "user",
	},
	password: {
		type: String,
		required: [true, "Please Enter A Password"],
		minLength: 8,
	},
	passwordConfirm: {
		type: String,
		required: [true, "Please Confirm Your Password"],
		validate: {
			validator: function (ele) {
				return this.password === ele;
			},
			message: "Passwords Do Not Match, Please Try Again!",
		},
	},
	active: {
		type: Boolean,
		default: true,
		select: false,
	},
	passwordChangedAt: Date,
	passwordResetToken: String,
	passwordResetExpires: Date,
});

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	this.password = await bcrypt.hash(this.password, 10);
	this.passwordConfirm = undefined;
	next();
});

userSchema.pre("save", function (next) {
	if (!this.isModified("password") || this.isNew) return next();

	this.passwordChangedAt = Date.now() - 1000;
	next();
});

userSchema.pre(/^find/, function (next) {
	this.find({ active: { $ne: false } });
	next();
});

userSchema.methods.checkPassword = async function (
	candidatePassword,
	userPassword
) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.checkForPasswordChange = function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const updatedTimestamp = this.passwordChangedAt.getTime() / 1000;
		return JWTTimestamp < updatedTimestamp;
	}
	// False Means NO PASSWORD Change
	return false;
};

userSchema.methods.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString("hex");

	this.passwordResetToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");

	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
	return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
