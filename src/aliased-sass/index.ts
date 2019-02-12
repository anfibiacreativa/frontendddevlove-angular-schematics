import { dasherize } from '@angular-devkit/core/src/utils/strings';
import { 
  Rule,
  SchematicContext,
  Tree, 
  chain,
  schematic
} from '@angular-devkit/schematics';

export function aliasedSass(_options: any): Rule {
  return chain([
    // chains and generates the generate-files schematic
    // we want to pass it as a schematic and its options, so we can validate them!
    schematic(`generate-files`, _options),
    (tree: Tree, _context: SchematicContext) => {
      _context.logger.info(JSON.stringify(_options) + ' my aliased sass schematics options');

      // make some verifications before moving on
      tree.getDir('/').visit(filePath => {
        if (filePath.includes('node_modules')) {
          return;
        }
  
        if (!filePath.endsWith('tsconfig.json')) {
          return;
        }
  
        const tsConfigBuffer = tree.read(filePath);
        if (!tsConfigBuffer) {
          return;
        }
        
        // cash the tsconfig file contents in order to update them with our aliases
        const rawTsConfig = JSON.parse(tsConfigBuffer.toString('utf-8'));
        // cash both the paths property as object
        const paths = { ...rawTsConfig['compilerOptions']['paths'] };
        // and create an alias constant that is equal to the dasherized name we pass as options
        const alias = dasherize(_options.name);

        paths[`@${alias}/*`] = ['src/*', 'src/app/*'];
        
        // actually modify the file
        const decoratedTsConfigJSON = {
          ...rawTsConfig,
          compilerOptions: {
            ...rawTsConfig['compilerOptions'],
            paths
          }
        };
        
        // overwrite the tsconfigfile!
        tree.overwrite(filePath, JSON.stringify(decoratedTsConfigJSON, null, 2));
      });
  
      return tree;
    },
  ]);
}