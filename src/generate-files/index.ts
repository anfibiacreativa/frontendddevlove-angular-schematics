import { Rule,
  SchematicContext,
  Tree,
  apply,
  template,
  url,
  mergeWith,
  branchAndMerge,
  chain
 } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { dasherize } from '@angular-devkit/core/src/utils/strings';
import { getWorkspace } from '@schematics/angular/utility/config';

export function generateFiles(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    _context.logger.info(JSON.stringify(_options) + ' my generate files schematics options');

    // since project name is dynamic, we need to retrieve it from the config of the workspace
    const workspace = getWorkspace(tree) || _options.name;
    const project = (Object.keys(workspace.projects)[0]).toString();
    const dir = _options.path;
    const projectId = dasherize(_options.name);
    const angularConfigPath = './angular.json';
    const includePaths =  [`./${dir}/${projectId}`];

    const angularJSONBuffer = tree.read('./angular.json');
    if (!angularJSONBuffer) {
      return;
    }
    // read current angular configuration (the one OOTB when generating a new project with CLi)
    const rawAngularConfig = JSON.parse(angularJSONBuffer.toString('utf8'));
    
    // cash the necessary object properties, to modify angular.kson later
    const stylePreprocessorOptions = { 
      ...rawAngularConfig['projects'][project]['architect']['build']['options']['stylePreprocessorOptions'],
    };
    stylePreprocessorOptions['includePaths'] = includePaths;

    // produce a new angular.json object, that includes our stylePreprocesor Options
    const updatedAngularConfig = {
      ...rawAngularConfig,
      ...{
        projects: {
          ...rawAngularConfig['projects'],
           [projectId]: {
            ...rawAngularConfig['projects'][project],
            architect: {
              ...rawAngularConfig['projects'][project]['architect'],
              build: {
                ...rawAngularConfig['projects'][project]['architect']['build'],
                options: {
                  ...rawAngularConfig['projects'][project]['architect']['build']['options'],
                  stylePreprocessorOptions
                }
              }
            }
          }
        }
      }
    }
    // overwrite the angular configuration including the path to our new scss structure
    tree.overwrite(angularConfigPath, JSON.stringify(updatedAngularConfig, null, 2));
  
    // we need to define a source, which conventionally is the files folder inside of the schematics folder
    const source = apply(url('./files'), [
      // use template to actually create the files in the system, according to our options
      template({
        ...strings,
        ...(_options as object)
      } as any),
    ]);

    // use a merge strategy to branch, merge and chain the tree, after applying the
    // necessary transformations
    return chain([branchAndMerge(chain([mergeWith(source)]))])(tree, _context);
  };
}
