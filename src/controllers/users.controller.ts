
import { inject } from '@loopback/context';
import { repository } from '@loopback/repository';
import { UsersRepository } from '../repositories';
import { UserUpdate } from '../models';
import { HttpErrors, param, requestBody, get, patch, del, } from '@loopback/rest';
import {
  AuthenticationBindings,
  UserProfile,
  authenticate,
} from '@loopback/authentication';

export class UsersController {
  reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  constructor(@repository(UsersRepository) protected userRepo: UsersRepository,
    @inject(AuthenticationBindings.CURRENT_USER) private users: UserProfile,
  ) { }

  @authenticate('jwtStrategy')
  @get('/users')
  async getUser(@param.header.string('authorization') authorization: string, ) {
    const getusers = await this.userRepo.findOne({ where: { id: this.users.id } });
    if (getusers) {
      delete getusers.password;
      delete getusers.id;
    }
    return getusers;
  }

  @authenticate('jwtStrategy')
  @patch('/users')
  async update(@param.header.string('authorization') authorization: string,
    @requestBody() user: UserUpdate) {

    if (!user.name) {
      throw new HttpErrors.BadRequest('name is required');
    }
    return await this.userRepo.updateById(this.users.id, user);
  }

  @authenticate('jwtStrategy')
  @del('/users')
  async delete(@param.header.string('authorization') authorization: string) {
    return await this.userRepo.deleteById(this.users.id);
  }

}
