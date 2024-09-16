import { Compiler, Compilation, sources } from "webpack";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import * as t from "@babel/types";

export class TypedCSSXNextPlugin {
  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap("TypedCSSXNextPlugin", (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: "TypedCSSXNextPlugin",
          stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE,
        },
        (assets) => {
          Object.keys(assets).forEach((filename) => {
            if (filename.endsWith(".js")) {
              const asset = compilation.getAsset(filename);
              if (asset) {
                const source = asset.source;
                const sourceContent = source.source();
                const ast = parse(sourceContent.toString(), {
                  sourceType: "module",
                  plugins: ["jsx", "typescript"],
                });

                traverse(ast, {
                  CallExpression(path) {
                    if (
                      t.isMemberExpression(path.node.callee) &&
                      t.isIdentifier(path.node.callee.object)
                    ) {
                      const objectName = path.node.callee.object.name;
                      const propertyName = t.isIdentifier(
                        path.node.callee.property
                      )
                        ? path.node.callee.property.name
                        : null;

                      if (objectName === "cssx" && propertyName) {
                        if (
                          ["create", "set", "global", "root"].includes(
                            propertyName
                          )
                        ) {
                          // removing method calls
                          path.remove();
                        }
                      }
                    }
                  },
                });

                const output = generate(ast);
                compilation.updateAsset(
                  filename,
                  new sources.RawSource(output.code)
                );
              }
            }
          });
        }
      );
    });
  }
}
