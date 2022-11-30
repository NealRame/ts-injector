/* eslint-disable @typescript-eslint/no-use-before-define */
import {
    Container,
    Inject,
    Service,
} from "../lib"

@Service()
class A {
    m() {
        console.log("A::m called")
    }
}

@Service()
class B {
    @Inject(A) public a: A
}

export default function () {
    const container = new Container()
    const b = container.get(B)
    b.a.m()
}
