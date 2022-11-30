import * as path from "path"
import * as dotenv from "dotenv"

import app1 from "./app1"
import app2 from "./app2"

dotenv.config({
    path: path.join(__dirname, "..", "..", ".env"),
})

const apps = {
    app1,
    app2,
}

;(process.env.TEST_APPS?.split(":") ?? Object.keys(apps)).forEach(app => {
    apps[app as keyof typeof apps]?.()
})
