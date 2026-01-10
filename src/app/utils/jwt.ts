import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
export const generateToken = (
  payload: JwtPayload,
  secretKey: string,
  expiresIn: string | number
) => {
  const token = jwt.sign(payload, secretKey, { expiresIn } as SignOptions);
  return token;
};
export const verifyToken = (token: string, secretKey: string) => {
  try {
    const decoded = jwt.verify(token, secretKey) ;
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
};