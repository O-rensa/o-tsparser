export type parserState_t = {
  targetString: string;
  index: number;
  result: string[];
  error: string | null;
  isError: boolean;
}