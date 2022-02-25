import userInterface from "../src/const/user.interface"
export { }
declare global {
  namespace Express {
    interface Request {
      user?: userInterface;
    }
  }
}