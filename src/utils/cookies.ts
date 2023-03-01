import Cookies from "js-cookie";
import { APP_CHAIN_ID } from "config/chains";
import { JWT_COOKIE } from "config/constants";

export const getAuthCookie = (address: string): string | undefined =>
  Cookies.get(`${JWT_COOKIE}${address}_${APP_CHAIN_ID}`);

export const setAuthCookie = (address: string, value: string): void => {
  Cookies.set(`${JWT_COOKIE}${address}_${APP_CHAIN_ID}`, value, { expires: 1, sameSite: "strict", secure: true });
};

export const removeAuthCookie = (address: string) => {
  Cookies.remove(`${JWT_COOKIE}${address}_${APP_CHAIN_ID}`);
};
