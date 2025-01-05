const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
	const transporter = nodemailer.createTransport({
		host: "sandbox.smtp.mailtrap.io",
		port: 2525,
		auth: {
			user: "8427723461cd63",
			pass: "76afb7ef130f7f",
		},
	});

	const mailOptions = {
		from: "help@jashn.in",
		to: options.email,
		subject: options.subject,
		text: options.message,
	};
	await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
