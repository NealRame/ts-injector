import {
    Token,
} from "./token"

/**
 * Thrown when requested alias or value was not found.
 */
export class AliasOrValueUndefined extends Error {
    public name = "ServiceAliasOrValueUndefined"

    /**
     * @param token a token service identifier.
     */
    constructor(
        private _token: Token | symbol,
    ) { super() }

    /**
     * @returns the error message.
     */
    get message(): string {
        return `Service alias or value "${this._token.toString()}" is undefined.`
            + " Register it before usage by calling 'Container#alias'or 'Container#set' method."
    }
}

/**
 * Thrown when requested service was not found.
 */
export class ServiceNotFoundError extends Error {
    public name = "ServiceNotFoundError"

    /**
     * @param serviceName a service name.
     */
    constructor(
        private _serviceName: string,
    ) { super() }

    /**
     * @returns the error message.
     */
    get message(): string {
        return `Service "${this._serviceName}" was not found.`
            + " Register it before usage using '@Container.service()' decorator."
    }
}
