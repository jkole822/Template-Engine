const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const members = [];

const generateRandomId = () => {
	const characters = [
		"A",
		"B",
		"C",
		"D",
		"E",
		"F",
		"G",
		"H",
		"I",
		"J",
		"K",
		"L",
		"M",
		"N",
		"O",
		"P",
		"Q",
		"R",
		"S",
		"T",
		"U",
		"V",
		"W",
		"X",
		"Y",
		"Z",
		"0",
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
	];

	let id = "";

	for (let i = 0; i < 8; i++) {
		const index = Math.floor(Math.random() * characters.length);
		id += characters[index];
	}

	return id;
};

const promptAddMember = () => {
	return inquirer.prompt([
		{
			type: "list",
			name: "role",
			message: "Employee Role:",
			choices: ["Manager", "Engineer", "Intern"],
		},
		{
			type: "input",
			name: "name",
			message: "Employee Name:",
			validate(input) {
				const regex = /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]|\d/;

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
				const regex = /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/;

				if (input.match(regex)) {
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
			name: "officenumber",
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
				const regex = /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]|\d/;

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

const promptContinue = () => {
	return inquirer.prompt({
		type: "confirm",
		name: "confirm",
		message: "Add another member?",
	});
};

const init = async () => {
	try {
		let active = true;

		while (active) {
			const member = await promptAddMember();
			const continueLoop = await promptContinue();
			members.push(member);
			if (!continueLoop.confirm) {
				active = false;
			}
		}

		render(members);
	} catch (err) {
		console.log(err);
	}
};

init();

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
