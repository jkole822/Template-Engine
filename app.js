const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const path = require("path");
const fs = require("fs");
const util = require("util");

const render = require("./lib/htmlRenderer");
const { promptAddMember, members } = require("./promptAddMember");
const promptContinue = require("./promptContinue");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
const writeFileAsync = util.promisify(fs.writeFile);

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
