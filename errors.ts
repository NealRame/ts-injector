import {
    Token,
} from "./token"

import {
    TConstructor,
} from "./types"

/**
 * Thrown when an incoherent event happened.
 */
export class ContainerInternalError extends Error {
    public name = "ContainerInternalError"
    get message()
        : string {
        return "Container internal error"
    }
}

/**
 * Thrown when requested service was not found.
 */
export class ServiceNotFoundError extends Error {
    public name = "ServiceNotFoundError"

    constructor(
        private service_: TConstructor,
    ) { super() }

    get message()
        : string {
        return (
            `Service "${this.service_.name}" was not found.`
            + " Register it before usage using the '@Service()' decorator."
        )
    }
}

/**
 * Thrown when requested alias was not found.
 */
export class ServiceAliasOrValueUndefined extends Error {
    public name = "ServiceAliasOrValueUndefined"

    constructor(
        private token_: Token,
    ) { super() }

    get message()
        : string {
        return (
            `Service alias or value "${this.token_.name}" is undefined.`
            + " Register it before usage by calling 'Container#set' method."
        )
    }
}
