# MERN-Backend-Boilerplate

Boilerplate Backend, 


First we need to create a <b>.env</b> file, you can see <b>.env.example</b> file which has all the required environment variables.

Next make sure you have [nodeJS](https://nodejs.org/en) installed.

Once nodejs is installed, verify by running 
```node --version```
Now we can install all the dependencies by running the terminal command 
```npm install```

Next up lets run the backend. There are two scripts in package.json file, 

1. ```npm run test``` 
the test script runs the index.js file but we will have to manually restart it every time we update the code.
2. ```npm run dev``` 
the dev script uses nodemon, which automatically restarts the backend when changes are made to the code.


Extras: 
-Any file you want to not upload to github, add that to the .gitignore file
-the entire backend uses module syntax which is slightly different from the require syntax
-for now only a user model schema is setup, add more as per your requirement, i will add some admin API endpoints soon.
-do not share your env file with anyone or upload them to github.
-Let me know if you have any feedback, and Happy coding <3