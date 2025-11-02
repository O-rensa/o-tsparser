import type { parserState_t } from "./type.js";

export const updateParserState = (state: parserState_t, index: number, result: string[]): parserState_t => {
  return {
    ...state,
    index,
    result,
  }
};

export const updateParserResult = (state: parserState_t, result: string[]): parserState_t => {
  return {
    ...state,
    result,
  }
};

export const updateParserError = (state: parserState_t, errMsg: string): parserState_t => {
  return {
    ...state,
    isError: true,
    error: errMsg,
  }
} 

export default class Parser {
  parserStateTransformerFn: (state: parserState_t) => parserState_t;

  constructor(parserStateTransformerFn: (state: parserState_t) => parserState_t) {
    this.parserStateTransformerFn = parserStateTransformerFn;
  }

  run(targetString: string): parserState_t {
    const initialState: parserState_t = {
      targetString: targetString,
      index: 0,
      result: [],
      isError: false,
      error: null, 
    }

    return this.parserStateTransformerFn(initialState);
  }

  map(fn: (value: string) => any): Parser {
    return new Parser((parserState: parserState_t): parserState_t => {
      const nextState = this.parserStateTransformerFn(parserState);
      if (nextState.isError) {
        return nextState;
      }

      return updateParserResult(nextState, nextState.result.map(r => fn(r)));
    })
  }

  errorMap(fn: (errMsg: string, index: number) => string): Parser {
    return new Parser((parserState: parserState_t): parserState_t => {
      const nextState = this.parserStateTransformerFn(parserState);
      if(!nextState.isError) {
        return nextState;
      }

      return updateParserError(nextState, fn(nextState.error || "", nextState.index));
    });
  }
}