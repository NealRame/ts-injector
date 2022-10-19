import { expect } from "chai"

import { Container } from "../lib/container"

describe("Container", () => {
    it("has a has method", () => {
        const container = new Container()
        expect(container.has).to.be.a("function")
    })
    it("has a get method", () => {
        const container = new Container()
        expect(container.get).to.be.a("function")
    })
    it("has a set method", () => {
        const container = new Container()
        expect(container.set).to.be.a("function")
    })
    it("has a remove method", () => {
        const container = new Container()
        expect(container.remove).to.be.a("function")
    })
})
