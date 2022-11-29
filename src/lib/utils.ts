import "reflect-metadata"

import {
    ServiceMetadataKey,
} from "./constants"

import {
    ServiceMetadata,
    ServiceLifecycle,
    TConstructor,
} from "./types"

import { ServiceNotFoundError } from "./errors"

// eslint-disable-next-line @typescript-eslint/ban-types
export function isService(item: Function)
    : boolean {
    return Reflect.hasMetadata(ServiceMetadataKey, item)
}

export function getServiceParametersMetadata(service: TConstructor)
    : Array<unknown> {
    return Reflect.getMetadata("design:paramtypes", service) ?? []
}

export function getServiceMetadata(service: TConstructor)
    : ServiceMetadata {
    if (isService(service)) {
        return Reflect.getMetadata(ServiceMetadataKey, service)
    }
    throw new ServiceNotFoundError(service)
}

export function getOrCreateServiceMetadata(service: TConstructor)
    : ServiceMetadata {
    if (!isService(service)) {
        Reflect.defineMetadata(
            ServiceMetadataKey,
            {
                lifecycle: ServiceLifecycle.Transient,
                parameters: new Map(),
                properties: new Map(),
            },
            service
        )
    }
    return getServiceMetadata(service)
}
