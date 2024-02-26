import { device } from "../constants";
import { getWindow } from "./env";

export function checkMobile(): boolean {
  return (getWindow()?.screen?.width ?? 0) <= device.md;
}
