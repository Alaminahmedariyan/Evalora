const fs = require("fs");
const path =
	"D:\\Mission Complete\\assignments\\assignment-6-server\\postman.collection.json";
const collection = JSON.parse(fs.readFileSync(path, "utf8"));

const authFolder = collection.item.find((f) => f.name === "1. Auth");
const registerRecruiter = authFolder.item.find(
	(r) => r.name === "Register Recruiter",
);

if (registerRecruiter) {
	registerRecruiter.event = [
		{
			listen: "test",
			script: {
				type: "text/javascript",
				exec: [
					"pm.test('Status is 201', () => pm.response.to.have.status(201));",
					"const json = pm.response.json();",
					"if (json.data && json.data.user) {",
					"  pm.collectionVariables.set('recruiterUserId', json.data.user.id);",
					"  console.log('Recruiter user ID:', json.data.user.id);",
					"}",
				],
			},
		},
	];
	console.log("Added test script to Register Recruiter");
}

// Find login admin to insert role update after it
const loginAdmin = authFolder.item.find((r) => r.name === "Login - Admin");
const updateRoleRequest = {
	name: "Update Recruiter Role to RECRUITER",
	request: {
		method: "PATCH",
		header: [
			{ key: "Content-Type", value: "application/json", type: "text" },
			{ key: "Authorization", value: "Bearer {{adminToken}}", type: "text" },
		],
		url: {
			raw: "{{baseUrl}}/users/{{recruiterUserId}}/role",
			host: ["{{baseUrl}}"],
			path: ["users", "{{recruiterUserId}}", "role"],
		},
		body: {
			mode: "raw",
			raw: JSON.stringify({ role: "RECRUITER" }, null, 2),
			options: { raw: { language: "json" } },
		},
		event: [
			{
				listen: "test",
				script: {
					type: "text/javascript",
					exec: [
						"pm.test('Status is 200', () => pm.response.to.have.status(200));",
					],
				},
			},
		],
	},
	response: [],
};

if (loginAdmin) {
	const adminIdx = authFolder.item.indexOf(loginAdmin);
	authFolder.item.splice(adminIdx + 1, 0, updateRoleRequest);
	console.log("Added Update Recruiter Role request after admin login");
}

fs.writeFileSync(path, JSON.stringify(collection, null, 2));
console.log("Done");
