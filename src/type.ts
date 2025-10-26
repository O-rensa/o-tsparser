export type parserState_t = {
  targetString: string;
  index: number;
  result: parserStateResult_t;
  error: string | null;
  isError: boolean;
}

export type parserStateResult_t = string | string[] | null;