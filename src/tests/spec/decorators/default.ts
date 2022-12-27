import { expect } from "chai"

import {
    getServiceMetadata,
    Default,
    Service,
} from "../../../lib"

describe("@Default", () => {
    it("is a decorator factory", () => {
        expect(Service).to.be.a("function")
        expect(Service()).to.be.a("function")
    })
    it("adds metadata to the decorated class", () => {
        class ServiceClass {
            constructor(
                @Default("test") public value: string,
            ) {}
        }
        const metadata = getServiceMetadata(ServiceClass)
        expect(metadata).to.have.property("parameters")
        expect(metadata.parameters.get(0)).to.deep.equal({
            fallback: "test",
        })
    })
})
