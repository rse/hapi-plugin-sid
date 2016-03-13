/*
**  hapi-plugin-header -- HAPI plugin for always sending custom HTTP header
**  Copyright (c) 2016 Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*  internal dependencies  */
var Package = require("./package.json")

/*  the HAPI plugin register function  */
var register = (server, options, next) => {
    /*  helper function for setting a particular header  */
    var setHeader = (request, name, value) => {
        value = value.replace(/\r?\n$/, "")
        if (request.response && request.response.header)
            request.response.header(name, value)
        else if (request.response && request.response.output && request.response.output.headers)
            request.response.output.headers[name] = value
    }

    /*  hook into the request processing  */
    server.ext("onPreResponse", (request, reply) => {
        /*  start with a resolvd promise  */
        var promise = Promise.resolve()
        console.log(request.id)

        /*  iterate over all custom headers  */
        Object.keys(options).forEach((name) => {
            var value = options[name]
            if (typeof value === "function")
                value = value.call(null, server, request, reply)
            if (typeof value.then === "function") {
                /*  case 1: asynchronous value availability  */
                promise = promise.then(() => {
                    return value.then((value) => {
                        setHeader(request, name, value)
                    })
                })
            }
            else {
                /*  case 2: synchronous value availability  */
                setHeader(request, name, value)
            }
        })

        /*  finish once the promise chain finished  */
        promise.then(() => {
            reply.continue()
        })
    })

    /*  continue processing  */
    next()
}

/*  provide meta-information as expected by HAPI  */
register.attributes = { pkg: Package }

/*  export register function, wrapped in a plugin object  */
module.exports = { register: register }

