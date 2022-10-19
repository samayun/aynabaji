const fs = require('fs');
const shell = require('child_process');

let packageJson = {};

try {
  packageJson = JSON.parse(fs.readFileSync('package.json').toString());
} catch (error) {
  packageJson = {
    mirror: {
      group: 'samayunchy',
      groupTo: 'SamuOps',
      platform: 'gitlab',
      platformTo: 'github',
      projects: {
        'mflix-penguin-core': 'penguin-api',
        'mflix-penguin-web': 'penguin-web',
      },
      'bare:pull': true,
      'mirror:push': false,
      takeGift: false,
      addRemoteOrigin: {},
    },
  };
}

const PLATFORM = packageJson.mirror.platform;
const MIRROR_PLATFORM = packageJson.mirror.platformTo;

const ORGANIZATION_SLUG = packageJson.mirror.group;
const MIRROR_ORGANIZATION_SLUG = packageJson.mirror.groupTo;

const REPOSITORIES = Object.entries(packageJson?.mirror?.projects || {});

const WHERE = process.argv[2] || `${process.cwd()}/${ORGANIZATION_SLUG}`;

const WHERE_TO_KEEP = `${process.cwd()}/gifts`;

const shouldBareClone = packageJson.mirror['bare:pull'] || false;
const shouldMirrorPush = packageJson.mirror['mirror:push'] || false;
const shouldTakeGift = packageJson.mirror['takeGift'] || false;

const addRemoteOrigin = packageJson.mirror['addRemoteOrigin'];

if (!fs.existsSync(WHERE) && (shouldBareClone || shouldMirrorPush)) {
  shell.execSync(`mkdir ${WHERE}`);
}

if (!fs.existsSync(WHERE_TO_KEEP) && shouldTakeGift) {
  shell.execSync(`mkdir ${WHERE_TO_KEEP}`);
}

if (REPOSITORIES && REPOSITORIES.length) {
  Promise.all(
    REPOSITORIES.map(([PROJECT, MIRROR_PROJECT]) => {
      const CURRENT_PROJECT = PROJECT.split('/');
      PROJECT = CURRENT_PROJECT[CURRENT_PROJECT.length - 1];

      if (shouldBareClone) {
        try {
          const BARE_CLONE_URL = `git clone --bare git@${PLATFORM}.com:${ORGANIZATION_SLUG}/${PROJECT}.git`;
          shell.execSync(`cd ${WHERE} && ${BARE_CLONE_URL}`);
          console.log(`${PROJECT} is cloned here >> ${WHERE}/${ORGANIZATION_SLUG}/${PROJECT}.git`);
        } catch (error) {
          console.log(`Bare Clone Failed: ${error.message}`);
          return;
        }
      }

      if (shouldMirrorPush) {
        try {
          const MIRROR_PUSH_URL = `git push --mirror git@${MIRROR_PLATFORM}.com:${MIRROR_ORGANIZATION_SLUG}/${MIRROR_PROJECT}.git`;
          shell.execSync(`cd ${WHERE} && cd ${PROJECT}.git && ${MIRROR_PUSH_URL}`);
          console.log(
            `${MIRROR_PROJECT} is mirrored here >> https://${MIRROR_PLATFORM}/${MIRROR_ORGANIZATION_SLUG}/${MIRROR_PROJECT}`,
          );
        } catch (error) {
          console.log(`Mirror Failed: ${error.message}`);
          return;
        }
      }

      if (shouldTakeGift) {
        try {
          const GIFT_CLONE_URL = `git clone git@${MIRROR_PLATFORM}.com:${MIRROR_ORGANIZATION_SLUG}/${MIRROR_PROJECT}.git`;
          shell.execSync(`cd ${WHERE_TO_KEEP} && ${GIFT_CLONE_URL}`);

          console.log(
            `${MIRROR_PROJECT} is gifted here >> https://${MIRROR_PLATFORM}/${MIRROR_ORGANIZATION_SLUG}/${MIRROR_PROJECT}`,
          );
        } catch (error) {
          console.log(`Clone Failed: ${error.message}`);
          return;
        }
      }
    }),
  );
}

if (addRemoteOrigin) {
  Promise.all(
    Object.entries(addRemoteOrigin).map(([LOCAL_DIRECTORY, MIRROR_PROJECT]) => {
      try {
        const REMOTE_ORIGIN_SET_CMD = `git remote add github git@${MIRROR_PLATFORM}.com:${MIRROR_ORGANIZATION_SLUG}/${MIRROR_PROJECT}.git`;
        shell.execSync(`cd ${LOCAL_DIRECTORY} && ${REMOTE_ORIGIN_SET_CMD}`);
        return console.log(`cd ${LOCAL_DIRECTORY} && ${REMOTE_ORIGIN_SET_CMD}`);
      } catch (error) {
        console.log(`Already added github as new origin: ${error.message}`);
        return;
      }
    }),
  );
}
