import { Entity, model, property } from '@loopback/repository';

@model({ settings: { "strict": false } })
export class UserUpdate extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  name: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  [prop: string]: any;

  constructor(data?: Partial<UserUpdate>) {
    super(data);
  }
}
