const inquirer = require("inquirer");

module.exports = () => {
	return inquirer.prompt({
		type: "confirm",
		name: "confirm",
		message: "Add another member?",
	});
};
