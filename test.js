
const HAPI       = require("@hapi/hapi")
const HAPIHeader = require("./hapi-plugin-header")
const Request    = require("request-promise")

;(async () => {
    const server = HAPI.server({
        host:  "127.0.0.1",
        port:  12345,
        debug: { request: [ "error" ] }
    })

    await server.register({
        plugin: HAPIHeader,
        options: {
            "Server":        "Example/1.2.3",
            "X-Request-Id":  (server, request, h) => request.info.id,
            "X-External-IP": (server, request, h) => {
                return Request.get("http://myexternalip.com/raw")
                    .then((value) => value.replace(/\r?\n/g, ""))
            },
            "X-Null": null,
            "X-Undefined": undefined,
            "X-Null-Function": () => null,
            "X-Undefined-Function": () => undefined,
            "X-Null-Promise": async () => null,
            "X-Undefined-Promise": async () => undefined,
        }
    })

    server.route({
        method:  "GET",
        path:    "/foo",
        handler: async (request, h) => {
            return "OK"
        }
    })
    await server.start()

    let response = await server.inject({
        method:  "GET",
        url:     "/foo"
    })
    if (response.result === "OK")
        console.log("-- internal request: /foo: OK", response.headers)
    else
        console.log("-- internal request: /foo: ERROR: invalid response: ", response.result)

    await server.stop({ timeout: 1000 })
    process.exit(0)
})()

