/* eslint-disable @typescript-eslint/no-explicit-any */

import "reflect-metadata"

import {
    ServiceIdentifier,
    ServiceMetadata,
    TConstructor,
} from "./types"

import {
    getOrCreateServiceMetadata,
    getServiceMetadata,
} from "./utils"

export function Service(metadata?: Partial<Omit<ServiceMetadata, "parameters">>)
    : ClassDecorator {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return (target: Function) => {
        Object.assign(
            getOrCreateServiceMetadata(target as TConstructor),
            metadata,
        )
    }
}

export function Inject(service: ServiceIdentifier) {
    return (
        target: any,
        propertyKey: string | symbol,
        parameterIndex?: number,
    ) => {
        if (typeof parameterIndex === "number") {
            const { parameters } = getOrCreateServiceMetadata(target as TConstructor)
            parameters.set(parameterIndex, {
                ...parameters.get(parameterIndex),
                service,
            })
        } else {
            target = target.constructor
            const { properties } = getOrCreateServiceMetadata(target as TConstructor)
            properties.set(propertyKey as string, service)
        }
    }
}

export function Default(fallback: boolean | number | string | symbol)
    : ParameterDecorator {
    return (target: any, _: any, parameterIndex: number) => {
        const { parameters } = getOrCreateServiceMetadata(target)
        parameters.set(parameterIndex, {
            ...parameters.get(parameterIndex),
            fallback,
        })
        getServiceMetadata(target).parameters = parameters
    }
}
