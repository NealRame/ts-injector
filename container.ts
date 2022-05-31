import "reflect-metadata"

import { isNil } from "lodash"

import {
    ContainerInternalError,
    ServiceAliasOrValueUndefined,
    ServiceNotFoundError,
} from "./errors"

import {
    Token,
} from "./token"

import {
    TConstructor,
    ServiceIdentifier,
    ServiceLifecycle,
    ServiceParameterMetadata,
    ServiceMetadata,
} from "./types"

import {
    getServiceMetadata,
    getServiceParametersMetadata,
    isService,
} from "./utils"

export class Container {
    private aliases_ = new Map<symbol, TConstructor>()

    private values_ = new Map<symbol, unknown>()
    private singletons_ = new WeakMap<TConstructor, unknown>()

    private injectServiceParameters_(service: TConstructor) {
        const parametersMeta = getServiceParametersMetadata(service)
        const { parameters: serviceParametersMeta } = getServiceMetadata(service)

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return parametersMeta.map((type: any, index: number) => {
            if (serviceParametersMeta.has(index)) {
                const parameterMeta = serviceParametersMeta.get(index) as ServiceParameterMetadata
                if (!isNil(parameterMeta.service)) {
                    return this.get(parameterMeta.service, parameterMeta.fallback)
                }
            }
            return type()
        })
    }

    private injectTransient_(service: TConstructor, serviceMetadata: ServiceMetadata) {
        if (!isNil(serviceMetadata.factoryFunction)) {
            return serviceMetadata.factoryFunction(this)
        }

        if (!isNil(serviceMetadata.factoryClass)) {
            const factory = this.has(serviceMetadata.factoryClass)
                ? this.get(serviceMetadata.factoryClass)
                // eslint-disable-next-line new-cap
                : new serviceMetadata.factoryClass()
            return factory.create(this)
        }

        const params = this.injectServiceParameters_(service)
        return Reflect.construct(service, params)
    }

    private injectSingleton_(service: TConstructor, serviceMetadata: ServiceMetadata) {
        if (!this.singletons_.has(service)) {
            this.singletons_.set(
                service,
                this.injectTransient_(service, serviceMetadata),
            )
        }
        return this.singletons_.get(service)
    }

    private injectClassService_<T>(service: TConstructor<T>, fallback?: T)
        : T {
        if (isService(service)) {
            const metadata = getServiceMetadata(service)
            return (metadata.lifecycle === ServiceLifecycle.Singleton
                ? this.injectSingleton_(service, metadata)
                : this.injectTransient_(service, metadata)
            ) as T
        } else if (!isNil(fallback)) {
            return fallback
        }
        throw new ServiceNotFoundError(service)
    }

    private injectAliasedService_<T = unknown>(service: Token<T> | symbol)
        : T {
        const classService = this.aliases_.get(service as symbol)
        if (isNil(classService)) {
            throw new ContainerInternalError()
        }
        return this.injectClassService_(classService as TConstructor<T>)
    }

    has(id: ServiceIdentifier)
        : boolean {
        if (typeof id === "symbol") {
            return this.values_.has(id) || this.aliases_.has(id)
        }
        // eslint-disable-next-line @typescript-eslint/ban-types
        return isService(id as TConstructor)
    }

    remove(token: Token | symbol)
        : this {
        this.values_.delete(token as symbol)
        this.aliases_.delete(token as symbol)
        return this
    }

    get<T = unknown>(id: ServiceIdentifier<T>, fallback?: T)
        : T {
        if (typeof id === "symbol") {
            if (this.values_.has(id)) {
                return this.values_.get(id) as T
            }
            if (this.aliases_.has(id)) {
                return this.injectAliasedService_(id)
            }
            if (!isNil(fallback)) {
                return fallback
            }
            throw new ServiceAliasOrValueUndefined(id)
        }
        return this.injectClassService_(id as TConstructor<T>, fallback)
    }

    set<T = unknown>(token: Token<T> | symbol, value: T | TConstructor<T>)
        : this {
        if (typeof value === "function" && isService(value)) {
            this.aliases_.set(token as symbol, value as TConstructor<T>)
        } else {
            this.values_.set(token as symbol, value)
        }
        return this
    }
}
