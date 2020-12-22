const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require("util");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
const writeFileAsync = util.promisify(fs.writeFile);

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
				const regex = /[#-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]|\d/;

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
				const regex = /[#-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/;

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
				const regex = /[#-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]|\d/;

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
			const { name, email, id, officeNumber, github, school } = member;
			const continueLoop = await promptContinue();

			switch (member.role) {
				case "Manager":
					members.push(
						new Manager(
							name.trim(),
							id.trim(),
							email.trim(),
							officeNumber.trim()
						)
					);
					break;
				case "Engineer":
					members.push(
						new Engineer(name.trim(), id.trim(), email.trim(), github.trim())
					);
					break;
				case "Intern":
					members.push(
						new Intern(name.trim(), id.trim(), email.trim(), school.trim())
					);
					break;
			}

			if (!continueLoop.confirm) {
				active = false;
			}
		}

		await writeFileAsync(outputPath, render(members));

		console.log("Successfully created team.html in the output folder");
	} catch (err) {
		console.log(err);
	}
};

init();
