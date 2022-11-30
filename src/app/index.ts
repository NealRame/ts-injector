import app1 from "./app1"
import app2 from "./app2"

const apps = {
    app1,
    app2,
}

;(process.env.APPS?.split(":") ?? Object.keys(apps)).forEach(app => {
    apps[app as keyof typeof apps]?.()
})
