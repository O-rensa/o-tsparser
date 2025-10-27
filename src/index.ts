import type { parserState_t } from "./type.js";

const updateParserState = (state: parserState_t, index: number, result: string[]): parserState_t => {
  return {
    ...state,
    index,
    result,
  }
};

const updateParserResult = (state: parserState_t, result: string[]): parserState_t => {
  return {
    ...state,
    result,
  }
};

const updateParserError = (state: parserState_t, errMsg: string): parserState_t => {
  return {
    ...state,
    isError: true,
    error: errMsg,
  }
} 

export const str = (s: string) => (parserState: parserState_t): parserState_t => {
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
}

export const sequenceOf = (parsers: ((state: parserState_t) => parserState_t)[]) => (parserState: parserState_t): parserState_t => {
  if (parserState.isError) {
    return parserState;
  }

  const results: string[] = [];
  let nextState: parserState_t = parserState;
  parsers.forEach((p) => {
    nextState = p(nextState);
    results.push(...nextState.result);
  }); 

  return updateParserResult(nextState, results);
}

export const run = (parser: (state: parserState_t) => parserState_t, targetString: string): parserState_t => {
  const param: parserState_t = {
    targetString: targetString,
    index: 0,
    result: [],
    error: null,
    isError: false,
  }
  return parser(param);
}

const parser = str("hello there!");

console.log(run(parser, ""));

const parserSequnce = sequenceOf([
  str("hello there!"),
  str("goodbye there!"),
]);


console.log(run(parserSequnce, "hello there!goodbye there!"));