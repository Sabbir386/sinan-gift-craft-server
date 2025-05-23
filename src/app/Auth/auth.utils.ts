// import jwt, { JwtPayload } from 'jsonwebtoken';

// export const createToken = (
//   jwtPayload: { _id: string; role: string },
//   secret: string,
//   expiresIn: string,
// ) => {
//   return jwt.sign(jwtPayload, secret, {
//     expiresIn,
//   });
// };

// export const verifyToken = (token: string, secret: string) => {
//   return jwt.verify(token, secret) as JwtPayload;
// };

import jwt, { JwtPayload } from 'jsonwebtoken';

export const createToken = (
  jwtPayload: { id: string; role: string; email: string; objectId: string },
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
