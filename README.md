# clone-mirror-repositories
Clone selcted repositories &amp; mirror on local  disk

## Clone & prepare

```bash

git clone git@github.com:samayun/aynabaji.git

cd clone-mirror-repositories

code .

```


## Configure

```js

// package.json
  
 "mirror": {
    "platform": "gitlab",
    "platformTo": "github", 
    "group": "samayun",
    "groupTo": "SamuOps-solutions", 
    "projects": {
      "mflix-penguin-core" : "penguin-api"
    },
    "bare:pull": false,
    "mirror:push": false,
    "takeGift": false,
    "setRemoteOrigin": {
      "~/Projects/TEST/MIRRORED_REPO_LOCAL_DIRECTORY " : "PROJECT_SLUG"
    }
  },


```


## Start Mirroring

```bash

npm start

```


