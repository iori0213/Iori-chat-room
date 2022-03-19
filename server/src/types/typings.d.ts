import { accessTokenInterface } from "./authUserInterface"
export { }
declare global {
  namespace Express {
    interface Request {
      user?: accessTokenInterface;
    }
  }
}