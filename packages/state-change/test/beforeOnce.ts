import { beforeEach } from "@jest/globals";

export function beforeOnce(fn) {
  let done = false;
  beforeEach(() => {
    if (done) {
      return;
    }
    done = true;
    fn();
  });
}
