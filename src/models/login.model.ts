import { Entity, model, property } from '@loopback/repository';

@model({ settings: { "strict": false } })
export class Login extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  [prop: string]: any;

  constructor(data?: Partial<Login>) {
    super(data);
  }
}
