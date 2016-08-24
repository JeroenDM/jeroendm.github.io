/**
 * Core for Shower HTML presentation engine
 * shower-core v2.0.6, https://github.com/shower/core
 * @copyright 2010–2016 Vadim Makeev, http://pepelsbey.net/
 * @license MIT
 */
! function(a) {
    var b, c = {
            NOT_RESOLVED: "NOT_RESOLVED",
            IN_RESOLVING: "IN_RESOLVING",
            RESOLVED: "RESOLVED"
        },
        d = function() {
            var l = {
                    trackCircularDependencies: !0,
                    allowMultipleDeclarations: !0
                },
                m = {},
                n = !1,
                o = [],
                p = function(a, d, e) {
                    e || (e = d, d = []);
                    var f = m[a];
                    f || (f = m[a] = {
                        name: a,
                        decl: b
                    }), f.decl = {
                        name: a,
                        prev: f.decl,
                        fn: e,
                        state: c.NOT_RESOLVED,
                        deps: d,
                        dependents: [],
                        exports: b
                    }
                },
                q = function(b, c, d) {
                    "string" == typeof b && (b = [b]), n || (n = !0, k(v)), o.push({
                        deps: b,
                        cb: function(b, f) {
                            f ? (d || e)(f) : c.apply(a, b)
                        }
                    })
                },
                r = function(a) {
                    var b = m[a];
                    return b ? c[b.decl.state] : "NOT_DEFINED"
                },
                s = function(a) {
                    return !!m[a]
                },
                t = function(a) {
                    for (var b in a) a.hasOwnProperty(b) && (l[b] = a[b])
                },
                u = function() {
                    var a, b = {};
                    for (var c in m) m.hasOwnProperty(c) && (a = m[c], (b[a.decl.state] || (b[a.decl.state] = [])).push(c));
                    return b
                },
                v = function() {
                    n = !1, w()
                },
                w = function() {
                    var a, b = o,
                        c = 0;
                    for (o = []; a = b[c++];) x(null, a.deps, [], a.cb)
                },
                x = function(a, b, c, d) {
                    var e = b.length;
                    e || d([]);
                    for (var g, h, i = [], j = function(a, b) {
                            if (b) return void d(null, b);
                            if (!--e) {
                                for (var c, f = [], g = 0; c = i[g++];) f.push(c.exports);
                                d(f)
                            }
                        }, k = 0, l = e; l > k;) {
                        if (g = b[k++], "string" == typeof g) {
                            if (!m[g]) return void d(null, f(g, a));
                            h = m[g].decl
                        } else h = g;
                        i.push(h), y(h, c, j)
                    }
                },
                y = function(b, d, e) {
                    if (b.state === c.RESOLVED) return void e(b.exports);
                    if (b.state === c.IN_RESOLVING) return void(l.trackCircularDependencies && j(b, d) ? e(null, g(b, d)) : b.dependents.push(e));
                    if (b.dependents.push(e), b.prev && !l.allowMultipleDeclarations) return void A(b, i(b));
                    l.trackCircularDependencies && (d = d.slice()).push(b);
                    var f = !1,
                        k = b.prev ? b.deps.concat([b.prev]) : b.deps;
                    b.state = c.IN_RESOLVING, x(b, k, d, function(c, d) {
                        return d ? void A(b, d) : (c.unshift(function(a, c) {
                            return f ? void e(null, h(b)) : (f = !0, void(c ? A(b, c) : z(b, a)))
                        }), void b.fn.apply({
                            name: b.name,
                            deps: b.deps,
                            global: a
                        }, c))
                    })
                },
                z = function(a, d) {
                    a.exports = d, a.state = c.RESOLVED;
                    for (var e, f = 0; e = a.dependents[f++];) e(d);
                    a.dependents = b
                },
                A = function(a, b) {
                    a.state = c.NOT_RESOLVED;
                    for (var d, e = 0; d = a.dependents[e++];) d(null, b);
                    a.dependents = []
                };
            return {
                create: d,
                define: p,
                require: q,
                getState: r,
                isDefined: s,
                setOptions: t,
                getStat: u
            }
        },
        e = function(a) {
            k(function() {
                throw a
            })
        },
        f = function(a, b) {
            return Error(b ? 'Module "' + b.name + '": can\'t resolve dependence "' + a + '"' : 'Required module "' + a + "\" can't be resolved")
        },
        g = function(a, b) {
            for (var c, d = [], e = 0; c = b[e++];) d.push(c.name);
            return d.push(a.name), Error('Circular dependence has been detected: "' + d.join(" -> ") + '"')
        },
        h = function(a) {
            return Error('Declaration of module "' + a.name + '" has already been provided')
        },
        i = function(a) {
            return Error('Multiple declarations of module "' + a.name + '" have been detected')
        },
        j = function(a, b) {
            for (var c, d = 0; c = b[d++];)
                if (a === c) return !0;
            return !1
        },
        k = function() {
            var b = [],
                c = function(a) {
                    return 1 === b.push(a)
                },
                d = function() {
                    var a = b,
                        c = 0,
                        d = b.length;
                    for (b = []; d > c;) a[c++]()
                };
            if ("object" == typeof process && process.nextTick) return function(a) {
                c(a) && process.nextTick(d)
            };
            if (a.setImmediate) return function(b) {
                c(b) && a.setImmediate(d)
            };
            if (a.postMessage && !a.opera) {
                var e = !0;
                if (a.attachEvent) {
                    var f = function() {
                        e = !1
                    };
                    a.attachEvent("onmessage", f), a.postMessage("__checkAsync", "*"), a.detachEvent("onmessage", f)
                }
                if (e) {
                    var g = "__modules" + +new Date,
                        h = function(a) {
                            a.data === g && (a.stopPropagation && a.stopPropagation(), d())
                        };
                    return a.addEventListener ? a.addEventListener("message", h, !0) : a.attachEvent("onmessage", h),
                        function(b) {
                            c(b) && a.postMessage(g, "*")
                        }
                }
            }
            var i = a.document;
            if ("onreadystatechange" in i.createElement("script")) {
                var j = i.getElementsByTagName("head")[0],
                    k = function() {
                        var a = i.createElement("script");
                        a.onreadystatechange = function() {
                            a.parentNode.removeChild(a), a = a.onreadystatechange = null, d()
                        }, j.appendChild(a)
                    };
                return function(a) {
                    c(a) && k()
                }
            }
            return function(a) {
                c(a) && setTimeout(d, 0)
            }
        }();
    "object" == typeof exports ? module.exports = d() : a.modules = d()
}("undefined" != typeof window ? window : global),
function(a) {
    function b(a, b) {
        return a.dataset ? a.dataset[b] : a.getAttribute("data-" + b)
    }
    var c = ["debug-mode", "slides-selector", "hotkeys"];
    a.shower = {
        modules: modules.create(),
        options: a.showerOptions || {}
    }, document.addEventListener("DOMContentLoaded", function() {
        a.shower.modules.require("shower.defaultOptions", function(d) {
            var e = a.hasOwnProperty("showerOptions"),
                f = a.shower.options,
                g = f.shower_selector || d.container_selector,
                h = document.querySelector(g),
                i = b.bind(this, h),
                j = "undefined" != typeof f.auto_init ? f.auto_init : !0;
            if (!h) throw new Error("Shower element with selector " + g + " not found.");
            ("false" !== i("auto-init") || e && j) && (e || c.forEach(function(a) {
                var b = i(a);
                null !== b && "undefined" != typeof b && (f[a.replace(/-/g, "_")] = b)
            }), a.shower.modules.require(["shower"], function(a) {
                a.init({
                    container: h,
                    options: f
                })
            }))
        })
    }, !1)
}(window), shower.modules.define("shower", ["shower.global"], function(a, b) {
    a(b)
}), shower.modules.define("Emitter", ["emitter.Event", "emitter.EventGroup", "util.extend"], function(a, b, c, d) {
    function e(a) {
        a = a || {}, this._context = a.context, this._parent = a.parent, this._listeners = {}
    }

    function f(a, b) {
        return a.priority - b.priority
    }
    d(e.prototype, {
        on: function(a, b, c, d) {
            if ("undefined" == typeof b) throw new Error("Callback is not defined.");
            if (d = d || 0, "string" == typeof a) this._addListener(a, b, c, d);
            else
                for (var e = 0, f = a.length; f > e; e++) this._addListener(a[e], b, c, d);
            return this
        },
        off: function(a, b, c, d) {
            if (d = d || 0, "string" == typeof a) this._removeListener(a, b, c, d);
            else
                for (var e = 0, f = a.length; f > e; e++) this._removeListener(a[e], b, c, d);
            return this
        },
        once: function(a, b, c, d) {
            var e = function(f) {
                this.off(a, e, this, d), c ? b.call(c, f) : b(f)
            };
            return this.on(a, e, this, d), this
        },
        emit: function(a, b) {
            var c = b,
                d = this._listeners;
            c && "function" == typeof c.get || (c = this.createEventObject(a, b, this._context)), c.isPropagationStopped() || (d.hasOwnProperty(a) && this._callListeners(d[a], c), this._parent && !c.isPropagationStopped() && this._parent.emit(a, c))
        },
        createEventObject: function(a, c, e) {
            var f = {
                target: e,
                type: a
            };
            return new b(c ? d(f, c) : f)
        },
        setParent: function(a) {
            this._parent != a && (this._parent = a)
        },
        getParent: function() {
            return this._parent
        },
        group: function() {
            return new c(this)
        },
        _addListener: function(a, b, c, d) {
            var e = {
                callback: b,
                context: c,
                priority: d
            };
            this._listeners[a] ? this._listeners[a].push(e) : this._listeners[a] = [e]
        },
        _removeListener: function(a, b, c, d) {
            var e, f = this._listeners[a];
            if (f) {
                for (var g = -1, h = 0, i = f.length; i > h; h++) e = f[h], e.callback == b && e.context == c && e.priority == d && (g = h); - 1 != g && (1 == f.length ? this._clearType(a) : f.splice(g, 1))
            }
        },
        _clearType: function(a) {
            this._listeners.hasOwnProperty(a) && delete this._listeners[a]
        },
        _callListeners: function(a, b) {
            var c = a.length - 1;
            for (a.sort(f); c >= 0 && !b.defaultPrevented();) {
                var d = a[c];
                d && (d.context ? d.callback.call(d.context, b) : d.callback(b)), c--
            }
        }
    }), a(e)
}), shower.modules.define("emitter.Event", ["util.extend"], function(a, b) {
    function c(a) {
        this._data = a, this._preventDefault = !1, this._stopPropagation = !1
    }
    b(c.prototype, {
        get: function(a) {
            return this._data[a]
        },
        preventDefault: function() {
            return this._preventDefault = !0, this._preventDefault
        },
        defaultPrevented: function() {
            return this._preventDefault
        },
        stopPropagation: function() {
            return this._stopPropagation = !0, this._stopPropagation
        },
        isPropagationStopped: function() {
            return this._stopPropagation
        }
    }), a(c)
}), shower.modules.define("emitter.EventGroup", ["util.extend"], function(a, b) {
    function c(a) {
        this.events = a, this._listeners = []
    }
    b(c.prototype, {
        on: function(a, b, c) {
            if (Array.isArray(a))
                for (var d = 0, e = a.length; e > d; d++) this._listeners.push(a[d], b, c);
            else this._listeners.push(a, b, c);
            return this.events.on(a, b, c), this
        },
        off: function(a, b, c) {
            if (Array.isArray(a))
                for (var d = 0, e = a.length; e > d; d++) this._removeListener(a[d], b, c);
            else this._removeListener(a, b, c);
            return this
        },
        offAll: function() {
            for (var a = 0, b = this._listeners.length; b > a; a += 3) this.events.off(this._listeners[a], this._listeners[a + 1], this._listeners[a + 2]);
            return this._listeners.length = 0, this
        },
        _removeListener: function(a, b, c) {
            for (var d = this._listeners.indexOf(a, 0); - 1 != d;) this._listeners[d + 1] == b && this._listeners[d + 2] == c && (this._listeners.splice(d, 3), this.events.off(a, b, c)), d = this._listeners.indexOf(a, d)
        }
    }), a(c)
}), shower.modules.define("Plugins", ["Emitter", "util.extend"], function(a, b, c) {
    function d(a) {
        this.events = new b({
            context: this
        }), this._showerGlobal = a, this._showerInstances = a.getInited(), this._plugins = {}, this._instances = [], a.events.on("init", this._onShowerInit, this)
    }
    c(d.prototype, {
        destroy: function() {
            this._showerGlobal.events.off("init", this._onShowerInit, this), this._plugins = null
        },
        add: function(a, b) {
            if (this._plugins.hasOwnProperty(a)) throw new Error("Plugin " + a + " already exist.");
            return this._requireAndAdd({
                name: a,
                options: b
            }), this
        },
        remove: function(a) {
            if (!this._plugins.hasOwnProperty(a)) throw new Error("Plugin " + a + " not found.");
            return delete this._plugins[a], this.events.emit("remove", {
                name: a
            }), this
        },
        get: function(a, b) {
            var c, d = this._plugins[a];
            if (d && b)
                for (var e = 0, f = this._instances.length; f > e; e++) {
                    var g = this._instances[e];
                    g.plugin.name === a && g.shower === b && (c = g.instance)
                }
            return c
        },
        _requireAndAdd: function(a) {
            shower.modules.require(a.name, function(b) {
                a["class"] = b, this._plugins[a.name] = a, this._instancePlugin(a)
            }.bind(this))
        },
        _instancePlugin: function(a) {
            this._showerInstances.forEach(function(b) {
                this._instance(a, b)
            }, this), this.events.emit("add", {
                name: a.name
            })
        },
        _instanceFor: function(a) {
            for (var b in this._plugins) this._plugins.hasOwnProperty(b) && this._instance(this._plugins[b], a)
        },
        _instance: function(a, b) {
            var c = a.options || b.options.get("plugin_" + a.name);
            this._instances.push({
                shower: b,
                plugin: a,
                instance: new a["class"](b, c)
            })
        },
        _onShowerInit: function(a) {
            var b = a.get("shower");
            this._instanceFor(b)
        }
    }), a(d)
}), shower.modules.define("shower.global", ["Emitter", "Plugins"], function(a, b, c) {
    var d = [],
        e = {
            ready: function(a) {
                return a && (d.length ? d.forEach(a) : this.events.once("init", function(b) {
                    a(b.get("shower"))
                })), Boolean(d.length)
            },
            init: function(a) {
                a = a || {}, shower.modules.require(["Shower"], function(b) {
                    new b(a.container, a.options)
                })
            },
            getInited: function() {
                return d.slice()
            }
        };
    e.events = new b({
        context: e
    }), e.plugins = new c(e), e.events.on("notify", function(a) {
        var b = a.get("shower");
        d.push(b), e.events.emit("init", a)
    }), a(e)
}), shower.modules.define("Options", ["Emitter", "options.Monitor", "util.Store", "util.extend", "util.inherit"], function(a, b, c, d, e, f) {
    function g(a) {
        g["super"].constructor.apply(this, arguments), this.events = new b
    }
    f(g, d, {
        set: function(a, b) {
            var c = [];
            if ("string" == typeof a) g["super"].set.call(this, a, b), c.push({
                name: a,
                value: b
            });
            else {
                var d = a || {};
                Object.keys(d).forEach(function(a) {
                    var b = d[a];
                    g["super"].set.call(this, a, b), c.push({
                        name: a,
                        value: b
                    })
                })
            }
            return c.length && this.events.emit("set", {
                items: c
            }), this
        },
        unset: function(a) {
            return g["super"].unset(this, a), this.events.emit("unset", {
                name: a
            }), this
        },
        getMonitor: function() {
            return new c(this)
        }
    }), a(g)
}), shower.modules.define("options.Monitor", ["util.extend"], function(a, b) {
    function c(a) {
        this._options = a, this._optionsEvents = a.events.group().on(["set", "unset"], this._onOptionsChange, this), this._fieldsHanders = {}
    }
    b(c.prototype, {
        destroy: function() {
            this._options = null, this._optionsEvents.offAll(), this._fieldsHanders = null
        },
        add: function(a, b, c) {
            if (Array.prototype.isArray.call(null, a)) {
                var d = a;
                for (var e in d) d.hasOwnProperty(e) && this._addHandler(e, b, c)
            } else this._addHandler(a, b, c);
            return this
        },
        remove: function(a, b, c) {
            if (Array.prototype.isArray.call(null, a)) {
                var d = a;
                for (var e in d) d.hasOwnProperty(e) && this._remodeHandler(e, b, c)
            } else this._remodeHandler(a, b, c);
            return this
        },
        getOptions: function() {
            return this._options
        },
        _onOptionsChange: function(a) {
            var b = "unset" === a.get("type") ? [a.get("name")] : a.get("items");
            b.forEach(function(a) {
                this._fieldsHanders.hasOwnProperty(a) && this._fieldsHanders[a].forEach(function(b) {
                    b.callback.call(b.context, this._options.get(a))
                })
            }, this)
        },
        _addHandler: function(a, b, c) {
            var d = {
                callback: b,
                context: c
            };
            this._fieldsHanders.hasOwnProperty(fieldName) ? this._fieldsHanders[fieldName].push(d) : this._fieldsHanders[fieldName] = [d]
        },
        _remodeHandler: function(a, b, c) {
            if (!this._fieldsHanders.hasOwnProperty(a)) throw new Error("Remove undefined handler for " + a + " field");
            var d = this._fieldsHanders[a],
                e = d.filter(function(a) {
                    return a.callback === b && a.context === c
                })[0];
            if (!hander) throw new Error("Hanlder for " + a + " not found.");
            d.splice(d.indexOf(e, 1))
        }
    }), a(c)
}), shower.modules.define("Shower", ["Emitter", "Options", "shower.global", "shower.defaultOptions", "shower.Container", "shower.Player", "shower.Location", "shower.slidesParser", "util.extend"], function(a, b, c, d, e, f, g, h, i, j) {
    function k(a, i) {
        i = i || {}, this.events = new b({
            context: this
        }), this.options = new c({}, e, i);
        var j = a || this.options.get("container_selector");
        "string" == typeof j && (j = document.querySelector(j)), this.player = new g(this), this.container = new f(this, j), this._slides = [], this._isHotkeysOn = !0, this._liveRegion = null, this._initSlides(), this._initLiveRegion(), this.options.get("debug_mode") && (document.body.classList.add(this.options.get("debug_mode_classname")), console.info("Debug mode on")), this.options.get("hotkeys") || this.disableHotkeys(), this.location = new h(this), d.events.emit("notify", {
            shower: this
        }), this._playerListeners = this.player.events.group().on("activate", this._onPlayerSlideActivate, this)
    }
    j(k.prototype, {
        destroy: function() {
            this.events.emit("destroy"), this.location.destroy(), this.container.destroy(), this.player.destroy(), this._slides = []
        },
        add: function(a) {
            if (Array.isArray.call(null, a))
                for (var b = 0, c = a.length; c > b; b++) this._addSlide(a[b]);
            else this._addSlide(a);
            return this
        },
        remove: function(a) {
            var b;
            if ("number" == typeof a) b = a;
            else {
                if (-1 == this._slides.indexOf(a)) throw new Error("Slide not found");
                b = this._slides.indexOf(a)
            }
            return a = this._slides.splice(b, 1)[0], this.events.emit("slideremove", {
                slide: a
            }), a.destroy(), this
        },
        get: function(a) {
            return this._slides[a]
        },
        getSlides: function() {
            return this._slides.slice()
        },
        getSlidesCount: function() {
            return this._slides.length
        },
        getSlideIndex: function(a) {
            return this._slides.indexOf(a)
        },
        disableHotkeys: function() {
            return this._isHotkeysOn = !1, this
        },
        enableHotkeys: function() {
            return this._isHotkeysOn = !0, this
        },
        isHotkeysEnabled: function() {
            return this._isHotkeysOn
        },
        getLiveRegion: function() {
            return this._liveRegion
        },
        updateLiveRegion: function(a) {
            return this._liveRegion.innerHTML = a, this
        },
        _onPlayerSlideActivate: function(a) {
            var b = a.get("slide");
            this.updateLiveRegion(b.getContent())
        },
        _initSlides: function() {
            var a = this.options.get("slides_parser") || i,
                b = a(this.container.getElement(), this.options.get("slides_selector"));
            this.add(b)
        },
        _addSlide: function(a) {
            a.state.set("index", this._slides.length), this._slides.push(a), this.events.emit("slideadd", {
                slide: a
            })
        },
        _initLiveRegion: function() {
            var a = document.createElement("section");
            a.setAttribute("role", "region"), a.setAttribute("aria-live", "assertive"), a.setAttribute("aria-relevant", "additions"), a.setAttribute("aria-label", "Slide Content: Auto-updating"), a.className = "region", document.body.appendChild(a), this._liveRegion = a
        }
    }), a(k)
}), shower.modules.define("shower.Container", ["Emitter", "util.bound", "util.extend"], function(a, b, c, d) {
    function e(a, c) {
        this.events = new b({
            context: this,
            parent: a.events
        }), this._shower = a, this._element = c, this._isSlideMode = !1, this.init()
    }
    d(e.prototype, {
        init: function() {
            var a = document.body.classList,
                b = this._shower.options,
                c = b.get("mode_full_classname"),
                d = b.get("mode_list_classname");
            a.contains(d) || a.contains(c) || a.add(d), this._setupListeners()
        },
        destroy: function() {
            this._clearListeners(), this._element = null, this._shower = null, this._isSlideMode = null
        },
        getElement: function() {
            return this._element
        },
        enterSlideMode: function() {
            var a = document.body.classList,
                b = this._shower.options;
            return a.remove(b.get("mode_list_classname")), a.add(b.get("mode_full_classname")), document.body.setAttribute("role", "application"), this._applyTransform(this._getTransformScale()), this._isSlideMode = !0, this.events.emit("slidemodeenter"), this
        },
        exitSlideMode: function() {
            var a = document.body.classList,
                b = this._shower.options;
            return a.remove(b.get("mode_full_classname")), a.add(b.get("mode_list_classname")), document.body.removeAttribute("role", "application"), this._applyTransform("none"), this._isSlideMode = !1, this.scrollToCurrentSlide(), this.events.emit("slidemodeexit"), this
        },
        isSlideMode: function() {
            return this._isSlideMode
        },
        scrollToCurrentSlide: function() {
            var a = this._shower.options.get("slide_active_classname"),
                b = this._element.querySelector("." + a);
            return b && window.scrollTo(0, b.offsetTop), this
        },
        _setupListeners: function() {
            this._showerListeners = this._shower.events.group().on("slideadd", this._onSlideAdd, this).on("slideremove", this._onSlideRemove, this), window.addEventListener("resize", c(this, "_onResize")), document.addEventListener("keydown", c(this, "_onKeyDown"))
        },
        _clearListeners: function() {
            this._showerListeners.offAll(), window.removeEventListener("resize", c(this, "_onResize")), document.removeEventListener("keydown", c(this, "_onKeyDown"))
        },
        _getTransformScale: function() {
            var a = Math.max(document.body.clientWidth / window.innerWidth, document.body.clientHeight / window.innerHeight);
            return "scale(" + 1 / a + ")"
        },
        _applyTransform: function(a) {
            ["WebkitTransform", "MozTransform", "msTransform", "OTransform", "transform"].forEach(function(b) {
                document.body.style[b] = a
            })
        },
        _onResize: function() {
            this.isSlideMode() && this._applyTransform(this._getTransformScale())
        },
        _onSlideAdd: function(a) {
            var b = a.get("slide");
            b.events.on("click", this._onSlideClick, this)
        },
        _onSlideRemove: function(a) {
            var b = a.get("slide");
            b.events.off("click", this._onSlideClick, this)
        },
        _onSlideClick: function() {
            this._isSlideMode || this.enterSlideMode()
        },
        _onKeyDown: function(a) {
            if (this._shower.isHotkeysEnabled()) switch (a.which) {
                case 13:
                    if (a.preventDefault(), this.isSlideMode()) this._shower.player.next();
                    else {
                        var b = a.shiftKey ? 0 : this._shower.player.getCurrentSlideIndex();
                        this._shower.player.go(b), this.enterSlideMode()
                    }
                    break;
                case 27:
                    a.preventDefault(), this.exitSlideMode();
                    break;
                case 116:
                    if (a.preventDefault(), this.isSlideMode()) this.exitSlideMode();
                    else {
                        var b = a.shiftKey ? this._shower.player.getCurrentSlideIndex() : 0;
                        this._shower.player.go(b), this.enterSlideMode()
                    }
                    break;
                case 80:
                    !this.isSlideMode() && a.altKey && a.metaKey && (a.preventDefault(), this.enterSlideMode())
            }
        }
    }), a(e)
}), shower.modules.define("shower.Location", ["util.SessionStore", "util.bound", "util.extend"], function(a, b, c, d) {
    function e(a) {
        this._shower = a;
        var c = a.options.get("sessionstore_key") + "-shower.Location";
        this.state = new b(c, {
            isSlideMode: !1
        }), this._showerListeners = null, this._playerListeners = null, this._documentTitle = document.title, this._popStateProcess = null, this._setupListeners(), this._init()
    }
    d(e.prototype, {
        destroy: function() {
            this._clearListeners()
        },
        save: function() {
            this.state.set("isSlideMode", this._isSlideMode())
        },
        _init: function() {
            var a, b = this._shower,
                c = window.location.hash.substr(1),
                d = b.options.get("mode_full_classname");
            window.location.hash = "", (this.state.get("isSlideMode") || document.body.classList.contains(d)) && b.container.enterSlideMode(), "" !== c && (a = this._getSlideById(c), b.player.go("undefined" != typeof a.index ? a.index : 0))
        },
        _setupListeners: function() {
            var a = this._shower;
            this._playerListeners = a.player.events.group().on("activate", this._onSlideActivate, this), this._containerListener = a.container.events.group().on(["slidemodeenter", "slidemodeexit"], this._onContainerSlideModeChange, this), window.addEventListener("popstate", c(this, "_onPopstate"))
        },
        _clearListeners: function() {
            window.removeEventListener("popstate", c(this, "_onPopstate")), this._playerListeners.offAll(), this._containerListener.offAll()
        },
        _getSlideById: function(a) {
            for (var b, c, d = this._shower.getSlides(), e = d.length - 1; e >= 0; e--)
                if (d[e].getId() === a) {
                    b = d[e], c = e;
                    break
                }
            return {
                slide: b,
                index: c
            }
        },
        _onSlideActivate: function(a) {
            window.location.hash = a.get("slide").getId(), this._setTitle()
        },
        _onContainerSlideModeChange: function() {
            this._setTitle(), this.save()
        },
        _isSlideMode: function() {
            return this._shower.container.isSlideMode()
        },
        _onPopstate: function() {
            var a, b = this._shower,
                c = window.location.hash.substr(1),
                d = b.player.getCurrentSlide(),
                e = b.player.getCurrentSlideIndex();
            this._isSlideMode() && -1 === e ? b.player.go(0) : -1 === e && "" !== window.location.hash && b.player.go(0), d && c !== d.getId() && (a = this._getSlideById(c), b.player.go(a.index))
        },
        _setTitle: function() {
            var a = document.title,
                b = this._isSlideMode(),
                c = this._shower.player.getCurrentSlide();
            if (b && c) {
                var d = c.getTitle();
                document.title = d ? d + " — " + this._documentTitle : this._documentTitle
            } else this._documentTitle !== a && (document.title = this._documentTitle)
        }
    }), a(e)
}), shower.modules.define("shower.Player", ["Emitter", "util.bound", "util.extend"], function(a, b, c, d) {
    function e(a) {
        this.events = new b({
            context: this,
            parent: a.events
        }), this._shower = a, this._showerListeners = null, this._playerListeners = null, this._currentSlideNumber = -1, this._currentSlide = null, this.init()
    }
    d(e.prototype, {
        init: function() {
            this._showerListeners = this._shower.events.group().on("slideadd", this._onSlideAdd, this).on("slideremove", this._onSlideRemove, this).on("slidemodeenter", this._onContainerSlideModeEnter, this), this._playerListeners = this.events.group().on("prev", this._onPrev, this).on("next", this._onNext, this), document.addEventListener("keydown", c(this, "_onKeyDown"))
        },
        destroy: function() {
            this._showerListeners.offAll(), this._playerListeners.offAll(), document.removeEventListener("keydown", c(this, "_onKeyDown")), this._currentSlide = null, this._currentSlideNumber = null, this._shower = null
        },
        next: function() {
            return this.events.emit("next"), this
        },
        prev: function() {
            return this.events.emit("prev"), this
        },
        first: function() {
            return this.go(0), this
        },
        last: function() {
            return this.go(this._shower.getSlidesCount() - 1), this
        },
        go: function(a) {
            "number" != typeof a && (a = this._shower.getSlideIndex(a));
            var b = this._shower.getSlidesCount(),
                c = this._currentSlide;
            return a != this._currentSlideNumber && b > a && a >= 0 && (c && c.isActive() && c.deactivate(), c = this._shower.get(a), this._currentSlide = c, this._currentSlideNumber = a, c.isActive() || c.activate(), this.events.emit("activate", {
                index: a,
                slide: c
            })), this
        },
        getCurrentSlide: function() {
            return this._currentSlide
        },
        getCurrentSlideIndex: function() {
            return this._currentSlideNumber
        },
        _onPrev: function() {
            this._changeSlide(this._currentSlideNumber - 1)
        },
        _onNext: function() {
            this._changeSlide(this._currentSlideNumber + 1)
        },
        _changeSlide: function(a) {
            this.go(a)
        },
        _onSlideAdd: function(a) {
            var b = a.get("slide");
            b.events.on("activate", this._onSlideActivate, this)
        },
        _onSlideRemove: function(a) {
            var b = a.get("slide");
            b.events.off("activate", this._onSlideActivate, this)
        },
        _onSlideActivate: function(a) {
            var b = a.get("slide"),
                c = this._shower.getSlideIndex(b);
            this.go(c)
        },
        _onKeyDown: function(a) {
            if (this._shower.isHotkeysEnabled() && !/^(?:button|input|select|textarea)$/i.test(a.target.tagName)) switch (this.events.emit("keydown", {
                event: a
            }), a.which) {
                case 33:
                case 38:
                case 37:
                case 72:
                case 75:
                    if (a.altKey || a.ctrlKey || a.metaKey) return;
                    a.preventDefault(), this.prev();
                    break;
                case 34:
                case 40:
                case 39:
                case 76:
                case 74:
                    if (a.altKey || a.ctrlKey || a.metaKey) return;
                    a.preventDefault(), this.next();
                    break;
                case 36:
                    a.preventDefault(), this.first();
                    break;
                case 35:
                    a.preventDefault(), this.last();
                    break;
                case 32:
                    this._shower.container.isSlideMode() && (a.shiftKey ? this.prev() : this.next())
            }
        },
        _onContainerSlideModeEnter: function() {
            this._currentSlide || this.go(0)
        }
    }), a(e)
}), shower.modules.define("shower.defaultOptions", function(a, b) {
    a({
        container_selector: ".shower",
        debug_mode: !1,
        debug_mode_classname: "debug",
        hotkeys: !0,
        sessionstore_key: "shower",
        slides_selector: ".shower .slide",
        mode_full_classname: "full",
        mode_list_classname: "list",
        slide_title_element_selector: "H2",
        slide_active_classname: "active",
        slide_visited_classname: "visited"
    })
}), shower.modules.define("shower.slidesParser", ["Slide"], function(a, b) {
    function c(a, c) {
        var d = a.querySelectorAll(c);
        return d = Array.prototype.slice.call(d), d.map(function(a, c) {
            var d = new b(a);
            return a.id || (a.id = c + 1), d
        })
    }
    a(c)
}), shower.modules.define("Slide", ["shower.defaultOptions", "Emitter", "Options", "slide.Layout", "slide.layoutFactory", "util.Store", "util.extend"], function(a, b, c, d, e, f, g, h) {
    function i(a, b, e) {
        this.events = new c, this.options = new d(b), this.layout = null, this.state = new g({
            visited: 0,
            index: null
        }, e), this._content = a, this._isVisited = this.state.get("visited") > 0, this._isActive = !1, this.init()
    }
    h(i.prototype, {
        init: function() {
            this.layout = "string" == typeof this._content ? new f.createLayout({
                content: this._content
            }) : new e(this._content, this.options), this.layout.setParent(this), this._setupListeners()
        },
        destroy: function() {
            this._clearListeners(), this._isActive = null, this.options = null, this.layout.destroy()
        },
        activate: function() {
            this._isActive = !0;
            var a = this.state.get("visited");
            return this.state.set("visited", ++a), this.events.emit("activate", {
                slide: this
            }), this
        },
        deactivate: function() {
            return this._isActive = !1, this.events.emit("deactivate", {
                slide: this
            }), this
        },
        isActive: function() {
            return this._isActive
        },
        isVisited: function() {
            return this.state.get("visited") > 0
        },
        getTitle: function() {
            return this.layout.getTitle()
        },
        setTitle: function(a) {
            return this.layout.setTitle(a), this
        },
        getId: function() {
            return this.layout.getElement().id
        },
        getContent: function() {
            return this.layout.getContent()
        },
        _setupListeners: function() {
            this.layoutListeners = this.layout.events.group().on("click", this._onSlideClick, this)
        },
        _clearListeners: function() {
            this.layoutListeners.offAll()
        },
        _onSlideClick: function() {
            this.activate(), this.events.emit("click", {
                slide: this
            })
        }
    }), a(i)
}), shower.modules.define("slide.Layout", ["Options", "shower.defaultOptions", "Emitter", "util.bound", "util.extend"], function(a, b, c, d, e, f) {
    function g(a, e) {
        this.options = new b({
            title_element_selector: c.slide_title_element_selector,
            active_classname: c.slide_active_classname,
            visited_classname: c.slide_visited_classname
        }, e), this.events = new d, this._element = a, this._parent = null, this._parentElement = null, this.init()
    }
    f(g.prototype, {
        init: function() {
            var a = this._element.parentNode;
            a ? this._parentElement = a : this.setParentElement(a)
        },
        destroy: function() {
            this.setParent(null)
        },
        setParent: function(a) {
            this._parent != a && (this._clearListeners(), this._parent = a, this._parent && this._setupListeners(), this.events.emit("parentchange", {
                parent: a
            }))
        },
        getParent: function() {
            return this._parent
        },
        setParentElement: function(a) {
            a != this._parentElement && (this._parentElement = a, a.appendChild(this._element), this.events.emit("parentelementchange", {
                parentElement: a
            }))
        },
        getParentElement: function() {
            return this._parentElement
        },
        getElement: function() {
            return this._element
        },
        setTitle: function(a) {
            var b = this.options.get("title_element_selector"),
                c = this._element.querySelector(b);
            c ? c.innerHTML = a : (c = document.createElement(b), c.innerHTML = a, this._element.insertBefore(c, this._element.firstChild))
        },
        getTitle: function() {
            var a = this.options.get("title_element_selector"),
                b = this._element.querySelector(a);
            return b ? b.textContent : null
        },
        getData: function(a) {
            var b = this._element;
            return b.dataset ? b.dataset[a] : b.getAttribute("data-" + a)
        },
        getContent: function() {
            return this._element.innerHTML
        },
        _setupListeners: function() {
            this._slideListeners = this._parent.events.group().on("activate", this._onSlideActivate, this).on("deactivate", this._onSlideDeactivate, this), this._element.addEventListener("click", e(this, "_onSlideClick"), !1)
        },
        _clearListeners: function() {
            this._slideListeners && this._slideListeners.offAll(), this._element.removeEventListener("click", e(this, "_onSlideClick"))
        },
        _onSlideActivate: function() {
            this._element.classList.add(this.options.get("active_classname"))
        },
        _onSlideDeactivate: function() {
            var a = this._element.classList;
            a.remove(this.options.get("active_classname")), a.add(this.options.get("visited_classname"))
        },
        _onSlideClick: function() {
            this.events.emit("click")
        }
    }), a(g)
}), shower.modules.define("slide.layoutFactory", ["slide.Layout", "util.extend"], function(a, b, c) {
    var d = {};
    c(d, {
        createLayout: function(a) {
            a = a || {};
            var e = d._createElement(c({
                content: "",
                contentType: "slide"
            }, a));
            return new b(e)
        },
        _createElement: function(a) {
            var b = document.createElement("section");
            return b.innerHTML = a.content, b.classList.add(a.contentType), b
        }
    }), a(d)
}), shower.modules.define("util.SessionStore", ["util.Store", "util.inherit"], function(a, b, c) {
    function d(a, b) {
        this._storageKey = a;
        var c = this._loadFromStorage() || b;
        d["super"].constructor.call(this, c)
    }
    c(d, b, {
        set: function(a, b) {
            d["super"].set.call(this, a, b), this._saveToStorage()
        },
        unset: function(a) {
            d["super"].unset.call(this, a), this._saveToStorage()
        },
        _saveToStorage: function() {
            window.sessionStorage.setItem(this._storageKey, JSON.stringify(this.getAll()))
        },
        _loadFromStorage: function() {
            var a = window.sessionStorage.getItem(this._storageKey);
            return a && JSON.parse(a)
        }
    }), a(d)
}), shower.modules.define("util.Store", ["util.extend"], function(a, b) {
    function c(a) {
        this._data = a || {};
        for (var c = 1, d = arguments.length; d > c; c++) b(this._data, arguments[c] || {})
    }
    b(c.prototype, {
        get: function(a, b) {
            return this._data.hasOwnProperty(a) ? this._data[a] : b
        },
        getAll: function() {
            return b({}, this._data)
        },
        set: function(a, b) {
            return this._data[a] = b, this
        },
        unset: function(a) {
            if (!this._data.hasOwnProperty(a)) throw new Error(a + " not found.");
            return delete this._data[a], this
        },
        destroy: function() {
            this._data = {}
        }
    }), a(c)
}), shower.modules.define("util.bound", function(a) {
    function b(a, b) {
        return a["__bound_" + b] || (a["__bound_" + b] = a[b].bind(a))
    }
    a(b)
}), shower.modules.define("util.extend", function(a) {
    function b(a) {
        if (!a) throw new Error("util.extend: Target not found");
        return "undefined" == typeof Object.assign ? c.apply(null, arguments) : Object.assign.apply(null, arguments)
    }

    function c(a) {
        for (var b = 1, c = arguments.length; c > b; b++) {
            var d = arguments[b];
            for (var e in d) d.hasOwnProperty(e) && (a[e] = d[e])
        }
        return a
    }
    a(b)
}), shower.modules.define("util.inherit", ["util.extend"], function(a, b) {
    var c = function(a, c, d) {
        return a.prototype = Object.create(c.prototype), a.prototype.constructor = a, a["super"] = c.prototype, a["super"].constructor = c, d && b(a.prototype, d), a.prototype
    };
    a(c)
}), shower.modules.define("shower-next", ["shower", "Emitter", "util.extend"], function(a, b, c, d) {
    function e(a, b) {
        b = b || {}, this.events = new c({
            context: this
        }), this._shower = a, this._elementsSelector = b.selector || g, this._elements = [], this._innerComplete = 0, this._setupListeners(), -1 != this._shower.player.getCurrentSlideIndex() && this._onSlideActivate()
    }
    var f = "shower-timer",
        g = ".next";
    d(e.prototype, {
        destroy: function() {
            this._clearListeners(), this._elements = null, this._elementsSelector = null, this._innerComplete = null, this._shower = null
        },
        next: function() {
            if (!this._elements.length) throw new Error("Inner nav elements not found.");
            return this._innerComplete++, this._go(), this.events.emit("next"), this
        },
        prev: function() {
            if (!this._elements.length) throw new Error("Inner nav elements not found.");
            return this._innerComplete--, this._go(), this.events.emit("prev"), this
        },
        getLength: function() {
            return this._elements = this._getElements(), this._elements.length
        },
        getComplete: function() {
            return this._innerComplete
        },
        _setupListeners: function() {
            var a = this._shower;
            this._showerListeners = a.events.group().on("destroy", this.destroy, this), this._playerListeners = a.player.events.group().on("activate", this._onSlideActivate, this).on("next", this._onNext, this).on("prev", this._onPrev, this);
            var c = b.plugins.get(f, a);
            c ? this._setupTimerPluginListener(c) : this._pluginsListeners = b.plugins.events.group().on("add", function(a) {
                a.get("name") === f && (this._setupTimerPluginListener(), this._pluginsListeners.offAll())
            }, this)
        },
        _setupTimerPluginListener: function(a) {
            if (!a) {
                b.plugins.get(f, this._shower)
            }
            a.events.on("next", this._onNext, this, 100)
        },
        _clearListeners: function() {
            this._showerListeners.offAll(), this._playerListeners.offAll(), this._pluginsListeners && this._pluginsListeners.offAll()
        },
        _getElements: function() {
            var a = this._shower.player.getCurrentSlide().layout,
                b = a.getElement();
            return Array.prototype.slice.call(b.querySelectorAll(this._elementsSelector))
        },
        _onNext: function(a) {
            var b = this._elements.length,
                c = this._shower.container.isSlideMode();
            c && b && this._innerComplete < b && (a.preventDefault(), this.next())
        },
        _onPrev: function(a) {
            var b = this._elements.length,
                c = (this._shower.container.isSlideMode(), this._innerComplete);
            b && b > c && c > 0 && (a.preventDefault(), this.prev())
        },
        _go: function() {
            for (var a = 0, b = this._elements.length; b > a; a++) {
                var c = this._elements[a];
                a < this._innerComplete ? c.classList.add("active") : c.classList.remove("active")
            }
        },
        _onSlideActivate: function() {
            this._elements = this._getElements(), this._innerComplete = this._getInnerComplete()
        },
        _getInnerComplete: function() {
            return this._elements.filter(function(a) {
                return a.classList.contains("active")
            }).length
        }
    }), a(e)
}), shower.modules.require(["shower"], function(a) {
    a.plugins.add("shower-next")
}), shower.modules.define("shower-progress", ["util.extend"], function(a, b) {
    function c(a, b) {
        b = b || {}, this._shower = a, this._playerListeners = null, this._element = null, this._elementSelector = b.selector || ".progress";
        var c = this._shower.container.getElement();
        this._element = c.querySelector(this._elementSelector),
            this._element && (this._setupListeners(), this._element.setAttribute("role", "progressbar"), this._element.setAttribute("aria-valuemin", "0"), this._element.setAttribute("aria-valuemax", "100"), this.updateProgress())
    }
    b(c.prototype, {
        destroy: function() {
            this._clearListeners(), this._shower = null
        },
        updateProgress: function() {
            var a = this._shower.getSlidesCount(),
                b = this._shower.player.getCurrentSlideIndex(),
                c = 100 / (a - 1) * b;
            this._element && (this._element.style.width = c.toFixed(2) + "%", this._element.setAttribute("aria-valuenow", c.toFixed()), this._element.setAttribute("aria-valuetext", "Slideshow Progress: " + c.toFixed() + "%"))
        },
        _setupListeners: function() {
            var a = this._shower;
            this._showerListeners = a.events.group().on("destroy", this.destroy, this), this._playerListeners = a.player.events.group().on("activate", this._onSlideChange, this)
        },
        _clearListeners: function() {
            this._showerListeners && this._showerListeners.offAll(), this._playerListeners && this._playerListeners.offAll()
        },
        _onSlideChange: function() {
            this.updateProgress()
        }
    }), a(c)
}), shower.modules.require(["shower"], function(a) {
    a.plugins.add("shower-progress")
}), shower.modules.define("shower-timer", ["shower", "Emitter", "util.extend"], function(a, b, c, d) {
    function e(a) {
        this.events = new c, this._shower = a, this._timer = null, this._showerListeners = null, this._playerListeners = null, this._pluginsListeners = null, this._setupListeners()
    }
    var f = "shower-next";
    d(e.prototype, {
        destroy: function() {
            this._clearTimer(), this._clearListeners(), this._shower = null
        },
        run: function(a) {
            this._initTimer(a)
        },
        stop: function() {
            this._clearTimer()
        },
        _setupListeners: function() {
            var a = this._shower;
            this.events.on("next", this._onNext, this), this._showerListeners = a.events.group().on("destroy", this.destroy, this), this._playerListeners = a.player.events.group().on("keydown", this._clearTimer, this).on("activate", this._onSlideActivate, this), this._nextPlugin = b.plugins.get(f, a), this._nextPlugin || (this._pluginsListeners = a.plugins.events.group().on("pluginadd", function(b) {
                b.get("name") === f && (this._nextPlugin = a.plugins.get(f), this._pluginsListeners.offAll())
            }, this)), -1 != a.player.getCurrentSlideIndex() && this._onSlideActivate()
        },
        _clearListeners: function() {
            this._showerListeners.offAll(), this._playerListeners.offAll()
        },
        _onSlideActivate: function() {
            this._clearTimer();
            var a = this._shower.player.getCurrentSlide();
            if (this._shower.container.isSlideMode() && a.state.get("visited") < 2) {
                var b = a.layout.getData("timing");
                b && /^(\d{1,2}:)?\d{1,3}$/.test(b) && (-1 !== b.indexOf(":") ? (b = b.split(":"), b = 1e3 * (60 * parseInt(b[0], 10) + parseInt(b[1], 10))) : b = 1e3 * parseInt(b, 10), 0 !== b && this._initTimer(b))
            }
        },
        _initTimer: function(a) {
            var b = this.events,
                c = (this._shower, this._nextPlugin);
            c && c.getLength() && c.getLength() != c.getComplete() && (a /= c.getLength() + 1), this._timer = setInterval(function() {
                b.emit("next")
            }, a)
        },
        _clearTimer: function() {
            this._timer && (clearInterval(this._timer), this._timer = null)
        },
        _onNext: function() {
            this._clearTimer(), this._shower.player.next()
        }
    }), a(e)
}), shower.modules.require(["shower"], function(a) {
    a.plugins.add("shower-timer")
}), shower.modules.define("shower-touch", ["util.extend"], function(a, b) {
    function c(a, b) {
        b = b || {}, this._shower = a, this._setupListeners()
    }
    var d = ["VIDEO", "AUDIO", "A", "BUTTON", "INPUT"];
    b(c.prototype, {
        destroy: function() {
            this._clearListeners(), this._shower = null
        },
        _setupListeners: function() {
            var a = this._shower;
            this._showerListeners = a.events.group().on("add", this._onSlideAdd, this), this._bindedTouchStart = this._onTouchStart.bind(this), this._bindedTouchMove = this._onTouchMove.bind(this), this._shower.getSlides().forEach(this._addTouchStartListener, this), document.addEventListener("touchmove", this._bindedTouchMove, !0)
        },
        _clearListeners: function() {
            this._showerListeners.offAll(), this._shower.getSlides().forEach(this._removeTouchStartListener, this), document.removeEventListener("touchmove", this._bindedTouchMove, !1)
        },
        _onSlideAdd: function(a) {
            var b = a.get("slide");
            this._addTouchStartListener(b)
        },
        _addTouchStartListener: function(a) {
            var b = a.layout.getElement();
            b.addEventListener("touchstart", this._bindedTouchStart, !1)
        },
        _removeTouchStartListener: function(a) {
            var b = a.layout.getElement();
            b.removeEventListener("touchstart", this._bindedTouchStart, !1)
        },
        _onTouchStart: function(a) {
            var b, c = this._shower,
                d = c.container.isSlideMode(),
                e = a.target,
                f = this._getSlideByElement(a.currentTarget);
            f && (d && !this._isInteractiveElement(e) && (a.preventDefault(), b = a.touches[0].pageX, b > window.innerWidth / 2 ? c.player.next() : c.player.prev()), d || f.activate())
        },
        _onTouchMove: function(a) {
            this._shower.container.isSlideMode() && a.preventDefault()
        },
        _getSlideByElement: function(a) {
            for (var b = this._shower.getSlides(), c = null, d = 0, e = b.length; e > d; d++)
                if (a.id === b[d].getId()) {
                    c = this._shower.get(d);
                    break
                }
            return c
        },
        _isInteractiveElement: function(a) {
            return d.some(function(b) {
                return b === a.tagName
            })
        }
    }), a(c)
}), shower.modules.require(["shower"], function(a) {
    a.plugins.add("shower-touch")
});