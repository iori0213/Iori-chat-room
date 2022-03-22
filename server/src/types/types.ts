export { }
declare global {
  namespace Express {
    interface Request {
      profile: AccessToken;
    }
  }
}