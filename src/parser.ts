import type { parserState_t } from "./type.js";

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
}