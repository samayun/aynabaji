const fs = require("fs");
const shell = require("child_process");

let packageJson = {};

try {
  packageJson = JSON.parse(fs.readFileSync("package.json").toString());
} catch (error) {
  packageJson = {
    mirror: {
      group: 'samayunchy',
      groupTo: 'SamuOps',
      platform: 'gitlab',
      platformTo: 'github',
      projects: {
        "mflix-penguin-core" : "penguin-api",
        "mflix-penguin-web" : "penguin-web"
     }
    },
  };
}

const PLATFORM = packageJson.mirror.platform;
const MIRROR_PLATFORM = packageJson.mirror.platformTo

const ORGANIZATION_SLUG = packageJson.mirror.group;
const MIRROR_ORGANIZATION_SLUG = packageJson.mirror.groupTo;

const REPOSITORIES = Object.entries(packageJson.mirror.projects);

const WHERE = process.argv[2] || `${process.cwd()}/${ORGANIZATION_SLUG}`;

shell.execSync(`mkdir ${WHERE}`);

Promise.all(
  REPOSITORIES.map(([PROJECT, MIRROR_PROJECT]) => {
    const BARE_CLONE_URL = `git clone --bare git@${PLATFORM}.com:${ORGANIZATION_SLUG}/${PROJECT}.git`;
    const MIRROR_PUSH_URL = `git push --mirror git@${MIRROR_PLATFORM}.com:${MIRROR_ORGANIZATION_SLUG}/${MIRROR_PROJECT}.git`;

    shell.execSync(`cd ${WHERE} && ${BARE_CLONE_URL}`);
    console.log(`${PROJECT} is cloned here >> ${WHERE}`);

    shell.execSync(`cd ${WHERE} && cd ${PROJECT}.git && ${MIRROR_PUSH_URL}`);
    console.log(`${PROJECT} is mirrored here >> https://${MIRROR_PLATFORM}/${MIRROR_ORGANIZATION_SLUG}/${MIRROR_PROJECT}`);
  }),
);
