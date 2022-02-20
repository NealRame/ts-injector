/* eslint-disable @typescript-eslint/no-explicit-any */

import "reflect-metadata"

import {
    ServiceMetadataKey,
} from "./constants"

import {
    ServiceIdentifier,
    ServiceLifecycle,
    ServiceMetadata,
    TConstructor,
} from "./types"

import {
    getServiceMetadata,
    isService,
} from "./utils"

function getServiceOrCreate(service: TConstructor)
    : ServiceMetadata {
    if (!isService(service)) {
        Reflect.defineMetadata(
            ServiceMetadataKey,
            {
                lifecycle: ServiceLifecycle.Transient,
                parameters: new Map(),
            },
            service
        )
    }
    const metadata = getServiceMetadata(service)
    return metadata
}

export function Service(metadata?: Partial<Omit<ServiceMetadata, "parameters">>)
    : ClassDecorator {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return (target: Function) => {
        Object.assign(
            getServiceOrCreate(target as TConstructor),
            metadata,
        )
    }
}

export function Inject(service: ServiceIdentifier)
    : ParameterDecorator {
    return (target: any, _: any, parameterIndex: number) => {
        const { parameters } = getServiceOrCreate(target)
        parameters.set(parameterIndex, {
            ...parameters.get(parameterIndex),
            service,
        })
    }
}

export function Default(fallback: boolean | number | string | symbol)
    : ParameterDecorator {
    return (target: any, _: any, parameterIndex: number) => {
        const { parameters } = getServiceOrCreate(target)
        parameters.set(parameterIndex, {
            ...parameters.get(parameterIndex),
            fallback,
        })
        getServiceMetadata(target).parameters = parameters
    }
}
