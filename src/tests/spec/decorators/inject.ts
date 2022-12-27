import { expect } from "chai"

import {
    getServiceMetadata,
    Inject,
    Service,
    Token,
} from "../../../lib"

describe("@Inject", () => {
    it("is a decorator factory", () => {
        expect(Service).to.be.a("function")
        expect(Service()).to.be.a("function")
    })
    it("adds metadata to the decorated class", () => {
        @Service()
        class Service1Class {}
        const Service1: Token<Service1Class> = Symbol("Service1ClassAlias") 
        class Service2Class {
            constructor(
                @Inject(Service1) public service1: Service1Class,
            ) {}
        }
        const metadata = getServiceMetadata(Service2Class)
        expect(metadata).to.have.property("parameters")
        expect(metadata.parameters.get(0)).to.deep.equal({
            service: Service1,
        })
    })
})
