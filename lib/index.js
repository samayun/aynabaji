const fs = require("fs");
const shell = require("child_process");

let packageJson = {};

try {
  packageJson = JSON.parse(fs.readFileSync("package.json").toString());
} catch (error) {
  packageJson = {
    mirror: {
      group: "samayun",
      platform: "github",
      projects: ["penguin.js", "head-first-typescript"],
    },
  };
}

const PLATFORM = packageJson.mirror.platform;

const ORGANIZATION_SLUG = packageJson.mirror.group;

const REPOSITORIES = packageJson.mirror.projects;

const WHERE = process.argv[2] || `${process.cwd()}/${ORGANIZATION_SLUG}`;

shell.execSync(`mkdir ${WHERE}`);

Promise.all(
  REPOSITORIES.map((PROJECT) => {
    const CLONE_URL = `git clone git@${PLATFORM}.com:${ORGANIZATION_SLUG}/${PROJECT}.git`;
    const MIRROR_URL = `git clone --mirror git@${PLATFORM}.com:${ORGANIZATION_SLUG}/${PROJECT}.git`;

    shell.execSync(`cd ${WHERE} && ${CLONE_URL}`);
    console.log(`${PROJECT} is cloned here >> ${WHERE}`);

    shell.execSync(`cd ${WHERE} && ${MIRROR_URL}`);
    console.log(`${PROJECT} is mirrored here >> ${WHERE}`);
  }),
);
