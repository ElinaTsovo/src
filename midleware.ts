import { Request, Response } from "express";
import {loginData} from './controller'
import { Jwt } from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()

const tokenhash = process.env.TOKEN_KEY
export const verifyToken = (request: Request, response: Response, next) => {
  const token = request.body.token || request.query.token || request.headers["x-access-token"];

  if (!token) {
    return response.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, tokenhash);
    request.logindata = decoded;
  } catch (err) {
    return response.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;