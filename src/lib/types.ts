/* eslint-disable @typescript-eslint/no-explicit-any */
import { Token } from "./token"

export interface TConstructor<T = any> {
    new(...args: Array<any>): T
}

export type ServiceIdentifier<T = any> = TConstructor<T> | Token<T> | symbol

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
    properties: Map<string, ServiceIdentifier>,
}
