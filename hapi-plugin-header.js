/*
**  hapi-plugin-header -- HAPI plugin for always sending custom HTTP header
**  Copyright (c) 2016-2018 Ralf S. Engelschall <rse@engelschall.com>
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
const pkg = require("./package.json")

/*  the HAPI plugin register function  */
const register = (server, options) => {
    /*  helper function for setting a particular header  */
    var setHeader = (request, name, value) => {
        value = value.replace(/\r?\n$/, "")
        if (request.response && request.response.header)
            request.response.header(name, value)
        else if (request.response && request.response.output && request.response.output.headers)
            request.response.output.headers[name] = value
    }

    /*  hook into the request processing  */
    server.ext("onPreResponse", async (request, h) => {
        let names = Object.keys(options)
        for (let i = 0; i < names.length; i++) {
            let name = names[i]
            let value = options[name]
            if (typeof value === "function")
                value = value.call(null, server, request, h)
            if (typeof value == "object" && typeof value.then === "function")
                value = await value
            setHeader(request, name, value)
        }
        return h.continue
    })
}

/*  export register function, wrapped in a plugin object  */
module.exports = {
    plugin: {
        register: register,
        pkg:      pkg
    }
}

