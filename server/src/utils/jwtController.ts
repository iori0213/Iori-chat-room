import Jwt from "jsonwebtoken";

export function jwtVerify<T>(
  token: string,
  tokenSecret: string
): null | T {
  try {
    const result = Jwt.verify(token, tokenSecret) as T;
    if (result && typeof result !== "string") {
      return result;
    } else return null;
  } catch (error) {
    return null;
  }
}

export function jwtDecode<T>(
  token: string,
): null | T {
  try {
    const result = Jwt.decode(token) as T;
    if (result && typeof result !== "string") {
      return result;
    } else return null;
  } catch (error) {
    return null;
  }
}