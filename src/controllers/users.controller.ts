
import { repository } from '@loopback/repository';
import { UsersRepository } from '../repositories';
import { Users, Login, UserUpdate } from '../models';
import { HttpErrors, post, param, requestBody, get, patch, del, } from '@loopback/rest';


export class UsersController {
  reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  constructor(@repository(UsersRepository) protected userRepo: UsersRepository
  ) { }

  @post('/users')
  async createUser(@requestBody() user: Users) {
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

  @get('/users')
  async getUser(@param.query.string('id') id: string) {
    if (!id) {
      throw new HttpErrors.BadRequest('id is required');
    }
    const getusers = await this.userRepo.findOne({ where: { id: id } });
    if (getusers) {
      delete getusers.password;
      delete getusers.id;
    }
    return getusers;
  }

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
      delete getusers.email;
      delete getusers.name;
      delete getusers.password;
      return getusers;
    } else {
      throw new HttpErrors.BadRequest('email or password not match');
    }
  }

  @patch('/users/{id}')
  async update(@param.path.string('id') id: string,
    @requestBody() user: UserUpdate) {
    if (!id) {
      throw new HttpErrors.BadRequest('id is required');
    }
    if (!user.name) {
      throw new HttpErrors.BadRequest('name is required');
    }
    return await this.userRepo.updateById(id, user);
  }

  @del('/users/{id}')
  async delete(@param.path.string('id') id: string) {
    if (!id) {
      throw new HttpErrors.BadRequest('id is required');
    }
    return await this.userRepo.deleteById(id);
  }

}
