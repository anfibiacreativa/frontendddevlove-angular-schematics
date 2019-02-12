# Getting Started With Schematics

This repository is a basic Schematic implementation that serves as a starting point to walk through the overall process of creating a custom schematic that customizes both the overall Angular project scaffolding.

This project illustrates the talk "Effective Structure Scaffolding with Angular Schematics", hosted along with [Pablo Deeleman](https://twitter.com/deeleman), soon available at a conference near you.

### How to test this sample project

This project requires both to compile the schematics project and an Angular sandbox project where to test the functionalities of the former. Before running into the code, please make sure your environment fulfils the following requirements:

* Node v10.11.0 or higher (LTS version is usually fine)
* npm 6.4.1
* Angular CLI v7.0.0 (or higher)
* @angular-devkit/schematics-cli 0.10.3 (or higher)

Once you're ready, please follow the following steps:

1. Clone the Schematics sample project by running `https://github.com/anfibiacreativa/frontendddevlove-angular-schematics.git`. Fetch all dependencies by running `npm i` (or `yarn`) in the target folder once cloned.
2. Install and build the Schematics project by running `npm run build` or `yarn build`. 
3. Create a NPM symlink here by typing `npm link`. We will need this symlink later.
4. Navigate out from the main schematics folder and generate an empty Angular project on a sibling folder by running `ng new my-project`
5. Navigate to the resulting `my-project` folder and apply the symlink created before by running `npm link my-schematics`.
6. Now you can enhance your newly generated Angular project with your custom schematic by running `ng generate my-schematics:aliased-sass --name=myProject --path=src/styles`

You can see how a new path alias named `@my-project` has been created for you at `tsconfig.json`. Additionally, support for `stylePreprocessorOptions` has been added to your `angular.json` file.

Now you can import any code entity (eg: `myTestComponent`) located within `src/app/` or withing `src/styles/`to from your common sass dependencies, by using a statement like:

```
import { myTestComponent } from '@my-project';
```
for the first, or
```
import 'core';
```
for the second.

Try creating other alias by re-running the command above with other values in the `--name` parameter.

There is a lot more you can do! Just pleay around with it and enjoy!
 