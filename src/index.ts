import Parser, { updateParserError, updateParserResult, updateParserState } from "./parser.js";
import { digitsRegex, lettersRegex } from "./regex.js";
import type { parserState_t } from "./type.js";

export const str = (s: string) => new Parser((parserState: parserState_t): parserState_t => {
  const { targetString, index, isError } = parserState;

  if (isError) {
    return parserState;
  }

  const slicedTarget = targetString.slice(index);

  if (slicedTarget.length === 0) {
    return updateParserError(parserState, `str: Tried to match "${s}", but got unexpected end of input.`)
  }

  if (targetString.slice(index).startsWith(s)) {
    return updateParserState(parserState, index + s.length, [s]);
  }

  return updateParserError(parserState, `str: Tried to match "${s}", but got "${targetString.slice(index, index + 10)}".`);
});

export const letters = new Parser((parserState: parserState_t): parserState_t => {
  const { targetString, index, isError } = parserState;

  if (isError) {
    return parserState;
  }

  const slicedTarget = targetString.slice(index);

  if (slicedTarget.length == 0) {
    return updateParserError(parserState, "Got undexpected end of input.");
  }

  const regexMatch = slicedTarget.match(lettersRegex);

  if (regexMatch) {
    return updateParserState(parserState, index + regexMatch[0].length, [regexMatch[0]]);
  }

  return updateParserError(parserState, `letters: Couldn't match letters at index ${index}`);
});

export const digits = new Parser((parserState: parserState_t): parserState_t => {
  const { targetString, index, isError } = parserState;

  if (isError) {
    return parserState;
  }

  const slicedTarget = targetString.slice(index);

  if (slicedTarget.length == 0) {
    return updateParserError(parserState, "Got undexpected end of input.");
  }

  const regexMatch = slicedTarget.match(digitsRegex);

  if (regexMatch) {
    return updateParserState(parserState, index + regexMatch[0].length, [regexMatch[0]]);
  }

  return updateParserError(parserState, `digits: Couldn't match letters at index ${index}`);
});

export const sequenceOf = (parsers: Parser[]) => new Parser((parserState: parserState_t): parserState_t => {
  if (parserState.isError) {
    return parserState;
  }

  const results: string[] = [];
  let nextState: parserState_t = parserState;
  parsers.forEach((p) => {
    nextState = p.parserStateTransformerFn(nextState);
    results.push(...nextState.result);
  }); 

  return updateParserResult(nextState, results);
});

const parser = sequenceOf([digits, letters.map((s: string) => s.toUpperCase()), digits]);

console.log(parser.run("123123Hello12312312"));