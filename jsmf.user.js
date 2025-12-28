// ==UserScript==
// @name        js-modding-framework
// @match       *://*.*
// @description just a modding framework for javascript
// @run-at      document-start
// @license     MIT
// @version     1
// @namespace   https://github.com/darkguyidk/
// @grant       none
// @icon        https://camo.githubusercontent.com/12ee4ba2f5b77d76399584a88a72d5a49ef0691e152c0f3972631d551223b063/68747470733a2f2f64756d6d79696d6167652e636f6d2f333030783330302f3030302f6666662e706e6726746578743d4a534d46
// ==/UserScript==
(function() {
    // Web Socket section
    const OriginalWS = window.WebSocket;
    window.WebSocket = function(url, protocols) {
        const ws = new OriginalWS(url, protocols);

        ws.addEventListener("message", event => {
            ModCore.callHook("ws:message", event.data, ws);
        });

        const originalSend = ws.send;
        ws.send = function(data) {
            ModCore.callHook("ws:send", data, ws);
            return originalSend.call(ws, data);
        };

        ModCore.callHook("ws:open", ws);

        return ws;
    };
})();
const ModCore = {
    hooks: {},
    plugins: [],
    registerHook(name, fn) {
        this.hooks[name] = fn;
    },
    callHook(name, ...args) {
        if (this.hooks[name]) {
            try { this.hooks[name](...args); }
            catch (e) { console.error(`[Hook Error: ${name}]`, e); }
        }
    },
    registerPlugin(plugin) {
        this.plugins.push(plugin);
        if (plugin.init) plugin.init(this);
    }
};
