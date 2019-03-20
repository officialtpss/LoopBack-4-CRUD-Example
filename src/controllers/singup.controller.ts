import { repository } from '@loopback/repository';
import { UsersRepository } from '../repositories';
import { Users } from '../models';
import { HttpErrors, post, requestBody, } from '@loopback/rest';

export class SingupController {
  reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  constructor(@repository(UsersRepository) protected userRepo: UsersRepository, ) { }

  @post('/users')
  async singup(@requestBody() user: Users) {
    if (!user.email) {
      throw new HttpErrors.BadRequest('email is required');
    } else if (!this.reg.test(user.email)) {
      throw new HttpErrors.BadRequest('invalid email');
    }
    if (!user.password) {
      throw new HttpErrors.BadRequest('password is required');
    }
    if (!user.name) {
      throw new HttpErrors.BadRequest('name is required');
    }
    if (user.id) {
      delete user.id;
    }
    const checkEmail = await this.userRepo.findOne({ where: { email: user.email } });
    if (!checkEmail) {
      await this.userRepo.create(user);
      return { 'message': 'Registered successfully' };
    } else {
      return { 'message': 'email already exist' };
    }
  }

}
