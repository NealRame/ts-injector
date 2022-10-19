import { expect } from "chai"

import { Service } from "../lib/decorators"

describe("@Service", () => {
    it("return a decorator", () => {
        expect(Service()).to.be.a("function")
    })
})
