import { Provider, inject, ValueOrPromise } from '@loopback/context';
import { Strategy } from 'passport';
import {
  AuthenticationBindings,
  AuthenticationMetadata,
} from '@loopback/authentication';

import { JWTAuthenticationBindings } from '../keys';
import { JWTStrategy } from '../strategies/JWT.strategy';

export class MyAuthStrategyProvider implements Provider<Strategy | undefined> {
  constructor(
    @inject(AuthenticationBindings.METADATA)
    private metadata: AuthenticationMetadata,
    @inject(JWTAuthenticationBindings.STRATEGY)
    private jwt_strategy: JWTStrategy,

  ) { }

  value(): ValueOrPromise<Strategy | undefined> {
    // The function was not decorated, so we shouldn't attempt authentication
    if (!this.metadata) {
      return undefined;
    }

    const name = this.metadata.strategy;
    if (name === 'jwtStrategy') {
      return this.jwt_strategy;
    } else {
      return Promise.reject(`The strategy ${name} is not available.`);
    }
  }
}
