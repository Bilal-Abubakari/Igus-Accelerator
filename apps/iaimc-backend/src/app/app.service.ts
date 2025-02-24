import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  data; // @typescript-eslint/explicit-member-accessibility (Missing explicit accessibility)

  name = 'John'; // ❌ Missing access modifier (should be: `private`, `protected`, or `public`)

  getData() {
    // ❌ Missing access modifier (should be `public`, `private`, or `protected`)
    return this.name;
  }
  constructor() {}

  async fetchData() {
    // @typescript-eslint/explicit-function-return-type (Missing return type)
    return Promise.resolve('data');
  }

  processData(input) {
    // @typescript-eslint/explicit-module-boundary-types (No return type on exported function)
    return input + ' processed';
  }

  async doSomething() {
    // @typescript-eslint/require-await (Unused `await`)
    await 'not needed';
  }

  async checkAwait() {
    // @typescript-eslint/await-thenable (Using `await` on non-Promise)
    await 5;
  }

  getValue() {
    // @typescript-eslint/no-unsafe-return (Returning `any`)
    return this.data;
  }

  async riskyOperation() {
    const value: any = 'hello'; // @typescript-eslint/no-explicit-any
    const unsafeValue = value; // @typescript-eslint/no-unsafe-assignment
    console.log(value.someProperty); // @typescript-eslint/no-unsafe-member-access
    value(); // @typescript-eslint/no-unsafe-call
  }

  async execute() {
    this.fetchData(); // @typescript-eslint/no-floating-promises (Uncaught Promise)
  }

  switchCheck(status: 'pending' | 'completed') {
    // @typescript-eslint/switch-exhaustiveness-check (Missing case in switch)
    switch (status) {
      case 'pending':
        console.log('Pending');
        break;
    }
  }

  loadConfig() {
    const config = process.env.CONFIG || 'default'; // @typescript-eslint/prefer-nullish-coalescing (Using `||` instead of `??`)
  }
}

// @typescript-eslint/no-extraneous-class (Class with only static members)
export class Utility {
  static parseData(data: string) {
    return JSON.parse(data);
  }
}

// @typescript-eslint/consistent-type-definitions (Should use `interface` instead of `type`)
type Person = {
  name: string;
};

// @typescript-eslint/consistent-type-assertions (`as` should be used instead of `<T>`)
const num = <number>'42';

// @typescript-eslint/no-unnecessary-condition (Condition always true)
if (true) {
  console.log('This will always run');
}

// linebreak-style (Windows line endings instead of Unix)
console.log('Hello, world!'); // CRLF instead of LF

// simple-import-sort/imports (Unsorted imports)
import fs from 'fs';
import path from 'path';
import http from 'http';

// unicorn/error-message (Throwing a string instead of an `Error` object)
throw 'Something went wrong';

// unicorn/prefer-ternary (Should use ternary instead of if-else)
const age = 20;
let category;
if (age > 18) {
  category = 'Adult';
} else {
  category = 'Minor';
}
