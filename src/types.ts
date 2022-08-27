/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyObject = Record<string, unknown>;

type FactoryCallback = (...args: any[]) => AnyObject;

export type KeyScopeValue = AnyObject | string | number | boolean;

type FactoryProperty = Exclude<KeyScopeValue, AnyObject> | null | FactoryCallback;

export type FactoryObject = Record<string, FactoryProperty>;

type ValidateSchema<Schema extends FactoryObject> = Omit<Schema, 'default'>;

export type ValidateFactory<Schema extends FactoryObject> = Schema extends {
  ['default']: Schema['default'];
}
  ? ValidateSchema<Schema>
  : Schema;

export type FactoryOutputCallback<Key, Property, Callback extends FactoryCallback> = {
  (...args: Parameters<Callback>): readonly [
    Key,
    Property,
    {
      [SubKey in keyof ReturnType<Callback>]: ReturnType<Callback>[SubKey];
    },
  ];
  toScope: () => readonly [Key, Property];
};

export type FactoryOutput<Key extends string, FactorySchema extends FactoryObject> = {
  [P in keyof FactorySchema]: FactorySchema[P] extends FactoryCallback
    ? FactoryOutputCallback<Key, P, FactorySchema[P]>
    : FactorySchema[P] extends null
    ? readonly [Key, P]
    : readonly [Key, P, FactorySchema[P]];
};

export type DefaultKey<Key extends string> = Record<'default', readonly [Key]>;

export type QueryKeyFactoryResult<Key extends string, FactorySchema extends FactoryObject> = DefaultKey<Key> &
  FactoryOutput<Key, FactorySchema>;
