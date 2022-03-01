import authUserInterface from "../src/constInterface/authUserInterface"
export { }
declare global {
  namespace Express {
    interface Request {
      user?: authUserInterface;
    }
  }
}