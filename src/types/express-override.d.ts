import 'express-serve-static-core';

// Override Express params/query types to simplify controller code

declare module 'express-serve-static-core' {
  interface ParamsDictionary {
    [key: string]: string;
  }

  interface Query {
    [key: string]: string;
  }
}
