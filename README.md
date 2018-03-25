
hapi-plugin-header
===================

[HAPI](http://hapijs.com/) plugin for always sending custom HTTP header.

<p/>
<img src="https://nodei.co/npm/hapi-plugin-header.png?downloads=true&stars=true" alt=""/>

<p/>
<img src="https://david-dm.org/rse/hapi-plugin-header.png" alt=""/>

Installation
------------

```shell
$ npm install hapi hapi-plugin-header
```

About
-----

This is a small plugin for the [HAPI](http://hapijs.com/) server
framework for always sending one or more custom HTTP headers,
independent of the current route. The header values can be provided
synchronously or asynchronously (via Promises).

Usage
-----

```js
await server.register({
    plugin: require("hapi-plugin-header"),
    options: {
        "Server":        "Example/1.2.3",
        "X-Request-Id":  (server, request, h) => request.info.id,
        "X-External-IP": (server, request, h) => {
            return Request.get("http://myexternalip.com/raw")
                .then((value) => value.replace(/\r?\n/g, ""))
        }
    }
})
```

License
-------

Copyright (c) 2016 Ralf S. Engelschall (http://engelschall.com/)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

