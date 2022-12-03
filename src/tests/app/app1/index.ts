/* eslint-disable @typescript-eslint/no-use-before-define */
import {
    Container,
    Inject,
    Service,
} from "../../../lib"

@Service()
class A {
    mA() {
        console.log("A::m called")
    }
}

class B {
    @Inject(A) public a: A
    mB() {
        console.log("B::mB called")
    }
}

@Service()
class C {
    mC() {
        console.log("C::m called")
    }
}

class D extends B {
    @Inject(C) public c: C
}

const container = new Container()

console.log("Check D")
const d = container.get(D)
console.log(d)
d.a.mA()
d.mB()
d.c.mC()
console.log("----------------------")

console.log("Check B")
const b = container.get(B)
console.log(b)
b.mB()
