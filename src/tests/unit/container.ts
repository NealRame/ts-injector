import { expect } from "chai"



import { Container } from "../../lib/container"
import { Service } from "../../lib/decorators"
import {
    ServiceNotFoundError,
    ServiceAliasOrValueUndefined
} from "../../lib/errors"
import {
    Token,
} from "../../lib/token"
import {
    ServiceLifecycle,
} from "../../lib/types"


describe("Container", () => {
    it("has a set method", () => {
        const container = new Container()
        expect(container.set).to.be.a("function")
    })
    it("has a remove method", () => {
        const container = new Container()
        expect(container.remove).to.be.a("function")
    })

    describe("#get", () => {
        it("is a method", () => {
            const container = new Container()
            expect(container.get).to.be.a("function")
        })

        it("returns an instance of a service", () => {
            class ServiceClass {}

            const container = new Container()
            const symbolAlias = Symbol("symbolAlias")
            const tokenAlias: Token<ServiceClass> = Symbol("tokenAlias")

            Service()(ServiceClass)

            container.set(symbolAlias, ServiceClass)
            container.set(tokenAlias, ServiceClass)

            expect(container.get(ServiceClass)).to.be.instanceOf(ServiceClass)
            expect(container.get(symbolAlias)).to.be.instanceOf(ServiceClass)
            expect(container.get(tokenAlias)).to.be.instanceOf(ServiceClass)
        })
        it("returns itself if Container is requested", () => {
            const container = new Container()
            expect(container.get(Container)).to.equal(container)
        })
        it("returns a value aliased", () => {
            const container = new Container()
            const alias1 = Symbol("symbolAlias")
            const value1 = 1

            const alias2: Token<number> = Symbol("tokenAlias")
            const value2 = 2

            container.set(alias1, value1)
            expect(container.get(alias1)).to.equal(value1)

            container.set(alias2, value2)
            expect(container.get(alias2)).to.equal(value2)
        })
        it("returns the fallback value if the service is not found", () => {
            class NotAServiceClass {}

            const container = new Container()
            const symbolAlias = Symbol("symbolAlias")
            const tokenAlias: Token<NotAServiceClass> = Symbol("tokenAlias")

            const fallback = new NotAServiceClass()

            expect(container.get(NotAServiceClass, fallback)).to.equal(fallback)
            expect(container.get(symbolAlias, fallback)).to.equal(fallback)
            expect(container.get(tokenAlias, fallback)).to.equal(fallback)
        })
        it("respect singleton constraint", () => {
            class ServiceClass {}

            const container = new Container()
            const symbolAlias = Symbol("symbolAlias")
            const tokenAlias: Token<ServiceClass> = Symbol("tokenAlias")

            Service({
                lifecycle: ServiceLifecycle.Singleton
            })(ServiceClass)

            container.set(symbolAlias, ServiceClass)
            container.set(tokenAlias, ServiceClass)

            const instance = container.get(ServiceClass)

            expect(container.get(ServiceClass)).to.equal(instance)
            expect(container.get(symbolAlias)).to.equal(instance)
            expect(container.get(tokenAlias)).to.equal(instance)
        })
        it("respect singleton constraint", () => {
            class ServiceClass {}

            const container = new Container()
            const symbolAlias = Symbol("symbolAlias")
            const tokenAlias: Token<ServiceClass> = Symbol("tokenAlias")

            Service({})(ServiceClass)

            container.set(symbolAlias, ServiceClass)
            container.set(tokenAlias, ServiceClass)

            const instance1 = container.get(ServiceClass)
            const instance2 = container.get(symbolAlias)
            const instance3 = container.get(tokenAlias)

            expect(instance1).to.not.equal(instance2)
            expect(instance1).to.not.equal(instance3)
            expect(instance2).to.not.equal(instance3)
        })

        it("throws a ServiceNotFoundError if the service is not found and no fallback is provided", () => {
            class NotAServiceClass {}
            const container = new Container()

            expect(() => container.get(NotAServiceClass)).to.throw(ServiceNotFoundError)
        })
        it("throws a ServiceAliasOrValueUndefined if the service or value is not found and no fallback is provided", () => {
            class NotAServiceClass {}

            const container = new Container()
            const symbolAlias = Symbol("symbolAlias")
            const tokenAlias: Token<NotAServiceClass> = Symbol("tokenAlias")

            expect(() => container.get(symbolAlias)).to.throw(ServiceAliasOrValueUndefined)
            expect(() => container.get(tokenAlias)).to.throw(ServiceAliasOrValueUndefined)
        })
    })

    describe("#has", () => {
        it("is a method", () => {
            const container = new Container()
            expect(container.has).to.be.a("function")
        })

        it("returns true if the service is registered", () => {
            class ServiceClass {}

            const container = new Container()
            const symbolAlias = Symbol("symbolAlias")
            const tokenAlias: Token<ServiceClass> = Symbol("tokenAlias")

            Service()(ServiceClass)

            container.set(symbolAlias, ServiceClass)
            container.set(tokenAlias, ServiceClass)

            expect(container.has(ServiceClass)).to.be.true
            expect(container.has(symbolAlias)).to.be.true
            expect(container.has(tokenAlias)).to.be.true
        })

        it("returns false if the value is not registered", () => {
            class NotServiceClass {}

            const container = new Container()
            const symbolAlias = Symbol("symbolAlias")
            const tokenAlias: Token<NotServiceClass> = Symbol("tokenAlias")

            expect(container.has(NotServiceClass)).to.be.false
            expect(container.has(symbolAlias)).to.be.false
            expect(container.has(tokenAlias)).to.be.false
        })
    })

    describe("#set", () => {
        it("is a method", () => {
            const container = new Container()
            expect(container.set).to.be.a("function")
        })

        it("alias a service", () => {
            class ServiceClass {}

            const container = new Container()
            const symbolAlias = Symbol("symbolAlias")
            const tokenAlias: Token<ServiceClass> = Symbol("tokenAlias")

            Service()(ServiceClass)

            container.set(symbolAlias, ServiceClass)
            container.set(tokenAlias, ServiceClass)

            expect(container.has(ServiceClass)).to.be.true
            expect(container.has(symbolAlias)).to.be.true
            expect(container.has(tokenAlias)).to.be.true
        })

        it("alias a value", () => {
            const container = new Container()
            const symbolAlias = Symbol("symbolAlias")
            const tokenAlias: Token<number> = Symbol("tokenAlias")

            const value1 = 1
            const value2 = 2

            container.set(symbolAlias, value1)
            container.set(tokenAlias, value2)

            expect(container.has(symbolAlias)).to.be.true
            expect(container.has(tokenAlias)).to.be.true
        })
    })

    describe("#remove", () => {
        it("is a method", () => {
            const container = new Container()
            expect(container.remove).to.be.a("function")
        })

        it("removes an alias", () => {
            class ServiceClass {}

            const container = new Container()
            const symbolAlias = Symbol("symbolAlias")
            const tokenAlias: Token<ServiceClass> = Symbol("tokenAlias")

            Service()(ServiceClass)

            container.set(symbolAlias, ServiceClass)
            container.set(tokenAlias, ServiceClass)

            container.remove(symbolAlias)
            container.remove(tokenAlias)

            expect(container.has(symbolAlias)).to.be.false
            expect(container.has(tokenAlias)).to.be.false
        })
    })
})
