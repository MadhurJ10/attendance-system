import jwt from "jsonwebtoken";
import config from "../config/environment.js"

const JWT_SECRET = config.JWT_SECRET || "madhur";

export const jwtToken = (id , role) => {
  const token = jwt.sign(
    { userId: id ,
      role : role
    },
    JWT_SECRET
  );

  return token;
};

export const jwtVerify = (token) => {
    return jwt.verify(token , JWT_SECRET);
}


