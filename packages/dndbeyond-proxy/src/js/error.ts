export class ParseError extends Error {
  constructor(message: string, props?: Record<string, any>) {
    super(message);
    console.error(`\t${message}`);
    if (props) {
      Object.assign(this, props);
    }
  }
}

export class FatalParseError extends ParseError {
  constructor(message: string, props: Record<string, any> = {}) {
    super(message, { ...props, fatal: true });
  }
}

export class NotPurchasedError extends ParseError {
  constructor(name: string) {
    super(`${name} has not been purchased`, { purchased: false });
  }
}
