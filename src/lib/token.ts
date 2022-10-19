/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Token is a typed version of Symbol.
 * Tokens are used to alias registered service or set value into a container.
 */
export interface Token<T = unknown> extends Symbol {}
