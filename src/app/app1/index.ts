/* eslint-disable @typescript-eslint/no-use-before-define */
import {
    Container,
    Inject,
    Service,
} from "../../lib"

@Service()
class A {
    mA() {
        console.log("A::m called")
    }
}

@Service()
abstract class B {
    @Inject(A) public a: A
    abstract mB(): void
}

@Service()
class C {
    mC() {
        console.log("C::m called")
    }
}

@Service()
class D extends B {
    @Inject(C) public c: C
    mB() {
        console.log("C::mB called")
    }
}

const container = new Container()
const d = container.get(D)
d.mB()
d.a.mA()
d.c.mC()
