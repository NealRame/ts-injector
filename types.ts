import { Token } from "./token"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface TConstructor<T = any> {
    new(...args: Array<never>): T
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ServiceIdentifier<T = any> = TConstructor<T> | Token<T>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ServiceParameterMetadata<T = any> = {
    service?: ServiceIdentifier<T>,
    fallback?: T,
}

export enum ServiceLifecycle {
    Singleton,
    Transient,
}

export interface ServiceMetadata {
    lifecycle: ServiceLifecycle,
    factoryClass?: TConstructor,
    factoryFunction?: CallableFunction,
    parameters: Map<number, ServiceParameterMetadata>,
}
