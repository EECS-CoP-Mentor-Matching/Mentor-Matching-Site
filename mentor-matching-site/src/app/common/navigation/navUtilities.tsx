import { EnumType } from "typescript";

function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
  return Object.keys(obj).filter(k => !Number.isNaN(k)) as K[]
}

function navItemsFromEnum(enumType: object): string[] {
  const keys = new Array<string>();
  for (const key of enumKeys(enumType)) {
    const value = enumType[key];
    if (typeof value === "string") {
      keys.push(value);
    }
  }
  return keys;
}

const navUtilities = {
  navItemsFromEnum
};

export default navUtilities;