# clone-mirror-repositories
Clone selcted repositories &amp; mirror on local  disk


```bash

git clone git@github.com:samayun/clone-mirror-repositories.git

cd clone-mirror-repositories

code .

npm start

```



```js

// package.json

  "mirror": {
    "platform": "github", // gitlab, bitbucket
    "group": "samayun", // USERNAME or ORGANIZATION
    "projects": [
      "penguin.js", "head-first-typescript"
    ]   // ALL PROJECT SLUGS
  },


```


