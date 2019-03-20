
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
  constructor(@repository(UsersRepository) protected userRepo: UsersRepository,
    @inject(AuthenticationBindings.CURRENT_USER) private users: UserProfile,
  ) { }

  @authenticate('jwtStrategy')
  @get('/users')
  async getUser(@param({
    name: 'access_token',
    in: 'header',
    required: true,
    schema: { type: 'string' },
  }) access_token: string, ) {
    const getusers = await this.userRepo.findOne({ where: { id: this.users.id } });
    if (getusers) {
      delete getusers.password;
      delete getusers.id;
    }
    return getusers;
  }

  @authenticate('jwtStrategy')
  @patch('/users')
  async update(@param({
    name: 'access_token',
    in: 'header',
    required: true,
    schema: { type: 'string' },
  }) access_token: string,
    @requestBody() user: UserUpdate) {

    if (!user.name) {
      throw new HttpErrors.BadRequest('name is required');
    }
    return await this.userRepo.updateById(this.users.id, user);
  }

  @authenticate('jwtStrategy')
  @del('/users')
  async delete(@param({
    name: 'access_token',
    in: 'header',
    required: true,
    schema: { type: 'string' },
  }) access_token: string, ) {
    return await this.userRepo.deleteById(this.users.id);
  }

}
