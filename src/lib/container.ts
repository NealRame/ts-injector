import {
    ServiceLifecycle,
} from "./constants"

import {
    AliasOrValueUndefined,
    ServiceInvalidTargetKindError,
    ServiceNotFoundError,
} from "./errors"

import type {
    Token,
} from "./token"

import type {
    TConstructor,
    TServiceIdentifier,
    TServiceOption,
} from "./types"

type TServiceMetadata = {
    factoryClass?: TConstructor
    factoryFunction?: CallableFunction
    lifecycle: ServiceLifecycle
    service?: TConstructor
}

export class Container {
    private _aliases = new Map<symbol, TConstructor>()
    private _values = new Map<symbol | TConstructor, unknown>()
    private _services = new Map<TConstructor, TServiceMetadata>()

    private _injectSingleton<T>(
        service: TConstructor<T>,
        metadata: TServiceMetadata,
    ): T {
        if (!this._values.has(service)) {
            this._values.set(
                service,
                this._injectTransient(service, metadata),
            )
        }
        return this._values.get(service) as T
    }

    private _injectTransient<T>(
        service: TConstructor<T>,
        metadata: TServiceMetadata,
    ): T {
        if (metadata.factoryFunction != null) {
            return metadata.factoryFunction(this)
        }

        if (metadata.factoryClass != null) {
            const factory = this.has(metadata.factoryClass)
                ? this.get(metadata.factoryClass)
                : new metadata.factoryClass()
            return factory.create(this)
        }

        return Reflect.construct(service, [])
    }

    private _injectClassService<T>(
        service: TConstructor<T>,
        metadata: TServiceMetadata,
    ): T {
        return metadata.lifecycle === ServiceLifecycle.Singleton
            ? this._injectSingleton(service, metadata)
            : this._injectTransient(service, metadata)
    }

    private _getOrCreateServiceMetadata(
        service: TConstructor,
    ): TServiceMetadata {
        const metadata = this._services.get(service)

        if (metadata != null
            && (metadata as TServiceMetadata).service === service) {
            return metadata
        }

        return this._services
            .set(service, {
                lifecycle: ServiceLifecycle.Transient,
                service,
            })
            .get(service) as TServiceMetadata
    }

    /**
     * Register a service with the container.
     * @param option @see {@link TServiceOption} for more information.
     * @returns a class decorator.
     *
     * @example
     * Register a service with the container.
     * ```ts
     * const container = new Container()
     * @container.service()
     * class Foo {}
     * ```
     * @example
     * Register a service with the container as a singleton.
     * ```ts
     * const container = new Container()
     * @container.service({
     *    lifecycle: ServiceLifecycle.Singleton,
     * })
     * class Foo {}
     * ```
     */
    public service = <T>(
        option?: TServiceOption<T>,
    ) => {
        return (
            target: TConstructor<T>,
            context: ClassDecoratorContext<TConstructor<T>>,
        ) => {
            if (context.kind != "class") {
                throw new ServiceInvalidTargetKindError()
            }

            Object.assign(
                this._getOrCreateServiceMetadata(target),
                option ?? {},
            )

            if (option?.alias != null) {
                this._aliases.set(option.alias as symbol, target)
            }

            return target
        }
    }

    /**
     * Register a field to be injected with a service.
     * @param service Service identifier.
     * @param fallback Fallback value if the service is not found.
     * @returns a class field decorator.
     * @example
     * ```ts
     * const container = new Container()
     * @container.service()
     * class ServiceA {}
     *
     * @container.service()
     * class ServiceB {
     *    @container.inject(ServiceA)
     *    private _serviceA!: ServiceA
     * }
     * ```
     */
    public inject = <U>(
        service: TServiceIdentifier<U>,
        fallback?: U,
    ) => {
        return <T extends object>(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            target: undefined,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            context: ClassFieldDecoratorContext<T, U>,
        ) => () => this.get(service, fallback)
    }

    /**
     * Check if the containers knows about the given alias or service.
     * @param {TServiceIdentifier} id a Token or a Class.
     * @returns true if the container knows about the given alias or service.
     */
    public has(
        id: TServiceIdentifier,
    ): boolean {
        return typeof id === "symbol"
            ? this._aliases.has(id) || this._values.has(id)
            : this._services.has(id as TConstructor)
    }

    /**
     * Get a value from the container.
     * @param id a service identifier.
     * @param fallback a fallback value.
     * @throws {AliasOrValueUndefined}
     * @throws {ServiceNotFoundError}
     */
    public get<T = unknown>(
        id: TServiceIdentifier<T>,
        fallback?: T,
    ): T {
        if (typeof id === "symbol") {
            if (this._aliases.has(id)) {
                return this.get(this._aliases.get(id) as TServiceIdentifier<T>)
            }
            if (this._values.has(id)) {
                return this._values.get(id) as T
            }
            if (fallback != null) {
                return fallback
            }
            throw new AliasOrValueUndefined(id)
        }
        if (this._services.has(id as TConstructor)) {
            return this._injectClassService(
                id as TConstructor<T>,
                this._services.get(id as TConstructor<T>) as TServiceMetadata,
            )
        }
        if (id === Container) {
            return this as unknown as T
        }
        if (fallback != null) {
            return fallback
        }
        throw new ServiceNotFoundError((id as TConstructor<T>).name)
    }

    /**
     * Register an alias for a service with the container.
     * @param token
     * @param service the service to alias with the token.
     * @returns this container.
     */
    public alias<T = unknown>(
        token: Token<T>,
        service: TConstructor<T>,
    ): this {
        this._aliases.set(token as symbol, service)
        return this
    }

    /**
     * Register a value with the container.
     * @param token
     * @param value the value to assign to the token.
     * @returns this container.
     */
    public set<T = unknown>(
        token: Token<T>,
        value: T,
    ): this {
        this._values.set(token as symbol, value)
        return this
    }

    /**
     * Remove a service alias or a value from the container.
     * @param token
     * @returns this container.
     */
    public remove(
        token: Token,
    ): this {
        this._aliases.delete(token as symbol)
        this._values.delete(token as symbol)
        return this
    }
}
