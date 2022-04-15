export {};
declare global {
  namespace Express {
    interface Request {
      profile: AccessToken;
    }
  }
}

export type ProfileWithImg = {
  id: string;
  username: string;
  showname: string;
  profileImg: string;
};
