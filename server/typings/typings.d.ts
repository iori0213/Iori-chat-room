import { accessTokenInterface } from "../src/constants/authUserInterface"
export { }
declare global {
  namespace Express {
    interface Request {
      user?: accessTokenInterface;
    }
  }
}