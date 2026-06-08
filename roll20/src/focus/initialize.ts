import { debounce, startUp } from "../utilities";
import { DEBOUNCE_DELAY, FOCUS_API_PREFIX } from "./constants";
import { debug } from "./debug";
import { onGraphicMove } from "./onGraphicMove";

on("ready", () => {
  startUp(FOCUS_API_PREFIX, debug);
});

on("change:graphic:left", debounce(onGraphicMove, DEBOUNCE_DELAY));
on("change:graphic:top", debounce(onGraphicMove, DEBOUNCE_DELAY));
