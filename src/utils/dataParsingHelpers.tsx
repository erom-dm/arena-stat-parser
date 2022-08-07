import { ArenaMatchRaw, ArenaMatchCompact } from "../types/ArenaTypes";
import {BACKUP_FILE_PREFIX} from "./constants";
const luaparse = require("luaparse");
const jp = require('jsonpath');

function cleanupRawString(str: string) {
  return str.replaceAll("\\", "").replaceAll('"', "");
}

export const parseLUA = (data: string): ArenaMatchRaw[] => {
  // Create custom Abstract Syntax Tree (AST)
  Object.keys(luaparse.ast).forEach((type) => {
    const original = luaparse.ast[type];
    luaparse.ast[type] = function () {
      const node = original.apply(null, arguments);
      switch (node?.type) {
        case "Chunk": {
          return node?.body[0]?.NITdatabase;
        }
        case "AssignmentStatement": {
          return { [node?.variables[0]?.name]: node?.init[0] };
        }
        case "StringLiteral": {
          return cleanupRawString(node?.raw);
        }
        case "BooleanLiteral": {
          return node.value;
        }
        case "NumericLiteral": {
          return node.value;
        }
        case "TableConstructorExpression": {
          return node?.fields.reduce((res: any, el: any) => {
            try {
              const key = node?.fields[0].key;
              if (key) {
                res[el?.key] = el?.value
                return res;
              } else {
                if (Symbol.iterator in Object(res)) {
                  return [...res, el?.value]
                } else {
                  return [el?.value]
                }
              }
            } catch (e) {
              console.error(e)
            }
          }, {});
        }
        default: {
          return node;
        }
      }
    };
  });
  // Parse LUA data
  const rawJSONData = luaparse.parse(data, {comments: false, encodingMode: 'none'});
  // Return array with all instance data
  return jp.query(rawJSONData, '$..instances').reduce((res: ArenaMatchRaw[], el: any) => {
    if (Array.isArray(el)) {
      return [...res, ...el]
    }
    return res
  }, [])
};

export const parseArenaHistoryLogData = (data: string): ArenaMatchCompact[] => {
  let parsed = [];
  try {
    parsed = JSON.parse(data.replace(BACKUP_FILE_PREFIX, ""));
  } catch (e) {
    console.log(e);
  }
  return parsed.filter((match: any) => arenaMatchTypeGuard(match));
};

export const rawArenaMatchTypeGuard = (data: any): data is ArenaMatchRaw => {
  return (
    data.class !== undefined &&
    data.classEnglish !== undefined &&
    data.enteredTime !== undefined &&
    data.faction !== undefined &&
    data.goldTeam !== undefined &&
    data.group !== undefined &&
    data.instanceID !== undefined &&
    data.instanceName !== undefined &&
    data.isPvp !== undefined &&
    data.playerName !== undefined &&
    data.purpleTeam !== undefined &&
    data.winningFaction !== undefined
  );
};

export const arenaMatchTypeGuard = (data: any): data is ArenaMatchCompact => {
  return (
    data.i !== undefined &&
    data.t !== undefined &&
    data.n !== undefined &&
    data.w !== undefined &&
    data.m !== undefined &&
    data.e !== undefined
  );
};
