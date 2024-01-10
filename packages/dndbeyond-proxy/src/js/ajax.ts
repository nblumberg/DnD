import axios, { AxiosResponse } from "axios";
import { addAuthHeader } from "./auth";

export async function ajax(
  url: string,
  headers?: Record<string, string>,
  description?: string
): Promise<string> {
  let response: AxiosResponse;
  try {
    response = await axios.get(url, {
      headers: addAuthHeader(headers),
    });
  } catch (e) {
    console.error(
      `${description}${description ? " " : ""}${url} request failed: ${e}`
    );
    throw e;
  }
  if (response.status !== 200) {
    throw new Error(
      `${description}${description ? " " : ""}${url} request received a ${
        response.status
      } ${response.statusText} response`
    );
  }
  return response.data as string;
}
