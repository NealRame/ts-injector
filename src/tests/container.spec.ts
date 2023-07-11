import {
    expect,
} from "chai"

import {
    Container,
    ServiceLifecycle,
    Token,
} from "../lib"

describe("Container", () => {
    describe("#service", () => {
        it("is a method", () => {
            const container = new Container()
            expect(container)
                .to.have.property("service")
                .which.is.a("function")
        })
    })
    describe("#inject", () => {
        it("is a method", () => {
            const container = new Container()
            expect(container)
                .to.have.property("inject")
                .which.is.a("function")
        })
    })
    describe("#alias", () => {
        it("is a method", () => {
            const container = new Container()
            expect(container)
                .to.have.property("alias")
                .which.is.a("function")
        })
    })
    describe("#set", () => {
        it("is a method", () => {
            const container = new Container()
            expect(container)
                .to.have.property("set")
                .which.is.a("function")
        })
    })
    describe("#get", () => {
        it("is a method", () => {
            const container = new Container()
            expect(container)
                .to.have.property("get")
                .which.is.a("function")
        })
    })

    it("registers/instanciates singleton service", () => {
        const container = new Container()
        @container.service({
            lifecycle: ServiceLifecycle.Singleton,
        })
        class ServiceClass {}
        expect(container.has(ServiceClass)).to.be.true
        const instance1 = container.get(ServiceClass)
        const instance2 = container.get(ServiceClass)
        expect(instance1).to.be.instanceOf(ServiceClass)
        expect(instance2).to.be.instanceOf(ServiceClass)
        expect(instance1).to.equal(instance2)
    })

    it("register/instanciates transient service", () => {
        const container = new Container()
        @container.service({
            lifecycle: ServiceLifecycle.Transient,
        })
        class ServiceClass {}
        expect(container.has(ServiceClass)).to.be.true
        const instance1 = container.get(ServiceClass)
        const instance2 = container.get(ServiceClass)
        expect(instance1).to.be.instanceOf(ServiceClass)
        expect(instance2).to.be.instanceOf(ServiceClass)
        expect(instance1).to.not.equal(instance2)
    })

    it("registers services as transient by default", () => {
        const container = new Container()
        @container.service()
        class ServiceClass {}
        expect(container.has(ServiceClass)).to.be.true
        const instance1 = container.get(ServiceClass)
        const instance2 = container.get(ServiceClass)
        expect(instance1).to.be.instanceOf(ServiceClass)
        expect(instance2).to.be.instanceOf(ServiceClass)
        expect(instance1).to.not.equal(instance2)
    })

    it("alias service with a Token", () => {
        const container = new Container()

        interface ServiceInterface {
            m(): void
        }

        @container.service()
        class ServiceClass implements ServiceInterface {
            m() {
                // do nothing
            }
        }

        const serviceId1: Token<ServiceInterface> = Symbol("ServiceInterface")
        const serviceId2: Token<ServiceClass> = Symbol("ServiceClass")

        container.alias(serviceId1, ServiceClass)
        container.alias(serviceId2, ServiceClass)

        expect(container.get(serviceId1)).to.be.instanceOf(ServiceClass)
        expect(container.get(serviceId2)).to.be.instanceOf(ServiceClass)
    })

    it("assign value to a Token", () => {
        const container = new Container()

        const value1Id: Token<number> = Symbol("number")
        const value2Id: Token<string> = Symbol("string")

        container.set(value1Id, 42)
        container.set(value2Id, "Hello World!")

        expect(container.get(value1Id)).to.equal(42)
        expect(container.get(value2Id)).to.equal("Hello World!")
    })

    it("injects service", () => {
        const container = new Container()

        @container.service()
        class Service1 {
        }

        @container.service()
        class Service2 {
            @container.inject(Service1)
            private _service1: Service1
        }

        const consumer = container.get(Service2)
        expect(consumer).to.be.instanceOf(Service2)
        expect(consumer)
            .to.have.property("_service1")
            .which.is.instanceOf(Service1 )
    })

    it("injects service with a Token", () => {
        const container = new Container()
        const serviceId1: Token<Service1> = Symbol("Service1")

        @container.service({
            alias: serviceId1,
        })
        class Service1{}

        @container.service()
        class Service2 {
            @container.inject(serviceId1)
            private _service: Service1
        }

        const consumer = container.get(Service2)
        expect(consumer).to.be.instanceOf(Service2)
        expect(consumer)
            .to.have.property("_service")
            .which.is.instanceOf(Service1)
    })

    it("injects value with a Token", () => {
        const container = new Container()
        const valueId: Token<number> = Symbol("value")

        container.set(valueId, 42)

        @container.service()
        class Service1 {
            @container.inject(valueId)
            private _value: number
        }

        const consumer = container.get(Service1)
        expect(consumer).to.be.instanceOf(Service1)
        expect(consumer)
            .to.have.property("_value")
            .which.equals(42)
    })
})
