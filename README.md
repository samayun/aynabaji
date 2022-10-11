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
    "platform": "gitlab",
    "platformTo": "github", 
    "group": "samayun",
    "groupTo": "SamuOps-solutions", 
    "projects": {
      "mflix-penguin-core" : "penguin-api"
    }
  },


```


