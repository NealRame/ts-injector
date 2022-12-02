import { expect } from "chai"

import { Service } from "../../../lib/decorators"
import {
    ServiceLifecycle,
} from "../../../lib/types"
import {
    getServiceMetadata,
} from "../../../lib/utils"

describe("@Service", () => {
    it("is a decorator factory", () => {
        expect(Service).to.be.a("function")
        expect(Service()).to.be.a("function")
    })
    it("adds metadata to the decorated class", () => {
        @Service()
        class ServiceClass {}
        const metadata = getServiceMetadata(ServiceClass)
        expect(metadata).to.be.an("object")
        expect(metadata).to.have.property("lifecycle")
        expect(metadata).to.have.property("parameters")
    })
    it("set lifecycle to be Transient by default", () => {
        @Service()
        class ServiceClass {}
        const metadata = getServiceMetadata(ServiceClass)
        expect(metadata.lifecycle).to.equal(ServiceLifecycle.Transient)
    })
    it("set lifecycle as expected", () => {
        // Set lifecycle to be Transient
        @Service({
            lifecycle: ServiceLifecycle.Transient,
        })
        class ServiceClass1 {}
        expect(getServiceMetadata(ServiceClass1).lifecycle).to.equal(ServiceLifecycle.Transient)
        // Set lifecycle to be Singleton
        @Service({
            lifecycle: ServiceLifecycle.Singleton,
        })
        class ServiceClass2 {}
        expect(getServiceMetadata(ServiceClass2).lifecycle).to.equal(ServiceLifecycle.Singleton)
    })
    it("set factoryFunction as expected", () => {
        const factoryFunction = () => new ServiceClass
        @Service({
            factoryFunction,
        })
        class ServiceClass {}
        const metadata = getServiceMetadata(ServiceClass)
        expect(metadata.factoryFunction).to.equal(factoryFunction)
    })
    it("set factoryClass as expected", () => {
        @Service()
        class FactoryClass {
            create() {
                return new ServiceClass
            }
        }
        @Service({
            factoryClass: FactoryClass,
        })
        class ServiceClass {}
        const metadata = getServiceMetadata(ServiceClass)
        expect(metadata.factoryClass).to.equal(FactoryClass)
    })
})
