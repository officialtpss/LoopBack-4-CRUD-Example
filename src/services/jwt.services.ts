import { promisify } from 'util';
import { UserProfile } from '@loopback/authentication';
import { HttpErrors, Request, } from '@loopback/rest';

const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

export class JWTAuthenticationService {
  jwt_secret: string = 'officialtpss';
  constructor(
  ) { }

  async getAccessToken(users: any): Promise<string> {
    return await signAsync(users, this.jwt_secret);
  }
  async verifyAccessToken(token: string): Promise<any> {
    return await verifyAsync(token, this.jwt_secret);
  }
}
