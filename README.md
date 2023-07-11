# ts-injector
A simple Dependency Injection library for Typescript

## Installation

```sh
npm install @nealrame/ts-injector
```

## Basic Usage
```ts
import {
    Container,
} from "@nealrame/ts-injector"

const container = new Container()

@container.service()
class Service1 {
    method1() {
        console.log("message from a Service1 instance")
    }
}

@container.service()
class Service2 {
    @container.inject(Service1)
    private _service1: Service1!

    method2() {
        this._service1.method1()
        console.log("message from a Service2 instance")
    }
}

const service2 = container.get(Service2)
service2.method2()
// logs:
// message from a Service1 instance
// message from a Service2 instance
```

## License

[MIT](https://github.com/NealRame/ts-injector/blob/master/LICENSE)
