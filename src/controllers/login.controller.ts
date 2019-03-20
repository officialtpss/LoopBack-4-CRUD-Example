import { repository } from '@loopback/repository';
import { UsersRepository } from '../repositories';
import { Login } from '../models';
import { HttpErrors, post, requestBody, } from '@loopback/rest';
import { JWTAuthenticationService } from '../services';
import { JWTAuthenticationBindings } from '../keys';
import { inject } from '@loopback/core';
export class LoginController {
  reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  constructor(@repository(UsersRepository) protected userRepo: UsersRepository,
    @inject(JWTAuthenticationBindings.SERVICE)
    public jwtAuthenticationService: JWTAuthenticationService, ) { }

  @post('/login')
  async login(@requestBody() user: Login) {
    if (!user.email) {
      throw new HttpErrors.BadRequest('email is required');
    } else if (!this.reg.test(user.email)) {
      throw new HttpErrors.BadRequest('invalid email');
    }
    if (!user.password) {
      throw new HttpErrors.BadRequest('password is required');
    }
    const getusers = await this.userRepo.findOne({ where: { email: user.email, password: user.password } });
    if (getusers) {
      return { 'token': await this.jwtAuthenticationService.getAccessToken({ id: getusers.id }) };
    } else {
      throw new HttpErrors.BadRequest('email or password not match');
    }
  }
}
