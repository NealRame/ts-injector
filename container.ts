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
    private aliases_ = new WeakMap<Token, TConstructor>()
    private values_ = new WeakMap<Token, unknown>()
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

    private injectAliasedService_<T>(service: Token<T>)
        : T {
        const classService = this.aliases_.get(service)
        if (isNil(classService)) {
            throw new ContainerInternalError()
        }
        return this.injectClassService_(classService as TConstructor<T>)
    }

    has(id: ServiceIdentifier)
        : boolean {
        if (Token.isToken(id)) {
            return this.values_.has(id) || this.aliases_.has(id)
        }
        return isService(id)
    }

    get<T>(id: ServiceIdentifier<T>, fallback?: T)
        : T {
        if (Token.isToken(id)) {
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
        return this.injectClassService_(id, fallback)
    }

    set<T>(token: Token<T>, value: T | TConstructor<T>)
        : this {
        if (typeof value === "function" && isService(value)) {
            this.aliases_.set(token, value as TConstructor<T>)
        } else {
            this.values_.set(token, value)
        }
        return this
    }
}
