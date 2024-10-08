import { Configuration, RuleSetRule, RuleSetUseItem } from "webpack";

type RuleWithUse = RuleSetRule & { use: RuleSetUseItem[] };
type RuleWithOneOf = RuleSetRule & { oneOf: RuleSetRule[] };

export function configCSSModule(config: Configuration): Configuration {
  const rules = (
    config.module?.rules
      ?.filter(
        (rule): rule is RuleWithOneOf =>
          typeof rule === "object" &&
          rule?.oneOf !== undefined &&
          Array.isArray(rule.oneOf)
      )
      ?.flatMap((rule) => rule.oneOf || []) || []
  ).filter(
    (rule): rule is RuleWithUse =>
      typeof rule === "object" && Array.isArray(rule.use)
  );

  rules.forEach((rule) => {
    rule.use.forEach((moduleLoader) => {
      if (
        typeof moduleLoader === "object" &&
        moduleLoader?.loader?.includes("css-loader")
      ) {
        const cssLoader = moduleLoader;
        if (
          typeof cssLoader.options === "object" &&
          cssLoader.options !== null
        ) {
          cssLoader.options = {
            ...cssLoader.options,
            modules: {
              ...cssLoader.options.modules,
              getLocalIdent: (
                _context: any,
                _localIdentName: string,
                localName: string
              ) => localName,
            },
          };
        }
      }
    });
  });

  return config;
}
