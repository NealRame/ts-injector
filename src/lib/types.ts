/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
    ServiceLifecycle,
} from "./constants"

import type {
    Token,
} from "./token"

/**
 * Constructor type.
 */
export type TConstructor<T = any> = new(...args: Array<any>) => T

/**
 * Service identifier.
 * It can be a class, a function or a symbol.
 */
export type TServiceIdentifier<T = any> = TConstructor<T> | Token<T> | symbol

/**
 * Service option.
 */
export type TServiceOption<T = unknown> = {
    /**
     * Service factory class.
     */
    factoryClass?: TConstructor
    /**
     * Service factory function.
     */
    factoryFunction?: CallableFunction
    /**
     * Service lifecycle.
     * @default ServiceLifecycle.Transient
     */
    lifecycle?: ServiceLifecycle
    /**
     * 
     */
    alias?: Token<T>
}
