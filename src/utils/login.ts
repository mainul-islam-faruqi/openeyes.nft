// import { getLoginMessage } from "@looksrare/shared";
import { Signer } from "ethers";
import { request, gql } from "graphql-request";
import jwt_decode, { JwtPayload } from "jwt-decode";
import { currentChainInfo } from "config/chains";
import { getAuthCookie, setAuthCookie } from "utils/cookies";
import { isAddressEqual } from "utils/guards";

export interface AuthPayload extends JwtPayload {
  address: string;
  username: string;
}

/**
 * Direct call to the API for login
 * @param address User address
 * @param message Original message
 * @param signature Signed message
 * @returns
 */
const login = async (address: string, message: string, signature: string) => {
  const query = gql`
    mutation LoginMutation($data: UserInput!) {
      login(data: $data) {
        address
        token
      }
    }
  `;
  const res = await request(currentChainInfo.apiUrl, query, {
    data: {
      address,
      message,
      signature,
    },
  });

  return res.login.token;
};

/**
 * Request a signature from the user, and perform a login
 * @param signer Ethers signer
 * @param account User address
 * @returns Json Web Token
 */
const signAndLogin = async (signer: Signer, account: string): Promise<string> => {
  // const message = getLoginMessage();
  // const signature = await signer.signMessage(message);
  // const jwt = await login(account, message, signature);
  return "";
};

/**
 * Check the JWT validity
 * @param jwt
 * @returns true if the JWT can be parsed, and is not expired
 */
export const isJwtValid = (jwt: string) => {
  try {
    const decode = jwt_decode<AuthPayload>(jwt);
    const expireIn = decode.exp || 0;
    const validFor = expireIn - Date.now() / 1000;
    console.info(`JWT still valid for ${validFor}`);
    return validFor > 0;
  } catch (error) {
    console.error(error);
    return false;
  }
};

/**
 * Check if a valid JWT exists, request a login if not
 * @param signer Ethers signer
 * @param account User address
 */
export const signAndLoginIfJwtIsInvalid = async (signer: Signer, account: string) => {
  const authCookie = getAuthCookie(account);

  if (authCookie && isJwtValid(authCookie)) {
    return authCookie;
  }

  const jwt = await signAndLogin(signer, account);
  if (!isJwtValid(jwt)) {
    throw Error("Cannot request a valid JWT");
  }

  setAuthCookie(account, jwt);
  return jwt;
};

/**
 * Check if an account is authorized
 * @param signer
 * @param account
 * @returns true if jwt is valid and the connected account matches the jwt address
 */
export const isAuthorized = (account?: string | null) => {
  if (!account) {
    return false;
  }

  const authCookie = getAuthCookie(account);

  if (!authCookie || !isJwtValid(authCookie)) {
    return false;
  }

  const { address } = jwt_decode<AuthPayload>(authCookie);

  return isAddressEqual(address, account);
};
