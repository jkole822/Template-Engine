const Manager = require("./lib/Manager");
const inquirer = require("inquirer");
const generateRandomId = require("./generateRandomId");

const members = [];

const promptAddMember = () => {
	return inquirer.prompt([
		{
			type: "list",
			name: "role",
			message: "Employee Role:",
			choices: ["Manager"],
			when: !members.some(member => member instanceof Manager),
		},
		{
			type: "list",
			name: "role",
			message: "Employee Role:",
			choices: ["Engineer", "Intern"],
			when: members.some(member => member instanceof Manager),
		},
		{
			type: "input",
			name: "name",
			message: "Employee Name:",
			validate(input) {
				const regex = /[-!@#$%^&*()_+|~=`{}\[\]:";'<>?,.\/]|\d/;

				if (!input) {
					return console.log("\nName required");
				} else if (input.match(regex)) {
					return console.log("\nName cannot include numbers or symbols");
				}

				return true;
			},
		},
		{
			type: "input",
			name: "id",
			message: "Employee ID:",
			default: generateRandomId(),
			validate(input) {
				const regex = /[-!@#$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/;

				if (!input) {
					return console.log("\nEmployee ID required");
				} else if (input.match(regex)) {
					return console.log("\nID cannot include symbols");
				}

				return true;
			},
		},
		{
			type: "input",
			name: "email",
			message: "Employee email:",
			// Uses regex from https://emailregex.com/ for email validation if an email is provided
			validate(input) {
				const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

				if (!input) {
					return console.log("\nEmail required");
				} else if (!input.match(regex)) {
					return console.log("\nInvalid email");
				}

				return true;
			},
		},
		{
			type: "input",
			name: "officeNumber",
			message: "Office Number:",
			when: answers => answers.role === "Manager",
			validate(input) {
				const regex = /\D/;

				if (!input) {
					return console.log("\nOffice number required");
				} else if (input.match(regex)) {
					return console.log("\nOffice number can only include numbers");
				}

				return true;
			},
		},
		{
			type: "input",
			name: "github",
			message: "GitHub Username:",
			when: answers => answers.role === "Engineer",
			validate(input) {
				if (!input) {
					return console.log("\nGitHub username required");
				}

				return true;
			},
		},
		{
			type: "input",
			name: "school",
			message: "School:",
			when: answers => answers.role === "Intern",
			validate(input) {
				const regex = /[-!@#$%^&*()_+|~=`{}\[\]:";'<>?,.\/]|\d/;

				if (!input) {
					return console.log("\nSchool required");
				} else if (input.match(regex)) {
					return console.log("\nSchool cannot include numbers or symbols");
				}

				return true;
			},
		},
	]);
};

module.exports = {
	promptAddMember,
	members,
};
