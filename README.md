# ts-injector
A simple Dependency Injection library for Typescript

## API

### Container
Container is the main class of the library.

#### Container#get
Get a _value_ or _service_ instance from the container.

##### Synopsys
```ts
get<T = unknown>(id: ServiceIdentifier<T> | symbol, fallback?: T): T
```

##### Parameters
* `id`: `ServiceIdentifier<T>`
<br>A service identifier (see [ServiceIdentifier](#ServiceIdentifier) for more
details).

* `fallback: T`
<br>Value returned if no service is registered with the given `id`. If no
_fallback value_ is passed and there is no registered _value_ found then a
`ServiceAliasOrValueUndefined` is thrown.

##### Example
```ts
const container = new Container()
const landId: Token<Land> = Symbol("land")
...
const land = container.get(landId)
```

#### Container#set
Register a _value_ or a _service_ in the container. If could be used to
register a _service_ directly to the container without declaring it with the
[`@Service`](#Service) decorator.

##### Synopsis
```ts
set<T = unknown>(token: Token<T> | symbol, value: T | TConstructor<T>)
```

##### Parameters
* `token`: `Token<T> | symbol`
<br>A typed token or a symbol to identify the requested service or value. If
you pass a `symbol` the return value type will be `unknown`.

* `value: T | TConstructor<T>`
<br>The _value_ of _service_ to register.

##### Example
```ts
const container = new Container()
const landId: Token<Land> = Symbol("land")

container.set(landId, new Land())
```

#### Container#has
A predicate to check if a given _id_ is associated to a _value_ or a _service_
into the container.

##### Synopsis
```ts
has(id: ServiceIdentifier): boolean
```
##### Parameters
* `id`: `ServiceIdentifier<T>`
<br>A service identifier (see [ServiceIdentifier](#ServiceIdentifier) for more
details).

##### Example
```ts
const container = new Container()
const landId: Token<Land> = Symbol("land")
...
if (!container.has(landId)) {
    container.set(landId, new Land())
}
```

#### Container#remove

##### Synopsis
```ts
remove(token: Token | symbol): this
```
##### Parameters
* `token: Token | symbol`
<br>The identifier to remove from the container.

##### Example
```ts
const container = new Container()
const landId: Token<Land> = Symbol("land")
...
if (container.has(landId)) {
    container.remove(landId)
}
```

### Token
A _Token_ is a typed symbol used to register a _value_ or a _service_ into a
container.


### ServiceIdentifier


### Decorators


#### Service


#### Inject


#### Default
