
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Customer
 * 
 */
export type Customer = $Result.DefaultSelection<Prisma.$CustomerPayload>
/**
 * Model Supplier
 * 
 */
export type Supplier = $Result.DefaultSelection<Prisma.$SupplierPayload>
/**
 * Model Product
 * 
 */
export type Product = $Result.DefaultSelection<Prisma.$ProductPayload>
/**
 * Model SalesInvoice
 * 
 */
export type SalesInvoice = $Result.DefaultSelection<Prisma.$SalesInvoicePayload>
/**
 * Model PurchaseInvoice
 * 
 */
export type PurchaseInvoice = $Result.DefaultSelection<Prisma.$PurchaseInvoicePayload>
/**
 * Model InvoiceItem
 * 
 */
export type InvoiceItem = $Result.DefaultSelection<Prisma.$InvoiceItemPayload>
/**
 * Model PurchaseItem
 * 
 */
export type PurchaseItem = $Result.DefaultSelection<Prisma.$PurchaseItemPayload>
/**
 * Model InventoryLog
 * 
 */
export type InventoryLog = $Result.DefaultSelection<Prisma.$InventoryLogPayload>
/**
 * Model Account
 * 
 */
export type Account = $Result.DefaultSelection<Prisma.$AccountPayload>
/**
 * Model JournalVoucher
 * 
 */
export type JournalVoucher = $Result.DefaultSelection<Prisma.$JournalVoucherPayload>
/**
 * Model JournalEntry
 * 
 */
export type JournalEntry = $Result.DefaultSelection<Prisma.$JournalEntryPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Customers
 * const customers = await prisma.customer.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Customers
   * const customers = await prisma.customer.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.customer`: Exposes CRUD operations for the **Customer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Customers
    * const customers = await prisma.customer.findMany()
    * ```
    */
  get customer(): Prisma.CustomerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.supplier`: Exposes CRUD operations for the **Supplier** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Suppliers
    * const suppliers = await prisma.supplier.findMany()
    * ```
    */
  get supplier(): Prisma.SupplierDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.product`: Exposes CRUD operations for the **Product** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Products
    * const products = await prisma.product.findMany()
    * ```
    */
  get product(): Prisma.ProductDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.salesInvoice`: Exposes CRUD operations for the **SalesInvoice** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SalesInvoices
    * const salesInvoices = await prisma.salesInvoice.findMany()
    * ```
    */
  get salesInvoice(): Prisma.SalesInvoiceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.purchaseInvoice`: Exposes CRUD operations for the **PurchaseInvoice** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PurchaseInvoices
    * const purchaseInvoices = await prisma.purchaseInvoice.findMany()
    * ```
    */
  get purchaseInvoice(): Prisma.PurchaseInvoiceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.invoiceItem`: Exposes CRUD operations for the **InvoiceItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InvoiceItems
    * const invoiceItems = await prisma.invoiceItem.findMany()
    * ```
    */
  get invoiceItem(): Prisma.InvoiceItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.purchaseItem`: Exposes CRUD operations for the **PurchaseItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PurchaseItems
    * const purchaseItems = await prisma.purchaseItem.findMany()
    * ```
    */
  get purchaseItem(): Prisma.PurchaseItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.inventoryLog`: Exposes CRUD operations for the **InventoryLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InventoryLogs
    * const inventoryLogs = await prisma.inventoryLog.findMany()
    * ```
    */
  get inventoryLog(): Prisma.InventoryLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
  get account(): Prisma.AccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.journalVoucher`: Exposes CRUD operations for the **JournalVoucher** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more JournalVouchers
    * const journalVouchers = await prisma.journalVoucher.findMany()
    * ```
    */
  get journalVoucher(): Prisma.JournalVoucherDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.journalEntry`: Exposes CRUD operations for the **JournalEntry** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more JournalEntries
    * const journalEntries = await prisma.journalEntry.findMany()
    * ```
    */
  get journalEntry(): Prisma.JournalEntryDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.2
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Customer: 'Customer',
    Supplier: 'Supplier',
    Product: 'Product',
    SalesInvoice: 'SalesInvoice',
    PurchaseInvoice: 'PurchaseInvoice',
    InvoiceItem: 'InvoiceItem',
    PurchaseItem: 'PurchaseItem',
    InventoryLog: 'InventoryLog',
    Account: 'Account',
    JournalVoucher: 'JournalVoucher',
    JournalEntry: 'JournalEntry'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "customer" | "supplier" | "product" | "salesInvoice" | "purchaseInvoice" | "invoiceItem" | "purchaseItem" | "inventoryLog" | "account" | "journalVoucher" | "journalEntry"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Customer: {
        payload: Prisma.$CustomerPayload<ExtArgs>
        fields: Prisma.CustomerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CustomerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CustomerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          findFirst: {
            args: Prisma.CustomerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CustomerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          findMany: {
            args: Prisma.CustomerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>[]
          }
          create: {
            args: Prisma.CustomerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          createMany: {
            args: Prisma.CustomerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CustomerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>[]
          }
          delete: {
            args: Prisma.CustomerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          update: {
            args: Prisma.CustomerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          deleteMany: {
            args: Prisma.CustomerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CustomerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CustomerUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>[]
          }
          upsert: {
            args: Prisma.CustomerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          aggregate: {
            args: Prisma.CustomerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCustomer>
          }
          groupBy: {
            args: Prisma.CustomerGroupByArgs<ExtArgs>
            result: $Utils.Optional<CustomerGroupByOutputType>[]
          }
          count: {
            args: Prisma.CustomerCountArgs<ExtArgs>
            result: $Utils.Optional<CustomerCountAggregateOutputType> | number
          }
        }
      }
      Supplier: {
        payload: Prisma.$SupplierPayload<ExtArgs>
        fields: Prisma.SupplierFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SupplierFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SupplierFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>
          }
          findFirst: {
            args: Prisma.SupplierFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SupplierFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>
          }
          findMany: {
            args: Prisma.SupplierFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>[]
          }
          create: {
            args: Prisma.SupplierCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>
          }
          createMany: {
            args: Prisma.SupplierCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SupplierCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>[]
          }
          delete: {
            args: Prisma.SupplierDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>
          }
          update: {
            args: Prisma.SupplierUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>
          }
          deleteMany: {
            args: Prisma.SupplierDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SupplierUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SupplierUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>[]
          }
          upsert: {
            args: Prisma.SupplierUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>
          }
          aggregate: {
            args: Prisma.SupplierAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSupplier>
          }
          groupBy: {
            args: Prisma.SupplierGroupByArgs<ExtArgs>
            result: $Utils.Optional<SupplierGroupByOutputType>[]
          }
          count: {
            args: Prisma.SupplierCountArgs<ExtArgs>
            result: $Utils.Optional<SupplierCountAggregateOutputType> | number
          }
        }
      }
      Product: {
        payload: Prisma.$ProductPayload<ExtArgs>
        fields: Prisma.ProductFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          findFirst: {
            args: Prisma.ProductFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          findMany: {
            args: Prisma.ProductFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          create: {
            args: Prisma.ProductCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          createMany: {
            args: Prisma.ProductCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProductCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          delete: {
            args: Prisma.ProductDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          update: {
            args: Prisma.ProductUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          deleteMany: {
            args: Prisma.ProductDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProductUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          upsert: {
            args: Prisma.ProductUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          aggregate: {
            args: Prisma.ProductAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProduct>
          }
          groupBy: {
            args: Prisma.ProductGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductCountArgs<ExtArgs>
            result: $Utils.Optional<ProductCountAggregateOutputType> | number
          }
        }
      }
      SalesInvoice: {
        payload: Prisma.$SalesInvoicePayload<ExtArgs>
        fields: Prisma.SalesInvoiceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SalesInvoiceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesInvoicePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SalesInvoiceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesInvoicePayload>
          }
          findFirst: {
            args: Prisma.SalesInvoiceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesInvoicePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SalesInvoiceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesInvoicePayload>
          }
          findMany: {
            args: Prisma.SalesInvoiceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesInvoicePayload>[]
          }
          create: {
            args: Prisma.SalesInvoiceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesInvoicePayload>
          }
          createMany: {
            args: Prisma.SalesInvoiceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SalesInvoiceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesInvoicePayload>[]
          }
          delete: {
            args: Prisma.SalesInvoiceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesInvoicePayload>
          }
          update: {
            args: Prisma.SalesInvoiceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesInvoicePayload>
          }
          deleteMany: {
            args: Prisma.SalesInvoiceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SalesInvoiceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SalesInvoiceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesInvoicePayload>[]
          }
          upsert: {
            args: Prisma.SalesInvoiceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesInvoicePayload>
          }
          aggregate: {
            args: Prisma.SalesInvoiceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSalesInvoice>
          }
          groupBy: {
            args: Prisma.SalesInvoiceGroupByArgs<ExtArgs>
            result: $Utils.Optional<SalesInvoiceGroupByOutputType>[]
          }
          count: {
            args: Prisma.SalesInvoiceCountArgs<ExtArgs>
            result: $Utils.Optional<SalesInvoiceCountAggregateOutputType> | number
          }
        }
      }
      PurchaseInvoice: {
        payload: Prisma.$PurchaseInvoicePayload<ExtArgs>
        fields: Prisma.PurchaseInvoiceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PurchaseInvoiceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseInvoicePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PurchaseInvoiceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseInvoicePayload>
          }
          findFirst: {
            args: Prisma.PurchaseInvoiceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseInvoicePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PurchaseInvoiceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseInvoicePayload>
          }
          findMany: {
            args: Prisma.PurchaseInvoiceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseInvoicePayload>[]
          }
          create: {
            args: Prisma.PurchaseInvoiceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseInvoicePayload>
          }
          createMany: {
            args: Prisma.PurchaseInvoiceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PurchaseInvoiceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseInvoicePayload>[]
          }
          delete: {
            args: Prisma.PurchaseInvoiceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseInvoicePayload>
          }
          update: {
            args: Prisma.PurchaseInvoiceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseInvoicePayload>
          }
          deleteMany: {
            args: Prisma.PurchaseInvoiceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PurchaseInvoiceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PurchaseInvoiceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseInvoicePayload>[]
          }
          upsert: {
            args: Prisma.PurchaseInvoiceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseInvoicePayload>
          }
          aggregate: {
            args: Prisma.PurchaseInvoiceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePurchaseInvoice>
          }
          groupBy: {
            args: Prisma.PurchaseInvoiceGroupByArgs<ExtArgs>
            result: $Utils.Optional<PurchaseInvoiceGroupByOutputType>[]
          }
          count: {
            args: Prisma.PurchaseInvoiceCountArgs<ExtArgs>
            result: $Utils.Optional<PurchaseInvoiceCountAggregateOutputType> | number
          }
        }
      }
      InvoiceItem: {
        payload: Prisma.$InvoiceItemPayload<ExtArgs>
        fields: Prisma.InvoiceItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InvoiceItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InvoiceItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceItemPayload>
          }
          findFirst: {
            args: Prisma.InvoiceItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InvoiceItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceItemPayload>
          }
          findMany: {
            args: Prisma.InvoiceItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceItemPayload>[]
          }
          create: {
            args: Prisma.InvoiceItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceItemPayload>
          }
          createMany: {
            args: Prisma.InvoiceItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InvoiceItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceItemPayload>[]
          }
          delete: {
            args: Prisma.InvoiceItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceItemPayload>
          }
          update: {
            args: Prisma.InvoiceItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceItemPayload>
          }
          deleteMany: {
            args: Prisma.InvoiceItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InvoiceItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.InvoiceItemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceItemPayload>[]
          }
          upsert: {
            args: Prisma.InvoiceItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceItemPayload>
          }
          aggregate: {
            args: Prisma.InvoiceItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInvoiceItem>
          }
          groupBy: {
            args: Prisma.InvoiceItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<InvoiceItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.InvoiceItemCountArgs<ExtArgs>
            result: $Utils.Optional<InvoiceItemCountAggregateOutputType> | number
          }
        }
      }
      PurchaseItem: {
        payload: Prisma.$PurchaseItemPayload<ExtArgs>
        fields: Prisma.PurchaseItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PurchaseItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PurchaseItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseItemPayload>
          }
          findFirst: {
            args: Prisma.PurchaseItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PurchaseItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseItemPayload>
          }
          findMany: {
            args: Prisma.PurchaseItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseItemPayload>[]
          }
          create: {
            args: Prisma.PurchaseItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseItemPayload>
          }
          createMany: {
            args: Prisma.PurchaseItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PurchaseItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseItemPayload>[]
          }
          delete: {
            args: Prisma.PurchaseItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseItemPayload>
          }
          update: {
            args: Prisma.PurchaseItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseItemPayload>
          }
          deleteMany: {
            args: Prisma.PurchaseItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PurchaseItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PurchaseItemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseItemPayload>[]
          }
          upsert: {
            args: Prisma.PurchaseItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseItemPayload>
          }
          aggregate: {
            args: Prisma.PurchaseItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePurchaseItem>
          }
          groupBy: {
            args: Prisma.PurchaseItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<PurchaseItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.PurchaseItemCountArgs<ExtArgs>
            result: $Utils.Optional<PurchaseItemCountAggregateOutputType> | number
          }
        }
      }
      InventoryLog: {
        payload: Prisma.$InventoryLogPayload<ExtArgs>
        fields: Prisma.InventoryLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InventoryLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InventoryLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryLogPayload>
          }
          findFirst: {
            args: Prisma.InventoryLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InventoryLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryLogPayload>
          }
          findMany: {
            args: Prisma.InventoryLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryLogPayload>[]
          }
          create: {
            args: Prisma.InventoryLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryLogPayload>
          }
          createMany: {
            args: Prisma.InventoryLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InventoryLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryLogPayload>[]
          }
          delete: {
            args: Prisma.InventoryLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryLogPayload>
          }
          update: {
            args: Prisma.InventoryLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryLogPayload>
          }
          deleteMany: {
            args: Prisma.InventoryLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InventoryLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.InventoryLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryLogPayload>[]
          }
          upsert: {
            args: Prisma.InventoryLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryLogPayload>
          }
          aggregate: {
            args: Prisma.InventoryLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInventoryLog>
          }
          groupBy: {
            args: Prisma.InventoryLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<InventoryLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.InventoryLogCountArgs<ExtArgs>
            result: $Utils.Optional<InventoryLogCountAggregateOutputType> | number
          }
        }
      }
      Account: {
        payload: Prisma.$AccountPayload<ExtArgs>
        fields: Prisma.AccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findFirst: {
            args: Prisma.AccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findMany: {
            args: Prisma.AccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          create: {
            args: Prisma.AccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          createMany: {
            args: Prisma.AccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          delete: {
            args: Prisma.AccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          update: {
            args: Prisma.AccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          deleteMany: {
            args: Prisma.AccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          upsert: {
            args: Prisma.AccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccount>
          }
          groupBy: {
            args: Prisma.AccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccountCountArgs<ExtArgs>
            result: $Utils.Optional<AccountCountAggregateOutputType> | number
          }
        }
      }
      JournalVoucher: {
        payload: Prisma.$JournalVoucherPayload<ExtArgs>
        fields: Prisma.JournalVoucherFieldRefs
        operations: {
          findUnique: {
            args: Prisma.JournalVoucherFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalVoucherPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.JournalVoucherFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalVoucherPayload>
          }
          findFirst: {
            args: Prisma.JournalVoucherFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalVoucherPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.JournalVoucherFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalVoucherPayload>
          }
          findMany: {
            args: Prisma.JournalVoucherFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalVoucherPayload>[]
          }
          create: {
            args: Prisma.JournalVoucherCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalVoucherPayload>
          }
          createMany: {
            args: Prisma.JournalVoucherCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.JournalVoucherCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalVoucherPayload>[]
          }
          delete: {
            args: Prisma.JournalVoucherDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalVoucherPayload>
          }
          update: {
            args: Prisma.JournalVoucherUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalVoucherPayload>
          }
          deleteMany: {
            args: Prisma.JournalVoucherDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.JournalVoucherUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.JournalVoucherUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalVoucherPayload>[]
          }
          upsert: {
            args: Prisma.JournalVoucherUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalVoucherPayload>
          }
          aggregate: {
            args: Prisma.JournalVoucherAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateJournalVoucher>
          }
          groupBy: {
            args: Prisma.JournalVoucherGroupByArgs<ExtArgs>
            result: $Utils.Optional<JournalVoucherGroupByOutputType>[]
          }
          count: {
            args: Prisma.JournalVoucherCountArgs<ExtArgs>
            result: $Utils.Optional<JournalVoucherCountAggregateOutputType> | number
          }
        }
      }
      JournalEntry: {
        payload: Prisma.$JournalEntryPayload<ExtArgs>
        fields: Prisma.JournalEntryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.JournalEntryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalEntryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.JournalEntryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalEntryPayload>
          }
          findFirst: {
            args: Prisma.JournalEntryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalEntryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.JournalEntryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalEntryPayload>
          }
          findMany: {
            args: Prisma.JournalEntryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalEntryPayload>[]
          }
          create: {
            args: Prisma.JournalEntryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalEntryPayload>
          }
          createMany: {
            args: Prisma.JournalEntryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.JournalEntryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalEntryPayload>[]
          }
          delete: {
            args: Prisma.JournalEntryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalEntryPayload>
          }
          update: {
            args: Prisma.JournalEntryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalEntryPayload>
          }
          deleteMany: {
            args: Prisma.JournalEntryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.JournalEntryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.JournalEntryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalEntryPayload>[]
          }
          upsert: {
            args: Prisma.JournalEntryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalEntryPayload>
          }
          aggregate: {
            args: Prisma.JournalEntryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateJournalEntry>
          }
          groupBy: {
            args: Prisma.JournalEntryGroupByArgs<ExtArgs>
            result: $Utils.Optional<JournalEntryGroupByOutputType>[]
          }
          count: {
            args: Prisma.JournalEntryCountArgs<ExtArgs>
            result: $Utils.Optional<JournalEntryCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    customer?: CustomerOmit
    supplier?: SupplierOmit
    product?: ProductOmit
    salesInvoice?: SalesInvoiceOmit
    purchaseInvoice?: PurchaseInvoiceOmit
    invoiceItem?: InvoiceItemOmit
    purchaseItem?: PurchaseItemOmit
    inventoryLog?: InventoryLogOmit
    account?: AccountOmit
    journalVoucher?: JournalVoucherOmit
    journalEntry?: JournalEntryOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type CustomerCountOutputType
   */

  export type CustomerCountOutputType = {
    invoices: number
  }

  export type CustomerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoices?: boolean | CustomerCountOutputTypeCountInvoicesArgs
  }

  // Custom InputTypes
  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerCountOutputType
     */
    select?: CustomerCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeCountInvoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SalesInvoiceWhereInput
  }


  /**
   * Count Type SupplierCountOutputType
   */

  export type SupplierCountOutputType = {
    invoices: number
  }

  export type SupplierCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoices?: boolean | SupplierCountOutputTypeCountInvoicesArgs
  }

  // Custom InputTypes
  /**
   * SupplierCountOutputType without action
   */
  export type SupplierCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierCountOutputType
     */
    select?: SupplierCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SupplierCountOutputType without action
   */
  export type SupplierCountOutputTypeCountInvoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PurchaseInvoiceWhereInput
  }


  /**
   * Count Type ProductCountOutputType
   */

  export type ProductCountOutputType = {
    items: number
    purchaseItems: number
    inventoryLogs: number
  }

  export type ProductCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | ProductCountOutputTypeCountItemsArgs
    purchaseItems?: boolean | ProductCountOutputTypeCountPurchaseItemsArgs
    inventoryLogs?: boolean | ProductCountOutputTypeCountInventoryLogsArgs
  }

  // Custom InputTypes
  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductCountOutputType
     */
    select?: ProductCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceItemWhereInput
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountPurchaseItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PurchaseItemWhereInput
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountInventoryLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InventoryLogWhereInput
  }


  /**
   * Count Type SalesInvoiceCountOutputType
   */

  export type SalesInvoiceCountOutputType = {
    items: number
  }

  export type SalesInvoiceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | SalesInvoiceCountOutputTypeCountItemsArgs
  }

  // Custom InputTypes
  /**
   * SalesInvoiceCountOutputType without action
   */
  export type SalesInvoiceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesInvoiceCountOutputType
     */
    select?: SalesInvoiceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SalesInvoiceCountOutputType without action
   */
  export type SalesInvoiceCountOutputTypeCountItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceItemWhereInput
  }


  /**
   * Count Type PurchaseInvoiceCountOutputType
   */

  export type PurchaseInvoiceCountOutputType = {
    items: number
  }

  export type PurchaseInvoiceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | PurchaseInvoiceCountOutputTypeCountItemsArgs
  }

  // Custom InputTypes
  /**
   * PurchaseInvoiceCountOutputType without action
   */
  export type PurchaseInvoiceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseInvoiceCountOutputType
     */
    select?: PurchaseInvoiceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PurchaseInvoiceCountOutputType without action
   */
  export type PurchaseInvoiceCountOutputTypeCountItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PurchaseItemWhereInput
  }


  /**
   * Count Type AccountCountOutputType
   */

  export type AccountCountOutputType = {
    children: number
    entries: number
  }

  export type AccountCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    children?: boolean | AccountCountOutputTypeCountChildrenArgs
    entries?: boolean | AccountCountOutputTypeCountEntriesArgs
  }

  // Custom InputTypes
  /**
   * AccountCountOutputType without action
   */
  export type AccountCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountCountOutputType
     */
    select?: AccountCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AccountCountOutputType without action
   */
  export type AccountCountOutputTypeCountChildrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
  }

  /**
   * AccountCountOutputType without action
   */
  export type AccountCountOutputTypeCountEntriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JournalEntryWhereInput
  }


  /**
   * Count Type JournalVoucherCountOutputType
   */

  export type JournalVoucherCountOutputType = {
    entries: number
    invoices: number
    purchaseInvoices: number
  }

  export type JournalVoucherCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    entries?: boolean | JournalVoucherCountOutputTypeCountEntriesArgs
    invoices?: boolean | JournalVoucherCountOutputTypeCountInvoicesArgs
    purchaseInvoices?: boolean | JournalVoucherCountOutputTypeCountPurchaseInvoicesArgs
  }

  // Custom InputTypes
  /**
   * JournalVoucherCountOutputType without action
   */
  export type JournalVoucherCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalVoucherCountOutputType
     */
    select?: JournalVoucherCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * JournalVoucherCountOutputType without action
   */
  export type JournalVoucherCountOutputTypeCountEntriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JournalEntryWhereInput
  }

  /**
   * JournalVoucherCountOutputType without action
   */
  export type JournalVoucherCountOutputTypeCountInvoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SalesInvoiceWhereInput
  }

  /**
   * JournalVoucherCountOutputType without action
   */
  export type JournalVoucherCountOutputTypeCountPurchaseInvoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PurchaseInvoiceWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Customer
   */

  export type AggregateCustomer = {
    _count: CustomerCountAggregateOutputType | null
    _avg: CustomerAvgAggregateOutputType | null
    _sum: CustomerSumAggregateOutputType | null
    _min: CustomerMinAggregateOutputType | null
    _max: CustomerMaxAggregateOutputType | null
  }

  export type CustomerAvgAggregateOutputType = {
    balance: number | null
  }

  export type CustomerSumAggregateOutputType = {
    balance: number | null
  }

  export type CustomerMinAggregateOutputType = {
    id: string | null
    code: string | null
    name: string | null
    nameAr: string | null
    email: string | null
    phone: string | null
    address: string | null
    balance: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CustomerMaxAggregateOutputType = {
    id: string | null
    code: string | null
    name: string | null
    nameAr: string | null
    email: string | null
    phone: string | null
    address: string | null
    balance: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CustomerCountAggregateOutputType = {
    id: number
    code: number
    name: number
    nameAr: number
    email: number
    phone: number
    address: number
    balance: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CustomerAvgAggregateInputType = {
    balance?: true
  }

  export type CustomerSumAggregateInputType = {
    balance?: true
  }

  export type CustomerMinAggregateInputType = {
    id?: true
    code?: true
    name?: true
    nameAr?: true
    email?: true
    phone?: true
    address?: true
    balance?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CustomerMaxAggregateInputType = {
    id?: true
    code?: true
    name?: true
    nameAr?: true
    email?: true
    phone?: true
    address?: true
    balance?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CustomerCountAggregateInputType = {
    id?: true
    code?: true
    name?: true
    nameAr?: true
    email?: true
    phone?: true
    address?: true
    balance?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CustomerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Customer to aggregate.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Customers
    **/
    _count?: true | CustomerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CustomerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CustomerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CustomerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CustomerMaxAggregateInputType
  }

  export type GetCustomerAggregateType<T extends CustomerAggregateArgs> = {
        [P in keyof T & keyof AggregateCustomer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCustomer[P]>
      : GetScalarType<T[P], AggregateCustomer[P]>
  }




  export type CustomerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomerWhereInput
    orderBy?: CustomerOrderByWithAggregationInput | CustomerOrderByWithAggregationInput[]
    by: CustomerScalarFieldEnum[] | CustomerScalarFieldEnum
    having?: CustomerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CustomerCountAggregateInputType | true
    _avg?: CustomerAvgAggregateInputType
    _sum?: CustomerSumAggregateInputType
    _min?: CustomerMinAggregateInputType
    _max?: CustomerMaxAggregateInputType
  }

  export type CustomerGroupByOutputType = {
    id: string
    code: string
    name: string
    nameAr: string | null
    email: string | null
    phone: string | null
    address: string | null
    balance: number
    createdAt: Date
    updatedAt: Date
    _count: CustomerCountAggregateOutputType | null
    _avg: CustomerAvgAggregateOutputType | null
    _sum: CustomerSumAggregateOutputType | null
    _min: CustomerMinAggregateOutputType | null
    _max: CustomerMaxAggregateOutputType | null
  }

  type GetCustomerGroupByPayload<T extends CustomerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CustomerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CustomerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CustomerGroupByOutputType[P]>
            : GetScalarType<T[P], CustomerGroupByOutputType[P]>
        }
      >
    >


  export type CustomerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    nameAr?: boolean
    email?: boolean
    phone?: boolean
    address?: boolean
    balance?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    invoices?: boolean | Customer$invoicesArgs<ExtArgs>
    _count?: boolean | CustomerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["customer"]>

  export type CustomerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    nameAr?: boolean
    email?: boolean
    phone?: boolean
    address?: boolean
    balance?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["customer"]>

  export type CustomerSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    nameAr?: boolean
    email?: boolean
    phone?: boolean
    address?: boolean
    balance?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["customer"]>

  export type CustomerSelectScalar = {
    id?: boolean
    code?: boolean
    name?: boolean
    nameAr?: boolean
    email?: boolean
    phone?: boolean
    address?: boolean
    balance?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CustomerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "code" | "name" | "nameAr" | "email" | "phone" | "address" | "balance" | "createdAt" | "updatedAt", ExtArgs["result"]["customer"]>
  export type CustomerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoices?: boolean | Customer$invoicesArgs<ExtArgs>
    _count?: boolean | CustomerCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CustomerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type CustomerIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CustomerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Customer"
    objects: {
      invoices: Prisma.$SalesInvoicePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      code: string
      name: string
      nameAr: string | null
      email: string | null
      phone: string | null
      address: string | null
      balance: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["customer"]>
    composites: {}
  }

  type CustomerGetPayload<S extends boolean | null | undefined | CustomerDefaultArgs> = $Result.GetResult<Prisma.$CustomerPayload, S>

  type CustomerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CustomerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CustomerCountAggregateInputType | true
    }

  export interface CustomerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Customer'], meta: { name: 'Customer' } }
    /**
     * Find zero or one Customer that matches the filter.
     * @param {CustomerFindUniqueArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CustomerFindUniqueArgs>(args: SelectSubset<T, CustomerFindUniqueArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Customer that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CustomerFindUniqueOrThrowArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CustomerFindUniqueOrThrowArgs>(args: SelectSubset<T, CustomerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Customer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindFirstArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CustomerFindFirstArgs>(args?: SelectSubset<T, CustomerFindFirstArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Customer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindFirstOrThrowArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CustomerFindFirstOrThrowArgs>(args?: SelectSubset<T, CustomerFindFirstOrThrowArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Customers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Customers
     * const customers = await prisma.customer.findMany()
     * 
     * // Get first 10 Customers
     * const customers = await prisma.customer.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const customerWithIdOnly = await prisma.customer.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CustomerFindManyArgs>(args?: SelectSubset<T, CustomerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Customer.
     * @param {CustomerCreateArgs} args - Arguments to create a Customer.
     * @example
     * // Create one Customer
     * const Customer = await prisma.customer.create({
     *   data: {
     *     // ... data to create a Customer
     *   }
     * })
     * 
     */
    create<T extends CustomerCreateArgs>(args: SelectSubset<T, CustomerCreateArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Customers.
     * @param {CustomerCreateManyArgs} args - Arguments to create many Customers.
     * @example
     * // Create many Customers
     * const customer = await prisma.customer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CustomerCreateManyArgs>(args?: SelectSubset<T, CustomerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Customers and returns the data saved in the database.
     * @param {CustomerCreateManyAndReturnArgs} args - Arguments to create many Customers.
     * @example
     * // Create many Customers
     * const customer = await prisma.customer.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Customers and only return the `id`
     * const customerWithIdOnly = await prisma.customer.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CustomerCreateManyAndReturnArgs>(args?: SelectSubset<T, CustomerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Customer.
     * @param {CustomerDeleteArgs} args - Arguments to delete one Customer.
     * @example
     * // Delete one Customer
     * const Customer = await prisma.customer.delete({
     *   where: {
     *     // ... filter to delete one Customer
     *   }
     * })
     * 
     */
    delete<T extends CustomerDeleteArgs>(args: SelectSubset<T, CustomerDeleteArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Customer.
     * @param {CustomerUpdateArgs} args - Arguments to update one Customer.
     * @example
     * // Update one Customer
     * const customer = await prisma.customer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CustomerUpdateArgs>(args: SelectSubset<T, CustomerUpdateArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Customers.
     * @param {CustomerDeleteManyArgs} args - Arguments to filter Customers to delete.
     * @example
     * // Delete a few Customers
     * const { count } = await prisma.customer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CustomerDeleteManyArgs>(args?: SelectSubset<T, CustomerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Customers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Customers
     * const customer = await prisma.customer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CustomerUpdateManyArgs>(args: SelectSubset<T, CustomerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Customers and returns the data updated in the database.
     * @param {CustomerUpdateManyAndReturnArgs} args - Arguments to update many Customers.
     * @example
     * // Update many Customers
     * const customer = await prisma.customer.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Customers and only return the `id`
     * const customerWithIdOnly = await prisma.customer.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CustomerUpdateManyAndReturnArgs>(args: SelectSubset<T, CustomerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Customer.
     * @param {CustomerUpsertArgs} args - Arguments to update or create a Customer.
     * @example
     * // Update or create a Customer
     * const customer = await prisma.customer.upsert({
     *   create: {
     *     // ... data to create a Customer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Customer we want to update
     *   }
     * })
     */
    upsert<T extends CustomerUpsertArgs>(args: SelectSubset<T, CustomerUpsertArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Customers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerCountArgs} args - Arguments to filter Customers to count.
     * @example
     * // Count the number of Customers
     * const count = await prisma.customer.count({
     *   where: {
     *     // ... the filter for the Customers we want to count
     *   }
     * })
    **/
    count<T extends CustomerCountArgs>(
      args?: Subset<T, CustomerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CustomerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Customer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CustomerAggregateArgs>(args: Subset<T, CustomerAggregateArgs>): Prisma.PrismaPromise<GetCustomerAggregateType<T>>

    /**
     * Group by Customer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CustomerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CustomerGroupByArgs['orderBy'] }
        : { orderBy?: CustomerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CustomerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCustomerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Customer model
   */
  readonly fields: CustomerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Customer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CustomerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    invoices<T extends Customer$invoicesArgs<ExtArgs> = {}>(args?: Subset<T, Customer$invoicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalesInvoicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Customer model
   */
  interface CustomerFieldRefs {
    readonly id: FieldRef<"Customer", 'String'>
    readonly code: FieldRef<"Customer", 'String'>
    readonly name: FieldRef<"Customer", 'String'>
    readonly nameAr: FieldRef<"Customer", 'String'>
    readonly email: FieldRef<"Customer", 'String'>
    readonly phone: FieldRef<"Customer", 'String'>
    readonly address: FieldRef<"Customer", 'String'>
    readonly balance: FieldRef<"Customer", 'Float'>
    readonly createdAt: FieldRef<"Customer", 'DateTime'>
    readonly updatedAt: FieldRef<"Customer", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Customer findUnique
   */
  export type CustomerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer findUniqueOrThrow
   */
  export type CustomerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer findFirst
   */
  export type CustomerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Customers.
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Customers.
     */
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Customer findFirstOrThrow
   */
  export type CustomerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Customers.
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Customers.
     */
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Customer findMany
   */
  export type CustomerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customers to fetch.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Customers.
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Customer create
   */
  export type CustomerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * The data needed to create a Customer.
     */
    data: XOR<CustomerCreateInput, CustomerUncheckedCreateInput>
  }

  /**
   * Customer createMany
   */
  export type CustomerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Customers.
     */
    data: CustomerCreateManyInput | CustomerCreateManyInput[]
  }

  /**
   * Customer createManyAndReturn
   */
  export type CustomerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * The data used to create many Customers.
     */
    data: CustomerCreateManyInput | CustomerCreateManyInput[]
  }

  /**
   * Customer update
   */
  export type CustomerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * The data needed to update a Customer.
     */
    data: XOR<CustomerUpdateInput, CustomerUncheckedUpdateInput>
    /**
     * Choose, which Customer to update.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer updateMany
   */
  export type CustomerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Customers.
     */
    data: XOR<CustomerUpdateManyMutationInput, CustomerUncheckedUpdateManyInput>
    /**
     * Filter which Customers to update
     */
    where?: CustomerWhereInput
    /**
     * Limit how many Customers to update.
     */
    limit?: number
  }

  /**
   * Customer updateManyAndReturn
   */
  export type CustomerUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * The data used to update Customers.
     */
    data: XOR<CustomerUpdateManyMutationInput, CustomerUncheckedUpdateManyInput>
    /**
     * Filter which Customers to update
     */
    where?: CustomerWhereInput
    /**
     * Limit how many Customers to update.
     */
    limit?: number
  }

  /**
   * Customer upsert
   */
  export type CustomerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * The filter to search for the Customer to update in case it exists.
     */
    where: CustomerWhereUniqueInput
    /**
     * In case the Customer found by the `where` argument doesn't exist, create a new Customer with this data.
     */
    create: XOR<CustomerCreateInput, CustomerUncheckedCreateInput>
    /**
     * In case the Customer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CustomerUpdateInput, CustomerUncheckedUpdateInput>
  }

  /**
   * Customer delete
   */
  export type CustomerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter which Customer to delete.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer deleteMany
   */
  export type CustomerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Customers to delete
     */
    where?: CustomerWhereInput
    /**
     * Limit how many Customers to delete.
     */
    limit?: number
  }

  /**
   * Customer.invoices
   */
  export type Customer$invoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesInvoice
     */
    select?: SalesInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesInvoice
     */
    omit?: SalesInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesInvoiceInclude<ExtArgs> | null
    where?: SalesInvoiceWhereInput
    orderBy?: SalesInvoiceOrderByWithRelationInput | SalesInvoiceOrderByWithRelationInput[]
    cursor?: SalesInvoiceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SalesInvoiceScalarFieldEnum | SalesInvoiceScalarFieldEnum[]
  }

  /**
   * Customer without action
   */
  export type CustomerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
  }


  /**
   * Model Supplier
   */

  export type AggregateSupplier = {
    _count: SupplierCountAggregateOutputType | null
    _avg: SupplierAvgAggregateOutputType | null
    _sum: SupplierSumAggregateOutputType | null
    _min: SupplierMinAggregateOutputType | null
    _max: SupplierMaxAggregateOutputType | null
  }

  export type SupplierAvgAggregateOutputType = {
    balance: number | null
  }

  export type SupplierSumAggregateOutputType = {
    balance: number | null
  }

  export type SupplierMinAggregateOutputType = {
    id: string | null
    code: string | null
    name: string | null
    nameAr: string | null
    email: string | null
    phone: string | null
    address: string | null
    balance: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SupplierMaxAggregateOutputType = {
    id: string | null
    code: string | null
    name: string | null
    nameAr: string | null
    email: string | null
    phone: string | null
    address: string | null
    balance: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SupplierCountAggregateOutputType = {
    id: number
    code: number
    name: number
    nameAr: number
    email: number
    phone: number
    address: number
    balance: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SupplierAvgAggregateInputType = {
    balance?: true
  }

  export type SupplierSumAggregateInputType = {
    balance?: true
  }

  export type SupplierMinAggregateInputType = {
    id?: true
    code?: true
    name?: true
    nameAr?: true
    email?: true
    phone?: true
    address?: true
    balance?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SupplierMaxAggregateInputType = {
    id?: true
    code?: true
    name?: true
    nameAr?: true
    email?: true
    phone?: true
    address?: true
    balance?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SupplierCountAggregateInputType = {
    id?: true
    code?: true
    name?: true
    nameAr?: true
    email?: true
    phone?: true
    address?: true
    balance?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SupplierAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Supplier to aggregate.
     */
    where?: SupplierWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Suppliers to fetch.
     */
    orderBy?: SupplierOrderByWithRelationInput | SupplierOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SupplierWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Suppliers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Suppliers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Suppliers
    **/
    _count?: true | SupplierCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SupplierAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SupplierSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SupplierMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SupplierMaxAggregateInputType
  }

  export type GetSupplierAggregateType<T extends SupplierAggregateArgs> = {
        [P in keyof T & keyof AggregateSupplier]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSupplier[P]>
      : GetScalarType<T[P], AggregateSupplier[P]>
  }




  export type SupplierGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SupplierWhereInput
    orderBy?: SupplierOrderByWithAggregationInput | SupplierOrderByWithAggregationInput[]
    by: SupplierScalarFieldEnum[] | SupplierScalarFieldEnum
    having?: SupplierScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SupplierCountAggregateInputType | true
    _avg?: SupplierAvgAggregateInputType
    _sum?: SupplierSumAggregateInputType
    _min?: SupplierMinAggregateInputType
    _max?: SupplierMaxAggregateInputType
  }

  export type SupplierGroupByOutputType = {
    id: string
    code: string
    name: string
    nameAr: string | null
    email: string | null
    phone: string | null
    address: string | null
    balance: number
    createdAt: Date
    updatedAt: Date
    _count: SupplierCountAggregateOutputType | null
    _avg: SupplierAvgAggregateOutputType | null
    _sum: SupplierSumAggregateOutputType | null
    _min: SupplierMinAggregateOutputType | null
    _max: SupplierMaxAggregateOutputType | null
  }

  type GetSupplierGroupByPayload<T extends SupplierGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SupplierGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SupplierGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SupplierGroupByOutputType[P]>
            : GetScalarType<T[P], SupplierGroupByOutputType[P]>
        }
      >
    >


  export type SupplierSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    nameAr?: boolean
    email?: boolean
    phone?: boolean
    address?: boolean
    balance?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    invoices?: boolean | Supplier$invoicesArgs<ExtArgs>
    _count?: boolean | SupplierCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["supplier"]>

  export type SupplierSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    nameAr?: boolean
    email?: boolean
    phone?: boolean
    address?: boolean
    balance?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["supplier"]>

  export type SupplierSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    nameAr?: boolean
    email?: boolean
    phone?: boolean
    address?: boolean
    balance?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["supplier"]>

  export type SupplierSelectScalar = {
    id?: boolean
    code?: boolean
    name?: boolean
    nameAr?: boolean
    email?: boolean
    phone?: boolean
    address?: boolean
    balance?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SupplierOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "code" | "name" | "nameAr" | "email" | "phone" | "address" | "balance" | "createdAt" | "updatedAt", ExtArgs["result"]["supplier"]>
  export type SupplierInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoices?: boolean | Supplier$invoicesArgs<ExtArgs>
    _count?: boolean | SupplierCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SupplierIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type SupplierIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $SupplierPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Supplier"
    objects: {
      invoices: Prisma.$PurchaseInvoicePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      code: string
      name: string
      nameAr: string | null
      email: string | null
      phone: string | null
      address: string | null
      balance: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["supplier"]>
    composites: {}
  }

  type SupplierGetPayload<S extends boolean | null | undefined | SupplierDefaultArgs> = $Result.GetResult<Prisma.$SupplierPayload, S>

  type SupplierCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SupplierFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SupplierCountAggregateInputType | true
    }

  export interface SupplierDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Supplier'], meta: { name: 'Supplier' } }
    /**
     * Find zero or one Supplier that matches the filter.
     * @param {SupplierFindUniqueArgs} args - Arguments to find a Supplier
     * @example
     * // Get one Supplier
     * const supplier = await prisma.supplier.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SupplierFindUniqueArgs>(args: SelectSubset<T, SupplierFindUniqueArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Supplier that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SupplierFindUniqueOrThrowArgs} args - Arguments to find a Supplier
     * @example
     * // Get one Supplier
     * const supplier = await prisma.supplier.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SupplierFindUniqueOrThrowArgs>(args: SelectSubset<T, SupplierFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Supplier that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierFindFirstArgs} args - Arguments to find a Supplier
     * @example
     * // Get one Supplier
     * const supplier = await prisma.supplier.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SupplierFindFirstArgs>(args?: SelectSubset<T, SupplierFindFirstArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Supplier that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierFindFirstOrThrowArgs} args - Arguments to find a Supplier
     * @example
     * // Get one Supplier
     * const supplier = await prisma.supplier.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SupplierFindFirstOrThrowArgs>(args?: SelectSubset<T, SupplierFindFirstOrThrowArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Suppliers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Suppliers
     * const suppliers = await prisma.supplier.findMany()
     * 
     * // Get first 10 Suppliers
     * const suppliers = await prisma.supplier.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const supplierWithIdOnly = await prisma.supplier.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SupplierFindManyArgs>(args?: SelectSubset<T, SupplierFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Supplier.
     * @param {SupplierCreateArgs} args - Arguments to create a Supplier.
     * @example
     * // Create one Supplier
     * const Supplier = await prisma.supplier.create({
     *   data: {
     *     // ... data to create a Supplier
     *   }
     * })
     * 
     */
    create<T extends SupplierCreateArgs>(args: SelectSubset<T, SupplierCreateArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Suppliers.
     * @param {SupplierCreateManyArgs} args - Arguments to create many Suppliers.
     * @example
     * // Create many Suppliers
     * const supplier = await prisma.supplier.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SupplierCreateManyArgs>(args?: SelectSubset<T, SupplierCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Suppliers and returns the data saved in the database.
     * @param {SupplierCreateManyAndReturnArgs} args - Arguments to create many Suppliers.
     * @example
     * // Create many Suppliers
     * const supplier = await prisma.supplier.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Suppliers and only return the `id`
     * const supplierWithIdOnly = await prisma.supplier.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SupplierCreateManyAndReturnArgs>(args?: SelectSubset<T, SupplierCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Supplier.
     * @param {SupplierDeleteArgs} args - Arguments to delete one Supplier.
     * @example
     * // Delete one Supplier
     * const Supplier = await prisma.supplier.delete({
     *   where: {
     *     // ... filter to delete one Supplier
     *   }
     * })
     * 
     */
    delete<T extends SupplierDeleteArgs>(args: SelectSubset<T, SupplierDeleteArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Supplier.
     * @param {SupplierUpdateArgs} args - Arguments to update one Supplier.
     * @example
     * // Update one Supplier
     * const supplier = await prisma.supplier.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SupplierUpdateArgs>(args: SelectSubset<T, SupplierUpdateArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Suppliers.
     * @param {SupplierDeleteManyArgs} args - Arguments to filter Suppliers to delete.
     * @example
     * // Delete a few Suppliers
     * const { count } = await prisma.supplier.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SupplierDeleteManyArgs>(args?: SelectSubset<T, SupplierDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Suppliers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Suppliers
     * const supplier = await prisma.supplier.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SupplierUpdateManyArgs>(args: SelectSubset<T, SupplierUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Suppliers and returns the data updated in the database.
     * @param {SupplierUpdateManyAndReturnArgs} args - Arguments to update many Suppliers.
     * @example
     * // Update many Suppliers
     * const supplier = await prisma.supplier.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Suppliers and only return the `id`
     * const supplierWithIdOnly = await prisma.supplier.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SupplierUpdateManyAndReturnArgs>(args: SelectSubset<T, SupplierUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Supplier.
     * @param {SupplierUpsertArgs} args - Arguments to update or create a Supplier.
     * @example
     * // Update or create a Supplier
     * const supplier = await prisma.supplier.upsert({
     *   create: {
     *     // ... data to create a Supplier
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Supplier we want to update
     *   }
     * })
     */
    upsert<T extends SupplierUpsertArgs>(args: SelectSubset<T, SupplierUpsertArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Suppliers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierCountArgs} args - Arguments to filter Suppliers to count.
     * @example
     * // Count the number of Suppliers
     * const count = await prisma.supplier.count({
     *   where: {
     *     // ... the filter for the Suppliers we want to count
     *   }
     * })
    **/
    count<T extends SupplierCountArgs>(
      args?: Subset<T, SupplierCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SupplierCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Supplier.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SupplierAggregateArgs>(args: Subset<T, SupplierAggregateArgs>): Prisma.PrismaPromise<GetSupplierAggregateType<T>>

    /**
     * Group by Supplier.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SupplierGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SupplierGroupByArgs['orderBy'] }
        : { orderBy?: SupplierGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SupplierGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSupplierGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Supplier model
   */
  readonly fields: SupplierFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Supplier.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SupplierClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    invoices<T extends Supplier$invoicesArgs<ExtArgs> = {}>(args?: Subset<T, Supplier$invoicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchaseInvoicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Supplier model
   */
  interface SupplierFieldRefs {
    readonly id: FieldRef<"Supplier", 'String'>
    readonly code: FieldRef<"Supplier", 'String'>
    readonly name: FieldRef<"Supplier", 'String'>
    readonly nameAr: FieldRef<"Supplier", 'String'>
    readonly email: FieldRef<"Supplier", 'String'>
    readonly phone: FieldRef<"Supplier", 'String'>
    readonly address: FieldRef<"Supplier", 'String'>
    readonly balance: FieldRef<"Supplier", 'Float'>
    readonly createdAt: FieldRef<"Supplier", 'DateTime'>
    readonly updatedAt: FieldRef<"Supplier", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Supplier findUnique
   */
  export type SupplierFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * Filter, which Supplier to fetch.
     */
    where: SupplierWhereUniqueInput
  }

  /**
   * Supplier findUniqueOrThrow
   */
  export type SupplierFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * Filter, which Supplier to fetch.
     */
    where: SupplierWhereUniqueInput
  }

  /**
   * Supplier findFirst
   */
  export type SupplierFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * Filter, which Supplier to fetch.
     */
    where?: SupplierWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Suppliers to fetch.
     */
    orderBy?: SupplierOrderByWithRelationInput | SupplierOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Suppliers.
     */
    cursor?: SupplierWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Suppliers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Suppliers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Suppliers.
     */
    distinct?: SupplierScalarFieldEnum | SupplierScalarFieldEnum[]
  }

  /**
   * Supplier findFirstOrThrow
   */
  export type SupplierFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * Filter, which Supplier to fetch.
     */
    where?: SupplierWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Suppliers to fetch.
     */
    orderBy?: SupplierOrderByWithRelationInput | SupplierOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Suppliers.
     */
    cursor?: SupplierWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Suppliers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Suppliers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Suppliers.
     */
    distinct?: SupplierScalarFieldEnum | SupplierScalarFieldEnum[]
  }

  /**
   * Supplier findMany
   */
  export type SupplierFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * Filter, which Suppliers to fetch.
     */
    where?: SupplierWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Suppliers to fetch.
     */
    orderBy?: SupplierOrderByWithRelationInput | SupplierOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Suppliers.
     */
    cursor?: SupplierWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Suppliers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Suppliers.
     */
    skip?: number
    distinct?: SupplierScalarFieldEnum | SupplierScalarFieldEnum[]
  }

  /**
   * Supplier create
   */
  export type SupplierCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * The data needed to create a Supplier.
     */
    data: XOR<SupplierCreateInput, SupplierUncheckedCreateInput>
  }

  /**
   * Supplier createMany
   */
  export type SupplierCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Suppliers.
     */
    data: SupplierCreateManyInput | SupplierCreateManyInput[]
  }

  /**
   * Supplier createManyAndReturn
   */
  export type SupplierCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * The data used to create many Suppliers.
     */
    data: SupplierCreateManyInput | SupplierCreateManyInput[]
  }

  /**
   * Supplier update
   */
  export type SupplierUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * The data needed to update a Supplier.
     */
    data: XOR<SupplierUpdateInput, SupplierUncheckedUpdateInput>
    /**
     * Choose, which Supplier to update.
     */
    where: SupplierWhereUniqueInput
  }

  /**
   * Supplier updateMany
   */
  export type SupplierUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Suppliers.
     */
    data: XOR<SupplierUpdateManyMutationInput, SupplierUncheckedUpdateManyInput>
    /**
     * Filter which Suppliers to update
     */
    where?: SupplierWhereInput
    /**
     * Limit how many Suppliers to update.
     */
    limit?: number
  }

  /**
   * Supplier updateManyAndReturn
   */
  export type SupplierUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * The data used to update Suppliers.
     */
    data: XOR<SupplierUpdateManyMutationInput, SupplierUncheckedUpdateManyInput>
    /**
     * Filter which Suppliers to update
     */
    where?: SupplierWhereInput
    /**
     * Limit how many Suppliers to update.
     */
    limit?: number
  }

  /**
   * Supplier upsert
   */
  export type SupplierUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * The filter to search for the Supplier to update in case it exists.
     */
    where: SupplierWhereUniqueInput
    /**
     * In case the Supplier found by the `where` argument doesn't exist, create a new Supplier with this data.
     */
    create: XOR<SupplierCreateInput, SupplierUncheckedCreateInput>
    /**
     * In case the Supplier was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SupplierUpdateInput, SupplierUncheckedUpdateInput>
  }

  /**
   * Supplier delete
   */
  export type SupplierDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * Filter which Supplier to delete.
     */
    where: SupplierWhereUniqueInput
  }

  /**
   * Supplier deleteMany
   */
  export type SupplierDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Suppliers to delete
     */
    where?: SupplierWhereInput
    /**
     * Limit how many Suppliers to delete.
     */
    limit?: number
  }

  /**
   * Supplier.invoices
   */
  export type Supplier$invoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseInvoice
     */
    select?: PurchaseInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseInvoice
     */
    omit?: PurchaseInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInvoiceInclude<ExtArgs> | null
    where?: PurchaseInvoiceWhereInput
    orderBy?: PurchaseInvoiceOrderByWithRelationInput | PurchaseInvoiceOrderByWithRelationInput[]
    cursor?: PurchaseInvoiceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PurchaseInvoiceScalarFieldEnum | PurchaseInvoiceScalarFieldEnum[]
  }

  /**
   * Supplier without action
   */
  export type SupplierDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
  }


  /**
   * Model Product
   */

  export type AggregateProduct = {
    _count: ProductCountAggregateOutputType | null
    _avg: ProductAvgAggregateOutputType | null
    _sum: ProductSumAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  export type ProductAvgAggregateOutputType = {
    costPrice: number | null
    salePrice: number | null
    stockQuantity: number | null
    reorderPoint: number | null
  }

  export type ProductSumAggregateOutputType = {
    costPrice: number | null
    salePrice: number | null
    stockQuantity: number | null
    reorderPoint: number | null
  }

  export type ProductMinAggregateOutputType = {
    id: string | null
    sku: string | null
    name: string | null
    nameAr: string | null
    description: string | null
    category: string | null
    unit: string | null
    costPrice: number | null
    salePrice: number | null
    stockQuantity: number | null
    reorderPoint: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProductMaxAggregateOutputType = {
    id: string | null
    sku: string | null
    name: string | null
    nameAr: string | null
    description: string | null
    category: string | null
    unit: string | null
    costPrice: number | null
    salePrice: number | null
    stockQuantity: number | null
    reorderPoint: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProductCountAggregateOutputType = {
    id: number
    sku: number
    name: number
    nameAr: number
    description: number
    category: number
    unit: number
    costPrice: number
    salePrice: number
    stockQuantity: number
    reorderPoint: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProductAvgAggregateInputType = {
    costPrice?: true
    salePrice?: true
    stockQuantity?: true
    reorderPoint?: true
  }

  export type ProductSumAggregateInputType = {
    costPrice?: true
    salePrice?: true
    stockQuantity?: true
    reorderPoint?: true
  }

  export type ProductMinAggregateInputType = {
    id?: true
    sku?: true
    name?: true
    nameAr?: true
    description?: true
    category?: true
    unit?: true
    costPrice?: true
    salePrice?: true
    stockQuantity?: true
    reorderPoint?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProductMaxAggregateInputType = {
    id?: true
    sku?: true
    name?: true
    nameAr?: true
    description?: true
    category?: true
    unit?: true
    costPrice?: true
    salePrice?: true
    stockQuantity?: true
    reorderPoint?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProductCountAggregateInputType = {
    id?: true
    sku?: true
    name?: true
    nameAr?: true
    description?: true
    category?: true
    unit?: true
    costPrice?: true
    salePrice?: true
    stockQuantity?: true
    reorderPoint?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProductAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Product to aggregate.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Products
    **/
    _count?: true | ProductCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProductAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProductSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductMaxAggregateInputType
  }

  export type GetProductAggregateType<T extends ProductAggregateArgs> = {
        [P in keyof T & keyof AggregateProduct]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProduct[P]>
      : GetScalarType<T[P], AggregateProduct[P]>
  }




  export type ProductGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductWhereInput
    orderBy?: ProductOrderByWithAggregationInput | ProductOrderByWithAggregationInput[]
    by: ProductScalarFieldEnum[] | ProductScalarFieldEnum
    having?: ProductScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductCountAggregateInputType | true
    _avg?: ProductAvgAggregateInputType
    _sum?: ProductSumAggregateInputType
    _min?: ProductMinAggregateInputType
    _max?: ProductMaxAggregateInputType
  }

  export type ProductGroupByOutputType = {
    id: string
    sku: string
    name: string
    nameAr: string | null
    description: string | null
    category: string | null
    unit: string
    costPrice: number
    salePrice: number
    stockQuantity: number
    reorderPoint: number
    createdAt: Date
    updatedAt: Date
    _count: ProductCountAggregateOutputType | null
    _avg: ProductAvgAggregateOutputType | null
    _sum: ProductSumAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  type GetProductGroupByPayload<T extends ProductGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductGroupByOutputType[P]>
            : GetScalarType<T[P], ProductGroupByOutputType[P]>
        }
      >
    >


  export type ProductSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sku?: boolean
    name?: boolean
    nameAr?: boolean
    description?: boolean
    category?: boolean
    unit?: boolean
    costPrice?: boolean
    salePrice?: boolean
    stockQuantity?: boolean
    reorderPoint?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    items?: boolean | Product$itemsArgs<ExtArgs>
    purchaseItems?: boolean | Product$purchaseItemsArgs<ExtArgs>
    inventoryLogs?: boolean | Product$inventoryLogsArgs<ExtArgs>
    _count?: boolean | ProductCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["product"]>

  export type ProductSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sku?: boolean
    name?: boolean
    nameAr?: boolean
    description?: boolean
    category?: boolean
    unit?: boolean
    costPrice?: boolean
    salePrice?: boolean
    stockQuantity?: boolean
    reorderPoint?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["product"]>

  export type ProductSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sku?: boolean
    name?: boolean
    nameAr?: boolean
    description?: boolean
    category?: boolean
    unit?: boolean
    costPrice?: boolean
    salePrice?: boolean
    stockQuantity?: boolean
    reorderPoint?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["product"]>

  export type ProductSelectScalar = {
    id?: boolean
    sku?: boolean
    name?: boolean
    nameAr?: boolean
    description?: boolean
    category?: boolean
    unit?: boolean
    costPrice?: boolean
    salePrice?: boolean
    stockQuantity?: boolean
    reorderPoint?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProductOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sku" | "name" | "nameAr" | "description" | "category" | "unit" | "costPrice" | "salePrice" | "stockQuantity" | "reorderPoint" | "createdAt" | "updatedAt", ExtArgs["result"]["product"]>
  export type ProductInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | Product$itemsArgs<ExtArgs>
    purchaseItems?: boolean | Product$purchaseItemsArgs<ExtArgs>
    inventoryLogs?: boolean | Product$inventoryLogsArgs<ExtArgs>
    _count?: boolean | ProductCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProductIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ProductIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ProductPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Product"
    objects: {
      items: Prisma.$InvoiceItemPayload<ExtArgs>[]
      purchaseItems: Prisma.$PurchaseItemPayload<ExtArgs>[]
      inventoryLogs: Prisma.$InventoryLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sku: string
      name: string
      nameAr: string | null
      description: string | null
      category: string | null
      unit: string
      costPrice: number
      salePrice: number
      stockQuantity: number
      reorderPoint: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["product"]>
    composites: {}
  }

  type ProductGetPayload<S extends boolean | null | undefined | ProductDefaultArgs> = $Result.GetResult<Prisma.$ProductPayload, S>

  type ProductCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProductFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProductCountAggregateInputType | true
    }

  export interface ProductDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Product'], meta: { name: 'Product' } }
    /**
     * Find zero or one Product that matches the filter.
     * @param {ProductFindUniqueArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductFindUniqueArgs>(args: SelectSubset<T, ProductFindUniqueArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Product that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProductFindUniqueOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Product that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductFindFirstArgs>(args?: SelectSubset<T, ProductFindFirstArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Product that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Products that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Products
     * const products = await prisma.product.findMany()
     * 
     * // Get first 10 Products
     * const products = await prisma.product.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productWithIdOnly = await prisma.product.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProductFindManyArgs>(args?: SelectSubset<T, ProductFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Product.
     * @param {ProductCreateArgs} args - Arguments to create a Product.
     * @example
     * // Create one Product
     * const Product = await prisma.product.create({
     *   data: {
     *     // ... data to create a Product
     *   }
     * })
     * 
     */
    create<T extends ProductCreateArgs>(args: SelectSubset<T, ProductCreateArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Products.
     * @param {ProductCreateManyArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const product = await prisma.product.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductCreateManyArgs>(args?: SelectSubset<T, ProductCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Products and returns the data saved in the database.
     * @param {ProductCreateManyAndReturnArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const product = await prisma.product.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Products and only return the `id`
     * const productWithIdOnly = await prisma.product.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProductCreateManyAndReturnArgs>(args?: SelectSubset<T, ProductCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Product.
     * @param {ProductDeleteArgs} args - Arguments to delete one Product.
     * @example
     * // Delete one Product
     * const Product = await prisma.product.delete({
     *   where: {
     *     // ... filter to delete one Product
     *   }
     * })
     * 
     */
    delete<T extends ProductDeleteArgs>(args: SelectSubset<T, ProductDeleteArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Product.
     * @param {ProductUpdateArgs} args - Arguments to update one Product.
     * @example
     * // Update one Product
     * const product = await prisma.product.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductUpdateArgs>(args: SelectSubset<T, ProductUpdateArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Products.
     * @param {ProductDeleteManyArgs} args - Arguments to filter Products to delete.
     * @example
     * // Delete a few Products
     * const { count } = await prisma.product.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductDeleteManyArgs>(args?: SelectSubset<T, ProductDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Products
     * const product = await prisma.product.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductUpdateManyArgs>(args: SelectSubset<T, ProductUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Products and returns the data updated in the database.
     * @param {ProductUpdateManyAndReturnArgs} args - Arguments to update many Products.
     * @example
     * // Update many Products
     * const product = await prisma.product.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Products and only return the `id`
     * const productWithIdOnly = await prisma.product.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProductUpdateManyAndReturnArgs>(args: SelectSubset<T, ProductUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Product.
     * @param {ProductUpsertArgs} args - Arguments to update or create a Product.
     * @example
     * // Update or create a Product
     * const product = await prisma.product.upsert({
     *   create: {
     *     // ... data to create a Product
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Product we want to update
     *   }
     * })
     */
    upsert<T extends ProductUpsertArgs>(args: SelectSubset<T, ProductUpsertArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductCountArgs} args - Arguments to filter Products to count.
     * @example
     * // Count the number of Products
     * const count = await prisma.product.count({
     *   where: {
     *     // ... the filter for the Products we want to count
     *   }
     * })
    **/
    count<T extends ProductCountArgs>(
      args?: Subset<T, ProductCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProductAggregateArgs>(args: Subset<T, ProductAggregateArgs>): Prisma.PrismaPromise<GetProductAggregateType<T>>

    /**
     * Group by Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProductGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductGroupByArgs['orderBy'] }
        : { orderBy?: ProductGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProductGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Product model
   */
  readonly fields: ProductFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Product.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    items<T extends Product$itemsArgs<ExtArgs> = {}>(args?: Subset<T, Product$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoiceItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    purchaseItems<T extends Product$purchaseItemsArgs<ExtArgs> = {}>(args?: Subset<T, Product$purchaseItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchaseItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    inventoryLogs<T extends Product$inventoryLogsArgs<ExtArgs> = {}>(args?: Subset<T, Product$inventoryLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Product model
   */
  interface ProductFieldRefs {
    readonly id: FieldRef<"Product", 'String'>
    readonly sku: FieldRef<"Product", 'String'>
    readonly name: FieldRef<"Product", 'String'>
    readonly nameAr: FieldRef<"Product", 'String'>
    readonly description: FieldRef<"Product", 'String'>
    readonly category: FieldRef<"Product", 'String'>
    readonly unit: FieldRef<"Product", 'String'>
    readonly costPrice: FieldRef<"Product", 'Float'>
    readonly salePrice: FieldRef<"Product", 'Float'>
    readonly stockQuantity: FieldRef<"Product", 'Float'>
    readonly reorderPoint: FieldRef<"Product", 'Float'>
    readonly createdAt: FieldRef<"Product", 'DateTime'>
    readonly updatedAt: FieldRef<"Product", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Product findUnique
   */
  export type ProductFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product findUniqueOrThrow
   */
  export type ProductFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product findFirst
   */
  export type ProductFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product findFirstOrThrow
   */
  export type ProductFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product findMany
   */
  export type ProductFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Products to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product create
   */
  export type ProductCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The data needed to create a Product.
     */
    data: XOR<ProductCreateInput, ProductUncheckedCreateInput>
  }

  /**
   * Product createMany
   */
  export type ProductCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Products.
     */
    data: ProductCreateManyInput | ProductCreateManyInput[]
  }

  /**
   * Product createManyAndReturn
   */
  export type ProductCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * The data used to create many Products.
     */
    data: ProductCreateManyInput | ProductCreateManyInput[]
  }

  /**
   * Product update
   */
  export type ProductUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The data needed to update a Product.
     */
    data: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>
    /**
     * Choose, which Product to update.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product updateMany
   */
  export type ProductUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Products.
     */
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyInput>
    /**
     * Filter which Products to update
     */
    where?: ProductWhereInput
    /**
     * Limit how many Products to update.
     */
    limit?: number
  }

  /**
   * Product updateManyAndReturn
   */
  export type ProductUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * The data used to update Products.
     */
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyInput>
    /**
     * Filter which Products to update
     */
    where?: ProductWhereInput
    /**
     * Limit how many Products to update.
     */
    limit?: number
  }

  /**
   * Product upsert
   */
  export type ProductUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The filter to search for the Product to update in case it exists.
     */
    where: ProductWhereUniqueInput
    /**
     * In case the Product found by the `where` argument doesn't exist, create a new Product with this data.
     */
    create: XOR<ProductCreateInput, ProductUncheckedCreateInput>
    /**
     * In case the Product was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>
  }

  /**
   * Product delete
   */
  export type ProductDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter which Product to delete.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product deleteMany
   */
  export type ProductDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Products to delete
     */
    where?: ProductWhereInput
    /**
     * Limit how many Products to delete.
     */
    limit?: number
  }

  /**
   * Product.items
   */
  export type Product$itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceItem
     */
    select?: InvoiceItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceItem
     */
    omit?: InvoiceItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceItemInclude<ExtArgs> | null
    where?: InvoiceItemWhereInput
    orderBy?: InvoiceItemOrderByWithRelationInput | InvoiceItemOrderByWithRelationInput[]
    cursor?: InvoiceItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InvoiceItemScalarFieldEnum | InvoiceItemScalarFieldEnum[]
  }

  /**
   * Product.purchaseItems
   */
  export type Product$purchaseItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseItem
     */
    select?: PurchaseItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseItem
     */
    omit?: PurchaseItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseItemInclude<ExtArgs> | null
    where?: PurchaseItemWhereInput
    orderBy?: PurchaseItemOrderByWithRelationInput | PurchaseItemOrderByWithRelationInput[]
    cursor?: PurchaseItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PurchaseItemScalarFieldEnum | PurchaseItemScalarFieldEnum[]
  }

  /**
   * Product.inventoryLogs
   */
  export type Product$inventoryLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLog
     */
    select?: InventoryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryLog
     */
    omit?: InventoryLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryLogInclude<ExtArgs> | null
    where?: InventoryLogWhereInput
    orderBy?: InventoryLogOrderByWithRelationInput | InventoryLogOrderByWithRelationInput[]
    cursor?: InventoryLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InventoryLogScalarFieldEnum | InventoryLogScalarFieldEnum[]
  }

  /**
   * Product without action
   */
  export type ProductDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
  }


  /**
   * Model SalesInvoice
   */

  export type AggregateSalesInvoice = {
    _count: SalesInvoiceCountAggregateOutputType | null
    _avg: SalesInvoiceAvgAggregateOutputType | null
    _sum: SalesInvoiceSumAggregateOutputType | null
    _min: SalesInvoiceMinAggregateOutputType | null
    _max: SalesInvoiceMaxAggregateOutputType | null
  }

  export type SalesInvoiceAvgAggregateOutputType = {
    totalAmount: number | null
    taxAmount: number | null
    discount: number | null
    netAmount: number | null
  }

  export type SalesInvoiceSumAggregateOutputType = {
    totalAmount: number | null
    taxAmount: number | null
    discount: number | null
    netAmount: number | null
  }

  export type SalesInvoiceMinAggregateOutputType = {
    id: string | null
    invoiceNumber: string | null
    date: Date | null
    customerId: string | null
    totalAmount: number | null
    taxAmount: number | null
    discount: number | null
    netAmount: number | null
    status: string | null
    journalVoucherId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SalesInvoiceMaxAggregateOutputType = {
    id: string | null
    invoiceNumber: string | null
    date: Date | null
    customerId: string | null
    totalAmount: number | null
    taxAmount: number | null
    discount: number | null
    netAmount: number | null
    status: string | null
    journalVoucherId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SalesInvoiceCountAggregateOutputType = {
    id: number
    invoiceNumber: number
    date: number
    customerId: number
    totalAmount: number
    taxAmount: number
    discount: number
    netAmount: number
    status: number
    journalVoucherId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SalesInvoiceAvgAggregateInputType = {
    totalAmount?: true
    taxAmount?: true
    discount?: true
    netAmount?: true
  }

  export type SalesInvoiceSumAggregateInputType = {
    totalAmount?: true
    taxAmount?: true
    discount?: true
    netAmount?: true
  }

  export type SalesInvoiceMinAggregateInputType = {
    id?: true
    invoiceNumber?: true
    date?: true
    customerId?: true
    totalAmount?: true
    taxAmount?: true
    discount?: true
    netAmount?: true
    status?: true
    journalVoucherId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SalesInvoiceMaxAggregateInputType = {
    id?: true
    invoiceNumber?: true
    date?: true
    customerId?: true
    totalAmount?: true
    taxAmount?: true
    discount?: true
    netAmount?: true
    status?: true
    journalVoucherId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SalesInvoiceCountAggregateInputType = {
    id?: true
    invoiceNumber?: true
    date?: true
    customerId?: true
    totalAmount?: true
    taxAmount?: true
    discount?: true
    netAmount?: true
    status?: true
    journalVoucherId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SalesInvoiceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SalesInvoice to aggregate.
     */
    where?: SalesInvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SalesInvoices to fetch.
     */
    orderBy?: SalesInvoiceOrderByWithRelationInput | SalesInvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SalesInvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SalesInvoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SalesInvoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SalesInvoices
    **/
    _count?: true | SalesInvoiceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SalesInvoiceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SalesInvoiceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SalesInvoiceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SalesInvoiceMaxAggregateInputType
  }

  export type GetSalesInvoiceAggregateType<T extends SalesInvoiceAggregateArgs> = {
        [P in keyof T & keyof AggregateSalesInvoice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSalesInvoice[P]>
      : GetScalarType<T[P], AggregateSalesInvoice[P]>
  }




  export type SalesInvoiceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SalesInvoiceWhereInput
    orderBy?: SalesInvoiceOrderByWithAggregationInput | SalesInvoiceOrderByWithAggregationInput[]
    by: SalesInvoiceScalarFieldEnum[] | SalesInvoiceScalarFieldEnum
    having?: SalesInvoiceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SalesInvoiceCountAggregateInputType | true
    _avg?: SalesInvoiceAvgAggregateInputType
    _sum?: SalesInvoiceSumAggregateInputType
    _min?: SalesInvoiceMinAggregateInputType
    _max?: SalesInvoiceMaxAggregateInputType
  }

  export type SalesInvoiceGroupByOutputType = {
    id: string
    invoiceNumber: string
    date: Date
    customerId: string
    totalAmount: number
    taxAmount: number
    discount: number
    netAmount: number
    status: string
    journalVoucherId: string | null
    createdAt: Date
    updatedAt: Date
    _count: SalesInvoiceCountAggregateOutputType | null
    _avg: SalesInvoiceAvgAggregateOutputType | null
    _sum: SalesInvoiceSumAggregateOutputType | null
    _min: SalesInvoiceMinAggregateOutputType | null
    _max: SalesInvoiceMaxAggregateOutputType | null
  }

  type GetSalesInvoiceGroupByPayload<T extends SalesInvoiceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SalesInvoiceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SalesInvoiceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SalesInvoiceGroupByOutputType[P]>
            : GetScalarType<T[P], SalesInvoiceGroupByOutputType[P]>
        }
      >
    >


  export type SalesInvoiceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceNumber?: boolean
    date?: boolean
    customerId?: boolean
    totalAmount?: boolean
    taxAmount?: boolean
    discount?: boolean
    netAmount?: boolean
    status?: boolean
    journalVoucherId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    items?: boolean | SalesInvoice$itemsArgs<ExtArgs>
    journalVoucher?: boolean | SalesInvoice$journalVoucherArgs<ExtArgs>
    _count?: boolean | SalesInvoiceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["salesInvoice"]>

  export type SalesInvoiceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceNumber?: boolean
    date?: boolean
    customerId?: boolean
    totalAmount?: boolean
    taxAmount?: boolean
    discount?: boolean
    netAmount?: boolean
    status?: boolean
    journalVoucherId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    journalVoucher?: boolean | SalesInvoice$journalVoucherArgs<ExtArgs>
  }, ExtArgs["result"]["salesInvoice"]>

  export type SalesInvoiceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceNumber?: boolean
    date?: boolean
    customerId?: boolean
    totalAmount?: boolean
    taxAmount?: boolean
    discount?: boolean
    netAmount?: boolean
    status?: boolean
    journalVoucherId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    journalVoucher?: boolean | SalesInvoice$journalVoucherArgs<ExtArgs>
  }, ExtArgs["result"]["salesInvoice"]>

  export type SalesInvoiceSelectScalar = {
    id?: boolean
    invoiceNumber?: boolean
    date?: boolean
    customerId?: boolean
    totalAmount?: boolean
    taxAmount?: boolean
    discount?: boolean
    netAmount?: boolean
    status?: boolean
    journalVoucherId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SalesInvoiceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "invoiceNumber" | "date" | "customerId" | "totalAmount" | "taxAmount" | "discount" | "netAmount" | "status" | "journalVoucherId" | "createdAt" | "updatedAt", ExtArgs["result"]["salesInvoice"]>
  export type SalesInvoiceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    items?: boolean | SalesInvoice$itemsArgs<ExtArgs>
    journalVoucher?: boolean | SalesInvoice$journalVoucherArgs<ExtArgs>
    _count?: boolean | SalesInvoiceCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SalesInvoiceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    journalVoucher?: boolean | SalesInvoice$journalVoucherArgs<ExtArgs>
  }
  export type SalesInvoiceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    journalVoucher?: boolean | SalesInvoice$journalVoucherArgs<ExtArgs>
  }

  export type $SalesInvoicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SalesInvoice"
    objects: {
      customer: Prisma.$CustomerPayload<ExtArgs>
      items: Prisma.$InvoiceItemPayload<ExtArgs>[]
      journalVoucher: Prisma.$JournalVoucherPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      invoiceNumber: string
      date: Date
      customerId: string
      totalAmount: number
      taxAmount: number
      discount: number
      netAmount: number
      status: string
      journalVoucherId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["salesInvoice"]>
    composites: {}
  }

  type SalesInvoiceGetPayload<S extends boolean | null | undefined | SalesInvoiceDefaultArgs> = $Result.GetResult<Prisma.$SalesInvoicePayload, S>

  type SalesInvoiceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SalesInvoiceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SalesInvoiceCountAggregateInputType | true
    }

  export interface SalesInvoiceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SalesInvoice'], meta: { name: 'SalesInvoice' } }
    /**
     * Find zero or one SalesInvoice that matches the filter.
     * @param {SalesInvoiceFindUniqueArgs} args - Arguments to find a SalesInvoice
     * @example
     * // Get one SalesInvoice
     * const salesInvoice = await prisma.salesInvoice.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SalesInvoiceFindUniqueArgs>(args: SelectSubset<T, SalesInvoiceFindUniqueArgs<ExtArgs>>): Prisma__SalesInvoiceClient<$Result.GetResult<Prisma.$SalesInvoicePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SalesInvoice that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SalesInvoiceFindUniqueOrThrowArgs} args - Arguments to find a SalesInvoice
     * @example
     * // Get one SalesInvoice
     * const salesInvoice = await prisma.salesInvoice.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SalesInvoiceFindUniqueOrThrowArgs>(args: SelectSubset<T, SalesInvoiceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SalesInvoiceClient<$Result.GetResult<Prisma.$SalesInvoicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SalesInvoice that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesInvoiceFindFirstArgs} args - Arguments to find a SalesInvoice
     * @example
     * // Get one SalesInvoice
     * const salesInvoice = await prisma.salesInvoice.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SalesInvoiceFindFirstArgs>(args?: SelectSubset<T, SalesInvoiceFindFirstArgs<ExtArgs>>): Prisma__SalesInvoiceClient<$Result.GetResult<Prisma.$SalesInvoicePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SalesInvoice that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesInvoiceFindFirstOrThrowArgs} args - Arguments to find a SalesInvoice
     * @example
     * // Get one SalesInvoice
     * const salesInvoice = await prisma.salesInvoice.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SalesInvoiceFindFirstOrThrowArgs>(args?: SelectSubset<T, SalesInvoiceFindFirstOrThrowArgs<ExtArgs>>): Prisma__SalesInvoiceClient<$Result.GetResult<Prisma.$SalesInvoicePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SalesInvoices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesInvoiceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SalesInvoices
     * const salesInvoices = await prisma.salesInvoice.findMany()
     * 
     * // Get first 10 SalesInvoices
     * const salesInvoices = await prisma.salesInvoice.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const salesInvoiceWithIdOnly = await prisma.salesInvoice.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SalesInvoiceFindManyArgs>(args?: SelectSubset<T, SalesInvoiceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalesInvoicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SalesInvoice.
     * @param {SalesInvoiceCreateArgs} args - Arguments to create a SalesInvoice.
     * @example
     * // Create one SalesInvoice
     * const SalesInvoice = await prisma.salesInvoice.create({
     *   data: {
     *     // ... data to create a SalesInvoice
     *   }
     * })
     * 
     */
    create<T extends SalesInvoiceCreateArgs>(args: SelectSubset<T, SalesInvoiceCreateArgs<ExtArgs>>): Prisma__SalesInvoiceClient<$Result.GetResult<Prisma.$SalesInvoicePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SalesInvoices.
     * @param {SalesInvoiceCreateManyArgs} args - Arguments to create many SalesInvoices.
     * @example
     * // Create many SalesInvoices
     * const salesInvoice = await prisma.salesInvoice.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SalesInvoiceCreateManyArgs>(args?: SelectSubset<T, SalesInvoiceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SalesInvoices and returns the data saved in the database.
     * @param {SalesInvoiceCreateManyAndReturnArgs} args - Arguments to create many SalesInvoices.
     * @example
     * // Create many SalesInvoices
     * const salesInvoice = await prisma.salesInvoice.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SalesInvoices and only return the `id`
     * const salesInvoiceWithIdOnly = await prisma.salesInvoice.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SalesInvoiceCreateManyAndReturnArgs>(args?: SelectSubset<T, SalesInvoiceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalesInvoicePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SalesInvoice.
     * @param {SalesInvoiceDeleteArgs} args - Arguments to delete one SalesInvoice.
     * @example
     * // Delete one SalesInvoice
     * const SalesInvoice = await prisma.salesInvoice.delete({
     *   where: {
     *     // ... filter to delete one SalesInvoice
     *   }
     * })
     * 
     */
    delete<T extends SalesInvoiceDeleteArgs>(args: SelectSubset<T, SalesInvoiceDeleteArgs<ExtArgs>>): Prisma__SalesInvoiceClient<$Result.GetResult<Prisma.$SalesInvoicePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SalesInvoice.
     * @param {SalesInvoiceUpdateArgs} args - Arguments to update one SalesInvoice.
     * @example
     * // Update one SalesInvoice
     * const salesInvoice = await prisma.salesInvoice.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SalesInvoiceUpdateArgs>(args: SelectSubset<T, SalesInvoiceUpdateArgs<ExtArgs>>): Prisma__SalesInvoiceClient<$Result.GetResult<Prisma.$SalesInvoicePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SalesInvoices.
     * @param {SalesInvoiceDeleteManyArgs} args - Arguments to filter SalesInvoices to delete.
     * @example
     * // Delete a few SalesInvoices
     * const { count } = await prisma.salesInvoice.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SalesInvoiceDeleteManyArgs>(args?: SelectSubset<T, SalesInvoiceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SalesInvoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesInvoiceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SalesInvoices
     * const salesInvoice = await prisma.salesInvoice.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SalesInvoiceUpdateManyArgs>(args: SelectSubset<T, SalesInvoiceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SalesInvoices and returns the data updated in the database.
     * @param {SalesInvoiceUpdateManyAndReturnArgs} args - Arguments to update many SalesInvoices.
     * @example
     * // Update many SalesInvoices
     * const salesInvoice = await prisma.salesInvoice.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SalesInvoices and only return the `id`
     * const salesInvoiceWithIdOnly = await prisma.salesInvoice.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SalesInvoiceUpdateManyAndReturnArgs>(args: SelectSubset<T, SalesInvoiceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalesInvoicePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SalesInvoice.
     * @param {SalesInvoiceUpsertArgs} args - Arguments to update or create a SalesInvoice.
     * @example
     * // Update or create a SalesInvoice
     * const salesInvoice = await prisma.salesInvoice.upsert({
     *   create: {
     *     // ... data to create a SalesInvoice
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SalesInvoice we want to update
     *   }
     * })
     */
    upsert<T extends SalesInvoiceUpsertArgs>(args: SelectSubset<T, SalesInvoiceUpsertArgs<ExtArgs>>): Prisma__SalesInvoiceClient<$Result.GetResult<Prisma.$SalesInvoicePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SalesInvoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesInvoiceCountArgs} args - Arguments to filter SalesInvoices to count.
     * @example
     * // Count the number of SalesInvoices
     * const count = await prisma.salesInvoice.count({
     *   where: {
     *     // ... the filter for the SalesInvoices we want to count
     *   }
     * })
    **/
    count<T extends SalesInvoiceCountArgs>(
      args?: Subset<T, SalesInvoiceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SalesInvoiceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SalesInvoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesInvoiceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SalesInvoiceAggregateArgs>(args: Subset<T, SalesInvoiceAggregateArgs>): Prisma.PrismaPromise<GetSalesInvoiceAggregateType<T>>

    /**
     * Group by SalesInvoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesInvoiceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SalesInvoiceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SalesInvoiceGroupByArgs['orderBy'] }
        : { orderBy?: SalesInvoiceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SalesInvoiceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSalesInvoiceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SalesInvoice model
   */
  readonly fields: SalesInvoiceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SalesInvoice.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SalesInvoiceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    customer<T extends CustomerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CustomerDefaultArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    items<T extends SalesInvoice$itemsArgs<ExtArgs> = {}>(args?: Subset<T, SalesInvoice$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoiceItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    journalVoucher<T extends SalesInvoice$journalVoucherArgs<ExtArgs> = {}>(args?: Subset<T, SalesInvoice$journalVoucherArgs<ExtArgs>>): Prisma__JournalVoucherClient<$Result.GetResult<Prisma.$JournalVoucherPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SalesInvoice model
   */
  interface SalesInvoiceFieldRefs {
    readonly id: FieldRef<"SalesInvoice", 'String'>
    readonly invoiceNumber: FieldRef<"SalesInvoice", 'String'>
    readonly date: FieldRef<"SalesInvoice", 'DateTime'>
    readonly customerId: FieldRef<"SalesInvoice", 'String'>
    readonly totalAmount: FieldRef<"SalesInvoice", 'Float'>
    readonly taxAmount: FieldRef<"SalesInvoice", 'Float'>
    readonly discount: FieldRef<"SalesInvoice", 'Float'>
    readonly netAmount: FieldRef<"SalesInvoice", 'Float'>
    readonly status: FieldRef<"SalesInvoice", 'String'>
    readonly journalVoucherId: FieldRef<"SalesInvoice", 'String'>
    readonly createdAt: FieldRef<"SalesInvoice", 'DateTime'>
    readonly updatedAt: FieldRef<"SalesInvoice", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SalesInvoice findUnique
   */
  export type SalesInvoiceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesInvoice
     */
    select?: SalesInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesInvoice
     */
    omit?: SalesInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesInvoiceInclude<ExtArgs> | null
    /**
     * Filter, which SalesInvoice to fetch.
     */
    where: SalesInvoiceWhereUniqueInput
  }

  /**
   * SalesInvoice findUniqueOrThrow
   */
  export type SalesInvoiceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesInvoice
     */
    select?: SalesInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesInvoice
     */
    omit?: SalesInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesInvoiceInclude<ExtArgs> | null
    /**
     * Filter, which SalesInvoice to fetch.
     */
    where: SalesInvoiceWhereUniqueInput
  }

  /**
   * SalesInvoice findFirst
   */
  export type SalesInvoiceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesInvoice
     */
    select?: SalesInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesInvoice
     */
    omit?: SalesInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesInvoiceInclude<ExtArgs> | null
    /**
     * Filter, which SalesInvoice to fetch.
     */
    where?: SalesInvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SalesInvoices to fetch.
     */
    orderBy?: SalesInvoiceOrderByWithRelationInput | SalesInvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SalesInvoices.
     */
    cursor?: SalesInvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SalesInvoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SalesInvoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SalesInvoices.
     */
    distinct?: SalesInvoiceScalarFieldEnum | SalesInvoiceScalarFieldEnum[]
  }

  /**
   * SalesInvoice findFirstOrThrow
   */
  export type SalesInvoiceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesInvoice
     */
    select?: SalesInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesInvoice
     */
    omit?: SalesInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesInvoiceInclude<ExtArgs> | null
    /**
     * Filter, which SalesInvoice to fetch.
     */
    where?: SalesInvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SalesInvoices to fetch.
     */
    orderBy?: SalesInvoiceOrderByWithRelationInput | SalesInvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SalesInvoices.
     */
    cursor?: SalesInvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SalesInvoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SalesInvoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SalesInvoices.
     */
    distinct?: SalesInvoiceScalarFieldEnum | SalesInvoiceScalarFieldEnum[]
  }

  /**
   * SalesInvoice findMany
   */
  export type SalesInvoiceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesInvoice
     */
    select?: SalesInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesInvoice
     */
    omit?: SalesInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesInvoiceInclude<ExtArgs> | null
    /**
     * Filter, which SalesInvoices to fetch.
     */
    where?: SalesInvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SalesInvoices to fetch.
     */
    orderBy?: SalesInvoiceOrderByWithRelationInput | SalesInvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SalesInvoices.
     */
    cursor?: SalesInvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SalesInvoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SalesInvoices.
     */
    skip?: number
    distinct?: SalesInvoiceScalarFieldEnum | SalesInvoiceScalarFieldEnum[]
  }

  /**
   * SalesInvoice create
   */
  export type SalesInvoiceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesInvoice
     */
    select?: SalesInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesInvoice
     */
    omit?: SalesInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesInvoiceInclude<ExtArgs> | null
    /**
     * The data needed to create a SalesInvoice.
     */
    data: XOR<SalesInvoiceCreateInput, SalesInvoiceUncheckedCreateInput>
  }

  /**
   * SalesInvoice createMany
   */
  export type SalesInvoiceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SalesInvoices.
     */
    data: SalesInvoiceCreateManyInput | SalesInvoiceCreateManyInput[]
  }

  /**
   * SalesInvoice createManyAndReturn
   */
  export type SalesInvoiceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesInvoice
     */
    select?: SalesInvoiceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SalesInvoice
     */
    omit?: SalesInvoiceOmit<ExtArgs> | null
    /**
     * The data used to create many SalesInvoices.
     */
    data: SalesInvoiceCreateManyInput | SalesInvoiceCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesInvoiceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SalesInvoice update
   */
  export type SalesInvoiceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesInvoice
     */
    select?: SalesInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesInvoice
     */
    omit?: SalesInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesInvoiceInclude<ExtArgs> | null
    /**
     * The data needed to update a SalesInvoice.
     */
    data: XOR<SalesInvoiceUpdateInput, SalesInvoiceUncheckedUpdateInput>
    /**
     * Choose, which SalesInvoice to update.
     */
    where: SalesInvoiceWhereUniqueInput
  }

  /**
   * SalesInvoice updateMany
   */
  export type SalesInvoiceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SalesInvoices.
     */
    data: XOR<SalesInvoiceUpdateManyMutationInput, SalesInvoiceUncheckedUpdateManyInput>
    /**
     * Filter which SalesInvoices to update
     */
    where?: SalesInvoiceWhereInput
    /**
     * Limit how many SalesInvoices to update.
     */
    limit?: number
  }

  /**
   * SalesInvoice updateManyAndReturn
   */
  export type SalesInvoiceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesInvoice
     */
    select?: SalesInvoiceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SalesInvoice
     */
    omit?: SalesInvoiceOmit<ExtArgs> | null
    /**
     * The data used to update SalesInvoices.
     */
    data: XOR<SalesInvoiceUpdateManyMutationInput, SalesInvoiceUncheckedUpdateManyInput>
    /**
     * Filter which SalesInvoices to update
     */
    where?: SalesInvoiceWhereInput
    /**
     * Limit how many SalesInvoices to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesInvoiceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SalesInvoice upsert
   */
  export type SalesInvoiceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesInvoice
     */
    select?: SalesInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesInvoice
     */
    omit?: SalesInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesInvoiceInclude<ExtArgs> | null
    /**
     * The filter to search for the SalesInvoice to update in case it exists.
     */
    where: SalesInvoiceWhereUniqueInput
    /**
     * In case the SalesInvoice found by the `where` argument doesn't exist, create a new SalesInvoice with this data.
     */
    create: XOR<SalesInvoiceCreateInput, SalesInvoiceUncheckedCreateInput>
    /**
     * In case the SalesInvoice was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SalesInvoiceUpdateInput, SalesInvoiceUncheckedUpdateInput>
  }

  /**
   * SalesInvoice delete
   */
  export type SalesInvoiceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesInvoice
     */
    select?: SalesInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesInvoice
     */
    omit?: SalesInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesInvoiceInclude<ExtArgs> | null
    /**
     * Filter which SalesInvoice to delete.
     */
    where: SalesInvoiceWhereUniqueInput
  }

  /**
   * SalesInvoice deleteMany
   */
  export type SalesInvoiceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SalesInvoices to delete
     */
    where?: SalesInvoiceWhereInput
    /**
     * Limit how many SalesInvoices to delete.
     */
    limit?: number
  }

  /**
   * SalesInvoice.items
   */
  export type SalesInvoice$itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceItem
     */
    select?: InvoiceItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceItem
     */
    omit?: InvoiceItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceItemInclude<ExtArgs> | null
    where?: InvoiceItemWhereInput
    orderBy?: InvoiceItemOrderByWithRelationInput | InvoiceItemOrderByWithRelationInput[]
    cursor?: InvoiceItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InvoiceItemScalarFieldEnum | InvoiceItemScalarFieldEnum[]
  }

  /**
   * SalesInvoice.journalVoucher
   */
  export type SalesInvoice$journalVoucherArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalVoucher
     */
    select?: JournalVoucherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JournalVoucher
     */
    omit?: JournalVoucherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalVoucherInclude<ExtArgs> | null
    where?: JournalVoucherWhereInput
  }

  /**
   * SalesInvoice without action
   */
  export type SalesInvoiceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesInvoice
     */
    select?: SalesInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesInvoice
     */
    omit?: SalesInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesInvoiceInclude<ExtArgs> | null
  }


  /**
   * Model PurchaseInvoice
   */

  export type AggregatePurchaseInvoice = {
    _count: PurchaseInvoiceCountAggregateOutputType | null
    _avg: PurchaseInvoiceAvgAggregateOutputType | null
    _sum: PurchaseInvoiceSumAggregateOutputType | null
    _min: PurchaseInvoiceMinAggregateOutputType | null
    _max: PurchaseInvoiceMaxAggregateOutputType | null
  }

  export type PurchaseInvoiceAvgAggregateOutputType = {
    totalAmount: number | null
    taxAmount: number | null
    discount: number | null
    netAmount: number | null
  }

  export type PurchaseInvoiceSumAggregateOutputType = {
    totalAmount: number | null
    taxAmount: number | null
    discount: number | null
    netAmount: number | null
  }

  export type PurchaseInvoiceMinAggregateOutputType = {
    id: string | null
    invoiceNumber: string | null
    date: Date | null
    supplierId: string | null
    totalAmount: number | null
    taxAmount: number | null
    discount: number | null
    netAmount: number | null
    status: string | null
    journalVoucherId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PurchaseInvoiceMaxAggregateOutputType = {
    id: string | null
    invoiceNumber: string | null
    date: Date | null
    supplierId: string | null
    totalAmount: number | null
    taxAmount: number | null
    discount: number | null
    netAmount: number | null
    status: string | null
    journalVoucherId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PurchaseInvoiceCountAggregateOutputType = {
    id: number
    invoiceNumber: number
    date: number
    supplierId: number
    totalAmount: number
    taxAmount: number
    discount: number
    netAmount: number
    status: number
    journalVoucherId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PurchaseInvoiceAvgAggregateInputType = {
    totalAmount?: true
    taxAmount?: true
    discount?: true
    netAmount?: true
  }

  export type PurchaseInvoiceSumAggregateInputType = {
    totalAmount?: true
    taxAmount?: true
    discount?: true
    netAmount?: true
  }

  export type PurchaseInvoiceMinAggregateInputType = {
    id?: true
    invoiceNumber?: true
    date?: true
    supplierId?: true
    totalAmount?: true
    taxAmount?: true
    discount?: true
    netAmount?: true
    status?: true
    journalVoucherId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PurchaseInvoiceMaxAggregateInputType = {
    id?: true
    invoiceNumber?: true
    date?: true
    supplierId?: true
    totalAmount?: true
    taxAmount?: true
    discount?: true
    netAmount?: true
    status?: true
    journalVoucherId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PurchaseInvoiceCountAggregateInputType = {
    id?: true
    invoiceNumber?: true
    date?: true
    supplierId?: true
    totalAmount?: true
    taxAmount?: true
    discount?: true
    netAmount?: true
    status?: true
    journalVoucherId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PurchaseInvoiceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PurchaseInvoice to aggregate.
     */
    where?: PurchaseInvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchaseInvoices to fetch.
     */
    orderBy?: PurchaseInvoiceOrderByWithRelationInput | PurchaseInvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PurchaseInvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchaseInvoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchaseInvoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PurchaseInvoices
    **/
    _count?: true | PurchaseInvoiceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PurchaseInvoiceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PurchaseInvoiceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PurchaseInvoiceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PurchaseInvoiceMaxAggregateInputType
  }

  export type GetPurchaseInvoiceAggregateType<T extends PurchaseInvoiceAggregateArgs> = {
        [P in keyof T & keyof AggregatePurchaseInvoice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePurchaseInvoice[P]>
      : GetScalarType<T[P], AggregatePurchaseInvoice[P]>
  }




  export type PurchaseInvoiceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PurchaseInvoiceWhereInput
    orderBy?: PurchaseInvoiceOrderByWithAggregationInput | PurchaseInvoiceOrderByWithAggregationInput[]
    by: PurchaseInvoiceScalarFieldEnum[] | PurchaseInvoiceScalarFieldEnum
    having?: PurchaseInvoiceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PurchaseInvoiceCountAggregateInputType | true
    _avg?: PurchaseInvoiceAvgAggregateInputType
    _sum?: PurchaseInvoiceSumAggregateInputType
    _min?: PurchaseInvoiceMinAggregateInputType
    _max?: PurchaseInvoiceMaxAggregateInputType
  }

  export type PurchaseInvoiceGroupByOutputType = {
    id: string
    invoiceNumber: string
    date: Date
    supplierId: string
    totalAmount: number
    taxAmount: number
    discount: number
    netAmount: number
    status: string
    journalVoucherId: string | null
    createdAt: Date
    updatedAt: Date
    _count: PurchaseInvoiceCountAggregateOutputType | null
    _avg: PurchaseInvoiceAvgAggregateOutputType | null
    _sum: PurchaseInvoiceSumAggregateOutputType | null
    _min: PurchaseInvoiceMinAggregateOutputType | null
    _max: PurchaseInvoiceMaxAggregateOutputType | null
  }

  type GetPurchaseInvoiceGroupByPayload<T extends PurchaseInvoiceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PurchaseInvoiceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PurchaseInvoiceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PurchaseInvoiceGroupByOutputType[P]>
            : GetScalarType<T[P], PurchaseInvoiceGroupByOutputType[P]>
        }
      >
    >


  export type PurchaseInvoiceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceNumber?: boolean
    date?: boolean
    supplierId?: boolean
    totalAmount?: boolean
    taxAmount?: boolean
    discount?: boolean
    netAmount?: boolean
    status?: boolean
    journalVoucherId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    supplier?: boolean | SupplierDefaultArgs<ExtArgs>
    items?: boolean | PurchaseInvoice$itemsArgs<ExtArgs>
    journalVoucher?: boolean | PurchaseInvoice$journalVoucherArgs<ExtArgs>
    _count?: boolean | PurchaseInvoiceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["purchaseInvoice"]>

  export type PurchaseInvoiceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceNumber?: boolean
    date?: boolean
    supplierId?: boolean
    totalAmount?: boolean
    taxAmount?: boolean
    discount?: boolean
    netAmount?: boolean
    status?: boolean
    journalVoucherId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    supplier?: boolean | SupplierDefaultArgs<ExtArgs>
    journalVoucher?: boolean | PurchaseInvoice$journalVoucherArgs<ExtArgs>
  }, ExtArgs["result"]["purchaseInvoice"]>

  export type PurchaseInvoiceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceNumber?: boolean
    date?: boolean
    supplierId?: boolean
    totalAmount?: boolean
    taxAmount?: boolean
    discount?: boolean
    netAmount?: boolean
    status?: boolean
    journalVoucherId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    supplier?: boolean | SupplierDefaultArgs<ExtArgs>
    journalVoucher?: boolean | PurchaseInvoice$journalVoucherArgs<ExtArgs>
  }, ExtArgs["result"]["purchaseInvoice"]>

  export type PurchaseInvoiceSelectScalar = {
    id?: boolean
    invoiceNumber?: boolean
    date?: boolean
    supplierId?: boolean
    totalAmount?: boolean
    taxAmount?: boolean
    discount?: boolean
    netAmount?: boolean
    status?: boolean
    journalVoucherId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PurchaseInvoiceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "invoiceNumber" | "date" | "supplierId" | "totalAmount" | "taxAmount" | "discount" | "netAmount" | "status" | "journalVoucherId" | "createdAt" | "updatedAt", ExtArgs["result"]["purchaseInvoice"]>
  export type PurchaseInvoiceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    supplier?: boolean | SupplierDefaultArgs<ExtArgs>
    items?: boolean | PurchaseInvoice$itemsArgs<ExtArgs>
    journalVoucher?: boolean | PurchaseInvoice$journalVoucherArgs<ExtArgs>
    _count?: boolean | PurchaseInvoiceCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PurchaseInvoiceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    supplier?: boolean | SupplierDefaultArgs<ExtArgs>
    journalVoucher?: boolean | PurchaseInvoice$journalVoucherArgs<ExtArgs>
  }
  export type PurchaseInvoiceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    supplier?: boolean | SupplierDefaultArgs<ExtArgs>
    journalVoucher?: boolean | PurchaseInvoice$journalVoucherArgs<ExtArgs>
  }

  export type $PurchaseInvoicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PurchaseInvoice"
    objects: {
      supplier: Prisma.$SupplierPayload<ExtArgs>
      items: Prisma.$PurchaseItemPayload<ExtArgs>[]
      journalVoucher: Prisma.$JournalVoucherPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      invoiceNumber: string
      date: Date
      supplierId: string
      totalAmount: number
      taxAmount: number
      discount: number
      netAmount: number
      status: string
      journalVoucherId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["purchaseInvoice"]>
    composites: {}
  }

  type PurchaseInvoiceGetPayload<S extends boolean | null | undefined | PurchaseInvoiceDefaultArgs> = $Result.GetResult<Prisma.$PurchaseInvoicePayload, S>

  type PurchaseInvoiceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PurchaseInvoiceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PurchaseInvoiceCountAggregateInputType | true
    }

  export interface PurchaseInvoiceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PurchaseInvoice'], meta: { name: 'PurchaseInvoice' } }
    /**
     * Find zero or one PurchaseInvoice that matches the filter.
     * @param {PurchaseInvoiceFindUniqueArgs} args - Arguments to find a PurchaseInvoice
     * @example
     * // Get one PurchaseInvoice
     * const purchaseInvoice = await prisma.purchaseInvoice.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PurchaseInvoiceFindUniqueArgs>(args: SelectSubset<T, PurchaseInvoiceFindUniqueArgs<ExtArgs>>): Prisma__PurchaseInvoiceClient<$Result.GetResult<Prisma.$PurchaseInvoicePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PurchaseInvoice that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PurchaseInvoiceFindUniqueOrThrowArgs} args - Arguments to find a PurchaseInvoice
     * @example
     * // Get one PurchaseInvoice
     * const purchaseInvoice = await prisma.purchaseInvoice.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PurchaseInvoiceFindUniqueOrThrowArgs>(args: SelectSubset<T, PurchaseInvoiceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PurchaseInvoiceClient<$Result.GetResult<Prisma.$PurchaseInvoicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PurchaseInvoice that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseInvoiceFindFirstArgs} args - Arguments to find a PurchaseInvoice
     * @example
     * // Get one PurchaseInvoice
     * const purchaseInvoice = await prisma.purchaseInvoice.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PurchaseInvoiceFindFirstArgs>(args?: SelectSubset<T, PurchaseInvoiceFindFirstArgs<ExtArgs>>): Prisma__PurchaseInvoiceClient<$Result.GetResult<Prisma.$PurchaseInvoicePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PurchaseInvoice that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseInvoiceFindFirstOrThrowArgs} args - Arguments to find a PurchaseInvoice
     * @example
     * // Get one PurchaseInvoice
     * const purchaseInvoice = await prisma.purchaseInvoice.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PurchaseInvoiceFindFirstOrThrowArgs>(args?: SelectSubset<T, PurchaseInvoiceFindFirstOrThrowArgs<ExtArgs>>): Prisma__PurchaseInvoiceClient<$Result.GetResult<Prisma.$PurchaseInvoicePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PurchaseInvoices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseInvoiceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PurchaseInvoices
     * const purchaseInvoices = await prisma.purchaseInvoice.findMany()
     * 
     * // Get first 10 PurchaseInvoices
     * const purchaseInvoices = await prisma.purchaseInvoice.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const purchaseInvoiceWithIdOnly = await prisma.purchaseInvoice.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PurchaseInvoiceFindManyArgs>(args?: SelectSubset<T, PurchaseInvoiceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchaseInvoicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PurchaseInvoice.
     * @param {PurchaseInvoiceCreateArgs} args - Arguments to create a PurchaseInvoice.
     * @example
     * // Create one PurchaseInvoice
     * const PurchaseInvoice = await prisma.purchaseInvoice.create({
     *   data: {
     *     // ... data to create a PurchaseInvoice
     *   }
     * })
     * 
     */
    create<T extends PurchaseInvoiceCreateArgs>(args: SelectSubset<T, PurchaseInvoiceCreateArgs<ExtArgs>>): Prisma__PurchaseInvoiceClient<$Result.GetResult<Prisma.$PurchaseInvoicePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PurchaseInvoices.
     * @param {PurchaseInvoiceCreateManyArgs} args - Arguments to create many PurchaseInvoices.
     * @example
     * // Create many PurchaseInvoices
     * const purchaseInvoice = await prisma.purchaseInvoice.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PurchaseInvoiceCreateManyArgs>(args?: SelectSubset<T, PurchaseInvoiceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PurchaseInvoices and returns the data saved in the database.
     * @param {PurchaseInvoiceCreateManyAndReturnArgs} args - Arguments to create many PurchaseInvoices.
     * @example
     * // Create many PurchaseInvoices
     * const purchaseInvoice = await prisma.purchaseInvoice.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PurchaseInvoices and only return the `id`
     * const purchaseInvoiceWithIdOnly = await prisma.purchaseInvoice.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PurchaseInvoiceCreateManyAndReturnArgs>(args?: SelectSubset<T, PurchaseInvoiceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchaseInvoicePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PurchaseInvoice.
     * @param {PurchaseInvoiceDeleteArgs} args - Arguments to delete one PurchaseInvoice.
     * @example
     * // Delete one PurchaseInvoice
     * const PurchaseInvoice = await prisma.purchaseInvoice.delete({
     *   where: {
     *     // ... filter to delete one PurchaseInvoice
     *   }
     * })
     * 
     */
    delete<T extends PurchaseInvoiceDeleteArgs>(args: SelectSubset<T, PurchaseInvoiceDeleteArgs<ExtArgs>>): Prisma__PurchaseInvoiceClient<$Result.GetResult<Prisma.$PurchaseInvoicePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PurchaseInvoice.
     * @param {PurchaseInvoiceUpdateArgs} args - Arguments to update one PurchaseInvoice.
     * @example
     * // Update one PurchaseInvoice
     * const purchaseInvoice = await prisma.purchaseInvoice.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PurchaseInvoiceUpdateArgs>(args: SelectSubset<T, PurchaseInvoiceUpdateArgs<ExtArgs>>): Prisma__PurchaseInvoiceClient<$Result.GetResult<Prisma.$PurchaseInvoicePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PurchaseInvoices.
     * @param {PurchaseInvoiceDeleteManyArgs} args - Arguments to filter PurchaseInvoices to delete.
     * @example
     * // Delete a few PurchaseInvoices
     * const { count } = await prisma.purchaseInvoice.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PurchaseInvoiceDeleteManyArgs>(args?: SelectSubset<T, PurchaseInvoiceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PurchaseInvoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseInvoiceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PurchaseInvoices
     * const purchaseInvoice = await prisma.purchaseInvoice.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PurchaseInvoiceUpdateManyArgs>(args: SelectSubset<T, PurchaseInvoiceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PurchaseInvoices and returns the data updated in the database.
     * @param {PurchaseInvoiceUpdateManyAndReturnArgs} args - Arguments to update many PurchaseInvoices.
     * @example
     * // Update many PurchaseInvoices
     * const purchaseInvoice = await prisma.purchaseInvoice.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PurchaseInvoices and only return the `id`
     * const purchaseInvoiceWithIdOnly = await prisma.purchaseInvoice.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PurchaseInvoiceUpdateManyAndReturnArgs>(args: SelectSubset<T, PurchaseInvoiceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchaseInvoicePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PurchaseInvoice.
     * @param {PurchaseInvoiceUpsertArgs} args - Arguments to update or create a PurchaseInvoice.
     * @example
     * // Update or create a PurchaseInvoice
     * const purchaseInvoice = await prisma.purchaseInvoice.upsert({
     *   create: {
     *     // ... data to create a PurchaseInvoice
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PurchaseInvoice we want to update
     *   }
     * })
     */
    upsert<T extends PurchaseInvoiceUpsertArgs>(args: SelectSubset<T, PurchaseInvoiceUpsertArgs<ExtArgs>>): Prisma__PurchaseInvoiceClient<$Result.GetResult<Prisma.$PurchaseInvoicePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PurchaseInvoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseInvoiceCountArgs} args - Arguments to filter PurchaseInvoices to count.
     * @example
     * // Count the number of PurchaseInvoices
     * const count = await prisma.purchaseInvoice.count({
     *   where: {
     *     // ... the filter for the PurchaseInvoices we want to count
     *   }
     * })
    **/
    count<T extends PurchaseInvoiceCountArgs>(
      args?: Subset<T, PurchaseInvoiceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PurchaseInvoiceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PurchaseInvoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseInvoiceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PurchaseInvoiceAggregateArgs>(args: Subset<T, PurchaseInvoiceAggregateArgs>): Prisma.PrismaPromise<GetPurchaseInvoiceAggregateType<T>>

    /**
     * Group by PurchaseInvoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseInvoiceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PurchaseInvoiceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PurchaseInvoiceGroupByArgs['orderBy'] }
        : { orderBy?: PurchaseInvoiceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PurchaseInvoiceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPurchaseInvoiceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PurchaseInvoice model
   */
  readonly fields: PurchaseInvoiceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PurchaseInvoice.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PurchaseInvoiceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    supplier<T extends SupplierDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SupplierDefaultArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    items<T extends PurchaseInvoice$itemsArgs<ExtArgs> = {}>(args?: Subset<T, PurchaseInvoice$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchaseItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    journalVoucher<T extends PurchaseInvoice$journalVoucherArgs<ExtArgs> = {}>(args?: Subset<T, PurchaseInvoice$journalVoucherArgs<ExtArgs>>): Prisma__JournalVoucherClient<$Result.GetResult<Prisma.$JournalVoucherPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PurchaseInvoice model
   */
  interface PurchaseInvoiceFieldRefs {
    readonly id: FieldRef<"PurchaseInvoice", 'String'>
    readonly invoiceNumber: FieldRef<"PurchaseInvoice", 'String'>
    readonly date: FieldRef<"PurchaseInvoice", 'DateTime'>
    readonly supplierId: FieldRef<"PurchaseInvoice", 'String'>
    readonly totalAmount: FieldRef<"PurchaseInvoice", 'Float'>
    readonly taxAmount: FieldRef<"PurchaseInvoice", 'Float'>
    readonly discount: FieldRef<"PurchaseInvoice", 'Float'>
    readonly netAmount: FieldRef<"PurchaseInvoice", 'Float'>
    readonly status: FieldRef<"PurchaseInvoice", 'String'>
    readonly journalVoucherId: FieldRef<"PurchaseInvoice", 'String'>
    readonly createdAt: FieldRef<"PurchaseInvoice", 'DateTime'>
    readonly updatedAt: FieldRef<"PurchaseInvoice", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PurchaseInvoice findUnique
   */
  export type PurchaseInvoiceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseInvoice
     */
    select?: PurchaseInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseInvoice
     */
    omit?: PurchaseInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInvoiceInclude<ExtArgs> | null
    /**
     * Filter, which PurchaseInvoice to fetch.
     */
    where: PurchaseInvoiceWhereUniqueInput
  }

  /**
   * PurchaseInvoice findUniqueOrThrow
   */
  export type PurchaseInvoiceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseInvoice
     */
    select?: PurchaseInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseInvoice
     */
    omit?: PurchaseInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInvoiceInclude<ExtArgs> | null
    /**
     * Filter, which PurchaseInvoice to fetch.
     */
    where: PurchaseInvoiceWhereUniqueInput
  }

  /**
   * PurchaseInvoice findFirst
   */
  export type PurchaseInvoiceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseInvoice
     */
    select?: PurchaseInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseInvoice
     */
    omit?: PurchaseInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInvoiceInclude<ExtArgs> | null
    /**
     * Filter, which PurchaseInvoice to fetch.
     */
    where?: PurchaseInvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchaseInvoices to fetch.
     */
    orderBy?: PurchaseInvoiceOrderByWithRelationInput | PurchaseInvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PurchaseInvoices.
     */
    cursor?: PurchaseInvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchaseInvoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchaseInvoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PurchaseInvoices.
     */
    distinct?: PurchaseInvoiceScalarFieldEnum | PurchaseInvoiceScalarFieldEnum[]
  }

  /**
   * PurchaseInvoice findFirstOrThrow
   */
  export type PurchaseInvoiceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseInvoice
     */
    select?: PurchaseInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseInvoice
     */
    omit?: PurchaseInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInvoiceInclude<ExtArgs> | null
    /**
     * Filter, which PurchaseInvoice to fetch.
     */
    where?: PurchaseInvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchaseInvoices to fetch.
     */
    orderBy?: PurchaseInvoiceOrderByWithRelationInput | PurchaseInvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PurchaseInvoices.
     */
    cursor?: PurchaseInvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchaseInvoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchaseInvoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PurchaseInvoices.
     */
    distinct?: PurchaseInvoiceScalarFieldEnum | PurchaseInvoiceScalarFieldEnum[]
  }

  /**
   * PurchaseInvoice findMany
   */
  export type PurchaseInvoiceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseInvoice
     */
    select?: PurchaseInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseInvoice
     */
    omit?: PurchaseInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInvoiceInclude<ExtArgs> | null
    /**
     * Filter, which PurchaseInvoices to fetch.
     */
    where?: PurchaseInvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchaseInvoices to fetch.
     */
    orderBy?: PurchaseInvoiceOrderByWithRelationInput | PurchaseInvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PurchaseInvoices.
     */
    cursor?: PurchaseInvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchaseInvoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchaseInvoices.
     */
    skip?: number
    distinct?: PurchaseInvoiceScalarFieldEnum | PurchaseInvoiceScalarFieldEnum[]
  }

  /**
   * PurchaseInvoice create
   */
  export type PurchaseInvoiceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseInvoice
     */
    select?: PurchaseInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseInvoice
     */
    omit?: PurchaseInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInvoiceInclude<ExtArgs> | null
    /**
     * The data needed to create a PurchaseInvoice.
     */
    data: XOR<PurchaseInvoiceCreateInput, PurchaseInvoiceUncheckedCreateInput>
  }

  /**
   * PurchaseInvoice createMany
   */
  export type PurchaseInvoiceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PurchaseInvoices.
     */
    data: PurchaseInvoiceCreateManyInput | PurchaseInvoiceCreateManyInput[]
  }

  /**
   * PurchaseInvoice createManyAndReturn
   */
  export type PurchaseInvoiceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseInvoice
     */
    select?: PurchaseInvoiceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseInvoice
     */
    omit?: PurchaseInvoiceOmit<ExtArgs> | null
    /**
     * The data used to create many PurchaseInvoices.
     */
    data: PurchaseInvoiceCreateManyInput | PurchaseInvoiceCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInvoiceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PurchaseInvoice update
   */
  export type PurchaseInvoiceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseInvoice
     */
    select?: PurchaseInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseInvoice
     */
    omit?: PurchaseInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInvoiceInclude<ExtArgs> | null
    /**
     * The data needed to update a PurchaseInvoice.
     */
    data: XOR<PurchaseInvoiceUpdateInput, PurchaseInvoiceUncheckedUpdateInput>
    /**
     * Choose, which PurchaseInvoice to update.
     */
    where: PurchaseInvoiceWhereUniqueInput
  }

  /**
   * PurchaseInvoice updateMany
   */
  export type PurchaseInvoiceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PurchaseInvoices.
     */
    data: XOR<PurchaseInvoiceUpdateManyMutationInput, PurchaseInvoiceUncheckedUpdateManyInput>
    /**
     * Filter which PurchaseInvoices to update
     */
    where?: PurchaseInvoiceWhereInput
    /**
     * Limit how many PurchaseInvoices to update.
     */
    limit?: number
  }

  /**
   * PurchaseInvoice updateManyAndReturn
   */
  export type PurchaseInvoiceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseInvoice
     */
    select?: PurchaseInvoiceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseInvoice
     */
    omit?: PurchaseInvoiceOmit<ExtArgs> | null
    /**
     * The data used to update PurchaseInvoices.
     */
    data: XOR<PurchaseInvoiceUpdateManyMutationInput, PurchaseInvoiceUncheckedUpdateManyInput>
    /**
     * Filter which PurchaseInvoices to update
     */
    where?: PurchaseInvoiceWhereInput
    /**
     * Limit how many PurchaseInvoices to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInvoiceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PurchaseInvoice upsert
   */
  export type PurchaseInvoiceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseInvoice
     */
    select?: PurchaseInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseInvoice
     */
    omit?: PurchaseInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInvoiceInclude<ExtArgs> | null
    /**
     * The filter to search for the PurchaseInvoice to update in case it exists.
     */
    where: PurchaseInvoiceWhereUniqueInput
    /**
     * In case the PurchaseInvoice found by the `where` argument doesn't exist, create a new PurchaseInvoice with this data.
     */
    create: XOR<PurchaseInvoiceCreateInput, PurchaseInvoiceUncheckedCreateInput>
    /**
     * In case the PurchaseInvoice was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PurchaseInvoiceUpdateInput, PurchaseInvoiceUncheckedUpdateInput>
  }

  /**
   * PurchaseInvoice delete
   */
  export type PurchaseInvoiceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseInvoice
     */
    select?: PurchaseInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseInvoice
     */
    omit?: PurchaseInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInvoiceInclude<ExtArgs> | null
    /**
     * Filter which PurchaseInvoice to delete.
     */
    where: PurchaseInvoiceWhereUniqueInput
  }

  /**
   * PurchaseInvoice deleteMany
   */
  export type PurchaseInvoiceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PurchaseInvoices to delete
     */
    where?: PurchaseInvoiceWhereInput
    /**
     * Limit how many PurchaseInvoices to delete.
     */
    limit?: number
  }

  /**
   * PurchaseInvoice.items
   */
  export type PurchaseInvoice$itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseItem
     */
    select?: PurchaseItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseItem
     */
    omit?: PurchaseItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseItemInclude<ExtArgs> | null
    where?: PurchaseItemWhereInput
    orderBy?: PurchaseItemOrderByWithRelationInput | PurchaseItemOrderByWithRelationInput[]
    cursor?: PurchaseItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PurchaseItemScalarFieldEnum | PurchaseItemScalarFieldEnum[]
  }

  /**
   * PurchaseInvoice.journalVoucher
   */
  export type PurchaseInvoice$journalVoucherArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalVoucher
     */
    select?: JournalVoucherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JournalVoucher
     */
    omit?: JournalVoucherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalVoucherInclude<ExtArgs> | null
    where?: JournalVoucherWhereInput
  }

  /**
   * PurchaseInvoice without action
   */
  export type PurchaseInvoiceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseInvoice
     */
    select?: PurchaseInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseInvoice
     */
    omit?: PurchaseInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInvoiceInclude<ExtArgs> | null
  }


  /**
   * Model InvoiceItem
   */

  export type AggregateInvoiceItem = {
    _count: InvoiceItemCountAggregateOutputType | null
    _avg: InvoiceItemAvgAggregateOutputType | null
    _sum: InvoiceItemSumAggregateOutputType | null
    _min: InvoiceItemMinAggregateOutputType | null
    _max: InvoiceItemMaxAggregateOutputType | null
  }

  export type InvoiceItemAvgAggregateOutputType = {
    quantity: number | null
    unitPrice: number | null
    total: number | null
  }

  export type InvoiceItemSumAggregateOutputType = {
    quantity: number | null
    unitPrice: number | null
    total: number | null
  }

  export type InvoiceItemMinAggregateOutputType = {
    id: string | null
    invoiceId: string | null
    productId: string | null
    quantity: number | null
    unitPrice: number | null
    total: number | null
  }

  export type InvoiceItemMaxAggregateOutputType = {
    id: string | null
    invoiceId: string | null
    productId: string | null
    quantity: number | null
    unitPrice: number | null
    total: number | null
  }

  export type InvoiceItemCountAggregateOutputType = {
    id: number
    invoiceId: number
    productId: number
    quantity: number
    unitPrice: number
    total: number
    _all: number
  }


  export type InvoiceItemAvgAggregateInputType = {
    quantity?: true
    unitPrice?: true
    total?: true
  }

  export type InvoiceItemSumAggregateInputType = {
    quantity?: true
    unitPrice?: true
    total?: true
  }

  export type InvoiceItemMinAggregateInputType = {
    id?: true
    invoiceId?: true
    productId?: true
    quantity?: true
    unitPrice?: true
    total?: true
  }

  export type InvoiceItemMaxAggregateInputType = {
    id?: true
    invoiceId?: true
    productId?: true
    quantity?: true
    unitPrice?: true
    total?: true
  }

  export type InvoiceItemCountAggregateInputType = {
    id?: true
    invoiceId?: true
    productId?: true
    quantity?: true
    unitPrice?: true
    total?: true
    _all?: true
  }

  export type InvoiceItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InvoiceItem to aggregate.
     */
    where?: InvoiceItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvoiceItems to fetch.
     */
    orderBy?: InvoiceItemOrderByWithRelationInput | InvoiceItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InvoiceItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvoiceItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvoiceItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InvoiceItems
    **/
    _count?: true | InvoiceItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InvoiceItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InvoiceItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InvoiceItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InvoiceItemMaxAggregateInputType
  }

  export type GetInvoiceItemAggregateType<T extends InvoiceItemAggregateArgs> = {
        [P in keyof T & keyof AggregateInvoiceItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInvoiceItem[P]>
      : GetScalarType<T[P], AggregateInvoiceItem[P]>
  }




  export type InvoiceItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceItemWhereInput
    orderBy?: InvoiceItemOrderByWithAggregationInput | InvoiceItemOrderByWithAggregationInput[]
    by: InvoiceItemScalarFieldEnum[] | InvoiceItemScalarFieldEnum
    having?: InvoiceItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InvoiceItemCountAggregateInputType | true
    _avg?: InvoiceItemAvgAggregateInputType
    _sum?: InvoiceItemSumAggregateInputType
    _min?: InvoiceItemMinAggregateInputType
    _max?: InvoiceItemMaxAggregateInputType
  }

  export type InvoiceItemGroupByOutputType = {
    id: string
    invoiceId: string
    productId: string
    quantity: number
    unitPrice: number
    total: number
    _count: InvoiceItemCountAggregateOutputType | null
    _avg: InvoiceItemAvgAggregateOutputType | null
    _sum: InvoiceItemSumAggregateOutputType | null
    _min: InvoiceItemMinAggregateOutputType | null
    _max: InvoiceItemMaxAggregateOutputType | null
  }

  type GetInvoiceItemGroupByPayload<T extends InvoiceItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InvoiceItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InvoiceItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InvoiceItemGroupByOutputType[P]>
            : GetScalarType<T[P], InvoiceItemGroupByOutputType[P]>
        }
      >
    >


  export type InvoiceItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceId?: boolean
    productId?: boolean
    quantity?: boolean
    unitPrice?: boolean
    total?: boolean
    invoice?: boolean | SalesInvoiceDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["invoiceItem"]>

  export type InvoiceItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceId?: boolean
    productId?: boolean
    quantity?: boolean
    unitPrice?: boolean
    total?: boolean
    invoice?: boolean | SalesInvoiceDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["invoiceItem"]>

  export type InvoiceItemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceId?: boolean
    productId?: boolean
    quantity?: boolean
    unitPrice?: boolean
    total?: boolean
    invoice?: boolean | SalesInvoiceDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["invoiceItem"]>

  export type InvoiceItemSelectScalar = {
    id?: boolean
    invoiceId?: boolean
    productId?: boolean
    quantity?: boolean
    unitPrice?: boolean
    total?: boolean
  }

  export type InvoiceItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "invoiceId" | "productId" | "quantity" | "unitPrice" | "total", ExtArgs["result"]["invoiceItem"]>
  export type InvoiceItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoice?: boolean | SalesInvoiceDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type InvoiceItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoice?: boolean | SalesInvoiceDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type InvoiceItemIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoice?: boolean | SalesInvoiceDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }

  export type $InvoiceItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InvoiceItem"
    objects: {
      invoice: Prisma.$SalesInvoicePayload<ExtArgs>
      product: Prisma.$ProductPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      invoiceId: string
      productId: string
      quantity: number
      unitPrice: number
      total: number
    }, ExtArgs["result"]["invoiceItem"]>
    composites: {}
  }

  type InvoiceItemGetPayload<S extends boolean | null | undefined | InvoiceItemDefaultArgs> = $Result.GetResult<Prisma.$InvoiceItemPayload, S>

  type InvoiceItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InvoiceItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InvoiceItemCountAggregateInputType | true
    }

  export interface InvoiceItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InvoiceItem'], meta: { name: 'InvoiceItem' } }
    /**
     * Find zero or one InvoiceItem that matches the filter.
     * @param {InvoiceItemFindUniqueArgs} args - Arguments to find a InvoiceItem
     * @example
     * // Get one InvoiceItem
     * const invoiceItem = await prisma.invoiceItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InvoiceItemFindUniqueArgs>(args: SelectSubset<T, InvoiceItemFindUniqueArgs<ExtArgs>>): Prisma__InvoiceItemClient<$Result.GetResult<Prisma.$InvoiceItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one InvoiceItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InvoiceItemFindUniqueOrThrowArgs} args - Arguments to find a InvoiceItem
     * @example
     * // Get one InvoiceItem
     * const invoiceItem = await prisma.invoiceItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InvoiceItemFindUniqueOrThrowArgs>(args: SelectSubset<T, InvoiceItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InvoiceItemClient<$Result.GetResult<Prisma.$InvoiceItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InvoiceItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceItemFindFirstArgs} args - Arguments to find a InvoiceItem
     * @example
     * // Get one InvoiceItem
     * const invoiceItem = await prisma.invoiceItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InvoiceItemFindFirstArgs>(args?: SelectSubset<T, InvoiceItemFindFirstArgs<ExtArgs>>): Prisma__InvoiceItemClient<$Result.GetResult<Prisma.$InvoiceItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InvoiceItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceItemFindFirstOrThrowArgs} args - Arguments to find a InvoiceItem
     * @example
     * // Get one InvoiceItem
     * const invoiceItem = await prisma.invoiceItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InvoiceItemFindFirstOrThrowArgs>(args?: SelectSubset<T, InvoiceItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__InvoiceItemClient<$Result.GetResult<Prisma.$InvoiceItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more InvoiceItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InvoiceItems
     * const invoiceItems = await prisma.invoiceItem.findMany()
     * 
     * // Get first 10 InvoiceItems
     * const invoiceItems = await prisma.invoiceItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const invoiceItemWithIdOnly = await prisma.invoiceItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InvoiceItemFindManyArgs>(args?: SelectSubset<T, InvoiceItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoiceItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a InvoiceItem.
     * @param {InvoiceItemCreateArgs} args - Arguments to create a InvoiceItem.
     * @example
     * // Create one InvoiceItem
     * const InvoiceItem = await prisma.invoiceItem.create({
     *   data: {
     *     // ... data to create a InvoiceItem
     *   }
     * })
     * 
     */
    create<T extends InvoiceItemCreateArgs>(args: SelectSubset<T, InvoiceItemCreateArgs<ExtArgs>>): Prisma__InvoiceItemClient<$Result.GetResult<Prisma.$InvoiceItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many InvoiceItems.
     * @param {InvoiceItemCreateManyArgs} args - Arguments to create many InvoiceItems.
     * @example
     * // Create many InvoiceItems
     * const invoiceItem = await prisma.invoiceItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InvoiceItemCreateManyArgs>(args?: SelectSubset<T, InvoiceItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many InvoiceItems and returns the data saved in the database.
     * @param {InvoiceItemCreateManyAndReturnArgs} args - Arguments to create many InvoiceItems.
     * @example
     * // Create many InvoiceItems
     * const invoiceItem = await prisma.invoiceItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many InvoiceItems and only return the `id`
     * const invoiceItemWithIdOnly = await prisma.invoiceItem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InvoiceItemCreateManyAndReturnArgs>(args?: SelectSubset<T, InvoiceItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoiceItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a InvoiceItem.
     * @param {InvoiceItemDeleteArgs} args - Arguments to delete one InvoiceItem.
     * @example
     * // Delete one InvoiceItem
     * const InvoiceItem = await prisma.invoiceItem.delete({
     *   where: {
     *     // ... filter to delete one InvoiceItem
     *   }
     * })
     * 
     */
    delete<T extends InvoiceItemDeleteArgs>(args: SelectSubset<T, InvoiceItemDeleteArgs<ExtArgs>>): Prisma__InvoiceItemClient<$Result.GetResult<Prisma.$InvoiceItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one InvoiceItem.
     * @param {InvoiceItemUpdateArgs} args - Arguments to update one InvoiceItem.
     * @example
     * // Update one InvoiceItem
     * const invoiceItem = await prisma.invoiceItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InvoiceItemUpdateArgs>(args: SelectSubset<T, InvoiceItemUpdateArgs<ExtArgs>>): Prisma__InvoiceItemClient<$Result.GetResult<Prisma.$InvoiceItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more InvoiceItems.
     * @param {InvoiceItemDeleteManyArgs} args - Arguments to filter InvoiceItems to delete.
     * @example
     * // Delete a few InvoiceItems
     * const { count } = await prisma.invoiceItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InvoiceItemDeleteManyArgs>(args?: SelectSubset<T, InvoiceItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InvoiceItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InvoiceItems
     * const invoiceItem = await prisma.invoiceItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InvoiceItemUpdateManyArgs>(args: SelectSubset<T, InvoiceItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InvoiceItems and returns the data updated in the database.
     * @param {InvoiceItemUpdateManyAndReturnArgs} args - Arguments to update many InvoiceItems.
     * @example
     * // Update many InvoiceItems
     * const invoiceItem = await prisma.invoiceItem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more InvoiceItems and only return the `id`
     * const invoiceItemWithIdOnly = await prisma.invoiceItem.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends InvoiceItemUpdateManyAndReturnArgs>(args: SelectSubset<T, InvoiceItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoiceItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one InvoiceItem.
     * @param {InvoiceItemUpsertArgs} args - Arguments to update or create a InvoiceItem.
     * @example
     * // Update or create a InvoiceItem
     * const invoiceItem = await prisma.invoiceItem.upsert({
     *   create: {
     *     // ... data to create a InvoiceItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InvoiceItem we want to update
     *   }
     * })
     */
    upsert<T extends InvoiceItemUpsertArgs>(args: SelectSubset<T, InvoiceItemUpsertArgs<ExtArgs>>): Prisma__InvoiceItemClient<$Result.GetResult<Prisma.$InvoiceItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of InvoiceItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceItemCountArgs} args - Arguments to filter InvoiceItems to count.
     * @example
     * // Count the number of InvoiceItems
     * const count = await prisma.invoiceItem.count({
     *   where: {
     *     // ... the filter for the InvoiceItems we want to count
     *   }
     * })
    **/
    count<T extends InvoiceItemCountArgs>(
      args?: Subset<T, InvoiceItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InvoiceItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InvoiceItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InvoiceItemAggregateArgs>(args: Subset<T, InvoiceItemAggregateArgs>): Prisma.PrismaPromise<GetInvoiceItemAggregateType<T>>

    /**
     * Group by InvoiceItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InvoiceItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InvoiceItemGroupByArgs['orderBy'] }
        : { orderBy?: InvoiceItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InvoiceItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInvoiceItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InvoiceItem model
   */
  readonly fields: InvoiceItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InvoiceItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InvoiceItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    invoice<T extends SalesInvoiceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SalesInvoiceDefaultArgs<ExtArgs>>): Prisma__SalesInvoiceClient<$Result.GetResult<Prisma.$SalesInvoicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductDefaultArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the InvoiceItem model
   */
  interface InvoiceItemFieldRefs {
    readonly id: FieldRef<"InvoiceItem", 'String'>
    readonly invoiceId: FieldRef<"InvoiceItem", 'String'>
    readonly productId: FieldRef<"InvoiceItem", 'String'>
    readonly quantity: FieldRef<"InvoiceItem", 'Float'>
    readonly unitPrice: FieldRef<"InvoiceItem", 'Float'>
    readonly total: FieldRef<"InvoiceItem", 'Float'>
  }
    

  // Custom InputTypes
  /**
   * InvoiceItem findUnique
   */
  export type InvoiceItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceItem
     */
    select?: InvoiceItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceItem
     */
    omit?: InvoiceItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceItemInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceItem to fetch.
     */
    where: InvoiceItemWhereUniqueInput
  }

  /**
   * InvoiceItem findUniqueOrThrow
   */
  export type InvoiceItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceItem
     */
    select?: InvoiceItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceItem
     */
    omit?: InvoiceItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceItemInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceItem to fetch.
     */
    where: InvoiceItemWhereUniqueInput
  }

  /**
   * InvoiceItem findFirst
   */
  export type InvoiceItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceItem
     */
    select?: InvoiceItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceItem
     */
    omit?: InvoiceItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceItemInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceItem to fetch.
     */
    where?: InvoiceItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvoiceItems to fetch.
     */
    orderBy?: InvoiceItemOrderByWithRelationInput | InvoiceItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InvoiceItems.
     */
    cursor?: InvoiceItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvoiceItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvoiceItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InvoiceItems.
     */
    distinct?: InvoiceItemScalarFieldEnum | InvoiceItemScalarFieldEnum[]
  }

  /**
   * InvoiceItem findFirstOrThrow
   */
  export type InvoiceItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceItem
     */
    select?: InvoiceItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceItem
     */
    omit?: InvoiceItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceItemInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceItem to fetch.
     */
    where?: InvoiceItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvoiceItems to fetch.
     */
    orderBy?: InvoiceItemOrderByWithRelationInput | InvoiceItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InvoiceItems.
     */
    cursor?: InvoiceItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvoiceItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvoiceItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InvoiceItems.
     */
    distinct?: InvoiceItemScalarFieldEnum | InvoiceItemScalarFieldEnum[]
  }

  /**
   * InvoiceItem findMany
   */
  export type InvoiceItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceItem
     */
    select?: InvoiceItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceItem
     */
    omit?: InvoiceItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceItemInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceItems to fetch.
     */
    where?: InvoiceItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvoiceItems to fetch.
     */
    orderBy?: InvoiceItemOrderByWithRelationInput | InvoiceItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InvoiceItems.
     */
    cursor?: InvoiceItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvoiceItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvoiceItems.
     */
    skip?: number
    distinct?: InvoiceItemScalarFieldEnum | InvoiceItemScalarFieldEnum[]
  }

  /**
   * InvoiceItem create
   */
  export type InvoiceItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceItem
     */
    select?: InvoiceItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceItem
     */
    omit?: InvoiceItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceItemInclude<ExtArgs> | null
    /**
     * The data needed to create a InvoiceItem.
     */
    data: XOR<InvoiceItemCreateInput, InvoiceItemUncheckedCreateInput>
  }

  /**
   * InvoiceItem createMany
   */
  export type InvoiceItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InvoiceItems.
     */
    data: InvoiceItemCreateManyInput | InvoiceItemCreateManyInput[]
  }

  /**
   * InvoiceItem createManyAndReturn
   */
  export type InvoiceItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceItem
     */
    select?: InvoiceItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceItem
     */
    omit?: InvoiceItemOmit<ExtArgs> | null
    /**
     * The data used to create many InvoiceItems.
     */
    data: InvoiceItemCreateManyInput | InvoiceItemCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * InvoiceItem update
   */
  export type InvoiceItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceItem
     */
    select?: InvoiceItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceItem
     */
    omit?: InvoiceItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceItemInclude<ExtArgs> | null
    /**
     * The data needed to update a InvoiceItem.
     */
    data: XOR<InvoiceItemUpdateInput, InvoiceItemUncheckedUpdateInput>
    /**
     * Choose, which InvoiceItem to update.
     */
    where: InvoiceItemWhereUniqueInput
  }

  /**
   * InvoiceItem updateMany
   */
  export type InvoiceItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InvoiceItems.
     */
    data: XOR<InvoiceItemUpdateManyMutationInput, InvoiceItemUncheckedUpdateManyInput>
    /**
     * Filter which InvoiceItems to update
     */
    where?: InvoiceItemWhereInput
    /**
     * Limit how many InvoiceItems to update.
     */
    limit?: number
  }

  /**
   * InvoiceItem updateManyAndReturn
   */
  export type InvoiceItemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceItem
     */
    select?: InvoiceItemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceItem
     */
    omit?: InvoiceItemOmit<ExtArgs> | null
    /**
     * The data used to update InvoiceItems.
     */
    data: XOR<InvoiceItemUpdateManyMutationInput, InvoiceItemUncheckedUpdateManyInput>
    /**
     * Filter which InvoiceItems to update
     */
    where?: InvoiceItemWhereInput
    /**
     * Limit how many InvoiceItems to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceItemIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * InvoiceItem upsert
   */
  export type InvoiceItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceItem
     */
    select?: InvoiceItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceItem
     */
    omit?: InvoiceItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceItemInclude<ExtArgs> | null
    /**
     * The filter to search for the InvoiceItem to update in case it exists.
     */
    where: InvoiceItemWhereUniqueInput
    /**
     * In case the InvoiceItem found by the `where` argument doesn't exist, create a new InvoiceItem with this data.
     */
    create: XOR<InvoiceItemCreateInput, InvoiceItemUncheckedCreateInput>
    /**
     * In case the InvoiceItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InvoiceItemUpdateInput, InvoiceItemUncheckedUpdateInput>
  }

  /**
   * InvoiceItem delete
   */
  export type InvoiceItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceItem
     */
    select?: InvoiceItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceItem
     */
    omit?: InvoiceItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceItemInclude<ExtArgs> | null
    /**
     * Filter which InvoiceItem to delete.
     */
    where: InvoiceItemWhereUniqueInput
  }

  /**
   * InvoiceItem deleteMany
   */
  export type InvoiceItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InvoiceItems to delete
     */
    where?: InvoiceItemWhereInput
    /**
     * Limit how many InvoiceItems to delete.
     */
    limit?: number
  }

  /**
   * InvoiceItem without action
   */
  export type InvoiceItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceItem
     */
    select?: InvoiceItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceItem
     */
    omit?: InvoiceItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceItemInclude<ExtArgs> | null
  }


  /**
   * Model PurchaseItem
   */

  export type AggregatePurchaseItem = {
    _count: PurchaseItemCountAggregateOutputType | null
    _avg: PurchaseItemAvgAggregateOutputType | null
    _sum: PurchaseItemSumAggregateOutputType | null
    _min: PurchaseItemMinAggregateOutputType | null
    _max: PurchaseItemMaxAggregateOutputType | null
  }

  export type PurchaseItemAvgAggregateOutputType = {
    quantity: number | null
    unitPrice: number | null
    total: number | null
  }

  export type PurchaseItemSumAggregateOutputType = {
    quantity: number | null
    unitPrice: number | null
    total: number | null
  }

  export type PurchaseItemMinAggregateOutputType = {
    id: string | null
    invoiceId: string | null
    productId: string | null
    quantity: number | null
    unitPrice: number | null
    total: number | null
  }

  export type PurchaseItemMaxAggregateOutputType = {
    id: string | null
    invoiceId: string | null
    productId: string | null
    quantity: number | null
    unitPrice: number | null
    total: number | null
  }

  export type PurchaseItemCountAggregateOutputType = {
    id: number
    invoiceId: number
    productId: number
    quantity: number
    unitPrice: number
    total: number
    _all: number
  }


  export type PurchaseItemAvgAggregateInputType = {
    quantity?: true
    unitPrice?: true
    total?: true
  }

  export type PurchaseItemSumAggregateInputType = {
    quantity?: true
    unitPrice?: true
    total?: true
  }

  export type PurchaseItemMinAggregateInputType = {
    id?: true
    invoiceId?: true
    productId?: true
    quantity?: true
    unitPrice?: true
    total?: true
  }

  export type PurchaseItemMaxAggregateInputType = {
    id?: true
    invoiceId?: true
    productId?: true
    quantity?: true
    unitPrice?: true
    total?: true
  }

  export type PurchaseItemCountAggregateInputType = {
    id?: true
    invoiceId?: true
    productId?: true
    quantity?: true
    unitPrice?: true
    total?: true
    _all?: true
  }

  export type PurchaseItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PurchaseItem to aggregate.
     */
    where?: PurchaseItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchaseItems to fetch.
     */
    orderBy?: PurchaseItemOrderByWithRelationInput | PurchaseItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PurchaseItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchaseItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchaseItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PurchaseItems
    **/
    _count?: true | PurchaseItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PurchaseItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PurchaseItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PurchaseItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PurchaseItemMaxAggregateInputType
  }

  export type GetPurchaseItemAggregateType<T extends PurchaseItemAggregateArgs> = {
        [P in keyof T & keyof AggregatePurchaseItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePurchaseItem[P]>
      : GetScalarType<T[P], AggregatePurchaseItem[P]>
  }




  export type PurchaseItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PurchaseItemWhereInput
    orderBy?: PurchaseItemOrderByWithAggregationInput | PurchaseItemOrderByWithAggregationInput[]
    by: PurchaseItemScalarFieldEnum[] | PurchaseItemScalarFieldEnum
    having?: PurchaseItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PurchaseItemCountAggregateInputType | true
    _avg?: PurchaseItemAvgAggregateInputType
    _sum?: PurchaseItemSumAggregateInputType
    _min?: PurchaseItemMinAggregateInputType
    _max?: PurchaseItemMaxAggregateInputType
  }

  export type PurchaseItemGroupByOutputType = {
    id: string
    invoiceId: string
    productId: string
    quantity: number
    unitPrice: number
    total: number
    _count: PurchaseItemCountAggregateOutputType | null
    _avg: PurchaseItemAvgAggregateOutputType | null
    _sum: PurchaseItemSumAggregateOutputType | null
    _min: PurchaseItemMinAggregateOutputType | null
    _max: PurchaseItemMaxAggregateOutputType | null
  }

  type GetPurchaseItemGroupByPayload<T extends PurchaseItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PurchaseItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PurchaseItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PurchaseItemGroupByOutputType[P]>
            : GetScalarType<T[P], PurchaseItemGroupByOutputType[P]>
        }
      >
    >


  export type PurchaseItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceId?: boolean
    productId?: boolean
    quantity?: boolean
    unitPrice?: boolean
    total?: boolean
    invoice?: boolean | PurchaseInvoiceDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["purchaseItem"]>

  export type PurchaseItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceId?: boolean
    productId?: boolean
    quantity?: boolean
    unitPrice?: boolean
    total?: boolean
    invoice?: boolean | PurchaseInvoiceDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["purchaseItem"]>

  export type PurchaseItemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceId?: boolean
    productId?: boolean
    quantity?: boolean
    unitPrice?: boolean
    total?: boolean
    invoice?: boolean | PurchaseInvoiceDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["purchaseItem"]>

  export type PurchaseItemSelectScalar = {
    id?: boolean
    invoiceId?: boolean
    productId?: boolean
    quantity?: boolean
    unitPrice?: boolean
    total?: boolean
  }

  export type PurchaseItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "invoiceId" | "productId" | "quantity" | "unitPrice" | "total", ExtArgs["result"]["purchaseItem"]>
  export type PurchaseItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoice?: boolean | PurchaseInvoiceDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type PurchaseItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoice?: boolean | PurchaseInvoiceDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type PurchaseItemIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoice?: boolean | PurchaseInvoiceDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }

  export type $PurchaseItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PurchaseItem"
    objects: {
      invoice: Prisma.$PurchaseInvoicePayload<ExtArgs>
      product: Prisma.$ProductPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      invoiceId: string
      productId: string
      quantity: number
      unitPrice: number
      total: number
    }, ExtArgs["result"]["purchaseItem"]>
    composites: {}
  }

  type PurchaseItemGetPayload<S extends boolean | null | undefined | PurchaseItemDefaultArgs> = $Result.GetResult<Prisma.$PurchaseItemPayload, S>

  type PurchaseItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PurchaseItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PurchaseItemCountAggregateInputType | true
    }

  export interface PurchaseItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PurchaseItem'], meta: { name: 'PurchaseItem' } }
    /**
     * Find zero or one PurchaseItem that matches the filter.
     * @param {PurchaseItemFindUniqueArgs} args - Arguments to find a PurchaseItem
     * @example
     * // Get one PurchaseItem
     * const purchaseItem = await prisma.purchaseItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PurchaseItemFindUniqueArgs>(args: SelectSubset<T, PurchaseItemFindUniqueArgs<ExtArgs>>): Prisma__PurchaseItemClient<$Result.GetResult<Prisma.$PurchaseItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PurchaseItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PurchaseItemFindUniqueOrThrowArgs} args - Arguments to find a PurchaseItem
     * @example
     * // Get one PurchaseItem
     * const purchaseItem = await prisma.purchaseItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PurchaseItemFindUniqueOrThrowArgs>(args: SelectSubset<T, PurchaseItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PurchaseItemClient<$Result.GetResult<Prisma.$PurchaseItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PurchaseItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseItemFindFirstArgs} args - Arguments to find a PurchaseItem
     * @example
     * // Get one PurchaseItem
     * const purchaseItem = await prisma.purchaseItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PurchaseItemFindFirstArgs>(args?: SelectSubset<T, PurchaseItemFindFirstArgs<ExtArgs>>): Prisma__PurchaseItemClient<$Result.GetResult<Prisma.$PurchaseItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PurchaseItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseItemFindFirstOrThrowArgs} args - Arguments to find a PurchaseItem
     * @example
     * // Get one PurchaseItem
     * const purchaseItem = await prisma.purchaseItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PurchaseItemFindFirstOrThrowArgs>(args?: SelectSubset<T, PurchaseItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__PurchaseItemClient<$Result.GetResult<Prisma.$PurchaseItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PurchaseItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PurchaseItems
     * const purchaseItems = await prisma.purchaseItem.findMany()
     * 
     * // Get first 10 PurchaseItems
     * const purchaseItems = await prisma.purchaseItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const purchaseItemWithIdOnly = await prisma.purchaseItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PurchaseItemFindManyArgs>(args?: SelectSubset<T, PurchaseItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchaseItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PurchaseItem.
     * @param {PurchaseItemCreateArgs} args - Arguments to create a PurchaseItem.
     * @example
     * // Create one PurchaseItem
     * const PurchaseItem = await prisma.purchaseItem.create({
     *   data: {
     *     // ... data to create a PurchaseItem
     *   }
     * })
     * 
     */
    create<T extends PurchaseItemCreateArgs>(args: SelectSubset<T, PurchaseItemCreateArgs<ExtArgs>>): Prisma__PurchaseItemClient<$Result.GetResult<Prisma.$PurchaseItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PurchaseItems.
     * @param {PurchaseItemCreateManyArgs} args - Arguments to create many PurchaseItems.
     * @example
     * // Create many PurchaseItems
     * const purchaseItem = await prisma.purchaseItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PurchaseItemCreateManyArgs>(args?: SelectSubset<T, PurchaseItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PurchaseItems and returns the data saved in the database.
     * @param {PurchaseItemCreateManyAndReturnArgs} args - Arguments to create many PurchaseItems.
     * @example
     * // Create many PurchaseItems
     * const purchaseItem = await prisma.purchaseItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PurchaseItems and only return the `id`
     * const purchaseItemWithIdOnly = await prisma.purchaseItem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PurchaseItemCreateManyAndReturnArgs>(args?: SelectSubset<T, PurchaseItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchaseItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PurchaseItem.
     * @param {PurchaseItemDeleteArgs} args - Arguments to delete one PurchaseItem.
     * @example
     * // Delete one PurchaseItem
     * const PurchaseItem = await prisma.purchaseItem.delete({
     *   where: {
     *     // ... filter to delete one PurchaseItem
     *   }
     * })
     * 
     */
    delete<T extends PurchaseItemDeleteArgs>(args: SelectSubset<T, PurchaseItemDeleteArgs<ExtArgs>>): Prisma__PurchaseItemClient<$Result.GetResult<Prisma.$PurchaseItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PurchaseItem.
     * @param {PurchaseItemUpdateArgs} args - Arguments to update one PurchaseItem.
     * @example
     * // Update one PurchaseItem
     * const purchaseItem = await prisma.purchaseItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PurchaseItemUpdateArgs>(args: SelectSubset<T, PurchaseItemUpdateArgs<ExtArgs>>): Prisma__PurchaseItemClient<$Result.GetResult<Prisma.$PurchaseItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PurchaseItems.
     * @param {PurchaseItemDeleteManyArgs} args - Arguments to filter PurchaseItems to delete.
     * @example
     * // Delete a few PurchaseItems
     * const { count } = await prisma.purchaseItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PurchaseItemDeleteManyArgs>(args?: SelectSubset<T, PurchaseItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PurchaseItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PurchaseItems
     * const purchaseItem = await prisma.purchaseItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PurchaseItemUpdateManyArgs>(args: SelectSubset<T, PurchaseItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PurchaseItems and returns the data updated in the database.
     * @param {PurchaseItemUpdateManyAndReturnArgs} args - Arguments to update many PurchaseItems.
     * @example
     * // Update many PurchaseItems
     * const purchaseItem = await prisma.purchaseItem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PurchaseItems and only return the `id`
     * const purchaseItemWithIdOnly = await prisma.purchaseItem.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PurchaseItemUpdateManyAndReturnArgs>(args: SelectSubset<T, PurchaseItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchaseItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PurchaseItem.
     * @param {PurchaseItemUpsertArgs} args - Arguments to update or create a PurchaseItem.
     * @example
     * // Update or create a PurchaseItem
     * const purchaseItem = await prisma.purchaseItem.upsert({
     *   create: {
     *     // ... data to create a PurchaseItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PurchaseItem we want to update
     *   }
     * })
     */
    upsert<T extends PurchaseItemUpsertArgs>(args: SelectSubset<T, PurchaseItemUpsertArgs<ExtArgs>>): Prisma__PurchaseItemClient<$Result.GetResult<Prisma.$PurchaseItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PurchaseItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseItemCountArgs} args - Arguments to filter PurchaseItems to count.
     * @example
     * // Count the number of PurchaseItems
     * const count = await prisma.purchaseItem.count({
     *   where: {
     *     // ... the filter for the PurchaseItems we want to count
     *   }
     * })
    **/
    count<T extends PurchaseItemCountArgs>(
      args?: Subset<T, PurchaseItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PurchaseItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PurchaseItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PurchaseItemAggregateArgs>(args: Subset<T, PurchaseItemAggregateArgs>): Prisma.PrismaPromise<GetPurchaseItemAggregateType<T>>

    /**
     * Group by PurchaseItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PurchaseItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PurchaseItemGroupByArgs['orderBy'] }
        : { orderBy?: PurchaseItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PurchaseItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPurchaseItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PurchaseItem model
   */
  readonly fields: PurchaseItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PurchaseItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PurchaseItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    invoice<T extends PurchaseInvoiceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PurchaseInvoiceDefaultArgs<ExtArgs>>): Prisma__PurchaseInvoiceClient<$Result.GetResult<Prisma.$PurchaseInvoicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductDefaultArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PurchaseItem model
   */
  interface PurchaseItemFieldRefs {
    readonly id: FieldRef<"PurchaseItem", 'String'>
    readonly invoiceId: FieldRef<"PurchaseItem", 'String'>
    readonly productId: FieldRef<"PurchaseItem", 'String'>
    readonly quantity: FieldRef<"PurchaseItem", 'Float'>
    readonly unitPrice: FieldRef<"PurchaseItem", 'Float'>
    readonly total: FieldRef<"PurchaseItem", 'Float'>
  }
    

  // Custom InputTypes
  /**
   * PurchaseItem findUnique
   */
  export type PurchaseItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseItem
     */
    select?: PurchaseItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseItem
     */
    omit?: PurchaseItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseItemInclude<ExtArgs> | null
    /**
     * Filter, which PurchaseItem to fetch.
     */
    where: PurchaseItemWhereUniqueInput
  }

  /**
   * PurchaseItem findUniqueOrThrow
   */
  export type PurchaseItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseItem
     */
    select?: PurchaseItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseItem
     */
    omit?: PurchaseItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseItemInclude<ExtArgs> | null
    /**
     * Filter, which PurchaseItem to fetch.
     */
    where: PurchaseItemWhereUniqueInput
  }

  /**
   * PurchaseItem findFirst
   */
  export type PurchaseItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseItem
     */
    select?: PurchaseItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseItem
     */
    omit?: PurchaseItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseItemInclude<ExtArgs> | null
    /**
     * Filter, which PurchaseItem to fetch.
     */
    where?: PurchaseItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchaseItems to fetch.
     */
    orderBy?: PurchaseItemOrderByWithRelationInput | PurchaseItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PurchaseItems.
     */
    cursor?: PurchaseItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchaseItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchaseItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PurchaseItems.
     */
    distinct?: PurchaseItemScalarFieldEnum | PurchaseItemScalarFieldEnum[]
  }

  /**
   * PurchaseItem findFirstOrThrow
   */
  export type PurchaseItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseItem
     */
    select?: PurchaseItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseItem
     */
    omit?: PurchaseItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseItemInclude<ExtArgs> | null
    /**
     * Filter, which PurchaseItem to fetch.
     */
    where?: PurchaseItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchaseItems to fetch.
     */
    orderBy?: PurchaseItemOrderByWithRelationInput | PurchaseItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PurchaseItems.
     */
    cursor?: PurchaseItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchaseItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchaseItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PurchaseItems.
     */
    distinct?: PurchaseItemScalarFieldEnum | PurchaseItemScalarFieldEnum[]
  }

  /**
   * PurchaseItem findMany
   */
  export type PurchaseItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseItem
     */
    select?: PurchaseItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseItem
     */
    omit?: PurchaseItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseItemInclude<ExtArgs> | null
    /**
     * Filter, which PurchaseItems to fetch.
     */
    where?: PurchaseItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchaseItems to fetch.
     */
    orderBy?: PurchaseItemOrderByWithRelationInput | PurchaseItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PurchaseItems.
     */
    cursor?: PurchaseItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchaseItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchaseItems.
     */
    skip?: number
    distinct?: PurchaseItemScalarFieldEnum | PurchaseItemScalarFieldEnum[]
  }

  /**
   * PurchaseItem create
   */
  export type PurchaseItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseItem
     */
    select?: PurchaseItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseItem
     */
    omit?: PurchaseItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseItemInclude<ExtArgs> | null
    /**
     * The data needed to create a PurchaseItem.
     */
    data: XOR<PurchaseItemCreateInput, PurchaseItemUncheckedCreateInput>
  }

  /**
   * PurchaseItem createMany
   */
  export type PurchaseItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PurchaseItems.
     */
    data: PurchaseItemCreateManyInput | PurchaseItemCreateManyInput[]
  }

  /**
   * PurchaseItem createManyAndReturn
   */
  export type PurchaseItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseItem
     */
    select?: PurchaseItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseItem
     */
    omit?: PurchaseItemOmit<ExtArgs> | null
    /**
     * The data used to create many PurchaseItems.
     */
    data: PurchaseItemCreateManyInput | PurchaseItemCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PurchaseItem update
   */
  export type PurchaseItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseItem
     */
    select?: PurchaseItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseItem
     */
    omit?: PurchaseItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseItemInclude<ExtArgs> | null
    /**
     * The data needed to update a PurchaseItem.
     */
    data: XOR<PurchaseItemUpdateInput, PurchaseItemUncheckedUpdateInput>
    /**
     * Choose, which PurchaseItem to update.
     */
    where: PurchaseItemWhereUniqueInput
  }

  /**
   * PurchaseItem updateMany
   */
  export type PurchaseItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PurchaseItems.
     */
    data: XOR<PurchaseItemUpdateManyMutationInput, PurchaseItemUncheckedUpdateManyInput>
    /**
     * Filter which PurchaseItems to update
     */
    where?: PurchaseItemWhereInput
    /**
     * Limit how many PurchaseItems to update.
     */
    limit?: number
  }

  /**
   * PurchaseItem updateManyAndReturn
   */
  export type PurchaseItemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseItem
     */
    select?: PurchaseItemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseItem
     */
    omit?: PurchaseItemOmit<ExtArgs> | null
    /**
     * The data used to update PurchaseItems.
     */
    data: XOR<PurchaseItemUpdateManyMutationInput, PurchaseItemUncheckedUpdateManyInput>
    /**
     * Filter which PurchaseItems to update
     */
    where?: PurchaseItemWhereInput
    /**
     * Limit how many PurchaseItems to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseItemIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PurchaseItem upsert
   */
  export type PurchaseItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseItem
     */
    select?: PurchaseItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseItem
     */
    omit?: PurchaseItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseItemInclude<ExtArgs> | null
    /**
     * The filter to search for the PurchaseItem to update in case it exists.
     */
    where: PurchaseItemWhereUniqueInput
    /**
     * In case the PurchaseItem found by the `where` argument doesn't exist, create a new PurchaseItem with this data.
     */
    create: XOR<PurchaseItemCreateInput, PurchaseItemUncheckedCreateInput>
    /**
     * In case the PurchaseItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PurchaseItemUpdateInput, PurchaseItemUncheckedUpdateInput>
  }

  /**
   * PurchaseItem delete
   */
  export type PurchaseItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseItem
     */
    select?: PurchaseItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseItem
     */
    omit?: PurchaseItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseItemInclude<ExtArgs> | null
    /**
     * Filter which PurchaseItem to delete.
     */
    where: PurchaseItemWhereUniqueInput
  }

  /**
   * PurchaseItem deleteMany
   */
  export type PurchaseItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PurchaseItems to delete
     */
    where?: PurchaseItemWhereInput
    /**
     * Limit how many PurchaseItems to delete.
     */
    limit?: number
  }

  /**
   * PurchaseItem without action
   */
  export type PurchaseItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseItem
     */
    select?: PurchaseItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseItem
     */
    omit?: PurchaseItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseItemInclude<ExtArgs> | null
  }


  /**
   * Model InventoryLog
   */

  export type AggregateInventoryLog = {
    _count: InventoryLogCountAggregateOutputType | null
    _avg: InventoryLogAvgAggregateOutputType | null
    _sum: InventoryLogSumAggregateOutputType | null
    _min: InventoryLogMinAggregateOutputType | null
    _max: InventoryLogMaxAggregateOutputType | null
  }

  export type InventoryLogAvgAggregateOutputType = {
    quantity: number | null
  }

  export type InventoryLogSumAggregateOutputType = {
    quantity: number | null
  }

  export type InventoryLogMinAggregateOutputType = {
    id: string | null
    productId: string | null
    date: Date | null
    type: string | null
    quantity: number | null
    referenceId: string | null
    description: string | null
  }

  export type InventoryLogMaxAggregateOutputType = {
    id: string | null
    productId: string | null
    date: Date | null
    type: string | null
    quantity: number | null
    referenceId: string | null
    description: string | null
  }

  export type InventoryLogCountAggregateOutputType = {
    id: number
    productId: number
    date: number
    type: number
    quantity: number
    referenceId: number
    description: number
    _all: number
  }


  export type InventoryLogAvgAggregateInputType = {
    quantity?: true
  }

  export type InventoryLogSumAggregateInputType = {
    quantity?: true
  }

  export type InventoryLogMinAggregateInputType = {
    id?: true
    productId?: true
    date?: true
    type?: true
    quantity?: true
    referenceId?: true
    description?: true
  }

  export type InventoryLogMaxAggregateInputType = {
    id?: true
    productId?: true
    date?: true
    type?: true
    quantity?: true
    referenceId?: true
    description?: true
  }

  export type InventoryLogCountAggregateInputType = {
    id?: true
    productId?: true
    date?: true
    type?: true
    quantity?: true
    referenceId?: true
    description?: true
    _all?: true
  }

  export type InventoryLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InventoryLog to aggregate.
     */
    where?: InventoryLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryLogs to fetch.
     */
    orderBy?: InventoryLogOrderByWithRelationInput | InventoryLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InventoryLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InventoryLogs
    **/
    _count?: true | InventoryLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InventoryLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InventoryLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InventoryLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InventoryLogMaxAggregateInputType
  }

  export type GetInventoryLogAggregateType<T extends InventoryLogAggregateArgs> = {
        [P in keyof T & keyof AggregateInventoryLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInventoryLog[P]>
      : GetScalarType<T[P], AggregateInventoryLog[P]>
  }




  export type InventoryLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InventoryLogWhereInput
    orderBy?: InventoryLogOrderByWithAggregationInput | InventoryLogOrderByWithAggregationInput[]
    by: InventoryLogScalarFieldEnum[] | InventoryLogScalarFieldEnum
    having?: InventoryLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InventoryLogCountAggregateInputType | true
    _avg?: InventoryLogAvgAggregateInputType
    _sum?: InventoryLogSumAggregateInputType
    _min?: InventoryLogMinAggregateInputType
    _max?: InventoryLogMaxAggregateInputType
  }

  export type InventoryLogGroupByOutputType = {
    id: string
    productId: string
    date: Date
    type: string
    quantity: number
    referenceId: string | null
    description: string | null
    _count: InventoryLogCountAggregateOutputType | null
    _avg: InventoryLogAvgAggregateOutputType | null
    _sum: InventoryLogSumAggregateOutputType | null
    _min: InventoryLogMinAggregateOutputType | null
    _max: InventoryLogMaxAggregateOutputType | null
  }

  type GetInventoryLogGroupByPayload<T extends InventoryLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InventoryLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InventoryLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InventoryLogGroupByOutputType[P]>
            : GetScalarType<T[P], InventoryLogGroupByOutputType[P]>
        }
      >
    >


  export type InventoryLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    date?: boolean
    type?: boolean
    quantity?: boolean
    referenceId?: boolean
    description?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inventoryLog"]>

  export type InventoryLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    date?: boolean
    type?: boolean
    quantity?: boolean
    referenceId?: boolean
    description?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inventoryLog"]>

  export type InventoryLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    date?: boolean
    type?: boolean
    quantity?: boolean
    referenceId?: boolean
    description?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inventoryLog"]>

  export type InventoryLogSelectScalar = {
    id?: boolean
    productId?: boolean
    date?: boolean
    type?: boolean
    quantity?: boolean
    referenceId?: boolean
    description?: boolean
  }

  export type InventoryLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "productId" | "date" | "type" | "quantity" | "referenceId" | "description", ExtArgs["result"]["inventoryLog"]>
  export type InventoryLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type InventoryLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type InventoryLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }

  export type $InventoryLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InventoryLog"
    objects: {
      product: Prisma.$ProductPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      productId: string
      date: Date
      type: string
      quantity: number
      referenceId: string | null
      description: string | null
    }, ExtArgs["result"]["inventoryLog"]>
    composites: {}
  }

  type InventoryLogGetPayload<S extends boolean | null | undefined | InventoryLogDefaultArgs> = $Result.GetResult<Prisma.$InventoryLogPayload, S>

  type InventoryLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InventoryLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InventoryLogCountAggregateInputType | true
    }

  export interface InventoryLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InventoryLog'], meta: { name: 'InventoryLog' } }
    /**
     * Find zero or one InventoryLog that matches the filter.
     * @param {InventoryLogFindUniqueArgs} args - Arguments to find a InventoryLog
     * @example
     * // Get one InventoryLog
     * const inventoryLog = await prisma.inventoryLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InventoryLogFindUniqueArgs>(args: SelectSubset<T, InventoryLogFindUniqueArgs<ExtArgs>>): Prisma__InventoryLogClient<$Result.GetResult<Prisma.$InventoryLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one InventoryLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InventoryLogFindUniqueOrThrowArgs} args - Arguments to find a InventoryLog
     * @example
     * // Get one InventoryLog
     * const inventoryLog = await prisma.inventoryLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InventoryLogFindUniqueOrThrowArgs>(args: SelectSubset<T, InventoryLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InventoryLogClient<$Result.GetResult<Prisma.$InventoryLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InventoryLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryLogFindFirstArgs} args - Arguments to find a InventoryLog
     * @example
     * // Get one InventoryLog
     * const inventoryLog = await prisma.inventoryLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InventoryLogFindFirstArgs>(args?: SelectSubset<T, InventoryLogFindFirstArgs<ExtArgs>>): Prisma__InventoryLogClient<$Result.GetResult<Prisma.$InventoryLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InventoryLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryLogFindFirstOrThrowArgs} args - Arguments to find a InventoryLog
     * @example
     * // Get one InventoryLog
     * const inventoryLog = await prisma.inventoryLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InventoryLogFindFirstOrThrowArgs>(args?: SelectSubset<T, InventoryLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__InventoryLogClient<$Result.GetResult<Prisma.$InventoryLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more InventoryLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InventoryLogs
     * const inventoryLogs = await prisma.inventoryLog.findMany()
     * 
     * // Get first 10 InventoryLogs
     * const inventoryLogs = await prisma.inventoryLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const inventoryLogWithIdOnly = await prisma.inventoryLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InventoryLogFindManyArgs>(args?: SelectSubset<T, InventoryLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a InventoryLog.
     * @param {InventoryLogCreateArgs} args - Arguments to create a InventoryLog.
     * @example
     * // Create one InventoryLog
     * const InventoryLog = await prisma.inventoryLog.create({
     *   data: {
     *     // ... data to create a InventoryLog
     *   }
     * })
     * 
     */
    create<T extends InventoryLogCreateArgs>(args: SelectSubset<T, InventoryLogCreateArgs<ExtArgs>>): Prisma__InventoryLogClient<$Result.GetResult<Prisma.$InventoryLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many InventoryLogs.
     * @param {InventoryLogCreateManyArgs} args - Arguments to create many InventoryLogs.
     * @example
     * // Create many InventoryLogs
     * const inventoryLog = await prisma.inventoryLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InventoryLogCreateManyArgs>(args?: SelectSubset<T, InventoryLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many InventoryLogs and returns the data saved in the database.
     * @param {InventoryLogCreateManyAndReturnArgs} args - Arguments to create many InventoryLogs.
     * @example
     * // Create many InventoryLogs
     * const inventoryLog = await prisma.inventoryLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many InventoryLogs and only return the `id`
     * const inventoryLogWithIdOnly = await prisma.inventoryLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InventoryLogCreateManyAndReturnArgs>(args?: SelectSubset<T, InventoryLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a InventoryLog.
     * @param {InventoryLogDeleteArgs} args - Arguments to delete one InventoryLog.
     * @example
     * // Delete one InventoryLog
     * const InventoryLog = await prisma.inventoryLog.delete({
     *   where: {
     *     // ... filter to delete one InventoryLog
     *   }
     * })
     * 
     */
    delete<T extends InventoryLogDeleteArgs>(args: SelectSubset<T, InventoryLogDeleteArgs<ExtArgs>>): Prisma__InventoryLogClient<$Result.GetResult<Prisma.$InventoryLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one InventoryLog.
     * @param {InventoryLogUpdateArgs} args - Arguments to update one InventoryLog.
     * @example
     * // Update one InventoryLog
     * const inventoryLog = await prisma.inventoryLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InventoryLogUpdateArgs>(args: SelectSubset<T, InventoryLogUpdateArgs<ExtArgs>>): Prisma__InventoryLogClient<$Result.GetResult<Prisma.$InventoryLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more InventoryLogs.
     * @param {InventoryLogDeleteManyArgs} args - Arguments to filter InventoryLogs to delete.
     * @example
     * // Delete a few InventoryLogs
     * const { count } = await prisma.inventoryLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InventoryLogDeleteManyArgs>(args?: SelectSubset<T, InventoryLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InventoryLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InventoryLogs
     * const inventoryLog = await prisma.inventoryLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InventoryLogUpdateManyArgs>(args: SelectSubset<T, InventoryLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InventoryLogs and returns the data updated in the database.
     * @param {InventoryLogUpdateManyAndReturnArgs} args - Arguments to update many InventoryLogs.
     * @example
     * // Update many InventoryLogs
     * const inventoryLog = await prisma.inventoryLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more InventoryLogs and only return the `id`
     * const inventoryLogWithIdOnly = await prisma.inventoryLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends InventoryLogUpdateManyAndReturnArgs>(args: SelectSubset<T, InventoryLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one InventoryLog.
     * @param {InventoryLogUpsertArgs} args - Arguments to update or create a InventoryLog.
     * @example
     * // Update or create a InventoryLog
     * const inventoryLog = await prisma.inventoryLog.upsert({
     *   create: {
     *     // ... data to create a InventoryLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InventoryLog we want to update
     *   }
     * })
     */
    upsert<T extends InventoryLogUpsertArgs>(args: SelectSubset<T, InventoryLogUpsertArgs<ExtArgs>>): Prisma__InventoryLogClient<$Result.GetResult<Prisma.$InventoryLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of InventoryLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryLogCountArgs} args - Arguments to filter InventoryLogs to count.
     * @example
     * // Count the number of InventoryLogs
     * const count = await prisma.inventoryLog.count({
     *   where: {
     *     // ... the filter for the InventoryLogs we want to count
     *   }
     * })
    **/
    count<T extends InventoryLogCountArgs>(
      args?: Subset<T, InventoryLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InventoryLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InventoryLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InventoryLogAggregateArgs>(args: Subset<T, InventoryLogAggregateArgs>): Prisma.PrismaPromise<GetInventoryLogAggregateType<T>>

    /**
     * Group by InventoryLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InventoryLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InventoryLogGroupByArgs['orderBy'] }
        : { orderBy?: InventoryLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InventoryLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInventoryLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InventoryLog model
   */
  readonly fields: InventoryLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InventoryLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InventoryLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductDefaultArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the InventoryLog model
   */
  interface InventoryLogFieldRefs {
    readonly id: FieldRef<"InventoryLog", 'String'>
    readonly productId: FieldRef<"InventoryLog", 'String'>
    readonly date: FieldRef<"InventoryLog", 'DateTime'>
    readonly type: FieldRef<"InventoryLog", 'String'>
    readonly quantity: FieldRef<"InventoryLog", 'Float'>
    readonly referenceId: FieldRef<"InventoryLog", 'String'>
    readonly description: FieldRef<"InventoryLog", 'String'>
  }
    

  // Custom InputTypes
  /**
   * InventoryLog findUnique
   */
  export type InventoryLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLog
     */
    select?: InventoryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryLog
     */
    omit?: InventoryLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryLogInclude<ExtArgs> | null
    /**
     * Filter, which InventoryLog to fetch.
     */
    where: InventoryLogWhereUniqueInput
  }

  /**
   * InventoryLog findUniqueOrThrow
   */
  export type InventoryLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLog
     */
    select?: InventoryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryLog
     */
    omit?: InventoryLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryLogInclude<ExtArgs> | null
    /**
     * Filter, which InventoryLog to fetch.
     */
    where: InventoryLogWhereUniqueInput
  }

  /**
   * InventoryLog findFirst
   */
  export type InventoryLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLog
     */
    select?: InventoryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryLog
     */
    omit?: InventoryLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryLogInclude<ExtArgs> | null
    /**
     * Filter, which InventoryLog to fetch.
     */
    where?: InventoryLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryLogs to fetch.
     */
    orderBy?: InventoryLogOrderByWithRelationInput | InventoryLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InventoryLogs.
     */
    cursor?: InventoryLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InventoryLogs.
     */
    distinct?: InventoryLogScalarFieldEnum | InventoryLogScalarFieldEnum[]
  }

  /**
   * InventoryLog findFirstOrThrow
   */
  export type InventoryLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLog
     */
    select?: InventoryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryLog
     */
    omit?: InventoryLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryLogInclude<ExtArgs> | null
    /**
     * Filter, which InventoryLog to fetch.
     */
    where?: InventoryLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryLogs to fetch.
     */
    orderBy?: InventoryLogOrderByWithRelationInput | InventoryLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InventoryLogs.
     */
    cursor?: InventoryLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InventoryLogs.
     */
    distinct?: InventoryLogScalarFieldEnum | InventoryLogScalarFieldEnum[]
  }

  /**
   * InventoryLog findMany
   */
  export type InventoryLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLog
     */
    select?: InventoryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryLog
     */
    omit?: InventoryLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryLogInclude<ExtArgs> | null
    /**
     * Filter, which InventoryLogs to fetch.
     */
    where?: InventoryLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryLogs to fetch.
     */
    orderBy?: InventoryLogOrderByWithRelationInput | InventoryLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InventoryLogs.
     */
    cursor?: InventoryLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryLogs.
     */
    skip?: number
    distinct?: InventoryLogScalarFieldEnum | InventoryLogScalarFieldEnum[]
  }

  /**
   * InventoryLog create
   */
  export type InventoryLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLog
     */
    select?: InventoryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryLog
     */
    omit?: InventoryLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryLogInclude<ExtArgs> | null
    /**
     * The data needed to create a InventoryLog.
     */
    data: XOR<InventoryLogCreateInput, InventoryLogUncheckedCreateInput>
  }

  /**
   * InventoryLog createMany
   */
  export type InventoryLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InventoryLogs.
     */
    data: InventoryLogCreateManyInput | InventoryLogCreateManyInput[]
  }

  /**
   * InventoryLog createManyAndReturn
   */
  export type InventoryLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLog
     */
    select?: InventoryLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryLog
     */
    omit?: InventoryLogOmit<ExtArgs> | null
    /**
     * The data used to create many InventoryLogs.
     */
    data: InventoryLogCreateManyInput | InventoryLogCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * InventoryLog update
   */
  export type InventoryLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLog
     */
    select?: InventoryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryLog
     */
    omit?: InventoryLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryLogInclude<ExtArgs> | null
    /**
     * The data needed to update a InventoryLog.
     */
    data: XOR<InventoryLogUpdateInput, InventoryLogUncheckedUpdateInput>
    /**
     * Choose, which InventoryLog to update.
     */
    where: InventoryLogWhereUniqueInput
  }

  /**
   * InventoryLog updateMany
   */
  export type InventoryLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InventoryLogs.
     */
    data: XOR<InventoryLogUpdateManyMutationInput, InventoryLogUncheckedUpdateManyInput>
    /**
     * Filter which InventoryLogs to update
     */
    where?: InventoryLogWhereInput
    /**
     * Limit how many InventoryLogs to update.
     */
    limit?: number
  }

  /**
   * InventoryLog updateManyAndReturn
   */
  export type InventoryLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLog
     */
    select?: InventoryLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryLog
     */
    omit?: InventoryLogOmit<ExtArgs> | null
    /**
     * The data used to update InventoryLogs.
     */
    data: XOR<InventoryLogUpdateManyMutationInput, InventoryLogUncheckedUpdateManyInput>
    /**
     * Filter which InventoryLogs to update
     */
    where?: InventoryLogWhereInput
    /**
     * Limit how many InventoryLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * InventoryLog upsert
   */
  export type InventoryLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLog
     */
    select?: InventoryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryLog
     */
    omit?: InventoryLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryLogInclude<ExtArgs> | null
    /**
     * The filter to search for the InventoryLog to update in case it exists.
     */
    where: InventoryLogWhereUniqueInput
    /**
     * In case the InventoryLog found by the `where` argument doesn't exist, create a new InventoryLog with this data.
     */
    create: XOR<InventoryLogCreateInput, InventoryLogUncheckedCreateInput>
    /**
     * In case the InventoryLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InventoryLogUpdateInput, InventoryLogUncheckedUpdateInput>
  }

  /**
   * InventoryLog delete
   */
  export type InventoryLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLog
     */
    select?: InventoryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryLog
     */
    omit?: InventoryLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryLogInclude<ExtArgs> | null
    /**
     * Filter which InventoryLog to delete.
     */
    where: InventoryLogWhereUniqueInput
  }

  /**
   * InventoryLog deleteMany
   */
  export type InventoryLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InventoryLogs to delete
     */
    where?: InventoryLogWhereInput
    /**
     * Limit how many InventoryLogs to delete.
     */
    limit?: number
  }

  /**
   * InventoryLog without action
   */
  export type InventoryLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLog
     */
    select?: InventoryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryLog
     */
    omit?: InventoryLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryLogInclude<ExtArgs> | null
  }


  /**
   * Model Account
   */

  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  export type AccountMinAggregateOutputType = {
    id: string | null
    code: string | null
    name: string | null
    nameAr: string | null
    type: string | null
    parentId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountMaxAggregateOutputType = {
    id: string | null
    code: string | null
    name: string | null
    nameAr: string | null
    type: string | null
    parentId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountCountAggregateOutputType = {
    id: number
    code: number
    name: number
    nameAr: number
    type: number
    parentId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AccountMinAggregateInputType = {
    id?: true
    code?: true
    name?: true
    nameAr?: true
    type?: true
    parentId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountMaxAggregateInputType = {
    id?: true
    code?: true
    name?: true
    nameAr?: true
    type?: true
    parentId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountCountAggregateInputType = {
    id?: true
    code?: true
    name?: true
    nameAr?: true
    type?: true
    parentId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Account to aggregate.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Accounts
    **/
    _count?: true | AccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountMaxAggregateInputType
  }

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
        [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>
  }




  export type AccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithAggregationInput | AccountOrderByWithAggregationInput[]
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum
    having?: AccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountCountAggregateInputType | true
    _min?: AccountMinAggregateInputType
    _max?: AccountMaxAggregateInputType
  }

  export type AccountGroupByOutputType = {
    id: string
    code: string
    name: string
    nameAr: string | null
    type: string
    parentId: string | null
    createdAt: Date
    updatedAt: Date
    _count: AccountCountAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountGroupByOutputType[P]>
            : GetScalarType<T[P], AccountGroupByOutputType[P]>
        }
      >
    >


  export type AccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    nameAr?: boolean
    type?: boolean
    parentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    parent?: boolean | Account$parentArgs<ExtArgs>
    children?: boolean | Account$childrenArgs<ExtArgs>
    entries?: boolean | Account$entriesArgs<ExtArgs>
    _count?: boolean | AccountCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    nameAr?: boolean
    type?: boolean
    parentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    parent?: boolean | Account$parentArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    nameAr?: boolean
    type?: boolean
    parentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    parent?: boolean | Account$parentArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectScalar = {
    id?: boolean
    code?: boolean
    name?: boolean
    nameAr?: boolean
    type?: boolean
    parentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "code" | "name" | "nameAr" | "type" | "parentId" | "createdAt" | "updatedAt", ExtArgs["result"]["account"]>
  export type AccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parent?: boolean | Account$parentArgs<ExtArgs>
    children?: boolean | Account$childrenArgs<ExtArgs>
    entries?: boolean | Account$entriesArgs<ExtArgs>
    _count?: boolean | AccountCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parent?: boolean | Account$parentArgs<ExtArgs>
  }
  export type AccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parent?: boolean | Account$parentArgs<ExtArgs>
  }

  export type $AccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Account"
    objects: {
      parent: Prisma.$AccountPayload<ExtArgs> | null
      children: Prisma.$AccountPayload<ExtArgs>[]
      entries: Prisma.$JournalEntryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      code: string
      name: string
      nameAr: string | null
      type: string
      parentId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["account"]>
    composites: {}
  }

  type AccountGetPayload<S extends boolean | null | undefined | AccountDefaultArgs> = $Result.GetResult<Prisma.$AccountPayload, S>

  type AccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccountCountAggregateInputType | true
    }

  export interface AccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Account'], meta: { name: 'Account' } }
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountFindUniqueArgs>(args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Account that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(args: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountFindFirstArgs>(args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccountFindManyArgs>(args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     * 
     */
    create<T extends AccountCreateArgs>(args: SelectSubset<T, AccountCreateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Accounts.
     * @param {AccountCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccountCreateManyArgs>(args?: SelectSubset<T, AccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Accounts and returns the data saved in the database.
     * @param {AccountCreateManyAndReturnArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccountCreateManyAndReturnArgs>(args?: SelectSubset<T, AccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     * 
     */
    delete<T extends AccountDeleteArgs>(args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccountUpdateArgs>(args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccountDeleteManyArgs>(args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccountUpdateManyArgs>(args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts and returns the data updated in the database.
     * @param {AccountUpdateManyAndReturnArgs} args - Arguments to update many Accounts.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AccountUpdateManyAndReturnArgs>(args: SelectSubset<T, AccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
     */
    upsert<T extends AccountUpsertArgs>(args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccountAggregateArgs>(args: Subset<T, AccountAggregateArgs>): Prisma.PrismaPromise<GetAccountAggregateType<T>>

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs['orderBy'] }
        : { orderBy?: AccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Account model
   */
  readonly fields: AccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    parent<T extends Account$parentArgs<ExtArgs> = {}>(args?: Subset<T, Account$parentArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    children<T extends Account$childrenArgs<ExtArgs> = {}>(args?: Subset<T, Account$childrenArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    entries<T extends Account$entriesArgs<ExtArgs> = {}>(args?: Subset<T, Account$entriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Account model
   */
  interface AccountFieldRefs {
    readonly id: FieldRef<"Account", 'String'>
    readonly code: FieldRef<"Account", 'String'>
    readonly name: FieldRef<"Account", 'String'>
    readonly nameAr: FieldRef<"Account", 'String'>
    readonly type: FieldRef<"Account", 'String'>
    readonly parentId: FieldRef<"Account", 'String'>
    readonly createdAt: FieldRef<"Account", 'DateTime'>
    readonly updatedAt: FieldRef<"Account", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Account findUnique
   */
  export type AccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findFirst
   */
  export type AccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findMany
   */
  export type AccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Accounts to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account create
   */
  export type AccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to create a Account.
     */
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>
  }

  /**
   * Account createMany
   */
  export type AccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
  }

  /**
   * Account createManyAndReturn
   */
  export type AccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account update
   */
  export type AccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to update a Account.
     */
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
    /**
     * Choose, which Account to update.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
  }

  /**
   * Account updateManyAndReturn
   */
  export type AccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account upsert
   */
  export type AccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The filter to search for the Account to update in case it exists.
     */
    where: AccountWhereUniqueInput
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     */
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
  }

  /**
   * Account delete
   */
  export type AccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter which Account to delete.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Accounts to delete
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to delete.
     */
    limit?: number
  }

  /**
   * Account.parent
   */
  export type Account$parentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    where?: AccountWhereInput
  }

  /**
   * Account.children
   */
  export type Account$childrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    cursor?: AccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account.entries
   */
  export type Account$entriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalEntry
     */
    select?: JournalEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the JournalEntry
     */
    omit?: JournalEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalEntryInclude<ExtArgs> | null
    where?: JournalEntryWhereInput
    orderBy?: JournalEntryOrderByWithRelationInput | JournalEntryOrderByWithRelationInput[]
    cursor?: JournalEntryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: JournalEntryScalarFieldEnum | JournalEntryScalarFieldEnum[]
  }

  /**
   * Account without action
   */
  export type AccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
  }


  /**
   * Model JournalVoucher
   */

  export type AggregateJournalVoucher = {
    _count: JournalVoucherCountAggregateOutputType | null
    _min: JournalVoucherMinAggregateOutputType | null
    _max: JournalVoucherMaxAggregateOutputType | null
  }

  export type JournalVoucherMinAggregateOutputType = {
    id: string | null
    reference: string | null
    date: Date | null
    description: string | null
    status: string | null
    createdAt: Date | null
  }

  export type JournalVoucherMaxAggregateOutputType = {
    id: string | null
    reference: string | null
    date: Date | null
    description: string | null
    status: string | null
    createdAt: Date | null
  }

  export type JournalVoucherCountAggregateOutputType = {
    id: number
    reference: number
    date: number
    description: number
    status: number
    createdAt: number
    _all: number
  }


  export type JournalVoucherMinAggregateInputType = {
    id?: true
    reference?: true
    date?: true
    description?: true
    status?: true
    createdAt?: true
  }

  export type JournalVoucherMaxAggregateInputType = {
    id?: true
    reference?: true
    date?: true
    description?: true
    status?: true
    createdAt?: true
  }

  export type JournalVoucherCountAggregateInputType = {
    id?: true
    reference?: true
    date?: true
    description?: true
    status?: true
    createdAt?: true
    _all?: true
  }

  export type JournalVoucherAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which JournalVoucher to aggregate.
     */
    where?: JournalVoucherWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JournalVouchers to fetch.
     */
    orderBy?: JournalVoucherOrderByWithRelationInput | JournalVoucherOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: JournalVoucherWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JournalVouchers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JournalVouchers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned JournalVouchers
    **/
    _count?: true | JournalVoucherCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: JournalVoucherMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: JournalVoucherMaxAggregateInputType
  }

  export type GetJournalVoucherAggregateType<T extends JournalVoucherAggregateArgs> = {
        [P in keyof T & keyof AggregateJournalVoucher]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateJournalVoucher[P]>
      : GetScalarType<T[P], AggregateJournalVoucher[P]>
  }




  export type JournalVoucherGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JournalVoucherWhereInput
    orderBy?: JournalVoucherOrderByWithAggregationInput | JournalVoucherOrderByWithAggregationInput[]
    by: JournalVoucherScalarFieldEnum[] | JournalVoucherScalarFieldEnum
    having?: JournalVoucherScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: JournalVoucherCountAggregateInputType | true
    _min?: JournalVoucherMinAggregateInputType
    _max?: JournalVoucherMaxAggregateInputType
  }

  export type JournalVoucherGroupByOutputType = {
    id: string
    reference: string
    date: Date
    description: string
    status: string
    createdAt: Date
    _count: JournalVoucherCountAggregateOutputType | null
    _min: JournalVoucherMinAggregateOutputType | null
    _max: JournalVoucherMaxAggregateOutputType | null
  }

  type GetJournalVoucherGroupByPayload<T extends JournalVoucherGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<JournalVoucherGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof JournalVoucherGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], JournalVoucherGroupByOutputType[P]>
            : GetScalarType<T[P], JournalVoucherGroupByOutputType[P]>
        }
      >
    >


  export type JournalVoucherSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reference?: boolean
    date?: boolean
    description?: boolean
    status?: boolean
    createdAt?: boolean
    entries?: boolean | JournalVoucher$entriesArgs<ExtArgs>
    invoices?: boolean | JournalVoucher$invoicesArgs<ExtArgs>
    purchaseInvoices?: boolean | JournalVoucher$purchaseInvoicesArgs<ExtArgs>
    _count?: boolean | JournalVoucherCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["journalVoucher"]>

  export type JournalVoucherSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reference?: boolean
    date?: boolean
    description?: boolean
    status?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["journalVoucher"]>

  export type JournalVoucherSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reference?: boolean
    date?: boolean
    description?: boolean
    status?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["journalVoucher"]>

  export type JournalVoucherSelectScalar = {
    id?: boolean
    reference?: boolean
    date?: boolean
    description?: boolean
    status?: boolean
    createdAt?: boolean
  }

  export type JournalVoucherOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "reference" | "date" | "description" | "status" | "createdAt", ExtArgs["result"]["journalVoucher"]>
  export type JournalVoucherInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    entries?: boolean | JournalVoucher$entriesArgs<ExtArgs>
    invoices?: boolean | JournalVoucher$invoicesArgs<ExtArgs>
    purchaseInvoices?: boolean | JournalVoucher$purchaseInvoicesArgs<ExtArgs>
    _count?: boolean | JournalVoucherCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type JournalVoucherIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type JournalVoucherIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $JournalVoucherPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "JournalVoucher"
    objects: {
      entries: Prisma.$JournalEntryPayload<ExtArgs>[]
      invoices: Prisma.$SalesInvoicePayload<ExtArgs>[]
      purchaseInvoices: Prisma.$PurchaseInvoicePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      reference: string
      date: Date
      description: string
      status: string
      createdAt: Date
    }, ExtArgs["result"]["journalVoucher"]>
    composites: {}
  }

  type JournalVoucherGetPayload<S extends boolean | null | undefined | JournalVoucherDefaultArgs> = $Result.GetResult<Prisma.$JournalVoucherPayload, S>

  type JournalVoucherCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<JournalVoucherFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: JournalVoucherCountAggregateInputType | true
    }

  export interface JournalVoucherDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['JournalVoucher'], meta: { name: 'JournalVoucher' } }
    /**
     * Find zero or one JournalVoucher that matches the filter.
     * @param {JournalVoucherFindUniqueArgs} args - Arguments to find a JournalVoucher
     * @example
     * // Get one JournalVoucher
     * const journalVoucher = await prisma.journalVoucher.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends JournalVoucherFindUniqueArgs>(args: SelectSubset<T, JournalVoucherFindUniqueArgs<ExtArgs>>): Prisma__JournalVoucherClient<$Result.GetResult<Prisma.$JournalVoucherPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one JournalVoucher that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {JournalVoucherFindUniqueOrThrowArgs} args - Arguments to find a JournalVoucher
     * @example
     * // Get one JournalVoucher
     * const journalVoucher = await prisma.journalVoucher.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends JournalVoucherFindUniqueOrThrowArgs>(args: SelectSubset<T, JournalVoucherFindUniqueOrThrowArgs<ExtArgs>>): Prisma__JournalVoucherClient<$Result.GetResult<Prisma.$JournalVoucherPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first JournalVoucher that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JournalVoucherFindFirstArgs} args - Arguments to find a JournalVoucher
     * @example
     * // Get one JournalVoucher
     * const journalVoucher = await prisma.journalVoucher.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends JournalVoucherFindFirstArgs>(args?: SelectSubset<T, JournalVoucherFindFirstArgs<ExtArgs>>): Prisma__JournalVoucherClient<$Result.GetResult<Prisma.$JournalVoucherPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first JournalVoucher that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JournalVoucherFindFirstOrThrowArgs} args - Arguments to find a JournalVoucher
     * @example
     * // Get one JournalVoucher
     * const journalVoucher = await prisma.journalVoucher.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends JournalVoucherFindFirstOrThrowArgs>(args?: SelectSubset<T, JournalVoucherFindFirstOrThrowArgs<ExtArgs>>): Prisma__JournalVoucherClient<$Result.GetResult<Prisma.$JournalVoucherPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more JournalVouchers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JournalVoucherFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all JournalVouchers
     * const journalVouchers = await prisma.journalVoucher.findMany()
     * 
     * // Get first 10 JournalVouchers
     * const journalVouchers = await prisma.journalVoucher.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const journalVoucherWithIdOnly = await prisma.journalVoucher.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends JournalVoucherFindManyArgs>(args?: SelectSubset<T, JournalVoucherFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JournalVoucherPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a JournalVoucher.
     * @param {JournalVoucherCreateArgs} args - Arguments to create a JournalVoucher.
     * @example
     * // Create one JournalVoucher
     * const JournalVoucher = await prisma.journalVoucher.create({
     *   data: {
     *     // ... data to create a JournalVoucher
     *   }
     * })
     * 
     */
    create<T extends JournalVoucherCreateArgs>(args: SelectSubset<T, JournalVoucherCreateArgs<ExtArgs>>): Prisma__JournalVoucherClient<$Result.GetResult<Prisma.$JournalVoucherPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many JournalVouchers.
     * @param {JournalVoucherCreateManyArgs} args - Arguments to create many JournalVouchers.
     * @example
     * // Create many JournalVouchers
     * const journalVoucher = await prisma.journalVoucher.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends JournalVoucherCreateManyArgs>(args?: SelectSubset<T, JournalVoucherCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many JournalVouchers and returns the data saved in the database.
     * @param {JournalVoucherCreateManyAndReturnArgs} args - Arguments to create many JournalVouchers.
     * @example
     * // Create many JournalVouchers
     * const journalVoucher = await prisma.journalVoucher.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many JournalVouchers and only return the `id`
     * const journalVoucherWithIdOnly = await prisma.journalVoucher.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends JournalVoucherCreateManyAndReturnArgs>(args?: SelectSubset<T, JournalVoucherCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JournalVoucherPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a JournalVoucher.
     * @param {JournalVoucherDeleteArgs} args - Arguments to delete one JournalVoucher.
     * @example
     * // Delete one JournalVoucher
     * const JournalVoucher = await prisma.journalVoucher.delete({
     *   where: {
     *     // ... filter to delete one JournalVoucher
     *   }
     * })
     * 
     */
    delete<T extends JournalVoucherDeleteArgs>(args: SelectSubset<T, JournalVoucherDeleteArgs<ExtArgs>>): Prisma__JournalVoucherClient<$Result.GetResult<Prisma.$JournalVoucherPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one JournalVoucher.
     * @param {JournalVoucherUpdateArgs} args - Arguments to update one JournalVoucher.
     * @example
     * // Update one JournalVoucher
     * const journalVoucher = await prisma.journalVoucher.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends JournalVoucherUpdateArgs>(args: SelectSubset<T, JournalVoucherUpdateArgs<ExtArgs>>): Prisma__JournalVoucherClient<$Result.GetResult<Prisma.$JournalVoucherPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more JournalVouchers.
     * @param {JournalVoucherDeleteManyArgs} args - Arguments to filter JournalVouchers to delete.
     * @example
     * // Delete a few JournalVouchers
     * const { count } = await prisma.journalVoucher.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends JournalVoucherDeleteManyArgs>(args?: SelectSubset<T, JournalVoucherDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more JournalVouchers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JournalVoucherUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many JournalVouchers
     * const journalVoucher = await prisma.journalVoucher.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends JournalVoucherUpdateManyArgs>(args: SelectSubset<T, JournalVoucherUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more JournalVouchers and returns the data updated in the database.
     * @param {JournalVoucherUpdateManyAndReturnArgs} args - Arguments to update many JournalVouchers.
     * @example
     * // Update many JournalVouchers
     * const journalVoucher = await prisma.journalVoucher.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more JournalVouchers and only return the `id`
     * const journalVoucherWithIdOnly = await prisma.journalVoucher.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends JournalVoucherUpdateManyAndReturnArgs>(args: SelectSubset<T, JournalVoucherUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JournalVoucherPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one JournalVoucher.
     * @param {JournalVoucherUpsertArgs} args - Arguments to update or create a JournalVoucher.
     * @example
     * // Update or create a JournalVoucher
     * const journalVoucher = await prisma.journalVoucher.upsert({
     *   create: {
     *     // ... data to create a JournalVoucher
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the JournalVoucher we want to update
     *   }
     * })
     */
    upsert<T extends JournalVoucherUpsertArgs>(args: SelectSubset<T, JournalVoucherUpsertArgs<ExtArgs>>): Prisma__JournalVoucherClient<$Result.GetResult<Prisma.$JournalVoucherPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of JournalVouchers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JournalVoucherCountArgs} args - Arguments to filter JournalVouchers to count.
     * @example
     * // Count the number of JournalVouchers
     * const count = await prisma.journalVoucher.count({
     *   where: {
     *     // ... the filter for the JournalVouchers we want to count
     *   }
     * })
    **/
    count<T extends JournalVoucherCountArgs>(
      args?: Subset<T, JournalVoucherCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], JournalVoucherCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a JournalVoucher.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JournalVoucherAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends JournalVoucherAggregateArgs>(args: Subset<T, JournalVoucherAggregateArgs>): Prisma.PrismaPromise<GetJournalVoucherAggregateType<T>>

    /**
     * Group by JournalVoucher.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JournalVoucherGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends JournalVoucherGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: JournalVoucherGroupByArgs['orderBy'] }
        : { orderBy?: JournalVoucherGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, JournalVoucherGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetJournalVoucherGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the JournalVoucher model
   */
  readonly fields: JournalVoucherFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for JournalVoucher.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__JournalVoucherClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    entries<T extends JournalVoucher$entriesArgs<ExtArgs> = {}>(args?: Subset<T, JournalVoucher$entriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    invoices<T extends JournalVoucher$invoicesArgs<ExtArgs> = {}>(args?: Subset<T, JournalVoucher$invoicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalesInvoicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    purchaseInvoices<T extends JournalVoucher$purchaseInvoicesArgs<ExtArgs> = {}>(args?: Subset<T, JournalVoucher$purchaseInvoicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchaseInvoicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the JournalVoucher model
   */
  interface JournalVoucherFieldRefs {
    readonly id: FieldRef<"JournalVoucher", 'String'>
    readonly reference: FieldRef<"JournalVoucher", 'String'>
    readonly date: FieldRef<"JournalVoucher", 'DateTime'>
    readonly description: FieldRef<"JournalVoucher", 'String'>
    readonly status: FieldRef<"JournalVoucher", 'String'>
    readonly createdAt: FieldRef<"JournalVoucher", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * JournalVoucher findUnique
   */
  export type JournalVoucherFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalVoucher
     */
    select?: JournalVoucherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JournalVoucher
     */
    omit?: JournalVoucherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalVoucherInclude<ExtArgs> | null
    /**
     * Filter, which JournalVoucher to fetch.
     */
    where: JournalVoucherWhereUniqueInput
  }

  /**
   * JournalVoucher findUniqueOrThrow
   */
  export type JournalVoucherFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalVoucher
     */
    select?: JournalVoucherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JournalVoucher
     */
    omit?: JournalVoucherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalVoucherInclude<ExtArgs> | null
    /**
     * Filter, which JournalVoucher to fetch.
     */
    where: JournalVoucherWhereUniqueInput
  }

  /**
   * JournalVoucher findFirst
   */
  export type JournalVoucherFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalVoucher
     */
    select?: JournalVoucherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JournalVoucher
     */
    omit?: JournalVoucherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalVoucherInclude<ExtArgs> | null
    /**
     * Filter, which JournalVoucher to fetch.
     */
    where?: JournalVoucherWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JournalVouchers to fetch.
     */
    orderBy?: JournalVoucherOrderByWithRelationInput | JournalVoucherOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for JournalVouchers.
     */
    cursor?: JournalVoucherWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JournalVouchers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JournalVouchers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of JournalVouchers.
     */
    distinct?: JournalVoucherScalarFieldEnum | JournalVoucherScalarFieldEnum[]
  }

  /**
   * JournalVoucher findFirstOrThrow
   */
  export type JournalVoucherFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalVoucher
     */
    select?: JournalVoucherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JournalVoucher
     */
    omit?: JournalVoucherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalVoucherInclude<ExtArgs> | null
    /**
     * Filter, which JournalVoucher to fetch.
     */
    where?: JournalVoucherWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JournalVouchers to fetch.
     */
    orderBy?: JournalVoucherOrderByWithRelationInput | JournalVoucherOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for JournalVouchers.
     */
    cursor?: JournalVoucherWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JournalVouchers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JournalVouchers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of JournalVouchers.
     */
    distinct?: JournalVoucherScalarFieldEnum | JournalVoucherScalarFieldEnum[]
  }

  /**
   * JournalVoucher findMany
   */
  export type JournalVoucherFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalVoucher
     */
    select?: JournalVoucherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JournalVoucher
     */
    omit?: JournalVoucherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalVoucherInclude<ExtArgs> | null
    /**
     * Filter, which JournalVouchers to fetch.
     */
    where?: JournalVoucherWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JournalVouchers to fetch.
     */
    orderBy?: JournalVoucherOrderByWithRelationInput | JournalVoucherOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing JournalVouchers.
     */
    cursor?: JournalVoucherWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JournalVouchers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JournalVouchers.
     */
    skip?: number
    distinct?: JournalVoucherScalarFieldEnum | JournalVoucherScalarFieldEnum[]
  }

  /**
   * JournalVoucher create
   */
  export type JournalVoucherCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalVoucher
     */
    select?: JournalVoucherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JournalVoucher
     */
    omit?: JournalVoucherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalVoucherInclude<ExtArgs> | null
    /**
     * The data needed to create a JournalVoucher.
     */
    data: XOR<JournalVoucherCreateInput, JournalVoucherUncheckedCreateInput>
  }

  /**
   * JournalVoucher createMany
   */
  export type JournalVoucherCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many JournalVouchers.
     */
    data: JournalVoucherCreateManyInput | JournalVoucherCreateManyInput[]
  }

  /**
   * JournalVoucher createManyAndReturn
   */
  export type JournalVoucherCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalVoucher
     */
    select?: JournalVoucherSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the JournalVoucher
     */
    omit?: JournalVoucherOmit<ExtArgs> | null
    /**
     * The data used to create many JournalVouchers.
     */
    data: JournalVoucherCreateManyInput | JournalVoucherCreateManyInput[]
  }

  /**
   * JournalVoucher update
   */
  export type JournalVoucherUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalVoucher
     */
    select?: JournalVoucherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JournalVoucher
     */
    omit?: JournalVoucherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalVoucherInclude<ExtArgs> | null
    /**
     * The data needed to update a JournalVoucher.
     */
    data: XOR<JournalVoucherUpdateInput, JournalVoucherUncheckedUpdateInput>
    /**
     * Choose, which JournalVoucher to update.
     */
    where: JournalVoucherWhereUniqueInput
  }

  /**
   * JournalVoucher updateMany
   */
  export type JournalVoucherUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update JournalVouchers.
     */
    data: XOR<JournalVoucherUpdateManyMutationInput, JournalVoucherUncheckedUpdateManyInput>
    /**
     * Filter which JournalVouchers to update
     */
    where?: JournalVoucherWhereInput
    /**
     * Limit how many JournalVouchers to update.
     */
    limit?: number
  }

  /**
   * JournalVoucher updateManyAndReturn
   */
  export type JournalVoucherUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalVoucher
     */
    select?: JournalVoucherSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the JournalVoucher
     */
    omit?: JournalVoucherOmit<ExtArgs> | null
    /**
     * The data used to update JournalVouchers.
     */
    data: XOR<JournalVoucherUpdateManyMutationInput, JournalVoucherUncheckedUpdateManyInput>
    /**
     * Filter which JournalVouchers to update
     */
    where?: JournalVoucherWhereInput
    /**
     * Limit how many JournalVouchers to update.
     */
    limit?: number
  }

  /**
   * JournalVoucher upsert
   */
  export type JournalVoucherUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalVoucher
     */
    select?: JournalVoucherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JournalVoucher
     */
    omit?: JournalVoucherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalVoucherInclude<ExtArgs> | null
    /**
     * The filter to search for the JournalVoucher to update in case it exists.
     */
    where: JournalVoucherWhereUniqueInput
    /**
     * In case the JournalVoucher found by the `where` argument doesn't exist, create a new JournalVoucher with this data.
     */
    create: XOR<JournalVoucherCreateInput, JournalVoucherUncheckedCreateInput>
    /**
     * In case the JournalVoucher was found with the provided `where` argument, update it with this data.
     */
    update: XOR<JournalVoucherUpdateInput, JournalVoucherUncheckedUpdateInput>
  }

  /**
   * JournalVoucher delete
   */
  export type JournalVoucherDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalVoucher
     */
    select?: JournalVoucherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JournalVoucher
     */
    omit?: JournalVoucherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalVoucherInclude<ExtArgs> | null
    /**
     * Filter which JournalVoucher to delete.
     */
    where: JournalVoucherWhereUniqueInput
  }

  /**
   * JournalVoucher deleteMany
   */
  export type JournalVoucherDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which JournalVouchers to delete
     */
    where?: JournalVoucherWhereInput
    /**
     * Limit how many JournalVouchers to delete.
     */
    limit?: number
  }

  /**
   * JournalVoucher.entries
   */
  export type JournalVoucher$entriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalEntry
     */
    select?: JournalEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the JournalEntry
     */
    omit?: JournalEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalEntryInclude<ExtArgs> | null
    where?: JournalEntryWhereInput
    orderBy?: JournalEntryOrderByWithRelationInput | JournalEntryOrderByWithRelationInput[]
    cursor?: JournalEntryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: JournalEntryScalarFieldEnum | JournalEntryScalarFieldEnum[]
  }

  /**
   * JournalVoucher.invoices
   */
  export type JournalVoucher$invoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesInvoice
     */
    select?: SalesInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesInvoice
     */
    omit?: SalesInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesInvoiceInclude<ExtArgs> | null
    where?: SalesInvoiceWhereInput
    orderBy?: SalesInvoiceOrderByWithRelationInput | SalesInvoiceOrderByWithRelationInput[]
    cursor?: SalesInvoiceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SalesInvoiceScalarFieldEnum | SalesInvoiceScalarFieldEnum[]
  }

  /**
   * JournalVoucher.purchaseInvoices
   */
  export type JournalVoucher$purchaseInvoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseInvoice
     */
    select?: PurchaseInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseInvoice
     */
    omit?: PurchaseInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInvoiceInclude<ExtArgs> | null
    where?: PurchaseInvoiceWhereInput
    orderBy?: PurchaseInvoiceOrderByWithRelationInput | PurchaseInvoiceOrderByWithRelationInput[]
    cursor?: PurchaseInvoiceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PurchaseInvoiceScalarFieldEnum | PurchaseInvoiceScalarFieldEnum[]
  }

  /**
   * JournalVoucher without action
   */
  export type JournalVoucherDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalVoucher
     */
    select?: JournalVoucherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JournalVoucher
     */
    omit?: JournalVoucherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalVoucherInclude<ExtArgs> | null
  }


  /**
   * Model JournalEntry
   */

  export type AggregateJournalEntry = {
    _count: JournalEntryCountAggregateOutputType | null
    _avg: JournalEntryAvgAggregateOutputType | null
    _sum: JournalEntrySumAggregateOutputType | null
    _min: JournalEntryMinAggregateOutputType | null
    _max: JournalEntryMaxAggregateOutputType | null
  }

  export type JournalEntryAvgAggregateOutputType = {
    debit: number | null
    credit: number | null
  }

  export type JournalEntrySumAggregateOutputType = {
    debit: number | null
    credit: number | null
  }

  export type JournalEntryMinAggregateOutputType = {
    id: string | null
    date: Date | null
    description: string | null
    accountId: string | null
    debit: number | null
    credit: number | null
    reference: string | null
    journalVoucherId: string | null
    createdAt: Date | null
  }

  export type JournalEntryMaxAggregateOutputType = {
    id: string | null
    date: Date | null
    description: string | null
    accountId: string | null
    debit: number | null
    credit: number | null
    reference: string | null
    journalVoucherId: string | null
    createdAt: Date | null
  }

  export type JournalEntryCountAggregateOutputType = {
    id: number
    date: number
    description: number
    accountId: number
    debit: number
    credit: number
    reference: number
    journalVoucherId: number
    createdAt: number
    _all: number
  }


  export type JournalEntryAvgAggregateInputType = {
    debit?: true
    credit?: true
  }

  export type JournalEntrySumAggregateInputType = {
    debit?: true
    credit?: true
  }

  export type JournalEntryMinAggregateInputType = {
    id?: true
    date?: true
    description?: true
    accountId?: true
    debit?: true
    credit?: true
    reference?: true
    journalVoucherId?: true
    createdAt?: true
  }

  export type JournalEntryMaxAggregateInputType = {
    id?: true
    date?: true
    description?: true
    accountId?: true
    debit?: true
    credit?: true
    reference?: true
    journalVoucherId?: true
    createdAt?: true
  }

  export type JournalEntryCountAggregateInputType = {
    id?: true
    date?: true
    description?: true
    accountId?: true
    debit?: true
    credit?: true
    reference?: true
    journalVoucherId?: true
    createdAt?: true
    _all?: true
  }

  export type JournalEntryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which JournalEntry to aggregate.
     */
    where?: JournalEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JournalEntries to fetch.
     */
    orderBy?: JournalEntryOrderByWithRelationInput | JournalEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: JournalEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JournalEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JournalEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned JournalEntries
    **/
    _count?: true | JournalEntryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: JournalEntryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: JournalEntrySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: JournalEntryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: JournalEntryMaxAggregateInputType
  }

  export type GetJournalEntryAggregateType<T extends JournalEntryAggregateArgs> = {
        [P in keyof T & keyof AggregateJournalEntry]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateJournalEntry[P]>
      : GetScalarType<T[P], AggregateJournalEntry[P]>
  }




  export type JournalEntryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JournalEntryWhereInput
    orderBy?: JournalEntryOrderByWithAggregationInput | JournalEntryOrderByWithAggregationInput[]
    by: JournalEntryScalarFieldEnum[] | JournalEntryScalarFieldEnum
    having?: JournalEntryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: JournalEntryCountAggregateInputType | true
    _avg?: JournalEntryAvgAggregateInputType
    _sum?: JournalEntrySumAggregateInputType
    _min?: JournalEntryMinAggregateInputType
    _max?: JournalEntryMaxAggregateInputType
  }

  export type JournalEntryGroupByOutputType = {
    id: string
    date: Date
    description: string
    accountId: string
    debit: number
    credit: number
    reference: string | null
    journalVoucherId: string | null
    createdAt: Date
    _count: JournalEntryCountAggregateOutputType | null
    _avg: JournalEntryAvgAggregateOutputType | null
    _sum: JournalEntrySumAggregateOutputType | null
    _min: JournalEntryMinAggregateOutputType | null
    _max: JournalEntryMaxAggregateOutputType | null
  }

  type GetJournalEntryGroupByPayload<T extends JournalEntryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<JournalEntryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof JournalEntryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], JournalEntryGroupByOutputType[P]>
            : GetScalarType<T[P], JournalEntryGroupByOutputType[P]>
        }
      >
    >


  export type JournalEntrySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    description?: boolean
    accountId?: boolean
    debit?: boolean
    credit?: boolean
    reference?: boolean
    journalVoucherId?: boolean
    createdAt?: boolean
    account?: boolean | AccountDefaultArgs<ExtArgs>
    journalVoucher?: boolean | JournalEntry$journalVoucherArgs<ExtArgs>
  }, ExtArgs["result"]["journalEntry"]>

  export type JournalEntrySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    description?: boolean
    accountId?: boolean
    debit?: boolean
    credit?: boolean
    reference?: boolean
    journalVoucherId?: boolean
    createdAt?: boolean
    account?: boolean | AccountDefaultArgs<ExtArgs>
    journalVoucher?: boolean | JournalEntry$journalVoucherArgs<ExtArgs>
  }, ExtArgs["result"]["journalEntry"]>

  export type JournalEntrySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    description?: boolean
    accountId?: boolean
    debit?: boolean
    credit?: boolean
    reference?: boolean
    journalVoucherId?: boolean
    createdAt?: boolean
    account?: boolean | AccountDefaultArgs<ExtArgs>
    journalVoucher?: boolean | JournalEntry$journalVoucherArgs<ExtArgs>
  }, ExtArgs["result"]["journalEntry"]>

  export type JournalEntrySelectScalar = {
    id?: boolean
    date?: boolean
    description?: boolean
    accountId?: boolean
    debit?: boolean
    credit?: boolean
    reference?: boolean
    journalVoucherId?: boolean
    createdAt?: boolean
  }

  export type JournalEntryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "date" | "description" | "accountId" | "debit" | "credit" | "reference" | "journalVoucherId" | "createdAt", ExtArgs["result"]["journalEntry"]>
  export type JournalEntryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | AccountDefaultArgs<ExtArgs>
    journalVoucher?: boolean | JournalEntry$journalVoucherArgs<ExtArgs>
  }
  export type JournalEntryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | AccountDefaultArgs<ExtArgs>
    journalVoucher?: boolean | JournalEntry$journalVoucherArgs<ExtArgs>
  }
  export type JournalEntryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | AccountDefaultArgs<ExtArgs>
    journalVoucher?: boolean | JournalEntry$journalVoucherArgs<ExtArgs>
  }

  export type $JournalEntryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "JournalEntry"
    objects: {
      account: Prisma.$AccountPayload<ExtArgs>
      journalVoucher: Prisma.$JournalVoucherPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      date: Date
      description: string
      accountId: string
      debit: number
      credit: number
      reference: string | null
      journalVoucherId: string | null
      createdAt: Date
    }, ExtArgs["result"]["journalEntry"]>
    composites: {}
  }

  type JournalEntryGetPayload<S extends boolean | null | undefined | JournalEntryDefaultArgs> = $Result.GetResult<Prisma.$JournalEntryPayload, S>

  type JournalEntryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<JournalEntryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: JournalEntryCountAggregateInputType | true
    }

  export interface JournalEntryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['JournalEntry'], meta: { name: 'JournalEntry' } }
    /**
     * Find zero or one JournalEntry that matches the filter.
     * @param {JournalEntryFindUniqueArgs} args - Arguments to find a JournalEntry
     * @example
     * // Get one JournalEntry
     * const journalEntry = await prisma.journalEntry.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends JournalEntryFindUniqueArgs>(args: SelectSubset<T, JournalEntryFindUniqueArgs<ExtArgs>>): Prisma__JournalEntryClient<$Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one JournalEntry that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {JournalEntryFindUniqueOrThrowArgs} args - Arguments to find a JournalEntry
     * @example
     * // Get one JournalEntry
     * const journalEntry = await prisma.journalEntry.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends JournalEntryFindUniqueOrThrowArgs>(args: SelectSubset<T, JournalEntryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__JournalEntryClient<$Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first JournalEntry that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JournalEntryFindFirstArgs} args - Arguments to find a JournalEntry
     * @example
     * // Get one JournalEntry
     * const journalEntry = await prisma.journalEntry.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends JournalEntryFindFirstArgs>(args?: SelectSubset<T, JournalEntryFindFirstArgs<ExtArgs>>): Prisma__JournalEntryClient<$Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first JournalEntry that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JournalEntryFindFirstOrThrowArgs} args - Arguments to find a JournalEntry
     * @example
     * // Get one JournalEntry
     * const journalEntry = await prisma.journalEntry.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends JournalEntryFindFirstOrThrowArgs>(args?: SelectSubset<T, JournalEntryFindFirstOrThrowArgs<ExtArgs>>): Prisma__JournalEntryClient<$Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more JournalEntries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JournalEntryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all JournalEntries
     * const journalEntries = await prisma.journalEntry.findMany()
     * 
     * // Get first 10 JournalEntries
     * const journalEntries = await prisma.journalEntry.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const journalEntryWithIdOnly = await prisma.journalEntry.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends JournalEntryFindManyArgs>(args?: SelectSubset<T, JournalEntryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a JournalEntry.
     * @param {JournalEntryCreateArgs} args - Arguments to create a JournalEntry.
     * @example
     * // Create one JournalEntry
     * const JournalEntry = await prisma.journalEntry.create({
     *   data: {
     *     // ... data to create a JournalEntry
     *   }
     * })
     * 
     */
    create<T extends JournalEntryCreateArgs>(args: SelectSubset<T, JournalEntryCreateArgs<ExtArgs>>): Prisma__JournalEntryClient<$Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many JournalEntries.
     * @param {JournalEntryCreateManyArgs} args - Arguments to create many JournalEntries.
     * @example
     * // Create many JournalEntries
     * const journalEntry = await prisma.journalEntry.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends JournalEntryCreateManyArgs>(args?: SelectSubset<T, JournalEntryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many JournalEntries and returns the data saved in the database.
     * @param {JournalEntryCreateManyAndReturnArgs} args - Arguments to create many JournalEntries.
     * @example
     * // Create many JournalEntries
     * const journalEntry = await prisma.journalEntry.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many JournalEntries and only return the `id`
     * const journalEntryWithIdOnly = await prisma.journalEntry.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends JournalEntryCreateManyAndReturnArgs>(args?: SelectSubset<T, JournalEntryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a JournalEntry.
     * @param {JournalEntryDeleteArgs} args - Arguments to delete one JournalEntry.
     * @example
     * // Delete one JournalEntry
     * const JournalEntry = await prisma.journalEntry.delete({
     *   where: {
     *     // ... filter to delete one JournalEntry
     *   }
     * })
     * 
     */
    delete<T extends JournalEntryDeleteArgs>(args: SelectSubset<T, JournalEntryDeleteArgs<ExtArgs>>): Prisma__JournalEntryClient<$Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one JournalEntry.
     * @param {JournalEntryUpdateArgs} args - Arguments to update one JournalEntry.
     * @example
     * // Update one JournalEntry
     * const journalEntry = await prisma.journalEntry.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends JournalEntryUpdateArgs>(args: SelectSubset<T, JournalEntryUpdateArgs<ExtArgs>>): Prisma__JournalEntryClient<$Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more JournalEntries.
     * @param {JournalEntryDeleteManyArgs} args - Arguments to filter JournalEntries to delete.
     * @example
     * // Delete a few JournalEntries
     * const { count } = await prisma.journalEntry.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends JournalEntryDeleteManyArgs>(args?: SelectSubset<T, JournalEntryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more JournalEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JournalEntryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many JournalEntries
     * const journalEntry = await prisma.journalEntry.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends JournalEntryUpdateManyArgs>(args: SelectSubset<T, JournalEntryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more JournalEntries and returns the data updated in the database.
     * @param {JournalEntryUpdateManyAndReturnArgs} args - Arguments to update many JournalEntries.
     * @example
     * // Update many JournalEntries
     * const journalEntry = await prisma.journalEntry.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more JournalEntries and only return the `id`
     * const journalEntryWithIdOnly = await prisma.journalEntry.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends JournalEntryUpdateManyAndReturnArgs>(args: SelectSubset<T, JournalEntryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one JournalEntry.
     * @param {JournalEntryUpsertArgs} args - Arguments to update or create a JournalEntry.
     * @example
     * // Update or create a JournalEntry
     * const journalEntry = await prisma.journalEntry.upsert({
     *   create: {
     *     // ... data to create a JournalEntry
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the JournalEntry we want to update
     *   }
     * })
     */
    upsert<T extends JournalEntryUpsertArgs>(args: SelectSubset<T, JournalEntryUpsertArgs<ExtArgs>>): Prisma__JournalEntryClient<$Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of JournalEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JournalEntryCountArgs} args - Arguments to filter JournalEntries to count.
     * @example
     * // Count the number of JournalEntries
     * const count = await prisma.journalEntry.count({
     *   where: {
     *     // ... the filter for the JournalEntries we want to count
     *   }
     * })
    **/
    count<T extends JournalEntryCountArgs>(
      args?: Subset<T, JournalEntryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], JournalEntryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a JournalEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JournalEntryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends JournalEntryAggregateArgs>(args: Subset<T, JournalEntryAggregateArgs>): Prisma.PrismaPromise<GetJournalEntryAggregateType<T>>

    /**
     * Group by JournalEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JournalEntryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends JournalEntryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: JournalEntryGroupByArgs['orderBy'] }
        : { orderBy?: JournalEntryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, JournalEntryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetJournalEntryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the JournalEntry model
   */
  readonly fields: JournalEntryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for JournalEntry.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__JournalEntryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    account<T extends AccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AccountDefaultArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    journalVoucher<T extends JournalEntry$journalVoucherArgs<ExtArgs> = {}>(args?: Subset<T, JournalEntry$journalVoucherArgs<ExtArgs>>): Prisma__JournalVoucherClient<$Result.GetResult<Prisma.$JournalVoucherPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the JournalEntry model
   */
  interface JournalEntryFieldRefs {
    readonly id: FieldRef<"JournalEntry", 'String'>
    readonly date: FieldRef<"JournalEntry", 'DateTime'>
    readonly description: FieldRef<"JournalEntry", 'String'>
    readonly accountId: FieldRef<"JournalEntry", 'String'>
    readonly debit: FieldRef<"JournalEntry", 'Float'>
    readonly credit: FieldRef<"JournalEntry", 'Float'>
    readonly reference: FieldRef<"JournalEntry", 'String'>
    readonly journalVoucherId: FieldRef<"JournalEntry", 'String'>
    readonly createdAt: FieldRef<"JournalEntry", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * JournalEntry findUnique
   */
  export type JournalEntryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalEntry
     */
    select?: JournalEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the JournalEntry
     */
    omit?: JournalEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalEntryInclude<ExtArgs> | null
    /**
     * Filter, which JournalEntry to fetch.
     */
    where: JournalEntryWhereUniqueInput
  }

  /**
   * JournalEntry findUniqueOrThrow
   */
  export type JournalEntryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalEntry
     */
    select?: JournalEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the JournalEntry
     */
    omit?: JournalEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalEntryInclude<ExtArgs> | null
    /**
     * Filter, which JournalEntry to fetch.
     */
    where: JournalEntryWhereUniqueInput
  }

  /**
   * JournalEntry findFirst
   */
  export type JournalEntryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalEntry
     */
    select?: JournalEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the JournalEntry
     */
    omit?: JournalEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalEntryInclude<ExtArgs> | null
    /**
     * Filter, which JournalEntry to fetch.
     */
    where?: JournalEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JournalEntries to fetch.
     */
    orderBy?: JournalEntryOrderByWithRelationInput | JournalEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for JournalEntries.
     */
    cursor?: JournalEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JournalEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JournalEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of JournalEntries.
     */
    distinct?: JournalEntryScalarFieldEnum | JournalEntryScalarFieldEnum[]
  }

  /**
   * JournalEntry findFirstOrThrow
   */
  export type JournalEntryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalEntry
     */
    select?: JournalEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the JournalEntry
     */
    omit?: JournalEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalEntryInclude<ExtArgs> | null
    /**
     * Filter, which JournalEntry to fetch.
     */
    where?: JournalEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JournalEntries to fetch.
     */
    orderBy?: JournalEntryOrderByWithRelationInput | JournalEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for JournalEntries.
     */
    cursor?: JournalEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JournalEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JournalEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of JournalEntries.
     */
    distinct?: JournalEntryScalarFieldEnum | JournalEntryScalarFieldEnum[]
  }

  /**
   * JournalEntry findMany
   */
  export type JournalEntryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalEntry
     */
    select?: JournalEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the JournalEntry
     */
    omit?: JournalEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalEntryInclude<ExtArgs> | null
    /**
     * Filter, which JournalEntries to fetch.
     */
    where?: JournalEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JournalEntries to fetch.
     */
    orderBy?: JournalEntryOrderByWithRelationInput | JournalEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing JournalEntries.
     */
    cursor?: JournalEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JournalEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JournalEntries.
     */
    skip?: number
    distinct?: JournalEntryScalarFieldEnum | JournalEntryScalarFieldEnum[]
  }

  /**
   * JournalEntry create
   */
  export type JournalEntryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalEntry
     */
    select?: JournalEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the JournalEntry
     */
    omit?: JournalEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalEntryInclude<ExtArgs> | null
    /**
     * The data needed to create a JournalEntry.
     */
    data: XOR<JournalEntryCreateInput, JournalEntryUncheckedCreateInput>
  }

  /**
   * JournalEntry createMany
   */
  export type JournalEntryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many JournalEntries.
     */
    data: JournalEntryCreateManyInput | JournalEntryCreateManyInput[]
  }

  /**
   * JournalEntry createManyAndReturn
   */
  export type JournalEntryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalEntry
     */
    select?: JournalEntrySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the JournalEntry
     */
    omit?: JournalEntryOmit<ExtArgs> | null
    /**
     * The data used to create many JournalEntries.
     */
    data: JournalEntryCreateManyInput | JournalEntryCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalEntryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * JournalEntry update
   */
  export type JournalEntryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalEntry
     */
    select?: JournalEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the JournalEntry
     */
    omit?: JournalEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalEntryInclude<ExtArgs> | null
    /**
     * The data needed to update a JournalEntry.
     */
    data: XOR<JournalEntryUpdateInput, JournalEntryUncheckedUpdateInput>
    /**
     * Choose, which JournalEntry to update.
     */
    where: JournalEntryWhereUniqueInput
  }

  /**
   * JournalEntry updateMany
   */
  export type JournalEntryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update JournalEntries.
     */
    data: XOR<JournalEntryUpdateManyMutationInput, JournalEntryUncheckedUpdateManyInput>
    /**
     * Filter which JournalEntries to update
     */
    where?: JournalEntryWhereInput
    /**
     * Limit how many JournalEntries to update.
     */
    limit?: number
  }

  /**
   * JournalEntry updateManyAndReturn
   */
  export type JournalEntryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalEntry
     */
    select?: JournalEntrySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the JournalEntry
     */
    omit?: JournalEntryOmit<ExtArgs> | null
    /**
     * The data used to update JournalEntries.
     */
    data: XOR<JournalEntryUpdateManyMutationInput, JournalEntryUncheckedUpdateManyInput>
    /**
     * Filter which JournalEntries to update
     */
    where?: JournalEntryWhereInput
    /**
     * Limit how many JournalEntries to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalEntryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * JournalEntry upsert
   */
  export type JournalEntryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalEntry
     */
    select?: JournalEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the JournalEntry
     */
    omit?: JournalEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalEntryInclude<ExtArgs> | null
    /**
     * The filter to search for the JournalEntry to update in case it exists.
     */
    where: JournalEntryWhereUniqueInput
    /**
     * In case the JournalEntry found by the `where` argument doesn't exist, create a new JournalEntry with this data.
     */
    create: XOR<JournalEntryCreateInput, JournalEntryUncheckedCreateInput>
    /**
     * In case the JournalEntry was found with the provided `where` argument, update it with this data.
     */
    update: XOR<JournalEntryUpdateInput, JournalEntryUncheckedUpdateInput>
  }

  /**
   * JournalEntry delete
   */
  export type JournalEntryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalEntry
     */
    select?: JournalEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the JournalEntry
     */
    omit?: JournalEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalEntryInclude<ExtArgs> | null
    /**
     * Filter which JournalEntry to delete.
     */
    where: JournalEntryWhereUniqueInput
  }

  /**
   * JournalEntry deleteMany
   */
  export type JournalEntryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which JournalEntries to delete
     */
    where?: JournalEntryWhereInput
    /**
     * Limit how many JournalEntries to delete.
     */
    limit?: number
  }

  /**
   * JournalEntry.journalVoucher
   */
  export type JournalEntry$journalVoucherArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalVoucher
     */
    select?: JournalVoucherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JournalVoucher
     */
    omit?: JournalVoucherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalVoucherInclude<ExtArgs> | null
    where?: JournalVoucherWhereInput
  }

  /**
   * JournalEntry without action
   */
  export type JournalEntryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalEntry
     */
    select?: JournalEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the JournalEntry
     */
    omit?: JournalEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalEntryInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const CustomerScalarFieldEnum: {
    id: 'id',
    code: 'code',
    name: 'name',
    nameAr: 'nameAr',
    email: 'email',
    phone: 'phone',
    address: 'address',
    balance: 'balance',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CustomerScalarFieldEnum = (typeof CustomerScalarFieldEnum)[keyof typeof CustomerScalarFieldEnum]


  export const SupplierScalarFieldEnum: {
    id: 'id',
    code: 'code',
    name: 'name',
    nameAr: 'nameAr',
    email: 'email',
    phone: 'phone',
    address: 'address',
    balance: 'balance',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SupplierScalarFieldEnum = (typeof SupplierScalarFieldEnum)[keyof typeof SupplierScalarFieldEnum]


  export const ProductScalarFieldEnum: {
    id: 'id',
    sku: 'sku',
    name: 'name',
    nameAr: 'nameAr',
    description: 'description',
    category: 'category',
    unit: 'unit',
    costPrice: 'costPrice',
    salePrice: 'salePrice',
    stockQuantity: 'stockQuantity',
    reorderPoint: 'reorderPoint',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProductScalarFieldEnum = (typeof ProductScalarFieldEnum)[keyof typeof ProductScalarFieldEnum]


  export const SalesInvoiceScalarFieldEnum: {
    id: 'id',
    invoiceNumber: 'invoiceNumber',
    date: 'date',
    customerId: 'customerId',
    totalAmount: 'totalAmount',
    taxAmount: 'taxAmount',
    discount: 'discount',
    netAmount: 'netAmount',
    status: 'status',
    journalVoucherId: 'journalVoucherId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SalesInvoiceScalarFieldEnum = (typeof SalesInvoiceScalarFieldEnum)[keyof typeof SalesInvoiceScalarFieldEnum]


  export const PurchaseInvoiceScalarFieldEnum: {
    id: 'id',
    invoiceNumber: 'invoiceNumber',
    date: 'date',
    supplierId: 'supplierId',
    totalAmount: 'totalAmount',
    taxAmount: 'taxAmount',
    discount: 'discount',
    netAmount: 'netAmount',
    status: 'status',
    journalVoucherId: 'journalVoucherId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PurchaseInvoiceScalarFieldEnum = (typeof PurchaseInvoiceScalarFieldEnum)[keyof typeof PurchaseInvoiceScalarFieldEnum]


  export const InvoiceItemScalarFieldEnum: {
    id: 'id',
    invoiceId: 'invoiceId',
    productId: 'productId',
    quantity: 'quantity',
    unitPrice: 'unitPrice',
    total: 'total'
  };

  export type InvoiceItemScalarFieldEnum = (typeof InvoiceItemScalarFieldEnum)[keyof typeof InvoiceItemScalarFieldEnum]


  export const PurchaseItemScalarFieldEnum: {
    id: 'id',
    invoiceId: 'invoiceId',
    productId: 'productId',
    quantity: 'quantity',
    unitPrice: 'unitPrice',
    total: 'total'
  };

  export type PurchaseItemScalarFieldEnum = (typeof PurchaseItemScalarFieldEnum)[keyof typeof PurchaseItemScalarFieldEnum]


  export const InventoryLogScalarFieldEnum: {
    id: 'id',
    productId: 'productId',
    date: 'date',
    type: 'type',
    quantity: 'quantity',
    referenceId: 'referenceId',
    description: 'description'
  };

  export type InventoryLogScalarFieldEnum = (typeof InventoryLogScalarFieldEnum)[keyof typeof InventoryLogScalarFieldEnum]


  export const AccountScalarFieldEnum: {
    id: 'id',
    code: 'code',
    name: 'name',
    nameAr: 'nameAr',
    type: 'type',
    parentId: 'parentId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum]


  export const JournalVoucherScalarFieldEnum: {
    id: 'id',
    reference: 'reference',
    date: 'date',
    description: 'description',
    status: 'status',
    createdAt: 'createdAt'
  };

  export type JournalVoucherScalarFieldEnum = (typeof JournalVoucherScalarFieldEnum)[keyof typeof JournalVoucherScalarFieldEnum]


  export const JournalEntryScalarFieldEnum: {
    id: 'id',
    date: 'date',
    description: 'description',
    accountId: 'accountId',
    debit: 'debit',
    credit: 'credit',
    reference: 'reference',
    journalVoucherId: 'journalVoucherId',
    createdAt: 'createdAt'
  };

  export type JournalEntryScalarFieldEnum = (typeof JournalEntryScalarFieldEnum)[keyof typeof JournalEntryScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    
  /**
   * Deep Input Types
   */


  export type CustomerWhereInput = {
    AND?: CustomerWhereInput | CustomerWhereInput[]
    OR?: CustomerWhereInput[]
    NOT?: CustomerWhereInput | CustomerWhereInput[]
    id?: StringFilter<"Customer"> | string
    code?: StringFilter<"Customer"> | string
    name?: StringFilter<"Customer"> | string
    nameAr?: StringNullableFilter<"Customer"> | string | null
    email?: StringNullableFilter<"Customer"> | string | null
    phone?: StringNullableFilter<"Customer"> | string | null
    address?: StringNullableFilter<"Customer"> | string | null
    balance?: FloatFilter<"Customer"> | number
    createdAt?: DateTimeFilter<"Customer"> | Date | string
    updatedAt?: DateTimeFilter<"Customer"> | Date | string
    invoices?: SalesInvoiceListRelationFilter
  }

  export type CustomerOrderByWithRelationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    nameAr?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    balance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    invoices?: SalesInvoiceOrderByRelationAggregateInput
  }

  export type CustomerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    code?: string
    AND?: CustomerWhereInput | CustomerWhereInput[]
    OR?: CustomerWhereInput[]
    NOT?: CustomerWhereInput | CustomerWhereInput[]
    name?: StringFilter<"Customer"> | string
    nameAr?: StringNullableFilter<"Customer"> | string | null
    email?: StringNullableFilter<"Customer"> | string | null
    phone?: StringNullableFilter<"Customer"> | string | null
    address?: StringNullableFilter<"Customer"> | string | null
    balance?: FloatFilter<"Customer"> | number
    createdAt?: DateTimeFilter<"Customer"> | Date | string
    updatedAt?: DateTimeFilter<"Customer"> | Date | string
    invoices?: SalesInvoiceListRelationFilter
  }, "id" | "code">

  export type CustomerOrderByWithAggregationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    nameAr?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    balance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CustomerCountOrderByAggregateInput
    _avg?: CustomerAvgOrderByAggregateInput
    _max?: CustomerMaxOrderByAggregateInput
    _min?: CustomerMinOrderByAggregateInput
    _sum?: CustomerSumOrderByAggregateInput
  }

  export type CustomerScalarWhereWithAggregatesInput = {
    AND?: CustomerScalarWhereWithAggregatesInput | CustomerScalarWhereWithAggregatesInput[]
    OR?: CustomerScalarWhereWithAggregatesInput[]
    NOT?: CustomerScalarWhereWithAggregatesInput | CustomerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Customer"> | string
    code?: StringWithAggregatesFilter<"Customer"> | string
    name?: StringWithAggregatesFilter<"Customer"> | string
    nameAr?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    email?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    phone?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    address?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    balance?: FloatWithAggregatesFilter<"Customer"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Customer"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Customer"> | Date | string
  }

  export type SupplierWhereInput = {
    AND?: SupplierWhereInput | SupplierWhereInput[]
    OR?: SupplierWhereInput[]
    NOT?: SupplierWhereInput | SupplierWhereInput[]
    id?: StringFilter<"Supplier"> | string
    code?: StringFilter<"Supplier"> | string
    name?: StringFilter<"Supplier"> | string
    nameAr?: StringNullableFilter<"Supplier"> | string | null
    email?: StringNullableFilter<"Supplier"> | string | null
    phone?: StringNullableFilter<"Supplier"> | string | null
    address?: StringNullableFilter<"Supplier"> | string | null
    balance?: FloatFilter<"Supplier"> | number
    createdAt?: DateTimeFilter<"Supplier"> | Date | string
    updatedAt?: DateTimeFilter<"Supplier"> | Date | string
    invoices?: PurchaseInvoiceListRelationFilter
  }

  export type SupplierOrderByWithRelationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    nameAr?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    balance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    invoices?: PurchaseInvoiceOrderByRelationAggregateInput
  }

  export type SupplierWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    code?: string
    AND?: SupplierWhereInput | SupplierWhereInput[]
    OR?: SupplierWhereInput[]
    NOT?: SupplierWhereInput | SupplierWhereInput[]
    name?: StringFilter<"Supplier"> | string
    nameAr?: StringNullableFilter<"Supplier"> | string | null
    email?: StringNullableFilter<"Supplier"> | string | null
    phone?: StringNullableFilter<"Supplier"> | string | null
    address?: StringNullableFilter<"Supplier"> | string | null
    balance?: FloatFilter<"Supplier"> | number
    createdAt?: DateTimeFilter<"Supplier"> | Date | string
    updatedAt?: DateTimeFilter<"Supplier"> | Date | string
    invoices?: PurchaseInvoiceListRelationFilter
  }, "id" | "code">

  export type SupplierOrderByWithAggregationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    nameAr?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    balance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SupplierCountOrderByAggregateInput
    _avg?: SupplierAvgOrderByAggregateInput
    _max?: SupplierMaxOrderByAggregateInput
    _min?: SupplierMinOrderByAggregateInput
    _sum?: SupplierSumOrderByAggregateInput
  }

  export type SupplierScalarWhereWithAggregatesInput = {
    AND?: SupplierScalarWhereWithAggregatesInput | SupplierScalarWhereWithAggregatesInput[]
    OR?: SupplierScalarWhereWithAggregatesInput[]
    NOT?: SupplierScalarWhereWithAggregatesInput | SupplierScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Supplier"> | string
    code?: StringWithAggregatesFilter<"Supplier"> | string
    name?: StringWithAggregatesFilter<"Supplier"> | string
    nameAr?: StringNullableWithAggregatesFilter<"Supplier"> | string | null
    email?: StringNullableWithAggregatesFilter<"Supplier"> | string | null
    phone?: StringNullableWithAggregatesFilter<"Supplier"> | string | null
    address?: StringNullableWithAggregatesFilter<"Supplier"> | string | null
    balance?: FloatWithAggregatesFilter<"Supplier"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Supplier"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Supplier"> | Date | string
  }

  export type ProductWhereInput = {
    AND?: ProductWhereInput | ProductWhereInput[]
    OR?: ProductWhereInput[]
    NOT?: ProductWhereInput | ProductWhereInput[]
    id?: StringFilter<"Product"> | string
    sku?: StringFilter<"Product"> | string
    name?: StringFilter<"Product"> | string
    nameAr?: StringNullableFilter<"Product"> | string | null
    description?: StringNullableFilter<"Product"> | string | null
    category?: StringNullableFilter<"Product"> | string | null
    unit?: StringFilter<"Product"> | string
    costPrice?: FloatFilter<"Product"> | number
    salePrice?: FloatFilter<"Product"> | number
    stockQuantity?: FloatFilter<"Product"> | number
    reorderPoint?: FloatFilter<"Product"> | number
    createdAt?: DateTimeFilter<"Product"> | Date | string
    updatedAt?: DateTimeFilter<"Product"> | Date | string
    items?: InvoiceItemListRelationFilter
    purchaseItems?: PurchaseItemListRelationFilter
    inventoryLogs?: InventoryLogListRelationFilter
  }

  export type ProductOrderByWithRelationInput = {
    id?: SortOrder
    sku?: SortOrder
    name?: SortOrder
    nameAr?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    category?: SortOrderInput | SortOrder
    unit?: SortOrder
    costPrice?: SortOrder
    salePrice?: SortOrder
    stockQuantity?: SortOrder
    reorderPoint?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    items?: InvoiceItemOrderByRelationAggregateInput
    purchaseItems?: PurchaseItemOrderByRelationAggregateInput
    inventoryLogs?: InventoryLogOrderByRelationAggregateInput
  }

  export type ProductWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sku?: string
    AND?: ProductWhereInput | ProductWhereInput[]
    OR?: ProductWhereInput[]
    NOT?: ProductWhereInput | ProductWhereInput[]
    name?: StringFilter<"Product"> | string
    nameAr?: StringNullableFilter<"Product"> | string | null
    description?: StringNullableFilter<"Product"> | string | null
    category?: StringNullableFilter<"Product"> | string | null
    unit?: StringFilter<"Product"> | string
    costPrice?: FloatFilter<"Product"> | number
    salePrice?: FloatFilter<"Product"> | number
    stockQuantity?: FloatFilter<"Product"> | number
    reorderPoint?: FloatFilter<"Product"> | number
    createdAt?: DateTimeFilter<"Product"> | Date | string
    updatedAt?: DateTimeFilter<"Product"> | Date | string
    items?: InvoiceItemListRelationFilter
    purchaseItems?: PurchaseItemListRelationFilter
    inventoryLogs?: InventoryLogListRelationFilter
  }, "id" | "sku">

  export type ProductOrderByWithAggregationInput = {
    id?: SortOrder
    sku?: SortOrder
    name?: SortOrder
    nameAr?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    category?: SortOrderInput | SortOrder
    unit?: SortOrder
    costPrice?: SortOrder
    salePrice?: SortOrder
    stockQuantity?: SortOrder
    reorderPoint?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProductCountOrderByAggregateInput
    _avg?: ProductAvgOrderByAggregateInput
    _max?: ProductMaxOrderByAggregateInput
    _min?: ProductMinOrderByAggregateInput
    _sum?: ProductSumOrderByAggregateInput
  }

  export type ProductScalarWhereWithAggregatesInput = {
    AND?: ProductScalarWhereWithAggregatesInput | ProductScalarWhereWithAggregatesInput[]
    OR?: ProductScalarWhereWithAggregatesInput[]
    NOT?: ProductScalarWhereWithAggregatesInput | ProductScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Product"> | string
    sku?: StringWithAggregatesFilter<"Product"> | string
    name?: StringWithAggregatesFilter<"Product"> | string
    nameAr?: StringNullableWithAggregatesFilter<"Product"> | string | null
    description?: StringNullableWithAggregatesFilter<"Product"> | string | null
    category?: StringNullableWithAggregatesFilter<"Product"> | string | null
    unit?: StringWithAggregatesFilter<"Product"> | string
    costPrice?: FloatWithAggregatesFilter<"Product"> | number
    salePrice?: FloatWithAggregatesFilter<"Product"> | number
    stockQuantity?: FloatWithAggregatesFilter<"Product"> | number
    reorderPoint?: FloatWithAggregatesFilter<"Product"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Product"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Product"> | Date | string
  }

  export type SalesInvoiceWhereInput = {
    AND?: SalesInvoiceWhereInput | SalesInvoiceWhereInput[]
    OR?: SalesInvoiceWhereInput[]
    NOT?: SalesInvoiceWhereInput | SalesInvoiceWhereInput[]
    id?: StringFilter<"SalesInvoice"> | string
    invoiceNumber?: StringFilter<"SalesInvoice"> | string
    date?: DateTimeFilter<"SalesInvoice"> | Date | string
    customerId?: StringFilter<"SalesInvoice"> | string
    totalAmount?: FloatFilter<"SalesInvoice"> | number
    taxAmount?: FloatFilter<"SalesInvoice"> | number
    discount?: FloatFilter<"SalesInvoice"> | number
    netAmount?: FloatFilter<"SalesInvoice"> | number
    status?: StringFilter<"SalesInvoice"> | string
    journalVoucherId?: StringNullableFilter<"SalesInvoice"> | string | null
    createdAt?: DateTimeFilter<"SalesInvoice"> | Date | string
    updatedAt?: DateTimeFilter<"SalesInvoice"> | Date | string
    customer?: XOR<CustomerScalarRelationFilter, CustomerWhereInput>
    items?: InvoiceItemListRelationFilter
    journalVoucher?: XOR<JournalVoucherNullableScalarRelationFilter, JournalVoucherWhereInput> | null
  }

  export type SalesInvoiceOrderByWithRelationInput = {
    id?: SortOrder
    invoiceNumber?: SortOrder
    date?: SortOrder
    customerId?: SortOrder
    totalAmount?: SortOrder
    taxAmount?: SortOrder
    discount?: SortOrder
    netAmount?: SortOrder
    status?: SortOrder
    journalVoucherId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    customer?: CustomerOrderByWithRelationInput
    items?: InvoiceItemOrderByRelationAggregateInput
    journalVoucher?: JournalVoucherOrderByWithRelationInput
  }

  export type SalesInvoiceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    invoiceNumber?: string
    AND?: SalesInvoiceWhereInput | SalesInvoiceWhereInput[]
    OR?: SalesInvoiceWhereInput[]
    NOT?: SalesInvoiceWhereInput | SalesInvoiceWhereInput[]
    date?: DateTimeFilter<"SalesInvoice"> | Date | string
    customerId?: StringFilter<"SalesInvoice"> | string
    totalAmount?: FloatFilter<"SalesInvoice"> | number
    taxAmount?: FloatFilter<"SalesInvoice"> | number
    discount?: FloatFilter<"SalesInvoice"> | number
    netAmount?: FloatFilter<"SalesInvoice"> | number
    status?: StringFilter<"SalesInvoice"> | string
    journalVoucherId?: StringNullableFilter<"SalesInvoice"> | string | null
    createdAt?: DateTimeFilter<"SalesInvoice"> | Date | string
    updatedAt?: DateTimeFilter<"SalesInvoice"> | Date | string
    customer?: XOR<CustomerScalarRelationFilter, CustomerWhereInput>
    items?: InvoiceItemListRelationFilter
    journalVoucher?: XOR<JournalVoucherNullableScalarRelationFilter, JournalVoucherWhereInput> | null
  }, "id" | "invoiceNumber">

  export type SalesInvoiceOrderByWithAggregationInput = {
    id?: SortOrder
    invoiceNumber?: SortOrder
    date?: SortOrder
    customerId?: SortOrder
    totalAmount?: SortOrder
    taxAmount?: SortOrder
    discount?: SortOrder
    netAmount?: SortOrder
    status?: SortOrder
    journalVoucherId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SalesInvoiceCountOrderByAggregateInput
    _avg?: SalesInvoiceAvgOrderByAggregateInput
    _max?: SalesInvoiceMaxOrderByAggregateInput
    _min?: SalesInvoiceMinOrderByAggregateInput
    _sum?: SalesInvoiceSumOrderByAggregateInput
  }

  export type SalesInvoiceScalarWhereWithAggregatesInput = {
    AND?: SalesInvoiceScalarWhereWithAggregatesInput | SalesInvoiceScalarWhereWithAggregatesInput[]
    OR?: SalesInvoiceScalarWhereWithAggregatesInput[]
    NOT?: SalesInvoiceScalarWhereWithAggregatesInput | SalesInvoiceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SalesInvoice"> | string
    invoiceNumber?: StringWithAggregatesFilter<"SalesInvoice"> | string
    date?: DateTimeWithAggregatesFilter<"SalesInvoice"> | Date | string
    customerId?: StringWithAggregatesFilter<"SalesInvoice"> | string
    totalAmount?: FloatWithAggregatesFilter<"SalesInvoice"> | number
    taxAmount?: FloatWithAggregatesFilter<"SalesInvoice"> | number
    discount?: FloatWithAggregatesFilter<"SalesInvoice"> | number
    netAmount?: FloatWithAggregatesFilter<"SalesInvoice"> | number
    status?: StringWithAggregatesFilter<"SalesInvoice"> | string
    journalVoucherId?: StringNullableWithAggregatesFilter<"SalesInvoice"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"SalesInvoice"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SalesInvoice"> | Date | string
  }

  export type PurchaseInvoiceWhereInput = {
    AND?: PurchaseInvoiceWhereInput | PurchaseInvoiceWhereInput[]
    OR?: PurchaseInvoiceWhereInput[]
    NOT?: PurchaseInvoiceWhereInput | PurchaseInvoiceWhereInput[]
    id?: StringFilter<"PurchaseInvoice"> | string
    invoiceNumber?: StringFilter<"PurchaseInvoice"> | string
    date?: DateTimeFilter<"PurchaseInvoice"> | Date | string
    supplierId?: StringFilter<"PurchaseInvoice"> | string
    totalAmount?: FloatFilter<"PurchaseInvoice"> | number
    taxAmount?: FloatFilter<"PurchaseInvoice"> | number
    discount?: FloatFilter<"PurchaseInvoice"> | number
    netAmount?: FloatFilter<"PurchaseInvoice"> | number
    status?: StringFilter<"PurchaseInvoice"> | string
    journalVoucherId?: StringNullableFilter<"PurchaseInvoice"> | string | null
    createdAt?: DateTimeFilter<"PurchaseInvoice"> | Date | string
    updatedAt?: DateTimeFilter<"PurchaseInvoice"> | Date | string
    supplier?: XOR<SupplierScalarRelationFilter, SupplierWhereInput>
    items?: PurchaseItemListRelationFilter
    journalVoucher?: XOR<JournalVoucherNullableScalarRelationFilter, JournalVoucherWhereInput> | null
  }

  export type PurchaseInvoiceOrderByWithRelationInput = {
    id?: SortOrder
    invoiceNumber?: SortOrder
    date?: SortOrder
    supplierId?: SortOrder
    totalAmount?: SortOrder
    taxAmount?: SortOrder
    discount?: SortOrder
    netAmount?: SortOrder
    status?: SortOrder
    journalVoucherId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    supplier?: SupplierOrderByWithRelationInput
    items?: PurchaseItemOrderByRelationAggregateInput
    journalVoucher?: JournalVoucherOrderByWithRelationInput
  }

  export type PurchaseInvoiceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    invoiceNumber?: string
    AND?: PurchaseInvoiceWhereInput | PurchaseInvoiceWhereInput[]
    OR?: PurchaseInvoiceWhereInput[]
    NOT?: PurchaseInvoiceWhereInput | PurchaseInvoiceWhereInput[]
    date?: DateTimeFilter<"PurchaseInvoice"> | Date | string
    supplierId?: StringFilter<"PurchaseInvoice"> | string
    totalAmount?: FloatFilter<"PurchaseInvoice"> | number
    taxAmount?: FloatFilter<"PurchaseInvoice"> | number
    discount?: FloatFilter<"PurchaseInvoice"> | number
    netAmount?: FloatFilter<"PurchaseInvoice"> | number
    status?: StringFilter<"PurchaseInvoice"> | string
    journalVoucherId?: StringNullableFilter<"PurchaseInvoice"> | string | null
    createdAt?: DateTimeFilter<"PurchaseInvoice"> | Date | string
    updatedAt?: DateTimeFilter<"PurchaseInvoice"> | Date | string
    supplier?: XOR<SupplierScalarRelationFilter, SupplierWhereInput>
    items?: PurchaseItemListRelationFilter
    journalVoucher?: XOR<JournalVoucherNullableScalarRelationFilter, JournalVoucherWhereInput> | null
  }, "id" | "invoiceNumber">

  export type PurchaseInvoiceOrderByWithAggregationInput = {
    id?: SortOrder
    invoiceNumber?: SortOrder
    date?: SortOrder
    supplierId?: SortOrder
    totalAmount?: SortOrder
    taxAmount?: SortOrder
    discount?: SortOrder
    netAmount?: SortOrder
    status?: SortOrder
    journalVoucherId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PurchaseInvoiceCountOrderByAggregateInput
    _avg?: PurchaseInvoiceAvgOrderByAggregateInput
    _max?: PurchaseInvoiceMaxOrderByAggregateInput
    _min?: PurchaseInvoiceMinOrderByAggregateInput
    _sum?: PurchaseInvoiceSumOrderByAggregateInput
  }

  export type PurchaseInvoiceScalarWhereWithAggregatesInput = {
    AND?: PurchaseInvoiceScalarWhereWithAggregatesInput | PurchaseInvoiceScalarWhereWithAggregatesInput[]
    OR?: PurchaseInvoiceScalarWhereWithAggregatesInput[]
    NOT?: PurchaseInvoiceScalarWhereWithAggregatesInput | PurchaseInvoiceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PurchaseInvoice"> | string
    invoiceNumber?: StringWithAggregatesFilter<"PurchaseInvoice"> | string
    date?: DateTimeWithAggregatesFilter<"PurchaseInvoice"> | Date | string
    supplierId?: StringWithAggregatesFilter<"PurchaseInvoice"> | string
    totalAmount?: FloatWithAggregatesFilter<"PurchaseInvoice"> | number
    taxAmount?: FloatWithAggregatesFilter<"PurchaseInvoice"> | number
    discount?: FloatWithAggregatesFilter<"PurchaseInvoice"> | number
    netAmount?: FloatWithAggregatesFilter<"PurchaseInvoice"> | number
    status?: StringWithAggregatesFilter<"PurchaseInvoice"> | string
    journalVoucherId?: StringNullableWithAggregatesFilter<"PurchaseInvoice"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PurchaseInvoice"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PurchaseInvoice"> | Date | string
  }

  export type InvoiceItemWhereInput = {
    AND?: InvoiceItemWhereInput | InvoiceItemWhereInput[]
    OR?: InvoiceItemWhereInput[]
    NOT?: InvoiceItemWhereInput | InvoiceItemWhereInput[]
    id?: StringFilter<"InvoiceItem"> | string
    invoiceId?: StringFilter<"InvoiceItem"> | string
    productId?: StringFilter<"InvoiceItem"> | string
    quantity?: FloatFilter<"InvoiceItem"> | number
    unitPrice?: FloatFilter<"InvoiceItem"> | number
    total?: FloatFilter<"InvoiceItem"> | number
    invoice?: XOR<SalesInvoiceScalarRelationFilter, SalesInvoiceWhereInput>
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }

  export type InvoiceItemOrderByWithRelationInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    total?: SortOrder
    invoice?: SalesInvoiceOrderByWithRelationInput
    product?: ProductOrderByWithRelationInput
  }

  export type InvoiceItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: InvoiceItemWhereInput | InvoiceItemWhereInput[]
    OR?: InvoiceItemWhereInput[]
    NOT?: InvoiceItemWhereInput | InvoiceItemWhereInput[]
    invoiceId?: StringFilter<"InvoiceItem"> | string
    productId?: StringFilter<"InvoiceItem"> | string
    quantity?: FloatFilter<"InvoiceItem"> | number
    unitPrice?: FloatFilter<"InvoiceItem"> | number
    total?: FloatFilter<"InvoiceItem"> | number
    invoice?: XOR<SalesInvoiceScalarRelationFilter, SalesInvoiceWhereInput>
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }, "id">

  export type InvoiceItemOrderByWithAggregationInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    total?: SortOrder
    _count?: InvoiceItemCountOrderByAggregateInput
    _avg?: InvoiceItemAvgOrderByAggregateInput
    _max?: InvoiceItemMaxOrderByAggregateInput
    _min?: InvoiceItemMinOrderByAggregateInput
    _sum?: InvoiceItemSumOrderByAggregateInput
  }

  export type InvoiceItemScalarWhereWithAggregatesInput = {
    AND?: InvoiceItemScalarWhereWithAggregatesInput | InvoiceItemScalarWhereWithAggregatesInput[]
    OR?: InvoiceItemScalarWhereWithAggregatesInput[]
    NOT?: InvoiceItemScalarWhereWithAggregatesInput | InvoiceItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"InvoiceItem"> | string
    invoiceId?: StringWithAggregatesFilter<"InvoiceItem"> | string
    productId?: StringWithAggregatesFilter<"InvoiceItem"> | string
    quantity?: FloatWithAggregatesFilter<"InvoiceItem"> | number
    unitPrice?: FloatWithAggregatesFilter<"InvoiceItem"> | number
    total?: FloatWithAggregatesFilter<"InvoiceItem"> | number
  }

  export type PurchaseItemWhereInput = {
    AND?: PurchaseItemWhereInput | PurchaseItemWhereInput[]
    OR?: PurchaseItemWhereInput[]
    NOT?: PurchaseItemWhereInput | PurchaseItemWhereInput[]
    id?: StringFilter<"PurchaseItem"> | string
    invoiceId?: StringFilter<"PurchaseItem"> | string
    productId?: StringFilter<"PurchaseItem"> | string
    quantity?: FloatFilter<"PurchaseItem"> | number
    unitPrice?: FloatFilter<"PurchaseItem"> | number
    total?: FloatFilter<"PurchaseItem"> | number
    invoice?: XOR<PurchaseInvoiceScalarRelationFilter, PurchaseInvoiceWhereInput>
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }

  export type PurchaseItemOrderByWithRelationInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    total?: SortOrder
    invoice?: PurchaseInvoiceOrderByWithRelationInput
    product?: ProductOrderByWithRelationInput
  }

  export type PurchaseItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PurchaseItemWhereInput | PurchaseItemWhereInput[]
    OR?: PurchaseItemWhereInput[]
    NOT?: PurchaseItemWhereInput | PurchaseItemWhereInput[]
    invoiceId?: StringFilter<"PurchaseItem"> | string
    productId?: StringFilter<"PurchaseItem"> | string
    quantity?: FloatFilter<"PurchaseItem"> | number
    unitPrice?: FloatFilter<"PurchaseItem"> | number
    total?: FloatFilter<"PurchaseItem"> | number
    invoice?: XOR<PurchaseInvoiceScalarRelationFilter, PurchaseInvoiceWhereInput>
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }, "id">

  export type PurchaseItemOrderByWithAggregationInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    total?: SortOrder
    _count?: PurchaseItemCountOrderByAggregateInput
    _avg?: PurchaseItemAvgOrderByAggregateInput
    _max?: PurchaseItemMaxOrderByAggregateInput
    _min?: PurchaseItemMinOrderByAggregateInput
    _sum?: PurchaseItemSumOrderByAggregateInput
  }

  export type PurchaseItemScalarWhereWithAggregatesInput = {
    AND?: PurchaseItemScalarWhereWithAggregatesInput | PurchaseItemScalarWhereWithAggregatesInput[]
    OR?: PurchaseItemScalarWhereWithAggregatesInput[]
    NOT?: PurchaseItemScalarWhereWithAggregatesInput | PurchaseItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PurchaseItem"> | string
    invoiceId?: StringWithAggregatesFilter<"PurchaseItem"> | string
    productId?: StringWithAggregatesFilter<"PurchaseItem"> | string
    quantity?: FloatWithAggregatesFilter<"PurchaseItem"> | number
    unitPrice?: FloatWithAggregatesFilter<"PurchaseItem"> | number
    total?: FloatWithAggregatesFilter<"PurchaseItem"> | number
  }

  export type InventoryLogWhereInput = {
    AND?: InventoryLogWhereInput | InventoryLogWhereInput[]
    OR?: InventoryLogWhereInput[]
    NOT?: InventoryLogWhereInput | InventoryLogWhereInput[]
    id?: StringFilter<"InventoryLog"> | string
    productId?: StringFilter<"InventoryLog"> | string
    date?: DateTimeFilter<"InventoryLog"> | Date | string
    type?: StringFilter<"InventoryLog"> | string
    quantity?: FloatFilter<"InventoryLog"> | number
    referenceId?: StringNullableFilter<"InventoryLog"> | string | null
    description?: StringNullableFilter<"InventoryLog"> | string | null
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }

  export type InventoryLogOrderByWithRelationInput = {
    id?: SortOrder
    productId?: SortOrder
    date?: SortOrder
    type?: SortOrder
    quantity?: SortOrder
    referenceId?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    product?: ProductOrderByWithRelationInput
  }

  export type InventoryLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: InventoryLogWhereInput | InventoryLogWhereInput[]
    OR?: InventoryLogWhereInput[]
    NOT?: InventoryLogWhereInput | InventoryLogWhereInput[]
    productId?: StringFilter<"InventoryLog"> | string
    date?: DateTimeFilter<"InventoryLog"> | Date | string
    type?: StringFilter<"InventoryLog"> | string
    quantity?: FloatFilter<"InventoryLog"> | number
    referenceId?: StringNullableFilter<"InventoryLog"> | string | null
    description?: StringNullableFilter<"InventoryLog"> | string | null
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }, "id">

  export type InventoryLogOrderByWithAggregationInput = {
    id?: SortOrder
    productId?: SortOrder
    date?: SortOrder
    type?: SortOrder
    quantity?: SortOrder
    referenceId?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    _count?: InventoryLogCountOrderByAggregateInput
    _avg?: InventoryLogAvgOrderByAggregateInput
    _max?: InventoryLogMaxOrderByAggregateInput
    _min?: InventoryLogMinOrderByAggregateInput
    _sum?: InventoryLogSumOrderByAggregateInput
  }

  export type InventoryLogScalarWhereWithAggregatesInput = {
    AND?: InventoryLogScalarWhereWithAggregatesInput | InventoryLogScalarWhereWithAggregatesInput[]
    OR?: InventoryLogScalarWhereWithAggregatesInput[]
    NOT?: InventoryLogScalarWhereWithAggregatesInput | InventoryLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"InventoryLog"> | string
    productId?: StringWithAggregatesFilter<"InventoryLog"> | string
    date?: DateTimeWithAggregatesFilter<"InventoryLog"> | Date | string
    type?: StringWithAggregatesFilter<"InventoryLog"> | string
    quantity?: FloatWithAggregatesFilter<"InventoryLog"> | number
    referenceId?: StringNullableWithAggregatesFilter<"InventoryLog"> | string | null
    description?: StringNullableWithAggregatesFilter<"InventoryLog"> | string | null
  }

  export type AccountWhereInput = {
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    id?: StringFilter<"Account"> | string
    code?: StringFilter<"Account"> | string
    name?: StringFilter<"Account"> | string
    nameAr?: StringNullableFilter<"Account"> | string | null
    type?: StringFilter<"Account"> | string
    parentId?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    parent?: XOR<AccountNullableScalarRelationFilter, AccountWhereInput> | null
    children?: AccountListRelationFilter
    entries?: JournalEntryListRelationFilter
  }

  export type AccountOrderByWithRelationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    nameAr?: SortOrderInput | SortOrder
    type?: SortOrder
    parentId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    parent?: AccountOrderByWithRelationInput
    children?: AccountOrderByRelationAggregateInput
    entries?: JournalEntryOrderByRelationAggregateInput
  }

  export type AccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    code?: string
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    name?: StringFilter<"Account"> | string
    nameAr?: StringNullableFilter<"Account"> | string | null
    type?: StringFilter<"Account"> | string
    parentId?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    parent?: XOR<AccountNullableScalarRelationFilter, AccountWhereInput> | null
    children?: AccountListRelationFilter
    entries?: JournalEntryListRelationFilter
  }, "id" | "code">

  export type AccountOrderByWithAggregationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    nameAr?: SortOrderInput | SortOrder
    type?: SortOrder
    parentId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AccountCountOrderByAggregateInput
    _max?: AccountMaxOrderByAggregateInput
    _min?: AccountMinOrderByAggregateInput
  }

  export type AccountScalarWhereWithAggregatesInput = {
    AND?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    OR?: AccountScalarWhereWithAggregatesInput[]
    NOT?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Account"> | string
    code?: StringWithAggregatesFilter<"Account"> | string
    name?: StringWithAggregatesFilter<"Account"> | string
    nameAr?: StringNullableWithAggregatesFilter<"Account"> | string | null
    type?: StringWithAggregatesFilter<"Account"> | string
    parentId?: StringNullableWithAggregatesFilter<"Account"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
  }

  export type JournalVoucherWhereInput = {
    AND?: JournalVoucherWhereInput | JournalVoucherWhereInput[]
    OR?: JournalVoucherWhereInput[]
    NOT?: JournalVoucherWhereInput | JournalVoucherWhereInput[]
    id?: StringFilter<"JournalVoucher"> | string
    reference?: StringFilter<"JournalVoucher"> | string
    date?: DateTimeFilter<"JournalVoucher"> | Date | string
    description?: StringFilter<"JournalVoucher"> | string
    status?: StringFilter<"JournalVoucher"> | string
    createdAt?: DateTimeFilter<"JournalVoucher"> | Date | string
    entries?: JournalEntryListRelationFilter
    invoices?: SalesInvoiceListRelationFilter
    purchaseInvoices?: PurchaseInvoiceListRelationFilter
  }

  export type JournalVoucherOrderByWithRelationInput = {
    id?: SortOrder
    reference?: SortOrder
    date?: SortOrder
    description?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    entries?: JournalEntryOrderByRelationAggregateInput
    invoices?: SalesInvoiceOrderByRelationAggregateInput
    purchaseInvoices?: PurchaseInvoiceOrderByRelationAggregateInput
  }

  export type JournalVoucherWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    reference?: string
    AND?: JournalVoucherWhereInput | JournalVoucherWhereInput[]
    OR?: JournalVoucherWhereInput[]
    NOT?: JournalVoucherWhereInput | JournalVoucherWhereInput[]
    date?: DateTimeFilter<"JournalVoucher"> | Date | string
    description?: StringFilter<"JournalVoucher"> | string
    status?: StringFilter<"JournalVoucher"> | string
    createdAt?: DateTimeFilter<"JournalVoucher"> | Date | string
    entries?: JournalEntryListRelationFilter
    invoices?: SalesInvoiceListRelationFilter
    purchaseInvoices?: PurchaseInvoiceListRelationFilter
  }, "id" | "reference">

  export type JournalVoucherOrderByWithAggregationInput = {
    id?: SortOrder
    reference?: SortOrder
    date?: SortOrder
    description?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    _count?: JournalVoucherCountOrderByAggregateInput
    _max?: JournalVoucherMaxOrderByAggregateInput
    _min?: JournalVoucherMinOrderByAggregateInput
  }

  export type JournalVoucherScalarWhereWithAggregatesInput = {
    AND?: JournalVoucherScalarWhereWithAggregatesInput | JournalVoucherScalarWhereWithAggregatesInput[]
    OR?: JournalVoucherScalarWhereWithAggregatesInput[]
    NOT?: JournalVoucherScalarWhereWithAggregatesInput | JournalVoucherScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"JournalVoucher"> | string
    reference?: StringWithAggregatesFilter<"JournalVoucher"> | string
    date?: DateTimeWithAggregatesFilter<"JournalVoucher"> | Date | string
    description?: StringWithAggregatesFilter<"JournalVoucher"> | string
    status?: StringWithAggregatesFilter<"JournalVoucher"> | string
    createdAt?: DateTimeWithAggregatesFilter<"JournalVoucher"> | Date | string
  }

  export type JournalEntryWhereInput = {
    AND?: JournalEntryWhereInput | JournalEntryWhereInput[]
    OR?: JournalEntryWhereInput[]
    NOT?: JournalEntryWhereInput | JournalEntryWhereInput[]
    id?: StringFilter<"JournalEntry"> | string
    date?: DateTimeFilter<"JournalEntry"> | Date | string
    description?: StringFilter<"JournalEntry"> | string
    accountId?: StringFilter<"JournalEntry"> | string
    debit?: FloatFilter<"JournalEntry"> | number
    credit?: FloatFilter<"JournalEntry"> | number
    reference?: StringNullableFilter<"JournalEntry"> | string | null
    journalVoucherId?: StringNullableFilter<"JournalEntry"> | string | null
    createdAt?: DateTimeFilter<"JournalEntry"> | Date | string
    account?: XOR<AccountScalarRelationFilter, AccountWhereInput>
    journalVoucher?: XOR<JournalVoucherNullableScalarRelationFilter, JournalVoucherWhereInput> | null
  }

  export type JournalEntryOrderByWithRelationInput = {
    id?: SortOrder
    date?: SortOrder
    description?: SortOrder
    accountId?: SortOrder
    debit?: SortOrder
    credit?: SortOrder
    reference?: SortOrderInput | SortOrder
    journalVoucherId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    account?: AccountOrderByWithRelationInput
    journalVoucher?: JournalVoucherOrderByWithRelationInput
  }

  export type JournalEntryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: JournalEntryWhereInput | JournalEntryWhereInput[]
    OR?: JournalEntryWhereInput[]
    NOT?: JournalEntryWhereInput | JournalEntryWhereInput[]
    date?: DateTimeFilter<"JournalEntry"> | Date | string
    description?: StringFilter<"JournalEntry"> | string
    accountId?: StringFilter<"JournalEntry"> | string
    debit?: FloatFilter<"JournalEntry"> | number
    credit?: FloatFilter<"JournalEntry"> | number
    reference?: StringNullableFilter<"JournalEntry"> | string | null
    journalVoucherId?: StringNullableFilter<"JournalEntry"> | string | null
    createdAt?: DateTimeFilter<"JournalEntry"> | Date | string
    account?: XOR<AccountScalarRelationFilter, AccountWhereInput>
    journalVoucher?: XOR<JournalVoucherNullableScalarRelationFilter, JournalVoucherWhereInput> | null
  }, "id">

  export type JournalEntryOrderByWithAggregationInput = {
    id?: SortOrder
    date?: SortOrder
    description?: SortOrder
    accountId?: SortOrder
    debit?: SortOrder
    credit?: SortOrder
    reference?: SortOrderInput | SortOrder
    journalVoucherId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: JournalEntryCountOrderByAggregateInput
    _avg?: JournalEntryAvgOrderByAggregateInput
    _max?: JournalEntryMaxOrderByAggregateInput
    _min?: JournalEntryMinOrderByAggregateInput
    _sum?: JournalEntrySumOrderByAggregateInput
  }

  export type JournalEntryScalarWhereWithAggregatesInput = {
    AND?: JournalEntryScalarWhereWithAggregatesInput | JournalEntryScalarWhereWithAggregatesInput[]
    OR?: JournalEntryScalarWhereWithAggregatesInput[]
    NOT?: JournalEntryScalarWhereWithAggregatesInput | JournalEntryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"JournalEntry"> | string
    date?: DateTimeWithAggregatesFilter<"JournalEntry"> | Date | string
    description?: StringWithAggregatesFilter<"JournalEntry"> | string
    accountId?: StringWithAggregatesFilter<"JournalEntry"> | string
    debit?: FloatWithAggregatesFilter<"JournalEntry"> | number
    credit?: FloatWithAggregatesFilter<"JournalEntry"> | number
    reference?: StringNullableWithAggregatesFilter<"JournalEntry"> | string | null
    journalVoucherId?: StringNullableWithAggregatesFilter<"JournalEntry"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"JournalEntry"> | Date | string
  }

  export type CustomerCreateInput = {
    id?: string
    code: string
    name: string
    nameAr?: string | null
    email?: string | null
    phone?: string | null
    address?: string | null
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    invoices?: SalesInvoiceCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUncheckedCreateInput = {
    id?: string
    code: string
    name: string
    nameAr?: string | null
    email?: string | null
    phone?: string | null
    address?: string | null
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    invoices?: SalesInvoiceUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoices?: SalesInvoiceUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoices?: SalesInvoiceUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerCreateManyInput = {
    id?: string
    code: string
    name: string
    nameAr?: string | null
    email?: string | null
    phone?: string | null
    address?: string | null
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CustomerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupplierCreateInput = {
    id?: string
    code: string
    name: string
    nameAr?: string | null
    email?: string | null
    phone?: string | null
    address?: string | null
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    invoices?: PurchaseInvoiceCreateNestedManyWithoutSupplierInput
  }

  export type SupplierUncheckedCreateInput = {
    id?: string
    code: string
    name: string
    nameAr?: string | null
    email?: string | null
    phone?: string | null
    address?: string | null
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    invoices?: PurchaseInvoiceUncheckedCreateNestedManyWithoutSupplierInput
  }

  export type SupplierUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoices?: PurchaseInvoiceUpdateManyWithoutSupplierNestedInput
  }

  export type SupplierUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoices?: PurchaseInvoiceUncheckedUpdateManyWithoutSupplierNestedInput
  }

  export type SupplierCreateManyInput = {
    id?: string
    code: string
    name: string
    nameAr?: string | null
    email?: string | null
    phone?: string | null
    address?: string | null
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SupplierUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupplierUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductCreateInput = {
    id?: string
    sku: string
    name: string
    nameAr?: string | null
    description?: string | null
    category?: string | null
    unit?: string
    costPrice?: number
    salePrice?: number
    stockQuantity?: number
    reorderPoint?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: InvoiceItemCreateNestedManyWithoutProductInput
    purchaseItems?: PurchaseItemCreateNestedManyWithoutProductInput
    inventoryLogs?: InventoryLogCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateInput = {
    id?: string
    sku: string
    name: string
    nameAr?: string | null
    description?: string | null
    category?: string | null
    unit?: string
    costPrice?: number
    salePrice?: number
    stockQuantity?: number
    reorderPoint?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: InvoiceItemUncheckedCreateNestedManyWithoutProductInput
    purchaseItems?: PurchaseItemUncheckedCreateNestedManyWithoutProductInput
    inventoryLogs?: InventoryLogUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    unit?: StringFieldUpdateOperationsInput | string
    costPrice?: FloatFieldUpdateOperationsInput | number
    salePrice?: FloatFieldUpdateOperationsInput | number
    stockQuantity?: FloatFieldUpdateOperationsInput | number
    reorderPoint?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: InvoiceItemUpdateManyWithoutProductNestedInput
    purchaseItems?: PurchaseItemUpdateManyWithoutProductNestedInput
    inventoryLogs?: InventoryLogUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    unit?: StringFieldUpdateOperationsInput | string
    costPrice?: FloatFieldUpdateOperationsInput | number
    salePrice?: FloatFieldUpdateOperationsInput | number
    stockQuantity?: FloatFieldUpdateOperationsInput | number
    reorderPoint?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: InvoiceItemUncheckedUpdateManyWithoutProductNestedInput
    purchaseItems?: PurchaseItemUncheckedUpdateManyWithoutProductNestedInput
    inventoryLogs?: InventoryLogUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ProductCreateManyInput = {
    id?: string
    sku: string
    name: string
    nameAr?: string | null
    description?: string | null
    category?: string | null
    unit?: string
    costPrice?: number
    salePrice?: number
    stockQuantity?: number
    reorderPoint?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProductUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    unit?: StringFieldUpdateOperationsInput | string
    costPrice?: FloatFieldUpdateOperationsInput | number
    salePrice?: FloatFieldUpdateOperationsInput | number
    stockQuantity?: FloatFieldUpdateOperationsInput | number
    reorderPoint?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    unit?: StringFieldUpdateOperationsInput | string
    costPrice?: FloatFieldUpdateOperationsInput | number
    salePrice?: FloatFieldUpdateOperationsInput | number
    stockQuantity?: FloatFieldUpdateOperationsInput | number
    reorderPoint?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SalesInvoiceCreateInput = {
    id?: string
    invoiceNumber: string
    date: Date | string
    totalAmount: number
    taxAmount?: number
    discount?: number
    netAmount: number
    status: string
    createdAt?: Date | string
    updatedAt?: Date | string
    customer: CustomerCreateNestedOneWithoutInvoicesInput
    items?: InvoiceItemCreateNestedManyWithoutInvoiceInput
    journalVoucher?: JournalVoucherCreateNestedOneWithoutInvoicesInput
  }

  export type SalesInvoiceUncheckedCreateInput = {
    id?: string
    invoiceNumber: string
    date: Date | string
    customerId: string
    totalAmount: number
    taxAmount?: number
    discount?: number
    netAmount: number
    status: string
    journalVoucherId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: InvoiceItemUncheckedCreateNestedManyWithoutInvoiceInput
  }

  export type SalesInvoiceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    netAmount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUpdateOneRequiredWithoutInvoicesNestedInput
    items?: InvoiceItemUpdateManyWithoutInvoiceNestedInput
    journalVoucher?: JournalVoucherUpdateOneWithoutInvoicesNestedInput
  }

  export type SalesInvoiceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    customerId?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    netAmount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    journalVoucherId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: InvoiceItemUncheckedUpdateManyWithoutInvoiceNestedInput
  }

  export type SalesInvoiceCreateManyInput = {
    id?: string
    invoiceNumber: string
    date: Date | string
    customerId: string
    totalAmount: number
    taxAmount?: number
    discount?: number
    netAmount: number
    status: string
    journalVoucherId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SalesInvoiceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    netAmount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SalesInvoiceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    customerId?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    netAmount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    journalVoucherId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PurchaseInvoiceCreateInput = {
    id?: string
    invoiceNumber: string
    date: Date | string
    totalAmount: number
    taxAmount?: number
    discount?: number
    netAmount: number
    status: string
    createdAt?: Date | string
    updatedAt?: Date | string
    supplier: SupplierCreateNestedOneWithoutInvoicesInput
    items?: PurchaseItemCreateNestedManyWithoutInvoiceInput
    journalVoucher?: JournalVoucherCreateNestedOneWithoutPurchaseInvoicesInput
  }

  export type PurchaseInvoiceUncheckedCreateInput = {
    id?: string
    invoiceNumber: string
    date: Date | string
    supplierId: string
    totalAmount: number
    taxAmount?: number
    discount?: number
    netAmount: number
    status: string
    journalVoucherId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: PurchaseItemUncheckedCreateNestedManyWithoutInvoiceInput
  }

  export type PurchaseInvoiceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    netAmount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    supplier?: SupplierUpdateOneRequiredWithoutInvoicesNestedInput
    items?: PurchaseItemUpdateManyWithoutInvoiceNestedInput
    journalVoucher?: JournalVoucherUpdateOneWithoutPurchaseInvoicesNestedInput
  }

  export type PurchaseInvoiceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    supplierId?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    netAmount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    journalVoucherId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: PurchaseItemUncheckedUpdateManyWithoutInvoiceNestedInput
  }

  export type PurchaseInvoiceCreateManyInput = {
    id?: string
    invoiceNumber: string
    date: Date | string
    supplierId: string
    totalAmount: number
    taxAmount?: number
    discount?: number
    netAmount: number
    status: string
    journalVoucherId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PurchaseInvoiceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    netAmount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PurchaseInvoiceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    supplierId?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    netAmount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    journalVoucherId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceItemCreateInput = {
    id?: string
    quantity: number
    unitPrice: number
    total: number
    invoice: SalesInvoiceCreateNestedOneWithoutItemsInput
    product: ProductCreateNestedOneWithoutItemsInput
  }

  export type InvoiceItemUncheckedCreateInput = {
    id?: string
    invoiceId: string
    productId: string
    quantity: number
    unitPrice: number
    total: number
  }

  export type InvoiceItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    invoice?: SalesInvoiceUpdateOneRequiredWithoutItemsNestedInput
    product?: ProductUpdateOneRequiredWithoutItemsNestedInput
  }

  export type InvoiceItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
  }

  export type InvoiceItemCreateManyInput = {
    id?: string
    invoiceId: string
    productId: string
    quantity: number
    unitPrice: number
    total: number
  }

  export type InvoiceItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
  }

  export type InvoiceItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
  }

  export type PurchaseItemCreateInput = {
    id?: string
    quantity: number
    unitPrice: number
    total: number
    invoice: PurchaseInvoiceCreateNestedOneWithoutItemsInput
    product: ProductCreateNestedOneWithoutPurchaseItemsInput
  }

  export type PurchaseItemUncheckedCreateInput = {
    id?: string
    invoiceId: string
    productId: string
    quantity: number
    unitPrice: number
    total: number
  }

  export type PurchaseItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    invoice?: PurchaseInvoiceUpdateOneRequiredWithoutItemsNestedInput
    product?: ProductUpdateOneRequiredWithoutPurchaseItemsNestedInput
  }

  export type PurchaseItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
  }

  export type PurchaseItemCreateManyInput = {
    id?: string
    invoiceId: string
    productId: string
    quantity: number
    unitPrice: number
    total: number
  }

  export type PurchaseItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
  }

  export type PurchaseItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
  }

  export type InventoryLogCreateInput = {
    id?: string
    date?: Date | string
    type: string
    quantity: number
    referenceId?: string | null
    description?: string | null
    product: ProductCreateNestedOneWithoutInventoryLogsInput
  }

  export type InventoryLogUncheckedCreateInput = {
    id?: string
    productId: string
    date?: Date | string
    type: string
    quantity: number
    referenceId?: string | null
    description?: string | null
  }

  export type InventoryLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    product?: ProductUpdateOneRequiredWithoutInventoryLogsNestedInput
  }

  export type InventoryLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type InventoryLogCreateManyInput = {
    id?: string
    productId: string
    date?: Date | string
    type: string
    quantity: number
    referenceId?: string | null
    description?: string | null
  }

  export type InventoryLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type InventoryLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountCreateInput = {
    id?: string
    code: string
    name: string
    nameAr?: string | null
    type: string
    createdAt?: Date | string
    updatedAt?: Date | string
    parent?: AccountCreateNestedOneWithoutChildrenInput
    children?: AccountCreateNestedManyWithoutParentInput
    entries?: JournalEntryCreateNestedManyWithoutAccountInput
  }

  export type AccountUncheckedCreateInput = {
    id?: string
    code: string
    name: string
    nameAr?: string | null
    type: string
    parentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: AccountUncheckedCreateNestedManyWithoutParentInput
    entries?: JournalEntryUncheckedCreateNestedManyWithoutAccountInput
  }

  export type AccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: AccountUpdateOneWithoutChildrenNestedInput
    children?: AccountUpdateManyWithoutParentNestedInput
    entries?: JournalEntryUpdateManyWithoutAccountNestedInput
  }

  export type AccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: AccountUncheckedUpdateManyWithoutParentNestedInput
    entries?: JournalEntryUncheckedUpdateManyWithoutAccountNestedInput
  }

  export type AccountCreateManyInput = {
    id?: string
    code: string
    name: string
    nameAr?: string | null
    type: string
    parentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JournalVoucherCreateInput = {
    id?: string
    reference: string
    date: Date | string
    description: string
    status?: string
    createdAt?: Date | string
    entries?: JournalEntryCreateNestedManyWithoutJournalVoucherInput
    invoices?: SalesInvoiceCreateNestedManyWithoutJournalVoucherInput
    purchaseInvoices?: PurchaseInvoiceCreateNestedManyWithoutJournalVoucherInput
  }

  export type JournalVoucherUncheckedCreateInput = {
    id?: string
    reference: string
    date: Date | string
    description: string
    status?: string
    createdAt?: Date | string
    entries?: JournalEntryUncheckedCreateNestedManyWithoutJournalVoucherInput
    invoices?: SalesInvoiceUncheckedCreateNestedManyWithoutJournalVoucherInput
    purchaseInvoices?: PurchaseInvoiceUncheckedCreateNestedManyWithoutJournalVoucherInput
  }

  export type JournalVoucherUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    reference?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entries?: JournalEntryUpdateManyWithoutJournalVoucherNestedInput
    invoices?: SalesInvoiceUpdateManyWithoutJournalVoucherNestedInput
    purchaseInvoices?: PurchaseInvoiceUpdateManyWithoutJournalVoucherNestedInput
  }

  export type JournalVoucherUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    reference?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entries?: JournalEntryUncheckedUpdateManyWithoutJournalVoucherNestedInput
    invoices?: SalesInvoiceUncheckedUpdateManyWithoutJournalVoucherNestedInput
    purchaseInvoices?: PurchaseInvoiceUncheckedUpdateManyWithoutJournalVoucherNestedInput
  }

  export type JournalVoucherCreateManyInput = {
    id?: string
    reference: string
    date: Date | string
    description: string
    status?: string
    createdAt?: Date | string
  }

  export type JournalVoucherUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    reference?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JournalVoucherUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    reference?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JournalEntryCreateInput = {
    id?: string
    date: Date | string
    description: string
    debit?: number
    credit?: number
    reference?: string | null
    createdAt?: Date | string
    account: AccountCreateNestedOneWithoutEntriesInput
    journalVoucher?: JournalVoucherCreateNestedOneWithoutEntriesInput
  }

  export type JournalEntryUncheckedCreateInput = {
    id?: string
    date: Date | string
    description: string
    accountId: string
    debit?: number
    credit?: number
    reference?: string | null
    journalVoucherId?: string | null
    createdAt?: Date | string
  }

  export type JournalEntryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    debit?: FloatFieldUpdateOperationsInput | number
    credit?: FloatFieldUpdateOperationsInput | number
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: AccountUpdateOneRequiredWithoutEntriesNestedInput
    journalVoucher?: JournalVoucherUpdateOneWithoutEntriesNestedInput
  }

  export type JournalEntryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    debit?: FloatFieldUpdateOperationsInput | number
    credit?: FloatFieldUpdateOperationsInput | number
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    journalVoucherId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JournalEntryCreateManyInput = {
    id?: string
    date: Date | string
    description: string
    accountId: string
    debit?: number
    credit?: number
    reference?: string | null
    journalVoucherId?: string | null
    createdAt?: Date | string
  }

  export type JournalEntryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    debit?: FloatFieldUpdateOperationsInput | number
    credit?: FloatFieldUpdateOperationsInput | number
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JournalEntryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    debit?: FloatFieldUpdateOperationsInput | number
    credit?: FloatFieldUpdateOperationsInput | number
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    journalVoucherId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SalesInvoiceListRelationFilter = {
    every?: SalesInvoiceWhereInput
    some?: SalesInvoiceWhereInput
    none?: SalesInvoiceWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type SalesInvoiceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CustomerCountOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    nameAr?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    balance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomerAvgOrderByAggregateInput = {
    balance?: SortOrder
  }

  export type CustomerMaxOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    nameAr?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    balance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomerMinOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    nameAr?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    balance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomerSumOrderByAggregateInput = {
    balance?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type PurchaseInvoiceListRelationFilter = {
    every?: PurchaseInvoiceWhereInput
    some?: PurchaseInvoiceWhereInput
    none?: PurchaseInvoiceWhereInput
  }

  export type PurchaseInvoiceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SupplierCountOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    nameAr?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    balance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SupplierAvgOrderByAggregateInput = {
    balance?: SortOrder
  }

  export type SupplierMaxOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    nameAr?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    balance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SupplierMinOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    nameAr?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    balance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SupplierSumOrderByAggregateInput = {
    balance?: SortOrder
  }

  export type InvoiceItemListRelationFilter = {
    every?: InvoiceItemWhereInput
    some?: InvoiceItemWhereInput
    none?: InvoiceItemWhereInput
  }

  export type PurchaseItemListRelationFilter = {
    every?: PurchaseItemWhereInput
    some?: PurchaseItemWhereInput
    none?: PurchaseItemWhereInput
  }

  export type InventoryLogListRelationFilter = {
    every?: InventoryLogWhereInput
    some?: InventoryLogWhereInput
    none?: InventoryLogWhereInput
  }

  export type InvoiceItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PurchaseItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InventoryLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProductCountOrderByAggregateInput = {
    id?: SortOrder
    sku?: SortOrder
    name?: SortOrder
    nameAr?: SortOrder
    description?: SortOrder
    category?: SortOrder
    unit?: SortOrder
    costPrice?: SortOrder
    salePrice?: SortOrder
    stockQuantity?: SortOrder
    reorderPoint?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductAvgOrderByAggregateInput = {
    costPrice?: SortOrder
    salePrice?: SortOrder
    stockQuantity?: SortOrder
    reorderPoint?: SortOrder
  }

  export type ProductMaxOrderByAggregateInput = {
    id?: SortOrder
    sku?: SortOrder
    name?: SortOrder
    nameAr?: SortOrder
    description?: SortOrder
    category?: SortOrder
    unit?: SortOrder
    costPrice?: SortOrder
    salePrice?: SortOrder
    stockQuantity?: SortOrder
    reorderPoint?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductMinOrderByAggregateInput = {
    id?: SortOrder
    sku?: SortOrder
    name?: SortOrder
    nameAr?: SortOrder
    description?: SortOrder
    category?: SortOrder
    unit?: SortOrder
    costPrice?: SortOrder
    salePrice?: SortOrder
    stockQuantity?: SortOrder
    reorderPoint?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductSumOrderByAggregateInput = {
    costPrice?: SortOrder
    salePrice?: SortOrder
    stockQuantity?: SortOrder
    reorderPoint?: SortOrder
  }

  export type CustomerScalarRelationFilter = {
    is?: CustomerWhereInput
    isNot?: CustomerWhereInput
  }

  export type JournalVoucherNullableScalarRelationFilter = {
    is?: JournalVoucherWhereInput | null
    isNot?: JournalVoucherWhereInput | null
  }

  export type SalesInvoiceCountOrderByAggregateInput = {
    id?: SortOrder
    invoiceNumber?: SortOrder
    date?: SortOrder
    customerId?: SortOrder
    totalAmount?: SortOrder
    taxAmount?: SortOrder
    discount?: SortOrder
    netAmount?: SortOrder
    status?: SortOrder
    journalVoucherId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SalesInvoiceAvgOrderByAggregateInput = {
    totalAmount?: SortOrder
    taxAmount?: SortOrder
    discount?: SortOrder
    netAmount?: SortOrder
  }

  export type SalesInvoiceMaxOrderByAggregateInput = {
    id?: SortOrder
    invoiceNumber?: SortOrder
    date?: SortOrder
    customerId?: SortOrder
    totalAmount?: SortOrder
    taxAmount?: SortOrder
    discount?: SortOrder
    netAmount?: SortOrder
    status?: SortOrder
    journalVoucherId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SalesInvoiceMinOrderByAggregateInput = {
    id?: SortOrder
    invoiceNumber?: SortOrder
    date?: SortOrder
    customerId?: SortOrder
    totalAmount?: SortOrder
    taxAmount?: SortOrder
    discount?: SortOrder
    netAmount?: SortOrder
    status?: SortOrder
    journalVoucherId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SalesInvoiceSumOrderByAggregateInput = {
    totalAmount?: SortOrder
    taxAmount?: SortOrder
    discount?: SortOrder
    netAmount?: SortOrder
  }

  export type SupplierScalarRelationFilter = {
    is?: SupplierWhereInput
    isNot?: SupplierWhereInput
  }

  export type PurchaseInvoiceCountOrderByAggregateInput = {
    id?: SortOrder
    invoiceNumber?: SortOrder
    date?: SortOrder
    supplierId?: SortOrder
    totalAmount?: SortOrder
    taxAmount?: SortOrder
    discount?: SortOrder
    netAmount?: SortOrder
    status?: SortOrder
    journalVoucherId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PurchaseInvoiceAvgOrderByAggregateInput = {
    totalAmount?: SortOrder
    taxAmount?: SortOrder
    discount?: SortOrder
    netAmount?: SortOrder
  }

  export type PurchaseInvoiceMaxOrderByAggregateInput = {
    id?: SortOrder
    invoiceNumber?: SortOrder
    date?: SortOrder
    supplierId?: SortOrder
    totalAmount?: SortOrder
    taxAmount?: SortOrder
    discount?: SortOrder
    netAmount?: SortOrder
    status?: SortOrder
    journalVoucherId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PurchaseInvoiceMinOrderByAggregateInput = {
    id?: SortOrder
    invoiceNumber?: SortOrder
    date?: SortOrder
    supplierId?: SortOrder
    totalAmount?: SortOrder
    taxAmount?: SortOrder
    discount?: SortOrder
    netAmount?: SortOrder
    status?: SortOrder
    journalVoucherId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PurchaseInvoiceSumOrderByAggregateInput = {
    totalAmount?: SortOrder
    taxAmount?: SortOrder
    discount?: SortOrder
    netAmount?: SortOrder
  }

  export type SalesInvoiceScalarRelationFilter = {
    is?: SalesInvoiceWhereInput
    isNot?: SalesInvoiceWhereInput
  }

  export type ProductScalarRelationFilter = {
    is?: ProductWhereInput
    isNot?: ProductWhereInput
  }

  export type InvoiceItemCountOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    total?: SortOrder
  }

  export type InvoiceItemAvgOrderByAggregateInput = {
    quantity?: SortOrder
    unitPrice?: SortOrder
    total?: SortOrder
  }

  export type InvoiceItemMaxOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    total?: SortOrder
  }

  export type InvoiceItemMinOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    total?: SortOrder
  }

  export type InvoiceItemSumOrderByAggregateInput = {
    quantity?: SortOrder
    unitPrice?: SortOrder
    total?: SortOrder
  }

  export type PurchaseInvoiceScalarRelationFilter = {
    is?: PurchaseInvoiceWhereInput
    isNot?: PurchaseInvoiceWhereInput
  }

  export type PurchaseItemCountOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    total?: SortOrder
  }

  export type PurchaseItemAvgOrderByAggregateInput = {
    quantity?: SortOrder
    unitPrice?: SortOrder
    total?: SortOrder
  }

  export type PurchaseItemMaxOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    total?: SortOrder
  }

  export type PurchaseItemMinOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    total?: SortOrder
  }

  export type PurchaseItemSumOrderByAggregateInput = {
    quantity?: SortOrder
    unitPrice?: SortOrder
    total?: SortOrder
  }

  export type InventoryLogCountOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    date?: SortOrder
    type?: SortOrder
    quantity?: SortOrder
    referenceId?: SortOrder
    description?: SortOrder
  }

  export type InventoryLogAvgOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type InventoryLogMaxOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    date?: SortOrder
    type?: SortOrder
    quantity?: SortOrder
    referenceId?: SortOrder
    description?: SortOrder
  }

  export type InventoryLogMinOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    date?: SortOrder
    type?: SortOrder
    quantity?: SortOrder
    referenceId?: SortOrder
    description?: SortOrder
  }

  export type InventoryLogSumOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type AccountNullableScalarRelationFilter = {
    is?: AccountWhereInput | null
    isNot?: AccountWhereInput | null
  }

  export type AccountListRelationFilter = {
    every?: AccountWhereInput
    some?: AccountWhereInput
    none?: AccountWhereInput
  }

  export type JournalEntryListRelationFilter = {
    every?: JournalEntryWhereInput
    some?: JournalEntryWhereInput
    none?: JournalEntryWhereInput
  }

  export type AccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type JournalEntryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AccountCountOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    nameAr?: SortOrder
    type?: SortOrder
    parentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountMaxOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    nameAr?: SortOrder
    type?: SortOrder
    parentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountMinOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    nameAr?: SortOrder
    type?: SortOrder
    parentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type JournalVoucherCountOrderByAggregateInput = {
    id?: SortOrder
    reference?: SortOrder
    date?: SortOrder
    description?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type JournalVoucherMaxOrderByAggregateInput = {
    id?: SortOrder
    reference?: SortOrder
    date?: SortOrder
    description?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type JournalVoucherMinOrderByAggregateInput = {
    id?: SortOrder
    reference?: SortOrder
    date?: SortOrder
    description?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type AccountScalarRelationFilter = {
    is?: AccountWhereInput
    isNot?: AccountWhereInput
  }

  export type JournalEntryCountOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    description?: SortOrder
    accountId?: SortOrder
    debit?: SortOrder
    credit?: SortOrder
    reference?: SortOrder
    journalVoucherId?: SortOrder
    createdAt?: SortOrder
  }

  export type JournalEntryAvgOrderByAggregateInput = {
    debit?: SortOrder
    credit?: SortOrder
  }

  export type JournalEntryMaxOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    description?: SortOrder
    accountId?: SortOrder
    debit?: SortOrder
    credit?: SortOrder
    reference?: SortOrder
    journalVoucherId?: SortOrder
    createdAt?: SortOrder
  }

  export type JournalEntryMinOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    description?: SortOrder
    accountId?: SortOrder
    debit?: SortOrder
    credit?: SortOrder
    reference?: SortOrder
    journalVoucherId?: SortOrder
    createdAt?: SortOrder
  }

  export type JournalEntrySumOrderByAggregateInput = {
    debit?: SortOrder
    credit?: SortOrder
  }

  export type SalesInvoiceCreateNestedManyWithoutCustomerInput = {
    create?: XOR<SalesInvoiceCreateWithoutCustomerInput, SalesInvoiceUncheckedCreateWithoutCustomerInput> | SalesInvoiceCreateWithoutCustomerInput[] | SalesInvoiceUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: SalesInvoiceCreateOrConnectWithoutCustomerInput | SalesInvoiceCreateOrConnectWithoutCustomerInput[]
    createMany?: SalesInvoiceCreateManyCustomerInputEnvelope
    connect?: SalesInvoiceWhereUniqueInput | SalesInvoiceWhereUniqueInput[]
  }

  export type SalesInvoiceUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: XOR<SalesInvoiceCreateWithoutCustomerInput, SalesInvoiceUncheckedCreateWithoutCustomerInput> | SalesInvoiceCreateWithoutCustomerInput[] | SalesInvoiceUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: SalesInvoiceCreateOrConnectWithoutCustomerInput | SalesInvoiceCreateOrConnectWithoutCustomerInput[]
    createMany?: SalesInvoiceCreateManyCustomerInputEnvelope
    connect?: SalesInvoiceWhereUniqueInput | SalesInvoiceWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type SalesInvoiceUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<SalesInvoiceCreateWithoutCustomerInput, SalesInvoiceUncheckedCreateWithoutCustomerInput> | SalesInvoiceCreateWithoutCustomerInput[] | SalesInvoiceUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: SalesInvoiceCreateOrConnectWithoutCustomerInput | SalesInvoiceCreateOrConnectWithoutCustomerInput[]
    upsert?: SalesInvoiceUpsertWithWhereUniqueWithoutCustomerInput | SalesInvoiceUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: SalesInvoiceCreateManyCustomerInputEnvelope
    set?: SalesInvoiceWhereUniqueInput | SalesInvoiceWhereUniqueInput[]
    disconnect?: SalesInvoiceWhereUniqueInput | SalesInvoiceWhereUniqueInput[]
    delete?: SalesInvoiceWhereUniqueInput | SalesInvoiceWhereUniqueInput[]
    connect?: SalesInvoiceWhereUniqueInput | SalesInvoiceWhereUniqueInput[]
    update?: SalesInvoiceUpdateWithWhereUniqueWithoutCustomerInput | SalesInvoiceUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: SalesInvoiceUpdateManyWithWhereWithoutCustomerInput | SalesInvoiceUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: SalesInvoiceScalarWhereInput | SalesInvoiceScalarWhereInput[]
  }

  export type SalesInvoiceUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<SalesInvoiceCreateWithoutCustomerInput, SalesInvoiceUncheckedCreateWithoutCustomerInput> | SalesInvoiceCreateWithoutCustomerInput[] | SalesInvoiceUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: SalesInvoiceCreateOrConnectWithoutCustomerInput | SalesInvoiceCreateOrConnectWithoutCustomerInput[]
    upsert?: SalesInvoiceUpsertWithWhereUniqueWithoutCustomerInput | SalesInvoiceUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: SalesInvoiceCreateManyCustomerInputEnvelope
    set?: SalesInvoiceWhereUniqueInput | SalesInvoiceWhereUniqueInput[]
    disconnect?: SalesInvoiceWhereUniqueInput | SalesInvoiceWhereUniqueInput[]
    delete?: SalesInvoiceWhereUniqueInput | SalesInvoiceWhereUniqueInput[]
    connect?: SalesInvoiceWhereUniqueInput | SalesInvoiceWhereUniqueInput[]
    update?: SalesInvoiceUpdateWithWhereUniqueWithoutCustomerInput | SalesInvoiceUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: SalesInvoiceUpdateManyWithWhereWithoutCustomerInput | SalesInvoiceUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: SalesInvoiceScalarWhereInput | SalesInvoiceScalarWhereInput[]
  }

  export type PurchaseInvoiceCreateNestedManyWithoutSupplierInput = {
    create?: XOR<PurchaseInvoiceCreateWithoutSupplierInput, PurchaseInvoiceUncheckedCreateWithoutSupplierInput> | PurchaseInvoiceCreateWithoutSupplierInput[] | PurchaseInvoiceUncheckedCreateWithoutSupplierInput[]
    connectOrCreate?: PurchaseInvoiceCreateOrConnectWithoutSupplierInput | PurchaseInvoiceCreateOrConnectWithoutSupplierInput[]
    createMany?: PurchaseInvoiceCreateManySupplierInputEnvelope
    connect?: PurchaseInvoiceWhereUniqueInput | PurchaseInvoiceWhereUniqueInput[]
  }

  export type PurchaseInvoiceUncheckedCreateNestedManyWithoutSupplierInput = {
    create?: XOR<PurchaseInvoiceCreateWithoutSupplierInput, PurchaseInvoiceUncheckedCreateWithoutSupplierInput> | PurchaseInvoiceCreateWithoutSupplierInput[] | PurchaseInvoiceUncheckedCreateWithoutSupplierInput[]
    connectOrCreate?: PurchaseInvoiceCreateOrConnectWithoutSupplierInput | PurchaseInvoiceCreateOrConnectWithoutSupplierInput[]
    createMany?: PurchaseInvoiceCreateManySupplierInputEnvelope
    connect?: PurchaseInvoiceWhereUniqueInput | PurchaseInvoiceWhereUniqueInput[]
  }

  export type PurchaseInvoiceUpdateManyWithoutSupplierNestedInput = {
    create?: XOR<PurchaseInvoiceCreateWithoutSupplierInput, PurchaseInvoiceUncheckedCreateWithoutSupplierInput> | PurchaseInvoiceCreateWithoutSupplierInput[] | PurchaseInvoiceUncheckedCreateWithoutSupplierInput[]
    connectOrCreate?: PurchaseInvoiceCreateOrConnectWithoutSupplierInput | PurchaseInvoiceCreateOrConnectWithoutSupplierInput[]
    upsert?: PurchaseInvoiceUpsertWithWhereUniqueWithoutSupplierInput | PurchaseInvoiceUpsertWithWhereUniqueWithoutSupplierInput[]
    createMany?: PurchaseInvoiceCreateManySupplierInputEnvelope
    set?: PurchaseInvoiceWhereUniqueInput | PurchaseInvoiceWhereUniqueInput[]
    disconnect?: PurchaseInvoiceWhereUniqueInput | PurchaseInvoiceWhereUniqueInput[]
    delete?: PurchaseInvoiceWhereUniqueInput | PurchaseInvoiceWhereUniqueInput[]
    connect?: PurchaseInvoiceWhereUniqueInput | PurchaseInvoiceWhereUniqueInput[]
    update?: PurchaseInvoiceUpdateWithWhereUniqueWithoutSupplierInput | PurchaseInvoiceUpdateWithWhereUniqueWithoutSupplierInput[]
    updateMany?: PurchaseInvoiceUpdateManyWithWhereWithoutSupplierInput | PurchaseInvoiceUpdateManyWithWhereWithoutSupplierInput[]
    deleteMany?: PurchaseInvoiceScalarWhereInput | PurchaseInvoiceScalarWhereInput[]
  }

  export type PurchaseInvoiceUncheckedUpdateManyWithoutSupplierNestedInput = {
    create?: XOR<PurchaseInvoiceCreateWithoutSupplierInput, PurchaseInvoiceUncheckedCreateWithoutSupplierInput> | PurchaseInvoiceCreateWithoutSupplierInput[] | PurchaseInvoiceUncheckedCreateWithoutSupplierInput[]
    connectOrCreate?: PurchaseInvoiceCreateOrConnectWithoutSupplierInput | PurchaseInvoiceCreateOrConnectWithoutSupplierInput[]
    upsert?: PurchaseInvoiceUpsertWithWhereUniqueWithoutSupplierInput | PurchaseInvoiceUpsertWithWhereUniqueWithoutSupplierInput[]
    createMany?: PurchaseInvoiceCreateManySupplierInputEnvelope
    set?: PurchaseInvoiceWhereUniqueInput | PurchaseInvoiceWhereUniqueInput[]
    disconnect?: PurchaseInvoiceWhereUniqueInput | PurchaseInvoiceWhereUniqueInput[]
    delete?: PurchaseInvoiceWhereUniqueInput | PurchaseInvoiceWhereUniqueInput[]
    connect?: PurchaseInvoiceWhereUniqueInput | PurchaseInvoiceWhereUniqueInput[]
    update?: PurchaseInvoiceUpdateWithWhereUniqueWithoutSupplierInput | PurchaseInvoiceUpdateWithWhereUniqueWithoutSupplierInput[]
    updateMany?: PurchaseInvoiceUpdateManyWithWhereWithoutSupplierInput | PurchaseInvoiceUpdateManyWithWhereWithoutSupplierInput[]
    deleteMany?: PurchaseInvoiceScalarWhereInput | PurchaseInvoiceScalarWhereInput[]
  }

  export type InvoiceItemCreateNestedManyWithoutProductInput = {
    create?: XOR<InvoiceItemCreateWithoutProductInput, InvoiceItemUncheckedCreateWithoutProductInput> | InvoiceItemCreateWithoutProductInput[] | InvoiceItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: InvoiceItemCreateOrConnectWithoutProductInput | InvoiceItemCreateOrConnectWithoutProductInput[]
    createMany?: InvoiceItemCreateManyProductInputEnvelope
    connect?: InvoiceItemWhereUniqueInput | InvoiceItemWhereUniqueInput[]
  }

  export type PurchaseItemCreateNestedManyWithoutProductInput = {
    create?: XOR<PurchaseItemCreateWithoutProductInput, PurchaseItemUncheckedCreateWithoutProductInput> | PurchaseItemCreateWithoutProductInput[] | PurchaseItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: PurchaseItemCreateOrConnectWithoutProductInput | PurchaseItemCreateOrConnectWithoutProductInput[]
    createMany?: PurchaseItemCreateManyProductInputEnvelope
    connect?: PurchaseItemWhereUniqueInput | PurchaseItemWhereUniqueInput[]
  }

  export type InventoryLogCreateNestedManyWithoutProductInput = {
    create?: XOR<InventoryLogCreateWithoutProductInput, InventoryLogUncheckedCreateWithoutProductInput> | InventoryLogCreateWithoutProductInput[] | InventoryLogUncheckedCreateWithoutProductInput[]
    connectOrCreate?: InventoryLogCreateOrConnectWithoutProductInput | InventoryLogCreateOrConnectWithoutProductInput[]
    createMany?: InventoryLogCreateManyProductInputEnvelope
    connect?: InventoryLogWhereUniqueInput | InventoryLogWhereUniqueInput[]
  }

  export type InvoiceItemUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<InvoiceItemCreateWithoutProductInput, InvoiceItemUncheckedCreateWithoutProductInput> | InvoiceItemCreateWithoutProductInput[] | InvoiceItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: InvoiceItemCreateOrConnectWithoutProductInput | InvoiceItemCreateOrConnectWithoutProductInput[]
    createMany?: InvoiceItemCreateManyProductInputEnvelope
    connect?: InvoiceItemWhereUniqueInput | InvoiceItemWhereUniqueInput[]
  }

  export type PurchaseItemUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<PurchaseItemCreateWithoutProductInput, PurchaseItemUncheckedCreateWithoutProductInput> | PurchaseItemCreateWithoutProductInput[] | PurchaseItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: PurchaseItemCreateOrConnectWithoutProductInput | PurchaseItemCreateOrConnectWithoutProductInput[]
    createMany?: PurchaseItemCreateManyProductInputEnvelope
    connect?: PurchaseItemWhereUniqueInput | PurchaseItemWhereUniqueInput[]
  }

  export type InventoryLogUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<InventoryLogCreateWithoutProductInput, InventoryLogUncheckedCreateWithoutProductInput> | InventoryLogCreateWithoutProductInput[] | InventoryLogUncheckedCreateWithoutProductInput[]
    connectOrCreate?: InventoryLogCreateOrConnectWithoutProductInput | InventoryLogCreateOrConnectWithoutProductInput[]
    createMany?: InventoryLogCreateManyProductInputEnvelope
    connect?: InventoryLogWhereUniqueInput | InventoryLogWhereUniqueInput[]
  }

  export type InvoiceItemUpdateManyWithoutProductNestedInput = {
    create?: XOR<InvoiceItemCreateWithoutProductInput, InvoiceItemUncheckedCreateWithoutProductInput> | InvoiceItemCreateWithoutProductInput[] | InvoiceItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: InvoiceItemCreateOrConnectWithoutProductInput | InvoiceItemCreateOrConnectWithoutProductInput[]
    upsert?: InvoiceItemUpsertWithWhereUniqueWithoutProductInput | InvoiceItemUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: InvoiceItemCreateManyProductInputEnvelope
    set?: InvoiceItemWhereUniqueInput | InvoiceItemWhereUniqueInput[]
    disconnect?: InvoiceItemWhereUniqueInput | InvoiceItemWhereUniqueInput[]
    delete?: InvoiceItemWhereUniqueInput | InvoiceItemWhereUniqueInput[]
    connect?: InvoiceItemWhereUniqueInput | InvoiceItemWhereUniqueInput[]
    update?: InvoiceItemUpdateWithWhereUniqueWithoutProductInput | InvoiceItemUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: InvoiceItemUpdateManyWithWhereWithoutProductInput | InvoiceItemUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: InvoiceItemScalarWhereInput | InvoiceItemScalarWhereInput[]
  }

  export type PurchaseItemUpdateManyWithoutProductNestedInput = {
    create?: XOR<PurchaseItemCreateWithoutProductInput, PurchaseItemUncheckedCreateWithoutProductInput> | PurchaseItemCreateWithoutProductInput[] | PurchaseItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: PurchaseItemCreateOrConnectWithoutProductInput | PurchaseItemCreateOrConnectWithoutProductInput[]
    upsert?: PurchaseItemUpsertWithWhereUniqueWithoutProductInput | PurchaseItemUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: PurchaseItemCreateManyProductInputEnvelope
    set?: PurchaseItemWhereUniqueInput | PurchaseItemWhereUniqueInput[]
    disconnect?: PurchaseItemWhereUniqueInput | PurchaseItemWhereUniqueInput[]
    delete?: PurchaseItemWhereUniqueInput | PurchaseItemWhereUniqueInput[]
    connect?: PurchaseItemWhereUniqueInput | PurchaseItemWhereUniqueInput[]
    update?: PurchaseItemUpdateWithWhereUniqueWithoutProductInput | PurchaseItemUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: PurchaseItemUpdateManyWithWhereWithoutProductInput | PurchaseItemUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: PurchaseItemScalarWhereInput | PurchaseItemScalarWhereInput[]
  }

  export type InventoryLogUpdateManyWithoutProductNestedInput = {
    create?: XOR<InventoryLogCreateWithoutProductInput, InventoryLogUncheckedCreateWithoutProductInput> | InventoryLogCreateWithoutProductInput[] | InventoryLogUncheckedCreateWithoutProductInput[]
    connectOrCreate?: InventoryLogCreateOrConnectWithoutProductInput | InventoryLogCreateOrConnectWithoutProductInput[]
    upsert?: InventoryLogUpsertWithWhereUniqueWithoutProductInput | InventoryLogUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: InventoryLogCreateManyProductInputEnvelope
    set?: InventoryLogWhereUniqueInput | InventoryLogWhereUniqueInput[]
    disconnect?: InventoryLogWhereUniqueInput | InventoryLogWhereUniqueInput[]
    delete?: InventoryLogWhereUniqueInput | InventoryLogWhereUniqueInput[]
    connect?: InventoryLogWhereUniqueInput | InventoryLogWhereUniqueInput[]
    update?: InventoryLogUpdateWithWhereUniqueWithoutProductInput | InventoryLogUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: InventoryLogUpdateManyWithWhereWithoutProductInput | InventoryLogUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: InventoryLogScalarWhereInput | InventoryLogScalarWhereInput[]
  }

  export type InvoiceItemUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<InvoiceItemCreateWithoutProductInput, InvoiceItemUncheckedCreateWithoutProductInput> | InvoiceItemCreateWithoutProductInput[] | InvoiceItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: InvoiceItemCreateOrConnectWithoutProductInput | InvoiceItemCreateOrConnectWithoutProductInput[]
    upsert?: InvoiceItemUpsertWithWhereUniqueWithoutProductInput | InvoiceItemUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: InvoiceItemCreateManyProductInputEnvelope
    set?: InvoiceItemWhereUniqueInput | InvoiceItemWhereUniqueInput[]
    disconnect?: InvoiceItemWhereUniqueInput | InvoiceItemWhereUniqueInput[]
    delete?: InvoiceItemWhereUniqueInput | InvoiceItemWhereUniqueInput[]
    connect?: InvoiceItemWhereUniqueInput | InvoiceItemWhereUniqueInput[]
    update?: InvoiceItemUpdateWithWhereUniqueWithoutProductInput | InvoiceItemUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: InvoiceItemUpdateManyWithWhereWithoutProductInput | InvoiceItemUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: InvoiceItemScalarWhereInput | InvoiceItemScalarWhereInput[]
  }

  export type PurchaseItemUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<PurchaseItemCreateWithoutProductInput, PurchaseItemUncheckedCreateWithoutProductInput> | PurchaseItemCreateWithoutProductInput[] | PurchaseItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: PurchaseItemCreateOrConnectWithoutProductInput | PurchaseItemCreateOrConnectWithoutProductInput[]
    upsert?: PurchaseItemUpsertWithWhereUniqueWithoutProductInput | PurchaseItemUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: PurchaseItemCreateManyProductInputEnvelope
    set?: PurchaseItemWhereUniqueInput | PurchaseItemWhereUniqueInput[]
    disconnect?: PurchaseItemWhereUniqueInput | PurchaseItemWhereUniqueInput[]
    delete?: PurchaseItemWhereUniqueInput | PurchaseItemWhereUniqueInput[]
    connect?: PurchaseItemWhereUniqueInput | PurchaseItemWhereUniqueInput[]
    update?: PurchaseItemUpdateWithWhereUniqueWithoutProductInput | PurchaseItemUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: PurchaseItemUpdateManyWithWhereWithoutProductInput | PurchaseItemUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: PurchaseItemScalarWhereInput | PurchaseItemScalarWhereInput[]
  }

  export type InventoryLogUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<InventoryLogCreateWithoutProductInput, InventoryLogUncheckedCreateWithoutProductInput> | InventoryLogCreateWithoutProductInput[] | InventoryLogUncheckedCreateWithoutProductInput[]
    connectOrCreate?: InventoryLogCreateOrConnectWithoutProductInput | InventoryLogCreateOrConnectWithoutProductInput[]
    upsert?: InventoryLogUpsertWithWhereUniqueWithoutProductInput | InventoryLogUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: InventoryLogCreateManyProductInputEnvelope
    set?: InventoryLogWhereUniqueInput | InventoryLogWhereUniqueInput[]
    disconnect?: InventoryLogWhereUniqueInput | InventoryLogWhereUniqueInput[]
    delete?: InventoryLogWhereUniqueInput | InventoryLogWhereUniqueInput[]
    connect?: InventoryLogWhereUniqueInput | InventoryLogWhereUniqueInput[]
    update?: InventoryLogUpdateWithWhereUniqueWithoutProductInput | InventoryLogUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: InventoryLogUpdateManyWithWhereWithoutProductInput | InventoryLogUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: InventoryLogScalarWhereInput | InventoryLogScalarWhereInput[]
  }

  export type CustomerCreateNestedOneWithoutInvoicesInput = {
    create?: XOR<CustomerCreateWithoutInvoicesInput, CustomerUncheckedCreateWithoutInvoicesInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutInvoicesInput
    connect?: CustomerWhereUniqueInput
  }

  export type InvoiceItemCreateNestedManyWithoutInvoiceInput = {
    create?: XOR<InvoiceItemCreateWithoutInvoiceInput, InvoiceItemUncheckedCreateWithoutInvoiceInput> | InvoiceItemCreateWithoutInvoiceInput[] | InvoiceItemUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: InvoiceItemCreateOrConnectWithoutInvoiceInput | InvoiceItemCreateOrConnectWithoutInvoiceInput[]
    createMany?: InvoiceItemCreateManyInvoiceInputEnvelope
    connect?: InvoiceItemWhereUniqueInput | InvoiceItemWhereUniqueInput[]
  }

  export type JournalVoucherCreateNestedOneWithoutInvoicesInput = {
    create?: XOR<JournalVoucherCreateWithoutInvoicesInput, JournalVoucherUncheckedCreateWithoutInvoicesInput>
    connectOrCreate?: JournalVoucherCreateOrConnectWithoutInvoicesInput
    connect?: JournalVoucherWhereUniqueInput
  }

  export type InvoiceItemUncheckedCreateNestedManyWithoutInvoiceInput = {
    create?: XOR<InvoiceItemCreateWithoutInvoiceInput, InvoiceItemUncheckedCreateWithoutInvoiceInput> | InvoiceItemCreateWithoutInvoiceInput[] | InvoiceItemUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: InvoiceItemCreateOrConnectWithoutInvoiceInput | InvoiceItemCreateOrConnectWithoutInvoiceInput[]
    createMany?: InvoiceItemCreateManyInvoiceInputEnvelope
    connect?: InvoiceItemWhereUniqueInput | InvoiceItemWhereUniqueInput[]
  }

  export type CustomerUpdateOneRequiredWithoutInvoicesNestedInput = {
    create?: XOR<CustomerCreateWithoutInvoicesInput, CustomerUncheckedCreateWithoutInvoicesInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutInvoicesInput
    upsert?: CustomerUpsertWithoutInvoicesInput
    connect?: CustomerWhereUniqueInput
    update?: XOR<XOR<CustomerUpdateToOneWithWhereWithoutInvoicesInput, CustomerUpdateWithoutInvoicesInput>, CustomerUncheckedUpdateWithoutInvoicesInput>
  }

  export type InvoiceItemUpdateManyWithoutInvoiceNestedInput = {
    create?: XOR<InvoiceItemCreateWithoutInvoiceInput, InvoiceItemUncheckedCreateWithoutInvoiceInput> | InvoiceItemCreateWithoutInvoiceInput[] | InvoiceItemUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: InvoiceItemCreateOrConnectWithoutInvoiceInput | InvoiceItemCreateOrConnectWithoutInvoiceInput[]
    upsert?: InvoiceItemUpsertWithWhereUniqueWithoutInvoiceInput | InvoiceItemUpsertWithWhereUniqueWithoutInvoiceInput[]
    createMany?: InvoiceItemCreateManyInvoiceInputEnvelope
    set?: InvoiceItemWhereUniqueInput | InvoiceItemWhereUniqueInput[]
    disconnect?: InvoiceItemWhereUniqueInput | InvoiceItemWhereUniqueInput[]
    delete?: InvoiceItemWhereUniqueInput | InvoiceItemWhereUniqueInput[]
    connect?: InvoiceItemWhereUniqueInput | InvoiceItemWhereUniqueInput[]
    update?: InvoiceItemUpdateWithWhereUniqueWithoutInvoiceInput | InvoiceItemUpdateWithWhereUniqueWithoutInvoiceInput[]
    updateMany?: InvoiceItemUpdateManyWithWhereWithoutInvoiceInput | InvoiceItemUpdateManyWithWhereWithoutInvoiceInput[]
    deleteMany?: InvoiceItemScalarWhereInput | InvoiceItemScalarWhereInput[]
  }

  export type JournalVoucherUpdateOneWithoutInvoicesNestedInput = {
    create?: XOR<JournalVoucherCreateWithoutInvoicesInput, JournalVoucherUncheckedCreateWithoutInvoicesInput>
    connectOrCreate?: JournalVoucherCreateOrConnectWithoutInvoicesInput
    upsert?: JournalVoucherUpsertWithoutInvoicesInput
    disconnect?: JournalVoucherWhereInput | boolean
    delete?: JournalVoucherWhereInput | boolean
    connect?: JournalVoucherWhereUniqueInput
    update?: XOR<XOR<JournalVoucherUpdateToOneWithWhereWithoutInvoicesInput, JournalVoucherUpdateWithoutInvoicesInput>, JournalVoucherUncheckedUpdateWithoutInvoicesInput>
  }

  export type InvoiceItemUncheckedUpdateManyWithoutInvoiceNestedInput = {
    create?: XOR<InvoiceItemCreateWithoutInvoiceInput, InvoiceItemUncheckedCreateWithoutInvoiceInput> | InvoiceItemCreateWithoutInvoiceInput[] | InvoiceItemUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: InvoiceItemCreateOrConnectWithoutInvoiceInput | InvoiceItemCreateOrConnectWithoutInvoiceInput[]
    upsert?: InvoiceItemUpsertWithWhereUniqueWithoutInvoiceInput | InvoiceItemUpsertWithWhereUniqueWithoutInvoiceInput[]
    createMany?: InvoiceItemCreateManyInvoiceInputEnvelope
    set?: InvoiceItemWhereUniqueInput | InvoiceItemWhereUniqueInput[]
    disconnect?: InvoiceItemWhereUniqueInput | InvoiceItemWhereUniqueInput[]
    delete?: InvoiceItemWhereUniqueInput | InvoiceItemWhereUniqueInput[]
    connect?: InvoiceItemWhereUniqueInput | InvoiceItemWhereUniqueInput[]
    update?: InvoiceItemUpdateWithWhereUniqueWithoutInvoiceInput | InvoiceItemUpdateWithWhereUniqueWithoutInvoiceInput[]
    updateMany?: InvoiceItemUpdateManyWithWhereWithoutInvoiceInput | InvoiceItemUpdateManyWithWhereWithoutInvoiceInput[]
    deleteMany?: InvoiceItemScalarWhereInput | InvoiceItemScalarWhereInput[]
  }

  export type SupplierCreateNestedOneWithoutInvoicesInput = {
    create?: XOR<SupplierCreateWithoutInvoicesInput, SupplierUncheckedCreateWithoutInvoicesInput>
    connectOrCreate?: SupplierCreateOrConnectWithoutInvoicesInput
    connect?: SupplierWhereUniqueInput
  }

  export type PurchaseItemCreateNestedManyWithoutInvoiceInput = {
    create?: XOR<PurchaseItemCreateWithoutInvoiceInput, PurchaseItemUncheckedCreateWithoutInvoiceInput> | PurchaseItemCreateWithoutInvoiceInput[] | PurchaseItemUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: PurchaseItemCreateOrConnectWithoutInvoiceInput | PurchaseItemCreateOrConnectWithoutInvoiceInput[]
    createMany?: PurchaseItemCreateManyInvoiceInputEnvelope
    connect?: PurchaseItemWhereUniqueInput | PurchaseItemWhereUniqueInput[]
  }

  export type JournalVoucherCreateNestedOneWithoutPurchaseInvoicesInput = {
    create?: XOR<JournalVoucherCreateWithoutPurchaseInvoicesInput, JournalVoucherUncheckedCreateWithoutPurchaseInvoicesInput>
    connectOrCreate?: JournalVoucherCreateOrConnectWithoutPurchaseInvoicesInput
    connect?: JournalVoucherWhereUniqueInput
  }

  export type PurchaseItemUncheckedCreateNestedManyWithoutInvoiceInput = {
    create?: XOR<PurchaseItemCreateWithoutInvoiceInput, PurchaseItemUncheckedCreateWithoutInvoiceInput> | PurchaseItemCreateWithoutInvoiceInput[] | PurchaseItemUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: PurchaseItemCreateOrConnectWithoutInvoiceInput | PurchaseItemCreateOrConnectWithoutInvoiceInput[]
    createMany?: PurchaseItemCreateManyInvoiceInputEnvelope
    connect?: PurchaseItemWhereUniqueInput | PurchaseItemWhereUniqueInput[]
  }

  export type SupplierUpdateOneRequiredWithoutInvoicesNestedInput = {
    create?: XOR<SupplierCreateWithoutInvoicesInput, SupplierUncheckedCreateWithoutInvoicesInput>
    connectOrCreate?: SupplierCreateOrConnectWithoutInvoicesInput
    upsert?: SupplierUpsertWithoutInvoicesInput
    connect?: SupplierWhereUniqueInput
    update?: XOR<XOR<SupplierUpdateToOneWithWhereWithoutInvoicesInput, SupplierUpdateWithoutInvoicesInput>, SupplierUncheckedUpdateWithoutInvoicesInput>
  }

  export type PurchaseItemUpdateManyWithoutInvoiceNestedInput = {
    create?: XOR<PurchaseItemCreateWithoutInvoiceInput, PurchaseItemUncheckedCreateWithoutInvoiceInput> | PurchaseItemCreateWithoutInvoiceInput[] | PurchaseItemUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: PurchaseItemCreateOrConnectWithoutInvoiceInput | PurchaseItemCreateOrConnectWithoutInvoiceInput[]
    upsert?: PurchaseItemUpsertWithWhereUniqueWithoutInvoiceInput | PurchaseItemUpsertWithWhereUniqueWithoutInvoiceInput[]
    createMany?: PurchaseItemCreateManyInvoiceInputEnvelope
    set?: PurchaseItemWhereUniqueInput | PurchaseItemWhereUniqueInput[]
    disconnect?: PurchaseItemWhereUniqueInput | PurchaseItemWhereUniqueInput[]
    delete?: PurchaseItemWhereUniqueInput | PurchaseItemWhereUniqueInput[]
    connect?: PurchaseItemWhereUniqueInput | PurchaseItemWhereUniqueInput[]
    update?: PurchaseItemUpdateWithWhereUniqueWithoutInvoiceInput | PurchaseItemUpdateWithWhereUniqueWithoutInvoiceInput[]
    updateMany?: PurchaseItemUpdateManyWithWhereWithoutInvoiceInput | PurchaseItemUpdateManyWithWhereWithoutInvoiceInput[]
    deleteMany?: PurchaseItemScalarWhereInput | PurchaseItemScalarWhereInput[]
  }

  export type JournalVoucherUpdateOneWithoutPurchaseInvoicesNestedInput = {
    create?: XOR<JournalVoucherCreateWithoutPurchaseInvoicesInput, JournalVoucherUncheckedCreateWithoutPurchaseInvoicesInput>
    connectOrCreate?: JournalVoucherCreateOrConnectWithoutPurchaseInvoicesInput
    upsert?: JournalVoucherUpsertWithoutPurchaseInvoicesInput
    disconnect?: JournalVoucherWhereInput | boolean
    delete?: JournalVoucherWhereInput | boolean
    connect?: JournalVoucherWhereUniqueInput
    update?: XOR<XOR<JournalVoucherUpdateToOneWithWhereWithoutPurchaseInvoicesInput, JournalVoucherUpdateWithoutPurchaseInvoicesInput>, JournalVoucherUncheckedUpdateWithoutPurchaseInvoicesInput>
  }

  export type PurchaseItemUncheckedUpdateManyWithoutInvoiceNestedInput = {
    create?: XOR<PurchaseItemCreateWithoutInvoiceInput, PurchaseItemUncheckedCreateWithoutInvoiceInput> | PurchaseItemCreateWithoutInvoiceInput[] | PurchaseItemUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: PurchaseItemCreateOrConnectWithoutInvoiceInput | PurchaseItemCreateOrConnectWithoutInvoiceInput[]
    upsert?: PurchaseItemUpsertWithWhereUniqueWithoutInvoiceInput | PurchaseItemUpsertWithWhereUniqueWithoutInvoiceInput[]
    createMany?: PurchaseItemCreateManyInvoiceInputEnvelope
    set?: PurchaseItemWhereUniqueInput | PurchaseItemWhereUniqueInput[]
    disconnect?: PurchaseItemWhereUniqueInput | PurchaseItemWhereUniqueInput[]
    delete?: PurchaseItemWhereUniqueInput | PurchaseItemWhereUniqueInput[]
    connect?: PurchaseItemWhereUniqueInput | PurchaseItemWhereUniqueInput[]
    update?: PurchaseItemUpdateWithWhereUniqueWithoutInvoiceInput | PurchaseItemUpdateWithWhereUniqueWithoutInvoiceInput[]
    updateMany?: PurchaseItemUpdateManyWithWhereWithoutInvoiceInput | PurchaseItemUpdateManyWithWhereWithoutInvoiceInput[]
    deleteMany?: PurchaseItemScalarWhereInput | PurchaseItemScalarWhereInput[]
  }

  export type SalesInvoiceCreateNestedOneWithoutItemsInput = {
    create?: XOR<SalesInvoiceCreateWithoutItemsInput, SalesInvoiceUncheckedCreateWithoutItemsInput>
    connectOrCreate?: SalesInvoiceCreateOrConnectWithoutItemsInput
    connect?: SalesInvoiceWhereUniqueInput
  }

  export type ProductCreateNestedOneWithoutItemsInput = {
    create?: XOR<ProductCreateWithoutItemsInput, ProductUncheckedCreateWithoutItemsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutItemsInput
    connect?: ProductWhereUniqueInput
  }

  export type SalesInvoiceUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<SalesInvoiceCreateWithoutItemsInput, SalesInvoiceUncheckedCreateWithoutItemsInput>
    connectOrCreate?: SalesInvoiceCreateOrConnectWithoutItemsInput
    upsert?: SalesInvoiceUpsertWithoutItemsInput
    connect?: SalesInvoiceWhereUniqueInput
    update?: XOR<XOR<SalesInvoiceUpdateToOneWithWhereWithoutItemsInput, SalesInvoiceUpdateWithoutItemsInput>, SalesInvoiceUncheckedUpdateWithoutItemsInput>
  }

  export type ProductUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<ProductCreateWithoutItemsInput, ProductUncheckedCreateWithoutItemsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutItemsInput
    upsert?: ProductUpsertWithoutItemsInput
    connect?: ProductWhereUniqueInput
    update?: XOR<XOR<ProductUpdateToOneWithWhereWithoutItemsInput, ProductUpdateWithoutItemsInput>, ProductUncheckedUpdateWithoutItemsInput>
  }

  export type PurchaseInvoiceCreateNestedOneWithoutItemsInput = {
    create?: XOR<PurchaseInvoiceCreateWithoutItemsInput, PurchaseInvoiceUncheckedCreateWithoutItemsInput>
    connectOrCreate?: PurchaseInvoiceCreateOrConnectWithoutItemsInput
    connect?: PurchaseInvoiceWhereUniqueInput
  }

  export type ProductCreateNestedOneWithoutPurchaseItemsInput = {
    create?: XOR<ProductCreateWithoutPurchaseItemsInput, ProductUncheckedCreateWithoutPurchaseItemsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutPurchaseItemsInput
    connect?: ProductWhereUniqueInput
  }

  export type PurchaseInvoiceUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<PurchaseInvoiceCreateWithoutItemsInput, PurchaseInvoiceUncheckedCreateWithoutItemsInput>
    connectOrCreate?: PurchaseInvoiceCreateOrConnectWithoutItemsInput
    upsert?: PurchaseInvoiceUpsertWithoutItemsInput
    connect?: PurchaseInvoiceWhereUniqueInput
    update?: XOR<XOR<PurchaseInvoiceUpdateToOneWithWhereWithoutItemsInput, PurchaseInvoiceUpdateWithoutItemsInput>, PurchaseInvoiceUncheckedUpdateWithoutItemsInput>
  }

  export type ProductUpdateOneRequiredWithoutPurchaseItemsNestedInput = {
    create?: XOR<ProductCreateWithoutPurchaseItemsInput, ProductUncheckedCreateWithoutPurchaseItemsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutPurchaseItemsInput
    upsert?: ProductUpsertWithoutPurchaseItemsInput
    connect?: ProductWhereUniqueInput
    update?: XOR<XOR<ProductUpdateToOneWithWhereWithoutPurchaseItemsInput, ProductUpdateWithoutPurchaseItemsInput>, ProductUncheckedUpdateWithoutPurchaseItemsInput>
  }

  export type ProductCreateNestedOneWithoutInventoryLogsInput = {
    create?: XOR<ProductCreateWithoutInventoryLogsInput, ProductUncheckedCreateWithoutInventoryLogsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutInventoryLogsInput
    connect?: ProductWhereUniqueInput
  }

  export type ProductUpdateOneRequiredWithoutInventoryLogsNestedInput = {
    create?: XOR<ProductCreateWithoutInventoryLogsInput, ProductUncheckedCreateWithoutInventoryLogsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutInventoryLogsInput
    upsert?: ProductUpsertWithoutInventoryLogsInput
    connect?: ProductWhereUniqueInput
    update?: XOR<XOR<ProductUpdateToOneWithWhereWithoutInventoryLogsInput, ProductUpdateWithoutInventoryLogsInput>, ProductUncheckedUpdateWithoutInventoryLogsInput>
  }

  export type AccountCreateNestedOneWithoutChildrenInput = {
    create?: XOR<AccountCreateWithoutChildrenInput, AccountUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: AccountCreateOrConnectWithoutChildrenInput
    connect?: AccountWhereUniqueInput
  }

  export type AccountCreateNestedManyWithoutParentInput = {
    create?: XOR<AccountCreateWithoutParentInput, AccountUncheckedCreateWithoutParentInput> | AccountCreateWithoutParentInput[] | AccountUncheckedCreateWithoutParentInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutParentInput | AccountCreateOrConnectWithoutParentInput[]
    createMany?: AccountCreateManyParentInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type JournalEntryCreateNestedManyWithoutAccountInput = {
    create?: XOR<JournalEntryCreateWithoutAccountInput, JournalEntryUncheckedCreateWithoutAccountInput> | JournalEntryCreateWithoutAccountInput[] | JournalEntryUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: JournalEntryCreateOrConnectWithoutAccountInput | JournalEntryCreateOrConnectWithoutAccountInput[]
    createMany?: JournalEntryCreateManyAccountInputEnvelope
    connect?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
  }

  export type AccountUncheckedCreateNestedManyWithoutParentInput = {
    create?: XOR<AccountCreateWithoutParentInput, AccountUncheckedCreateWithoutParentInput> | AccountCreateWithoutParentInput[] | AccountUncheckedCreateWithoutParentInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutParentInput | AccountCreateOrConnectWithoutParentInput[]
    createMany?: AccountCreateManyParentInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type JournalEntryUncheckedCreateNestedManyWithoutAccountInput = {
    create?: XOR<JournalEntryCreateWithoutAccountInput, JournalEntryUncheckedCreateWithoutAccountInput> | JournalEntryCreateWithoutAccountInput[] | JournalEntryUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: JournalEntryCreateOrConnectWithoutAccountInput | JournalEntryCreateOrConnectWithoutAccountInput[]
    createMany?: JournalEntryCreateManyAccountInputEnvelope
    connect?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
  }

  export type AccountUpdateOneWithoutChildrenNestedInput = {
    create?: XOR<AccountCreateWithoutChildrenInput, AccountUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: AccountCreateOrConnectWithoutChildrenInput
    upsert?: AccountUpsertWithoutChildrenInput
    disconnect?: AccountWhereInput | boolean
    delete?: AccountWhereInput | boolean
    connect?: AccountWhereUniqueInput
    update?: XOR<XOR<AccountUpdateToOneWithWhereWithoutChildrenInput, AccountUpdateWithoutChildrenInput>, AccountUncheckedUpdateWithoutChildrenInput>
  }

  export type AccountUpdateManyWithoutParentNestedInput = {
    create?: XOR<AccountCreateWithoutParentInput, AccountUncheckedCreateWithoutParentInput> | AccountCreateWithoutParentInput[] | AccountUncheckedCreateWithoutParentInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutParentInput | AccountCreateOrConnectWithoutParentInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutParentInput | AccountUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: AccountCreateManyParentInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutParentInput | AccountUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutParentInput | AccountUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type JournalEntryUpdateManyWithoutAccountNestedInput = {
    create?: XOR<JournalEntryCreateWithoutAccountInput, JournalEntryUncheckedCreateWithoutAccountInput> | JournalEntryCreateWithoutAccountInput[] | JournalEntryUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: JournalEntryCreateOrConnectWithoutAccountInput | JournalEntryCreateOrConnectWithoutAccountInput[]
    upsert?: JournalEntryUpsertWithWhereUniqueWithoutAccountInput | JournalEntryUpsertWithWhereUniqueWithoutAccountInput[]
    createMany?: JournalEntryCreateManyAccountInputEnvelope
    set?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    disconnect?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    delete?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    connect?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    update?: JournalEntryUpdateWithWhereUniqueWithoutAccountInput | JournalEntryUpdateWithWhereUniqueWithoutAccountInput[]
    updateMany?: JournalEntryUpdateManyWithWhereWithoutAccountInput | JournalEntryUpdateManyWithWhereWithoutAccountInput[]
    deleteMany?: JournalEntryScalarWhereInput | JournalEntryScalarWhereInput[]
  }

  export type AccountUncheckedUpdateManyWithoutParentNestedInput = {
    create?: XOR<AccountCreateWithoutParentInput, AccountUncheckedCreateWithoutParentInput> | AccountCreateWithoutParentInput[] | AccountUncheckedCreateWithoutParentInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutParentInput | AccountCreateOrConnectWithoutParentInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutParentInput | AccountUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: AccountCreateManyParentInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutParentInput | AccountUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutParentInput | AccountUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type JournalEntryUncheckedUpdateManyWithoutAccountNestedInput = {
    create?: XOR<JournalEntryCreateWithoutAccountInput, JournalEntryUncheckedCreateWithoutAccountInput> | JournalEntryCreateWithoutAccountInput[] | JournalEntryUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: JournalEntryCreateOrConnectWithoutAccountInput | JournalEntryCreateOrConnectWithoutAccountInput[]
    upsert?: JournalEntryUpsertWithWhereUniqueWithoutAccountInput | JournalEntryUpsertWithWhereUniqueWithoutAccountInput[]
    createMany?: JournalEntryCreateManyAccountInputEnvelope
    set?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    disconnect?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    delete?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    connect?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    update?: JournalEntryUpdateWithWhereUniqueWithoutAccountInput | JournalEntryUpdateWithWhereUniqueWithoutAccountInput[]
    updateMany?: JournalEntryUpdateManyWithWhereWithoutAccountInput | JournalEntryUpdateManyWithWhereWithoutAccountInput[]
    deleteMany?: JournalEntryScalarWhereInput | JournalEntryScalarWhereInput[]
  }

  export type JournalEntryCreateNestedManyWithoutJournalVoucherInput = {
    create?: XOR<JournalEntryCreateWithoutJournalVoucherInput, JournalEntryUncheckedCreateWithoutJournalVoucherInput> | JournalEntryCreateWithoutJournalVoucherInput[] | JournalEntryUncheckedCreateWithoutJournalVoucherInput[]
    connectOrCreate?: JournalEntryCreateOrConnectWithoutJournalVoucherInput | JournalEntryCreateOrConnectWithoutJournalVoucherInput[]
    createMany?: JournalEntryCreateManyJournalVoucherInputEnvelope
    connect?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
  }

  export type SalesInvoiceCreateNestedManyWithoutJournalVoucherInput = {
    create?: XOR<SalesInvoiceCreateWithoutJournalVoucherInput, SalesInvoiceUncheckedCreateWithoutJournalVoucherInput> | SalesInvoiceCreateWithoutJournalVoucherInput[] | SalesInvoiceUncheckedCreateWithoutJournalVoucherInput[]
    connectOrCreate?: SalesInvoiceCreateOrConnectWithoutJournalVoucherInput | SalesInvoiceCreateOrConnectWithoutJournalVoucherInput[]
    createMany?: SalesInvoiceCreateManyJournalVoucherInputEnvelope
    connect?: SalesInvoiceWhereUniqueInput | SalesInvoiceWhereUniqueInput[]
  }

  export type PurchaseInvoiceCreateNestedManyWithoutJournalVoucherInput = {
    create?: XOR<PurchaseInvoiceCreateWithoutJournalVoucherInput, PurchaseInvoiceUncheckedCreateWithoutJournalVoucherInput> | PurchaseInvoiceCreateWithoutJournalVoucherInput[] | PurchaseInvoiceUncheckedCreateWithoutJournalVoucherInput[]
    connectOrCreate?: PurchaseInvoiceCreateOrConnectWithoutJournalVoucherInput | PurchaseInvoiceCreateOrConnectWithoutJournalVoucherInput[]
    createMany?: PurchaseInvoiceCreateManyJournalVoucherInputEnvelope
    connect?: PurchaseInvoiceWhereUniqueInput | PurchaseInvoiceWhereUniqueInput[]
  }

  export type JournalEntryUncheckedCreateNestedManyWithoutJournalVoucherInput = {
    create?: XOR<JournalEntryCreateWithoutJournalVoucherInput, JournalEntryUncheckedCreateWithoutJournalVoucherInput> | JournalEntryCreateWithoutJournalVoucherInput[] | JournalEntryUncheckedCreateWithoutJournalVoucherInput[]
    connectOrCreate?: JournalEntryCreateOrConnectWithoutJournalVoucherInput | JournalEntryCreateOrConnectWithoutJournalVoucherInput[]
    createMany?: JournalEntryCreateManyJournalVoucherInputEnvelope
    connect?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
  }

  export type SalesInvoiceUncheckedCreateNestedManyWithoutJournalVoucherInput = {
    create?: XOR<SalesInvoiceCreateWithoutJournalVoucherInput, SalesInvoiceUncheckedCreateWithoutJournalVoucherInput> | SalesInvoiceCreateWithoutJournalVoucherInput[] | SalesInvoiceUncheckedCreateWithoutJournalVoucherInput[]
    connectOrCreate?: SalesInvoiceCreateOrConnectWithoutJournalVoucherInput | SalesInvoiceCreateOrConnectWithoutJournalVoucherInput[]
    createMany?: SalesInvoiceCreateManyJournalVoucherInputEnvelope
    connect?: SalesInvoiceWhereUniqueInput | SalesInvoiceWhereUniqueInput[]
  }

  export type PurchaseInvoiceUncheckedCreateNestedManyWithoutJournalVoucherInput = {
    create?: XOR<PurchaseInvoiceCreateWithoutJournalVoucherInput, PurchaseInvoiceUncheckedCreateWithoutJournalVoucherInput> | PurchaseInvoiceCreateWithoutJournalVoucherInput[] | PurchaseInvoiceUncheckedCreateWithoutJournalVoucherInput[]
    connectOrCreate?: PurchaseInvoiceCreateOrConnectWithoutJournalVoucherInput | PurchaseInvoiceCreateOrConnectWithoutJournalVoucherInput[]
    createMany?: PurchaseInvoiceCreateManyJournalVoucherInputEnvelope
    connect?: PurchaseInvoiceWhereUniqueInput | PurchaseInvoiceWhereUniqueInput[]
  }

  export type JournalEntryUpdateManyWithoutJournalVoucherNestedInput = {
    create?: XOR<JournalEntryCreateWithoutJournalVoucherInput, JournalEntryUncheckedCreateWithoutJournalVoucherInput> | JournalEntryCreateWithoutJournalVoucherInput[] | JournalEntryUncheckedCreateWithoutJournalVoucherInput[]
    connectOrCreate?: JournalEntryCreateOrConnectWithoutJournalVoucherInput | JournalEntryCreateOrConnectWithoutJournalVoucherInput[]
    upsert?: JournalEntryUpsertWithWhereUniqueWithoutJournalVoucherInput | JournalEntryUpsertWithWhereUniqueWithoutJournalVoucherInput[]
    createMany?: JournalEntryCreateManyJournalVoucherInputEnvelope
    set?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    disconnect?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    delete?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    connect?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    update?: JournalEntryUpdateWithWhereUniqueWithoutJournalVoucherInput | JournalEntryUpdateWithWhereUniqueWithoutJournalVoucherInput[]
    updateMany?: JournalEntryUpdateManyWithWhereWithoutJournalVoucherInput | JournalEntryUpdateManyWithWhereWithoutJournalVoucherInput[]
    deleteMany?: JournalEntryScalarWhereInput | JournalEntryScalarWhereInput[]
  }

  export type SalesInvoiceUpdateManyWithoutJournalVoucherNestedInput = {
    create?: XOR<SalesInvoiceCreateWithoutJournalVoucherInput, SalesInvoiceUncheckedCreateWithoutJournalVoucherInput> | SalesInvoiceCreateWithoutJournalVoucherInput[] | SalesInvoiceUncheckedCreateWithoutJournalVoucherInput[]
    connectOrCreate?: SalesInvoiceCreateOrConnectWithoutJournalVoucherInput | SalesInvoiceCreateOrConnectWithoutJournalVoucherInput[]
    upsert?: SalesInvoiceUpsertWithWhereUniqueWithoutJournalVoucherInput | SalesInvoiceUpsertWithWhereUniqueWithoutJournalVoucherInput[]
    createMany?: SalesInvoiceCreateManyJournalVoucherInputEnvelope
    set?: SalesInvoiceWhereUniqueInput | SalesInvoiceWhereUniqueInput[]
    disconnect?: SalesInvoiceWhereUniqueInput | SalesInvoiceWhereUniqueInput[]
    delete?: SalesInvoiceWhereUniqueInput | SalesInvoiceWhereUniqueInput[]
    connect?: SalesInvoiceWhereUniqueInput | SalesInvoiceWhereUniqueInput[]
    update?: SalesInvoiceUpdateWithWhereUniqueWithoutJournalVoucherInput | SalesInvoiceUpdateWithWhereUniqueWithoutJournalVoucherInput[]
    updateMany?: SalesInvoiceUpdateManyWithWhereWithoutJournalVoucherInput | SalesInvoiceUpdateManyWithWhereWithoutJournalVoucherInput[]
    deleteMany?: SalesInvoiceScalarWhereInput | SalesInvoiceScalarWhereInput[]
  }

  export type PurchaseInvoiceUpdateManyWithoutJournalVoucherNestedInput = {
    create?: XOR<PurchaseInvoiceCreateWithoutJournalVoucherInput, PurchaseInvoiceUncheckedCreateWithoutJournalVoucherInput> | PurchaseInvoiceCreateWithoutJournalVoucherInput[] | PurchaseInvoiceUncheckedCreateWithoutJournalVoucherInput[]
    connectOrCreate?: PurchaseInvoiceCreateOrConnectWithoutJournalVoucherInput | PurchaseInvoiceCreateOrConnectWithoutJournalVoucherInput[]
    upsert?: PurchaseInvoiceUpsertWithWhereUniqueWithoutJournalVoucherInput | PurchaseInvoiceUpsertWithWhereUniqueWithoutJournalVoucherInput[]
    createMany?: PurchaseInvoiceCreateManyJournalVoucherInputEnvelope
    set?: PurchaseInvoiceWhereUniqueInput | PurchaseInvoiceWhereUniqueInput[]
    disconnect?: PurchaseInvoiceWhereUniqueInput | PurchaseInvoiceWhereUniqueInput[]
    delete?: PurchaseInvoiceWhereUniqueInput | PurchaseInvoiceWhereUniqueInput[]
    connect?: PurchaseInvoiceWhereUniqueInput | PurchaseInvoiceWhereUniqueInput[]
    update?: PurchaseInvoiceUpdateWithWhereUniqueWithoutJournalVoucherInput | PurchaseInvoiceUpdateWithWhereUniqueWithoutJournalVoucherInput[]
    updateMany?: PurchaseInvoiceUpdateManyWithWhereWithoutJournalVoucherInput | PurchaseInvoiceUpdateManyWithWhereWithoutJournalVoucherInput[]
    deleteMany?: PurchaseInvoiceScalarWhereInput | PurchaseInvoiceScalarWhereInput[]
  }

  export type JournalEntryUncheckedUpdateManyWithoutJournalVoucherNestedInput = {
    create?: XOR<JournalEntryCreateWithoutJournalVoucherInput, JournalEntryUncheckedCreateWithoutJournalVoucherInput> | JournalEntryCreateWithoutJournalVoucherInput[] | JournalEntryUncheckedCreateWithoutJournalVoucherInput[]
    connectOrCreate?: JournalEntryCreateOrConnectWithoutJournalVoucherInput | JournalEntryCreateOrConnectWithoutJournalVoucherInput[]
    upsert?: JournalEntryUpsertWithWhereUniqueWithoutJournalVoucherInput | JournalEntryUpsertWithWhereUniqueWithoutJournalVoucherInput[]
    createMany?: JournalEntryCreateManyJournalVoucherInputEnvelope
    set?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    disconnect?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    delete?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    connect?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    update?: JournalEntryUpdateWithWhereUniqueWithoutJournalVoucherInput | JournalEntryUpdateWithWhereUniqueWithoutJournalVoucherInput[]
    updateMany?: JournalEntryUpdateManyWithWhereWithoutJournalVoucherInput | JournalEntryUpdateManyWithWhereWithoutJournalVoucherInput[]
    deleteMany?: JournalEntryScalarWhereInput | JournalEntryScalarWhereInput[]
  }

  export type SalesInvoiceUncheckedUpdateManyWithoutJournalVoucherNestedInput = {
    create?: XOR<SalesInvoiceCreateWithoutJournalVoucherInput, SalesInvoiceUncheckedCreateWithoutJournalVoucherInput> | SalesInvoiceCreateWithoutJournalVoucherInput[] | SalesInvoiceUncheckedCreateWithoutJournalVoucherInput[]
    connectOrCreate?: SalesInvoiceCreateOrConnectWithoutJournalVoucherInput | SalesInvoiceCreateOrConnectWithoutJournalVoucherInput[]
    upsert?: SalesInvoiceUpsertWithWhereUniqueWithoutJournalVoucherInput | SalesInvoiceUpsertWithWhereUniqueWithoutJournalVoucherInput[]
    createMany?: SalesInvoiceCreateManyJournalVoucherInputEnvelope
    set?: SalesInvoiceWhereUniqueInput | SalesInvoiceWhereUniqueInput[]
    disconnect?: SalesInvoiceWhereUniqueInput | SalesInvoiceWhereUniqueInput[]
    delete?: SalesInvoiceWhereUniqueInput | SalesInvoiceWhereUniqueInput[]
    connect?: SalesInvoiceWhereUniqueInput | SalesInvoiceWhereUniqueInput[]
    update?: SalesInvoiceUpdateWithWhereUniqueWithoutJournalVoucherInput | SalesInvoiceUpdateWithWhereUniqueWithoutJournalVoucherInput[]
    updateMany?: SalesInvoiceUpdateManyWithWhereWithoutJournalVoucherInput | SalesInvoiceUpdateManyWithWhereWithoutJournalVoucherInput[]
    deleteMany?: SalesInvoiceScalarWhereInput | SalesInvoiceScalarWhereInput[]
  }

  export type PurchaseInvoiceUncheckedUpdateManyWithoutJournalVoucherNestedInput = {
    create?: XOR<PurchaseInvoiceCreateWithoutJournalVoucherInput, PurchaseInvoiceUncheckedCreateWithoutJournalVoucherInput> | PurchaseInvoiceCreateWithoutJournalVoucherInput[] | PurchaseInvoiceUncheckedCreateWithoutJournalVoucherInput[]
    connectOrCreate?: PurchaseInvoiceCreateOrConnectWithoutJournalVoucherInput | PurchaseInvoiceCreateOrConnectWithoutJournalVoucherInput[]
    upsert?: PurchaseInvoiceUpsertWithWhereUniqueWithoutJournalVoucherInput | PurchaseInvoiceUpsertWithWhereUniqueWithoutJournalVoucherInput[]
    createMany?: PurchaseInvoiceCreateManyJournalVoucherInputEnvelope
    set?: PurchaseInvoiceWhereUniqueInput | PurchaseInvoiceWhereUniqueInput[]
    disconnect?: PurchaseInvoiceWhereUniqueInput | PurchaseInvoiceWhereUniqueInput[]
    delete?: PurchaseInvoiceWhereUniqueInput | PurchaseInvoiceWhereUniqueInput[]
    connect?: PurchaseInvoiceWhereUniqueInput | PurchaseInvoiceWhereUniqueInput[]
    update?: PurchaseInvoiceUpdateWithWhereUniqueWithoutJournalVoucherInput | PurchaseInvoiceUpdateWithWhereUniqueWithoutJournalVoucherInput[]
    updateMany?: PurchaseInvoiceUpdateManyWithWhereWithoutJournalVoucherInput | PurchaseInvoiceUpdateManyWithWhereWithoutJournalVoucherInput[]
    deleteMany?: PurchaseInvoiceScalarWhereInput | PurchaseInvoiceScalarWhereInput[]
  }

  export type AccountCreateNestedOneWithoutEntriesInput = {
    create?: XOR<AccountCreateWithoutEntriesInput, AccountUncheckedCreateWithoutEntriesInput>
    connectOrCreate?: AccountCreateOrConnectWithoutEntriesInput
    connect?: AccountWhereUniqueInput
  }

  export type JournalVoucherCreateNestedOneWithoutEntriesInput = {
    create?: XOR<JournalVoucherCreateWithoutEntriesInput, JournalVoucherUncheckedCreateWithoutEntriesInput>
    connectOrCreate?: JournalVoucherCreateOrConnectWithoutEntriesInput
    connect?: JournalVoucherWhereUniqueInput
  }

  export type AccountUpdateOneRequiredWithoutEntriesNestedInput = {
    create?: XOR<AccountCreateWithoutEntriesInput, AccountUncheckedCreateWithoutEntriesInput>
    connectOrCreate?: AccountCreateOrConnectWithoutEntriesInput
    upsert?: AccountUpsertWithoutEntriesInput
    connect?: AccountWhereUniqueInput
    update?: XOR<XOR<AccountUpdateToOneWithWhereWithoutEntriesInput, AccountUpdateWithoutEntriesInput>, AccountUncheckedUpdateWithoutEntriesInput>
  }

  export type JournalVoucherUpdateOneWithoutEntriesNestedInput = {
    create?: XOR<JournalVoucherCreateWithoutEntriesInput, JournalVoucherUncheckedCreateWithoutEntriesInput>
    connectOrCreate?: JournalVoucherCreateOrConnectWithoutEntriesInput
    upsert?: JournalVoucherUpsertWithoutEntriesInput
    disconnect?: JournalVoucherWhereInput | boolean
    delete?: JournalVoucherWhereInput | boolean
    connect?: JournalVoucherWhereUniqueInput
    update?: XOR<XOR<JournalVoucherUpdateToOneWithWhereWithoutEntriesInput, JournalVoucherUpdateWithoutEntriesInput>, JournalVoucherUncheckedUpdateWithoutEntriesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type SalesInvoiceCreateWithoutCustomerInput = {
    id?: string
    invoiceNumber: string
    date: Date | string
    totalAmount: number
    taxAmount?: number
    discount?: number
    netAmount: number
    status: string
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: InvoiceItemCreateNestedManyWithoutInvoiceInput
    journalVoucher?: JournalVoucherCreateNestedOneWithoutInvoicesInput
  }

  export type SalesInvoiceUncheckedCreateWithoutCustomerInput = {
    id?: string
    invoiceNumber: string
    date: Date | string
    totalAmount: number
    taxAmount?: number
    discount?: number
    netAmount: number
    status: string
    journalVoucherId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: InvoiceItemUncheckedCreateNestedManyWithoutInvoiceInput
  }

  export type SalesInvoiceCreateOrConnectWithoutCustomerInput = {
    where: SalesInvoiceWhereUniqueInput
    create: XOR<SalesInvoiceCreateWithoutCustomerInput, SalesInvoiceUncheckedCreateWithoutCustomerInput>
  }

  export type SalesInvoiceCreateManyCustomerInputEnvelope = {
    data: SalesInvoiceCreateManyCustomerInput | SalesInvoiceCreateManyCustomerInput[]
  }

  export type SalesInvoiceUpsertWithWhereUniqueWithoutCustomerInput = {
    where: SalesInvoiceWhereUniqueInput
    update: XOR<SalesInvoiceUpdateWithoutCustomerInput, SalesInvoiceUncheckedUpdateWithoutCustomerInput>
    create: XOR<SalesInvoiceCreateWithoutCustomerInput, SalesInvoiceUncheckedCreateWithoutCustomerInput>
  }

  export type SalesInvoiceUpdateWithWhereUniqueWithoutCustomerInput = {
    where: SalesInvoiceWhereUniqueInput
    data: XOR<SalesInvoiceUpdateWithoutCustomerInput, SalesInvoiceUncheckedUpdateWithoutCustomerInput>
  }

  export type SalesInvoiceUpdateManyWithWhereWithoutCustomerInput = {
    where: SalesInvoiceScalarWhereInput
    data: XOR<SalesInvoiceUpdateManyMutationInput, SalesInvoiceUncheckedUpdateManyWithoutCustomerInput>
  }

  export type SalesInvoiceScalarWhereInput = {
    AND?: SalesInvoiceScalarWhereInput | SalesInvoiceScalarWhereInput[]
    OR?: SalesInvoiceScalarWhereInput[]
    NOT?: SalesInvoiceScalarWhereInput | SalesInvoiceScalarWhereInput[]
    id?: StringFilter<"SalesInvoice"> | string
    invoiceNumber?: StringFilter<"SalesInvoice"> | string
    date?: DateTimeFilter<"SalesInvoice"> | Date | string
    customerId?: StringFilter<"SalesInvoice"> | string
    totalAmount?: FloatFilter<"SalesInvoice"> | number
    taxAmount?: FloatFilter<"SalesInvoice"> | number
    discount?: FloatFilter<"SalesInvoice"> | number
    netAmount?: FloatFilter<"SalesInvoice"> | number
    status?: StringFilter<"SalesInvoice"> | string
    journalVoucherId?: StringNullableFilter<"SalesInvoice"> | string | null
    createdAt?: DateTimeFilter<"SalesInvoice"> | Date | string
    updatedAt?: DateTimeFilter<"SalesInvoice"> | Date | string
  }

  export type PurchaseInvoiceCreateWithoutSupplierInput = {
    id?: string
    invoiceNumber: string
    date: Date | string
    totalAmount: number
    taxAmount?: number
    discount?: number
    netAmount: number
    status: string
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: PurchaseItemCreateNestedManyWithoutInvoiceInput
    journalVoucher?: JournalVoucherCreateNestedOneWithoutPurchaseInvoicesInput
  }

  export type PurchaseInvoiceUncheckedCreateWithoutSupplierInput = {
    id?: string
    invoiceNumber: string
    date: Date | string
    totalAmount: number
    taxAmount?: number
    discount?: number
    netAmount: number
    status: string
    journalVoucherId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: PurchaseItemUncheckedCreateNestedManyWithoutInvoiceInput
  }

  export type PurchaseInvoiceCreateOrConnectWithoutSupplierInput = {
    where: PurchaseInvoiceWhereUniqueInput
    create: XOR<PurchaseInvoiceCreateWithoutSupplierInput, PurchaseInvoiceUncheckedCreateWithoutSupplierInput>
  }

  export type PurchaseInvoiceCreateManySupplierInputEnvelope = {
    data: PurchaseInvoiceCreateManySupplierInput | PurchaseInvoiceCreateManySupplierInput[]
  }

  export type PurchaseInvoiceUpsertWithWhereUniqueWithoutSupplierInput = {
    where: PurchaseInvoiceWhereUniqueInput
    update: XOR<PurchaseInvoiceUpdateWithoutSupplierInput, PurchaseInvoiceUncheckedUpdateWithoutSupplierInput>
    create: XOR<PurchaseInvoiceCreateWithoutSupplierInput, PurchaseInvoiceUncheckedCreateWithoutSupplierInput>
  }

  export type PurchaseInvoiceUpdateWithWhereUniqueWithoutSupplierInput = {
    where: PurchaseInvoiceWhereUniqueInput
    data: XOR<PurchaseInvoiceUpdateWithoutSupplierInput, PurchaseInvoiceUncheckedUpdateWithoutSupplierInput>
  }

  export type PurchaseInvoiceUpdateManyWithWhereWithoutSupplierInput = {
    where: PurchaseInvoiceScalarWhereInput
    data: XOR<PurchaseInvoiceUpdateManyMutationInput, PurchaseInvoiceUncheckedUpdateManyWithoutSupplierInput>
  }

  export type PurchaseInvoiceScalarWhereInput = {
    AND?: PurchaseInvoiceScalarWhereInput | PurchaseInvoiceScalarWhereInput[]
    OR?: PurchaseInvoiceScalarWhereInput[]
    NOT?: PurchaseInvoiceScalarWhereInput | PurchaseInvoiceScalarWhereInput[]
    id?: StringFilter<"PurchaseInvoice"> | string
    invoiceNumber?: StringFilter<"PurchaseInvoice"> | string
    date?: DateTimeFilter<"PurchaseInvoice"> | Date | string
    supplierId?: StringFilter<"PurchaseInvoice"> | string
    totalAmount?: FloatFilter<"PurchaseInvoice"> | number
    taxAmount?: FloatFilter<"PurchaseInvoice"> | number
    discount?: FloatFilter<"PurchaseInvoice"> | number
    netAmount?: FloatFilter<"PurchaseInvoice"> | number
    status?: StringFilter<"PurchaseInvoice"> | string
    journalVoucherId?: StringNullableFilter<"PurchaseInvoice"> | string | null
    createdAt?: DateTimeFilter<"PurchaseInvoice"> | Date | string
    updatedAt?: DateTimeFilter<"PurchaseInvoice"> | Date | string
  }

  export type InvoiceItemCreateWithoutProductInput = {
    id?: string
    quantity: number
    unitPrice: number
    total: number
    invoice: SalesInvoiceCreateNestedOneWithoutItemsInput
  }

  export type InvoiceItemUncheckedCreateWithoutProductInput = {
    id?: string
    invoiceId: string
    quantity: number
    unitPrice: number
    total: number
  }

  export type InvoiceItemCreateOrConnectWithoutProductInput = {
    where: InvoiceItemWhereUniqueInput
    create: XOR<InvoiceItemCreateWithoutProductInput, InvoiceItemUncheckedCreateWithoutProductInput>
  }

  export type InvoiceItemCreateManyProductInputEnvelope = {
    data: InvoiceItemCreateManyProductInput | InvoiceItemCreateManyProductInput[]
  }

  export type PurchaseItemCreateWithoutProductInput = {
    id?: string
    quantity: number
    unitPrice: number
    total: number
    invoice: PurchaseInvoiceCreateNestedOneWithoutItemsInput
  }

  export type PurchaseItemUncheckedCreateWithoutProductInput = {
    id?: string
    invoiceId: string
    quantity: number
    unitPrice: number
    total: number
  }

  export type PurchaseItemCreateOrConnectWithoutProductInput = {
    where: PurchaseItemWhereUniqueInput
    create: XOR<PurchaseItemCreateWithoutProductInput, PurchaseItemUncheckedCreateWithoutProductInput>
  }

  export type PurchaseItemCreateManyProductInputEnvelope = {
    data: PurchaseItemCreateManyProductInput | PurchaseItemCreateManyProductInput[]
  }

  export type InventoryLogCreateWithoutProductInput = {
    id?: string
    date?: Date | string
    type: string
    quantity: number
    referenceId?: string | null
    description?: string | null
  }

  export type InventoryLogUncheckedCreateWithoutProductInput = {
    id?: string
    date?: Date | string
    type: string
    quantity: number
    referenceId?: string | null
    description?: string | null
  }

  export type InventoryLogCreateOrConnectWithoutProductInput = {
    where: InventoryLogWhereUniqueInput
    create: XOR<InventoryLogCreateWithoutProductInput, InventoryLogUncheckedCreateWithoutProductInput>
  }

  export type InventoryLogCreateManyProductInputEnvelope = {
    data: InventoryLogCreateManyProductInput | InventoryLogCreateManyProductInput[]
  }

  export type InvoiceItemUpsertWithWhereUniqueWithoutProductInput = {
    where: InvoiceItemWhereUniqueInput
    update: XOR<InvoiceItemUpdateWithoutProductInput, InvoiceItemUncheckedUpdateWithoutProductInput>
    create: XOR<InvoiceItemCreateWithoutProductInput, InvoiceItemUncheckedCreateWithoutProductInput>
  }

  export type InvoiceItemUpdateWithWhereUniqueWithoutProductInput = {
    where: InvoiceItemWhereUniqueInput
    data: XOR<InvoiceItemUpdateWithoutProductInput, InvoiceItemUncheckedUpdateWithoutProductInput>
  }

  export type InvoiceItemUpdateManyWithWhereWithoutProductInput = {
    where: InvoiceItemScalarWhereInput
    data: XOR<InvoiceItemUpdateManyMutationInput, InvoiceItemUncheckedUpdateManyWithoutProductInput>
  }

  export type InvoiceItemScalarWhereInput = {
    AND?: InvoiceItemScalarWhereInput | InvoiceItemScalarWhereInput[]
    OR?: InvoiceItemScalarWhereInput[]
    NOT?: InvoiceItemScalarWhereInput | InvoiceItemScalarWhereInput[]
    id?: StringFilter<"InvoiceItem"> | string
    invoiceId?: StringFilter<"InvoiceItem"> | string
    productId?: StringFilter<"InvoiceItem"> | string
    quantity?: FloatFilter<"InvoiceItem"> | number
    unitPrice?: FloatFilter<"InvoiceItem"> | number
    total?: FloatFilter<"InvoiceItem"> | number
  }

  export type PurchaseItemUpsertWithWhereUniqueWithoutProductInput = {
    where: PurchaseItemWhereUniqueInput
    update: XOR<PurchaseItemUpdateWithoutProductInput, PurchaseItemUncheckedUpdateWithoutProductInput>
    create: XOR<PurchaseItemCreateWithoutProductInput, PurchaseItemUncheckedCreateWithoutProductInput>
  }

  export type PurchaseItemUpdateWithWhereUniqueWithoutProductInput = {
    where: PurchaseItemWhereUniqueInput
    data: XOR<PurchaseItemUpdateWithoutProductInput, PurchaseItemUncheckedUpdateWithoutProductInput>
  }

  export type PurchaseItemUpdateManyWithWhereWithoutProductInput = {
    where: PurchaseItemScalarWhereInput
    data: XOR<PurchaseItemUpdateManyMutationInput, PurchaseItemUncheckedUpdateManyWithoutProductInput>
  }

  export type PurchaseItemScalarWhereInput = {
    AND?: PurchaseItemScalarWhereInput | PurchaseItemScalarWhereInput[]
    OR?: PurchaseItemScalarWhereInput[]
    NOT?: PurchaseItemScalarWhereInput | PurchaseItemScalarWhereInput[]
    id?: StringFilter<"PurchaseItem"> | string
    invoiceId?: StringFilter<"PurchaseItem"> | string
    productId?: StringFilter<"PurchaseItem"> | string
    quantity?: FloatFilter<"PurchaseItem"> | number
    unitPrice?: FloatFilter<"PurchaseItem"> | number
    total?: FloatFilter<"PurchaseItem"> | number
  }

  export type InventoryLogUpsertWithWhereUniqueWithoutProductInput = {
    where: InventoryLogWhereUniqueInput
    update: XOR<InventoryLogUpdateWithoutProductInput, InventoryLogUncheckedUpdateWithoutProductInput>
    create: XOR<InventoryLogCreateWithoutProductInput, InventoryLogUncheckedCreateWithoutProductInput>
  }

  export type InventoryLogUpdateWithWhereUniqueWithoutProductInput = {
    where: InventoryLogWhereUniqueInput
    data: XOR<InventoryLogUpdateWithoutProductInput, InventoryLogUncheckedUpdateWithoutProductInput>
  }

  export type InventoryLogUpdateManyWithWhereWithoutProductInput = {
    where: InventoryLogScalarWhereInput
    data: XOR<InventoryLogUpdateManyMutationInput, InventoryLogUncheckedUpdateManyWithoutProductInput>
  }

  export type InventoryLogScalarWhereInput = {
    AND?: InventoryLogScalarWhereInput | InventoryLogScalarWhereInput[]
    OR?: InventoryLogScalarWhereInput[]
    NOT?: InventoryLogScalarWhereInput | InventoryLogScalarWhereInput[]
    id?: StringFilter<"InventoryLog"> | string
    productId?: StringFilter<"InventoryLog"> | string
    date?: DateTimeFilter<"InventoryLog"> | Date | string
    type?: StringFilter<"InventoryLog"> | string
    quantity?: FloatFilter<"InventoryLog"> | number
    referenceId?: StringNullableFilter<"InventoryLog"> | string | null
    description?: StringNullableFilter<"InventoryLog"> | string | null
  }

  export type CustomerCreateWithoutInvoicesInput = {
    id?: string
    code: string
    name: string
    nameAr?: string | null
    email?: string | null
    phone?: string | null
    address?: string | null
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CustomerUncheckedCreateWithoutInvoicesInput = {
    id?: string
    code: string
    name: string
    nameAr?: string | null
    email?: string | null
    phone?: string | null
    address?: string | null
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CustomerCreateOrConnectWithoutInvoicesInput = {
    where: CustomerWhereUniqueInput
    create: XOR<CustomerCreateWithoutInvoicesInput, CustomerUncheckedCreateWithoutInvoicesInput>
  }

  export type InvoiceItemCreateWithoutInvoiceInput = {
    id?: string
    quantity: number
    unitPrice: number
    total: number
    product: ProductCreateNestedOneWithoutItemsInput
  }

  export type InvoiceItemUncheckedCreateWithoutInvoiceInput = {
    id?: string
    productId: string
    quantity: number
    unitPrice: number
    total: number
  }

  export type InvoiceItemCreateOrConnectWithoutInvoiceInput = {
    where: InvoiceItemWhereUniqueInput
    create: XOR<InvoiceItemCreateWithoutInvoiceInput, InvoiceItemUncheckedCreateWithoutInvoiceInput>
  }

  export type InvoiceItemCreateManyInvoiceInputEnvelope = {
    data: InvoiceItemCreateManyInvoiceInput | InvoiceItemCreateManyInvoiceInput[]
  }

  export type JournalVoucherCreateWithoutInvoicesInput = {
    id?: string
    reference: string
    date: Date | string
    description: string
    status?: string
    createdAt?: Date | string
    entries?: JournalEntryCreateNestedManyWithoutJournalVoucherInput
    purchaseInvoices?: PurchaseInvoiceCreateNestedManyWithoutJournalVoucherInput
  }

  export type JournalVoucherUncheckedCreateWithoutInvoicesInput = {
    id?: string
    reference: string
    date: Date | string
    description: string
    status?: string
    createdAt?: Date | string
    entries?: JournalEntryUncheckedCreateNestedManyWithoutJournalVoucherInput
    purchaseInvoices?: PurchaseInvoiceUncheckedCreateNestedManyWithoutJournalVoucherInput
  }

  export type JournalVoucherCreateOrConnectWithoutInvoicesInput = {
    where: JournalVoucherWhereUniqueInput
    create: XOR<JournalVoucherCreateWithoutInvoicesInput, JournalVoucherUncheckedCreateWithoutInvoicesInput>
  }

  export type CustomerUpsertWithoutInvoicesInput = {
    update: XOR<CustomerUpdateWithoutInvoicesInput, CustomerUncheckedUpdateWithoutInvoicesInput>
    create: XOR<CustomerCreateWithoutInvoicesInput, CustomerUncheckedCreateWithoutInvoicesInput>
    where?: CustomerWhereInput
  }

  export type CustomerUpdateToOneWithWhereWithoutInvoicesInput = {
    where?: CustomerWhereInput
    data: XOR<CustomerUpdateWithoutInvoicesInput, CustomerUncheckedUpdateWithoutInvoicesInput>
  }

  export type CustomerUpdateWithoutInvoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerUncheckedUpdateWithoutInvoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceItemUpsertWithWhereUniqueWithoutInvoiceInput = {
    where: InvoiceItemWhereUniqueInput
    update: XOR<InvoiceItemUpdateWithoutInvoiceInput, InvoiceItemUncheckedUpdateWithoutInvoiceInput>
    create: XOR<InvoiceItemCreateWithoutInvoiceInput, InvoiceItemUncheckedCreateWithoutInvoiceInput>
  }

  export type InvoiceItemUpdateWithWhereUniqueWithoutInvoiceInput = {
    where: InvoiceItemWhereUniqueInput
    data: XOR<InvoiceItemUpdateWithoutInvoiceInput, InvoiceItemUncheckedUpdateWithoutInvoiceInput>
  }

  export type InvoiceItemUpdateManyWithWhereWithoutInvoiceInput = {
    where: InvoiceItemScalarWhereInput
    data: XOR<InvoiceItemUpdateManyMutationInput, InvoiceItemUncheckedUpdateManyWithoutInvoiceInput>
  }

  export type JournalVoucherUpsertWithoutInvoicesInput = {
    update: XOR<JournalVoucherUpdateWithoutInvoicesInput, JournalVoucherUncheckedUpdateWithoutInvoicesInput>
    create: XOR<JournalVoucherCreateWithoutInvoicesInput, JournalVoucherUncheckedCreateWithoutInvoicesInput>
    where?: JournalVoucherWhereInput
  }

  export type JournalVoucherUpdateToOneWithWhereWithoutInvoicesInput = {
    where?: JournalVoucherWhereInput
    data: XOR<JournalVoucherUpdateWithoutInvoicesInput, JournalVoucherUncheckedUpdateWithoutInvoicesInput>
  }

  export type JournalVoucherUpdateWithoutInvoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    reference?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entries?: JournalEntryUpdateManyWithoutJournalVoucherNestedInput
    purchaseInvoices?: PurchaseInvoiceUpdateManyWithoutJournalVoucherNestedInput
  }

  export type JournalVoucherUncheckedUpdateWithoutInvoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    reference?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entries?: JournalEntryUncheckedUpdateManyWithoutJournalVoucherNestedInput
    purchaseInvoices?: PurchaseInvoiceUncheckedUpdateManyWithoutJournalVoucherNestedInput
  }

  export type SupplierCreateWithoutInvoicesInput = {
    id?: string
    code: string
    name: string
    nameAr?: string | null
    email?: string | null
    phone?: string | null
    address?: string | null
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SupplierUncheckedCreateWithoutInvoicesInput = {
    id?: string
    code: string
    name: string
    nameAr?: string | null
    email?: string | null
    phone?: string | null
    address?: string | null
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SupplierCreateOrConnectWithoutInvoicesInput = {
    where: SupplierWhereUniqueInput
    create: XOR<SupplierCreateWithoutInvoicesInput, SupplierUncheckedCreateWithoutInvoicesInput>
  }

  export type PurchaseItemCreateWithoutInvoiceInput = {
    id?: string
    quantity: number
    unitPrice: number
    total: number
    product: ProductCreateNestedOneWithoutPurchaseItemsInput
  }

  export type PurchaseItemUncheckedCreateWithoutInvoiceInput = {
    id?: string
    productId: string
    quantity: number
    unitPrice: number
    total: number
  }

  export type PurchaseItemCreateOrConnectWithoutInvoiceInput = {
    where: PurchaseItemWhereUniqueInput
    create: XOR<PurchaseItemCreateWithoutInvoiceInput, PurchaseItemUncheckedCreateWithoutInvoiceInput>
  }

  export type PurchaseItemCreateManyInvoiceInputEnvelope = {
    data: PurchaseItemCreateManyInvoiceInput | PurchaseItemCreateManyInvoiceInput[]
  }

  export type JournalVoucherCreateWithoutPurchaseInvoicesInput = {
    id?: string
    reference: string
    date: Date | string
    description: string
    status?: string
    createdAt?: Date | string
    entries?: JournalEntryCreateNestedManyWithoutJournalVoucherInput
    invoices?: SalesInvoiceCreateNestedManyWithoutJournalVoucherInput
  }

  export type JournalVoucherUncheckedCreateWithoutPurchaseInvoicesInput = {
    id?: string
    reference: string
    date: Date | string
    description: string
    status?: string
    createdAt?: Date | string
    entries?: JournalEntryUncheckedCreateNestedManyWithoutJournalVoucherInput
    invoices?: SalesInvoiceUncheckedCreateNestedManyWithoutJournalVoucherInput
  }

  export type JournalVoucherCreateOrConnectWithoutPurchaseInvoicesInput = {
    where: JournalVoucherWhereUniqueInput
    create: XOR<JournalVoucherCreateWithoutPurchaseInvoicesInput, JournalVoucherUncheckedCreateWithoutPurchaseInvoicesInput>
  }

  export type SupplierUpsertWithoutInvoicesInput = {
    update: XOR<SupplierUpdateWithoutInvoicesInput, SupplierUncheckedUpdateWithoutInvoicesInput>
    create: XOR<SupplierCreateWithoutInvoicesInput, SupplierUncheckedCreateWithoutInvoicesInput>
    where?: SupplierWhereInput
  }

  export type SupplierUpdateToOneWithWhereWithoutInvoicesInput = {
    where?: SupplierWhereInput
    data: XOR<SupplierUpdateWithoutInvoicesInput, SupplierUncheckedUpdateWithoutInvoicesInput>
  }

  export type SupplierUpdateWithoutInvoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupplierUncheckedUpdateWithoutInvoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PurchaseItemUpsertWithWhereUniqueWithoutInvoiceInput = {
    where: PurchaseItemWhereUniqueInput
    update: XOR<PurchaseItemUpdateWithoutInvoiceInput, PurchaseItemUncheckedUpdateWithoutInvoiceInput>
    create: XOR<PurchaseItemCreateWithoutInvoiceInput, PurchaseItemUncheckedCreateWithoutInvoiceInput>
  }

  export type PurchaseItemUpdateWithWhereUniqueWithoutInvoiceInput = {
    where: PurchaseItemWhereUniqueInput
    data: XOR<PurchaseItemUpdateWithoutInvoiceInput, PurchaseItemUncheckedUpdateWithoutInvoiceInput>
  }

  export type PurchaseItemUpdateManyWithWhereWithoutInvoiceInput = {
    where: PurchaseItemScalarWhereInput
    data: XOR<PurchaseItemUpdateManyMutationInput, PurchaseItemUncheckedUpdateManyWithoutInvoiceInput>
  }

  export type JournalVoucherUpsertWithoutPurchaseInvoicesInput = {
    update: XOR<JournalVoucherUpdateWithoutPurchaseInvoicesInput, JournalVoucherUncheckedUpdateWithoutPurchaseInvoicesInput>
    create: XOR<JournalVoucherCreateWithoutPurchaseInvoicesInput, JournalVoucherUncheckedCreateWithoutPurchaseInvoicesInput>
    where?: JournalVoucherWhereInput
  }

  export type JournalVoucherUpdateToOneWithWhereWithoutPurchaseInvoicesInput = {
    where?: JournalVoucherWhereInput
    data: XOR<JournalVoucherUpdateWithoutPurchaseInvoicesInput, JournalVoucherUncheckedUpdateWithoutPurchaseInvoicesInput>
  }

  export type JournalVoucherUpdateWithoutPurchaseInvoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    reference?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entries?: JournalEntryUpdateManyWithoutJournalVoucherNestedInput
    invoices?: SalesInvoiceUpdateManyWithoutJournalVoucherNestedInput
  }

  export type JournalVoucherUncheckedUpdateWithoutPurchaseInvoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    reference?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entries?: JournalEntryUncheckedUpdateManyWithoutJournalVoucherNestedInput
    invoices?: SalesInvoiceUncheckedUpdateManyWithoutJournalVoucherNestedInput
  }

  export type SalesInvoiceCreateWithoutItemsInput = {
    id?: string
    invoiceNumber: string
    date: Date | string
    totalAmount: number
    taxAmount?: number
    discount?: number
    netAmount: number
    status: string
    createdAt?: Date | string
    updatedAt?: Date | string
    customer: CustomerCreateNestedOneWithoutInvoicesInput
    journalVoucher?: JournalVoucherCreateNestedOneWithoutInvoicesInput
  }

  export type SalesInvoiceUncheckedCreateWithoutItemsInput = {
    id?: string
    invoiceNumber: string
    date: Date | string
    customerId: string
    totalAmount: number
    taxAmount?: number
    discount?: number
    netAmount: number
    status: string
    journalVoucherId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SalesInvoiceCreateOrConnectWithoutItemsInput = {
    where: SalesInvoiceWhereUniqueInput
    create: XOR<SalesInvoiceCreateWithoutItemsInput, SalesInvoiceUncheckedCreateWithoutItemsInput>
  }

  export type ProductCreateWithoutItemsInput = {
    id?: string
    sku: string
    name: string
    nameAr?: string | null
    description?: string | null
    category?: string | null
    unit?: string
    costPrice?: number
    salePrice?: number
    stockQuantity?: number
    reorderPoint?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    purchaseItems?: PurchaseItemCreateNestedManyWithoutProductInput
    inventoryLogs?: InventoryLogCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutItemsInput = {
    id?: string
    sku: string
    name: string
    nameAr?: string | null
    description?: string | null
    category?: string | null
    unit?: string
    costPrice?: number
    salePrice?: number
    stockQuantity?: number
    reorderPoint?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    purchaseItems?: PurchaseItemUncheckedCreateNestedManyWithoutProductInput
    inventoryLogs?: InventoryLogUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutItemsInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutItemsInput, ProductUncheckedCreateWithoutItemsInput>
  }

  export type SalesInvoiceUpsertWithoutItemsInput = {
    update: XOR<SalesInvoiceUpdateWithoutItemsInput, SalesInvoiceUncheckedUpdateWithoutItemsInput>
    create: XOR<SalesInvoiceCreateWithoutItemsInput, SalesInvoiceUncheckedCreateWithoutItemsInput>
    where?: SalesInvoiceWhereInput
  }

  export type SalesInvoiceUpdateToOneWithWhereWithoutItemsInput = {
    where?: SalesInvoiceWhereInput
    data: XOR<SalesInvoiceUpdateWithoutItemsInput, SalesInvoiceUncheckedUpdateWithoutItemsInput>
  }

  export type SalesInvoiceUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    netAmount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUpdateOneRequiredWithoutInvoicesNestedInput
    journalVoucher?: JournalVoucherUpdateOneWithoutInvoicesNestedInput
  }

  export type SalesInvoiceUncheckedUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    customerId?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    netAmount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    journalVoucherId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductUpsertWithoutItemsInput = {
    update: XOR<ProductUpdateWithoutItemsInput, ProductUncheckedUpdateWithoutItemsInput>
    create: XOR<ProductCreateWithoutItemsInput, ProductUncheckedCreateWithoutItemsInput>
    where?: ProductWhereInput
  }

  export type ProductUpdateToOneWithWhereWithoutItemsInput = {
    where?: ProductWhereInput
    data: XOR<ProductUpdateWithoutItemsInput, ProductUncheckedUpdateWithoutItemsInput>
  }

  export type ProductUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    unit?: StringFieldUpdateOperationsInput | string
    costPrice?: FloatFieldUpdateOperationsInput | number
    salePrice?: FloatFieldUpdateOperationsInput | number
    stockQuantity?: FloatFieldUpdateOperationsInput | number
    reorderPoint?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    purchaseItems?: PurchaseItemUpdateManyWithoutProductNestedInput
    inventoryLogs?: InventoryLogUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    unit?: StringFieldUpdateOperationsInput | string
    costPrice?: FloatFieldUpdateOperationsInput | number
    salePrice?: FloatFieldUpdateOperationsInput | number
    stockQuantity?: FloatFieldUpdateOperationsInput | number
    reorderPoint?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    purchaseItems?: PurchaseItemUncheckedUpdateManyWithoutProductNestedInput
    inventoryLogs?: InventoryLogUncheckedUpdateManyWithoutProductNestedInput
  }

  export type PurchaseInvoiceCreateWithoutItemsInput = {
    id?: string
    invoiceNumber: string
    date: Date | string
    totalAmount: number
    taxAmount?: number
    discount?: number
    netAmount: number
    status: string
    createdAt?: Date | string
    updatedAt?: Date | string
    supplier: SupplierCreateNestedOneWithoutInvoicesInput
    journalVoucher?: JournalVoucherCreateNestedOneWithoutPurchaseInvoicesInput
  }

  export type PurchaseInvoiceUncheckedCreateWithoutItemsInput = {
    id?: string
    invoiceNumber: string
    date: Date | string
    supplierId: string
    totalAmount: number
    taxAmount?: number
    discount?: number
    netAmount: number
    status: string
    journalVoucherId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PurchaseInvoiceCreateOrConnectWithoutItemsInput = {
    where: PurchaseInvoiceWhereUniqueInput
    create: XOR<PurchaseInvoiceCreateWithoutItemsInput, PurchaseInvoiceUncheckedCreateWithoutItemsInput>
  }

  export type ProductCreateWithoutPurchaseItemsInput = {
    id?: string
    sku: string
    name: string
    nameAr?: string | null
    description?: string | null
    category?: string | null
    unit?: string
    costPrice?: number
    salePrice?: number
    stockQuantity?: number
    reorderPoint?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: InvoiceItemCreateNestedManyWithoutProductInput
    inventoryLogs?: InventoryLogCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutPurchaseItemsInput = {
    id?: string
    sku: string
    name: string
    nameAr?: string | null
    description?: string | null
    category?: string | null
    unit?: string
    costPrice?: number
    salePrice?: number
    stockQuantity?: number
    reorderPoint?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: InvoiceItemUncheckedCreateNestedManyWithoutProductInput
    inventoryLogs?: InventoryLogUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutPurchaseItemsInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutPurchaseItemsInput, ProductUncheckedCreateWithoutPurchaseItemsInput>
  }

  export type PurchaseInvoiceUpsertWithoutItemsInput = {
    update: XOR<PurchaseInvoiceUpdateWithoutItemsInput, PurchaseInvoiceUncheckedUpdateWithoutItemsInput>
    create: XOR<PurchaseInvoiceCreateWithoutItemsInput, PurchaseInvoiceUncheckedCreateWithoutItemsInput>
    where?: PurchaseInvoiceWhereInput
  }

  export type PurchaseInvoiceUpdateToOneWithWhereWithoutItemsInput = {
    where?: PurchaseInvoiceWhereInput
    data: XOR<PurchaseInvoiceUpdateWithoutItemsInput, PurchaseInvoiceUncheckedUpdateWithoutItemsInput>
  }

  export type PurchaseInvoiceUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    netAmount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    supplier?: SupplierUpdateOneRequiredWithoutInvoicesNestedInput
    journalVoucher?: JournalVoucherUpdateOneWithoutPurchaseInvoicesNestedInput
  }

  export type PurchaseInvoiceUncheckedUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    supplierId?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    netAmount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    journalVoucherId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductUpsertWithoutPurchaseItemsInput = {
    update: XOR<ProductUpdateWithoutPurchaseItemsInput, ProductUncheckedUpdateWithoutPurchaseItemsInput>
    create: XOR<ProductCreateWithoutPurchaseItemsInput, ProductUncheckedCreateWithoutPurchaseItemsInput>
    where?: ProductWhereInput
  }

  export type ProductUpdateToOneWithWhereWithoutPurchaseItemsInput = {
    where?: ProductWhereInput
    data: XOR<ProductUpdateWithoutPurchaseItemsInput, ProductUncheckedUpdateWithoutPurchaseItemsInput>
  }

  export type ProductUpdateWithoutPurchaseItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    unit?: StringFieldUpdateOperationsInput | string
    costPrice?: FloatFieldUpdateOperationsInput | number
    salePrice?: FloatFieldUpdateOperationsInput | number
    stockQuantity?: FloatFieldUpdateOperationsInput | number
    reorderPoint?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: InvoiceItemUpdateManyWithoutProductNestedInput
    inventoryLogs?: InventoryLogUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutPurchaseItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    unit?: StringFieldUpdateOperationsInput | string
    costPrice?: FloatFieldUpdateOperationsInput | number
    salePrice?: FloatFieldUpdateOperationsInput | number
    stockQuantity?: FloatFieldUpdateOperationsInput | number
    reorderPoint?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: InvoiceItemUncheckedUpdateManyWithoutProductNestedInput
    inventoryLogs?: InventoryLogUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ProductCreateWithoutInventoryLogsInput = {
    id?: string
    sku: string
    name: string
    nameAr?: string | null
    description?: string | null
    category?: string | null
    unit?: string
    costPrice?: number
    salePrice?: number
    stockQuantity?: number
    reorderPoint?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: InvoiceItemCreateNestedManyWithoutProductInput
    purchaseItems?: PurchaseItemCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutInventoryLogsInput = {
    id?: string
    sku: string
    name: string
    nameAr?: string | null
    description?: string | null
    category?: string | null
    unit?: string
    costPrice?: number
    salePrice?: number
    stockQuantity?: number
    reorderPoint?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: InvoiceItemUncheckedCreateNestedManyWithoutProductInput
    purchaseItems?: PurchaseItemUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutInventoryLogsInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutInventoryLogsInput, ProductUncheckedCreateWithoutInventoryLogsInput>
  }

  export type ProductUpsertWithoutInventoryLogsInput = {
    update: XOR<ProductUpdateWithoutInventoryLogsInput, ProductUncheckedUpdateWithoutInventoryLogsInput>
    create: XOR<ProductCreateWithoutInventoryLogsInput, ProductUncheckedCreateWithoutInventoryLogsInput>
    where?: ProductWhereInput
  }

  export type ProductUpdateToOneWithWhereWithoutInventoryLogsInput = {
    where?: ProductWhereInput
    data: XOR<ProductUpdateWithoutInventoryLogsInput, ProductUncheckedUpdateWithoutInventoryLogsInput>
  }

  export type ProductUpdateWithoutInventoryLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    unit?: StringFieldUpdateOperationsInput | string
    costPrice?: FloatFieldUpdateOperationsInput | number
    salePrice?: FloatFieldUpdateOperationsInput | number
    stockQuantity?: FloatFieldUpdateOperationsInput | number
    reorderPoint?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: InvoiceItemUpdateManyWithoutProductNestedInput
    purchaseItems?: PurchaseItemUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutInventoryLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    unit?: StringFieldUpdateOperationsInput | string
    costPrice?: FloatFieldUpdateOperationsInput | number
    salePrice?: FloatFieldUpdateOperationsInput | number
    stockQuantity?: FloatFieldUpdateOperationsInput | number
    reorderPoint?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: InvoiceItemUncheckedUpdateManyWithoutProductNestedInput
    purchaseItems?: PurchaseItemUncheckedUpdateManyWithoutProductNestedInput
  }

  export type AccountCreateWithoutChildrenInput = {
    id?: string
    code: string
    name: string
    nameAr?: string | null
    type: string
    createdAt?: Date | string
    updatedAt?: Date | string
    parent?: AccountCreateNestedOneWithoutChildrenInput
    entries?: JournalEntryCreateNestedManyWithoutAccountInput
  }

  export type AccountUncheckedCreateWithoutChildrenInput = {
    id?: string
    code: string
    name: string
    nameAr?: string | null
    type: string
    parentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    entries?: JournalEntryUncheckedCreateNestedManyWithoutAccountInput
  }

  export type AccountCreateOrConnectWithoutChildrenInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutChildrenInput, AccountUncheckedCreateWithoutChildrenInput>
  }

  export type AccountCreateWithoutParentInput = {
    id?: string
    code: string
    name: string
    nameAr?: string | null
    type: string
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: AccountCreateNestedManyWithoutParentInput
    entries?: JournalEntryCreateNestedManyWithoutAccountInput
  }

  export type AccountUncheckedCreateWithoutParentInput = {
    id?: string
    code: string
    name: string
    nameAr?: string | null
    type: string
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: AccountUncheckedCreateNestedManyWithoutParentInput
    entries?: JournalEntryUncheckedCreateNestedManyWithoutAccountInput
  }

  export type AccountCreateOrConnectWithoutParentInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutParentInput, AccountUncheckedCreateWithoutParentInput>
  }

  export type AccountCreateManyParentInputEnvelope = {
    data: AccountCreateManyParentInput | AccountCreateManyParentInput[]
  }

  export type JournalEntryCreateWithoutAccountInput = {
    id?: string
    date: Date | string
    description: string
    debit?: number
    credit?: number
    reference?: string | null
    createdAt?: Date | string
    journalVoucher?: JournalVoucherCreateNestedOneWithoutEntriesInput
  }

  export type JournalEntryUncheckedCreateWithoutAccountInput = {
    id?: string
    date: Date | string
    description: string
    debit?: number
    credit?: number
    reference?: string | null
    journalVoucherId?: string | null
    createdAt?: Date | string
  }

  export type JournalEntryCreateOrConnectWithoutAccountInput = {
    where: JournalEntryWhereUniqueInput
    create: XOR<JournalEntryCreateWithoutAccountInput, JournalEntryUncheckedCreateWithoutAccountInput>
  }

  export type JournalEntryCreateManyAccountInputEnvelope = {
    data: JournalEntryCreateManyAccountInput | JournalEntryCreateManyAccountInput[]
  }

  export type AccountUpsertWithoutChildrenInput = {
    update: XOR<AccountUpdateWithoutChildrenInput, AccountUncheckedUpdateWithoutChildrenInput>
    create: XOR<AccountCreateWithoutChildrenInput, AccountUncheckedCreateWithoutChildrenInput>
    where?: AccountWhereInput
  }

  export type AccountUpdateToOneWithWhereWithoutChildrenInput = {
    where?: AccountWhereInput
    data: XOR<AccountUpdateWithoutChildrenInput, AccountUncheckedUpdateWithoutChildrenInput>
  }

  export type AccountUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: AccountUpdateOneWithoutChildrenNestedInput
    entries?: JournalEntryUpdateManyWithoutAccountNestedInput
  }

  export type AccountUncheckedUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entries?: JournalEntryUncheckedUpdateManyWithoutAccountNestedInput
  }

  export type AccountUpsertWithWhereUniqueWithoutParentInput = {
    where: AccountWhereUniqueInput
    update: XOR<AccountUpdateWithoutParentInput, AccountUncheckedUpdateWithoutParentInput>
    create: XOR<AccountCreateWithoutParentInput, AccountUncheckedCreateWithoutParentInput>
  }

  export type AccountUpdateWithWhereUniqueWithoutParentInput = {
    where: AccountWhereUniqueInput
    data: XOR<AccountUpdateWithoutParentInput, AccountUncheckedUpdateWithoutParentInput>
  }

  export type AccountUpdateManyWithWhereWithoutParentInput = {
    where: AccountScalarWhereInput
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyWithoutParentInput>
  }

  export type AccountScalarWhereInput = {
    AND?: AccountScalarWhereInput | AccountScalarWhereInput[]
    OR?: AccountScalarWhereInput[]
    NOT?: AccountScalarWhereInput | AccountScalarWhereInput[]
    id?: StringFilter<"Account"> | string
    code?: StringFilter<"Account"> | string
    name?: StringFilter<"Account"> | string
    nameAr?: StringNullableFilter<"Account"> | string | null
    type?: StringFilter<"Account"> | string
    parentId?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
  }

  export type JournalEntryUpsertWithWhereUniqueWithoutAccountInput = {
    where: JournalEntryWhereUniqueInput
    update: XOR<JournalEntryUpdateWithoutAccountInput, JournalEntryUncheckedUpdateWithoutAccountInput>
    create: XOR<JournalEntryCreateWithoutAccountInput, JournalEntryUncheckedCreateWithoutAccountInput>
  }

  export type JournalEntryUpdateWithWhereUniqueWithoutAccountInput = {
    where: JournalEntryWhereUniqueInput
    data: XOR<JournalEntryUpdateWithoutAccountInput, JournalEntryUncheckedUpdateWithoutAccountInput>
  }

  export type JournalEntryUpdateManyWithWhereWithoutAccountInput = {
    where: JournalEntryScalarWhereInput
    data: XOR<JournalEntryUpdateManyMutationInput, JournalEntryUncheckedUpdateManyWithoutAccountInput>
  }

  export type JournalEntryScalarWhereInput = {
    AND?: JournalEntryScalarWhereInput | JournalEntryScalarWhereInput[]
    OR?: JournalEntryScalarWhereInput[]
    NOT?: JournalEntryScalarWhereInput | JournalEntryScalarWhereInput[]
    id?: StringFilter<"JournalEntry"> | string
    date?: DateTimeFilter<"JournalEntry"> | Date | string
    description?: StringFilter<"JournalEntry"> | string
    accountId?: StringFilter<"JournalEntry"> | string
    debit?: FloatFilter<"JournalEntry"> | number
    credit?: FloatFilter<"JournalEntry"> | number
    reference?: StringNullableFilter<"JournalEntry"> | string | null
    journalVoucherId?: StringNullableFilter<"JournalEntry"> | string | null
    createdAt?: DateTimeFilter<"JournalEntry"> | Date | string
  }

  export type JournalEntryCreateWithoutJournalVoucherInput = {
    id?: string
    date: Date | string
    description: string
    debit?: number
    credit?: number
    reference?: string | null
    createdAt?: Date | string
    account: AccountCreateNestedOneWithoutEntriesInput
  }

  export type JournalEntryUncheckedCreateWithoutJournalVoucherInput = {
    id?: string
    date: Date | string
    description: string
    accountId: string
    debit?: number
    credit?: number
    reference?: string | null
    createdAt?: Date | string
  }

  export type JournalEntryCreateOrConnectWithoutJournalVoucherInput = {
    where: JournalEntryWhereUniqueInput
    create: XOR<JournalEntryCreateWithoutJournalVoucherInput, JournalEntryUncheckedCreateWithoutJournalVoucherInput>
  }

  export type JournalEntryCreateManyJournalVoucherInputEnvelope = {
    data: JournalEntryCreateManyJournalVoucherInput | JournalEntryCreateManyJournalVoucherInput[]
  }

  export type SalesInvoiceCreateWithoutJournalVoucherInput = {
    id?: string
    invoiceNumber: string
    date: Date | string
    totalAmount: number
    taxAmount?: number
    discount?: number
    netAmount: number
    status: string
    createdAt?: Date | string
    updatedAt?: Date | string
    customer: CustomerCreateNestedOneWithoutInvoicesInput
    items?: InvoiceItemCreateNestedManyWithoutInvoiceInput
  }

  export type SalesInvoiceUncheckedCreateWithoutJournalVoucherInput = {
    id?: string
    invoiceNumber: string
    date: Date | string
    customerId: string
    totalAmount: number
    taxAmount?: number
    discount?: number
    netAmount: number
    status: string
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: InvoiceItemUncheckedCreateNestedManyWithoutInvoiceInput
  }

  export type SalesInvoiceCreateOrConnectWithoutJournalVoucherInput = {
    where: SalesInvoiceWhereUniqueInput
    create: XOR<SalesInvoiceCreateWithoutJournalVoucherInput, SalesInvoiceUncheckedCreateWithoutJournalVoucherInput>
  }

  export type SalesInvoiceCreateManyJournalVoucherInputEnvelope = {
    data: SalesInvoiceCreateManyJournalVoucherInput | SalesInvoiceCreateManyJournalVoucherInput[]
  }

  export type PurchaseInvoiceCreateWithoutJournalVoucherInput = {
    id?: string
    invoiceNumber: string
    date: Date | string
    totalAmount: number
    taxAmount?: number
    discount?: number
    netAmount: number
    status: string
    createdAt?: Date | string
    updatedAt?: Date | string
    supplier: SupplierCreateNestedOneWithoutInvoicesInput
    items?: PurchaseItemCreateNestedManyWithoutInvoiceInput
  }

  export type PurchaseInvoiceUncheckedCreateWithoutJournalVoucherInput = {
    id?: string
    invoiceNumber: string
    date: Date | string
    supplierId: string
    totalAmount: number
    taxAmount?: number
    discount?: number
    netAmount: number
    status: string
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: PurchaseItemUncheckedCreateNestedManyWithoutInvoiceInput
  }

  export type PurchaseInvoiceCreateOrConnectWithoutJournalVoucherInput = {
    where: PurchaseInvoiceWhereUniqueInput
    create: XOR<PurchaseInvoiceCreateWithoutJournalVoucherInput, PurchaseInvoiceUncheckedCreateWithoutJournalVoucherInput>
  }

  export type PurchaseInvoiceCreateManyJournalVoucherInputEnvelope = {
    data: PurchaseInvoiceCreateManyJournalVoucherInput | PurchaseInvoiceCreateManyJournalVoucherInput[]
  }

  export type JournalEntryUpsertWithWhereUniqueWithoutJournalVoucherInput = {
    where: JournalEntryWhereUniqueInput
    update: XOR<JournalEntryUpdateWithoutJournalVoucherInput, JournalEntryUncheckedUpdateWithoutJournalVoucherInput>
    create: XOR<JournalEntryCreateWithoutJournalVoucherInput, JournalEntryUncheckedCreateWithoutJournalVoucherInput>
  }

  export type JournalEntryUpdateWithWhereUniqueWithoutJournalVoucherInput = {
    where: JournalEntryWhereUniqueInput
    data: XOR<JournalEntryUpdateWithoutJournalVoucherInput, JournalEntryUncheckedUpdateWithoutJournalVoucherInput>
  }

  export type JournalEntryUpdateManyWithWhereWithoutJournalVoucherInput = {
    where: JournalEntryScalarWhereInput
    data: XOR<JournalEntryUpdateManyMutationInput, JournalEntryUncheckedUpdateManyWithoutJournalVoucherInput>
  }

  export type SalesInvoiceUpsertWithWhereUniqueWithoutJournalVoucherInput = {
    where: SalesInvoiceWhereUniqueInput
    update: XOR<SalesInvoiceUpdateWithoutJournalVoucherInput, SalesInvoiceUncheckedUpdateWithoutJournalVoucherInput>
    create: XOR<SalesInvoiceCreateWithoutJournalVoucherInput, SalesInvoiceUncheckedCreateWithoutJournalVoucherInput>
  }

  export type SalesInvoiceUpdateWithWhereUniqueWithoutJournalVoucherInput = {
    where: SalesInvoiceWhereUniqueInput
    data: XOR<SalesInvoiceUpdateWithoutJournalVoucherInput, SalesInvoiceUncheckedUpdateWithoutJournalVoucherInput>
  }

  export type SalesInvoiceUpdateManyWithWhereWithoutJournalVoucherInput = {
    where: SalesInvoiceScalarWhereInput
    data: XOR<SalesInvoiceUpdateManyMutationInput, SalesInvoiceUncheckedUpdateManyWithoutJournalVoucherInput>
  }

  export type PurchaseInvoiceUpsertWithWhereUniqueWithoutJournalVoucherInput = {
    where: PurchaseInvoiceWhereUniqueInput
    update: XOR<PurchaseInvoiceUpdateWithoutJournalVoucherInput, PurchaseInvoiceUncheckedUpdateWithoutJournalVoucherInput>
    create: XOR<PurchaseInvoiceCreateWithoutJournalVoucherInput, PurchaseInvoiceUncheckedCreateWithoutJournalVoucherInput>
  }

  export type PurchaseInvoiceUpdateWithWhereUniqueWithoutJournalVoucherInput = {
    where: PurchaseInvoiceWhereUniqueInput
    data: XOR<PurchaseInvoiceUpdateWithoutJournalVoucherInput, PurchaseInvoiceUncheckedUpdateWithoutJournalVoucherInput>
  }

  export type PurchaseInvoiceUpdateManyWithWhereWithoutJournalVoucherInput = {
    where: PurchaseInvoiceScalarWhereInput
    data: XOR<PurchaseInvoiceUpdateManyMutationInput, PurchaseInvoiceUncheckedUpdateManyWithoutJournalVoucherInput>
  }

  export type AccountCreateWithoutEntriesInput = {
    id?: string
    code: string
    name: string
    nameAr?: string | null
    type: string
    createdAt?: Date | string
    updatedAt?: Date | string
    parent?: AccountCreateNestedOneWithoutChildrenInput
    children?: AccountCreateNestedManyWithoutParentInput
  }

  export type AccountUncheckedCreateWithoutEntriesInput = {
    id?: string
    code: string
    name: string
    nameAr?: string | null
    type: string
    parentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: AccountUncheckedCreateNestedManyWithoutParentInput
  }

  export type AccountCreateOrConnectWithoutEntriesInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutEntriesInput, AccountUncheckedCreateWithoutEntriesInput>
  }

  export type JournalVoucherCreateWithoutEntriesInput = {
    id?: string
    reference: string
    date: Date | string
    description: string
    status?: string
    createdAt?: Date | string
    invoices?: SalesInvoiceCreateNestedManyWithoutJournalVoucherInput
    purchaseInvoices?: PurchaseInvoiceCreateNestedManyWithoutJournalVoucherInput
  }

  export type JournalVoucherUncheckedCreateWithoutEntriesInput = {
    id?: string
    reference: string
    date: Date | string
    description: string
    status?: string
    createdAt?: Date | string
    invoices?: SalesInvoiceUncheckedCreateNestedManyWithoutJournalVoucherInput
    purchaseInvoices?: PurchaseInvoiceUncheckedCreateNestedManyWithoutJournalVoucherInput
  }

  export type JournalVoucherCreateOrConnectWithoutEntriesInput = {
    where: JournalVoucherWhereUniqueInput
    create: XOR<JournalVoucherCreateWithoutEntriesInput, JournalVoucherUncheckedCreateWithoutEntriesInput>
  }

  export type AccountUpsertWithoutEntriesInput = {
    update: XOR<AccountUpdateWithoutEntriesInput, AccountUncheckedUpdateWithoutEntriesInput>
    create: XOR<AccountCreateWithoutEntriesInput, AccountUncheckedCreateWithoutEntriesInput>
    where?: AccountWhereInput
  }

  export type AccountUpdateToOneWithWhereWithoutEntriesInput = {
    where?: AccountWhereInput
    data: XOR<AccountUpdateWithoutEntriesInput, AccountUncheckedUpdateWithoutEntriesInput>
  }

  export type AccountUpdateWithoutEntriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: AccountUpdateOneWithoutChildrenNestedInput
    children?: AccountUpdateManyWithoutParentNestedInput
  }

  export type AccountUncheckedUpdateWithoutEntriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: AccountUncheckedUpdateManyWithoutParentNestedInput
  }

  export type JournalVoucherUpsertWithoutEntriesInput = {
    update: XOR<JournalVoucherUpdateWithoutEntriesInput, JournalVoucherUncheckedUpdateWithoutEntriesInput>
    create: XOR<JournalVoucherCreateWithoutEntriesInput, JournalVoucherUncheckedCreateWithoutEntriesInput>
    where?: JournalVoucherWhereInput
  }

  export type JournalVoucherUpdateToOneWithWhereWithoutEntriesInput = {
    where?: JournalVoucherWhereInput
    data: XOR<JournalVoucherUpdateWithoutEntriesInput, JournalVoucherUncheckedUpdateWithoutEntriesInput>
  }

  export type JournalVoucherUpdateWithoutEntriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    reference?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoices?: SalesInvoiceUpdateManyWithoutJournalVoucherNestedInput
    purchaseInvoices?: PurchaseInvoiceUpdateManyWithoutJournalVoucherNestedInput
  }

  export type JournalVoucherUncheckedUpdateWithoutEntriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    reference?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoices?: SalesInvoiceUncheckedUpdateManyWithoutJournalVoucherNestedInput
    purchaseInvoices?: PurchaseInvoiceUncheckedUpdateManyWithoutJournalVoucherNestedInput
  }

  export type SalesInvoiceCreateManyCustomerInput = {
    id?: string
    invoiceNumber: string
    date: Date | string
    totalAmount: number
    taxAmount?: number
    discount?: number
    netAmount: number
    status: string
    journalVoucherId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SalesInvoiceUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    netAmount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: InvoiceItemUpdateManyWithoutInvoiceNestedInput
    journalVoucher?: JournalVoucherUpdateOneWithoutInvoicesNestedInput
  }

  export type SalesInvoiceUncheckedUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    netAmount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    journalVoucherId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: InvoiceItemUncheckedUpdateManyWithoutInvoiceNestedInput
  }

  export type SalesInvoiceUncheckedUpdateManyWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    netAmount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    journalVoucherId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PurchaseInvoiceCreateManySupplierInput = {
    id?: string
    invoiceNumber: string
    date: Date | string
    totalAmount: number
    taxAmount?: number
    discount?: number
    netAmount: number
    status: string
    journalVoucherId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PurchaseInvoiceUpdateWithoutSupplierInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    netAmount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: PurchaseItemUpdateManyWithoutInvoiceNestedInput
    journalVoucher?: JournalVoucherUpdateOneWithoutPurchaseInvoicesNestedInput
  }

  export type PurchaseInvoiceUncheckedUpdateWithoutSupplierInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    netAmount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    journalVoucherId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: PurchaseItemUncheckedUpdateManyWithoutInvoiceNestedInput
  }

  export type PurchaseInvoiceUncheckedUpdateManyWithoutSupplierInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    netAmount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    journalVoucherId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceItemCreateManyProductInput = {
    id?: string
    invoiceId: string
    quantity: number
    unitPrice: number
    total: number
  }

  export type PurchaseItemCreateManyProductInput = {
    id?: string
    invoiceId: string
    quantity: number
    unitPrice: number
    total: number
  }

  export type InventoryLogCreateManyProductInput = {
    id?: string
    date?: Date | string
    type: string
    quantity: number
    referenceId?: string | null
    description?: string | null
  }

  export type InvoiceItemUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    invoice?: SalesInvoiceUpdateOneRequiredWithoutItemsNestedInput
  }

  export type InvoiceItemUncheckedUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
  }

  export type InvoiceItemUncheckedUpdateManyWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
  }

  export type PurchaseItemUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    invoice?: PurchaseInvoiceUpdateOneRequiredWithoutItemsNestedInput
  }

  export type PurchaseItemUncheckedUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
  }

  export type PurchaseItemUncheckedUpdateManyWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
  }

  export type InventoryLogUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type InventoryLogUncheckedUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type InventoryLogUncheckedUpdateManyWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type InvoiceItemCreateManyInvoiceInput = {
    id?: string
    productId: string
    quantity: number
    unitPrice: number
    total: number
  }

  export type InvoiceItemUpdateWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    product?: ProductUpdateOneRequiredWithoutItemsNestedInput
  }

  export type InvoiceItemUncheckedUpdateWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
  }

  export type InvoiceItemUncheckedUpdateManyWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
  }

  export type PurchaseItemCreateManyInvoiceInput = {
    id?: string
    productId: string
    quantity: number
    unitPrice: number
    total: number
  }

  export type PurchaseItemUpdateWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    product?: ProductUpdateOneRequiredWithoutPurchaseItemsNestedInput
  }

  export type PurchaseItemUncheckedUpdateWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
  }

  export type PurchaseItemUncheckedUpdateManyWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
  }

  export type AccountCreateManyParentInput = {
    id?: string
    code: string
    name: string
    nameAr?: string | null
    type: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type JournalEntryCreateManyAccountInput = {
    id?: string
    date: Date | string
    description: string
    debit?: number
    credit?: number
    reference?: string | null
    journalVoucherId?: string | null
    createdAt?: Date | string
  }

  export type AccountUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: AccountUpdateManyWithoutParentNestedInput
    entries?: JournalEntryUpdateManyWithoutAccountNestedInput
  }

  export type AccountUncheckedUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: AccountUncheckedUpdateManyWithoutParentNestedInput
    entries?: JournalEntryUncheckedUpdateManyWithoutAccountNestedInput
  }

  export type AccountUncheckedUpdateManyWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JournalEntryUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    debit?: FloatFieldUpdateOperationsInput | number
    credit?: FloatFieldUpdateOperationsInput | number
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    journalVoucher?: JournalVoucherUpdateOneWithoutEntriesNestedInput
  }

  export type JournalEntryUncheckedUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    debit?: FloatFieldUpdateOperationsInput | number
    credit?: FloatFieldUpdateOperationsInput | number
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    journalVoucherId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JournalEntryUncheckedUpdateManyWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    debit?: FloatFieldUpdateOperationsInput | number
    credit?: FloatFieldUpdateOperationsInput | number
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    journalVoucherId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JournalEntryCreateManyJournalVoucherInput = {
    id?: string
    date: Date | string
    description: string
    accountId: string
    debit?: number
    credit?: number
    reference?: string | null
    createdAt?: Date | string
  }

  export type SalesInvoiceCreateManyJournalVoucherInput = {
    id?: string
    invoiceNumber: string
    date: Date | string
    customerId: string
    totalAmount: number
    taxAmount?: number
    discount?: number
    netAmount: number
    status: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PurchaseInvoiceCreateManyJournalVoucherInput = {
    id?: string
    invoiceNumber: string
    date: Date | string
    supplierId: string
    totalAmount: number
    taxAmount?: number
    discount?: number
    netAmount: number
    status: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type JournalEntryUpdateWithoutJournalVoucherInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    debit?: FloatFieldUpdateOperationsInput | number
    credit?: FloatFieldUpdateOperationsInput | number
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: AccountUpdateOneRequiredWithoutEntriesNestedInput
  }

  export type JournalEntryUncheckedUpdateWithoutJournalVoucherInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    debit?: FloatFieldUpdateOperationsInput | number
    credit?: FloatFieldUpdateOperationsInput | number
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JournalEntryUncheckedUpdateManyWithoutJournalVoucherInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    debit?: FloatFieldUpdateOperationsInput | number
    credit?: FloatFieldUpdateOperationsInput | number
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SalesInvoiceUpdateWithoutJournalVoucherInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    netAmount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUpdateOneRequiredWithoutInvoicesNestedInput
    items?: InvoiceItemUpdateManyWithoutInvoiceNestedInput
  }

  export type SalesInvoiceUncheckedUpdateWithoutJournalVoucherInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    customerId?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    netAmount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: InvoiceItemUncheckedUpdateManyWithoutInvoiceNestedInput
  }

  export type SalesInvoiceUncheckedUpdateManyWithoutJournalVoucherInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    customerId?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    netAmount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PurchaseInvoiceUpdateWithoutJournalVoucherInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    netAmount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    supplier?: SupplierUpdateOneRequiredWithoutInvoicesNestedInput
    items?: PurchaseItemUpdateManyWithoutInvoiceNestedInput
  }

  export type PurchaseInvoiceUncheckedUpdateWithoutJournalVoucherInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    supplierId?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    netAmount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: PurchaseItemUncheckedUpdateManyWithoutInvoiceNestedInput
  }

  export type PurchaseInvoiceUncheckedUpdateManyWithoutJournalVoucherInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    supplierId?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    netAmount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}