import { TokenResponse } from "@react-oauth/google";

export type Credentials = Omit<
  TokenResponse,
  "error" | "error_description" | "error_uri"
>;

export interface Profile {
  email: string;
  family_name: string;
  given_name: string;
  id: string;
  locale: string;
  name: string;
  picture: string;
  verified_email: boolean;
}
