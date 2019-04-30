! function t(e, n, o) {
    function i(a, s) {
        if (!n[a]) {
            if (!e[a]) {
                var u = "function" == typeof require && require;
                if (!s && u) return u(a, !0);
                if (r) return r(a, !0);
                var l = new Error("Cannot find module '" + a + "'");
                throw l.code = "MODULE_NOT_FOUND", l
            }
            var c = n[a] = {
                exports: {}
            };
            e[a][0].call(c.exports, function(t) {
                var n = e[a][1][t];
                return i(n || t)
            }, c, c.exports, t, e, n, o)
        }
        return n[a].exports
    }
    for (var r = "function" == typeof require && require, a = 0; a < o.length; a++) i(o[a]);
    return i
}({
    1: [function(t, e, n) {
        e.exports = t(3), e.exports.color = t(2)
    }, {
        2: 2,
        3: 3
    }],
    2: [function(t, e, n) {
        var o = e.exports = o || {};
        o.color = o.color || {}, o.utils = o.utils || {}, o.utils.common = function() {
            var t = Array.prototype.forEach,
                e = Array.prototype.slice;
            return {
                BREAK: {},
                extend: function(t) {
                    return this.each(e.call(arguments, 1), function(e) {
                        for (var n in e) this.isUndefined(e[n]) || (t[n] = e[n])
                    }, this), t
                },
                defaults: function(t) {
                    return this.each(e.call(arguments, 1), function(e) {
                        for (var n in e) this.isUndefined(t[n]) && (t[n] = e[n])
                    }, this), t
                },
                compose: function() {
                    var t = e.call(arguments);
                    return function() {
                        for (var n = e.call(arguments), o = t.length - 1; o >= 0; o--) n = [t[o].apply(this, n)];
                        return n[0]
                    }
                },
                each: function(e, n, o) {
                    if (t && e.forEach === t) e.forEach(n, o);
                    else if (e.length === e.length + 0) {
                        for (var i = 0, r = e.length; i < r; i++)
                            if (i in e && n.call(o, e[i], i) === this.BREAK) return
                    } else
                        for (var i in e)
                            if (n.call(o, e[i], i) === this.BREAK) return
                },
                defer: function(t) {
                    setTimeout(t, 0)
                },
                toArray: function(t) {
                    return t.toArray ? t.toArray() : e.call(t)
                },
                isUndefined: function(t) {
                    return void 0 === t
                },
                isNull: function(t) {
                    return null === t
                },
                isNaN: function(t) {
                    return t !== t
                },
                isArray: Array.isArray || function(t) {
                    return t.constructor === Array
                },
                isObject: function(t) {
                    return t === Object(t)
                },
                isNumber: function(t) {
                    return t === t + 0
                },
                isString: function(t) {
                    return t === t + ""
                },
                isBoolean: function(t) {
                    return !1 === t || !0 === t
                },
                isFunction: function(t) {
                    return "[object Function]" === Object.prototype.toString.call(t)
                }
            }
        }(), o.color.toString = function(t) {
            return function(e) {
                if (1 == e.a || t.isUndefined(e.a)) {
                    for (var n = e.hex.toString(16); n.length < 6;) n = "0" + n;
                    return "#" + n
                }
                return "rgba(" + Math.round(e.r) + "," + Math.round(e.g) + "," + Math.round(e.b) + "," + e.a + ")"
            }
        }(o.utils.common), o.Color = o.color.Color = function(t, e, n, o) {
            function i(t, e, n) {
                Object.defineProperty(t, e, {
                    get: function() {
                        return "RGB" === this.__state.space ? this.__state[e] : (a(this, e, n), this.__state[e])
                    },
                    set: function(t) {
                        "RGB" !== this.__state.space && (a(this, e, n), this.__state.space = "RGB"), this.__state[e] = t
                    }
                })
            }

            function r(t, e) {
                Object.defineProperty(t, e, {
                    get: function() {
                        return "HSV" === this.__state.space ? this.__state[e] : (s(this), this.__state[e])
                    },
                    set: function(t) {
                        "HSV" !== this.__state.space && (s(this), this.__state.space = "HSV"), this.__state[e] = t
                    }
                })
            }

            function a(t, n, i) {
                if ("HEX" === t.__state.space) t.__state[n] = e.component_from_hex(t.__state.hex, i);
                else {
                    if ("HSV" !== t.__state.space) throw "Corrupted color state";
                    o.extend(t.__state, e.hsv_to_rgb(t.__state.h, t.__state.s, t.__state.v))
                }
            }

            function s(t) {
                var n = e.rgb_to_hsv(t.r, t.g, t.b);
                o.extend(t.__state, {
                    s: n.s,
                    v: n.v
                }), o.isNaN(n.h) ? o.isUndefined(t.__state.h) && (t.__state.h = 0) : t.__state.h = n.h
            }
            var u = function() {
                if (this.__state = t.apply(this, arguments), !1 === this.__state) throw "Failed to interpret color arguments";
                this.__state.a = this.__state.a || 1
            };
            return u.COMPONENTS = ["r", "g", "b", "h", "s", "v", "hex", "a"], o.extend(u.prototype, {
                toString: function() {
                    return n(this)
                },
                toOriginal: function() {
                    return this.__state.conversion.write(this)
                }
            }), i(u.prototype, "r", 2), i(u.prototype, "g", 1), i(u.prototype, "b", 0), r(u.prototype, "h"), r(u.prototype, "s"), r(u.prototype, "v"), Object.defineProperty(u.prototype, "a", {
                get: function() {
                    return this.__state.a
                },
                set: function(t) {
                    this.__state.a = t
                }
            }), Object.defineProperty(u.prototype, "hex", {
                get: function() {
                    return "HEX" !== !this.__state.space && (this.__state.hex = e.rgb_to_hex(this.r, this.g, this.b)), this.__state.hex
                },
                set: function(t) {
                    this.__state.space = "HEX", this.__state.hex = t
                }
            }), u
        }(o.color.interpret = function(t, e) {
            var n, o, i = function() {
                    o = !1;
                    var t = arguments.length > 1 ? e.toArray(arguments) : arguments[0];
                    return e.each(r, function(i) {
                        if (i.litmus(t)) return e.each(i.conversions, function(i, r) {
                            if (n = i.read(t), !1 === o && !1 !== n) return o = n, n.conversionName = r, n.conversion = i, e.BREAK
                        }), e.BREAK
                    }), o
                },
                r = [{
                    litmus: e.isString,
                    conversions: {
                        THREE_CHAR_HEX: {
                            read: function(t) {
                                var e = t.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
                                return null !== e && {
                                    space: "HEX",
                                    hex: parseInt("0x" + e[1].toString() + e[1].toString() + e[2].toString() + e[2].toString() + e[3].toString() + e[3].toString())
                                }
                            },
                            write: t
                        },
                        SIX_CHAR_HEX: {
                            read: function(t) {
                                var e = t.match(/^#([A-F0-9]{6})$/i);
                                return null !== e && {
                                    space: "HEX",
                                    hex: parseInt("0x" + e[1].toString())
                                }
                            },
                            write: t
                        },
                        CSS_RGB: {
                            read: function(t) {
                                var e = t.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
                                return null !== e && {
                                    space: "RGB",
                                    r: parseFloat(e[1]),
                                    g: parseFloat(e[2]),
                                    b: parseFloat(e[3])
                                }
                            },
                            write: t
                        },
                        CSS_RGBA: {
                            read: function(t) {
                                var e = t.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\,\s*(.+)\s*\)/);
                                return null !== e && {
                                    space: "RGB",
                                    r: parseFloat(e[1]),
                                    g: parseFloat(e[2]),
                                    b: parseFloat(e[3]),
                                    a: parseFloat(e[4])
                                }
                            },
                            write: t
                        }
                    }
                }, {
                    litmus: e.isNumber,
                    conversions: {
                        HEX: {
                            read: function(t) {
                                return {
                                    space: "HEX",
                                    hex: t,
                                    conversionName: "HEX"
                                }
                            },
                            write: function(t) {
                                return t.hex
                            }
                        }
                    }
                }, {
                    litmus: e.isArray,
                    conversions: {
                        RGB_ARRAY: {
                            read: function(t) {
                                return 3 == t.length && {
                                    space: "RGB",
                                    r: t[0],
                                    g: t[1],
                                    b: t[2]
                                }
                            },
                            write: function(t) {
                                return [t.r, t.g, t.b]
                            }
                        },
                        RGBA_ARRAY: {
                            read: function(t) {
                                return 4 == t.length && {
                                    space: "RGB",
                                    r: t[0],
                                    g: t[1],
                                    b: t[2],
                                    a: t[3]
                                }
                            },
                            write: function(t) {
                                return [t.r, t.g, t.b, t.a]
                            }
                        }
                    }
                }, {
                    litmus: e.isObject,
                    conversions: {
                        RGBA_OBJ: {
                            read: function(t) {
                                return !!(e.isNumber(t.r) && e.isNumber(t.g) && e.isNumber(t.b) && e.isNumber(t.a)) && {
                                    space: "RGB",
                                    r: t.r,
                                    g: t.g,
                                    b: t.b,
                                    a: t.a
                                }
                            },
                            write: function(t) {
                                return {
                                    r: t.r,
                                    g: t.g,
                                    b: t.b,
                                    a: t.a
                                }
                            }
                        },
                        RGB_OBJ: {
                            read: function(t) {
                                return !!(e.isNumber(t.r) && e.isNumber(t.g) && e.isNumber(t.b)) && {
                                    space: "RGB",
                                    r: t.r,
                                    g: t.g,
                                    b: t.b
                                }
                            },
                            write: function(t) {
                                return {
                                    r: t.r,
                                    g: t.g,
                                    b: t.b
                                }
                            }
                        },
                        HSVA_OBJ: {
                            read: function(t) {
                                return !!(e.isNumber(t.h) && e.isNumber(t.s) && e.isNumber(t.v) && e.isNumber(t.a)) && {
                                    space: "HSV",
                                    h: t.h,
                                    s: t.s,
                                    v: t.v,
                                    a: t.a
                                }
                            },
                            write: function(t) {
                                return {
                                    h: t.h,
                                    s: t.s,
                                    v: t.v,
                                    a: t.a
                                }
                            }
                        },
                        HSV_OBJ: {
                            read: function(t) {
                                return !!(e.isNumber(t.h) && e.isNumber(t.s) && e.isNumber(t.v)) && {
                                    space: "HSV",
                                    h: t.h,
                                    s: t.s,
                                    v: t.v
                                }
                            },
                            write: function(t) {
                                return {
                                    h: t.h,
                                    s: t.s,
                                    v: t.v
                                }
                            }
                        }
                    }
                }];
            return i
        }(o.color.toString, o.utils.common), o.color.math = function() {
            var t;
            return {
                hsv_to_rgb: function(t, e, n) {
                    var o = Math.floor(t / 60) % 6,
                        i = t / 60 - Math.floor(t / 60),
                        r = n * (1 - e),
                        a = n * (1 - i * e),
                        s = n * (1 - (1 - i) * e),
                        u = [
                            [n, s, r],
                            [a, n, r],
                            [r, n, s],
                            [r, a, n],
                            [s, r, n],
                            [n, r, a]
                        ][o];
                    return {
                        r: 255 * u[0],
                        g: 255 * u[1],
                        b: 255 * u[2]
                    }
                },
                rgb_to_hsv: function(t, e, n) {
                    var o, i, r = Math.min(t, e, n),
                        a = Math.max(t, e, n),
                        s = a - r;
                    return 0 == a ? {
                        h: NaN,
                        s: 0,
                        v: 0
                    } : (i = s / a, o = t == a ? (e - n) / s : e == a ? 2 + (n - t) / s : 4 + (t - e) / s, o /= 6, o < 0 && (o += 1), {
                        h: 360 * o,
                        s: i,
                        v: a / 255
                    })
                },
                rgb_to_hex: function(t, e, n) {
                    var o = this.hex_with_component(0, 2, t);
                    return o = this.hex_with_component(o, 1, e), o = this.hex_with_component(o, 0, n)
                },
                component_from_hex: function(t, e) {
                    return t >> 8 * e & 255
                },
                hex_with_component: function(e, n, o) {
                    return o << (t = 8 * n) | e & ~(255 << t)
                }
            }
        }(), o.color.toString, o.utils.common)
    }, {}],
    3: [function(t, e, n) {
        var o = e.exports = o || {};
        o.gui = o.gui || {}, o.utils = o.utils || {}, o.controllers = o.controllers || {}, o.dom = o.dom || {}, o.color = o.color || {}, o.utils.css = function() {
            return {
                load: function(t, e) {
                    e = e || document;
                    var n = e.createElement("link");
                    n.type = "text/css", n.rel = "stylesheet", n.href = t, e.getElementsByTagName("head")[0].appendChild(n)
                },
                inject: function(t, e) {
                    e = e || document;
                    var n = document.createElement("style");
                    n.type = "text/css", n.innerHTML = t, e.getElementsByTagName("head")[0].appendChild(n)
                }
            }
        }(), o.utils.common = function() {
            var t = Array.prototype.forEach,
                e = Array.prototype.slice;
            return {
                BREAK: {},
                extend: function(t) {
                    return this.each(e.call(arguments, 1), function(e) {
                        for (var n in e) this.isUndefined(e[n]) || (t[n] = e[n])
                    }, this), t
                },
                defaults: function(t) {
                    return this.each(e.call(arguments, 1), function(e) {
                        for (var n in e) this.isUndefined(t[n]) && (t[n] = e[n])
                    }, this), t
                },
                compose: function() {
                    var t = e.call(arguments);
                    return function() {
                        for (var n = e.call(arguments), o = t.length - 1; o >= 0; o--) n = [t[o].apply(this, n)];
                        return n[0]
                    }
                },
                each: function(e, n, o) {
                    if (t && e.forEach === t) e.forEach(n, o);
                    else if (e.length === e.length + 0) {
                        for (var i = 0, r = e.length; i < r; i++)
                            if (i in e && n.call(o, e[i], i) === this.BREAK) return
                    } else
                        for (var i in e)
                            if (n.call(o, e[i], i) === this.BREAK) return
                },
                defer: function(t) {
                    setTimeout(t, 0)
                },
                toArray: function(t) {
                    return t.toArray ? t.toArray() : e.call(t)
                },
                isUndefined: function(t) {
                    return void 0 === t
                },
                isNull: function(t) {
                    return null === t
                },
                isNaN: function(t) {
                    return t !== t
                },
                isArray: Array.isArray || function(t) {
                    return t.constructor === Array
                },
                isObject: function(t) {
                    return t === Object(t)
                },
                isNumber: function(t) {
                    return t === t + 0
                },
                isString: function(t) {
                    return t === t + ""
                },
                isBoolean: function(t) {
                    return !1 === t || !0 === t
                },
                isFunction: function(t) {
                    return "[object Function]" === Object.prototype.toString.call(t)
                }
            }
        }(), o.controllers.Controller = function(t) {
            var e = function(t, e) {
                this.initialValue = t[e], this.domElement = document.createElement("div"), this.object = t, this.property = e, this.__onChange = void 0, this.__onFinishChange = void 0
            };
            return t.extend(e.prototype, {
                onChange: function(t) {
                    return this.__onChange = t, this
                },
                onFinishChange: function(t) {
                    return this.__onFinishChange = t, this
                },
                setValue: function(t) {
                    return this.object[this.property] = t, this.__onChange && this.__onChange.call(this, t), this.updateDisplay(), this
                },
                getValue: function() {
                    return this.object[this.property]
                },
                updateDisplay: function() {
                    return this
                },
                isModified: function() {
                    return this.initialValue !== this.getValue()
                }
            }), e
        }(o.utils.common), o.dom.dom = function(t) {
            function e(e) {
                if ("0" === e || t.isUndefined(e)) return 0;
                var n = e.match(i);
                return t.isNull(n) ? 0 : parseFloat(n[1])
            }
            var n = {
                    HTMLEvents: ["change"],
                    MouseEvents: ["click", "mousemove", "mousedown", "mouseup", "mouseover"],
                    KeyboardEvents: ["keydown"]
                },
                o = {};
            t.each(n, function(e, n) {
                t.each(e, function(t) {
                    o[t] = n
                })
            });
            var i = /(\d+(\.\d+)?)px/,
                r = {
                    makeSelectable: function(t, e) {
                        void 0 !== t && void 0 !== t.style && (t.onselectstart = e ? function() {
                            return !1
                        } : function() {}, t.style.MozUserSelect = e ? "auto" : "none", t.style.KhtmlUserSelect = e ? "auto" : "none", t.unselectable = e ? "on" : "off")
                    },
                    makeFullscreen: function(e, n, o) {
                        t.isUndefined(n) && (n = !0), t.isUndefined(o) && (o = !0), e.style.position = "absolute", n && (e.style.left = 0, e.style.right = 0), o && (e.style.top = 0, e.style.bottom = 0)
                    },
                    fakeEvent: function(e, n, i, r) {
                        i = i || {};
                        var a = o[n];
                        if (!a) throw new Error("Event type " + n + " not supported.");
                        var s = document.createEvent(a);
                        switch (a) {
                            case "MouseEvents":
                                var u = i.x || i.clientX || 0,
                                    l = i.y || i.clientY || 0;
                                s.initMouseEvent(n, i.bubbles || !1, i.cancelable || !0, window, i.clickCount || 1, 0, 0, u, l, !1, !1, !1, !1, 0, null);
                                break;
                            case "KeyboardEvents":
                                var c = s.initKeyboardEvent || s.initKeyEvent;
                                t.defaults(i, {
                                    cancelable: !0,
                                    ctrlKey: !1,
                                    altKey: !1,
                                    shiftKey: !1,
                                    metaKey: !1,
                                    keyCode: void 0,
                                    charCode: void 0
                                }), c(n, i.bubbles || !1, i.cancelable, window, i.ctrlKey, i.altKey, i.shiftKey, i.metaKey, i.keyCode, i.charCode);
                                break;
                            default:
                                s.initEvent(n, i.bubbles || !1, i.cancelable || !0)
                        }
                        t.defaults(s, r), e.dispatchEvent(s)
                    },
                    bind: function(t, e, n, o) {
                        return o = o || !1, t.addEventListener ? t.addEventListener(e, n, o) : t.attachEvent && t.attachEvent("on" + e, n), r
                    },
                    unbind: function(t, e, n, o) {
                        return o = o || !1, t.removeEventListener ? t.removeEventListener(e, n, o) : t.detachEvent && t.detachEvent("on" + e, n), r
                    },
                    addClass: function(t, e) {
                        if (void 0 === t.className) t.className = e;
                        else if (t.className !== e) {
                            var n = t.className.split(/ +/); - 1 == n.indexOf(e) && (n.push(e), t.className = n.join(" ").replace(/^\s+/, "").replace(/\s+$/, ""))
                        }
                        return r
                    },
                    removeClass: function(t, e) {
                        if (e)
                            if (void 0 === t.className);
                            else if (t.className === e) t.removeAttribute("class");
                        else {
                            var n = t.className.split(/ +/),
                                o = n.indexOf(e); - 1 != o && (n.splice(o, 1), t.className = n.join(" "))
                        } else t.className = void 0;
                        return r
                    },
                    hasClass: function(t, e) {
                        return new RegExp("(?:^|\\s+)" + e + "(?:\\s+|$)").test(t.className) || !1
                    },
                    getWidth: function(t) {
                        var n = getComputedStyle(t);
                        return e(n["border-left-width"]) + e(n["border-right-width"]) + e(n["padding-left"]) + e(n["padding-right"]) + e(n.width)
                    },
                    getHeight: function(t) {
                        var n = getComputedStyle(t);
                        return e(n["border-top-width"]) + e(n["border-bottom-width"]) + e(n["padding-top"]) + e(n["padding-bottom"]) + e(n.height)
                    },
                    getOffset: function(t) {
                        var e = {
                            left: 0,
                            top: 0
                        };
                        if (t.offsetParent)
                            do {
                                e.left += t.offsetLeft, e.top += t.offsetTop
                            } while (t = t.offsetParent);
                        return e
                    },
                    isActive: function(t) {
                        return t === document.activeElement && (t.type || t.href)
                    }
                };
            return r
        }(o.utils.common), o.controllers.OptionController = function(t, e, n) {
            var o = function(t, i, r) {
                o.superclass.call(this, t, i);
                var a = this;
                if (this.__select = document.createElement("select"), n.isArray(r)) {
                    var s = {};
                    n.each(r, function(t) {
                        s[t] = t
                    }), r = s
                }
                n.each(r, function(t, e) {
                    var n = document.createElement("option");
                    n.innerHTML = e, n.setAttribute("value", t), a.__select.appendChild(n)
                }), this.updateDisplay(), e.bind(this.__select, "change", function() {
                    var t = this.options[this.selectedIndex].value;
                    a.setValue(t)
                }), this.domElement.appendChild(this.__select)
            };
            return o.superclass = t, n.extend(o.prototype, t.prototype, {
                setValue: function(t) {
                    var e = o.superclass.prototype.setValue.call(this, t);
                    return this.__onFinishChange && this.__onFinishChange.call(this, this.getValue()), e
                },
                updateDisplay: function() {
                    return this.__select.value = this.getValue(), o.superclass.prototype.updateDisplay.call(this)
                }
            }), o
        }(o.controllers.Controller, o.dom.dom, o.utils.common), o.controllers.NumberController = function(t, e) {
            function n(t) {
                return t = t.toString(), t.indexOf(".") > -1 ? t.length - t.indexOf(".") - 1 : 0
            }
            var o = function(t, i, r) {
                o.superclass.call(this, t, i), r = r || {}, this.__min = r.min, this.__max = r.max, this.__step = r.step, e.isUndefined(this.__step) ? 0 == this.initialValue ? this.__impliedStep = 1 : this.__impliedStep = Math.pow(10, Math.floor(Math.log(this.initialValue) / Math.LN10)) / 10 : this.__impliedStep = this.__step, this.__precision = n(this.__impliedStep)
            };
            return o.superclass = t, e.extend(o.prototype, t.prototype, {
                setValue: function(t) {
                    return void 0 !== this.__min && t < this.__min ? t = this.__min : void 0 !== this.__max && t > this.__max && (t = this.__max), void 0 !== this.__step && t % this.__step != 0 && (t = Math.round(t / this.__step) * this.__step), o.superclass.prototype.setValue.call(this, t)
                },
                min: function(t) {
                    return this.__min = t, this
                },
                max: function(t) {
                    return this.__max = t, this
                },
                step: function(t) {
                    return this.__step = t, this
                }
            }), o
        }(o.controllers.Controller, o.utils.common), o.controllers.NumberControllerBox = function(t, e, n) {
            function o(t, e) {
                var n = Math.pow(10, e);
                return Math.round(t * n) / n
            }
            var i = function(t, o, r) {
                function a() {
                    var t = parseFloat(h.__input.value);
                    n.isNaN(t) || h.setValue(t)
                }

                function s() {
                    a(), h.__onFinishChange && h.__onFinishChange.call(h, h.getValue())
                }

                function u(t) {
                    e.bind(window, "mousemove", l), e.bind(window, "mouseup", c), d = t.clientY
                }

                function l(t) {
                    var e = d - t.clientY;
                    h.setValue(h.getValue() + e * h.__impliedStep), d = t.clientY
                }

                function c() {
                    e.unbind(window, "mousemove", l), e.unbind(window, "mouseup", c)
                }
                this.__truncationSuspended = !1, i.superclass.call(this, t, o, r);
                var d, h = this;
                this.__input = document.createElement("input"), this.__input.setAttribute("type", "text"), e.bind(this.__input, "change", a), e.bind(this.__input, "blur", s), e.bind(this.__input, "mousedown", u), e.bind(this.__input, "keydown", function(t) {
                    13 === t.keyCode && (h.__truncationSuspended = !0, this.blur(), h.__truncationSuspended = !1)
                }), this.updateDisplay(), this.domElement.appendChild(this.__input)
            };
            return i.superclass = t, n.extend(i.prototype, t.prototype, {
                updateDisplay: function() {
                    return this.__input.value = this.__truncationSuspended ? this.getValue() : o(this.getValue(), this.__precision), i.superclass.prototype.updateDisplay.call(this)
                }
            }), i
        }(o.controllers.NumberController, o.dom.dom, o.utils.common), o.controllers.NumberControllerSlider = function(t, e, n, o, i) {
            function r(t, e, n, o, i) {
                return o + (t - e) / (n - e) * (i - o)
            }
            var a = function(t, n, o, i, s) {
                function u(t) {
                    e.bind(window, "mousemove", l), e.bind(window, "mouseup", c), l(t)
                }

                function l(t) {
                    t.preventDefault();
                    var n = e.getOffset(d.__background),
                        o = e.getWidth(d.__background);
                    return d.setValue(r(t.clientX, n.left, n.left + o, d.__min, d.__max)), !1
                }

                function c() {
                    e.unbind(window, "mousemove", l), e.unbind(window, "mouseup", c), d.__onFinishChange && d.__onFinishChange.call(d, d.getValue())
                }
                a.superclass.call(this, t, n, {
                    min: o,
                    max: i,
                    step: s
                });
                var d = this;
                this.__background = document.createElement("div"), this.__foreground = document.createElement("div"), e.bind(this.__background, "mousedown", u), e.addClass(this.__background, "slider"), e.addClass(this.__foreground, "slider-fg"), this.updateDisplay(), this.__background.appendChild(this.__foreground), this.domElement.appendChild(this.__background)
            };
            return a.superclass = t, a.useDefaultStyles = function() {
                n.inject(".slider {\n  box-shadow: inset 0 2px 4px rgba(0,0,0,0.15);\n  height: 1em;\n  border-radius: 1em;\n  background-color: #eee;\n  padding: 0 0.5em;\n  overflow: hidden;\n}\n\n.slider-fg {\n  padding: 1px 0 2px 0;\n  background-color: #aaa;\n  height: 1em;\n  margin-left: -0.5em;\n  padding-right: 0.5em;\n  border-radius: 1em 0 0 1em;\n}\n\n.slider-fg:after {\n  display: inline-block;\n  border-radius: 1em;\n  background-color: #fff;\n  border:  1px solid #aaa;\n  content: '';\n  float: right;\n  margin-right: -1em;\n  margin-top: -1px;\n  height: 0.9em;\n  width: 0.9em;\n}")
            }, o.extend(a.prototype, t.prototype, {
                updateDisplay: function() {
                    var t = (this.getValue() - this.__min) / (this.__max - this.__min);
                    return this.__foreground.style.width = 100 * t + "%", a.superclass.prototype.updateDisplay.call(this)
                }
            }), a
        }(o.controllers.NumberController, o.dom.dom, o.utils.css, o.utils.common), o.controllers.FunctionController = function(t, e, n) {
            var o = function(t, n, i) {
                o.superclass.call(this, t, n);
                var r = this;
                this.__button = document.createElement("div"), this.__button.innerHTML = void 0 === i ? "Fire" : i, e.bind(this.__button, "click", function(t) {
                    return t.preventDefault(), r.fire(), !1
                }), e.addClass(this.__button, "button"), this.domElement.appendChild(this.__button)
            };
            return o.superclass = t, n.extend(o.prototype, t.prototype, {
                fire: function() {
                    this.__onChange && this.__onChange.call(this), this.__onFinishChange && this.__onFinishChange.call(this, this.getValue()), this.getValue().call(this.object)
                }
            }), o
        }(o.controllers.Controller, o.dom.dom, o.utils.common), o.controllers.BooleanController = function(t, e, n) {
            var o = function(t, n) {
                function i() {
                    r.setValue(!r.__prev)
                }
                o.superclass.call(this, t, n);
                var r = this;
                this.__prev = this.getValue(), this.__checkbox = document.createElement("input"), this.__checkbox.setAttribute("type", "checkbox"), e.bind(this.__checkbox, "change", i, !1), this.domElement.appendChild(this.__checkbox), this.updateDisplay()
            };
            return o.superclass = t, n.extend(o.prototype, t.prototype, {
                setValue: function(t) {
                    var e = o.superclass.prototype.setValue.call(this, t);
                    return this.__onFinishChange && this.__onFinishChange.call(this, this.getValue()), this.__prev = this.getValue(), e
                },
                updateDisplay: function() {
                    return !0 === this.getValue() ? (this.__checkbox.setAttribute("checked", "checked"), this.__checkbox.checked = !0) : this.__checkbox.checked = !1, o.superclass.prototype.updateDisplay.call(this)
                }
            }), o
        }(o.controllers.Controller, o.dom.dom, o.utils.common), o.color.toString = function(t) {
            return function(e) {
                if (1 == e.a || t.isUndefined(e.a)) {
                    for (var n = e.hex.toString(16); n.length < 6;) n = "0" + n;
                    return "#" + n
                }
                return "rgba(" + Math.round(e.r) + "," + Math.round(e.g) + "," + Math.round(e.b) + "," + e.a + ")"
            }
        }(o.utils.common), o.color.interpret = function(t, e) {
            var n, o, i = function() {
                    o = !1;
                    var t = arguments.length > 1 ? e.toArray(arguments) : arguments[0];
                    return e.each(r, function(i) {
                        if (i.litmus(t)) return e.each(i.conversions, function(i, r) {
                            if (n = i.read(t), !1 === o && !1 !== n) return o = n, n.conversionName = r, n.conversion = i, e.BREAK
                        }), e.BREAK
                    }), o
                },
                r = [{
                    litmus: e.isString,
                    conversions: {
                        THREE_CHAR_HEX: {
                            read: function(t) {
                                var e = t.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
                                return null !== e && {
                                    space: "HEX",
                                    hex: parseInt("0x" + e[1].toString() + e[1].toString() + e[2].toString() + e[2].toString() + e[3].toString() + e[3].toString())
                                }
                            },
                            write: t
                        },
                        SIX_CHAR_HEX: {
                            read: function(t) {
                                var e = t.match(/^#([A-F0-9]{6})$/i);
                                return null !== e && {
                                    space: "HEX",
                                    hex: parseInt("0x" + e[1].toString())
                                }
                            },
                            write: t
                        },
                        CSS_RGB: {
                            read: function(t) {
                                var e = t.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
                                return null !== e && {
                                    space: "RGB",
                                    r: parseFloat(e[1]),
                                    g: parseFloat(e[2]),
                                    b: parseFloat(e[3])
                                }
                            },
                            write: t
                        },
                        CSS_RGBA: {
                            read: function(t) {
                                var e = t.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\,\s*(.+)\s*\)/);
                                return null !== e && {
                                    space: "RGB",
                                    r: parseFloat(e[1]),
                                    g: parseFloat(e[2]),
                                    b: parseFloat(e[3]),
                                    a: parseFloat(e[4])
                                }
                            },
                            write: t
                        }
                    }
                }, {
                    litmus: e.isNumber,
                    conversions: {
                        HEX: {
                            read: function(t) {
                                return {
                                    space: "HEX",
                                    hex: t,
                                    conversionName: "HEX"
                                }
                            },
                            write: function(t) {
                                return t.hex
                            }
                        }
                    }
                }, {
                    litmus: e.isArray,
                    conversions: {
                        RGB_ARRAY: {
                            read: function(t) {
                                return 3 == t.length && {
                                    space: "RGB",
                                    r: t[0],
                                    g: t[1],
                                    b: t[2]
                                }
                            },
                            write: function(t) {
                                return [t.r, t.g, t.b]
                            }
                        },
                        RGBA_ARRAY: {
                            read: function(t) {
                                return 4 == t.length && {
                                    space: "RGB",
                                    r: t[0],
                                    g: t[1],
                                    b: t[2],
                                    a: t[3]
                                }
                            },
                            write: function(t) {
                                return [t.r, t.g, t.b, t.a]
                            }
                        }
                    }
                }, {
                    litmus: e.isObject,
                    conversions: {
                        RGBA_OBJ: {
                            read: function(t) {
                                return !!(e.isNumber(t.r) && e.isNumber(t.g) && e.isNumber(t.b) && e.isNumber(t.a)) && {
                                    space: "RGB",
                                    r: t.r,
                                    g: t.g,
                                    b: t.b,
                                    a: t.a
                                }
                            },
                            write: function(t) {
                                return {
                                    r: t.r,
                                    g: t.g,
                                    b: t.b,
                                    a: t.a
                                }
                            }
                        },
                        RGB_OBJ: {
                            read: function(t) {
                                return !!(e.isNumber(t.r) && e.isNumber(t.g) && e.isNumber(t.b)) && {
                                    space: "RGB",
                                    r: t.r,
                                    g: t.g,
                                    b: t.b
                                }
                            },
                            write: function(t) {
                                return {
                                    r: t.r,
                                    g: t.g,
                                    b: t.b
                                }
                            }
                        },
                        HSVA_OBJ: {
                            read: function(t) {
                                return !!(e.isNumber(t.h) && e.isNumber(t.s) && e.isNumber(t.v) && e.isNumber(t.a)) && {
                                    space: "HSV",
                                    h: t.h,
                                    s: t.s,
                                    v: t.v,
                                    a: t.a
                                }
                            },
                            write: function(t) {
                                return {
                                    h: t.h,
                                    s: t.s,
                                    v: t.v,
                                    a: t.a
                                }
                            }
                        },
                        HSV_OBJ: {
                            read: function(t) {
                                return !!(e.isNumber(t.h) && e.isNumber(t.s) && e.isNumber(t.v)) && {
                                    space: "HSV",
                                    h: t.h,
                                    s: t.s,
                                    v: t.v
                                }
                            },
                            write: function(t) {
                                return {
                                    h: t.h,
                                    s: t.s,
                                    v: t.v
                                }
                            }
                        }
                    }
                }];
            return i
        }(o.color.toString, o.utils.common), o.GUI = o.gui.GUI = function(t, e, n, o, i, r, a, s, u, l, c, d, h, p, f) {
            function m(t, e, n, r) {
                if (void 0 === e[n]) throw new Error("Object " + e + ' has no property "' + n + '"');
                var a;
                if (r.color) a = new c(e, n);
                else {
                    var s = [e, n].concat(r.factoryArgs);
                    a = o.apply(t, s)
                }
                r.before instanceof i && (r.before = r.before.__li), _(t, a), p.addClass(a.domElement, "c");
                var u = document.createElement("span");
                p.addClass(u, "property-name"), u.innerHTML = a.property;
                var l = document.createElement("div");
                l.appendChild(u), l.appendChild(a.domElement);
                var d = v(t, l, r.before);
                return p.addClass(d, N.CLASS_CONTROLLER_ROW), p.addClass(d, typeof a.getValue()), g(t, d, a), t.__controllers.push(a), a
            }

            function v(t, e, n) {
                var o = document.createElement("li");
                return e && o.appendChild(e), n ? t.__ul.insertBefore(o, params.before) : t.__ul.appendChild(o), t.onResize(), o
            }

            function g(t, e, n) {
                if (n.__li = e, n.__gui = t, f.extend(n, {
                        options: function(e) {
                            return arguments.length > 1 ? (n.remove(), m(t, n.object, n.property, {
                                before: n.__li.nextElementSibling,
                                factoryArgs: [f.toArray(arguments)]
                            })) : f.isArray(e) || f.isObject(e) ? (n.remove(), m(t, n.object, n.property, {
                                before: n.__li.nextElementSibling,
                                factoryArgs: [e]
                            })) : void 0
                        },
                        name: function(t) {
                            return n.__li.firstElementChild.firstElementChild.innerHTML = t, n
                        },
                        listen: function() {
                            return n.__gui.listen(n), n
                        },
                        remove: function() {
                            return n.__gui.remove(n), n
                        }
                    }), n instanceof u) {
                    var o = new s(n.object, n.property, {
                        min: n.__min,
                        max: n.__max,
                        step: n.__step
                    });
                    f.each(["updateDisplay", "onChange", "onFinishChange"], function(t) {
                        var e = n[t],
                            i = o[t];
                        n[t] = o[t] = function() {
                            var t = Array.prototype.slice.call(arguments);
                            return e.apply(n, t), i.apply(o, t)
                        }
                    }), p.addClass(e, "has-slider"), n.domElement.insertBefore(o.domElement, n.domElement.firstElementChild)
                } else if (n instanceof s) {
                    var i = function(e) {
                        return f.isNumber(n.__min) && f.isNumber(n.__max) ? (n.remove(), m(t, n.object, n.property, {
                            before: n.__li.nextElementSibling,
                            factoryArgs: [n.__min, n.__max, n.__step]
                        })) : e
                    };
                    n.min = f.compose(i, n.min), n.max = f.compose(i, n.max)
                } else n instanceof r ? (p.bind(e, "click", function() {
                    p.fakeEvent(n.__checkbox, "click")
                }), p.bind(n.__checkbox, "click", function(t) {
                    t.stopPropagation()
                })) : n instanceof a ? (p.bind(e, "click", function() {
                    p.fakeEvent(n.__button, "click")
                }), p.bind(e, "mouseover", function() {
                    p.addClass(n.__button, "hover")
                }), p.bind(e, "mouseout", function() {
                    p.removeClass(n.__button, "hover")
                })) : n instanceof c && (p.addClass(e, "color"), n.updateDisplay = f.compose(function(t) {
                    return e.style.borderLeftColor = n.__color.toString(), t
                }, n.updateDisplay), n.updateDisplay());
                n.setValue = f.compose(function(e) {
                    return t.getRoot().__preset_select && n.isModified() && I(t.getRoot(), !0), e
                }, n.setValue)
            }

            function _(t, e) {
                var n = t.getRoot(),
                    o = n.__rememberedObjects.indexOf(e.object);
                if (-1 != o) {
                    var i = n.__rememberedObjectIndecesToControllers[o];
                    if (void 0 === i && (i = {}, n.__rememberedObjectIndecesToControllers[o] = i), i[e.property] = e, n.load && n.load.remembered) {
                        var r, a = n.load.remembered;
                        if (a[t.preset]) r = a[t.preset];
                        else {
                            if (!a[R]) return;
                            r = a[R]
                        }
                        if (r[o] && void 0 !== r[o][e.property]) {
                            var s = r[o][e.property];
                            e.initialValue = s, e.setValue(s)
                        }
                    }
                }
            }

            function x(t, e) {
                return document.location.href + "." + e
            }

            function b(t) {
                function e() {
                    l.style.display = t.useLocalStorage ? "block" : "none"
                }
                var n = t.__save_row = document.createElement("li");
                p.addClass(t.domElement, "has-save"), t.__ul.insertBefore(n, t.__ul.firstChild), p.addClass(n, "save-row");
                var o = document.createElement("span");
                o.innerHTML = "&nbsp;", p.addClass(o, "button gears");
                var i = document.createElement("span");
                i.innerHTML = "Save", p.addClass(i, "button"), p.addClass(i, "save");
                var r = document.createElement("span");
                r.innerHTML = "New", p.addClass(r, "button"), p.addClass(r, "save-as");
                var a = document.createElement("span");
                a.innerHTML = "Revert", p.addClass(a, "button"), p.addClass(a, "revert");
                var s = t.__preset_select = document.createElement("select");
                if (t.load && t.load.remembered ? f.each(t.load.remembered, function(e, n) {
                        w(t, n, n == t.preset)
                    }) : w(t, R, !1), p.bind(s, "change", function() {
                        for (var e = 0; e < t.__preset_select.length; e++) t.__preset_select[e].innerHTML = t.__preset_select[e].value;
                        t.preset = this.value
                    }), n.appendChild(s), n.appendChild(o), n.appendChild(i), n.appendChild(r), n.appendChild(a), P) {
                    var u = document.getElementById("dg-save-locally"),
                        l = document.getElementById("dg-local-explain");
                    u.style.display = "block";
                    var c = document.getElementById("dg-local-storage");
                    "true" === localStorage.getItem(x(t, "isLocal")) && c.setAttribute("checked", "checked"), e(), p.bind(c, "change", function() {
                        t.useLocalStorage = !t.useLocalStorage, e()
                    })
                }
                var d = document.getElementById("dg-new-constructor");
                p.bind(d, "keydown", function(t) {
                    !t.metaKey || 67 !== t.which && 67 != t.keyCode || A.hide()
                }), p.bind(o, "click", function() {
                    d.innerHTML = JSON.stringify(t.getSaveObject(), void 0, 2), A.show(), d.focus(), d.select()
                }), p.bind(i, "click", function() {
                    t.save()
                }), p.bind(r, "click", function() {
                    var e = prompt("Enter a new preset name.");
                    e && t.saveAs(e)
                }), p.bind(a, "click", function() {
                    t.revert()
                })
            }

            function y(t) {
                function e(e) {
                    return e.preventDefault(), i = e.clientX, p.addClass(t.__closeButton, N.CLASS_DRAG), p.bind(window, "mousemove", n), p.bind(window, "mouseup", o), !1
                }

                function n(e) {
                    return e.preventDefault(), t.width += i - e.clientX, t.onResize(), i = e.clientX, !1
                }

                function o() {
                    p.removeClass(t.__closeButton, N.CLASS_DRAG), p.unbind(window, "mousemove", n), p.unbind(window, "mouseup", o)
                }
                t.__resize_handle = document.createElement("div"), f.extend(t.__resize_handle.style, {
                    width: "6px",
                    marginLeft: "-3px",
                    height: "200px",
                    cursor: "ew-resize",
                    position: "absolute"
                });
                var i;
                p.bind(t.__resize_handle, "mousedown", e), p.bind(t.__closeButton, "mousedown", e), t.domElement.insertBefore(t.__resize_handle, t.domElement.firstElementChild)
            }

            function M(t, e) {
                t.domElement.style.width = e + "px", t.__save_row && t.autoPlace && (t.__save_row.style.width = e + "px"), t.__closeButton && (t.__closeButton.style.width = e + "px")
            }

            function S(t, e) {
                var n = {};
                return f.each(t.__rememberedObjects, function(o, i) {
                    var r = {},
                        a = t.__rememberedObjectIndecesToControllers[i];
                    f.each(a, function(t, n) {
                        r[n] = e ? t.initialValue : t.getValue()
                    }), n[i] = r
                }), n
            }

            function w(t, e, n) {
                var o = document.createElement("option");
                o.innerHTML = e, o.value = e, t.__preset_select.appendChild(o), n && (t.__preset_select.selectedIndex = t.__preset_select.length - 1)
            }

            function E(t) {
                for (var e = 0; e < t.__preset_select.length; e++) t.__preset_select[e].value == t.preset && (t.__preset_select.selectedIndex = e)
            }

            function I(t, e) {
                var n = t.__preset_select[t.__preset_select.selectedIndex];
                n.innerHTML = e ? n.value + "*" : n.value
            }

            function D(t) {
                0 != t.length && d(function() {
                    D(t)
                }), f.each(t, function(t) {
                    t.updateDisplay()
                })
            }
            t.inject(".dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity 0.1s linear;-o-transition:opacity 0.1s linear;-moz-transition:opacity 0.1s linear;transition:opacity 0.1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity 0.1s linear;-o-transition:opacity 0.1s linear;-moz-transition:opacity 0.1s linear;transition:opacity 0.1s linear;border:0;position:absolute;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-x:hidden}.dg.a.has-save ul{margin-top:27px}.dg.a.has-save ul.closed{margin-top:0}.dg.a .save-row{position:fixed;top:0;z-index:1002}.dg li{-webkit-transition:height 0.1s ease-out;-o-transition:height 0.1s ease-out;-moz-transition:height 0.1s ease-out;transition:height 0.1s ease-out}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;overflow:hidden;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li > *{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .c{float:left;width:60%}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:9px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2fa1d6}.dg .cr.number input[type=text]{color:#2fa1d6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2fa1d6}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}\n");
            var A, F, R = "Default",
                P = function() {
                    try {
                        return "localStorage" in window && null !== window.localStorage
                    } catch (t) {
                        return !1
                    }
                }(),
                T = !0,
                C = !1,
                O = [],
                N = function(t) {
                    function e() {
                        localStorage.setItem(x(n, "gui"), JSON.stringify(n.getSaveObject()))
                    }
                    var n = this;
                    this.domElement = document.createElement("div"), this.__ul = document.createElement("ul"), this.domElement.appendChild(this.__ul), p.addClass(this.domElement, "dg"), this.__folders = {}, this.__controllers = [], this.__rememberedObjects = [], this.__rememberedObjectIndecesToControllers = [], this.__listening = [], t = t || {}, t = f.defaults(t, {
                        autoPlace: !0,
                        width: N.DEFAULT_WIDTH
                    }), t = f.defaults(t, {
                        resizable: t.autoPlace,
                        hideable: t.autoPlace
                    }), f.isUndefined(t.load) ? t.load = {
                        preset: R
                    } : t.preset && (t.load.preset = t.preset), f.isUndefined(t.parent) && t.hideable && O.push(this), t.resizable = f.isUndefined(t.parent) && t.resizable, t.autoPlace && f.isUndefined(t.scrollable) && (t.scrollable = !0);
                    var o = P && "true" === localStorage.getItem(x(this, "isLocal"));
                    if (Object.defineProperties(this, {
                            parent: {
                                get: function() {
                                    return t.parent
                                }
                            },
                            scrollable: {
                                get: function() {
                                    return t.scrollable
                                }
                            },
                            autoPlace: {
                                get: function() {
                                    return t.autoPlace
                                }
                            },
                            preset: {
                                get: function() {
                                    return n.parent ? n.getRoot().preset : t.load.preset
                                },
                                set: function(e) {
                                    n.parent ? n.getRoot().preset = e : t.load.preset = e, E(this), n.revert()
                                }
                            },
                            width: {
                                get: function() {
                                    return t.width
                                },
                                set: function(e) {
                                    t.width = e, M(n, e)
                                }
                            },
                            name: {
                                get: function() {
                                    return t.name
                                },
                                set: function(e) {
                                    t.name = e, r && (r.innerHTML = t.name)
                                }
                            },
                            closed: {
                                get: function() {
                                    return t.closed
                                },
                                set: function(e) {
                                    t.closed = e, t.closed ? p.addClass(n.__ul, N.CLASS_CLOSED) : p.removeClass(n.__ul, N.CLASS_CLOSED), this.onResize(), n.__closeButton && (n.__closeButton.innerHTML = e ? N.TEXT_OPEN : N.TEXT_CLOSED)
                                }
                            },
                            load: {
                                get: function() {
                                    return t.load
                                }
                            },
                            useLocalStorage: {
                                get: function() {
                                    return o
                                },
                                set: function(t) {
                                    P && (o = t, t ? p.bind(window, "unload", e) : p.unbind(window, "unload", e), localStorage.setItem(x(n, "isLocal"), t))
                                }
                            }
                        }), f.isUndefined(t.parent)) {
                        if (t.closed = !1, p.addClass(this.domElement, N.CLASS_MAIN), p.makeSelectable(this.domElement, !1), P && o) {
                            n.useLocalStorage = !0;
                            var i = localStorage.getItem(x(this, "gui"));
                            i && (t.load = JSON.parse(i))
                        }
                        this.__closeButton = document.createElement("div"), this.__closeButton.innerHTML = N.TEXT_CLOSED, p.addClass(this.__closeButton, N.CLASS_CLOSE_BUTTON), this.domElement.appendChild(this.__closeButton), p.bind(this.__closeButton, "click", function() {
                            n.closed = !n.closed
                        })
                    } else {
                        void 0 === t.closed && (t.closed = !0);
                        var r = document.createTextNode(t.name);
                        p.addClass(r, "controller-name");
                        var a = v(n, r),
                            s = function(t) {
                                return t.preventDefault(), n.closed = !n.closed, !1
                            };
                        p.addClass(this.__ul, N.CLASS_CLOSED), p.addClass(a, "title"), p.bind(a, "click", s), t.closed || (this.closed = !1)
                    }
                    t.autoPlace && (f.isUndefined(t.parent) && (T && (F = document.createElement("div"), p.addClass(F, "dg"), p.addClass(F, N.CLASS_AUTO_PLACE_CONTAINER), document.body.appendChild(F), T = !1), F.appendChild(this.domElement), p.addClass(this.domElement, N.CLASS_AUTO_PLACE)), this.parent || M(n, t.width)), p.bind(window, "resize", function() {
                        n.onResize()
                    }), p.bind(this.__ul, "webkitTransitionEnd", function() {
                        n.onResize()
                    }), p.bind(this.__ul, "transitionend", function() {
                        n.onResize()
                    }), p.bind(this.__ul, "oTransitionEnd", function() {
                        n.onResize()
                    }), this.onResize(), t.resizable && y(this);
                    n.getRoot();
                    t.parent || function() {
                        var t = n.getRoot();
                        t.width += 1, f.defer(function() {
                            t.width -= 1
                        })
                    }()
                };
            return N.toggleHide = function() {
                C = !C, f.each(O, function(t) {
                    t.domElement.style.zIndex = C ? -999 : 999, t.domElement.style.opacity = C ? 0 : 1
                })
            }, N.CLASS_AUTO_PLACE = "a", N.CLASS_AUTO_PLACE_CONTAINER = "ac", N.CLASS_MAIN = "main", N.CLASS_CONTROLLER_ROW = "cr", N.CLASS_TOO_TALL = "taller-than-window", N.CLASS_CLOSED = "closed", N.CLASS_CLOSE_BUTTON = "close-button", N.CLASS_DRAG = "drag", N.DEFAULT_WIDTH = 245, N.TEXT_CLOSED = "Close Controls", N.TEXT_OPEN = "Open Controls", p.bind(window, "keydown", function(t) {
                "text" === document.activeElement.type || 72 !== t.which && 72 != t.keyCode || N.toggleHide()
            }, !1), f.extend(N.prototype, {
                add: function(t, e) {
                    return m(this, t, e, {
                        factoryArgs: Array.prototype.slice.call(arguments, 2)
                    })
                },
                addColor: function(t, e) {
                    return m(this, t, e, {
                        color: !0
                    })
                },
                remove: function(t) {
                    this.__ul.removeChild(t.__li), this.__controllers.slice(this.__controllers.indexOf(t), 1);
                    var e = this;
                    f.defer(function() {
                        e.onResize()
                    })
                },
                destroy: function() {
                    this.autoPlace && F.removeChild(this.domElement)
                },
                addFolder: function(t) {
                    if (void 0 !== this.__folders[t]) throw new Error('You already have a folder in this GUI by the name "' + t + '"');
                    var e = {
                        name: t,
                        parent: this
                    };
                    e.autoPlace = this.autoPlace, this.load && this.load.folders && this.load.folders[t] && (e.closed = this.load.folders[t].closed, e.load = this.load.folders[t]);
                    var n = new N(e);
                    this.__folders[t] = n;
                    var o = v(this, n.domElement);
                    return p.addClass(o, "folder"), n
                },
                open: function() {
                    this.closed = !1
                },
                close: function() {
                    this.closed = !0
                },
                onResize: function() {
                    var t = this.getRoot();
                    if (t.scrollable) {
                        var e = p.getOffset(t.__ul).top,
                            n = 0;
                        f.each(t.__ul.childNodes, function(e) {
                            t.autoPlace && e === t.__save_row || (n += p.getHeight(e))
                        }), window.innerHeight - e - 20 < n ? (p.addClass(t.domElement, N.CLASS_TOO_TALL), t.__ul.style.height = window.innerHeight - e - 20 + "px") : (p.removeClass(t.domElement, N.CLASS_TOO_TALL), t.__ul.style.height = "auto")
                    }
                    t.__resize_handle && f.defer(function() {
                        t.__resize_handle.style.height = t.__ul.offsetHeight + "px"
                    }), t.__closeButton && (t.__closeButton.style.width = t.width + "px")
                },
                remember: function() {
                    if (f.isUndefined(A) && (A = new h, A.domElement.innerHTML = '<div id="dg-save" class="dg dialogue">\n\n  Here\'s the new load parameter for your <code>GUI</code>\'s constructor:\n\n  <textarea id="dg-new-constructor"></textarea>\n\n  <div id="dg-save-locally">\n\n    <input id="dg-local-storage" type="checkbox"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id="dg-local-explain">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>\'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n      \n    </div>\n    \n  </div>\n\n</div>'), this.parent) throw new Error("You can only call remember on a top level GUI.");
                    var t = this;
                    f.each(Array.prototype.slice.call(arguments), function(e) {
                        0 == t.__rememberedObjects.length && b(t), -1 == t.__rememberedObjects.indexOf(e) && t.__rememberedObjects.push(e)
                    }), this.autoPlace && M(this, this.width)
                },
                getRoot: function() {
                    for (var t = this; t.parent;) t = t.parent;
                    return t
                },
                getSaveObject: function() {
                    var t = this.load;
                    return t.closed = this.closed, this.__rememberedObjects.length > 0 && (t.preset = this.preset, t.remembered || (t.remembered = {}), t.remembered[this.preset] = S(this)), t.folders = {}, f.each(this.__folders, function(e, n) {
                        t.folders[n] = e.getSaveObject()
                    }), t
                },
                save: function() {
                    this.load.remembered || (this.load.remembered = {}), this.load.remembered[this.preset] = S(this), I(this, !1)
                },
                saveAs: function(t) {
                    this.load.remembered || (this.load.remembered = {}, this.load.remembered[R] = S(this, !0)), this.load.remembered[t] = S(this), this.preset = t, w(this, t, !0)
                },
                revert: function(t) {
                    f.each(this.__controllers, function(e) {
                        this.getRoot().load.remembered ? _(t || this.getRoot(), e) : e.setValue(e.initialValue)
                    }, this), f.each(this.__folders, function(t) {
                        t.revert(t)
                    }), t || I(this.getRoot(), !1)
                },
                listen: function(t) {
                    var e = 0 == this.__listening.length;
                    this.__listening.push(t), e && D(this.__listening)
                }
            }), N
        }(o.utils.css, 0, 0, o.controllers.factory = function(t, e, n, o, i, r, a) {
            return function(s, u) {
                var l = s[u];
                return a.isArray(arguments[2]) || a.isObject(arguments[2]) ? new t(s, u, arguments[2]) : a.isNumber(l) ? a.isNumber(arguments[2]) && a.isNumber(arguments[3]) ? new n(s, u, arguments[2], arguments[3]) : new e(s, u, {
                    min: arguments[2],
                    max: arguments[3]
                }) : a.isString(l) ? new o(s, u) : a.isFunction(l) ? new i(s, u, "") : a.isBoolean(l) ? new r(s, u) : void 0
            }
        }(o.controllers.OptionController, o.controllers.NumberControllerBox, o.controllers.NumberControllerSlider, o.controllers.StringController = function(t, e, n) {
            var o = function(t, n) {
                function i() {
                    a.setValue(a.__input.value)
                }

                function r() {
                    a.__onFinishChange && a.__onFinishChange.call(a, a.getValue())
                }
                o.superclass.call(this, t, n);
                var a = this;
                this.__input = document.createElement("input"), this.__input.setAttribute("type", "text"), e.bind(this.__input, "keyup", i), e.bind(this.__input, "change", i), e.bind(this.__input, "blur", r), e.bind(this.__input, "keydown", function(t) {
                    13 === t.keyCode && this.blur()
                }), this.updateDisplay(), this.domElement.appendChild(this.__input)
            };
            return o.superclass = t, n.extend(o.prototype, t.prototype, {
                updateDisplay: function() {
                    return e.isActive(this.__input) || (this.__input.value = this.getValue()), o.superclass.prototype.updateDisplay.call(this)
                }
            }), o
        }(o.controllers.Controller, o.dom.dom, o.utils.common), o.controllers.FunctionController, o.controllers.BooleanController, o.utils.common), o.controllers.Controller, o.controllers.BooleanController, o.controllers.FunctionController, o.controllers.NumberControllerBox, o.controllers.NumberControllerSlider, o.controllers.OptionController, o.controllers.ColorController = function(t, e, n, o, i) {
            function r(t, e, n, o) {
                t.style.background = "", i.each(u, function(i) {
                    t.style.cssText += "background: " + i + "linear-gradient(" + e + ", " + n + " 0%, " + o + " 100%); "
                })
            }

            function a(t) {
                t.style.background = "", t.style.cssText += "background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);", t.style.cssText += "background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);", t.style.cssText += "background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);", t.style.cssText += "background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);", t.style.cssText += "background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);"
            }
            var s = function(t, u) {
                function l(t) {
                    p(t), e.bind(window, "mousemove", p), e.bind(window, "mouseup", c)
                }

                function c() {
                    e.unbind(window, "mousemove", p), e.unbind(window, "mouseup", c)
                }

                function d() {
                    var t = o(this.value);
                    !1 !== t ? (m.__color.__state = t, m.setValue(m.__color.toOriginal())) : this.value = m.__color.toString()
                }

                function h() {
                    e.unbind(window, "mousemove", f), e.unbind(window, "mouseup", h)
                }

                function p(t) {
                    t.preventDefault();
                    var n = e.getWidth(m.__saturation_field),
                        o = e.getOffset(m.__saturation_field),
                        i = (t.clientX - o.left + document.body.scrollLeft) / n,
                        r = 1 - (t.clientY - o.top + document.body.scrollTop) / n;
                    return r > 1 ? r = 1 : r < 0 && (r = 0), i > 1 ? i = 1 : i < 0 && (i = 0), m.__color.v = r, m.__color.s = i, m.setValue(m.__color.toOriginal()), !1
                }

                function f(t) {
                    t.preventDefault();
                    var n = e.getHeight(m.__hue_field),
                        o = e.getOffset(m.__hue_field),
                        i = 1 - (t.clientY - o.top + document.body.scrollTop) / n;
                    return i > 1 ? i = 1 : i < 0 && (i = 0), m.__color.h = 360 * i, m.setValue(m.__color.toOriginal()), !1
                }
                s.superclass.call(this, t, u), this.__color = new n(this.getValue()), this.__temp = new n(0);
                var m = this;
                this.domElement = document.createElement("div"), e.makeSelectable(this.domElement, !1), this.__selector = document.createElement("div"), this.__selector.className = "selector", this.__saturation_field = document.createElement("div"), this.__saturation_field.className = "saturation-field", this.__field_knob = document.createElement("div"), this.__field_knob.className = "field-knob", this.__field_knob_border = "2px solid ", this.__hue_knob = document.createElement("div"), this.__hue_knob.className = "hue-knob", this.__hue_field = document.createElement("div"), this.__hue_field.className = "hue-field", this.__input = document.createElement("input"), this.__input.type = "text", this.__input_textShadow = "0 1px 1px ", e.bind(this.__input, "keydown", function(t) {
                    13 === t.keyCode && d.call(this)
                }), e.bind(this.__input, "blur", d), e.bind(this.__selector, "mousedown", function(t) {
                    e.addClass(this, "drag").bind(window, "mouseup", function(t) {
                        e.removeClass(m.__selector, "drag")
                    })
                });
                var v = document.createElement("div");
                i.extend(this.__selector.style, {
                    width: "122px",
                    height: "102px",
                    padding: "3px",
                    backgroundColor: "#222",
                    boxShadow: "0px 1px 3px rgba(0,0,0,0.3)"
                }), i.extend(this.__field_knob.style, {
                    position: "absolute",
                    width: "12px",
                    height: "12px",
                    border: this.__field_knob_border + (this.__color.v < .5 ? "#fff" : "#000"),
                    boxShadow: "0px 1px 3px rgba(0,0,0,0.5)",
                    borderRadius: "12px",
                    zIndex: 1
                }), i.extend(this.__hue_knob.style, {
                    position: "absolute",
                    width: "15px",
                    height: "2px",
                    borderRight: "4px solid #fff",
                    zIndex: 1
                }), i.extend(this.__saturation_field.style, {
                    width: "100px",
                    height: "100px",
                    border: "1px solid #555",
                    marginRight: "3px",
                    display: "inline-block",
                    cursor: "pointer"
                }), i.extend(v.style, {
                    width: "100%",
                    height: "100%",
                    background: "none"
                }), r(v, "top", "rgba(0,0,0,0)", "#000"), i.extend(this.__hue_field.style, {
                    width: "15px",
                    height: "100px",
                    display: "inline-block",
                    border: "1px solid #555",
                    cursor: "ns-resize"
                }), a(this.__hue_field), i.extend(this.__input.style, {
                    outline: "none",
                    textAlign: "center",
                    color: "#fff",
                    border: 0,
                    fontWeight: "bold",
                    textShadow: this.__input_textShadow + "rgba(0,0,0,0.7)"
                }), e.bind(this.__saturation_field, "mousedown", l), e.bind(this.__field_knob, "mousedown", l), e.bind(this.__hue_field, "mousedown", function(t) {
                    f(t), e.bind(window, "mousemove", f), e.bind(window, "mouseup", h)
                }), this.__saturation_field.appendChild(v), this.__selector.appendChild(this.__field_knob), this.__selector.appendChild(this.__saturation_field), this.__selector.appendChild(this.__hue_field), this.__hue_field.appendChild(this.__hue_knob), this.domElement.appendChild(this.__input), this.domElement.appendChild(this.__selector), this.updateDisplay()
            };
            s.superclass = t, i.extend(s.prototype, t.prototype, {
                updateDisplay: function() {
                    var t = o(this.getValue());
                    if (!1 !== t) {
                        var e = !1;
                        i.each(n.COMPONENTS, function(n) {
                            if (!i.isUndefined(t[n]) && !i.isUndefined(this.__color.__state[n]) && t[n] !== this.__color.__state[n]) return e = !0, {}
                        }, this), e && i.extend(this.__color.__state, t)
                    }
                    i.extend(this.__temp.__state, this.__color.__state), this.__temp.a = 1;
                    var a = this.__color.v < .5 || this.__color.s > .5 ? 255 : 0,
                        s = 255 - a;
                    i.extend(this.__field_knob.style, {
                        marginLeft: 100 * this.__color.s - 7 + "px",
                        marginTop: 100 * (1 - this.__color.v) - 7 + "px",
                        backgroundColor: this.__temp.toString(),
                        border: this.__field_knob_border + "rgb(" + a + "," + a + "," + a + ")"
                    }), this.__hue_knob.style.marginTop = 100 * (1 - this.__color.h / 360) + "px", this.__temp.s = 1, this.__temp.v = 1, r(this.__saturation_field, "left", "#fff", this.__temp.toString()), i.extend(this.__input.style, {
                        backgroundColor: this.__input.value = this.__color.toString(),
                        color: "rgb(" + a + "," + a + "," + a + ")",
                        textShadow: this.__input_textShadow + "rgba(" + s + "," + s + "," + s + ",.7)"
                    })
                }
            });
            var u = ["-moz-", "-o-", "-webkit-", "-ms-", ""];
            return s
        }(o.controllers.Controller, o.dom.dom, o.color.Color = function(t, e, n, o) {
            function i(t, e, n) {
                Object.defineProperty(t, e, {
                    get: function() {
                        return "RGB" === this.__state.space ? this.__state[e] : (a(this, e, n), this.__state[e])
                    },
                    set: function(t) {
                        "RGB" !== this.__state.space && (a(this, e, n), this.__state.space = "RGB"), this.__state[e] = t
                    }
                })
            }

            function r(t, e) {
                Object.defineProperty(t, e, {
                    get: function() {
                        return "HSV" === this.__state.space ? this.__state[e] : (s(this), this.__state[e])
                    },
                    set: function(t) {
                        "HSV" !== this.__state.space && (s(this), this.__state.space = "HSV"), this.__state[e] = t
                    }
                })
            }

            function a(t, n, i) {
                if ("HEX" === t.__state.space) t.__state[n] = e.component_from_hex(t.__state.hex, i);
                else {
                    if ("HSV" !== t.__state.space) throw "Corrupted color state";
                    o.extend(t.__state, e.hsv_to_rgb(t.__state.h, t.__state.s, t.__state.v))
                }
            }

            function s(t) {
                var n = e.rgb_to_hsv(t.r, t.g, t.b);
                o.extend(t.__state, {
                    s: n.s,
                    v: n.v
                }), o.isNaN(n.h) ? o.isUndefined(t.__state.h) && (t.__state.h = 0) : t.__state.h = n.h
            }
            var u = function() {
                if (this.__state = t.apply(this, arguments), !1 === this.__state) throw "Failed to interpret color arguments";
                this.__state.a = this.__state.a || 1
            };
            return u.COMPONENTS = ["r", "g", "b", "h", "s", "v", "hex", "a"], o.extend(u.prototype, {
                toString: function() {
                    return n(this)
                },
                toOriginal: function() {
                    return this.__state.conversion.write(this)
                }
            }), i(u.prototype, "r", 2), i(u.prototype, "g", 1), i(u.prototype, "b", 0), r(u.prototype, "h"), r(u.prototype, "s"), r(u.prototype, "v"), Object.defineProperty(u.prototype, "a", {
                get: function() {
                    return this.__state.a
                },
                set: function(t) {
                    this.__state.a = t
                }
            }), Object.defineProperty(u.prototype, "hex", {
                get: function() {
                    return "HEX" !== !this.__state.space && (this.__state.hex = e.rgb_to_hex(this.r, this.g, this.b)), this.__state.hex
                },
                set: function(t) {
                    this.__state.space = "HEX", this.__state.hex = t
                }
            }), u
        }(o.color.interpret, o.color.math = function() {
            var t;
            return {
                hsv_to_rgb: function(t, e, n) {
                    var o = Math.floor(t / 60) % 6,
                        i = t / 60 - Math.floor(t / 60),
                        r = n * (1 - e),
                        a = n * (1 - i * e),
                        s = n * (1 - (1 - i) * e),
                        u = [
                            [n, s, r],
                            [a, n, r],
                            [r, n, s],
                            [r, a, n],
                            [s, r, n],
                            [n, r, a]
                        ][o];
                    return {
                        r: 255 * u[0],
                        g: 255 * u[1],
                        b: 255 * u[2]
                    }
                },
                rgb_to_hsv: function(t, e, n) {
                    var o, i, r = Math.min(t, e, n),
                        a = Math.max(t, e, n),
                        s = a - r;
                    return 0 == a ? {
                        h: NaN,
                        s: 0,
                        v: 0
                    } : (i = s / a, o = t == a ? (e - n) / s : e == a ? 2 + (n - t) / s : 4 + (t - e) / s, o /= 6, o < 0 && (o += 1), {
                        h: 360 * o,
                        s: i,
                        v: a / 255
                    })
                },
                rgb_to_hex: function(t, e, n) {
                    var o = this.hex_with_component(0, 2, t);
                    return o = this.hex_with_component(o, 1, e), o = this.hex_with_component(o, 0, n)
                },
                component_from_hex: function(t, e) {
                    return t >> 8 * e & 255
                },
                hex_with_component: function(e, n, o) {
                    return o << (t = 8 * n) | e & ~(255 << t)
                }
            }
        }(), o.color.toString, o.utils.common), o.color.interpret, o.utils.common), o.utils.requestAnimationFrame = function() {
            return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(t, e) {
                window.setTimeout(t, 1e3 / 60)
            }
        }(), o.dom.CenteredDiv = function(t, e) {
            var n = function() {
                this.backgroundElement = document.createElement("div"), e.extend(this.backgroundElement.style, {
                    backgroundColor: "rgba(0,0,0,0.8)",
                    top: 0,
                    left: 0,
                    display: "none",
                    zIndex: "1000",
                    opacity: 0,
                    WebkitTransition: "opacity 0.2s linear"
                }), t.makeFullscreen(this.backgroundElement), this.backgroundElement.style.position = "fixed", this.domElement = document.createElement("div"), e.extend(this.domElement.style, {
                    position: "fixed",
                    display: "none",
                    zIndex: "1001",
                    opacity: 0,
                    WebkitTransition: "-webkit-transform 0.2s ease-out, opacity 0.2s linear"
                }), document.body.appendChild(this.backgroundElement), document.body.appendChild(this.domElement);
                var n = this;
                t.bind(this.backgroundElement, "click", function() {
                    n.hide()
                })
            };
            return n.prototype.show = function() {
                var t = this;
                this.backgroundElement.style.display = "block", this.domElement.style.display = "block", this.domElement.style.opacity = 0, this.domElement.style.webkitTransform = "scale(1.1)", this.layout(), e.defer(function() {
                    t.backgroundElement.style.opacity = 1, t.domElement.style.opacity = 1, t.domElement.style.webkitTransform = "scale(1)"
                })
            }, n.prototype.hide = function() {
                var e = this,
                    n = function() {
                        e.domElement.style.display = "none", e.backgroundElement.style.display = "none", t.unbind(e.domElement, "webkitTransitionEnd", n), t.unbind(e.domElement, "transitionend", n), t.unbind(e.domElement, "oTransitionEnd", n)
                    };
                t.bind(this.domElement, "webkitTransitionEnd", n), t.bind(this.domElement, "transitionend", n), t.bind(this.domElement, "oTransitionEnd", n), this.backgroundElement.style.opacity = 0, this.domElement.style.opacity = 0, this.domElement.style.webkitTransform = "scale(1.1)"
            }, n.prototype.layout = function() {
                this.domElement.style.left = window.innerWidth / 2 - t.getWidth(this.domElement) / 2 + "px", this.domElement.style.top = window.innerHeight / 2 - t.getHeight(this.domElement) / 2 + "px"
            }, n
        }(o.dom.dom, o.utils.common), o.dom.dom, o.utils.common)
    }, {}],
    4: [function(t, e, n) {
        function o(t, e, n) {
            var o = l[e];
            if (void 0 === o && (o = r(e)), o) {
                if (void 0 === n) return t.style[o];
                "number" == typeof n && (n += c[o] || ""), t.style[o] = n
            }
        }

        function i(t, e) {
            for (var n in e) e.hasOwnProperty(n) && o(t, n, e[n])
        }

        function r(t) {
            var e = u(t),
                n = s(e);
            return l[e] = l[t] = l[n] = n, n
        }

        function a() {
            2 === arguments.length ? i(arguments[0], arguments[1]) : o(arguments[0], arguments[1], arguments[2])
        }
        var s = t(38),
            u = t(43),
            l = {
                float: "cssFloat"
            },
            c = {};
        ["top", "right", "bottom", "left", "width", "height", "fontSize", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "padding", "margin", "perspective"].forEach(function(t) {
            c[t] = "px"
        }), e.exports = a, e.exports.set = a, e.exports.get = function(t, e) {
            return Array.isArray(e) ? e.reduce(function(e, n) {
                return e[n] = o(t, n || ""), e
            }, {}) : o(t, e || "")
        }
    }, {
        38: 38,
        43: 43
    }],
    5: [function(t, e, n) {
        function o() {
            this._events = this._events || {}, this._maxListeners = this._maxListeners || void 0
        }

        function i(t) {
            return "function" == typeof t
        }

        function r(t) {
            return "number" == typeof t
        }

        function a(t) {
            return "object" == typeof t && null !== t
        }

        function s(t) {
            return void 0 === t
        }
        e.exports = o, o.EventEmitter = o, o.prototype._events = void 0, o.prototype._maxListeners = void 0, o.defaultMaxListeners = 10, o.prototype.setMaxListeners = function(t) {
            if (!r(t) || t < 0 || isNaN(t)) throw TypeError("n must be a positive number");
            return this._maxListeners = t, this
        }, o.prototype.emit = function(t) {
            var e, n, o, r, u, l;
            if (this._events || (this._events = {}), "error" === t && (!this._events.error || a(this._events.error) && !this._events.error.length)) {
                if ((e = arguments[1]) instanceof Error) throw e;
                var c = new Error('Uncaught, unspecified "error" event. (' + e + ")");
                throw c.context = e, c
            }
            if (n = this._events[t], s(n)) return !1;
            if (i(n)) switch (arguments.length) {
                case 1:
                    n.call(this);
                    break;
                case 2:
                    n.call(this, arguments[1]);
                    break;
                case 3:
                    n.call(this, arguments[1], arguments[2]);
                    break;
                default:
                    r = Array.prototype.slice.call(arguments, 1), n.apply(this, r)
            } else if (a(n))
                for (r = Array.prototype.slice.call(arguments, 1), l = n.slice(), o = l.length, u = 0; u < o; u++) l[u].apply(this, r);
            return !0
        }, o.prototype.addListener = function(t, e) {
            var n;
            if (!i(e)) throw TypeError("listener must be a function");
            return this._events || (this._events = {}), this._events.newListener && this.emit("newListener", t, i(e.listener) ? e.listener : e), this._events[t] ? a(this._events[t]) ? this._events[t].push(e) : this._events[t] = [this._events[t], e] : this._events[t] = e, a(this._events[t]) && !this._events[t].warned && (n = s(this._maxListeners) ? o.defaultMaxListeners : this._maxListeners) && n > 0 && this._events[t].length > n && (this._events[t].warned = !0, console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[t].length), "function" == typeof console.trace && console.trace()), this
        }, o.prototype.on = o.prototype.addListener, o.prototype.once = function(t, e) {
            function n() {
                this.removeListener(t, n), o || (o = !0, e.apply(this, arguments))
            }
            if (!i(e)) throw TypeError("listener must be a function");
            var o = !1;
            return n.listener = e, this.on(t, n), this
        }, o.prototype.removeListener = function(t, e) {
            var n, o, r, s;
            if (!i(e)) throw TypeError("listener must be a function");
            if (!this._events || !this._events[t]) return this;
            if (n = this._events[t], r = n.length, o = -1, n === e || i(n.listener) && n.listener === e) delete this._events[t], this._events.removeListener && this.emit("removeListener", t, e);
            else if (a(n)) {
                for (s = r; s-- > 0;)
                    if (n[s] === e || n[s].listener && n[s].listener === e) {
                        o = s;
                        break
                    }
                if (o < 0) return this;
                1 === n.length ? (n.length = 0, delete this._events[t]) : n.splice(o, 1), this._events.removeListener && this.emit("removeListener", t, e)
            }
            return this
        }, o.prototype.removeAllListeners = function(t) {
            var e, n;
            if (!this._events) return this;
            if (!this._events.removeListener) return 0 === arguments.length ? this._events = {} : this._events[t] && delete this._events[t], this;
            if (0 === arguments.length) {
                for (e in this._events) "removeListener" !== e && this.removeAllListeners(e);
                return this.removeAllListeners("removeListener"), this._events = {}, this
            }
            if (n = this._events[t], i(n)) this.removeListener(t, n);
            else if (n)
                for (; n.length;) this.removeListener(t, n[n.length - 1]);
            return delete this._events[t], this
        }, o.prototype.listeners = function(t) {
            return this._events && this._events[t] ? i(this._events[t]) ? [this._events[t]] : this._events[t].slice() : []
        }, o.prototype.listenerCount = function(t) {
            if (this._events) {
                var e = this._events[t];
                if (i(e)) return 1;
                if (e) return e.length
            }
            return 0
        }, o.listenerCount = function(t, e) {
            return t.listenerCount(e)
        }
    }, {}],
    6: [function(t, e, n) {
        n.glMatrix = t(7), n.mat2 = t(8), n.mat2d = t(9), n.mat3 = t(10), n.mat4 = t(11), n.quat = t(12), n.vec2 = t(13), n.vec3 = t(14), n.vec4 = t(15)
    }, {
        10: 10,
        11: 11,
        12: 12,
        13: 13,
        14: 14,
        15: 15,
        7: 7,
        8: 8,
        9: 9
    }],
    7: [function(t, e, n) {
        var o = {};
        o.EPSILON = 1e-6, o.ARRAY_TYPE = "undefined" != typeof Float32Array ? Float32Array : Array, o.RANDOM = Math.random, o.ENABLE_SIMD = !1, o.SIMD_AVAILABLE = o.ARRAY_TYPE === Float32Array && "SIMD" in this, o.USE_SIMD = o.ENABLE_SIMD && o.SIMD_AVAILABLE, o.setMatrixArrayType = function(t) {
            o.ARRAY_TYPE = t
        };
        var i = Math.PI / 180;
        o.toRadian = function(t) {
            return t * i
        }, o.equals = function(t, e) {
            return Math.abs(t - e) <= o.EPSILON * Math.max(1, Math.abs(t), Math.abs(e))
        }, e.exports = o
    }, {}],
    8: [function(t, e, n) {
        var o = t(7),
            i = {};
        i.create = function() {
            var t = new o.ARRAY_TYPE(4);
            return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t
        }, i.clone = function(t) {
            var e = new o.ARRAY_TYPE(4);
            return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e
        }, i.copy = function(t, e) {
            return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t
        }, i.identity = function(t) {
            return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t
        }, i.fromValues = function(t, e, n, i) {
            var r = new o.ARRAY_TYPE(4);
            return r[0] = t, r[1] = e, r[2] = n, r[3] = i, r
        }, i.set = function(t, e, n, o, i) {
            return t[0] = e, t[1] = n, t[2] = o, t[3] = i, t
        }, i.transpose = function(t, e) {
            if (t === e) {
                var n = e[1];
                t[1] = e[2], t[2] = n
            } else t[0] = e[0], t[1] = e[2], t[2] = e[1], t[3] = e[3];
            return t
        }, i.invert = function(t, e) {
            var n = e[0],
                o = e[1],
                i = e[2],
                r = e[3],
                a = n * r - i * o;
            return a ? (a = 1 / a, t[0] = r * a, t[1] = -o * a, t[2] = -i * a, t[3] = n * a, t) : null
        }, i.adjoint = function(t, e) {
            var n = e[0];
            return t[0] = e[3], t[1] = -e[1], t[2] = -e[2], t[3] = n, t
        }, i.determinant = function(t) {
            return t[0] * t[3] - t[2] * t[1]
        }, i.multiply = function(t, e, n) {
            var o = e[0],
                i = e[1],
                r = e[2],
                a = e[3],
                s = n[0],
                u = n[1],
                l = n[2],
                c = n[3];
            return t[0] = o * s + r * u, t[1] = i * s + a * u, t[2] = o * l + r * c, t[3] = i * l + a * c, t
        }, i.mul = i.multiply, i.rotate = function(t, e, n) {
            var o = e[0],
                i = e[1],
                r = e[2],
                a = e[3],
                s = Math.sin(n),
                u = Math.cos(n);
            return t[0] = o * u + r * s, t[1] = i * u + a * s, t[2] = o * -s + r * u, t[3] = i * -s + a * u, t
        }, i.scale = function(t, e, n) {
            var o = e[0],
                i = e[1],
                r = e[2],
                a = e[3],
                s = n[0],
                u = n[1];
            return t[0] = o * s, t[1] = i * s, t[2] = r * u, t[3] = a * u, t
        }, i.fromRotation = function(t, e) {
            var n = Math.sin(e),
                o = Math.cos(e);
            return t[0] = o, t[1] = n, t[2] = -n, t[3] = o, t
        }, i.fromScaling = function(t, e) {
            return t[0] = e[0], t[1] = 0, t[2] = 0, t[3] = e[1], t
        }, i.str = function(t) {
            return "mat2(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")"
        }, i.frob = function(t) {
            return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2))
        }, i.LDU = function(t, e, n, o) {
            return t[2] = o[2] / o[0], n[0] = o[0], n[1] = o[1], n[3] = o[3] - t[2] * n[1], [t, e, n]
        }, i.add = function(t, e, n) {
            return t[0] = e[0] + n[0], t[1] = e[1] + n[1], t[2] = e[2] + n[2], t[3] = e[3] + n[3], t
        }, i.subtract = function(t, e, n) {
            return t[0] = e[0] - n[0], t[1] = e[1] - n[1], t[2] = e[2] - n[2], t[3] = e[3] - n[3], t
        }, i.sub = i.subtract, i.exactEquals = function(t, e) {
            return t[0] === e[0] && t[1] === e[1] && t[2] === e[2] && t[3] === e[3]
        }, i.equals = function(t, e) {
            var n = t[0],
                i = t[1],
                r = t[2],
                a = t[3],
                s = e[0],
                u = e[1],
                l = e[2],
                c = e[3];
            return Math.abs(n - s) <= o.EPSILON * Math.max(1, Math.abs(n), Math.abs(s)) && Math.abs(i - u) <= o.EPSILON * Math.max(1, Math.abs(i), Math.abs(u)) && Math.abs(r - l) <= o.EPSILON * Math.max(1, Math.abs(r), Math.abs(l)) && Math.abs(a - c) <= o.EPSILON * Math.max(1, Math.abs(a), Math.abs(c))
        }, i.multiplyScalar = function(t, e, n) {
            return t[0] = e[0] * n, t[1] = e[1] * n, t[2] = e[2] * n, t[3] = e[3] * n, t
        }, i.multiplyScalarAndAdd = function(t, e, n, o) {
            return t[0] = e[0] + n[0] * o, t[1] = e[1] + n[1] * o, t[2] = e[2] + n[2] * o, t[3] = e[3] + n[3] * o, t
        }, e.exports = i
    }, {
        7: 7
    }],
    9: [function(t, e, n) {
        var o = t(7),
            i = {};
        i.create = function() {
            var t = new o.ARRAY_TYPE(6);
            return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t[4] = 0, t[5] = 0, t
        }, i.clone = function(t) {
            var e = new o.ARRAY_TYPE(6);
            return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4], e[5] = t[5], e
        }, i.copy = function(t, e) {
            return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t
        }, i.identity = function(t) {
            return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t[4] = 0, t[5] = 0, t
        }, i.fromValues = function(t, e, n, i, r, a) {
            var s = new o.ARRAY_TYPE(6);
            return s[0] = t, s[1] = e, s[2] = n, s[3] = i, s[4] = r, s[5] = a, s
        }, i.set = function(t, e, n, o, i, r, a) {
            return t[0] = e, t[1] = n, t[2] = o, t[3] = i, t[4] = r, t[5] = a, t
        }, i.invert = function(t, e) {
            var n = e[0],
                o = e[1],
                i = e[2],
                r = e[3],
                a = e[4],
                s = e[5],
                u = n * r - o * i;
            return u ? (u = 1 / u, t[0] = r * u, t[1] = -o * u, t[2] = -i * u, t[3] = n * u, t[4] = (i * s - r * a) * u, t[5] = (o * a - n * s) * u, t) : null
        }, i.determinant = function(t) {
            return t[0] * t[3] - t[1] * t[2]
        }, i.multiply = function(t, e, n) {
            var o = e[0],
                i = e[1],
                r = e[2],
                a = e[3],
                s = e[4],
                u = e[5],
                l = n[0],
                c = n[1],
                d = n[2],
                h = n[3],
                p = n[4],
                f = n[5];
            return t[0] = o * l + r * c, t[1] = i * l + a * c, t[2] = o * d + r * h, t[3] = i * d + a * h, t[4] = o * p + r * f + s, t[5] = i * p + a * f + u, t
        }, i.mul = i.multiply, i.rotate = function(t, e, n) {
            var o = e[0],
                i = e[1],
                r = e[2],
                a = e[3],
                s = e[4],
                u = e[5],
                l = Math.sin(n),
                c = Math.cos(n);
            return t[0] = o * c + r * l, t[1] = i * c + a * l, t[2] = o * -l + r * c, t[3] = i * -l + a * c, t[4] = s, t[5] = u, t
        }, i.scale = function(t, e, n) {
            var o = e[0],
                i = e[1],
                r = e[2],
                a = e[3],
                s = e[4],
                u = e[5],
                l = n[0],
                c = n[1];
            return t[0] = o * l, t[1] = i * l, t[2] = r * c, t[3] = a * c, t[4] = s, t[5] = u, t
        }, i.translate = function(t, e, n) {
            var o = e[0],
                i = e[1],
                r = e[2],
                a = e[3],
                s = e[4],
                u = e[5],
                l = n[0],
                c = n[1];
            return t[0] = o, t[1] = i, t[2] = r, t[3] = a, t[4] = o * l + r * c + s, t[5] = i * l + a * c + u, t
        }, i.fromRotation = function(t, e) {
            var n = Math.sin(e),
                o = Math.cos(e);
            return t[0] = o, t[1] = n, t[2] = -n, t[3] = o, t[4] = 0, t[5] = 0, t
        }, i.fromScaling = function(t, e) {
            return t[0] = e[0], t[1] = 0, t[2] = 0, t[3] = e[1], t[4] = 0, t[5] = 0, t
        }, i.fromTranslation = function(t, e) {
            return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t[4] = e[0], t[5] = e[1], t
        }, i.str = function(t) {
            return "mat2d(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ")"
        }, i.frob = function(t) {
            return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2) + Math.pow(t[4], 2) + Math.pow(t[5], 2) + 1)
        }, i.add = function(t, e, n) {
            return t[0] = e[0] + n[0], t[1] = e[1] + n[1], t[2] = e[2] + n[2], t[3] = e[3] + n[3], t[4] = e[4] + n[4], t[5] = e[5] + n[5], t
        }, i.subtract = function(t, e, n) {
            return t[0] = e[0] - n[0], t[1] = e[1] - n[1], t[2] = e[2] - n[2], t[3] = e[3] - n[3], t[4] = e[4] - n[4], t[5] = e[5] - n[5], t
        }, i.sub = i.subtract, i.multiplyScalar = function(t, e, n) {
            return t[0] = e[0] * n, t[1] = e[1] * n, t[2] = e[2] * n, t[3] = e[3] * n, t[4] = e[4] * n, t[5] = e[5] * n, t
        }, i.multiplyScalarAndAdd = function(t, e, n, o) {
            return t[0] = e[0] + n[0] * o, t[1] = e[1] + n[1] * o, t[2] = e[2] + n[2] * o, t[3] = e[3] + n[3] * o, t[4] = e[4] + n[4] * o, t[5] = e[5] + n[5] * o, t
        }, i.exactEquals = function(t, e) {
            return t[0] === e[0] && t[1] === e[1] && t[2] === e[2] && t[3] === e[3] && t[4] === e[4] && t[5] === e[5]
        }, i.equals = function(t, e) {
            var n = t[0],
                i = t[1],
                r = t[2],
                a = t[3],
                s = t[4],
                u = t[5],
                l = e[0],
                c = e[1],
                d = e[2],
                h = e[3],
                p = e[4],
                f = e[5];
            return Math.abs(n - l) <= o.EPSILON * Math.max(1, Math.abs(n), Math.abs(l)) && Math.abs(i - c) <= o.EPSILON * Math.max(1, Math.abs(i), Math.abs(c)) && Math.abs(r - d) <= o.EPSILON * Math.max(1, Math.abs(r), Math.abs(d)) && Math.abs(a - h) <= o.EPSILON * Math.max(1, Math.abs(a), Math.abs(h)) && Math.abs(s - p) <= o.EPSILON * Math.max(1, Math.abs(s), Math.abs(p)) && Math.abs(u - f) <= o.EPSILON * Math.max(1, Math.abs(u), Math.abs(f))
        }, e.exports = i
    }, {
        7: 7
    }],
    10: [function(t, e, n) {
        var o = t(7),
            i = {};
        i.create = function() {
            var t = new o.ARRAY_TYPE(9);
            return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 1, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t
        }, i.fromMat4 = function(t, e) {
            return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[4], t[4] = e[5], t[5] = e[6], t[6] = e[8], t[7] = e[9], t[8] = e[10], t
        }, i.clone = function(t) {
            var e = new o.ARRAY_TYPE(9);
            return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4], e[5] = t[5], e[6] = t[6], e[7] = t[7], e[8] = t[8], e
        }, i.copy = function(t, e) {
            return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t
        }, i.fromValues = function(t, e, n, i, r, a, s, u, l) {
            var c = new o.ARRAY_TYPE(9);
            return c[0] = t, c[1] = e, c[2] = n, c[3] = i, c[4] = r, c[5] = a, c[6] = s, c[7] = u, c[8] = l, c
        }, i.set = function(t, e, n, o, i, r, a, s, u, l) {
            return t[0] = e, t[1] = n, t[2] = o, t[3] = i, t[4] = r, t[5] = a, t[6] = s, t[7] = u, t[8] = l, t
        }, i.identity = function(t) {
            return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 1, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t
        }, i.transpose = function(t, e) {
            if (t === e) {
                var n = e[1],
                    o = e[2],
                    i = e[5];
                t[1] = e[3], t[2] = e[6], t[3] = n, t[5] = e[7], t[6] = o, t[7] = i
            } else t[0] = e[0], t[1] = e[3], t[2] = e[6], t[3] = e[1], t[4] = e[4], t[5] = e[7], t[6] = e[2], t[7] = e[5], t[8] = e[8];
            return t
        }, i.invert = function(t, e) {
            var n = e[0],
                o = e[1],
                i = e[2],
                r = e[3],
                a = e[4],
                s = e[5],
                u = e[6],
                l = e[7],
                c = e[8],
                d = c * a - s * l,
                h = -c * r + s * u,
                p = l * r - a * u,
                f = n * d + o * h + i * p;
            return f ? (f = 1 / f, t[0] = d * f, t[1] = (-c * o + i * l) * f, t[2] = (s * o - i * a) * f, t[3] = h * f, t[4] = (c * n - i * u) * f, t[5] = (-s * n + i * r) * f, t[6] = p * f, t[7] = (-l * n + o * u) * f, t[8] = (a * n - o * r) * f, t) : null
        }, i.adjoint = function(t, e) {
            var n = e[0],
                o = e[1],
                i = e[2],
                r = e[3],
                a = e[4],
                s = e[5],
                u = e[6],
                l = e[7],
                c = e[8];
            return t[0] = a * c - s * l, t[1] = i * l - o * c, t[2] = o * s - i * a, t[3] = s * u - r * c, t[4] = n * c - i * u, t[5] = i * r - n * s, t[6] = r * l - a * u, t[7] = o * u - n * l, t[8] = n * a - o * r, t
        }, i.determinant = function(t) {
            var e = t[0],
                n = t[1],
                o = t[2],
                i = t[3],
                r = t[4],
                a = t[5],
                s = t[6],
                u = t[7],
                l = t[8];
            return e * (l * r - a * u) + n * (-l * i + a * s) + o * (u * i - r * s)
        }, i.multiply = function(t, e, n) {
            var o = e[0],
                i = e[1],
                r = e[2],
                a = e[3],
                s = e[4],
                u = e[5],
                l = e[6],
                c = e[7],
                d = e[8],
                h = n[0],
                p = n[1],
                f = n[2],
                m = n[3],
                v = n[4],
                g = n[5],
                _ = n[6],
                x = n[7],
                b = n[8];
            return t[0] = h * o + p * a + f * l, t[1] = h * i + p * s + f * c, t[2] = h * r + p * u + f * d, t[3] = m * o + v * a + g * l, t[4] = m * i + v * s + g * c, t[5] = m * r + v * u + g * d, t[6] = _ * o + x * a + b * l, t[7] = _ * i + x * s + b * c, t[8] = _ * r + x * u + b * d, t
        }, i.mul = i.multiply, i.translate = function(t, e, n) {
            var o = e[0],
                i = e[1],
                r = e[2],
                a = e[3],
                s = e[4],
                u = e[5],
                l = e[6],
                c = e[7],
                d = e[8],
                h = n[0],
                p = n[1];
            return t[0] = o, t[1] = i, t[2] = r, t[3] = a, t[4] = s, t[5] = u, t[6] = h * o + p * a + l, t[7] = h * i + p * s + c, t[8] = h * r + p * u + d, t
        }, i.rotate = function(t, e, n) {
            var o = e[0],
                i = e[1],
                r = e[2],
                a = e[3],
                s = e[4],
                u = e[5],
                l = e[6],
                c = e[7],
                d = e[8],
                h = Math.sin(n),
                p = Math.cos(n);
            return t[0] = p * o + h * a, t[1] = p * i + h * s, t[2] = p * r + h * u, t[3] = p * a - h * o, t[4] = p * s - h * i, t[5] = p * u - h * r, t[6] = l, t[7] = c, t[8] = d, t
        }, i.scale = function(t, e, n) {
            var o = n[0],
                i = n[1];
            return t[0] = o * e[0], t[1] = o * e[1], t[2] = o * e[2], t[3] = i * e[3], t[4] = i * e[4], t[5] = i * e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t
        }, i.fromTranslation = function(t, e) {
            return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 1, t[5] = 0, t[6] = e[0], t[7] = e[1], t[8] = 1, t
        }, i.fromRotation = function(t, e) {
            var n = Math.sin(e),
                o = Math.cos(e);
            return t[0] = o, t[1] = n, t[2] = 0, t[3] = -n, t[4] = o, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t
        }, i.fromScaling = function(t, e) {
            return t[0] = e[0], t[1] = 0, t[2] = 0, t[3] = 0, t[4] = e[1], t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t
        }, i.fromMat2d = function(t, e) {
            return t[0] = e[0], t[1] = e[1], t[2] = 0, t[3] = e[2], t[4] = e[3], t[5] = 0, t[6] = e[4], t[7] = e[5], t[8] = 1, t
        }, i.fromQuat = function(t, e) {
            var n = e[0],
                o = e[1],
                i = e[2],
                r = e[3],
                a = n + n,
                s = o + o,
                u = i + i,
                l = n * a,
                c = o * a,
                d = o * s,
                h = i * a,
                p = i * s,
                f = i * u,
                m = r * a,
                v = r * s,
                g = r * u;
            return t[0] = 1 - d - f, t[3] = c - g, t[6] = h + v, t[1] = c + g, t[4] = 1 - l - f, t[7] = p - m, t[2] = h - v, t[5] = p + m, t[8] = 1 - l - d, t
        }, i.normalFromMat4 = function(t, e) {
            var n = e[0],
                o = e[1],
                i = e[2],
                r = e[3],
                a = e[4],
                s = e[5],
                u = e[6],
                l = e[7],
                c = e[8],
                d = e[9],
                h = e[10],
                p = e[11],
                f = e[12],
                m = e[13],
                v = e[14],
                g = e[15],
                _ = n * s - o * a,
                x = n * u - i * a,
                b = n * l - r * a,
                y = o * u - i * s,
                M = o * l - r * s,
                S = i * l - r * u,
                w = c * m - d * f,
                E = c * v - h * f,
                I = c * g - p * f,
                D = d * v - h * m,
                A = d * g - p * m,
                F = h * g - p * v,
                R = _ * F - x * A + b * D + y * I - M * E + S * w;
            return R ? (R = 1 / R, t[0] = (s * F - u * A + l * D) * R, t[1] = (u * I - a * F - l * E) * R, t[2] = (a * A - s * I + l * w) * R, t[3] = (i * A - o * F - r * D) * R, t[4] = (n * F - i * I + r * E) * R, t[5] = (o * I - n * A - r * w) * R, t[6] = (m * S - v * M + g * y) * R, t[7] = (v * b - f * S - g * x) * R, t[8] = (f * M - m * b + g * _) * R, t) : null
        }, i.str = function(t) {
            return "mat3(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ", " + t[6] + ", " + t[7] + ", " + t[8] + ")"
        }, i.frob = function(t) {
            return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2) + Math.pow(t[4], 2) + Math.pow(t[5], 2) + Math.pow(t[6], 2) + Math.pow(t[7], 2) + Math.pow(t[8], 2))
        }, i.add = function(t, e, n) {
            return t[0] = e[0] + n[0], t[1] = e[1] + n[1], t[2] = e[2] + n[2], t[3] = e[3] + n[3], t[4] = e[4] + n[4], t[5] = e[5] + n[5], t[6] = e[6] + n[6], t[7] = e[7] + n[7], t[8] = e[8] + n[8], t
        }, i.subtract = function(t, e, n) {
            return t[0] = e[0] - n[0], t[1] = e[1] - n[1], t[2] = e[2] - n[2], t[3] = e[3] - n[3], t[4] = e[4] - n[4], t[5] = e[5] - n[5], t[6] = e[6] - n[6], t[7] = e[7] - n[7], t[8] = e[8] - n[8], t
        }, i.sub = i.subtract, i.multiplyScalar = function(t, e, n) {
            return t[0] = e[0] * n, t[1] = e[1] * n, t[2] = e[2] * n, t[3] = e[3] * n, t[4] = e[4] * n, t[5] = e[5] * n, t[6] = e[6] * n, t[7] = e[7] * n, t[8] = e[8] * n, t
        }, i.multiplyScalarAndAdd = function(t, e, n, o) {
            return t[0] = e[0] + n[0] * o, t[1] = e[1] + n[1] * o, t[2] = e[2] + n[2] * o, t[3] = e[3] + n[3] * o, t[4] = e[4] + n[4] * o, t[5] = e[5] + n[5] * o, t[6] = e[6] + n[6] * o, t[7] = e[7] + n[7] * o, t[8] = e[8] + n[8] * o, t
        }, i.exactEquals = function(t, e) {
            return t[0] === e[0] && t[1] === e[1] && t[2] === e[2] && t[3] === e[3] && t[4] === e[4] && t[5] === e[5] && t[6] === e[6] && t[7] === e[7] && t[8] === e[8]
        }, i.equals = function(t, e) {
            var n = t[0],
                i = t[1],
                r = t[2],
                a = t[3],
                s = t[4],
                u = t[5],
                l = t[6],
                c = t[7],
                d = t[8],
                h = e[0],
                p = e[1],
                f = e[2],
                m = e[3],
                v = e[4],
                g = e[5],
                _ = t[6],
                x = e[7],
                b = e[8];
            return Math.abs(n - h) <= o.EPSILON * Math.max(1, Math.abs(n), Math.abs(h)) && Math.abs(i - p) <= o.EPSILON * Math.max(1, Math.abs(i), Math.abs(p)) && Math.abs(r - f) <= o.EPSILON * Math.max(1, Math.abs(r), Math.abs(f)) && Math.abs(a - m) <= o.EPSILON * Math.max(1, Math.abs(a), Math.abs(m)) && Math.abs(s - v) <= o.EPSILON * Math.max(1, Math.abs(s), Math.abs(v)) && Math.abs(u - g) <= o.EPSILON * Math.max(1, Math.abs(u), Math.abs(g)) && Math.abs(l - _) <= o.EPSILON * Math.max(1, Math.abs(l), Math.abs(_)) && Math.abs(c - x) <= o.EPSILON * Math.max(1, Math.abs(c), Math.abs(x)) && Math.abs(d - b) <= o.EPSILON * Math.max(1, Math.abs(d), Math.abs(b))
        }, e.exports = i
    }, {
        7: 7
    }],
    11: [function(t, e, n) {
        var o = t(7),
            i = {
                scalar: {},
                SIMD: {}
            };
        i.create = function() {
            var t = new o.ARRAY_TYPE(16);
            return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
        }, i.clone = function(t) {
            var e = new o.ARRAY_TYPE(16);
            return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4], e[5] = t[5], e[6] = t[6], e[7] = t[7], e[8] = t[8], e[9] = t[9], e[10] = t[10], e[11] = t[11], e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15], e
        }, i.copy = function(t, e) {
            return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t[9] = e[9], t[10] = e[10], t[11] = e[11], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15], t
        }, i.fromValues = function(t, e, n, i, r, a, s, u, l, c, d, h, p, f, m, v) {
            var g = new o.ARRAY_TYPE(16);
            return g[0] = t, g[1] = e, g[2] = n, g[3] = i, g[4] = r, g[5] = a, g[6] = s, g[7] = u, g[8] = l, g[9] = c, g[10] = d, g[11] = h, g[12] = p, g[13] = f, g[14] = m, g[15] = v, g
        }, i.set = function(t, e, n, o, i, r, a, s, u, l, c, d, h, p, f, m, v) {
            return t[0] = e, t[1] = n, t[2] = o, t[3] = i, t[4] = r, t[5] = a, t[6] = s, t[7] = u, t[8] = l, t[9] = c, t[10] = d, t[11] = h, t[12] = p, t[13] = f, t[14] = m, t[15] = v, t
        }, i.identity = function(t) {
            return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
        }, i.scalar.transpose = function(t, e) {
            if (t === e) {
                var n = e[1],
                    o = e[2],
                    i = e[3],
                    r = e[6],
                    a = e[7],
                    s = e[11];
                t[1] = e[4], t[2] = e[8], t[3] = e[12], t[4] = n, t[6] = e[9], t[7] = e[13], t[8] = o, t[9] = r, t[11] = e[14], t[12] = i, t[13] = a, t[14] = s
            } else t[0] = e[0], t[1] = e[4], t[2] = e[8], t[3] = e[12], t[4] = e[1], t[5] = e[5], t[6] = e[9], t[7] = e[13], t[8] = e[2], t[9] = e[6], t[10] = e[10], t[11] = e[14], t[12] = e[3], t[13] = e[7], t[14] = e[11], t[15] = e[15];
            return t
        }, i.SIMD.transpose = function(t, e) {
            var n, o, i, r, a, s, u, l, c, d;
            return n = SIMD.Float32x4.load(e, 0), o = SIMD.Float32x4.load(e, 4), i = SIMD.Float32x4.load(e, 8), r = SIMD.Float32x4.load(e, 12), a = SIMD.Float32x4.shuffle(n, o, 0, 1, 4, 5), s = SIMD.Float32x4.shuffle(i, r, 0, 1, 4, 5), u = SIMD.Float32x4.shuffle(a, s, 0, 2, 4, 6), l = SIMD.Float32x4.shuffle(a, s, 1, 3, 5, 7), SIMD.Float32x4.store(t, 0, u), SIMD.Float32x4.store(t, 4, l), a = SIMD.Float32x4.shuffle(n, o, 2, 3, 6, 7), s = SIMD.Float32x4.shuffle(i, r, 2, 3, 6, 7), c = SIMD.Float32x4.shuffle(a, s, 0, 2, 4, 6), d = SIMD.Float32x4.shuffle(a, s, 1, 3, 5, 7), SIMD.Float32x4.store(t, 8, c), SIMD.Float32x4.store(t, 12, d), t
        }, i.transpose = o.USE_SIMD ? i.SIMD.transpose : i.scalar.transpose, i.scalar.invert = function(t, e) {
            var n = e[0],
                o = e[1],
                i = e[2],
                r = e[3],
                a = e[4],
                s = e[5],
                u = e[6],
                l = e[7],
                c = e[8],
                d = e[9],
                h = e[10],
                p = e[11],
                f = e[12],
                m = e[13],
                v = e[14],
                g = e[15],
                _ = n * s - o * a,
                x = n * u - i * a,
                b = n * l - r * a,
                y = o * u - i * s,
                M = o * l - r * s,
                S = i * l - r * u,
                w = c * m - d * f,
                E = c * v - h * f,
                I = c * g - p * f,
                D = d * v - h * m,
                A = d * g - p * m,
                F = h * g - p * v,
                R = _ * F - x * A + b * D + y * I - M * E + S * w;
            return R ? (R = 1 / R, t[0] = (s * F - u * A + l * D) * R, t[1] = (i * A - o * F - r * D) * R, t[2] = (m * S - v * M + g * y) * R, t[3] = (h * M - d * S - p * y) * R, t[4] = (u * I - a * F - l * E) * R, t[5] = (n * F - i * I + r * E) * R, t[6] = (v * b - f * S - g * x) * R, t[7] = (c * S - h * b + p * x) * R, t[8] = (a * A - s * I + l * w) * R, t[9] = (o * I - n * A - r * w) * R, t[10] = (f * M - m * b + g * _) * R, t[11] = (d * b - c * M - p * _) * R, t[12] = (s * E - a * D - u * w) * R, t[13] = (n * D - o * E + i * w) * R, t[14] = (m * x - f * y - v * _) * R, t[15] = (c * y - d * x + h * _) * R, t) : null
        }, i.SIMD.invert = function(t, e) {
            var n, o, i, r, a, s, u, l, c, d, h = SIMD.Float32x4.load(e, 0),
                p = SIMD.Float32x4.load(e, 4),
                f = SIMD.Float32x4.load(e, 8),
                m = SIMD.Float32x4.load(e, 12);
            return a = SIMD.Float32x4.shuffle(h, p, 0, 1, 4, 5), o = SIMD.Float32x4.shuffle(f, m, 0, 1, 4, 5), n = SIMD.Float32x4.shuffle(a, o, 0, 2, 4, 6), o = SIMD.Float32x4.shuffle(o, a, 1, 3, 5, 7), a = SIMD.Float32x4.shuffle(h, p, 2, 3, 6, 7), r = SIMD.Float32x4.shuffle(f, m, 2, 3, 6, 7), i = SIMD.Float32x4.shuffle(a, r, 0, 2, 4, 6), r = SIMD.Float32x4.shuffle(r, a, 1, 3, 5, 7), a = SIMD.Float32x4.mul(i, r), a = SIMD.Float32x4.swizzle(a, 1, 0, 3, 2), s = SIMD.Float32x4.mul(o, a), u = SIMD.Float32x4.mul(n, a), a = SIMD.Float32x4.swizzle(a, 2, 3, 0, 1), s = SIMD.Float32x4.sub(SIMD.Float32x4.mul(o, a), s), u = SIMD.Float32x4.sub(SIMD.Float32x4.mul(n, a), u), u = SIMD.Float32x4.swizzle(u, 2, 3, 0, 1), a = SIMD.Float32x4.mul(o, i), a = SIMD.Float32x4.swizzle(a, 1, 0, 3, 2), s = SIMD.Float32x4.add(SIMD.Float32x4.mul(r, a), s), c = SIMD.Float32x4.mul(n, a), a = SIMD.Float32x4.swizzle(a, 2, 3, 0, 1), s = SIMD.Float32x4.sub(s, SIMD.Float32x4.mul(r, a)), c = SIMD.Float32x4.sub(SIMD.Float32x4.mul(n, a), c), c = SIMD.Float32x4.swizzle(c, 2, 3, 0, 1), a = SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(o, 2, 3, 0, 1), r), a = SIMD.Float32x4.swizzle(a, 1, 0, 3, 2), i = SIMD.Float32x4.swizzle(i, 2, 3, 0, 1), s = SIMD.Float32x4.add(SIMD.Float32x4.mul(i, a), s), l = SIMD.Float32x4.mul(n, a), a = SIMD.Float32x4.swizzle(a, 2, 3, 0, 1), s = SIMD.Float32x4.sub(s, SIMD.Float32x4.mul(i, a)), l = SIMD.Float32x4.sub(SIMD.Float32x4.mul(n, a), l), l = SIMD.Float32x4.swizzle(l, 2, 3, 0, 1), a = SIMD.Float32x4.mul(n, o), a = SIMD.Float32x4.swizzle(a, 1, 0, 3, 2), l = SIMD.Float32x4.add(SIMD.Float32x4.mul(r, a), l), c = SIMD.Float32x4.sub(SIMD.Float32x4.mul(i, a), c), a = SIMD.Float32x4.swizzle(a, 2, 3, 0, 1), l = SIMD.Float32x4.sub(SIMD.Float32x4.mul(r, a), l), c = SIMD.Float32x4.sub(c, SIMD.Float32x4.mul(i, a)), a = SIMD.Float32x4.mul(n, r), a = SIMD.Float32x4.swizzle(a, 1, 0, 3, 2), u = SIMD.Float32x4.sub(u, SIMD.Float32x4.mul(i, a)), l = SIMD.Float32x4.add(SIMD.Float32x4.mul(o, a), l), a = SIMD.Float32x4.swizzle(a, 2, 3, 0, 1), u = SIMD.Float32x4.add(SIMD.Float32x4.mul(i, a), u), l = SIMD.Float32x4.sub(l, SIMD.Float32x4.mul(o, a)), a = SIMD.Float32x4.mul(n, i), a = SIMD.Float32x4.swizzle(a, 1, 0, 3, 2), u = SIMD.Float32x4.add(SIMD.Float32x4.mul(r, a), u), c = SIMD.Float32x4.sub(c, SIMD.Float32x4.mul(o, a)), a = SIMD.Float32x4.swizzle(a, 2, 3, 0, 1), u = SIMD.Float32x4.sub(u, SIMD.Float32x4.mul(r, a)), c = SIMD.Float32x4.add(SIMD.Float32x4.mul(o, a), c), d = SIMD.Float32x4.mul(n, s), d = SIMD.Float32x4.add(SIMD.Float32x4.swizzle(d, 2, 3, 0, 1), d), d = SIMD.Float32x4.add(SIMD.Float32x4.swizzle(d, 1, 0, 3, 2), d), a = SIMD.Float32x4.reciprocalApproximation(d), d = SIMD.Float32x4.sub(SIMD.Float32x4.add(a, a), SIMD.Float32x4.mul(d, SIMD.Float32x4.mul(a, a))), (d = SIMD.Float32x4.swizzle(d, 0, 0, 0, 0)) ? (SIMD.Float32x4.store(t, 0, SIMD.Float32x4.mul(d, s)), SIMD.Float32x4.store(t, 4, SIMD.Float32x4.mul(d, u)), SIMD.Float32x4.store(t, 8, SIMD.Float32x4.mul(d, l)), SIMD.Float32x4.store(t, 12, SIMD.Float32x4.mul(d, c)), t) : null
        }, i.invert = o.USE_SIMD ? i.SIMD.invert : i.scalar.invert, i.scalar.adjoint = function(t, e) {
            var n = e[0],
                o = e[1],
                i = e[2],
                r = e[3],
                a = e[4],
                s = e[5],
                u = e[6],
                l = e[7],
                c = e[8],
                d = e[9],
                h = e[10],
                p = e[11],
                f = e[12],
                m = e[13],
                v = e[14],
                g = e[15];
            return t[0] = s * (h * g - p * v) - d * (u * g - l * v) + m * (u * p - l * h), t[1] = -(o * (h * g - p * v) - d * (i * g - r * v) + m * (i * p - r * h)), t[2] = o * (u * g - l * v) - s * (i * g - r * v) + m * (i * l - r * u), t[3] = -(o * (u * p - l * h) - s * (i * p - r * h) + d * (i * l - r * u)), t[4] = -(a * (h * g - p * v) - c * (u * g - l * v) + f * (u * p - l * h)), t[5] = n * (h * g - p * v) - c * (i * g - r * v) + f * (i * p - r * h), t[6] = -(n * (u * g - l * v) - a * (i * g - r * v) + f * (i * l - r * u)), t[7] = n * (u * p - l * h) - a * (i * p - r * h) + c * (i * l - r * u), t[8] = a * (d * g - p * m) - c * (s * g - l * m) + f * (s * p - l * d), t[9] = -(n * (d * g - p * m) - c * (o * g - r * m) + f * (o * p - r * d)), t[10] = n * (s * g - l * m) - a * (o * g - r * m) + f * (o * l - r * s), t[11] = -(n * (s * p - l * d) - a * (o * p - r * d) + c * (o * l - r * s)), t[12] = -(a * (d * v - h * m) - c * (s * v - u * m) + f * (s * h - u * d)), t[13] = n * (d * v - h * m) - c * (o * v - i * m) + f * (o * h - i * d), t[14] = -(n * (s * v - u * m) - a * (o * v - i * m) + f * (o * u - i * s)), t[15] = n * (s * h - u * d) - a * (o * h - i * d) + c * (o * u - i * s), t
        }, i.SIMD.adjoint = function(t, e) {
            var n, o, i, r, a, s, u, l, c, d, h, p, f, n = SIMD.Float32x4.load(e, 0),
                o = SIMD.Float32x4.load(e, 4),
                i = SIMD.Float32x4.load(e, 8),
                r = SIMD.Float32x4.load(e, 12);
            return c = SIMD.Float32x4.shuffle(n, o, 0, 1, 4, 5), s = SIMD.Float32x4.shuffle(i, r, 0, 1, 4, 5), a = SIMD.Float32x4.shuffle(c, s, 0, 2, 4, 6), s = SIMD.Float32x4.shuffle(s, c, 1, 3, 5, 7), c = SIMD.Float32x4.shuffle(n, o, 2, 3, 6, 7), l = SIMD.Float32x4.shuffle(i, r, 2, 3, 6, 7), u = SIMD.Float32x4.shuffle(c, l, 0, 2, 4, 6), l = SIMD.Float32x4.shuffle(l, c, 1, 3, 5, 7), c = SIMD.Float32x4.mul(u, l), c = SIMD.Float32x4.swizzle(c, 1, 0, 3, 2), d = SIMD.Float32x4.mul(s, c), h = SIMD.Float32x4.mul(a, c), c = SIMD.Float32x4.swizzle(c, 2, 3, 0, 1), d = SIMD.Float32x4.sub(SIMD.Float32x4.mul(s, c), d), h = SIMD.Float32x4.sub(SIMD.Float32x4.mul(a, c), h), h = SIMD.Float32x4.swizzle(h, 2, 3, 0, 1), c = SIMD.Float32x4.mul(s, u), c = SIMD.Float32x4.swizzle(c, 1, 0, 3, 2), d = SIMD.Float32x4.add(SIMD.Float32x4.mul(l, c), d), f = SIMD.Float32x4.mul(a, c), c = SIMD.Float32x4.swizzle(c, 2, 3, 0, 1), d = SIMD.Float32x4.sub(d, SIMD.Float32x4.mul(l, c)), f = SIMD.Float32x4.sub(SIMD.Float32x4.mul(a, c), f), f = SIMD.Float32x4.swizzle(f, 2, 3, 0, 1), c = SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(s, 2, 3, 0, 1), l), c = SIMD.Float32x4.swizzle(c, 1, 0, 3, 2), u = SIMD.Float32x4.swizzle(u, 2, 3, 0, 1), d = SIMD.Float32x4.add(SIMD.Float32x4.mul(u, c), d), p = SIMD.Float32x4.mul(a, c), c = SIMD.Float32x4.swizzle(c, 2, 3, 0, 1), d = SIMD.Float32x4.sub(d, SIMD.Float32x4.mul(u, c)), p = SIMD.Float32x4.sub(SIMD.Float32x4.mul(a, c), p), p = SIMD.Float32x4.swizzle(p, 2, 3, 0, 1), c = SIMD.Float32x4.mul(a, s), c = SIMD.Float32x4.swizzle(c, 1, 0, 3, 2), p = SIMD.Float32x4.add(SIMD.Float32x4.mul(l, c), p), f = SIMD.Float32x4.sub(SIMD.Float32x4.mul(u, c), f), c = SIMD.Float32x4.swizzle(c, 2, 3, 0, 1), p = SIMD.Float32x4.sub(SIMD.Float32x4.mul(l, c), p), f = SIMD.Float32x4.sub(f, SIMD.Float32x4.mul(u, c)), c = SIMD.Float32x4.mul(a, l), c = SIMD.Float32x4.swizzle(c, 1, 0, 3, 2), h = SIMD.Float32x4.sub(h, SIMD.Float32x4.mul(u, c)), p = SIMD.Float32x4.add(SIMD.Float32x4.mul(s, c), p), c = SIMD.Float32x4.swizzle(c, 2, 3, 0, 1), h = SIMD.Float32x4.add(SIMD.Float32x4.mul(u, c), h), p = SIMD.Float32x4.sub(p, SIMD.Float32x4.mul(s, c)), c = SIMD.Float32x4.mul(a, u), c = SIMD.Float32x4.swizzle(c, 1, 0, 3, 2), h = SIMD.Float32x4.add(SIMD.Float32x4.mul(l, c), h), f = SIMD.Float32x4.sub(f, SIMD.Float32x4.mul(s, c)), c = SIMD.Float32x4.swizzle(c, 2, 3, 0, 1), h = SIMD.Float32x4.sub(h, SIMD.Float32x4.mul(l, c)), f = SIMD.Float32x4.add(SIMD.Float32x4.mul(s, c), f), SIMD.Float32x4.store(t, 0, d), SIMD.Float32x4.store(t, 4, h), SIMD.Float32x4.store(t, 8, p), SIMD.Float32x4.store(t, 12, f), t
        }, i.adjoint = o.USE_SIMD ? i.SIMD.adjoint : i.scalar.adjoint, i.determinant = function(t) {
            var e = t[0],
                n = t[1],
                o = t[2],
                i = t[3],
                r = t[4],
                a = t[5],
                s = t[6],
                u = t[7],
                l = t[8],
                c = t[9],
                d = t[10],
                h = t[11],
                p = t[12],
                f = t[13],
                m = t[14],
                v = t[15];
            return (e * a - n * r) * (d * v - h * m) - (e * s - o * r) * (c * v - h * f) + (e * u - i * r) * (c * m - d * f) + (n * s - o * a) * (l * v - h * p) - (n * u - i * a) * (l * m - d * p) + (o * u - i * s) * (l * f - c * p)
        }, i.SIMD.multiply = function(t, e, n) {
            var o = SIMD.Float32x4.load(e, 0),
                i = SIMD.Float32x4.load(e, 4),
                r = SIMD.Float32x4.load(e, 8),
                a = SIMD.Float32x4.load(e, 12),
                s = SIMD.Float32x4.load(n, 0),
                u = SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(s, 0, 0, 0, 0), o), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(s, 1, 1, 1, 1), i), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(s, 2, 2, 2, 2), r), SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(s, 3, 3, 3, 3), a))));
            SIMD.Float32x4.store(t, 0, u);
            var l = SIMD.Float32x4.load(n, 4),
                c = SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(l, 0, 0, 0, 0), o), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(l, 1, 1, 1, 1), i), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(l, 2, 2, 2, 2), r), SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(l, 3, 3, 3, 3), a))));
            SIMD.Float32x4.store(t, 4, c);
            var d = SIMD.Float32x4.load(n, 8),
                h = SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(d, 0, 0, 0, 0), o), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(d, 1, 1, 1, 1), i), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(d, 2, 2, 2, 2), r), SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(d, 3, 3, 3, 3), a))));
            SIMD.Float32x4.store(t, 8, h);
            var p = SIMD.Float32x4.load(n, 12),
                f = SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(p, 0, 0, 0, 0), o), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(p, 1, 1, 1, 1), i), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(p, 2, 2, 2, 2), r), SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(p, 3, 3, 3, 3), a))));
            return SIMD.Float32x4.store(t, 12, f), t
        }, i.scalar.multiply = function(t, e, n) {
            var o = e[0],
                i = e[1],
                r = e[2],
                a = e[3],
                s = e[4],
                u = e[5],
                l = e[6],
                c = e[7],
                d = e[8],
                h = e[9],
                p = e[10],
                f = e[11],
                m = e[12],
                v = e[13],
                g = e[14],
                _ = e[15],
                x = n[0],
                b = n[1],
                y = n[2],
                M = n[3];
            return t[0] = x * o + b * s + y * d + M * m, t[1] = x * i + b * u + y * h + M * v, t[2] = x * r + b * l + y * p + M * g, t[3] = x * a + b * c + y * f + M * _, x = n[4], b = n[5], y = n[6], M = n[7], t[4] = x * o + b * s + y * d + M * m, t[5] = x * i + b * u + y * h + M * v, t[6] = x * r + b * l + y * p + M * g, t[7] = x * a + b * c + y * f + M * _, x = n[8], b = n[9], y = n[10], M = n[11], t[8] = x * o + b * s + y * d + M * m, t[9] = x * i + b * u + y * h + M * v, t[10] = x * r + b * l + y * p + M * g, t[11] = x * a + b * c + y * f + M * _, x = n[12], b = n[13], y = n[14], M = n[15], t[12] = x * o + b * s + y * d + M * m, t[13] = x * i + b * u + y * h + M * v, t[14] = x * r + b * l + y * p + M * g, t[15] = x * a + b * c + y * f + M * _, t
        }, i.multiply = o.USE_SIMD ? i.SIMD.multiply : i.scalar.multiply, i.mul = i.multiply, i.scalar.translate = function(t, e, n) {
            var o, i, r, a, s, u, l, c, d, h, p, f, m = n[0],
                v = n[1],
                g = n[2];
            return e === t ? (t[12] = e[0] * m + e[4] * v + e[8] * g + e[12], t[13] = e[1] * m + e[5] * v + e[9] * g + e[13], t[14] = e[2] * m + e[6] * v + e[10] * g + e[14], t[15] = e[3] * m + e[7] * v + e[11] * g + e[15]) : (o = e[0], i = e[1], r = e[2], a = e[3], s = e[4], u = e[5], l = e[6], c = e[7], d = e[8], h = e[9], p = e[10], f = e[11], t[0] = o, t[1] = i, t[2] = r, t[3] = a, t[4] = s, t[5] = u, t[6] = l, t[7] = c, t[8] = d, t[9] = h, t[10] = p, t[11] = f, t[12] = o * m + s * v + d * g + e[12], t[13] = i * m + u * v + h * g + e[13], t[14] = r * m + l * v + p * g + e[14], t[15] = a * m + c * v + f * g + e[15]), t
        }, i.SIMD.translate = function(t, e, n) {
            var o = SIMD.Float32x4.load(e, 0),
                i = SIMD.Float32x4.load(e, 4),
                r = SIMD.Float32x4.load(e, 8),
                a = SIMD.Float32x4.load(e, 12),
                s = SIMD.Float32x4(n[0], n[1], n[2], 0);
            e !== t && (t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t[9] = e[9], t[10] = e[10], t[11] = e[11]), o = SIMD.Float32x4.mul(o, SIMD.Float32x4.swizzle(s, 0, 0, 0, 0)), i = SIMD.Float32x4.mul(i, SIMD.Float32x4.swizzle(s, 1, 1, 1, 1)), r = SIMD.Float32x4.mul(r, SIMD.Float32x4.swizzle(s, 2, 2, 2, 2));
            var u = SIMD.Float32x4.add(o, SIMD.Float32x4.add(i, SIMD.Float32x4.add(r, a)));
            return SIMD.Float32x4.store(t, 12, u), t
        }, i.translate = o.USE_SIMD ? i.SIMD.translate : i.scalar.translate, i.scalar.scale = function(t, e, n) {
            var o = n[0],
                i = n[1],
                r = n[2];
            return t[0] = e[0] * o, t[1] = e[1] * o, t[2] = e[2] * o, t[3] = e[3] * o, t[4] = e[4] * i, t[5] = e[5] * i, t[6] = e[6] * i, t[7] = e[7] * i, t[8] = e[8] * r, t[9] = e[9] * r, t[10] = e[10] * r, t[11] = e[11] * r, t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15], t
        }, i.SIMD.scale = function(t, e, n) {
            var o, i, r, a = SIMD.Float32x4(n[0], n[1], n[2], 0);
            return o = SIMD.Float32x4.load(e, 0), SIMD.Float32x4.store(t, 0, SIMD.Float32x4.mul(o, SIMD.Float32x4.swizzle(a, 0, 0, 0, 0))), i = SIMD.Float32x4.load(e, 4), SIMD.Float32x4.store(t, 4, SIMD.Float32x4.mul(i, SIMD.Float32x4.swizzle(a, 1, 1, 1, 1))), r = SIMD.Float32x4.load(e, 8), SIMD.Float32x4.store(t, 8, SIMD.Float32x4.mul(r, SIMD.Float32x4.swizzle(a, 2, 2, 2, 2))), t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15], t
        }, i.scale = o.USE_SIMD ? i.SIMD.scale : i.scalar.scale, i.rotate = function(t, e, n, i) {
            var r, a, s, u, l, c, d, h, p, f, m, v, g, _, x, b, y, M, S, w, E, I, D, A, F = i[0],
                R = i[1],
                P = i[2],
                T = Math.sqrt(F * F + R * R + P * P);
            return Math.abs(T) < o.EPSILON ? null : (T = 1 / T, F *= T, R *= T, P *= T, r = Math.sin(n), a = Math.cos(n), s = 1 - a, u = e[0], l = e[1], c = e[2], d = e[3], h = e[4], p = e[5], f = e[6], m = e[7], v = e[8], g = e[9], _ = e[10], x = e[11], b = F * F * s + a, y = R * F * s + P * r, M = P * F * s - R * r, S = F * R * s - P * r, w = R * R * s + a, E = P * R * s + F * r, I = F * P * s + R * r, D = R * P * s - F * r, A = P * P * s + a, t[0] = u * b + h * y + v * M, t[1] = l * b + p * y + g * M, t[2] = c * b + f * y + _ * M, t[3] = d * b + m * y + x * M, t[4] = u * S + h * w + v * E, t[5] = l * S + p * w + g * E, t[6] = c * S + f * w + _ * E, t[7] = d * S + m * w + x * E, t[8] = u * I + h * D + v * A, t[9] = l * I + p * D + g * A, t[10] = c * I + f * D + _ * A, t[11] = d * I + m * D + x * A, e !== t && (t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15]), t)
        }, i.scalar.rotateX = function(t, e, n) {
            var o = Math.sin(n),
                i = Math.cos(n),
                r = e[4],
                a = e[5],
                s = e[6],
                u = e[7],
                l = e[8],
                c = e[9],
                d = e[10],
                h = e[11];
            return e !== t && (t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15]), t[4] = r * i + l * o, t[5] = a * i + c * o, t[6] = s * i + d * o, t[7] = u * i + h * o, t[8] = l * i - r * o, t[9] = c * i - a * o, t[10] = d * i - s * o, t[11] = h * i - u * o, t
        }, i.SIMD.rotateX = function(t, e, n) {
            var o = SIMD.Float32x4.splat(Math.sin(n)),
                i = SIMD.Float32x4.splat(Math.cos(n));
            e !== t && (t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15]);
            var r = SIMD.Float32x4.load(e, 4),
                a = SIMD.Float32x4.load(e, 8);
            return SIMD.Float32x4.store(t, 4, SIMD.Float32x4.add(SIMD.Float32x4.mul(r, i), SIMD.Float32x4.mul(a, o))), SIMD.Float32x4.store(t, 8, SIMD.Float32x4.sub(SIMD.Float32x4.mul(a, i), SIMD.Float32x4.mul(r, o))), t
        }, i.rotateX = o.USE_SIMD ? i.SIMD.rotateX : i.scalar.rotateX, i.scalar.rotateY = function(t, e, n) {
            var o = Math.sin(n),
                i = Math.cos(n),
                r = e[0],
                a = e[1],
                s = e[2],
                u = e[3],
                l = e[8],
                c = e[9],
                d = e[10],
                h = e[11];
            return e !== t && (t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15]), t[0] = r * i - l * o, t[1] = a * i - c * o, t[2] = s * i - d * o, t[3] = u * i - h * o, t[8] = r * o + l * i, t[9] = a * o + c * i, t[10] = s * o + d * i, t[11] = u * o + h * i, t
        }, i.SIMD.rotateY = function(t, e, n) {
            var o = SIMD.Float32x4.splat(Math.sin(n)),
                i = SIMD.Float32x4.splat(Math.cos(n));
            e !== t && (t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15]);
            var r = SIMD.Float32x4.load(e, 0),
                a = SIMD.Float32x4.load(e, 8);
            return SIMD.Float32x4.store(t, 0, SIMD.Float32x4.sub(SIMD.Float32x4.mul(r, i), SIMD.Float32x4.mul(a, o))), SIMD.Float32x4.store(t, 8, SIMD.Float32x4.add(SIMD.Float32x4.mul(r, o), SIMD.Float32x4.mul(a, i))), t
        }, i.rotateY = o.USE_SIMD ? i.SIMD.rotateY : i.scalar.rotateY, i.scalar.rotateZ = function(t, e, n) {
            var o = Math.sin(n),
                i = Math.cos(n),
                r = e[0],
                a = e[1],
                s = e[2],
                u = e[3],
                l = e[4],
                c = e[5],
                d = e[6],
                h = e[7];
            return e !== t && (t[8] = e[8], t[9] = e[9], t[10] = e[10], t[11] = e[11], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15]), t[0] = r * i + l * o, t[1] = a * i + c * o, t[2] = s * i + d * o, t[3] = u * i + h * o, t[4] = l * i - r * o, t[5] = c * i - a * o, t[6] = d * i - s * o, t[7] = h * i - u * o, t
        }, i.SIMD.rotateZ = function(t, e, n) {
            var o = SIMD.Float32x4.splat(Math.sin(n)),
                i = SIMD.Float32x4.splat(Math.cos(n));
            e !== t && (t[8] = e[8], t[9] = e[9], t[10] = e[10], t[11] = e[11], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15]);
            var r = SIMD.Float32x4.load(e, 0),
                a = SIMD.Float32x4.load(e, 4);
            return SIMD.Float32x4.store(t, 0, SIMD.Float32x4.add(SIMD.Float32x4.mul(r, i), SIMD.Float32x4.mul(a, o))), SIMD.Float32x4.store(t, 4, SIMD.Float32x4.sub(SIMD.Float32x4.mul(a, i), SIMD.Float32x4.mul(r, o))), t
        }, i.rotateZ = o.USE_SIMD ? i.SIMD.rotateZ : i.scalar.rotateZ, i.fromTranslation = function(t, e) {
            return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = e[0], t[13] = e[1], t[14] = e[2], t[15] = 1, t
        }, i.fromScaling = function(t, e) {
            return t[0] = e[0], t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = e[1], t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = e[2], t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
        }, i.fromRotation = function(t, e, n) {
            var i, r, a, s = n[0],
                u = n[1],
                l = n[2],
                c = Math.sqrt(s * s + u * u + l * l);
            return Math.abs(c) < o.EPSILON ? null : (c = 1 / c, s *= c, u *= c, l *= c, i = Math.sin(e), r = Math.cos(e), a = 1 - r, t[0] = s * s * a + r, t[1] = u * s * a + l * i, t[2] = l * s * a - u * i, t[3] = 0, t[4] = s * u * a - l * i, t[5] = u * u * a + r, t[6] = l * u * a + s * i, t[7] = 0, t[8] = s * l * a + u * i, t[9] = u * l * a - s * i, t[10] = l * l * a + r, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t)
        }, i.fromXRotation = function(t, e) {
            var n = Math.sin(e),
                o = Math.cos(e);
            return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = o, t[6] = n, t[7] = 0, t[8] = 0, t[9] = -n, t[10] = o, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
        }, i.fromYRotation = function(t, e) {
            var n = Math.sin(e),
                o = Math.cos(e);
            return t[0] = o, t[1] = 0, t[2] = -n, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = n, t[9] = 0, t[10] = o, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
        }, i.fromZRotation = function(t, e) {
            var n = Math.sin(e),
                o = Math.cos(e);
            return t[0] = o, t[1] = n, t[2] = 0, t[3] = 0, t[4] = -n, t[5] = o, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
        }, i.fromRotationTranslation = function(t, e, n) {
            var o = e[0],
                i = e[1],
                r = e[2],
                a = e[3],
                s = o + o,
                u = i + i,
                l = r + r,
                c = o * s,
                d = o * u,
                h = o * l,
                p = i * u,
                f = i * l,
                m = r * l,
                v = a * s,
                g = a * u,
                _ = a * l;
            return t[0] = 1 - (p + m), t[1] = d + _, t[2] = h - g, t[3] = 0, t[4] = d - _, t[5] = 1 - (c + m), t[6] = f + v, t[7] = 0, t[8] = h + g, t[9] = f - v, t[10] = 1 - (c + p), t[11] = 0, t[12] = n[0], t[13] = n[1], t[14] = n[2], t[15] = 1, t
        }, i.getTranslation = function(t, e) {
            return t[0] = e[12], t[1] = e[13], t[2] = e[14], t
        }, i.getRotation = function(t, e) {
            var n = e[0] + e[5] + e[10],
                o = 0;
            return n > 0 ? (o = 2 * Math.sqrt(n + 1), t[3] = .25 * o, t[0] = (e[6] - e[9]) / o, t[1] = (e[8] - e[2]) / o, t[2] = (e[1] - e[4]) / o) : e[0] > e[5] & e[0] > e[10] ? (o = 2 * Math.sqrt(1 + e[0] - e[5] - e[10]), t[3] = (e[6] - e[9]) / o, t[0] = .25 * o, t[1] = (e[1] + e[4]) / o, t[2] = (e[8] + e[2]) / o) : e[5] > e[10] ? (o = 2 * Math.sqrt(1 + e[5] - e[0] - e[10]), t[3] = (e[8] - e[2]) / o, t[0] = (e[1] + e[4]) / o, t[1] = .25 * o, t[2] = (e[6] + e[9]) / o) : (o = 2 * Math.sqrt(1 + e[10] - e[0] - e[5]), t[3] = (e[1] - e[4]) / o, t[0] = (e[8] + e[2]) / o, t[1] = (e[6] + e[9]) / o, t[2] = .25 * o), t
        }, i.fromRotationTranslationScale = function(t, e, n, o) {
            var i = e[0],
                r = e[1],
                a = e[2],
                s = e[3],
                u = i + i,
                l = r + r,
                c = a + a,
                d = i * u,
                h = i * l,
                p = i * c,
                f = r * l,
                m = r * c,
                v = a * c,
                g = s * u,
                _ = s * l,
                x = s * c,
                b = o[0],
                y = o[1],
                M = o[2];
            return t[0] = (1 - (f + v)) * b, t[1] = (h + x) * b, t[2] = (p - _) * b, t[3] = 0, t[4] = (h - x) * y, t[5] = (1 - (d + v)) * y, t[6] = (m + g) * y, t[7] = 0, t[8] = (p + _) * M, t[9] = (m - g) * M, t[10] = (1 - (d + f)) * M, t[11] = 0, t[12] = n[0], t[13] = n[1], t[14] = n[2], t[15] = 1, t
        }, i.fromRotationTranslationScaleOrigin = function(t, e, n, o, i) {
            var r = e[0],
                a = e[1],
                s = e[2],
                u = e[3],
                l = r + r,
                c = a + a,
                d = s + s,
                h = r * l,
                p = r * c,
                f = r * d,
                m = a * c,
                v = a * d,
                g = s * d,
                _ = u * l,
                x = u * c,
                b = u * d,
                y = o[0],
                M = o[1],
                S = o[2],
                w = i[0],
                E = i[1],
                I = i[2];
            return t[0] = (1 - (m + g)) * y, t[1] = (p + b) * y, t[2] = (f - x) * y, t[3] = 0, t[4] = (p - b) * M, t[5] = (1 - (h + g)) * M, t[6] = (v + _) * M, t[7] = 0, t[8] = (f + x) * S, t[9] = (v - _) * S, t[10] = (1 - (h + m)) * S, t[11] = 0, t[12] = n[0] + w - (t[0] * w + t[4] * E + t[8] * I), t[13] = n[1] + E - (t[1] * w + t[5] * E + t[9] * I), t[14] = n[2] + I - (t[2] * w + t[6] * E + t[10] * I), t[15] = 1, t
        }, i.fromQuat = function(t, e) {
            var n = e[0],
                o = e[1],
                i = e[2],
                r = e[3],
                a = n + n,
                s = o + o,
                u = i + i,
                l = n * a,
                c = o * a,
                d = o * s,
                h = i * a,
                p = i * s,
                f = i * u,
                m = r * a,
                v = r * s,
                g = r * u;
            return t[0] = 1 - d - f, t[1] = c + g, t[2] = h - v, t[3] = 0, t[4] = c - g, t[5] = 1 - l - f, t[6] = p + m, t[7] = 0, t[8] = h + v, t[9] = p - m, t[10] = 1 - l - d, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
        }, i.frustum = function(t, e, n, o, i, r, a) {
            var s = 1 / (n - e),
                u = 1 / (i - o),
                l = 1 / (r - a);
            return t[0] = 2 * r * s, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 2 * r * u, t[6] = 0, t[7] = 0, t[8] = (n + e) * s, t[9] = (i + o) * u, t[10] = (a + r) * l, t[11] = -1, t[12] = 0, t[13] = 0, t[14] = a * r * 2 * l, t[15] = 0, t
        }, i.perspective = function(t, e, n, o, i) {
            var r = 1 / Math.tan(e / 2),
                a = 1 / (o - i);
            return t[0] = r / n, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = r, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = (i + o) * a, t[11] = -1, t[12] = 0, t[13] = 0, t[14] = 2 * i * o * a, t[15] = 0, t
        }, i.perspectiveFromFieldOfView = function(t, e, n, o) {
            var i = Math.tan(e.upDegrees * Math.PI / 180),
                r = Math.tan(e.downDegrees * Math.PI / 180),
                a = Math.tan(e.leftDegrees * Math.PI / 180),
                s = Math.tan(e.rightDegrees * Math.PI / 180),
                u = 2 / (a + s),
                l = 2 / (i + r);
            return t[0] = u, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = l, t[6] = 0, t[7] = 0, t[8] = -(a - s) * u * .5, t[9] = (i - r) * l * .5, t[10] = o / (n - o), t[11] = -1, t[12] = 0, t[13] = 0, t[14] = o * n / (n - o), t[15] = 0, t
        }, i.ortho = function(t, e, n, o, i, r, a) {
            var s = 1 / (e - n),
                u = 1 / (o - i),
                l = 1 / (r - a);
            return t[0] = -2 * s, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = -2 * u, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 2 * l, t[11] = 0, t[12] = (e + n) * s, t[13] = (i + o) * u, t[14] = (a + r) * l, t[15] = 1, t
        }, i.lookAt = function(t, e, n, r) {
            var a, s, u, l, c, d, h, p, f, m, v = e[0],
                g = e[1],
                _ = e[2],
                x = r[0],
                b = r[1],
                y = r[2],
                M = n[0],
                S = n[1],
                w = n[2];
            return Math.abs(v - M) < o.EPSILON && Math.abs(g - S) < o.EPSILON && Math.abs(_ - w) < o.EPSILON ? i.identity(t) : (h = v - M, p = g - S, f = _ - w, m = 1 / Math.sqrt(h * h + p * p + f * f), h *= m, p *= m, f *= m, a = b * f - y * p, s = y * h - x * f, u = x * p - b * h, m = Math.sqrt(a * a + s * s + u * u), m ? (m = 1 / m, a *= m, s *= m, u *= m) : (a = 0, s = 0, u = 0), l = p * u - f * s, c = f * a - h * u, d = h * s - p * a, m = Math.sqrt(l * l + c * c + d * d), m ? (m = 1 / m, l *= m, c *= m, d *= m) : (l = 0, c = 0, d = 0), t[0] = a, t[1] = l, t[2] = h, t[3] = 0, t[4] = s, t[5] = c, t[6] = p, t[7] = 0, t[8] = u, t[9] = d, t[10] = f, t[11] = 0, t[12] = -(a * v + s * g + u * _), t[13] = -(l * v + c * g + d * _), t[14] = -(h * v + p * g + f * _), t[15] = 1, t)
        }, i.str = function(t) {
            return "mat4(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ", " + t[6] + ", " + t[7] + ", " + t[8] + ", " + t[9] + ", " + t[10] + ", " + t[11] + ", " + t[12] + ", " + t[13] + ", " + t[14] + ", " + t[15] + ")"
        }, i.frob = function(t) {
            return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2) + Math.pow(t[4], 2) + Math.pow(t[5], 2) + Math.pow(t[6], 2) + Math.pow(t[7], 2) + Math.pow(t[8], 2) + Math.pow(t[9], 2) + Math.pow(t[10], 2) + Math.pow(t[11], 2) + Math.pow(t[12], 2) + Math.pow(t[13], 2) + Math.pow(t[14], 2) + Math.pow(t[15], 2))
        }, i.add = function(t, e, n) {
            return t[0] = e[0] + n[0], t[1] = e[1] + n[1], t[2] = e[2] + n[2], t[3] = e[3] + n[3], t[4] = e[4] + n[4], t[5] = e[5] + n[5], t[6] = e[6] + n[6], t[7] = e[7] + n[7], t[8] = e[8] + n[8], t[9] = e[9] + n[9], t[10] = e[10] + n[10], t[11] = e[11] + n[11], t[12] = e[12] + n[12], t[13] = e[13] + n[13], t[14] = e[14] + n[14], t[15] = e[15] + n[15], t
        }, i.subtract = function(t, e, n) {
            return t[0] = e[0] - n[0], t[1] = e[1] - n[1], t[2] = e[2] - n[2], t[3] = e[3] - n[3], t[4] = e[4] - n[4], t[5] = e[5] - n[5], t[6] = e[6] - n[6], t[7] = e[7] - n[7], t[8] = e[8] - n[8], t[9] = e[9] - n[9], t[10] = e[10] - n[10], t[11] = e[11] - n[11], t[12] = e[12] - n[12], t[13] = e[13] - n[13], t[14] = e[14] - n[14], t[15] = e[15] - n[15], t
        }, i.sub = i.subtract, i.multiplyScalar = function(t, e, n) {
            return t[0] = e[0] * n, t[1] = e[1] * n, t[2] = e[2] * n, t[3] = e[3] * n, t[4] = e[4] * n, t[5] = e[5] * n, t[6] = e[6] * n, t[7] = e[7] * n, t[8] = e[8] * n, t[9] = e[9] * n,
                t[10] = e[10] * n, t[11] = e[11] * n, t[12] = e[12] * n, t[13] = e[13] * n, t[14] = e[14] * n, t[15] = e[15] * n, t
        }, i.multiplyScalarAndAdd = function(t, e, n, o) {
            return t[0] = e[0] + n[0] * o, t[1] = e[1] + n[1] * o, t[2] = e[2] + n[2] * o, t[3] = e[3] + n[3] * o, t[4] = e[4] + n[4] * o, t[5] = e[5] + n[5] * o, t[6] = e[6] + n[6] * o, t[7] = e[7] + n[7] * o, t[8] = e[8] + n[8] * o, t[9] = e[9] + n[9] * o, t[10] = e[10] + n[10] * o, t[11] = e[11] + n[11] * o, t[12] = e[12] + n[12] * o, t[13] = e[13] + n[13] * o, t[14] = e[14] + n[14] * o, t[15] = e[15] + n[15] * o, t
        }, i.exactEquals = function(t, e) {
            return t[0] === e[0] && t[1] === e[1] && t[2] === e[2] && t[3] === e[3] && t[4] === e[4] && t[5] === e[5] && t[6] === e[6] && t[7] === e[7] && t[8] === e[8] && t[9] === e[9] && t[10] === e[10] && t[11] === e[11] && t[12] === e[12] && t[13] === e[13] && t[14] === e[14] && t[15] === e[15]
        }, i.equals = function(t, e) {
            var n = t[0],
                i = t[1],
                r = t[2],
                a = t[3],
                s = t[4],
                u = t[5],
                l = t[6],
                c = t[7],
                d = t[8],
                h = t[9],
                p = t[10],
                f = t[11],
                m = t[12],
                v = t[13],
                g = t[14],
                _ = t[15],
                x = e[0],
                b = e[1],
                y = e[2],
                M = e[3],
                S = e[4],
                w = e[5],
                E = e[6],
                I = e[7],
                D = e[8],
                A = e[9],
                F = e[10],
                R = e[11],
                P = e[12],
                T = e[13],
                C = e[14],
                O = e[15];
            return Math.abs(n - x) <= o.EPSILON * Math.max(1, Math.abs(n), Math.abs(x)) && Math.abs(i - b) <= o.EPSILON * Math.max(1, Math.abs(i), Math.abs(b)) && Math.abs(r - y) <= o.EPSILON * Math.max(1, Math.abs(r), Math.abs(y)) && Math.abs(a - M) <= o.EPSILON * Math.max(1, Math.abs(a), Math.abs(M)) && Math.abs(s - S) <= o.EPSILON * Math.max(1, Math.abs(s), Math.abs(S)) && Math.abs(u - w) <= o.EPSILON * Math.max(1, Math.abs(u), Math.abs(w)) && Math.abs(l - E) <= o.EPSILON * Math.max(1, Math.abs(l), Math.abs(E)) && Math.abs(c - I) <= o.EPSILON * Math.max(1, Math.abs(c), Math.abs(I)) && Math.abs(d - D) <= o.EPSILON * Math.max(1, Math.abs(d), Math.abs(D)) && Math.abs(h - A) <= o.EPSILON * Math.max(1, Math.abs(h), Math.abs(A)) && Math.abs(p - F) <= o.EPSILON * Math.max(1, Math.abs(p), Math.abs(F)) && Math.abs(f - R) <= o.EPSILON * Math.max(1, Math.abs(f), Math.abs(R)) && Math.abs(m - P) <= o.EPSILON * Math.max(1, Math.abs(m), Math.abs(P)) && Math.abs(v - T) <= o.EPSILON * Math.max(1, Math.abs(v), Math.abs(T)) && Math.abs(g - C) <= o.EPSILON * Math.max(1, Math.abs(g), Math.abs(C)) && Math.abs(_ - O) <= o.EPSILON * Math.max(1, Math.abs(_), Math.abs(O))
        }, e.exports = i
    }, {
        7: 7
    }],
    12: [function(t, e, n) {
        var o = t(7),
            i = t(10),
            r = t(14),
            a = t(15),
            s = {};
        s.create = function() {
            var t = new o.ARRAY_TYPE(4);
            return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 1, t
        }, s.rotationTo = function() {
            var t = r.create(),
                e = r.fromValues(1, 0, 0),
                n = r.fromValues(0, 1, 0);
            return function(o, i, a) {
                var u = r.dot(i, a);
                return u < -.999999 ? (r.cross(t, e, i), r.length(t) < 1e-6 && r.cross(t, n, i), r.normalize(t, t), s.setAxisAngle(o, t, Math.PI), o) : u > .999999 ? (o[0] = 0, o[1] = 0, o[2] = 0, o[3] = 1, o) : (r.cross(t, i, a), o[0] = t[0], o[1] = t[1], o[2] = t[2], o[3] = 1 + u, s.normalize(o, o))
            }
        }(), s.setAxes = function() {
            var t = i.create();
            return function(e, n, o, i) {
                return t[0] = o[0], t[3] = o[1], t[6] = o[2], t[1] = i[0], t[4] = i[1], t[7] = i[2], t[2] = -n[0], t[5] = -n[1], t[8] = -n[2], s.normalize(e, s.fromMat3(e, t))
            }
        }(), s.clone = a.clone, s.fromValues = a.fromValues, s.copy = a.copy, s.set = a.set, s.identity = function(t) {
            return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 1, t
        }, s.setAxisAngle = function(t, e, n) {
            n *= .5;
            var o = Math.sin(n);
            return t[0] = o * e[0], t[1] = o * e[1], t[2] = o * e[2], t[3] = Math.cos(n), t
        }, s.getAxisAngle = function(t, e) {
            var n = 2 * Math.acos(e[3]),
                o = Math.sin(n / 2);
            return 0 != o ? (t[0] = e[0] / o, t[1] = e[1] / o, t[2] = e[2] / o) : (t[0] = 1, t[1] = 0, t[2] = 0), n
        }, s.add = a.add, s.multiply = function(t, e, n) {
            var o = e[0],
                i = e[1],
                r = e[2],
                a = e[3],
                s = n[0],
                u = n[1],
                l = n[2],
                c = n[3];
            return t[0] = o * c + a * s + i * l - r * u, t[1] = i * c + a * u + r * s - o * l, t[2] = r * c + a * l + o * u - i * s, t[3] = a * c - o * s - i * u - r * l, t
        }, s.mul = s.multiply, s.scale = a.scale, s.rotateX = function(t, e, n) {
            n *= .5;
            var o = e[0],
                i = e[1],
                r = e[2],
                a = e[3],
                s = Math.sin(n),
                u = Math.cos(n);
            return t[0] = o * u + a * s, t[1] = i * u + r * s, t[2] = r * u - i * s, t[3] = a * u - o * s, t
        }, s.rotateY = function(t, e, n) {
            n *= .5;
            var o = e[0],
                i = e[1],
                r = e[2],
                a = e[3],
                s = Math.sin(n),
                u = Math.cos(n);
            return t[0] = o * u - r * s, t[1] = i * u + a * s, t[2] = r * u + o * s, t[3] = a * u - i * s, t
        }, s.rotateZ = function(t, e, n) {
            n *= .5;
            var o = e[0],
                i = e[1],
                r = e[2],
                a = e[3],
                s = Math.sin(n),
                u = Math.cos(n);
            return t[0] = o * u + i * s, t[1] = i * u - o * s, t[2] = r * u + a * s, t[3] = a * u - r * s, t
        }, s.calculateW = function(t, e) {
            var n = e[0],
                o = e[1],
                i = e[2];
            return t[0] = n, t[1] = o, t[2] = i, t[3] = Math.sqrt(Math.abs(1 - n * n - o * o - i * i)), t
        }, s.dot = a.dot, s.lerp = a.lerp, s.slerp = function(t, e, n, o) {
            var i, r, a, s, u, l = e[0],
                c = e[1],
                d = e[2],
                h = e[3],
                p = n[0],
                f = n[1],
                m = n[2],
                v = n[3];
            return r = l * p + c * f + d * m + h * v, r < 0 && (r = -r, p = -p, f = -f, m = -m, v = -v), 1 - r > 1e-6 ? (i = Math.acos(r), a = Math.sin(i), s = Math.sin((1 - o) * i) / a, u = Math.sin(o * i) / a) : (s = 1 - o, u = o), t[0] = s * l + u * p, t[1] = s * c + u * f, t[2] = s * d + u * m, t[3] = s * h + u * v, t
        }, s.sqlerp = function() {
            var t = s.create(),
                e = s.create();
            return function(n, o, i, r, a, u) {
                return s.slerp(t, o, a, u), s.slerp(e, i, r, u), s.slerp(n, t, e, 2 * u * (1 - u)), n
            }
        }(), s.invert = function(t, e) {
            var n = e[0],
                o = e[1],
                i = e[2],
                r = e[3],
                a = n * n + o * o + i * i + r * r,
                s = a ? 1 / a : 0;
            return t[0] = -n * s, t[1] = -o * s, t[2] = -i * s, t[3] = r * s, t
        }, s.conjugate = function(t, e) {
            return t[0] = -e[0], t[1] = -e[1], t[2] = -e[2], t[3] = e[3], t
        }, s.length = a.length, s.len = s.length, s.squaredLength = a.squaredLength, s.sqrLen = s.squaredLength, s.normalize = a.normalize, s.fromMat3 = function(t, e) {
            var n, o = e[0] + e[4] + e[8];
            if (o > 0) n = Math.sqrt(o + 1), t[3] = .5 * n, n = .5 / n, t[0] = (e[5] - e[7]) * n, t[1] = (e[6] - e[2]) * n, t[2] = (e[1] - e[3]) * n;
            else {
                var i = 0;
                e[4] > e[0] && (i = 1), e[8] > e[3 * i + i] && (i = 2);
                var r = (i + 1) % 3,
                    a = (i + 2) % 3;
                n = Math.sqrt(e[3 * i + i] - e[3 * r + r] - e[3 * a + a] + 1), t[i] = .5 * n, n = .5 / n, t[3] = (e[3 * r + a] - e[3 * a + r]) * n, t[r] = (e[3 * r + i] + e[3 * i + r]) * n, t[a] = (e[3 * a + i] + e[3 * i + a]) * n
            }
            return t
        }, s.str = function(t) {
            return "quat(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")"
        }, s.exactEquals = a.exactEquals, s.equals = a.equals, e.exports = s
    }, {
        10: 10,
        14: 14,
        15: 15,
        7: 7
    }],
    13: [function(t, e, n) {
        var o = t(7),
            i = {};
        i.create = function() {
            var t = new o.ARRAY_TYPE(2);
            return t[0] = 0, t[1] = 0, t
        }, i.clone = function(t) {
            var e = new o.ARRAY_TYPE(2);
            return e[0] = t[0], e[1] = t[1], e
        }, i.fromValues = function(t, e) {
            var n = new o.ARRAY_TYPE(2);
            return n[0] = t, n[1] = e, n
        }, i.copy = function(t, e) {
            return t[0] = e[0], t[1] = e[1], t
        }, i.set = function(t, e, n) {
            return t[0] = e, t[1] = n, t
        }, i.add = function(t, e, n) {
            return t[0] = e[0] + n[0], t[1] = e[1] + n[1], t
        }, i.subtract = function(t, e, n) {
            return t[0] = e[0] - n[0], t[1] = e[1] - n[1], t
        }, i.sub = i.subtract, i.multiply = function(t, e, n) {
            return t[0] = e[0] * n[0], t[1] = e[1] * n[1], t
        }, i.mul = i.multiply, i.divide = function(t, e, n) {
            return t[0] = e[0] / n[0], t[1] = e[1] / n[1], t
        }, i.div = i.divide, i.ceil = function(t, e) {
            return t[0] = Math.ceil(e[0]), t[1] = Math.ceil(e[1]), t
        }, i.floor = function(t, e) {
            return t[0] = Math.floor(e[0]), t[1] = Math.floor(e[1]), t
        }, i.min = function(t, e, n) {
            return t[0] = Math.min(e[0], n[0]), t[1] = Math.min(e[1], n[1]), t
        }, i.max = function(t, e, n) {
            return t[0] = Math.max(e[0], n[0]), t[1] = Math.max(e[1], n[1]), t
        }, i.round = function(t, e) {
            return t[0] = Math.round(e[0]), t[1] = Math.round(e[1]), t
        }, i.scale = function(t, e, n) {
            return t[0] = e[0] * n, t[1] = e[1] * n, t
        }, i.scaleAndAdd = function(t, e, n, o) {
            return t[0] = e[0] + n[0] * o, t[1] = e[1] + n[1] * o, t
        }, i.distance = function(t, e) {
            var n = e[0] - t[0],
                o = e[1] - t[1];
            return Math.sqrt(n * n + o * o)
        }, i.dist = i.distance, i.squaredDistance = function(t, e) {
            var n = e[0] - t[0],
                o = e[1] - t[1];
            return n * n + o * o
        }, i.sqrDist = i.squaredDistance, i.length = function(t) {
            var e = t[0],
                n = t[1];
            return Math.sqrt(e * e + n * n)
        }, i.len = i.length, i.squaredLength = function(t) {
            var e = t[0],
                n = t[1];
            return e * e + n * n
        }, i.sqrLen = i.squaredLength, i.negate = function(t, e) {
            return t[0] = -e[0], t[1] = -e[1], t
        }, i.inverse = function(t, e) {
            return t[0] = 1 / e[0], t[1] = 1 / e[1], t
        }, i.normalize = function(t, e) {
            var n = e[0],
                o = e[1],
                i = n * n + o * o;
            return i > 0 && (i = 1 / Math.sqrt(i), t[0] = e[0] * i, t[1] = e[1] * i), t
        }, i.dot = function(t, e) {
            return t[0] * e[0] + t[1] * e[1]
        }, i.cross = function(t, e, n) {
            var o = e[0] * n[1] - e[1] * n[0];
            return t[0] = t[1] = 0, t[2] = o, t
        }, i.lerp = function(t, e, n, o) {
            var i = e[0],
                r = e[1];
            return t[0] = i + o * (n[0] - i), t[1] = r + o * (n[1] - r), t
        }, i.random = function(t, e) {
            e = e || 1;
            var n = 2 * o.RANDOM() * Math.PI;
            return t[0] = Math.cos(n) * e, t[1] = Math.sin(n) * e, t
        }, i.transformMat2 = function(t, e, n) {
            var o = e[0],
                i = e[1];
            return t[0] = n[0] * o + n[2] * i, t[1] = n[1] * o + n[3] * i, t
        }, i.transformMat2d = function(t, e, n) {
            var o = e[0],
                i = e[1];
            return t[0] = n[0] * o + n[2] * i + n[4], t[1] = n[1] * o + n[3] * i + n[5], t
        }, i.transformMat3 = function(t, e, n) {
            var o = e[0],
                i = e[1];
            return t[0] = n[0] * o + n[3] * i + n[6], t[1] = n[1] * o + n[4] * i + n[7], t
        }, i.transformMat4 = function(t, e, n) {
            var o = e[0],
                i = e[1];
            return t[0] = n[0] * o + n[4] * i + n[12], t[1] = n[1] * o + n[5] * i + n[13], t
        }, i.forEach = function() {
            var t = i.create();
            return function(e, n, o, i, r, a) {
                var s, u;
                for (n || (n = 2), o || (o = 0), u = i ? Math.min(i * n + o, e.length) : e.length, s = o; s < u; s += n) t[0] = e[s], t[1] = e[s + 1], r(t, t, a), e[s] = t[0], e[s + 1] = t[1];
                return e
            }
        }(), i.str = function(t) {
            return "vec2(" + t[0] + ", " + t[1] + ")"
        }, i.exactEquals = function(t, e) {
            return t[0] === e[0] && t[1] === e[1]
        }, i.equals = function(t, e) {
            var n = t[0],
                i = t[1],
                r = e[0],
                a = e[1];
            return Math.abs(n - r) <= o.EPSILON * Math.max(1, Math.abs(n), Math.abs(r)) && Math.abs(i - a) <= o.EPSILON * Math.max(1, Math.abs(i), Math.abs(a))
        }, e.exports = i
    }, {
        7: 7
    }],
    14: [function(t, e, n) {
        var o = t(7),
            i = {};
        i.create = function() {
            var t = new o.ARRAY_TYPE(3);
            return t[0] = 0, t[1] = 0, t[2] = 0, t
        }, i.clone = function(t) {
            var e = new o.ARRAY_TYPE(3);
            return e[0] = t[0], e[1] = t[1], e[2] = t[2], e
        }, i.fromValues = function(t, e, n) {
            var i = new o.ARRAY_TYPE(3);
            return i[0] = t, i[1] = e, i[2] = n, i
        }, i.copy = function(t, e) {
            return t[0] = e[0], t[1] = e[1], t[2] = e[2], t
        }, i.set = function(t, e, n, o) {
            return t[0] = e, t[1] = n, t[2] = o, t
        }, i.add = function(t, e, n) {
            return t[0] = e[0] + n[0], t[1] = e[1] + n[1], t[2] = e[2] + n[2], t
        }, i.subtract = function(t, e, n) {
            return t[0] = e[0] - n[0], t[1] = e[1] - n[1], t[2] = e[2] - n[2], t
        }, i.sub = i.subtract, i.multiply = function(t, e, n) {
            return t[0] = e[0] * n[0], t[1] = e[1] * n[1], t[2] = e[2] * n[2], t
        }, i.mul = i.multiply, i.divide = function(t, e, n) {
            return t[0] = e[0] / n[0], t[1] = e[1] / n[1], t[2] = e[2] / n[2], t
        }, i.div = i.divide, i.ceil = function(t, e) {
            return t[0] = Math.ceil(e[0]), t[1] = Math.ceil(e[1]), t[2] = Math.ceil(e[2]), t
        }, i.floor = function(t, e) {
            return t[0] = Math.floor(e[0]), t[1] = Math.floor(e[1]), t[2] = Math.floor(e[2]), t
        }, i.min = function(t, e, n) {
            return t[0] = Math.min(e[0], n[0]), t[1] = Math.min(e[1], n[1]), t[2] = Math.min(e[2], n[2]), t
        }, i.max = function(t, e, n) {
            return t[0] = Math.max(e[0], n[0]), t[1] = Math.max(e[1], n[1]), t[2] = Math.max(e[2], n[2]), t
        }, i.round = function(t, e) {
            return t[0] = Math.round(e[0]), t[1] = Math.round(e[1]), t[2] = Math.round(e[2]), t
        }, i.scale = function(t, e, n) {
            return t[0] = e[0] * n, t[1] = e[1] * n, t[2] = e[2] * n, t
        }, i.scaleAndAdd = function(t, e, n, o) {
            return t[0] = e[0] + n[0] * o, t[1] = e[1] + n[1] * o, t[2] = e[2] + n[2] * o, t
        }, i.distance = function(t, e) {
            var n = e[0] - t[0],
                o = e[1] - t[1],
                i = e[2] - t[2];
            return Math.sqrt(n * n + o * o + i * i)
        }, i.dist = i.distance, i.squaredDistance = function(t, e) {
            var n = e[0] - t[0],
                o = e[1] - t[1],
                i = e[2] - t[2];
            return n * n + o * o + i * i
        }, i.sqrDist = i.squaredDistance, i.length = function(t) {
            var e = t[0],
                n = t[1],
                o = t[2];
            return Math.sqrt(e * e + n * n + o * o)
        }, i.len = i.length, i.squaredLength = function(t) {
            var e = t[0],
                n = t[1],
                o = t[2];
            return e * e + n * n + o * o
        }, i.sqrLen = i.squaredLength, i.negate = function(t, e) {
            return t[0] = -e[0], t[1] = -e[1], t[2] = -e[2], t
        }, i.inverse = function(t, e) {
            return t[0] = 1 / e[0], t[1] = 1 / e[1], t[2] = 1 / e[2], t
        }, i.normalize = function(t, e) {
            var n = e[0],
                o = e[1],
                i = e[2],
                r = n * n + o * o + i * i;
            return r > 0 && (r = 1 / Math.sqrt(r), t[0] = e[0] * r, t[1] = e[1] * r, t[2] = e[2] * r), t
        }, i.dot = function(t, e) {
            return t[0] * e[0] + t[1] * e[1] + t[2] * e[2]
        }, i.cross = function(t, e, n) {
            var o = e[0],
                i = e[1],
                r = e[2],
                a = n[0],
                s = n[1],
                u = n[2];
            return t[0] = i * u - r * s, t[1] = r * a - o * u, t[2] = o * s - i * a, t
        }, i.lerp = function(t, e, n, o) {
            var i = e[0],
                r = e[1],
                a = e[2];
            return t[0] = i + o * (n[0] - i), t[1] = r + o * (n[1] - r), t[2] = a + o * (n[2] - a), t
        }, i.hermite = function(t, e, n, o, i, r) {
            var a = r * r,
                s = a * (2 * r - 3) + 1,
                u = a * (r - 2) + r,
                l = a * (r - 1),
                c = a * (3 - 2 * r);
            return t[0] = e[0] * s + n[0] * u + o[0] * l + i[0] * c, t[1] = e[1] * s + n[1] * u + o[1] * l + i[1] * c, t[2] = e[2] * s + n[2] * u + o[2] * l + i[2] * c, t
        }, i.bezier = function(t, e, n, o, i, r) {
            var a = 1 - r,
                s = a * a,
                u = r * r,
                l = s * a,
                c = 3 * r * s,
                d = 3 * u * a,
                h = u * r;
            return t[0] = e[0] * l + n[0] * c + o[0] * d + i[0] * h, t[1] = e[1] * l + n[1] * c + o[1] * d + i[1] * h, t[2] = e[2] * l + n[2] * c + o[2] * d + i[2] * h, t
        }, i.random = function(t, e) {
            e = e || 1;
            var n = 2 * o.RANDOM() * Math.PI,
                i = 2 * o.RANDOM() - 1,
                r = Math.sqrt(1 - i * i) * e;
            return t[0] = Math.cos(n) * r, t[1] = Math.sin(n) * r, t[2] = i * e, t
        }, i.transformMat4 = function(t, e, n) {
            var o = e[0],
                i = e[1],
                r = e[2],
                a = n[3] * o + n[7] * i + n[11] * r + n[15];
            return a = a || 1, t[0] = (n[0] * o + n[4] * i + n[8] * r + n[12]) / a, t[1] = (n[1] * o + n[5] * i + n[9] * r + n[13]) / a, t[2] = (n[2] * o + n[6] * i + n[10] * r + n[14]) / a, t
        }, i.transformMat3 = function(t, e, n) {
            var o = e[0],
                i = e[1],
                r = e[2];
            return t[0] = o * n[0] + i * n[3] + r * n[6], t[1] = o * n[1] + i * n[4] + r * n[7], t[2] = o * n[2] + i * n[5] + r * n[8], t
        }, i.transformQuat = function(t, e, n) {
            var o = e[0],
                i = e[1],
                r = e[2],
                a = n[0],
                s = n[1],
                u = n[2],
                l = n[3],
                c = l * o + s * r - u * i,
                d = l * i + u * o - a * r,
                h = l * r + a * i - s * o,
                p = -a * o - s * i - u * r;
            return t[0] = c * l + p * -a + d * -u - h * -s, t[1] = d * l + p * -s + h * -a - c * -u, t[2] = h * l + p * -u + c * -s - d * -a, t
        }, i.rotateX = function(t, e, n, o) {
            var i = [],
                r = [];
            return i[0] = e[0] - n[0], i[1] = e[1] - n[1], i[2] = e[2] - n[2], r[0] = i[0], r[1] = i[1] * Math.cos(o) - i[2] * Math.sin(o), r[2] = i[1] * Math.sin(o) + i[2] * Math.cos(o), t[0] = r[0] + n[0], t[1] = r[1] + n[1], t[2] = r[2] + n[2], t
        }, i.rotateY = function(t, e, n, o) {
            var i = [],
                r = [];
            return i[0] = e[0] - n[0], i[1] = e[1] - n[1], i[2] = e[2] - n[2], r[0] = i[2] * Math.sin(o) + i[0] * Math.cos(o), r[1] = i[1], r[2] = i[2] * Math.cos(o) - i[0] * Math.sin(o), t[0] = r[0] + n[0], t[1] = r[1] + n[1], t[2] = r[2] + n[2], t
        }, i.rotateZ = function(t, e, n, o) {
            var i = [],
                r = [];
            return i[0] = e[0] - n[0], i[1] = e[1] - n[1], i[2] = e[2] - n[2], r[0] = i[0] * Math.cos(o) - i[1] * Math.sin(o), r[1] = i[0] * Math.sin(o) + i[1] * Math.cos(o), r[2] = i[2], t[0] = r[0] + n[0], t[1] = r[1] + n[1], t[2] = r[2] + n[2], t
        }, i.forEach = function() {
            var t = i.create();
            return function(e, n, o, i, r, a) {
                var s, u;
                for (n || (n = 3), o || (o = 0), u = i ? Math.min(i * n + o, e.length) : e.length, s = o; s < u; s += n) t[0] = e[s], t[1] = e[s + 1], t[2] = e[s + 2], r(t, t, a), e[s] = t[0], e[s + 1] = t[1], e[s + 2] = t[2];
                return e
            }
        }(), i.angle = function(t, e) {
            var n = i.fromValues(t[0], t[1], t[2]),
                o = i.fromValues(e[0], e[1], e[2]);
            i.normalize(n, n), i.normalize(o, o);
            var r = i.dot(n, o);
            return r > 1 ? 0 : Math.acos(r)
        }, i.str = function(t) {
            return "vec3(" + t[0] + ", " + t[1] + ", " + t[2] + ")"
        }, i.exactEquals = function(t, e) {
            return t[0] === e[0] && t[1] === e[1] && t[2] === e[2]
        }, i.equals = function(t, e) {
            var n = t[0],
                i = t[1],
                r = t[2],
                a = e[0],
                s = e[1],
                u = e[2];
            return Math.abs(n - a) <= o.EPSILON * Math.max(1, Math.abs(n), Math.abs(a)) && Math.abs(i - s) <= o.EPSILON * Math.max(1, Math.abs(i), Math.abs(s)) && Math.abs(r - u) <= o.EPSILON * Math.max(1, Math.abs(r), Math.abs(u))
        }, e.exports = i
    }, {
        7: 7
    }],
    15: [function(t, e, n) {
        var o = t(7),
            i = {};
        i.create = function() {
            var t = new o.ARRAY_TYPE(4);
            return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 0, t
        }, i.clone = function(t) {
            var e = new o.ARRAY_TYPE(4);
            return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e
        }, i.fromValues = function(t, e, n, i) {
            var r = new o.ARRAY_TYPE(4);
            return r[0] = t, r[1] = e, r[2] = n, r[3] = i, r
        }, i.copy = function(t, e) {
            return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t
        }, i.set = function(t, e, n, o, i) {
            return t[0] = e, t[1] = n, t[2] = o, t[3] = i, t
        }, i.add = function(t, e, n) {
            return t[0] = e[0] + n[0], t[1] = e[1] + n[1], t[2] = e[2] + n[2], t[3] = e[3] + n[3], t
        }, i.subtract = function(t, e, n) {
            return t[0] = e[0] - n[0], t[1] = e[1] - n[1], t[2] = e[2] - n[2], t[3] = e[3] - n[3], t
        }, i.sub = i.subtract, i.multiply = function(t, e, n) {
            return t[0] = e[0] * n[0], t[1] = e[1] * n[1], t[2] = e[2] * n[2], t[3] = e[3] * n[3], t
        }, i.mul = i.multiply, i.divide = function(t, e, n) {
            return t[0] = e[0] / n[0], t[1] = e[1] / n[1], t[2] = e[2] / n[2], t[3] = e[3] / n[3], t
        }, i.div = i.divide, i.ceil = function(t, e) {
            return t[0] = Math.ceil(e[0]), t[1] = Math.ceil(e[1]), t[2] = Math.ceil(e[2]), t[3] = Math.ceil(e[3]), t
        }, i.floor = function(t, e) {
            return t[0] = Math.floor(e[0]), t[1] = Math.floor(e[1]), t[2] = Math.floor(e[2]), t[3] = Math.floor(e[3]), t
        }, i.min = function(t, e, n) {
            return t[0] = Math.min(e[0], n[0]), t[1] = Math.min(e[1], n[1]), t[2] = Math.min(e[2], n[2]), t[3] = Math.min(e[3], n[3]), t
        }, i.max = function(t, e, n) {
            return t[0] = Math.max(e[0], n[0]), t[1] = Math.max(e[1], n[1]), t[2] = Math.max(e[2], n[2]), t[3] = Math.max(e[3], n[3]), t
        }, i.round = function(t, e) {
            return t[0] = Math.round(e[0]), t[1] = Math.round(e[1]), t[2] = Math.round(e[2]), t[3] = Math.round(e[3]), t
        }, i.scale = function(t, e, n) {
            return t[0] = e[0] * n, t[1] = e[1] * n, t[2] = e[2] * n, t[3] = e[3] * n, t
        }, i.scaleAndAdd = function(t, e, n, o) {
            return t[0] = e[0] + n[0] * o, t[1] = e[1] + n[1] * o, t[2] = e[2] + n[2] * o, t[3] = e[3] + n[3] * o, t
        }, i.distance = function(t, e) {
            var n = e[0] - t[0],
                o = e[1] - t[1],
                i = e[2] - t[2],
                r = e[3] - t[3];
            return Math.sqrt(n * n + o * o + i * i + r * r)
        }, i.dist = i.distance, i.squaredDistance = function(t, e) {
            var n = e[0] - t[0],
                o = e[1] - t[1],
                i = e[2] - t[2],
                r = e[3] - t[3];
            return n * n + o * o + i * i + r * r
        }, i.sqrDist = i.squaredDistance, i.length = function(t) {
            var e = t[0],
                n = t[1],
                o = t[2],
                i = t[3];
            return Math.sqrt(e * e + n * n + o * o + i * i)
        }, i.len = i.length, i.squaredLength = function(t) {
            var e = t[0],
                n = t[1],
                o = t[2],
                i = t[3];
            return e * e + n * n + o * o + i * i
        }, i.sqrLen = i.squaredLength, i.negate = function(t, e) {
            return t[0] = -e[0], t[1] = -e[1], t[2] = -e[2], t[3] = -e[3], t
        }, i.inverse = function(t, e) {
            return t[0] = 1 / e[0], t[1] = 1 / e[1], t[2] = 1 / e[2], t[3] = 1 / e[3], t
        }, i.normalize = function(t, e) {
            var n = e[0],
                o = e[1],
                i = e[2],
                r = e[3],
                a = n * n + o * o + i * i + r * r;
            return a > 0 && (a = 1 / Math.sqrt(a), t[0] = n * a, t[1] = o * a, t[2] = i * a, t[3] = r * a), t
        }, i.dot = function(t, e) {
            return t[0] * e[0] + t[1] * e[1] + t[2] * e[2] + t[3] * e[3]
        }, i.lerp = function(t, e, n, o) {
            var i = e[0],
                r = e[1],
                a = e[2],
                s = e[3];
            return t[0] = i + o * (n[0] - i), t[1] = r + o * (n[1] - r), t[2] = a + o * (n[2] - a), t[3] = s + o * (n[3] - s), t
        }, i.random = function(t, e) {
            return e = e || 1, t[0] = o.RANDOM(), t[1] = o.RANDOM(), t[2] = o.RANDOM(), t[3] = o.RANDOM(), i.normalize(t, t), i.scale(t, t, e), t
        }, i.transformMat4 = function(t, e, n) {
            var o = e[0],
                i = e[1],
                r = e[2],
                a = e[3];
            return t[0] = n[0] * o + n[4] * i + n[8] * r + n[12] * a, t[1] = n[1] * o + n[5] * i + n[9] * r + n[13] * a, t[2] = n[2] * o + n[6] * i + n[10] * r + n[14] * a, t[3] = n[3] * o + n[7] * i + n[11] * r + n[15] * a, t
        }, i.transformQuat = function(t, e, n) {
            var o = e[0],
                i = e[1],
                r = e[2],
                a = n[0],
                s = n[1],
                u = n[2],
                l = n[3],
                c = l * o + s * r - u * i,
                d = l * i + u * o - a * r,
                h = l * r + a * i - s * o,
                p = -a * o - s * i - u * r;
            return t[0] = c * l + p * -a + d * -u - h * -s, t[1] = d * l + p * -s + h * -a - c * -u, t[2] = h * l + p * -u + c * -s - d * -a, t[3] = e[3], t
        }, i.forEach = function() {
            var t = i.create();
            return function(e, n, o, i, r, a) {
                var s, u;
                for (n || (n = 4), o || (o = 0), u = i ? Math.min(i * n + o, e.length) : e.length, s = o; s < u; s += n) t[0] = e[s], t[1] = e[s + 1], t[2] = e[s + 2], t[3] = e[s + 3], r(t, t, a), e[s] = t[0], e[s + 1] = t[1], e[s + 2] = t[2], e[s + 3] = t[3];
                return e
            }
        }(), i.str = function(t) {
            return "vec4(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")"
        }, i.exactEquals = function(t, e) {
            return t[0] === e[0] && t[1] === e[1] && t[2] === e[2] && t[3] === e[3]
        }, i.equals = function(t, e) {
            var n = t[0],
                i = t[1],
                r = t[2],
                a = t[3],
                s = e[0],
                u = e[1],
                l = e[2],
                c = e[3];
            return Math.abs(n - s) <= o.EPSILON * Math.max(1, Math.abs(n), Math.abs(s)) && Math.abs(i - u) <= o.EPSILON * Math.max(1, Math.abs(i), Math.abs(u)) && Math.abs(r - l) <= o.EPSILON * Math.max(1, Math.abs(r), Math.abs(l)) && Math.abs(a - c) <= o.EPSILON * Math.max(1, Math.abs(a), Math.abs(c))
        }, e.exports = i
    }, {
        7: 7
    }],
    16: [function(t, e, n) {
        function o(t, e, n) {
            if (null != t)
                for (var o = -1, i = t.length; ++o < i && !1 !== e.call(n, t[o], o, t););
        }
        e.exports = o
    }, {}],
    17: [function(t, e, n) {
        function o(t, e, n) {
            var o = t.length;
            e = null == e ? 0 : e < 0 ? Math.max(o + e, 0) : Math.min(e, o), n = null == n ? o : n < 0 ? Math.max(o + n, 0) : Math.min(n, o);
            for (var i = []; e < n;) i.push(t[e++]);
            return i
        }
        e.exports = o
    }, {}],
    18: [function(t, e, n) {
        function o(t) {
            switch (u(t)) {
                case "Object":
                    return i(t);
                case "Array":
                    return s(t);
                case "RegExp":
                    return r(t);
                case "Date":
                    return a(t);
                default:
                    return t
            }
        }

        function i(t) {
            return l(t) ? c({}, t) : t
        }

        function r(t) {
            var e = "";
            return e += t.multiline ? "m" : "", e += t.global ? "g" : "", e += t.ignoreCase ? "i" : "", new RegExp(t.source, e)
        }

        function a(t) {
            return new Date(+t)
        }

        function s(t) {
            return t.slice()
        }
        var u = t(24),
            l = t(23),
            c = t(31);
        e.exports = o
    }, {
        23: 23,
        24: 24,
        31: 31
    }],
    19: [function(t, e, n) {
        function o(t, e) {
            switch (u(t)) {
                case "Object":
                    return i(t, e);
                case "Array":
                    return r(t, e);
                default:
                    return a(t)
            }
        }

        function i(t, e) {
            if (l(t)) {
                var n = {};
                return s(t, function(t, n) {
                    this[n] = o(t, e)
                }, n), n
            }
            return e ? e(t) : t
        }

        function r(t, e) {
            for (var n = [], i = -1, r = t.length; ++i < r;) n[i] = o(t[i], e);
            return n
        }
        var a = t(18),
            s = t(27),
            u = t(24),
            l = t(23);
        e.exports = o
    }, {
        18: 18,
        23: 23,
        24: 24,
        27: 27
    }],
    20: [function(t, e, n) {
        var o = t(21),
            i = Array.isArray || function(t) {
                return o(t, "Array")
            };
        e.exports = i
    }, {
        21: 21
    }],
    21: [function(t, e, n) {
        function o(t, e) {
            return i(t) === e
        }
        var i = t(24);
        e.exports = o
    }, {
        24: 24
    }],
    22: [function(t, e, n) {
        function o(t) {
            return i(t, "Object")
        }
        var i = t(21);
        e.exports = o
    }, {
        21: 21
    }],
    23: [function(t, e, n) {
        function o(t) {
            return !!t && "object" == typeof t && t.constructor === Object
        }
        e.exports = o
    }, {}],
    24: [function(t, e, n) {
        function o(t) {
            return null === t ? "Null" : t === i ? "Undefined" : r.exec(a.call(t))[1]
        }
        var i, r = /^\[object (.*)\]$/,
            a = Object.prototype.toString;
        e.exports = o
    }, {}],
    25: [function(t, e, n) {
        function o(t, e) {
            return i(r(arguments, 1), function(e) {
                a(e, function(e, n) {
                    null == t[n] && (t[n] = e)
                })
            }), t
        }
        var i = t(16),
            r = t(17),
            a = t(27);
        e.exports = o
    }, {
        16: 16,
        17: 17,
        27: 27
    }],
    26: [function(t, e, n) {
        function o() {
            s = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"], a = !0;
            for (var t in {
                    toString: null
                }) a = !1
        }

        function i(t, e, n) {
            var i, l = 0;
            null == a && o();
            for (i in t)
                if (!1 === r(e, t, i, n)) break;
            if (a)
                for (var c = t.constructor, d = !!c && t === c.prototype;
                    (i = s[l++]) && ("constructor" === i && (d || !u(t, i)) || t[i] === Object.prototype[i] || !1 !== r(e, t, i, n)););
        }

        function r(t, e, n, o) {
            return t.call(o, e[n], n, e)
        }
        var a, s, u = t(28);
        e.exports = i
    }, {
        28: 28
    }],
    27: [function(t, e, n) {
        function o(t, e, n) {
            r(t, function(o, r) {
                if (i(t, r)) return e.call(n, t[r], r, t)
            })
        }
        var i = t(28),
            r = t(26);
        e.exports = o
    }, {
        26: 26,
        28: 28
    }],
    28: [function(t, e, n) {
        function o(t, e) {
            return Object.prototype.hasOwnProperty.call(t, e)
        }
        e.exports = o
    }, {}],
    29: [function(t, e, n) {
        var o = t(27),
            i = Object.keys || function(t) {
                var e = [];
                return o(t, function(t, n) {
                    e.push(n)
                }), e
            };
        e.exports = i
    }, {
        27: 27
    }],
    30: [function(t, e, n) {
        function o() {
            var t, e, n, s, u = 1;
            for (s = r(arguments[0]); n = arguments[u++];)
                for (t in n) i(n, t) && (e = n[t], a(e) && a(s[t]) ? s[t] = o(s[t], e) : s[t] = r(e));
            return s
        }
        var i = t(28),
            r = t(19),
            a = t(22);
        e.exports = o
    }, {
        19: 19,
        22: 22,
        28: 28
    }],
    31: [function(t, e, n) {
        function o(t, e) {
            for (var n, o = 0, a = arguments.length; ++o < a;) null != (n = arguments[o]) && r(n, i, t);
            return t
        }

        function i(t, e) {
            this[e] = t
        }
        var r = t(27);
        e.exports = o
    }, {
        27: 27
    }],
    32: [function(t, e, n) {
        function o(t, e) {
            for (var n, o, s, u, l = (t || "").replace("?", "").split("&"), c = -1, d = {}; o = l[++c];) n = o.indexOf("="), u = o.substring(0, n), s = decodeURIComponent(o.substring(n + 1)), !1 !== e && (s = i(s)), a(d, u) ? r(d[u]) ? d[u].push(s) : d[u] = [d[u], s] : d[u] = s;
            return d
        }
        var i = t(36),
            r = t(20),
            a = t(28);
        e.exports = o
    }, {
        20: 20,
        28: 28,
        36: 36
    }],
    33: [function(t, e, n) {
        function o(t) {
            var e, n, o = [];
            return i(t, function(t, i) {
                r(t) ? (e = i + "=", n = new RegExp("&" + i + "+=$"), a(t, function(t) {
                    e += encodeURIComponent(t) + "&" + i + "="
                }), o.push(e.replace(n, ""))) : o.push(i + "=" + encodeURIComponent(t))
            }), o.length ? "?" + o.join("&") : ""
        }
        var i = t(27),
            r = t(20),
            a = t(16);
        e.exports = o
    }, {
        16: 16,
        20: 20,
        27: 27
    }],
    34: [function(t, e, n) {
        function o(t) {
            t = t.replace(/#.*/, "");
            var e = /\?[a-zA-Z0-9\=\&\%\$\-\_\.\+\!\*\'\(\)\,]+/.exec(t);
            return e ? decodeURIComponent(e[0].replace(/\+/g, " ")) : ""
        }
        e.exports = o
    }, {}],
    35: [function(t, e, n) {
        function o(t, e) {
            return i(r(t), e)
        }
        var i = t(32),
            r = t(34);
        e.exports = o
    }, {
        32: 32,
        34: 34
    }],
    36: [function(t, e, n) {
        function o(t) {
            return null === t || "null" === t ? null : "true" === t || "false" !== t && (t === i || "undefined" === t ? i : "" === t || isNaN(t) ? t : parseFloat(t))
        }
        var i;
        e.exports = o
    }, {}],
    37: [function(t, e, n) {
        (function(t) {
            (function() {
                var n, o, i;
                "undefined" != typeof performance && null !== performance && performance.now ? e.exports = function() {
                    return performance.now()
                } : void 0 !== t && null !== t && t.hrtime ? (e.exports = function() {
                    return (n() - i) / 1e6
                }, o = t.hrtime, n = function() {
                    var t;
                    return t = o(), 1e9 * t[0] + t[1]
                }, i = n()) : Date.now ? (e.exports = function() {
                    return Date.now() - i
                }, i = Date.now()) : (e.exports = function() {
                    return (new Date).getTime() - i
                }, i = (new Date).getTime())
            }).call(this)
        }).call(this, t(39))
    }, {
        39: 39
    }],
    38: [function(t, e, n) {
        var o = null;
        e.exports = function(t) {
            var e = ["Moz", "Khtml", "Webkit", "O", "ms"],
                n = t.charAt(0).toUpperCase() + t.slice(1);
            if (o || (o = document.createElement("div")), t in o.style) return t;
            for (var i = e.length; i--;)
                if (e[i] + n in o.style) return e[i] + n;
            return !1
        }
    }, {}],
    39: [function(t, e, n) {
        function o() {
            throw new Error("setTimeout has not been defined")
        }

        function i() {
            throw new Error("clearTimeout has not been defined")
        }

        function r(t) {
            if (d === setTimeout) return setTimeout(t, 0);
            if ((d === o || !d) && setTimeout) return d = setTimeout, setTimeout(t, 0);
            try {
                return d(t, 0)
            } catch (e) {
                try {
                    return d.call(null, t, 0)
                } catch (e) {
                    return d.call(this, t, 0)
                }
            }
        }

        function a(t) {
            if (h === clearTimeout) return clearTimeout(t);
            if ((h === i || !h) && clearTimeout) return h = clearTimeout, clearTimeout(t);
            try {
                return h(t)
            } catch (e) {
                try {
                    return h.call(null, t)
                } catch (e) {
                    return h.call(this, t)
                }
            }
        }

        function s() {
            v && f && (v = !1, f.length ? m = f.concat(m) : g = -1, m.length && u())
        }

        function u() {
            if (!v) {
                var t = r(s);
                v = !0;
                for (var e = m.length; e;) {
                    for (f = m, m = []; ++g < e;) f && f[g].run();
                    g = -1, e = m.length
                }
                f = null, v = !1, a(t)
            }
        }

        function l(t, e) {
            this.fun = t, this.array = e
        }

        function c() {}
        var d, h, p = e.exports = {};
        ! function() {
            try {
                d = "function" == typeof setTimeout ? setTimeout : o
            } catch (t) {
                d = o
            }
            try {
                h = "function" == typeof clearTimeout ? clearTimeout : i
            } catch (t) {
                h = i
            }
        }();
        var f, m = [],
            v = !1,
            g = -1;
        p.nextTick = function(t) {
            var e = new Array(arguments.length - 1);
            if (arguments.length > 1)
                for (var n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
            m.push(new l(t, e)), 1 !== m.length || v || r(u)
        }, l.prototype.run = function() {
            this.fun.apply(null, this.array)
        }, p.title = "browser", p.browser = !0, p.env = {}, p.argv = [], p.version = "", p.versions = {}, p.on = c, p.addListener = c, p.once = c, p.off = c, p.removeListener = c, p.removeAllListeners = c, p.emit = c, p.prependListener = c, p.prependOnceListener = c, p.listeners = function(t) {
            return []
        }, p.binding = function(t) {
            throw new Error("process.binding is not supported")
        }, p.cwd = function() {
            return "/"
        }, p.chdir = function(t) {
            throw new Error("process.chdir is not supported")
        }, p.umask = function() {
            return 0
        }
    }, {}],
    40: [function(t, e, n) {
        for (var o = t(37), i = "undefined" == typeof window ? {} : window, r = ["moz", "webkit"], a = "AnimationFrame", s = i["request" + a], u = i["cancel" + a] || i["cancelRequest" + a], l = 0; l < r.length && !s; l++) s = i[r[l] + "Request" + a], u = i[r[l] + "Cancel" + a] || i[r[l] + "CancelRequest" + a];
        if (!s || !u) {
            var c = 0,
                d = 0,
                h = [];
            s = function(t) {
                if (0 === h.length) {
                    var e = o(),
                        n = Math.max(0, 1e3 / 60 - (e - c));
                    c = n + e, setTimeout(function() {
                        var t = h.slice(0);
                        h.length = 0;
                        for (var e = 0; e < t.length; e++)
                            if (!t[e].cancelled) try {
                                t[e].callback(c)
                            } catch (t) {
                                setTimeout(function() {
                                    throw t
                                }, 0)
                            }
                    }, Math.round(n))
                }
                return h.push({
                    handle: ++d,
                    callback: t,
                    cancelled: !1
                }), d
            }, u = function(t) {
                for (var e = 0; e < h.length; e++) h[e].handle === t && (h[e].cancelled = !0)
            }
        }
        e.exports = function(t) {
            return s.call(i, t)
        }, e.exports.cancel = function() {
            u.apply(i, arguments)
        }
    }, {
        37: 37
    }],
    41: [function(t, e, n) {
        ! function(t, o) {
            "object" == typeof n && void 0 !== e ? e.exports = o() : "function" == typeof define && define.amd ? define(o) : t.Stats = o()
        }(this, function() {
            "use strict";
            var t = function() {
                function e(t) {
                    return i.appendChild(t.dom), t
                }

                function n(t) {
                    for (var e = 0; e < i.children.length; e++) i.children[e].style.display = e === t ? "block" : "none";
                    o = t
                }
                var o = 0,
                    i = document.createElement("div");
                i.style.cssText = "position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000", i.addEventListener("click", function(t) {
                    t.preventDefault(), n(++o % i.children.length)
                }, !1);
                var r = (performance || Date).now(),
                    a = r,
                    s = 0,
                    u = e(new t.Panel("FPS", "#0ff", "#002")),
                    l = e(new t.Panel("MS", "#0f0", "#020"));
                if (self.performance && self.performance.memory) var c = e(new t.Panel("MB", "#f08", "#201"));
                return n(0), {
                    REVISION: 16,
                    dom: i,
                    addPanel: e,
                    showPanel: n,
                    begin: function() {
                        r = (performance || Date).now()
                    },
                    end: function() {
                        s++;
                        var t = (performance || Date).now();
                        if (l.update(t - r, 200), t > a + 1e3 && (u.update(1e3 * s / (t - a), 100), a = t, s = 0, c)) {
                            var e = performance.memory;
                            c.update(e.usedJSHeapSize / 1048576, e.jsHeapSizeLimit / 1048576)
                        }
                        return t
                    },
                    update: function() {
                        r = this.end()
                    },
                    domElement: i,
                    setMode: n
                }
            };
            return t.Panel = function(t, e, n) {
                var o = 1 / 0,
                    i = 0,
                    r = Math.round,
                    a = r(window.devicePixelRatio || 1),
                    s = 80 * a,
                    u = 48 * a,
                    l = 3 * a,
                    c = 2 * a,
                    d = 3 * a,
                    h = 15 * a,
                    p = 74 * a,
                    f = 30 * a,
                    m = document.createElement("canvas");
                m.width = s, m.height = u, m.style.cssText = "width:80px;height:48px";
                var v = m.getContext("2d");
                return v.font = "bold " + 9 * a + "px Helvetica,Arial,sans-serif", v.textBaseline = "top", v.fillStyle = n, v.fillRect(0, 0, s, u), v.fillStyle = e, v.fillText(t, l, c), v.fillRect(d, h, p, f), v.fillStyle = n, v.globalAlpha = .9, v.fillRect(d, h, p, f), {
                    dom: m,
                    update: function(u, g) {
                        o = Math.min(o, u), i = Math.max(i, u), v.fillStyle = n, v.globalAlpha = 1, v.fillRect(0, 0, s, h), v.fillStyle = e, v.fillText(r(u) + " " + t + " (" + r(o) + "-" + r(i) + ")", l, c), v.drawImage(m, d + a, h, p - a, f, d, h, p - a, f), v.fillRect(d + p - a, h, a, f), v.fillStyle = n, v.globalAlpha = .9, v.fillRect(d + p - a, h, a, r((1 - u / g) * f))
                    }
                }
            }, t
        })
    }, {}],
    42: [function(t, e, n) {
        e.exports = window.THREE
    }, {}],
    43: [function(t, e, n) {
        function o(t) {
            return i(t).replace(/\s(\w)/g, function(t, e) {
                return e.toUpperCase()
            })
        }
        var i = t(45);
        e.exports = o
    }, {
        45: 45
    }],
    44: [function(t, e, n) {
        function o(t) {
            return a.test(t) ? t.toLowerCase() : (u.test(t) && (t = i(t)), s.test(t) && (t = r(t)), t.toLowerCase())
        }

        function i(t) {
            return t.replace(l, function(t, e) {
                return e ? " " + e : ""
            })
        }

        function r(t) {
            return t.replace(c, function(t, e, n) {
                return e + " " + n.toLowerCase().split("").join(" ")
            })
        }
        e.exports = o;
        var a = /\s/,
            s = /[a-z][A-Z]/,
            u = /[\W_]/,
            l = /[\W_]+(.|$)/g,
            c = /(.)([A-Z]+)/g
    }, {}],
    45: [function(t, e, n) {
        function o(t) {
            return i(t).replace(/[\W_]+(.|$)/g, function(t, e) {
                return e ? " " + e : ""
            })
        }
        var i = t(44);
        e.exports = o
    }, {
        44: 44
    }],
    46: [function(t, e, n) {
        (function() {
            function t(t) {
                function e(e, n, o, i, r, a) {
                    for (; r >= 0 && r < a; r += t) {
                        var s = i ? i[r] : r;
                        o = n(o, e[s], s, e)
                    }
                    return o
                }
                return function(n, o, i, r) {
                    o = y(o, r, 4);
                    var a = !A(n) && b.keys(n),
                        s = (a || n).length,
                        u = t > 0 ? 0 : s - 1;
                    return arguments.length < 3 && (i = n[a ? a[u] : u], u += t), e(n, o, i, a, u, s)
                }
            }

            function o(t) {
                return function(e, n, o) {
                    n = M(n, o);
                    for (var i = D(e), r = t > 0 ? 0 : i - 1; r >= 0 && r < i; r += t)
                        if (n(e[r], r, e)) return r;
                    return -1
                }
            }

            function i(t, e, n) {
                return function(o, i, r) {
                    var a = 0,
                        s = D(o);
                    if ("number" == typeof r) t > 0 ? a = r >= 0 ? r : Math.max(r + s, a) : s = r >= 0 ? Math.min(r + 1, s) : r + s + 1;
                    else if (n && r && s) return r = n(o, i), o[r] === i ? r : -1;
                    if (i !== i) return r = e(h.call(o, a, s), b.isNaN), r >= 0 ? r + a : -1;
                    for (r = t > 0 ? a : s - 1; r >= 0 && r < s; r += t)
                        if (o[r] === i) return r;
                    return -1
                }
            }

            function r(t, e) {
                var n = C.length,
                    o = t.constructor,
                    i = b.isFunction(o) && o.prototype || l,
                    r = "constructor";
                for (b.has(t, r) && !b.contains(e, r) && e.push(r); n--;)(r = C[n]) in t && t[r] !== i[r] && !b.contains(e, r) && e.push(r)
            }
            var a = this,
                s = a._,
                u = Array.prototype,
                l = Object.prototype,
                c = Function.prototype,
                d = u.push,
                h = u.slice,
                p = l.toString,
                f = l.hasOwnProperty,
                m = Array.isArray,
                v = Object.keys,
                g = c.bind,
                _ = Object.create,
                x = function() {},
                b = function(t) {
                    return t instanceof b ? t : this instanceof b ? void(this._wrapped = t) : new b(t)
                };
            void 0 !== n ? (void 0 !== e && e.exports && (n = e.exports = b), n._ = b) : a._ = b, b.VERSION = "1.8.3";
            var y = function(t, e, n) {
                    if (void 0 === e) return t;
                    switch (null == n ? 3 : n) {
                        case 1:
                            return function(n) {
                                return t.call(e, n)
                            };
                        case 2:
                            return function(n, o) {
                                return t.call(e, n, o)
                            };
                        case 3:
                            return function(n, o, i) {
                                return t.call(e, n, o, i)
                            };
                        case 4:
                            return function(n, o, i, r) {
                                return t.call(e, n, o, i, r)
                            }
                    }
                    return function() {
                        return t.apply(e, arguments)
                    }
                },
                M = function(t, e, n) {
                    return null == t ? b.identity : b.isFunction(t) ? y(t, e, n) : b.isObject(t) ? b.matcher(t) : b.property(t)
                };
            b.iteratee = function(t, e) {
                return M(t, e, 1 / 0)
            };
            var S = function(t, e) {
                    return function(n) {
                        var o = arguments.length;
                        if (o < 2 || null == n) return n;
                        for (var i = 1; i < o; i++)
                            for (var r = arguments[i], a = t(r), s = a.length, u = 0; u < s; u++) {
                                var l = a[u];
                                e && void 0 !== n[l] || (n[l] = r[l])
                            }
                        return n
                    }
                },
                w = function(t) {
                    if (!b.isObject(t)) return {};
                    if (_) return _(t);
                    x.prototype = t;
                    var e = new x;
                    return x.prototype = null, e
                },
                E = function(t) {
                    return function(e) {
                        return null == e ? void 0 : e[t]
                    }
                },
                I = Math.pow(2, 53) - 1,
                D = E("length"),
                A = function(t) {
                    var e = D(t);
                    return "number" == typeof e && e >= 0 && e <= I
                };
            b.each = b.forEach = function(t, e, n) {
                e = y(e, n);
                var o, i;
                if (A(t))
                    for (o = 0, i = t.length; o < i; o++) e(t[o], o, t);
                else {
                    var r = b.keys(t);
                    for (o = 0, i = r.length; o < i; o++) e(t[r[o]], r[o], t)
                }
                return t
            }, b.map = b.collect = function(t, e, n) {
                e = M(e, n);
                for (var o = !A(t) && b.keys(t), i = (o || t).length, r = Array(i), a = 0; a < i; a++) {
                    var s = o ? o[a] : a;
                    r[a] = e(t[s], s, t)
                }
                return r
            }, b.reduce = b.foldl = b.inject = t(1), b.reduceRight = b.foldr = t(-1), b.find = b.detect = function(t, e, n) {
                var o;
                if (void 0 !== (o = A(t) ? b.findIndex(t, e, n) : b.findKey(t, e, n)) && -1 !== o) return t[o]
            }, b.filter = b.select = function(t, e, n) {
                var o = [];
                return e = M(e, n), b.each(t, function(t, n, i) {
                    e(t, n, i) && o.push(t)
                }), o
            }, b.reject = function(t, e, n) {
                return b.filter(t, b.negate(M(e)), n)
            }, b.every = b.all = function(t, e, n) {
                e = M(e, n);
                for (var o = !A(t) && b.keys(t), i = (o || t).length, r = 0; r < i; r++) {
                    var a = o ? o[r] : r;
                    if (!e(t[a], a, t)) return !1
                }
                return !0
            }, b.some = b.any = function(t, e, n) {
                e = M(e, n);
                for (var o = !A(t) && b.keys(t), i = (o || t).length, r = 0; r < i; r++) {
                    var a = o ? o[r] : r;
                    if (e(t[a], a, t)) return !0
                }
                return !1
            }, b.contains = b.includes = b.include = function(t, e, n, o) {
                return A(t) || (t = b.values(t)), ("number" != typeof n || o) && (n = 0), b.indexOf(t, e, n) >= 0
            }, b.invoke = function(t, e) {
                var n = h.call(arguments, 2),
                    o = b.isFunction(e);
                return b.map(t, function(t) {
                    var i = o ? e : t[e];
                    return null == i ? i : i.apply(t, n)
                })
            }, b.pluck = function(t, e) {
                return b.map(t, b.property(e))
            }, b.where = function(t, e) {
                return b.filter(t, b.matcher(e))
            }, b.findWhere = function(t, e) {
                return b.find(t, b.matcher(e))
            }, b.max = function(t, e, n) {
                var o, i, r = -1 / 0,
                    a = -1 / 0;
                if (null == e && null != t) {
                    t = A(t) ? t : b.values(t);
                    for (var s = 0, u = t.length; s < u; s++)(o = t[s]) > r && (r = o)
                } else e = M(e, n), b.each(t, function(t, n, o) {
                    ((i = e(t, n, o)) > a || i === -1 / 0 && r === -1 / 0) && (r = t, a = i)
                });
                return r
            }, b.min = function(t, e, n) {
                var o, i, r = 1 / 0,
                    a = 1 / 0;
                if (null == e && null != t) {
                    t = A(t) ? t : b.values(t);
                    for (var s = 0, u = t.length; s < u; s++)(o = t[s]) < r && (r = o)
                } else e = M(e, n), b.each(t, function(t, n, o) {
                    ((i = e(t, n, o)) < a || i === 1 / 0 && r === 1 / 0) && (r = t, a = i)
                });
                return r
            }, b.shuffle = function(t) {
                for (var e, n = A(t) ? t : b.values(t), o = n.length, i = Array(o), r = 0; r < o; r++) e = b.random(0, r), e !== r && (i[r] = i[e]), i[e] = n[r];
                return i
            }, b.sample = function(t, e, n) {
                return null == e || n ? (A(t) || (t = b.values(t)), t[b.random(t.length - 1)]) : b.shuffle(t).slice(0, Math.max(0, e))
            }, b.sortBy = function(t, e, n) {
                return e = M(e, n), b.pluck(b.map(t, function(t, n, o) {
                    return {
                        value: t,
                        index: n,
                        criteria: e(t, n, o)
                    }
                }).sort(function(t, e) {
                    var n = t.criteria,
                        o = e.criteria;
                    if (n !== o) {
                        if (n > o || void 0 === n) return 1;
                        if (n < o || void 0 === o) return -1
                    }
                    return t.index - e.index
                }), "value")
            };
            var F = function(t) {
                return function(e, n, o) {
                    var i = {};
                    return n = M(n, o), b.each(e, function(o, r) {
                        var a = n(o, r, e);
                        t(i, o, a)
                    }), i
                }
            };
            b.groupBy = F(function(t, e, n) {
                b.has(t, n) ? t[n].push(e) : t[n] = [e]
            }), b.indexBy = F(function(t, e, n) {
                t[n] = e
            }), b.countBy = F(function(t, e, n) {
                b.has(t, n) ? t[n]++ : t[n] = 1
            }), b.toArray = function(t) {
                return t ? b.isArray(t) ? h.call(t) : A(t) ? b.map(t, b.identity) : b.values(t) : []
            }, b.size = function(t) {
                return null == t ? 0 : A(t) ? t.length : b.keys(t).length
            }, b.partition = function(t, e, n) {
                e = M(e, n);
                var o = [],
                    i = [];
                return b.each(t, function(t, n, r) {
                    (e(t, n, r) ? o : i).push(t)
                }), [o, i]
            }, b.first = b.head = b.take = function(t, e, n) {
                if (null != t) return null == e || n ? t[0] : b.initial(t, t.length - e)
            }, b.initial = function(t, e, n) {
                return h.call(t, 0, Math.max(0, t.length - (null == e || n ? 1 : e)))
            }, b.last = function(t, e, n) {
                if (null != t) return null == e || n ? t[t.length - 1] : b.rest(t, Math.max(0, t.length - e))
            }, b.rest = b.tail = b.drop = function(t, e, n) {
                return h.call(t, null == e || n ? 1 : e)
            }, b.compact = function(t) {
                return b.filter(t, b.identity)
            };
            var R = function(t, e, n, o) {
                for (var i = [], r = 0, a = o || 0, s = D(t); a < s; a++) {
                    var u = t[a];
                    if (A(u) && (b.isArray(u) || b.isArguments(u))) {
                        e || (u = R(u, e, n));
                        var l = 0,
                            c = u.length;
                        for (i.length += c; l < c;) i[r++] = u[l++]
                    } else n || (i[r++] = u)
                }
                return i
            };
            b.flatten = function(t, e) {
                return R(t, e, !1)
            }, b.without = function(t) {
                return b.difference(t, h.call(arguments, 1))
            }, b.uniq = b.unique = function(t, e, n, o) {
                b.isBoolean(e) || (o = n, n = e, e = !1), null != n && (n = M(n, o));
                for (var i = [], r = [], a = 0, s = D(t); a < s; a++) {
                    var u = t[a],
                        l = n ? n(u, a, t) : u;
                    e ? (a && r === l || i.push(u), r = l) : n ? b.contains(r, l) || (r.push(l), i.push(u)) : b.contains(i, u) || i.push(u)
                }
                return i
            }, b.union = function() {
                return b.uniq(R(arguments, !0, !0))
            }, b.intersection = function(t) {
                for (var e = [], n = arguments.length, o = 0, i = D(t); o < i; o++) {
                    var r = t[o];
                    if (!b.contains(e, r)) {
                        for (var a = 1; a < n && b.contains(arguments[a], r); a++);
                        a === n && e.push(r)
                    }
                }
                return e
            }, b.difference = function(t) {
                var e = R(arguments, !0, !0, 1);
                return b.filter(t, function(t) {
                    return !b.contains(e, t)
                })
            }, b.zip = function() {
                return b.unzip(arguments)
            }, b.unzip = function(t) {
                for (var e = t && b.max(t, D).length || 0, n = Array(e), o = 0; o < e; o++) n[o] = b.pluck(t, o);
                return n
            }, b.object = function(t, e) {
                for (var n = {}, o = 0, i = D(t); o < i; o++) e ? n[t[o]] = e[o] : n[t[o][0]] = t[o][1];
                return n
            }, b.findIndex = o(1), b.findLastIndex = o(-1), b.sortedIndex = function(t, e, n, o) {
                n = M(n, o, 1);
                for (var i = n(e), r = 0, a = D(t); r < a;) {
                    var s = Math.floor((r + a) / 2);
                    n(t[s]) < i ? r = s + 1 : a = s
                }
                return r
            }, b.indexOf = i(1, b.findIndex, b.sortedIndex), b.lastIndexOf = i(-1, b.findLastIndex), b.range = function(t, e, n) {
                null == e && (e = t || 0, t = 0), n = n || 1;
                for (var o = Math.max(Math.ceil((e - t) / n), 0), i = Array(o), r = 0; r < o; r++, t += n) i[r] = t;
                return i
            };
            var P = function(t, e, n, o, i) {
                if (!(o instanceof e)) return t.apply(n, i);
                var r = w(t.prototype),
                    a = t.apply(r, i);
                return b.isObject(a) ? a : r
            };
            b.bind = function(t, e) {
                if (g && t.bind === g) return g.apply(t, h.call(arguments, 1));
                if (!b.isFunction(t)) throw new TypeError("Bind must be called on a function");
                var n = h.call(arguments, 2),
                    o = function() {
                        return P(t, o, e, this, n.concat(h.call(arguments)))
                    };
                return o
            }, b.partial = function(t) {
                var e = h.call(arguments, 1),
                    n = function() {
                        for (var o = 0, i = e.length, r = Array(i), a = 0; a < i; a++) r[a] = e[a] === b ? arguments[o++] : e[a];
                        for (; o < arguments.length;) r.push(arguments[o++]);
                        return P(t, n, this, this, r)
                    };
                return n
            }, b.bindAll = function(t) {
                var e, n, o = arguments.length;
                if (o <= 1) throw new Error("bindAll must be passed function names");
                for (e = 1; e < o; e++) n = arguments[e], t[n] = b.bind(t[n], t);
                return t
            }, b.memoize = function(t, e) {
                var n = function(o) {
                    var i = n.cache,
                        r = "" + (e ? e.apply(this, arguments) : o);
                    return b.has(i, r) || (i[r] = t.apply(this, arguments)), i[r]
                };
                return n.cache = {}, n
            }, b.delay = function(t, e) {
                var n = h.call(arguments, 2);
                return setTimeout(function() {
                    return t.apply(null, n)
                }, e)
            }, b.defer = b.partial(b.delay, b, 1), b.throttle = function(t, e, n) {
                var o, i, r, a = null,
                    s = 0;
                n || (n = {});
                var u = function() {
                    s = !1 === n.leading ? 0 : b.now(), a = null, r = t.apply(o, i), a || (o = i = null)
                };
                return function() {
                    var l = b.now();
                    s || !1 !== n.leading || (s = l);
                    var c = e - (l - s);
                    return o = this, i = arguments, c <= 0 || c > e ? (a && (clearTimeout(a), a = null), s = l, r = t.apply(o, i), a || (o = i = null)) : a || !1 === n.trailing || (a = setTimeout(u, c)), r
                }
            }, b.debounce = function(t, e, n) {
                var o, i, r, a, s, u = function() {
                    var l = b.now() - a;
                    l < e && l >= 0 ? o = setTimeout(u, e - l) : (o = null, n || (s = t.apply(r, i), o || (r = i = null)))
                };
                return function() {
                    r = this, i = arguments, a = b.now();
                    var l = n && !o;
                    return o || (o = setTimeout(u, e)), l && (s = t.apply(r, i), r = i = null), s
                }
            }, b.wrap = function(t, e) {
                return b.partial(e, t)
            }, b.negate = function(t) {
                return function() {
                    return !t.apply(this, arguments)
                }
            }, b.compose = function() {
                var t = arguments,
                    e = t.length - 1;
                return function() {
                    for (var n = e, o = t[e].apply(this, arguments); n--;) o = t[n].call(this, o);
                    return o
                }
            }, b.after = function(t, e) {
                return function() {
                    if (--t < 1) return e.apply(this, arguments)
                }
            }, b.before = function(t, e) {
                var n;
                return function() {
                    return --t > 0 && (n = e.apply(this, arguments)), t <= 1 && (e = null), n
                }
            }, b.once = b.partial(b.before, 2);
            var T = !{
                    toString: null
                }.propertyIsEnumerable("toString"),
                C = ["valueOf", "isPrototypeOf", "toString", "propertyIsEnumerable", "hasOwnProperty", "toLocaleString"];
            b.keys = function(t) {
                if (!b.isObject(t)) return [];
                if (v) return v(t);
                var e = [];
                for (var n in t) b.has(t, n) && e.push(n);
                return T && r(t, e), e
            }, b.allKeys = function(t) {
                if (!b.isObject(t)) return [];
                var e = [];
                for (var n in t) e.push(n);
                return T && r(t, e), e
            }, b.values = function(t) {
                for (var e = b.keys(t), n = e.length, o = Array(n), i = 0; i < n; i++) o[i] = t[e[i]];
                return o
            }, b.mapObject = function(t, e, n) {
                e = M(e, n);
                for (var o, i = b.keys(t), r = i.length, a = {}, s = 0; s < r; s++) o = i[s], a[o] = e(t[o], o, t);
                return a
            }, b.pairs = function(t) {
                for (var e = b.keys(t), n = e.length, o = Array(n), i = 0; i < n; i++) o[i] = [e[i], t[e[i]]];
                return o
            }, b.invert = function(t) {
                for (var e = {}, n = b.keys(t), o = 0, i = n.length; o < i; o++) e[t[n[o]]] = n[o];
                return e
            }, b.functions = b.methods = function(t) {
                var e = [];
                for (var n in t) b.isFunction(t[n]) && e.push(n);
                return e.sort()
            }, b.extend = S(b.allKeys), b.extendOwn = b.assign = S(b.keys), b.findKey = function(t, e, n) {
                e = M(e, n);
                for (var o, i = b.keys(t), r = 0, a = i.length; r < a; r++)
                    if (o = i[r], e(t[o], o, t)) return o
            }, b.pick = function(t, e, n) {
                var o, i, r = {},
                    a = t;
                if (null == a) return r;
                b.isFunction(e) ? (i = b.allKeys(a), o = y(e, n)) : (i = R(arguments, !1, !1, 1), o = function(t, e, n) {
                    return e in n
                }, a = Object(a));
                for (var s = 0, u = i.length; s < u; s++) {
                    var l = i[s],
                        c = a[l];
                    o(c, l, a) && (r[l] = c)
                }
                return r
            }, b.omit = function(t, e, n) {
                if (b.isFunction(e)) e = b.negate(e);
                else {
                    var o = b.map(R(arguments, !1, !1, 1), String);
                    e = function(t, e) {
                        return !b.contains(o, e)
                    }
                }
                return b.pick(t, e, n)
            }, b.defaults = S(b.allKeys, !0), b.create = function(t, e) {
                var n = w(t);
                return e && b.extendOwn(n, e), n
            }, b.clone = function(t) {
                return b.isObject(t) ? b.isArray(t) ? t.slice() : b.extend({}, t) : t
            }, b.tap = function(t, e) {
                return e(t), t
            }, b.isMatch = function(t, e) {
                var n = b.keys(e),
                    o = n.length;
                if (null == t) return !o;
                for (var i = Object(t), r = 0; r < o; r++) {
                    var a = n[r];
                    if (e[a] !== i[a] || !(a in i)) return !1
                }
                return !0
            };
            var O = function(t, e, n, o) {
                if (t === e) return 0 !== t || 1 / t == 1 / e;
                if (null == t || null == e) return t === e;
                t instanceof b && (t = t._wrapped), e instanceof b && (e = e._wrapped);
                var i = p.call(t);
                if (i !== p.call(e)) return !1;
                switch (i) {
                    case "[object RegExp]":
                    case "[object String]":
                        return "" + t == "" + e;
                    case "[object Number]":
                        return +t != +t ? +e != +e : 0 == +t ? 1 / +t == 1 / e : +t == +e;
                    case "[object Date]":
                    case "[object Boolean]":
                        return +t == +e
                }
                var r = "[object Array]" === i;
                if (!r) {
                    if ("object" != typeof t || "object" != typeof e) return !1;
                    var a = t.constructor,
                        s = e.constructor;
                    if (a !== s && !(b.isFunction(a) && a instanceof a && b.isFunction(s) && s instanceof s) && "constructor" in t && "constructor" in e) return !1
                }
                n = n || [], o = o || [];
                for (var u = n.length; u--;)
                    if (n[u] === t) return o[u] === e;
                if (n.push(t), o.push(e), r) {
                    if ((u = t.length) !== e.length) return !1;
                    for (; u--;)
                        if (!O(t[u], e[u], n, o)) return !1
                } else {
                    var l, c = b.keys(t);
                    if (u = c.length, b.keys(e).length !== u) return !1;
                    for (; u--;)
                        if (l = c[u], !b.has(e, l) || !O(t[l], e[l], n, o)) return !1
                }
                return n.pop(), o.pop(), !0
            };
            b.isEqual = function(t, e) {
                return O(t, e)
            }, b.isEmpty = function(t) {
                return null == t || (A(t) && (b.isArray(t) || b.isString(t) || b.isArguments(t)) ? 0 === t.length : 0 === b.keys(t).length)
            }, b.isElement = function(t) {
                return !(!t || 1 !== t.nodeType)
            }, b.isArray = m || function(t) {
                return "[object Array]" === p.call(t)
            }, b.isObject = function(t) {
                var e = typeof t;
                return "function" === e || "object" === e && !!t
            }, b.each(["Arguments", "Function", "String", "Number", "Date", "RegExp", "Error"], function(t) {
                b["is" + t] = function(e) {
                    return p.call(e) === "[object " + t + "]"
                }
            }), b.isArguments(arguments) || (b.isArguments = function(t) {
                return b.has(t, "callee")
            }), "function" != typeof /./ && "object" != typeof Int8Array && (b.isFunction = function(t) {
                return "function" == typeof t || !1
            }), b.isFinite = function(t) {
                return isFinite(t) && !isNaN(parseFloat(t))
            }, b.isNaN = function(t) {
                return b.isNumber(t) && t !== +t
            }, b.isBoolean = function(t) {
                return !0 === t || !1 === t || "[object Boolean]" === p.call(t)
            }, b.isNull = function(t) {
                return null === t
            }, b.isUndefined = function(t) {
                return void 0 === t
            }, b.has = function(t, e) {
                return null != t && f.call(t, e)
            }, b.noConflict = function() {
                return a._ = s, this
            }, b.identity = function(t) {
                return t
            }, b.constant = function(t) {
                return function() {
                    return t
                }
            }, b.noop = function() {}, b.property = E, b.propertyOf = function(t) {
                return null == t ? function() {} : function(e) {
                    return t[e]
                }
            }, b.matcher = b.matches = function(t) {
                return t = b.extendOwn({}, t),
                    function(e) {
                        return b.isMatch(e, t)
                    }
            }, b.times = function(t, e, n) {
                var o = Array(Math.max(0, t));
                e = y(e, n, 1);
                for (var i = 0; i < t; i++) o[i] = e(i);
                return o
            }, b.random = function(t, e) {
                return null == e && (e = t, t = 0), t + Math.floor(Math.random() * (e - t + 1))
            }, b.now = Date.now || function() {
                return (new Date).getTime()
            };
            var N = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#x27;",
                    "`": "&#x60;"
                },
                L = b.invert(N),
                z = function(t) {
                    var e = function(e) {
                            return t[e]
                        },
                        n = "(?:" + b.keys(t).join("|") + ")",
                        o = RegExp(n),
                        i = RegExp(n, "g");
                    return function(t) {
                        return t = null == t ? "" : "" + t, o.test(t) ? t.replace(i, e) : t
                    }
                };
            b.escape = z(N), b.unescape = z(L), b.result = function(t, e, n) {
                var o = null == t ? void 0 : t[e];
                return void 0 === o && (o = n), b.isFunction(o) ? o.call(t) : o
            };
            var k = 0;
            b.uniqueId = function(t) {
                var e = ++k + "";
                return t ? t + e : e
            }, b.templateSettings = {
                evaluate: /<%([\s\S]+?)%>/g,
                interpolate: /<%=([\s\S]+?)%>/g,
                escape: /<%-([\s\S]+?)%>/g
            };
            var B = {
                    "'": "'",
                    "\\": "\\",
                    "\r": "r",
                    "\n": "n",
                    "\u2028": "u2028",
                    "\u2029": "u2029"
                },
                V = function(t) {
                    return "\\" + B[t]
                };
            b.template = function(t, e, n) {
                !e && n && (e = n), e = b.defaults({}, e, b.templateSettings);
                var o = RegExp([(e.escape || /(.)^/).source, (e.interpolate || /(.)^/).source, (e.evaluate || /(.)^/).source].join("|") + "|$", "g"),
                    i = 0,
                    r = "__p+='";
                t.replace(o, function(e, n, o, a, s) {
                    return r += t.slice(i, s).replace(/\\|'|\r|\n|\u2028|\u2029/g, V), i = s + e.length, n ? r += "'+\n((__t=(" + n + "))==null?'':_.escape(__t))+\n'" : o ? r += "'+\n((__t=(" + o + "))==null?'':__t)+\n'" : a && (r += "';\n" + a + "\n__p+='"), e
                }), r += "';\n", e.variable || (r = "with(obj||{}){\n" + r + "}\n"), r = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + r + "return __p;\n";
                try {
                    var a = new Function(e.variable || "obj", "_", r)
                } catch (t) {
                    throw t.source = r, t
                }
                var s = function(t) {
                    return a.call(this, t, b)
                };
                return s.source = "function(" + (e.variable || "obj") + "){\n" + r + "}", s
            }, b.chain = function(t) {
                var e = b(t);
                return e._chain = !0, e
            };
            var U = function(t, e) {
                return t._chain ? b(e).chain() : e
            };
            b.mixin = function(t) {
                b.each(b.functions(t), function(e) {
                    var n = b[e] = t[e];
                    b.prototype[e] = function() {
                        var t = [this._wrapped];
                        return d.apply(t, arguments), U(this, n.apply(b, t))
                    }
                })
            }, b.mixin(b), b.each(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(t) {
                var e = u[t];
                b.prototype[t] = function() {
                    var n = this._wrapped;
                    return e.apply(n, arguments), "shift" !== t && "splice" !== t || 0 !== n.length || delete n[0], U(this, n)
                }
            }), b.each(["concat", "join", "slice"], function(t) {
                var e = u[t];
                b.prototype[t] = function() {
                    return U(this, e.apply(this._wrapped, arguments))
                }
            }), b.prototype.value = function() {
                return this._wrapped
            }, b.prototype.valueOf = b.prototype.toJSON = b.prototype.value, b.prototype.toString = function() {
                return "" + this._wrapped
            }, "function" == typeof define && define.amd && define("underscore", [], function() {
                return b
            })
        }).call(this)
    }, {}],
    47: [function(t, e, n) {
        function o(t, e, n) {
            return e ? new r(t, e) : new r(t)
        }
        var i = function() {
                return this
            }(),
            r = i.WebSocket || i.MozWebSocket;
        e.exports = r ? o : null, r && (o.prototype = r.prototype)
    }, {}],
    48: [function(t, e, n) {
        THREE.OrbitControls = function(t, e) {
            function n() {
                return 2 * Math.PI / 60 / 60 * f.autoRotateSpeed
            }

            function o() {
                return Math.pow(.95, f.zoomSpeed)
            }

            function i(t) {
                if (!1 !== f.enabled) {
                    if (t.preventDefault(), t.button === f.mouseButtons.ORBIT) {
                        if (!0 === f.noRotate) return;
                        C = T.ROTATE, m.set(t.clientX, t.clientY)
                    } else if (t.button === f.mouseButtons.ZOOM) {
                        if (!0 === f.noZoom) return;
                        C = T.DOLLY, S.set(t.clientX, t.clientY)
                    } else if (t.button === f.mouseButtons.PAN) {
                        if (!0 === f.noPan) return;
                        C = T.PAN, _.set(t.clientX, t.clientY)
                    }
                    C !== T.NONE && (document.addEventListener("mousemove", r, !1), document.addEventListener("mouseup", a, !1), f.dispatchEvent(z))
                }
            }

            function r(t) {
                if (!1 !== f.enabled) {
                    t.preventDefault();
                    var e = f.domElement === document ? f.domElement.body : f.domElement;
                    if (C === T.ROTATE) {
                        if (!0 === f.noRotate) return;
                        v.set(t.clientX, t.clientY), g.subVectors(v, m), f.rotateLeft(2 * Math.PI * g.x / e.clientWidth * f.rotateSpeed), f.rotateUp(2 * Math.PI * g.y / e.clientHeight * f.rotateSpeed), m.copy(v)
                    } else if (C === T.DOLLY) {
                        if (!0 === f.noZoom) return;
                        w.set(t.clientX, t.clientY), E.subVectors(w, S), E.y > 0 ? f.dollyIn() : E.y < 0 && f.dollyOut(), S.copy(w)
                    } else if (C === T.PAN) {
                        if (!0 === f.noPan) return;
                        x.set(t.clientX, t.clientY), b.subVectors(x, _), f.pan(b.x, b.y), _.copy(x)
                    }
                    C !== T.NONE && f.update()
                }
            }

            function a() {
                !1 !== f.enabled && (document.removeEventListener("mousemove", r, !1), document.removeEventListener("mouseup", a, !1), f.dispatchEvent(k), C = T.NONE)
            }

            function s(t) {
                if (!1 !== f.enabled && !0 !== f.noZoom && C === T.NONE) {
                    t.preventDefault(), t.stopPropagation();
                    var e = 0;
                    void 0 !== t.wheelDelta ? e = t.wheelDelta : void 0 !== t.detail && (e = -t.detail), e > 0 ? f.dollyOut() : e < 0 && f.dollyIn(), f.update(), f.dispatchEvent(z), f.dispatchEvent(k)
                }
            }

            function u(t) {
                if (!1 !== f.enabled && !0 !== f.noKeys && !0 !== f.noPan) switch (t.keyCode) {
                    case f.keys.UP:
                        f.pan(0, f.keyPanSpeed), f.update();
                        break;
                    case f.keys.BOTTOM:
                        f.pan(0, -f.keyPanSpeed), f.update();
                        break;
                    case f.keys.LEFT:
                        f.pan(f.keyPanSpeed, 0), f.update();
                        break;
                    case f.keys.RIGHT:
                        f.pan(-f.keyPanSpeed, 0), f.update()
                }
            }

            function l(t) {
                if (!1 !== f.enabled) {
                    switch (t.touches.length) {
                        case 1:
                            if (!0 === f.noRotate) return;
                            C = T.TOUCH_ROTATE, m.set(t.touches[0].pageX, t.touches[0].pageY);
                            break;
                        case 2:
                            if (!0 === f.noZoom) return;
                            C = T.TOUCH_DOLLY;
                            var e = t.touches[0].pageX - t.touches[1].pageX,
                                n = t.touches[0].pageY - t.touches[1].pageY,
                                o = Math.sqrt(e * e + n * n);
                            S.set(0, o);
                            break;
                        case 3:
                            if (!0 === f.noPan) return;
                            C = T.TOUCH_PAN, _.set(t.touches[0].pageX, t.touches[0].pageY);
                            break;
                        default:
                            C = T.NONE
                    }
                    C !== T.NONE && f.dispatchEvent(z)
                }
            }

            function c(t) {
                if (!1 !== f.enabled) {
                    t.preventDefault(), t.stopPropagation();
                    var e = f.domElement === document ? f.domElement.body : f.domElement;
                    switch (t.touches.length) {
                        case 1:
                            if (!0 === f.noRotate) return;
                            if (C !== T.TOUCH_ROTATE) return;
                            v.set(t.touches[0].pageX, t.touches[0].pageY), g.subVectors(v, m), f.rotateLeft(2 * Math.PI * g.x / e.clientWidth * f.rotateSpeed), f.rotateUp(2 * Math.PI * g.y / e.clientHeight * f.rotateSpeed), m.copy(v), f.update();
                            break;
                        case 2:
                            if (!0 === f.noZoom) return;
                            if (C !== T.TOUCH_DOLLY) return;
                            var n = t.touches[0].pageX - t.touches[1].pageX,
                                o = t.touches[0].pageY - t.touches[1].pageY,
                                i = Math.sqrt(n * n + o * o);
                            w.set(0, i), E.subVectors(w, S), E.y > 0 ? f.dollyOut() : E.y < 0 && f.dollyIn(), S.copy(w), f.update();
                            break;
                        case 3:
                            if (!0 === f.noPan) return;
                            if (C !== T.TOUCH_PAN) return;
                            x.set(t.touches[0].pageX, t.touches[0].pageY), b.subVectors(x, _), f.pan(b.x, b.y), _.copy(x), f.update();
                            break;
                        default:
                            C = T.NONE
                    }
                }
            }

            function d() {
                !1 !== f.enabled && (f.dispatchEvent(k), C = T.NONE)
            }
            this.object = t, this.domElement = void 0 !== e ? e : document, this.enabled = !0, this.target = new THREE.Vector3, this.center = this.target, this.noZoom = !1, this.zoomSpeed = 1, this.minDistance = 0, this.maxDistance = 1 / 0, this.minZoom = 0, this.maxZoom = 1 / 0, this.noRotate = !1, this.rotateSpeed = 1, this.noPan = !1, this.keyPanSpeed = 7, this.autoRotate = !1, this.autoRotateSpeed = 2, this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, this.minAzimuthAngle = -1 / 0, this.maxAzimuthAngle = 1 / 0, this.noKeys = !1, this.keys = {
                LEFT: 37,
                UP: 38,
                RIGHT: 39,
                BOTTOM: 40
            }, this.mouseButtons = {
                ORBIT: THREE.MOUSE.LEFT,
                ZOOM: THREE.MOUSE.MIDDLE,
                PAN: THREE.MOUSE.RIGHT
            };
            var h, p, f = this,
                m = new THREE.Vector2,
                v = new THREE.Vector2,
                g = new THREE.Vector2,
                _ = new THREE.Vector2,
                x = new THREE.Vector2,
                b = new THREE.Vector2,
                y = new THREE.Vector3,
                M = new THREE.Vector3,
                S = new THREE.Vector2,
                w = new THREE.Vector2,
                E = new THREE.Vector2,
                I = 0,
                D = 0,
                A = 1,
                F = new THREE.Vector3,
                R = new THREE.Vector3,
                P = new THREE.Quaternion,
                T = {
                    NONE: -1,
                    ROTATE: 0,
                    DOLLY: 1,
                    PAN: 2,
                    TOUCH_ROTATE: 3,
                    TOUCH_DOLLY: 4,
                    TOUCH_PAN: 5
                },
                C = T.NONE;
            this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.zoom0 = this.object.zoom;
            var O = (new THREE.Quaternion).setFromUnitVectors(t.up, new THREE.Vector3(0, 1, 0)),
                N = O.clone().inverse(),
                L = {
                    type: "change"
                },
                z = {
                    type: "start"
                },
                k = {
                    type: "end"
                };
            this.rotateLeft = function(t) {
                void 0 === t && (t = n()), D -= t
            }, this.rotateUp = function(t) {
                void 0 === t && (t = n()), I -= t
            }, this.panLeft = function(t) {
                var e = this.object.matrix.elements;
                y.set(e[0], e[1], e[2]), y.multiplyScalar(-t), F.add(y)
            }, this.panUp = function(t) {
                var e = this.object.matrix.elements;
                y.set(e[4], e[5], e[6]), y.multiplyScalar(t), F.add(y)
            }, this.pan = function(t, e) {
                var n = f.domElement === document ? f.domElement.body : f.domElement;
                if (f.object instanceof THREE.PerspectiveCamera) {
                    var o = f.object.position,
                        i = o.clone().sub(f.target),
                        r = i.length();
                    r *= Math.tan(f.object.fov / 2 * Math.PI / 180), f.panLeft(2 * t * r / n.clientHeight), f.panUp(2 * e * r / n.clientHeight)
                } else f.object instanceof THREE.OrthographicCamera ? (f.panLeft(t * (f.object.right - f.object.left) / n.clientWidth), f.panUp(e * (f.object.top - f.object.bottom) / n.clientHeight)) : console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.")
            }, this.dollyIn = function(t) {
                void 0 === t && (t = o()), f.object instanceof THREE.PerspectiveCamera ? A /= t : f.object instanceof THREE.OrthographicCamera ? (f.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom * t)), f.object.updateProjectionMatrix(), f.dispatchEvent(L)) : console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.")
            }, this.dollyOut = function(t) {
                void 0 === t && (t = o()), f.object instanceof THREE.PerspectiveCamera ? A *= t : f.object instanceof THREE.OrthographicCamera ? (f.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / t)), f.object.updateProjectionMatrix(), f.dispatchEvent(L)) : console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.")
            }, this.update = function() {
                var t = this.object.position;
                M.copy(t).sub(this.target), M.applyQuaternion(O), h = Math.atan2(M.x, M.z), p = Math.atan2(Math.sqrt(M.x * M.x + M.z * M.z), M.y), this.autoRotate && C === T.NONE && this.rotateLeft(n()), h += D, p += I, h = Math.max(this.minAzimuthAngle, Math.min(this.maxAzimuthAngle, h)), p = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, p)), p = Math.max(1e-6, Math.min(Math.PI - 1e-6, p));
                var e = M.length() * A;
                e = Math.max(this.minDistance, Math.min(this.maxDistance, e)), this.target.add(F), M.x = e * Math.sin(p) * Math.sin(h), M.y = e * Math.cos(p), M.z = e * Math.sin(p) * Math.cos(h), M.applyQuaternion(N), t.copy(this.target).add(M), this.object.lookAt(this.target), D = 0, I = 0, A = 1, F.set(0, 0, 0), (R.distanceToSquared(this.object.position) > 1e-6 || 8 * (1 - P.dot(this.object.quaternion)) > 1e-6) && (this.dispatchEvent(L), R.copy(this.object.position), P.copy(this.object.quaternion))
            }, this.reset = function() {
                C = T.NONE, this.target.copy(this.target0), this.object.position.copy(this.position0), this.object.zoom = this.zoom0, this.object.updateProjectionMatrix(), this.dispatchEvent(L), this.update()
            }, this.getPolarAngle = function() {
                return p
            }, this.getAzimuthalAngle = function() {
                return h
            }, this.domElement.addEventListener("contextmenu", function(t) {
                t.preventDefault()
            }, !1), this.domElement.addEventListener("mousedown", i, !1), this.domElement.addEventListener("mousewheel", s, !1), this.domElement.addEventListener("DOMMouseScroll", s, !1), this.domElement.addEventListener("touchstart", l, !1), this.domElement.addEventListener("touchend", d, !1), this.domElement.addEventListener("touchmove", c, !1), window.addEventListener("keydown", u, !1), this.update()
        }, THREE.OrbitControls.prototype = Object.create(THREE.EventDispatcher.prototype), THREE.OrbitControls.prototype.constructor = THREE.OrbitControls, e.exports = THREE.OrbitControls
    }, {}],
    49: [function(t, e, n) {
        function o(t) {
            a ? (s = t, i()) : t()
        }

        function i() {
            u = document.querySelector(".mobile"), u.style.display = "block", l = document.querySelector(".mobile-bypass"), l.addEventListener("click", r)
        }

        function r() {
            u.parentNode.removeChild(u), s()
        }
        var a = /(iPad|iPhone|Android)/i.test(navigator.userAgent);
        n.pass = o;
        var s, u, l
    }, {}],
    50: [function(t, e, n) {
        function o(t) {
            return t.replace(c, a)
        }

        function i(t) {
            return t.replace(d, s)
        }

        function r(t) {
            return t.replace(h, s)
        }

        function a(t, e) {
            return l.ShaderChunk[e] + "\n"
        }

        function s(t, e) {
            return e
        }

        function u(t) {
            return t = o(t), t = i(t), r(t)
        }
        var l = t(42),
            c = /\/\/\s?chunk\(\s?(\w+)\s?\);/g,
            d = /(_\d+_\d+)(_\d+_\d+)+/g,
            h = /GLOBAL_VAR_([^\.\)\;\,\s]+)(_\d+)/g;
        e.exports = u
    }, {
        42: 42
    }],
    51: [function(t, e, n) {
        function o() {
            function t(t, e) {
                t = t.length ? t : [t];
                for (var n, o = 0, i = t.length; o < i; o++) n = t[o], n.__li.style.pointerEvents = e ? "auto" : "none", n.domElement.parentNode.style.opacity = e ? 1 : .1
            }
            L.useStats && (M = new P, T(M.domElement, {
                position: "absolute",
                left: "0px",
                top: "0px",
                zIndex: 2048
            }), document.body.appendChild(M.domElement)), I = new O.WebGLRenderer({
                premultipliedAlpha: !1
            }), W.init(I), I.setClearColor(987152), I.shadowMap.type = O.PCFSoftShadowMap, I.shadowMap.enabled = !0, document.body.appendChild(I.domElement), E = new O.Scene, E.fog = new O.FogExp2(987152, 75e-5), w = new O.PerspectiveCamera(45, 1, 1, 3e3), w.position.set(0, 3e3, 5e3), S = new Y(w, I.domElement), S.noPan = !0, S.minDistance = 250, S.minPolarAngle = .3, S.maxPolarAngle = Math.PI / 2, S.target.y = 100, S.update(), L.mouse = new O.Vector2(0, 0), L.mouse3d = rt.origin, G.init(I, E, w), B.init(), E.add(B.mesh), D = new z, E.add(D), k.init(), E.add(k.mesh), V.init(I, D), E.add(V.mesh), y = new R.GUI;
            var e = y.addFolder("Simulator");
            e.add(L.query, "amount", L.amountList).onChange(function() {
                confirm("It will restart the demo") && (window.location.href = window.location.href.split("#")[0] + j(L.query).replace("?", "#"), window.location.reload())
            }), e.add(L, "gravity", -5, 20), e.add(L, "particlesFromY", 0, 500).name("from Y"), e.add(L, "particlesYDynamicRange", -500, 500).name("y dynamic range"), e.add(L, "particlesDropRadius", 0, 150).name("drop radius"), e.add(L, "handBounceRatio", 0, 1).name("hand bounce"), e.add(L, "handForce", 0, .1).name("hand force");
            var n = y.addFolder("Post-Processing");
            n.add(L, "fxaa").listen(), X.maxDistance = 120, X.motionMultiplier = 4;
            var o = n.add(L, "motionBlur"),
                r = n.add(X, "maxDistance", 1, 300).name("motion distance").listen(),
                a = n.add(X, "motionMultiplier", .1, 10).name("motion multiplier").listen(),
                v = n.add({
                    lineTexture: "one third"
                }, "lineTexture", ["full", "half", "one third", "quarter"]).name("motion quality").onChange(function(t) {
                    X.linesRenderTargetScale = "full" === t ? 1 : "half" === t ? .5 : "one third" === t ? 1 / 3 : .25, X.resize()
                }),
                g = n.add(X, "fadeStrength", 1, 5).name("motion fade"),
                _ = n.add(X, "opacity", 0, 1).name("motion opacity"),
                x = n.add(X, "jitter", 0, 1).name("motion jitter"),
                b = [r, a, v, g, _, x];
            o.onChange(t.bind(this, b)), t(b, L.motionBlur);
            var C = n.add(L, "bloom");
            b = [n.add(Q, "blurRadius", 0, 3).name("bloom radius"), n.add(Q, "amount", 0, 3).name("bloom amount")], C.onChange(t.bind(this, b)), t(b, L.bloom), n.add(L, "vignette");
            var q = y.addFolder("uArm-Control");
            q.add(L, "uarm_speed", 1, 10), q.add(L, "uarm_z_limit", -150, 200);
            var J = function(t) {
                t.preventDefault(), this.blur()
            };
            Array.prototype.forEach.call(y.domElement.querySelectorAll('input[type="checkbox"],select'), function(t) {
                t.onkeyup = t.onkeydown = J, t.style.color = "#000"
            }), A = document.querySelector(".logo"), F = document.querySelectorAll(".footer span"), y.domElement.addEventListener("mousedown", u), y.domElement.addEventListener("touchstart", u), window.addEventListener("click", s), window.addEventListener("mousedown", c), window.addEventListener("touchstart", l(c)), window.addEventListener("mousemove", d), window.addEventListener("touchmove", l(d)), window.addEventListener("mouseup", h), window.addEventListener("touchend", l(h)), window.addEventListener("resize", f);
            var K = i(U, H, {});
            K.pitch = function() {
                return this._pitch
            }, K.yaw = function() {
                return this._yaw
            }, K.roll = function() {
                return this._roll
            }, p({
                hands: [K]
            }, !0), N.loop(p), et = Date.now(), f(), m()
        }

        function i(t, e, n) {
            var o, s;
            for (var u in t) a(t, u) && (o = t[u], s = e[u], "object" == typeof o ? n[u] = i(o, s, o.length ? [] : {}) : isNaN(o) || Object.defineProperty(n, u, {
                get: r.bind(null, t, e, u)
            }));
            return n
        }

        function r(t, e, n) {
            var o = t[n];
            return o + (e[n] - o) * it
        }

        function a(t, e) {
            return Object.prototype.hasOwnProperty.call(t, e)
        }

        function s() {
            at = !0
        }

        function u(t) {
            t.stopPropagation()
        }

        function l(t) {
            return function(e) {
                t(e.changedTouches[0])
            }
        }

        function c() {
            st = !0
        }

        function d(t) {
            L.mouse.x = t.pageX / $ * 2 - 1, L.mouse.y = -t.pageY / tt * 2 + 1
        }

        function h() {
            st = !1
        }

        function p(t, e) {
            e || lt || (lt = !0), t.hands && t.hands.length && (ct = t.hands[0], Z.control_uarm(ct), ut = !0, at && (at = !1))
        }

        function f() {
            $ = window.innerWidth, tt = window.innerHeight, G.resize($, tt)
        }

        function m() {
            var t = Date.now();
            C(m), L.useStats && M.begin(), x(t - et, t), L.useStats && M.end(), et = t
        }

        function v(t, e, n) {
            return t + (e - t) * n
        }

        function g(t, e, n) {
            return t > n ? n : t < e ? e : t
        }

        function _(t, e, n) {
            return g((n - t) / (e - t), 0, 1)
        }

        function x(t, e) {
            nt = Math.min(nt + 2e-4 * t, 1), ot = Math.min(ot + 1e-4 * t, 1);
            var n = (Math.pow(nt, .3), Math.pow(ot, .3));
            S.maxDistance = 1 === ot ? 1200 : v(1400, 500, n), S.update(), w.updateMatrixWorld(), rt.origin.setFromMatrixPosition(w.matrixWorld), rt.direction.set(L.mouse.x, L.mouse.y, .5).unproject(w).sub(rt.origin).normalize();
            var o = rt.origin.length() / Math.cos(Math.PI - rt.direction.angleTo(rt.origin));
            rt.origin.add(rt.direction.multiplyScalar(o)), lt === b ? (it += .01 * ((st ? 1 : 0) - it) * t, U.palmVelocity[0] = H.palmVelocity[0] = 20 * (rt.origin.x - D.position.x), U.palmVelocity[1] = H.palmVelocity[1] = 20 * (rt.origin.y - D.position.y), U.palmVelocity[2] = H.palmVelocity[2] = 20 * (rt.origin.z - D.position.z), D.position.copy(rt.origin)) : (ut || (U.palmVelocity[0] = U.palmVelocity[1] = U.palmVelocity[2] = 0), D.position.x -= .05 * D.position.x, D.position.y -= .05 * D.position.y, D.position.z -= .05 * D.position.z), D.leapUpdate(ct), V.update(t), B.update(t, w);
            var i = Math.min(1.2 * (1 - 2 * Math.abs(ot - .5)), 1),
                r = 10 * (1 - i);
            A.style.opacity = i, A.style.display = i ? "block" : "none", A.style.webkitFilter = "blur(" + r + "px)", i = .8 + .3 * Math.pow(nt, 1.5), $ < 580 && (i *= .5), A.style.transform = "scale3d(" + i + "," + i + ",1)";
            for (var a = 0, s = F.length; a < s; a++) i = _(.5 + .01 * a, .6 + .01 * a, nt), F[a].style.transform = "translate3d(0," + 50 * (1 - Math.pow(i, 3)) + "px,0)";
            J.enabled = !!L.fxaa, X.enabled = !!L.motionBlur, q.enabled = !!L.vignette, Q.enabled = !!L.bloom, G.render(t, e), ut = !1
        }
        var b, y, M, S, w, E, I, D, A, F, R = t(1),
            P = t(41),
            T = t(4),
            C = t(40),
            O = t(42),
            N = t(82),
            L = t(69),
            z = t(53),
            k = t(58),
            B = t(59),
            V = t(60),
            U = t(54),
            H = t(57),
            j = t(33),
            Y = t(48),
            W = t(56),
            G = t(67),
            q = t(68),
            X = t(66),
            J = t(64),
            q = t(68),
            Q = t(62),
            K = t(49),
            Z = t(91),
            $ = 0,
            tt = 0,
            et = 0,
            nt = 0,
            ot = 0,
            it = 0,
            rt = new O.Ray,
            at = !1,
            st = !1,
            ut = !1,
            lt = b,
            ct = b;
        K.pass(function() {
            var t = new Image;
            t.src = "images/logo.png", t.width ? o() : t.onload = o
        })
    }, {
        1: 1,
        33: 33,
        4: 4,
        40: 40,
        41: 41,
        42: 42,
        48: 48,
        49: 49,
        53: 53,
        54: 54,
        56: 56,
        57: 57,
        58: 58,
        59: 59,
        60: 60,
        62: 62,
        64: 64,
        66: 66,
        67: 67,
        68: 68,
        69: 69,
        82: 82,
        91: 91
    }],
    52: [function(t, e, n) {
        function o(t, e, n) {
            l.Object3D.call(this), this.fingerIndex = t, this.fromNodeIndex = e, this.toNodeIndex = n, this.outputMatrix = new l.Matrix4, this.tmpPosition = new l.Vector3, this.tmpQuaternion = new l.Quaternion, this.tmpScale = new l.Vector3, this.nodeAdjustmentQuaternion = (new l.Quaternion).setFromAxisAngle(new l.Vector3(1, 0, 0), -Math.PI / 2), this.bone = new l.Mesh(i(), c()), this.bone.motionMaterial = new u, this.bone.castShadow = !0, this.bone.receiveShadow = !0, this.add(this.bone), this.node = new l.Mesh(r(), c()), this.node.motionMaterial = new u, this.node.castShadow = !0, this.node.receiveShadow = !0, this.add(this.node)
        }

        function i() {
            return p || (p = new l.CylinderGeometry(1, 1, 1, 12, 1), p.translate(0, -.5, 0)), p
        }

        function r() {
            return f || (f = new l.SphereGeometry(1, 10, 12)), f
        }

        function a() {
            var t = this.outputMatrix,
                e = this.tmpPosition,
                n = this.tmpQuaternion,
                o = this.tmpScale;
            return t.copy(this.bone.matrixWorld), t.decompose(e, n, o), t.compose(e, n, m), t.getInverse(t), t.elements[3] = o.x, t.elements[7] = o.y, t.elements[11] = o.z, Array.prototype.slice.call(t.elements)
        }

        function s(t) {
            var e = t[this.fingerIndex],
                n = e.positions,
                o = n[this.fromNodeIndex],
                i = n[this.toNodeIndex],
                r = e.width / 2;
            this.node.position.set(o[0], o[1], o[2]), this.bone.position.set(i[0], i[1], i[2]), this.bone.lookAt(this.node.position), this.node.scale.set(r, r, r);
            var a = this.bone.position.distanceTo(this.node.position);
            this.node.position.copy(this.bone.position), this.bone.scale.set(r, a, r), this.bone.quaternion.multiply(this.nodeAdjustmentQuaternion)
        }
        var u = (t(69), t(65)),
            l = t(42),
            c = t(70).getMaterial;
        e.exports = o;
        var d = l.Object3D.prototype,
            h = o.prototype = Object.create(d);
        h.constructor = o, h.updateOutputMatrix = a, h.leapUpdate = s;
        var p, f, m = new l.Vector3(1, 1, 1)
    }, {
        42: 42,
        65: 65,
        69: 69,
        70: 70
    }],
    53: [function(t, e, n) {
        function o() {
            u.Object3D.call(this), this.fingerBones = [], this.palmOutputMatrix = new u.Matrix4, this.tmpPosition = new u.Vector3, this.tmpQuaternion = new u.Quaternion, this.tmpScale = new u.Vector3;
            var t = (new u.Quaternion).setFromAxisAngle(new u.Vector3(1, 0, 0), -Math.PI / 2);
            t.multiply((new u.Quaternion).setFromAxisAngle(new u.Vector3(0, 0, 1), Math.PI / 6)), this.palmOutputAdjustmentMatrix = (new u.Matrix4).makeRotationFromQuaternion(t), this.palmMeshAdjustmentQuaternion = (new u.Quaternion).setFromAxisAngle(new u.Vector3(0, 1, 0), Math.PI / 6), this.palmVelocity = new u.Vector3, this._initFingers(), this._initPalm()
        }

        function i() {
            for (var t, e = 0; e < 5; e++)
                for (var n = 1; n < 4; n++) t = new c(e, n, n + 1), this.fingerBones.push(t), this.add(t)
        }

        function r() {
            var t = new u.CylinderGeometry(1, 1, 1, 6);
            this.palm = new u.Mesh(t, d()), this.palm.motionMaterial = new l, this.palm.castShadow = !0, this.palm.receiveShadow = !0, this.add(this.palm)
        }

        function a(t) {
            for (var e = t.fingers, n = this.fingerBones, o = 0, i = n.length; o < i; o++) n[o].leapUpdate(e);
            this.palm.position.fromArray(t.palmPosition), this.palm.rotation.set(t.pitch(), -t.yaw(), t.roll()), this.palm.translateZ(20), this.palm.translateX(-5), this.palm.quaternion.multiply(this.palmMeshAdjustmentQuaternion);
            var r = (new u.Vector3).fromArray(t.pinky.positions[1]),
                a = (new u.Vector3).fromArray(t.thumb.positions[1]),
                s = .45 * r.distanceTo(a);
            this.palm.scale.set(s, 1.2 * t.thumb.width, s), this.palmVelocity.fromArray(t.palmVelocity), this.updateMatrixWorld(), this.updateOutputMatrix()
        }

        function s() {
            var t = [],
                e = this.palmOutputMatrix,
                n = this.tmpPosition,
                o = this.tmpQuaternion,
                i = this.tmpScale;
            e.copy(this.palm.matrixWorld), e.multiply(this.palmOutputAdjustmentMatrix), e.decompose(n, o, i), e.compose(n, o, f), e.getInverse(e), e.elements[3] = .866025 * i.x, e.elements[7] = .866025 * i.y, e.elements[11] = i.z, t.push(Array.prototype.slice.call(e.elements));
            for (var r = this.fingerBones, a = 0, s = r.length; a < s; a++) t.push(r[a].updateOutputMatrix()), r[a].updateOutputMatrix();
            return t
        }
        var u = (t(69), t(42)),
            l = t(65),
            c = t(52),
            d = t(70).getMaterial;
        e.exports = o;
        var h = u.Object3D.prototype,
            p = o.prototype = Object.create(h);
        p.constructor = o, p._initFingers = i, p._initPalm = r, p.leapUpdate = a, p.updateOutputMatrix = s;
        var f = new u.Vector3(1, 1, 1)
    }, {
        42: 42,
        52: 52,
        65: 65,
        69: 69,
        70: 70
    }],
    54: [function(t, e, n) {
        e.exports = {
            fingers: [{
                positions: [
                    [-82.7319, 33.8079, 81.6507],
                    [-82.7319, 33.8079, 81.6507],
                    [-39.3405, 53.4473, 66.7093],
                    [-8.43841, 66.8659, 61.464],
                    [-3.5891, 70.409, 43.9993]
                ],
                width: 20.25
            }, {
                positions: [
                    [-96.16, 53.3051, 82.8463],
                    [-55.7517, 106.4, 51.8535],
                    [-31.345, 135.869, 32.3164],
                    [-14.5136, 145.228, 17.7113],
                    [-5.19045, 147.288, 9.40499]
                ],
                width: 19.3428
            }, {
                positions: [
                    [-104.87, 55.9003, 74.5382],
                    [-73.2802, 106.494, 38.3453],
                    [-48.4068, 134.747, 8.23954],
                    [-28.5851, 139.889, -11.4911],
                    [-18.231, 138.466, -20.5768]
                ],
                width: 18.9972
            }, {
                positions: [
                    [-112.945, 55.4585, 65.2907],
                    [-91.7436, 99.994, 26.6792],
                    [-70.4668, 128.419, -.442044],
                    [-51.3668, 135.907, -19.0572],
                    [-40.7008, 136.068, -27.7728]
                ],
                width: 18.077
            }, {
                positions: [
                    [-118.298, 48.5991, 54.0274],
                    [-106.452, 89.7683, 14.9498],
                    [-93.3419, 110.39, -10.6071],
                    [-80.2055, 114.368, -24.5409],
                    [-70.0599, 113.711, -32.0629]
                ],
                width: 16.0574
            }],
            palmPosition: [-81.83, 83.3129, 45.2651],
            palmVelocity: [0, 0, 0],
            _pitch: 1.0615306607563884,
            _yaw: .6538980433882265,
            _roll: .7851885703254726,
            pinky: {
                positions: [0, [-106.452, 89.7683, 14.9498]]
            },
            thumb: {
                positions: [0, [-82.7319, 33.8079, 81.6507]],
                width: 20.25
            }
        }
    }, {}],
    55: [function(t, e, n) {
        function o(t, e) {
            g = t;
            var n = g.getContext();
            if (!n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS)) return void alert("No support for vertex shader textures!");
            if (!n.getExtension("OES_texture_float")) return void alert("No OES_texture_float support for float textures!");
            y = [e.palmOutputMatrix];
            for (var o = 0, i = e.fingerBones.length; o < i; o++) y.push(e.fingerBones[o].outputMatrix);
            x = new S.Scene, b = new S.Camera, b.position.z = 1, c = new S.ShaderMaterial({
                uniforms: {
                    resolution: {
                        type: "v2",
                        value: new S.Vector2(M.simulatorTextureWidth, M.simulatorTextureHeight)
                    },
                    texture: {
                        type: "t",
                        value: null
                    }
                },
                vertexShader: w("#define GLSLIFY 1\nvoid main() {\n    gl_Position = vec4( position, 1.0 );\n}\n"),
                fragmentShader: w("#define GLSLIFY 1\nuniform vec2 resolution;\nuniform sampler2D texture;\n\nvoid main() {\n    vec2 uv = gl_FragCoord.xy / resolution.xy;\n    vec3 color = texture2D( texture, uv ).xyz;\n    gl_FragColor = vec4( color, 1.0 );\n}\n")
            }), d = new S.ShaderMaterial({
                uniforms: {
                    texturePosition: {
                        type: "t",
                        value: null
                    },
                    textureVelocity: {
                        type: "t",
                        value: null
                    },
                    resolution: {
                        type: "v2",
                        value: new S.Vector2(M.simulatorTextureWidth, M.simulatorTextureHeight)
                    },
                    data: {
                        type: "m4v",
                        value: y
                    },
                    handBounceRatio: {
                        type: "f",
                        value: M.handBounceRatio
                    },
                    handForce: {
                        type: "f",
                        value: M.handForce
                    },
                    gravity: {
                        type: "f",
                        value: M.gravity
                    },
                    palmVelocity: {
                        type: "v3",
                        value: e.palmVelocity
                    }
                },
                defines: {
                    HAND_AMOUNT: M.hands,
                    MATRIX_AMOUNT: 16 * M.hands
                },
                vertexShader: w("#define GLSLIFY 1\nvoid main() {\n    gl_Position = vec4( position, 1.0 );\n}\n"),
                fragmentShader: w("#define GLSLIFY 1\nuniform vec2 resolution;\n\nuniform sampler2D textureVelocity;\nuniform sampler2D texturePosition;\nuniform mat4 data[16];\nuniform vec3 palmVelocity;\n\nuniform float handBounceRatio;\nuniform float handForce;\nuniform float gravity;\n\nconst float INTERSECTION_PRECISION = 1.0;\nconst float FAR = 2000.0;\n\nfloat sdSphere( vec3 p, float s ) {\n  return length(p)-s;\n}\n\nfloat sdCappedCylinderLower( vec3 p, vec2 h ){\n  vec2 d = abs(vec2(length(p.xz),p.y + h.y)) - h;\n  return min(max(d.x,d.y),0.0) + length(max(d,0.0));\n}\n\nfloat sdFingerBone( in vec3 p, in mat4 fingerBone) {\n\n    vec3 scale = vec3(fingerBone[0][3], fingerBone[1][3], fingerBone[2][3]);\n\n    fingerBone[0][3] = 0.0;\n    fingerBone[1][3] = 0.0;\n    fingerBone[2][3] = 0.0;\n\n    p = (fingerBone * vec4(p, 1.0)).xyz;\n\n    return min(\n        sdSphere(p, scale.x),\n        sdCappedCylinderLower(p, vec2(scale.x, scale.y / 2.0))\n    );\n}\n\nfloat sdHexPrism( vec3 p, vec2 h ) {\n    vec3 q = abs(p);\n    return max(q.z-h.y,max((q.x*0.866025+q.y*0.5),q.y)-h.x);\n}\n\nfloat map( in vec3 p ) {\n    float d = GLOBAL_VAR_FAR_2281831123;\n\n    mat4 palmData = GLOBAL_VAR_data_2281831123[0];\n    vec3 scale = vec3(palmData[0][3], palmData[1][3], palmData[2][3]);\n\n    palmData[0][3] = 0.0;\n    palmData[1][3] = 0.0;\n    palmData[2][3] = 0.0;\n\n    d = min(d, sdHexPrism((palmData * vec4(p, 1.0)).xyz, vec2(scale.x, scale.z / 2.0)));\n\n    for( int i = 1; i < 16; i++ ) {\n        d = min(d, sdFingerBone(p, GLOBAL_VAR_data_2281831123[i]));\n    }\n\n    return d;\n}\n\nvec3 calcNormal( in vec3 pos )\n{\n  vec3 eps = vec3(0.02,0.0,0.0);\n\n  return normalize( vec3(\n    map(pos+eps.xyy) - map(pos-eps.xyy),\n    map(pos+eps.yxy) - map(pos-eps.yxy),\n    map(pos+eps.yyx) - map(pos-eps.yyx) ) );\n}\n\nfloat hash( float v ) { return fract( sin(v) * 12.419821); }\n\nhighp float random(vec2 co)\n{\n    highp float a = 12.9898;\n    highp float b = 78.233;\n    highp float c = 43758.5453;\n    highp float dt= dot(co.xy ,vec2(a,b));\n    highp float sn= mod(dt,3.14);\n    return fract(sin(sn) * c);\n}\n\nvoid main() {\n\n    vec2 uv = gl_FragCoord.xy / resolution.xy;\n\n    vec4 positionInfo = texture2D( texturePosition, uv );\n    vec3 position = positionInfo.xyz;\n    vec3 velocity = texture2D( textureVelocity, uv ).xyz;\n\n    float d = map(position);\n\n    if(positionInfo.w < 0.005) {\n\n        d = FAR;\n        velocity = vec3( 0.0, random(uv) * 1.0, 0.0 );\n\n    } else {\n\n        if(position.y < 0.0) {\n            float groundBounceRatio =  random(position.xz);\n            velocity.y *= -0.5 * groundBounceRatio;\n            velocity.xz *= 0.5 * groundBounceRatio;\n\n            // add some fake physics on the floor to make it looks better when\n            // the hand is not blocking the particles\n            float strength = length(velocity) * pow(positionInfo.w, 3.0);\n            velocity.x += (random(uv + 0.1) - 0.5) *strength;\n            velocity.z += (random(uv + 0.4) - 0.5) *strength;\n        } else {\n            velocity.y -= (0.03 - 0.005 * random(uv + 5.0)) * gravity;\n        }\n\n        float velocityDistance = length(velocity);\n        d = map(position);\n        if(d < velocityDistance) {\n\n            if(d > INTERSECTION_PRECISION) {\n                // raymarch\n                vec3 rd = normalize(velocity);\n                position = position + rd * d;\n\n                float dd = 0.0;\n                for( int i = 0; i < 10; i++ ) {\n                    dd = map( position);\n                    if(dd < INTERSECTION_PRECISION || d > FAR) break;\n                    d += dd;\n                    position += rd * dd;\n                }\n\n            }\n            vec3 normal = calcNormal(position);\n\n            velocity = reflect(velocity, normal) * handBounceRatio;\n            vec3 palmDirection = normalize(palmVelocity);\n            velocity += palmVelocity * handForce * max(dot(palmDirection, normal), 0.0);\n\n        }\n    }\n\n    gl_FragColor = vec4(velocity, d );\n\n}\n"),
                transparent: !1,
                depthWrite: !1,
                depthTest: !1
            }), h = new S.ShaderMaterial({
                uniforms: {
                    resolution: {
                        type: "v2",
                        value: new S.Vector2(M.simulatorTextureWidth, M.simulatorTextureHeight)
                    },
                    texturePosition: {
                        type: "t",
                        value: null
                    },
                    textureVelocity: {
                        type: "t",
                        value: null
                    },
                    textureVelocity2: {
                        type: "t",
                        value: null
                    },
                    dropRadius: {
                        type: "f",
                        value: M.particlesDropRadius
                    },
                    fromY: {
                        type: "f",
                        value: M.particlesFromY
                    },
                    yDynamicRange: {
                        type: "f",
                        value: M.particlesYDynamicRange
                    },
                    data: {
                        type: "m4v",
                        value: y
                    }
                },
                defines: {
                    HAND_AMOUNT: M.hands,
                    MATRIX_AMOUNT: 16 * M.hands
                },
                vertexShader: w("#define GLSLIFY 1\nvoid main() {\n    gl_Position = vec4( position, 1.0 );\n}\n"),
                fragmentShader: w("#define GLSLIFY 1\nuniform vec2 resolution;\n\nuniform sampler2D textureVelocity2;\nuniform sampler2D textureVelocity;\nuniform sampler2D texturePosition;\nuniform mat4 data[16];\n\nuniform float dropRadius;\nuniform float fromY;\nuniform float yDynamicRange;\n\nconst float INTERSECTION_PRECISION = 1.0;\nconst float FAR = 2000.0;\nconst float PI_2 = 6.2831853072;\n\nfloat sdSphere( vec3 p, float s ) {\n  return length(p)-s;\n}\n\nfloat sdCappedCylinderLower( vec3 p, vec2 h ){\n  vec2 d = abs(vec2(length(p.xz),p.y + h.y)) - h;\n  return min(max(d.x,d.y),0.0) + length(max(d,0.0));\n}\n\nfloat sdFingerBone( in vec3 p, in mat4 fingerBone) {\n\n    vec3 scale = vec3(fingerBone[0][3], fingerBone[1][3], fingerBone[2][3]);\n\n    fingerBone[0][3] = 0.0;\n    fingerBone[1][3] = 0.0;\n    fingerBone[2][3] = 0.0;\n\n    p = (fingerBone * vec4(p, 1.0)).xyz;\n\n    return min(\n        sdSphere(p, scale.x),\n        sdCappedCylinderLower(p, vec2(scale.x, scale.y / 2.0))\n    );\n}\n\nfloat sdHexPrism( vec3 p, vec2 h ) {\n    vec3 q = abs(p);\n    return max(q.z-h.y,max((q.x*0.866025+q.y*0.5),q.y)-h.x);\n}\n\nfloat map( in vec3 p ) {\n    float d = GLOBAL_VAR_FAR_2281831123;\n\n    mat4 palmData = GLOBAL_VAR_data_2281831123[0];\n    vec3 scale = vec3(palmData[0][3], palmData[1][3], palmData[2][3]);\n\n    palmData[0][3] = 0.0;\n    palmData[1][3] = 0.0;\n    palmData[2][3] = 0.0;\n\n    d = min(d, sdHexPrism((palmData * vec4(p, 1.0)).xyz, vec2(scale.x, scale.z / 2.0)));\n\n    for( int i = 1; i < 16; i++ ) {\n        d = min(d, sdFingerBone(p, GLOBAL_VAR_data_2281831123[i]));\n    }\n\n    return d;\n}\n\nvec3 calcNormal( in vec3 pos )\n{\n  vec3 eps = vec3(0.02,0.0,0.0);\n\n  return normalize( vec3(\n    map(pos+eps.xyy) - map(pos-eps.xyy),\n    map(pos+eps.yxy) - map(pos-eps.yxy),\n    map(pos+eps.yyx) - map(pos-eps.yyx) ) );\n}\n\nfloat hash( float v ) { return fract( sin(v) * 12.419821); }\n\nhighp float random(vec2 co)\n{\n    highp float a = 12.9898;\n    highp float b = 78.233;\n    highp float c = 43758.5453;\n    highp float dt= dot(co.xy ,vec2(a,b));\n    highp float sn= mod(dt,3.14);\n    return fract(sin(sn) * c);\n}\n\nvoid main() {\n\n    vec2 uv = gl_FragCoord.xy / resolution.xy;\n\n    vec4 positionInfo = texture2D( texturePosition, uv );\n    vec3 position = positionInfo.xyz;\n    vec3 prevVelocity = texture2D( textureVelocity2, uv ).xyz;\n    vec4 velocityInfo = texture2D( textureVelocity, uv );\n    vec3 velocity = velocityInfo.xyz;\n\n    float d = velocityInfo.w;\n\n    positionInfo.w -= 0.01;\n\n    if(positionInfo.w < 0.0) {\n\n        positionInfo.w = 1.0 + random(uv + 2.0);\n        float a = hash(uv.x) * PI_2;\n        float r = pow(hash(uv.y), 0.75) * dropRadius;\n        position = vec3( cos(a) * r, fromY + random(uv + 1.0) * yDynamicRange, sin(a) * r );\n\n    } else {\n\n        float velocityDistance = length(prevVelocity);\n        if(d < velocityDistance) {\n\n            if(d > INTERSECTION_PRECISION) {\n                // raymarch\n                vec3 rd = normalize(prevVelocity);\n                position = position + rd * d;\n\n                float dd = 0.0;\n                for( int i = 0; i < 10; i++ ) {\n                    dd = map( position);\n                    if(dd < INTERSECTION_PRECISION || d > FAR) break;\n                    d += dd;\n                    position += rd * dd;\n                }\n\n            }\n            vec3 normal = calcNormal(position);\n\n            if(d < 0.0) {\n                position += normal * (-d + INTERSECTION_PRECISION);\n            }\n\n        }\n\n        position += velocity;\n    }\n\n    gl_FragColor = vec4(position, positionInfo.w);\n\n}\n"),
                transparent: !1,
                depthWrite: !1,
                depthTest: !1
            }), _ = new S.Mesh(new S.PlaneBufferGeometry(2, 2), c), x.add(_), p = new S.WebGLRenderTarget(M.simulatorTextureWidth, M.simulatorTextureHeight, {
                wrapS: S.RepeatWrapping,
                wrapT: S.RepeatWrapping,
                minFilter: S.NearestFilter,
                magFilter: S.NearestFilter,
                format: S.RGBAFormat,
                type: S.FloatType,
                depthBuffer: !1,
                stencilBuffer: !1
            }), f = p.clone(), a(s(), p), a(p, f), m = new S.WebGLRenderTarget(M.simulatorTextureWidth, M.simulatorTextureHeight, {
                wrapS: S.RepeatWrapping,
                wrapT: S.RepeatWrapping,
                minFilter: S.NearestFilter,
                magFilter: S.NearestFilter,
                format: S.RGBAFormat,
                type: S.FloatType,
                depthBuffer: !1,
                stencilBuffer: !1
            }), v = m.clone(), a(u(), m), a(m, v)
        }

        function i(t) {
            var e = p;
            p = f, f = e, _.material = d, d.uniforms.textureVelocity.value = f, d.uniforms.texturePosition.value = m, g.render(x, b, p)
        }

        function r(t) {
            var e = m;
            m = v, v = e, _.material = h, h.uniforms.texturePosition.value = v, h.uniforms.textureVelocity.value = p, h.uniforms.textureVelocity2.value = f, g.render(x, b, m)
        }

        function a(t, e) {
            _.material = c, c.uniforms.texture.value = t, g.render(x, b, e)
        }

        function s() {
            for (var t = new Float32Array(4 * E), e = 0, n = t.length; e < n; e += 4) t[e + 0] = 0, t[e + 1] = 10 * -Math.random(), t[e + 2] = 0;
            var o = new S.DataTexture(t, M.simulatorTextureWidth, M.simulatorTextureHeight, S.RGBAFormat, S.FloatType);
            return o.minFilter = S.NearestFilter, o.magFilter = S.NearestFilter, o.needsUpdate = !0, o.flipY = !1, o
        }

        function u() {
            for (var t, e, n = new Float32Array(4 * E), o = M.particlesDropRadius, i = M.particlesFromY, r = M.particlesYDynamicRange, a = 0, s = n.length; a < s; a += 4) e = Math.random() * Math.PI, t = Math.pow(Math.random(), .75) * o, n[a + 0] = Math.cos(e) * t, n[a + 1] = i + Math.random() * r, n[a + 2] = Math.sin(e) * t, n[a + 3] = .5 + Math.random();
            var u = new S.DataTexture(n, M.simulatorTextureWidth, M.simulatorTextureHeight, S.RGBAFormat, S.FloatType);
            return u.minFilter = S.NearestFilter, u.magFilter = S.NearestFilter, u.needsUpdate = !0, u.generateMipmaps = !1, u.flipY = !1, u
        }

        function l(t) {
            h.uniforms.dropRadius.value = M.particlesDropRadius, h.uniforms.fromY.value = M.particlesFromY, h.uniforms.yDynamicRange.value = M.particlesYDynamicRange, d.uniforms.handBounceRatio.value = M.handBounceRatio, d.uniforms.handForce.value = M.handForce, d.uniforms.gravity.value = M.gravity, i(t), r(t), n.positionRenderTarget = m, n.prevPositionRenderTarget = v
        }
        var c, d, h, p, f, m, v, g, _, x, b, y, M = t(69),
            S = t(42),
            w = t(50),
            E = n.AMOUNT = M.simulatorTextureWidth * M.simulatorTextureHeight;
        n.init = o, n.update = l, n.positionRenderTarget = void 0, n.prevPositionRenderTarget = void 0
    }, {
        42: 42,
        50: 50,
        69: 69
    }],
    56: [function(t, e, n) {
        function o(t) {
            c || (c = t, m = n.rawShaderPrefix = "precision " + c.capabilities.precision + " float;\n", h = new f.Scene, p = new f.Camera, p.position.z = 1, g = n.copyMaterial = new f.RawShaderMaterial({
                uniforms: {
                    u_texture: {
                        type: "t",
                        value: l
                    }
                },
                vertexShader: v = n.vertexShader = m + "#define GLSLIFY 1\nattribute vec3 position;\nattribute vec2 uv;\n\nvarying vec2 v_uv;\n\nvoid main() {\n    v_uv = uv;\n    gl_Position = vec4( position, 1.0 );\n}\n",
                fragmentShader: m + "#define GLSLIFY 1\nuniform sampler2D u_texture;\n\nvarying vec2 v_uv;\n\nvoid main() {\n    gl_FragColor = texture2D( u_texture, v_uv );\n}\n"
            }), d = new f.Mesh(new f.PlaneBufferGeometry(2, 2), g), h.add(d))
        }

        function i(t, e) {
            d.material = g, g.uniforms.u_texture.value = t, e ? c.render(h, p, e) : c.render(h, p)
        }

        function r(t, e) {
            d.material = t, e ? c.render(h, p, e) : c.render(h, p)
        }

        function a(t, e, n, o, i, r) {
            var a = new f.WebGLRenderTarget(t || 1, e || 1, {
                format: n || f.RGBFormat,
                type: o || f.UnsignedByteType,
                minFilter: i || f.LinearFilter,
                magFilter: r || f.LinearFilter
            });
            return a.texture.generateMipMaps = !1, a
        }

        function s() {
            return {
                autoClearColor: c.autoClearColor,
                clearColor: c.getClearColor().getHex(),
                clearAlpha: c.getClearAlpha()
            }
        }

        function u(t) {
            c.setClearColor(t.clearColor, t.clearAlpha), c.autoClearColor = t.autoClearColor
        }
        var l, c, d, h, p, f = t(42),
            m = n.rawShaderPrefix = l,
            v = n.vertexShader = l,
            g = n.copyMaterial = l;
        n.init = o, n.copy = i, n.render = r, n.createRenderTarget = a, n.getColorState = s, n.setColorState = u
    }, {
        42: 42
    }],
    57: [function(t, e, n) {
        e.exports = {
            fingers: [{
                positions: [
                    [-38.2189, 60.9604, 64.5924],
                    [-38.2189, 60.9604, 64.5924],
                    [-1.12559, 79.7574, 49.932],
                    [12.0741, 86.9312, 23.8296],
                    [4.75387, 83.9228, 10.1354]
                ],
                width: 17.887
            }, {
                positions: [
                    [-51.5461, 77.0885, 65.4124],
                    [-27.7155, 120.936, 23.7887],
                    [-8.3735, 97.377, 1.18308],
                    [-7.1981, 76.1218, 2.81282],
                    [-9.16495, 65.5395, 6.96613]
                ],
                width: 17.0857
            }, {
                positions: [
                    [-60.7616, 77.3919, 59.6436],
                    [-45.1707, 117.62, 15.6383],
                    [-18.6337, 91.6693, -5.21932],
                    [-13.5415, 67.644, .0511352],
                    [-13.9111, 56.4441, 5.98309]
                ],
                width: 16.7804
            }, {
                positions: [
                    [-69.2867, 74.9599, 53.3851],
                    [-62.4294, 108.825, 10.1692],
                    [-36.1111, 86.3636, -8.81518],
                    [-27.4399, 64.586, -1.79382],
                    [-25.7971, 54.2056, 5.14412]
                ],
                width: 15.9676
            }, {
                positions: [
                    [-75.169, 66.8402, 45.8014],
                    [-76.0903, 97.0578, 4.45619],
                    [-52.3843, 82.8792, -10.1212],
                    [-42.1453, 70.5831, -3.60624],
                    [-37.7832, 62.9693, 4.02072]
                ],
                width: 14.1837
            }],
            palmPosition: [-48.9255, 98.0567, 26.448],
            palmVelocity: [-2.16856, -2.66415, -.147639],
            _pitch: .8568779317864111,
            _yaw: .23460461915433872,
            _roll: .6830778953159898,
            pinky: {
                positions: [0, [-76.0903, 97.0578, 4.45619]]
            },
            thumb: {
                positions: [0, [-38.2189, 60.9604, 64.5924]],
                width: 17.887
            }
        }
    }, {}],
    58: [function(t, e, n) {
        function o() {
            var t = new i.PlaneGeometry(4e3, 4e3, 10, 10),
                e = new i.MeshStandardMaterial({
                    roughness: .7,
                    metalness: 1,
                    color: 3355443,
                    emissive: 0
                }),
                o = n.mesh = new i.Mesh(t, e);
            o.rotation.x = -1.57, o.receiveShadow = !0
        }
        var i = (t(69), t(42));
        n.mesh = void 0, n.init = o
    }, {
        42: 42,
        69: 69
    }],
    59: [function(t, e, n) {
        function o() {
            u = n.mesh = new a.Object3D, u.position.y = 150;
            var t = new a.AmbientLight(3355443);
            u.add(t), l = n.pointLight = new a.PointLight(10066329, 1, 800), l.castShadow = !0, l.shadow.camera.near = 10, l.shadow.camera.far = 800, l.shadow.bias = .01, l.shadow.mapWidth = 2048, l.shadow.mapHeight = 1024, u.add(l);
            var e = new a.DirectionalLight(12225419, .5);
            e.position.set(1, 1, 1), u.add(e);
            var o = new a.DirectionalLight(9157300, .3);
            o.position.set(1, 1, -1), u.add(o);
            var i = new a.PlaneGeometry(100, 100),
                r = new a.ShaderMaterial({
                    uniforms: {},
                    vertexShader: s("#define GLSLIFY 1\nvarying vec2 vUv;\n\nvoid main() {\n\n    vUv = uv;\n\n    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}\n"),
                    fragmentShader: s("#define GLSLIFY 1\nvarying vec2 vUv;\n\nvoid main() {\n    float d = max(1.0 - length(vUv - 0.5) * 2.0, 0.0);\n    gl_FragColor = vec4(mix(vec3(0.73, 0.55, 0.55), vec3(1.0), d) * d, d );\n}\n"),
                    transparent: !0,
                    blending: a.AdditiveBlending,
                    depthTest: !0,
                    depthWrite: !1
                });
            c = new a.Mesh(i, r), l.add(c)
        }

        function i(t, e) {
            d += t * r.lightSpeed;
            var n = 5e-4 * d - .2;
            l.position.x = 200 * Math.cos(n), l.position.z = 200 * Math.sin(n), c.lookAt(e.position)
        }
        var r = t(69),
            a = t(42),
            s = t(50),
            u = n.mesh = void 0,
            l = n.pointLight = void 0;
        n.init = o, n.update = i;
        var c, d = 0
    }, {
        42: 42,
        50: 50,
        69: 69
    }],
    60: [function(t, e, n) {
        function o(t, e) {
            c.init(t, e), i(), r(), f = u.useBillboardParticle ? n.mesh = new l.Mesh(m, v) : n.mesh = new l.Points(m, v), f.castShadow = !0, f.receiveShadow = !0, f.customDistanceMaterial = g, f.motionMaterial = _
        }

        function i() {
            var t = u.simulatorTextureWidth,
                e = u.simulatorTextureHeight,
                n = c.AMOUNT;
            m = new l.BufferGeometry;
            var o, i, r;
            if (u.useBillboardParticle) {
                i = new Float32Array(3 * n * 3), r = new Float32Array(3 * n * 2);
                var a = new Float32Array(3 * n * 3);
                m.addAttribute("positionFlip", new l.BufferAttribute(a, 3));
                var s, d, h = 2 * Math.PI / 3;
                for (o = 0; o < n; o++) s = 6 * o, d = 9 * o, i[d + 0] = Math.sin(2 * h + Math.PI), i[d + 1] = Math.cos(2 * h + Math.PI), i[d + 3] = Math.sin(h + Math.PI), i[d + 4] = Math.cos(h + Math.PI), i[d + 6] = Math.sin(3 * h + Math.PI), i[d + 7] = Math.cos(3 * h + Math.PI), a[d + 0] = Math.sin(2 * h), a[d + 1] = Math.cos(2 * h), a[d + 3] = Math.sin(h), a[d + 4] = Math.cos(h), a[d + 6] = Math.sin(3 * h), a[d + 7] = Math.cos(3 * h), r[s + 0] = r[s + 2] = r[s + 4] = o % t / e, r[s + 1] = r[s + 3] = r[s + 5] = ~~(o / t) / e
            } else {
                i = new Float32Array(3 * n), r = new Float32Array(2 * n);
                var p;
                for (o = 0; o < n; o++) p = 2 * o, r[p + 0] = o % t / e, r[p + 1] = ~~(o / t) / e
            }
            m.addAttribute("position", new l.BufferAttribute(i, 3)), m.addAttribute("fboUV", new l.BufferAttribute(r, 2))
        }

        function r() {
            var t = l.UniformsUtils.merge([l.UniformsLib.common, l.UniformsLib.fog, l.UniformsLib.lights]);
            v = new l.ShaderMaterial({
                uniforms: p(t, {
                    texturePosition: {
                        type: "t",
                        value: s
                    },
                    flipRatio: {
                        type: "f",
                        value: 0
                    }
                }),
                defines: {
                    USE_BILLBOARD: u.useBillboardParticle
                },
                vertexShader: d("#define GLSLIFY 1\nattribute vec2 fboUV;\nuniform sampler2D texturePosition;\n\n#ifdef USE_BILLBOARD\n\n    attribute vec3 positionFlip;\n    uniform float flipRatio;\n\n#else\n\n    varying float vAlpha;\n\n#endif\n\n// chunk(shadowmap_pars_vertex);\n\nvoid main() {\n\n    vec4 posInfo = texture2D( texturePosition, fboUV );\n    vec3 pos = posInfo.xyz;\n\n    vec4 worldPosition = modelMatrix * vec4( pos, 1.0 );\n    vec4 mvPosition = viewMatrix * worldPosition;\n\n    #ifdef USE_BILLBOARD\n\n        vec4 flipOffset = vec4(mix(position, positionFlip, flipRatio) * 0.5, 1.0);\n        worldPosition += flipOffset;\n\n    #else\n        gl_PointSize = ( 500.0 / length( mvPosition.xyz ) );\n        mvPosition.y += gl_PointSize * 0.5;\n\n    #endif\n\n    // chunk(shadowmap_vertex);\n\n    #ifdef USE_BILLBOARD\n\n        gl_Position = projectionMatrix * (mvPosition + flipOffset);\n\n    #else\n\n        vAlpha = smoothstep(0.0, 0.1, posInfo.w);\n        gl_Position = projectionMatrix * mvPosition;\n\n    #endif\n\n}\n"),
                fragmentShader: d("#define GLSLIFY 1\n// chunk(common);\n// chunk(packing);\n// chunk(bsdfs);\n// chunk(lights_pars);\n// chunk(fog_pars_fragment);\n// chunk(shadowmap_pars_fragment);\n// chunk(shadowmask_pars_fragment);\n\n#ifdef USE_BILLBOARD\n\n#else\n\n    varying float vAlpha;\n\n#endif\n\nvoid main() {\n\n    vec3 outgoingLight = vec3(1.0);\n\n    outgoingLight *= 0.1 + pow(0.7 + vec3(getShadowMask()) * 0.3, vec3(1.5)) * 0.9;\n    // chunk(fog_fragment);\n\n    #ifdef USE_BILLBOARD\n\n        gl_FragColor = vec4( outgoingLight, 1.0 );\n\n    #else\n\n        float d = length(gl_PointCoord.xy - .5) * 2.0;\n\n        gl_FragColor = vec4( outgoingLight, vAlpha ) * (1.0 - step(1.0, d)) ;\n\n    #endif\n}\n"),
                transparent: !u.useBillboardParticle,
                blending: u.useBillboardParticle ? l.NoBlending : l.NormalBlending,
                depthTest: !0,
                depthWrite: !0,
                fog: !0,
                lights: !0
            }), g = new l.ShaderMaterial({
                uniforms: {
                    lightPos: {
                        type: "v3",
                        value: new l.Vector3(0, 0, 0)
                    },
                    texturePosition: {
                        type: "t",
                        value: s
                    },
                    flipRatio: {
                        type: "f",
                        value: 0
                    }
                },
                defines: {
                    USE_BILLBOARD: u.useBillboardParticle
                },
                vertexShader: d("#define GLSLIFY 1\nattribute vec2 fboUV;\n\nuniform sampler2D texturePosition;\n\n#ifdef USE_BILLBOARD\n\n    attribute vec3 positionFlip;\n    uniform float flipRatio;\n\n#endif\n\nvarying vec4 vWorldPosition;\n\nvoid main() {\n\n    vec3 pos = texture2D( texturePosition, fboUV ).xyz;\n\n    vec4 worldPosition = modelMatrix * vec4( pos, 1.0 );\n    vec4 mvPosition = viewMatrix * worldPosition;\n\n    #ifdef USE_BILLBOARD\n\n        vec4 flipOffset = vec4(mix(position, positionFlip, flipRatio) * 0.5, 1.0);\n        gl_Position = projectionMatrix * (mvPosition + flipOffset);\n\n    #else\n\n        gl_PointSize = ( 300.0 / length( mvPosition.xyz ) );\n        mvPosition.y += gl_PointSize* 0.5;\n        gl_Position = projectionMatrix * mvPosition;\n\n    #endif\n\n    vWorldPosition = worldPosition;\n\n}\n"),
                fragmentShader: d("#define GLSLIFY 1\nuniform vec3 lightPos;\nvarying vec4 vWorldPosition;\n\nvec4 pack1K ( float depth ) {\n\n   depth /= 1000.0;\n   const vec4 bitSh = vec4( 256.0 * 256.0 * 256.0, 256.0 * 256.0, 256.0, 1.0 );\n   const vec4 bitMsk = vec4( 0.0, 1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0 );\n   vec4 res = fract( depth * bitSh );\n   res -= res.xxyz * bitMsk;\n   return res;\n\n}\n\nfloat unpack1K ( vec4 color ) {\n\n   const vec4 bitSh = vec4( 1.0 / ( 256.0 * 256.0 * 256.0 ), 1.0 / ( 256.0 * 256.0 ), 1.0 / 256.0, 1.0 );\n   return dot( color, bitSh ) * 1000.0;\n\n}\n\nvoid main () {\n\n   gl_FragColor = pack1K( length( vWorldPosition.xyz - lightPos.xyz ) );\n\n}\n"),
                depthTest: !0,
                depthWrite: !0,
                side: l.BackSide
            }), _ = new h({
                motionMultiplier: .1,
                uniforms: {
                    texturePosition: {
                        type: "t",
                        value: s
                    },
                    texturePrevPosition: {
                        type: "t",
                        value: s
                    },
                    flipRatio: {
                        type: "f",
                        value: 0
                    }
                },
                defines: {
                    USE_BILLBOARD: u.useBillboardParticle
                },
                vertexShader: d("#define GLSLIFY 1\nattribute vec2 fboUV;\n\nuniform sampler2D texturePosition;\nuniform sampler2D texturePrevPosition;\n\nuniform mat4 u_prevModelViewMatrix;\nvarying vec2 v_motion;\n\n#ifdef USE_BILLBOARD\n\n    attribute vec3 positionFlip;\n    uniform float flipRatio;\n\n#endif\n\nvoid main() {\n\n    vec4 positionInfo = texture2D( texturePosition, fboUV );\n    vec4 prevPositionInfo = texture2D( texturePrevPosition, fboUV );\n\n    vec4 pos = modelViewMatrix * vec4( positionInfo.xyz, 1.0 );\n    vec4 prevPos = u_prevModelViewMatrix * vec4( prevPositionInfo.xyz, 1.0 );\n\n    #ifdef USE_BILLBOARD\n\n        vec4 flipOffset = vec4(mix(position, positionFlip, flipRatio) * 0.5, 1.0);\n        pos = projectionMatrix * (pos + flipOffset);\n        prevPos = projectionMatrix * (prevPos + flipOffset);\n\n    #else\n\n        gl_PointSize = ( 300.0 / length( pos.xyz ) );\n        pos.y += gl_PointSize* 0.5;\n        pos = projectionMatrix * pos;\n\n        prevPos.y += ( 300.0 / length( prevPos.xyz ) )* 0.5;\n        prevPos = projectionMatrix * prevPos;\n\n    #endif\n\n    gl_Position = pos;\n    v_motion = (pos.xy / pos.w - prevPos.xy / prevPos.w) * 0.5 * step(positionInfo.w, prevPositionInfo.w);\n\n}\n"),
                depthTest: !0,
                depthWrite: !0,
                side: l.BackSide
            })
        }

        function a() {
            c.update(0), f.material.uniforms.texturePosition.value = c.positionRenderTarget, f.customDistanceMaterial.uniforms.texturePosition.value = c.positionRenderTarget, f.motionMaterial.uniforms.texturePosition.value = c.positionRenderTarget, f.motionMaterial.uniforms.texturePrevPosition.value = c.prevPositionRenderTarget, u.useBillboardParticle && (f.material.uniforms.flipRatio.value ^= 1, f.customDistanceMaterial.uniforms.flipRatio.value ^= 1, f.motionMaterial.uniforms.flipRatio.value ^= 1)
        }
        var s, u = t(69),
            l = t(42),
            c = t(55),
            d = t(50),
            h = t(65),
            p = t(31),
            f = n.mesh = s;
        n.init = o, n.update = a;
        var m, v, g, _
    }, {
        31: 31,
        42: 42,
        50: 50,
        55: 55,
        65: 65,
        69: 69
    }],
    61: [function(t, e, n) {
        function o() {}

        function i(t) {
            d(this, {
                uniforms: {
                    u_texture: {
                        type: "t",
                        value: s
                    },
                    u_resolution: {
                        type: "v2",
                        value: l.resolution
                    },
                    u_aspect: {
                        type: "f",
                        value: 1
                    }
                },
                enabled: !0,
                vertexShader: "",
                fragmentShader: "",
                isRawMaterial: !0,
                addRawShaderPrefix: !0
            }, t), this.vertexShader || (this.vertexShader = this.isRawMaterial ? c.vertexShader : p), this.addRawShaderPrefix && this.isRawMaterial && (this.vertexShader = c.rawShaderPrefix + this.vertexShader, this.fragmentShader = c.rawShaderPrefix + this.fragmentShader), this.material = new u[this.isRawMaterial ? "RawShaderMaterial" : "ShaderMaterial"]({
                uniforms: this.uniforms,
                vertexShader: this.vertexShader,
                fragmentShader: this.fragmentShader
            })
        }

        function r(t, e) {}

        function a(t, e, n) {
            return this.uniforms.u_texture.value = e, this.uniforms.u_aspect.value = this.uniforms.u_resolution.value.x / this.uniforms.u_resolution.value.y, l.render(this.material, n)
        }
        var s, u = t(42),
            l = t(63),
            c = t(56),
            d = t(30);
        e.exports = o;
        var h = o.prototype;
        h.init = i, h.resize = r, h.render = a;
        var p = "#define GLSLIFY 1\nvarying vec2 v_uv;\n\nvoid main() {\n    v_uv = uv;\n    gl_Position = vec4( position, 1.0 );\n}\n"
    }, {
        30: 30,
        42: 42,
        56: 56,
        63: 63
    }],
    62: [function(t, e, n) {
        function o() {
            c.init.call(this, {
                uniforms: {
                    u_blurTexture: {
                        type: "t",
                        value: r
                    },
                    u_amount: {
                        type: "f",
                        value: 0
                    }
                },
                fragmentShader: "#define GLSLIFY 1\nuniform sampler2D u_texture;\nuniform sampler2D u_blurTexture;\n\nuniform float u_amount;\n\nvarying vec2 v_uv;\n\nvoid main()\n{\n\n    vec3 baseColor = texture2D(u_texture, v_uv).rgb;\n    vec3 blurColor = texture2D(u_blurTexture, v_uv).rgb;\n    vec3 color = mix(baseColor, 1.0 - ((1.0 - baseColor) * (1.0 - blurColor)), u_amount);\n    // vec3 color = mix(baseColor, max(baseColor, blurColor), u_amount);\n\n    gl_FragColor = vec4(color, 1.0);\n\n}\n"
            }), d = new l.RawShaderMaterial({
                uniforms: {
                    u_texture: {
                        type: "t",
                        value: r
                    },
                    u_delta: {
                        type: "v2",
                        value: new l.Vector2
                    }
                },
                vertexShader: u.vertexShader,
                fragmentShader: u.rawShaderPrefix + "#define GLSLIFY 1\nuniform sampler2D u_texture;\nuniform vec2 u_delta;\n\nvarying vec2 v_uv;\n\nvoid main()\n{\n\n    vec3 color = texture2D( u_texture, v_uv ).rgb * 0.1633;\n\n    vec2 delta = u_delta;\n    color += texture2D( u_texture,  v_uv - delta ).rgb * 0.1531;\n    color += texture2D( u_texture,  v_uv + delta ).rgb * 0.1531;\n\n    delta += u_delta;\n    color += texture2D( u_texture,  v_uv - delta ).rgb * 0.12245;\n    color += texture2D( u_texture,  v_uv + delta ).rgb * 0.12245;\n\n    delta += u_delta;\n    color += texture2D( u_texture,  v_uv - delta ).rgb * 0.0918;\n    color += texture2D( u_texture,  v_uv + delta ).rgb * 0.0918;\n\n    delta += u_delta;\n    color += texture2D( u_texture,  v_uv - delta ).rgb * 0.051;\n    color += texture2D( u_texture,  v_uv + delta ).rgb * 0.051;\n\n    gl_FragColor = vec4(color, 1.0);\n\n}\n"
            })
        }

        function i(t, e, o) {
            var i = s.getRenderTarget(h),
                r = s.getRenderTarget(h);
            s.releaseRenderTarget(i, r);
            var a = n.blurRadius;
            d.uniforms.u_texture.value = e, d.uniforms.u_delta.value.set(a / s.resolution.x, 0), u.render(d, i), a = n.blurRadius, d.uniforms.u_texture.value = i, d.uniforms.u_delta.value.set(0, a / s.resolution.y), u.render(d, r), this.uniforms.u_blurTexture.value = r, this.uniforms.u_amount.value = n.amount, c.render.call(this, t, e, o)
        }
        var r, a = t(61),
            s = t(63),
            u = t(56),
            l = t(42),
            n = e.exports = new a,
            c = a.prototype;
        n.init = o, n.render = i, n.blurRadius = 1, n.amount = .3;
        var d, h = 1
    }, {
        42: 42,
        56: 56,
        61: 61,
        63: 63
    }],
    63: [function(t, e, n) {
        function o(t, e, o) {
            _ = n.fromRenderTarget = m.createRenderTarget(), x = n.toRenderTarget = m.createRenderTarget(), b = n.resolution = new f.Vector2, n.renderer = t, n.scene = e, n.camera = o
        }

        function i(t, e) {
            b.set(t, e), _.setSize(t, e), x.setSize(t, e), n.camera.aspect = t / e, n.camera.updateProjectionMatrix(), n.renderer.setSize(t, e);
            for (var o = 0, i = g.length; o < i; o++) g[o].resize(t, e)
        }

        function r(t) {
            return t.enabled
        }

        function a(t) {
            var e = g.filter(r);
            if (e.length) {
                x.depthBuffer = !0, x.stencilBuffer = !0, n.renderer.render(n.scene, n.camera, x), l();
                for (var o, i = 0, a = e.length; i < a; i++) o = e[i], o.render(t, _, i === a - 1)
            } else n.renderer.render(n.scene, n.camera)
        }

        function s(t, e, o) {
            e = e || n.scene, o = o || n.camera, t ? n.renderer.render(e, o, t) : n.renderer.render(e, o)
        }

        function u(t, e) {
            return m.render(t, e ? p : x), l(), _
        }

        function l() {
            var t = x;
            x = n.toRenderTarget = _, _ = n.fromRenderTarget = t
        }

        function c(t, e) {
            t = t || 0, e = +(e || 0);
            var n, o = b.x >> t,
                i = b.y >> t,
                r = t + "_" + e,
                a = h(r);
            return a.length ? (n = a.pop(), v(n, S)) : (n = m.createRenderTarget(o, i, e ? f.RGBAFormat : f.RGBFormat), n._listId = r, M[r] = M[r] || 0), M[r]++, n.width === o && n.height === i || n.setSize(o, i), n
        }

        function d(t) {
            for (var e, n, o, i, r, a = arguments, s = 0, u = a.length; s < u; s++) {
                for (t = a[s], i = t._listId, r = h(i), e = !1, M[i]--, n = 0, o = r.length; n < o; n++)
                    if (r[n] === t) {
                        e = !0;
                        break
                    }
                e || r.push(t)
            }
        }

        function h(t) {
            return y[t] || (y[t] = [])
        }
        var p, f = t(42),
            m = t(56),
            v = t(30);
        n.init = o, n.resize = i, n.renderQueue = a, n.renderScene = s, n.render = u, n.swapRenderTarget = l, n.getRenderTarget = c, n.releaseRenderTarget = d, n.resolution = p;
        var g = n.queue = [],
            _ = n.fromRenderTarget = p,
            x = n.toRenderTarget = p,
            b = n.resolution = p,
            y = {},
            M = {},
            S = {
                depthBuffer: !1,
                texture: {
                    generateMipmaps: !1
                }
            };
        n.renderer = p, n.scene = p, n.camera = p
    }, {
        30: 30,
        42: 42,
        56: 56
    }],
    64: [function(t, e, n) {
        function o(t) {
            var e = t ? "#define GLSLIFY 1\nvarying vec2 v_rgbNW;\nvarying vec2 v_rgbNE;\nvarying vec2 v_rgbSW;\nvarying vec2 v_rgbSE;\nvarying vec2 v_rgbM;\n\nattribute vec3 position;\nattribute vec2 uv;\n\nuniform vec2 u_resolution;\n\nvarying vec2 v_uv;\n\n//To save 9 dependent texture reads, you can compute\n//these in the vertex shader and use the optimized\n//frag.glsl function in your frag shader. \n\n//This is best suited for mobile devices, like iOS.\n\nvoid texcoords(vec2 fragCoord, vec2 resolution,\n\t\t\tout vec2 v_rgbNW, out vec2 v_rgbNE,\n\t\t\tout vec2 v_rgbSW, out vec2 v_rgbSE,\n\t\t\tout vec2 v_rgbM) {\n\tvec2 inverseVP = 1.0 / resolution.xy;\n\tv_rgbNW = (fragCoord + vec2(-1.0, -1.0)) * inverseVP;\n\tv_rgbNE = (fragCoord + vec2(1.0, -1.0)) * inverseVP;\n\tv_rgbSW = (fragCoord + vec2(-1.0, 1.0)) * inverseVP;\n\tv_rgbSE = (fragCoord + vec2(1.0, 1.0)) * inverseVP;\n\tv_rgbM = vec2(fragCoord * inverseVP);\n}\n\nvoid main() {\n\n   vec2 fragCoord = uv * u_resolution;\n   texcoords(fragCoord, u_resolution, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);\n\n    v_uv = uv;\n    gl_Position = vec4( position, 1.0 );\n\n}\n" : "",
                n = t ? '#define GLSLIFY 1\nvarying vec2 v_rgbNW;\nvarying vec2 v_rgbNE;\nvarying vec2 v_rgbSW;\nvarying vec2 v_rgbSE;\nvarying vec2 v_rgbM;\n\nuniform vec2 u_resolution;\nuniform sampler2D u_texture;\n\nvarying vec2 v_uv;\n\n/**\nBasic FXAA implementation based on the code on geeks3d.com with the\nmodification that the texture2DLod stuff was removed since it\'s\nunsupported by WebGL.\n\n--\n\nFrom:\nhttps://github.com/mitsuhiko/webgl-meincraft\n\nCopyright (c) 2011 by Armin Ronacher.\n\nSome rights reserved.\n\nRedistribution and use in source and binary forms, with or without\nmodification, are permitted provided that the following conditions are\nmet:\n\n    * Redistributions of source code must retain the above copyright\n      notice, this list of conditions and the following disclaimer.\n\n    * Redistributions in binary form must reproduce the above\n      copyright notice, this list of conditions and the following\n      disclaimer in the documentation and/or other materials provided\n      with the distribution.\n\n    * The names of the contributors may not be used to endorse or\n      promote products derived from this software without specific\n      prior written permission.\n\nTHIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS\n"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT\nLIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR\nA PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT\nOWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,\nSPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT\nLIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,\nDATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY\nTHEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT\n(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\nOF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n*/\n\n#ifndef FXAA_REDUCE_MIN\n    #define FXAA_REDUCE_MIN   (1.0/ 128.0)\n#endif\n#ifndef FXAA_REDUCE_MUL\n    #define FXAA_REDUCE_MUL   (1.0 / 8.0)\n#endif\n#ifndef FXAA_SPAN_MAX\n    #define FXAA_SPAN_MAX     8.0\n#endif\n\n//optimized version for mobile, where dependent \n//texture reads can be a bottleneck\nvec4 fxaa(sampler2D tex, vec2 fragCoord, vec2 resolution,\n            vec2 v_rgbNW, vec2 v_rgbNE, \n            vec2 v_rgbSW, vec2 v_rgbSE, \n            vec2 v_rgbM) {\n    vec4 color;\n    mediump vec2 inverseVP = vec2(1.0 / resolution.x, 1.0 / resolution.y);\n    vec3 rgbNW = texture2D(tex, v_rgbNW).xyz;\n    vec3 rgbNE = texture2D(tex, v_rgbNE).xyz;\n    vec3 rgbSW = texture2D(tex, v_rgbSW).xyz;\n    vec3 rgbSE = texture2D(tex, v_rgbSE).xyz;\n    vec4 texColor = texture2D(tex, v_rgbM);\n    vec3 rgbM  = texColor.xyz;\n    vec3 luma = vec3(0.299, 0.587, 0.114);\n    float lumaNW = dot(rgbNW, luma);\n    float lumaNE = dot(rgbNE, luma);\n    float lumaSW = dot(rgbSW, luma);\n    float lumaSE = dot(rgbSE, luma);\n    float lumaM  = dot(rgbM,  luma);\n    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));\n    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));\n    \n    mediump vec2 dir;\n    dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));\n    dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));\n    \n    float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) *\n                          (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);\n    \n    float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);\n    dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX),\n              max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),\n              dir * rcpDirMin)) * inverseVP;\n    \n    vec3 rgbA = 0.5 * (\n        texture2D(tex, fragCoord * inverseVP + dir * (1.0 / 3.0 - 0.5)).xyz +\n        texture2D(tex, fragCoord * inverseVP + dir * (2.0 / 3.0 - 0.5)).xyz);\n    vec3 rgbB = rgbA * 0.5 + 0.25 * (\n        texture2D(tex, fragCoord * inverseVP + dir * -0.5).xyz +\n        texture2D(tex, fragCoord * inverseVP + dir * 0.5).xyz);\n\n    float lumaB = dot(rgbB, luma);\n    if ((lumaB < lumaMin) || (lumaB > lumaMax))\n        color = vec4(rgbA, texColor.a);\n    else\n        color = vec4(rgbB, texColor.a);\n    return color;\n}\n\nvoid main() {\n\n    vec2 fragCoord = v_uv * u_resolution;\n\n    gl_FragColor = fxaa(u_texture, fragCoord, u_resolution, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);\n\n}\n' : '#define GLSLIFY 1\nuniform vec2 u_resolution;\nuniform sampler2D u_texture;\n\n/**\nBasic FXAA implementation based on the code on geeks3d.com with the\nmodification that the texture2DLod stuff was removed since it\'s\nunsupported by WebGL.\n\n--\n\nFrom:\nhttps://github.com/mitsuhiko/webgl-meincraft\n\nCopyright (c) 2011 by Armin Ronacher.\n\nSome rights reserved.\n\nRedistribution and use in source and binary forms, with or without\nmodification, are permitted provided that the following conditions are\nmet:\n\n    * Redistributions of source code must retain the above copyright\n      notice, this list of conditions and the following disclaimer.\n\n    * Redistributions in binary form must reproduce the above\n      copyright notice, this list of conditions and the following\n      disclaimer in the documentation and/or other materials provided\n      with the distribution.\n\n    * The names of the contributors may not be used to endorse or\n      promote products derived from this software without specific\n      prior written permission.\n\nTHIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS\n"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT\nLIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR\nA PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT\nOWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,\nSPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT\nLIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,\nDATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY\nTHEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT\n(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\nOF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n*/\n\n#ifndef FXAA_REDUCE_MIN\n    #define FXAA_REDUCE_MIN   (1.0/ 128.0)\n#endif\n#ifndef FXAA_REDUCE_MUL\n    #define FXAA_REDUCE_MUL   (1.0 / 8.0)\n#endif\n#ifndef FXAA_SPAN_MAX\n    #define FXAA_SPAN_MAX     8.0\n#endif\n\n//optimized version for mobile, where dependent \n//texture reads can be a bottleneck\nvec4 fxaa(sampler2D tex, vec2 fragCoord, vec2 resolution,\n            vec2 v_rgbNW, vec2 v_rgbNE, \n            vec2 v_rgbSW, vec2 v_rgbSE, \n            vec2 v_rgbM) {\n    vec4 color;\n    mediump vec2 inverseVP = vec2(1.0 / resolution.x, 1.0 / resolution.y);\n    vec3 rgbNW = texture2D(tex, v_rgbNW).xyz;\n    vec3 rgbNE = texture2D(tex, v_rgbNE).xyz;\n    vec3 rgbSW = texture2D(tex, v_rgbSW).xyz;\n    vec3 rgbSE = texture2D(tex, v_rgbSE).xyz;\n    vec4 texColor = texture2D(tex, v_rgbM);\n    vec3 rgbM  = texColor.xyz;\n    vec3 luma = vec3(0.299, 0.587, 0.114);\n    float lumaNW = dot(rgbNW, luma);\n    float lumaNE = dot(rgbNE, luma);\n    float lumaSW = dot(rgbSW, luma);\n    float lumaSE = dot(rgbSE, luma);\n    float lumaM  = dot(rgbM,  luma);\n    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));\n    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));\n    \n    mediump vec2 dir;\n    dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));\n    dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));\n    \n    float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) *\n                          (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);\n    \n    float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);\n    dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX),\n              max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),\n              dir * rcpDirMin)) * inverseVP;\n    \n    vec3 rgbA = 0.5 * (\n        texture2D(tex, fragCoord * inverseVP + dir * (1.0 / 3.0 - 0.5)).xyz +\n        texture2D(tex, fragCoord * inverseVP + dir * (2.0 / 3.0 - 0.5)).xyz);\n    vec3 rgbB = rgbA * 0.5 + 0.25 * (\n        texture2D(tex, fragCoord * inverseVP + dir * -0.5).xyz +\n        texture2D(tex, fragCoord * inverseVP + dir * 0.5).xyz);\n\n    float lumaB = dot(rgbB, luma);\n    if ((lumaB < lumaMin) || (lumaB > lumaMax))\n        color = vec4(rgbA, texColor.a);\n    else\n        color = vec4(rgbB, texColor.a);\n    return color;\n}\n\n//To save 9 dependent texture reads, you can compute\n//these in the vertex shader and use the optimized\n//frag.glsl function in your frag shader. \n\n//This is best suited for mobile devices, like iOS.\n\nvoid texcoords(vec2 fragCoord, vec2 resolution,\n\t\t\tout vec2 v_rgbNW, out vec2 v_rgbNE,\n\t\t\tout vec2 v_rgbSW, out vec2 v_rgbSE,\n\t\t\tout vec2 v_rgbM) {\n\tvec2 inverseVP = 1.0 / resolution.xy;\n\tv_rgbNW = (fragCoord + vec2(-1.0, -1.0)) * inverseVP;\n\tv_rgbNE = (fragCoord + vec2(1.0, -1.0)) * inverseVP;\n\tv_rgbSW = (fragCoord + vec2(-1.0, 1.0)) * inverseVP;\n\tv_rgbSE = (fragCoord + vec2(1.0, 1.0)) * inverseVP;\n\tv_rgbM = vec2(fragCoord * inverseVP);\n}\n\nvec4 apply(sampler2D tex, vec2 fragCoord, vec2 resolution) {\n\tmediump vec2 v_rgbNW;\n\tmediump vec2 v_rgbNE;\n\tmediump vec2 v_rgbSW;\n\tmediump vec2 v_rgbSE;\n\tmediump vec2 v_rgbM;\n\n\t//compute the texture coords\n\ttexcoords(fragCoord, resolution, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);\n\t\n\t//compute FXAA\n\treturn fxaa(tex, fragCoord, resolution, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);\n}\n\nvoid main() {\n    gl_FragColor = apply(u_texture, gl_FragCoord.xy, u_resolution);\n}\n';
            r.init.call(this, {
                uniforms: {},
                vertexShader: e,
                fragmentShader: n
            })
        }
        var i = t(61);
        e.exports = new i;
        var r = i.prototype;
        e.exports.init = o
    }, {
        61: 61
    }],
    65: [function(t, e, n) {
        function o(t) {
            t = t || {};
            var e = t.uniforms || {},
                n = s("#define GLSLIFY 1\n// chunk(morphtarget_pars_vertex);\n// chunk(skinning_pars_vertex);\n\nuniform mat4 u_prevModelViewMatrix;\n\nvarying vec2 v_motion;\n\nvoid main() {\n\n    // chunk(skinbase_vertex);\n    // chunk(begin_vertex);\n\n    // chunk(morphtarget_vertex);\n    // chunk(skinning_vertex);\n\n    vec4 pos = projectionMatrix * modelViewMatrix * vec4( transformed, 1.0 );\n    vec4 prevPos = projectionMatrix * u_prevModelViewMatrix * vec4( transformed, 1.0 );\n    gl_Position = pos;\n    v_motion = (pos.xy / pos.w - prevPos.xy / prevPos.w) * 0.5;\n\n}\n"),
                o = s("#define GLSLIFY 1\nuniform float u_motionMultiplier;\n\nvarying vec2 v_motion;\n\nvoid main() {\n\n        gl_FragColor = vec4( v_motion * u_motionMultiplier, gl_FragCoord.z, 1.0 );\n\n}\n");
            this.motionMultiplier = t.motionMultiplier || 1, i.ShaderMaterial.call(this, r({
                uniforms: a(e, {
                    u_prevModelViewMatrix: {
                        type: "m4",
                        value: new i.Matrix4
                    },
                    u_motionMultiplier: {
                        type: "f",
                        value: 1
                    }
                }),
                vertexShader: n,
                fragmentShader: o
            }, t))
        }
        var i = t(42),
            r = t(31),
            a = t(25),
            s = t(50);
        (o.prototype = Object.create(i.ShaderMaterial.prototype)).constructor = o, e.exports = o
    }, {
        25: 25,
        31: 31,
        42: 42,
        50: 50
    }],
    66: [function(t, e, n) {
        function o(t) {
            var e = d.renderer.getContext();
            e.getExtension("OES_texture_float") && e.getExtension("OES_texture_float_linear") || alert("no float linear support"), m = h.createRenderTarget(1, 1, p.RGBAFormat, p.FloatType), m.depthBuffer = !0, v = h.createRenderTarget(1, 1, p.RGBAFormat, p.FloatType), _ = new p.Camera, _.position.z = 1, x = new p.Scene, f.init.call(this, {
                uniforms: {
                    u_lineAlphaMultiplier: {
                        type: "f",
                        value: 1
                    },
                    u_linesTexture: {
                        type: "t",
                        value: v
                    }
                },
                fragmentShader: "#define GLSLIFY 1\nuniform sampler2D u_texture;\nuniform sampler2D u_linesTexture;\nuniform float u_lineAlphaMultiplier;\n\nvarying vec2 v_uv;\n\nvoid main() {\n\n    vec3 base = texture2D( u_texture, v_uv.xy ).rgb;\n    vec4 lines = texture2D( u_linesTexture, v_uv.xy );\n\n    vec3 color = (base + lines.rgb * u_lineAlphaMultiplier) / (lines.a * u_lineAlphaMultiplier + 1.0);\n\n    gl_FragColor = vec4( color, 1.0 );\n\n}\n"
            }), b = [], M = new p.BufferGeometry, S = new p.RawShaderMaterial({
                uniforms: {
                    u_texture: {
                        type: "t",
                        value: l
                    },
                    u_motionTexture: {
                        type: "t",
                        value: m
                    },
                    u_resolution: {
                        type: "v2",
                        value: d.resolution
                    },
                    u_maxDistance: {
                        type: "f",
                        value: 1
                    },
                    u_jitter: {
                        type: "f",
                        value: .3
                    },
                    u_fadeStrength: {
                        type: "f",
                        value: 1
                    },
                    u_motionMultiplier: {
                        type: "f",
                        value: 1
                    },
                    u_depthTest: {
                        type: "f",
                        value: 0
                    },
                    u_opacity: {
                        type: "f",
                        value: 1
                    },
                    u_leaning: {
                        type: "f",
                        value: .5
                    },
                    u_depthBias: {
                        type: "f",
                        value: .01
                    }
                },
                vertexShader: h.rawShaderPrefix + "#define GLSLIFY 1\nattribute vec3 position;\n\nuniform sampler2D u_texture;\nuniform sampler2D u_motionTexture;\n\nuniform vec2 u_resolution;\nuniform float u_maxDistance;\nuniform float u_jitter;\nuniform float u_motionMultiplier;\nuniform float u_leaning;\n\nvarying vec3 v_color;\nvarying float v_ratio;\nvarying float v_depth;\nvarying vec2 v_uv;\n\nvoid main() {\n\n    v_color = texture2D( u_texture, position.xy ).rgb;\n\n    float side = step(0.001, position.z);\n\n    v_ratio = side;\n\n    vec3 motion = texture2D( u_motionTexture, position.xy ).xyz;\n    v_depth = motion.z;\n\n    vec2 offset = motion.xy * u_resolution * u_motionMultiplier;\n    float offsetDistance = length(offset);\n    if(offsetDistance > u_maxDistance) {\n        offset = normalize(offset) * u_maxDistance;\n    }\n\n    vec2 pos = position.xy * 2.0 - 1.0 - offset / u_resolution * 2.0 * (1.0 - position.z * u_jitter) * (side - u_leaning);\n    v_uv = pos * 0.5 + 0.5;\n\n    gl_Position = vec4( pos, 0.0, 1.0 );\n\n}\n",
                fragmentShader: h.rawShaderPrefix + "#define GLSLIFY 1\nuniform sampler2D u_motionTexture;\nuniform float u_depthTest;\nuniform float u_opacity;\nuniform float u_leaning;\nuniform float u_fadeStrength;\nuniform float u_depthBias;\nuniform float u_useDepthWeight;\n\nvarying vec3 v_color;\nvarying float v_ratio;\nvarying float v_depth;\nvarying vec2 v_uv;\n\nvoid main() {\n\n    vec3 motion = texture2D( u_motionTexture, v_uv ).xyz;\n\n    float alpha = smoothstep(0.0, u_leaning, v_ratio) * (1.0 - smoothstep (u_leaning, 1.0, v_ratio));\n\n    alpha = pow(alpha, u_fadeStrength) * u_opacity;\n\n    if(alpha < 0.00392157) {\n        discard;\n    }\n\n    float threshold = v_depth * step(0.0001, motion.z);\n    alpha *= max(1.0 - u_depthTest, smoothstep(threshold - u_depthBias, threshold, motion.z));\n\n    gl_FragColor = vec4( v_color * alpha, alpha );\n\n}\n",
                blending: p.CustomBlending,
                blendEquation: p.AddEquation,
                blendSrc: p.OneFactor,
                blendDst: p.OneFactor,
                blendEquationAlpha: p.AddEquation,
                blendSrcAlpha: p.OneFactor,
                blendDstAlpha: p.OneFactor,
                depthTest: !1,
                depthWrite: !1,
                transparent: !0
            }), g = new p.LineSegments(M, S), x.add(g), w = new p.RawShaderMaterial({
                uniforms: {
                    u_texture: {
                        type: "t",
                        value: l
                    },
                    u_motionTexture: {
                        type: "t",
                        value: m
                    },
                    u_resolution: {
                        type: "v2",
                        value: d.resolution
                    },
                    u_maxDistance: {
                        type: "f",
                        value: 1
                    },
                    u_fadeStrength: {
                        type: "f",
                        value: 1
                    },
                    u_motionMultiplier: {
                        type: "f",
                        value: 1
                    },
                    u_leaning: {
                        type: "f",
                        value: .5
                    }
                },
                defines: {
                    SAMPLE_COUNT: t || 21
                },
                vertexShader: this.material.vertexShader,
                fragmentShader: h.rawShaderPrefix + "#define SAMPLE_COUNT " + (t || 21) + "\n#define GLSLIFY 1\nuniform sampler2D u_texture;\nuniform sampler2D u_motionTexture;\n\nuniform vec2 u_resolution;\nuniform float u_maxDistance;\nuniform float u_motionMultiplier;\nuniform float u_leaning;\n\nvarying vec2 v_uv;\n\nvoid main() {\n\n    vec2 motion = texture2D( u_motionTexture, v_uv ).xy;\n\n    vec2 offset = motion * u_resolution * u_motionMultiplier;\n    float offsetDistance = length(offset);\n    if(offsetDistance > u_maxDistance) {\n        offset = normalize(offset) * u_maxDistance;\n    }\n    vec2 delta = - offset / u_resolution * 2.0 / float(SAMPLE_COUNT);\n    vec2 pos = v_uv - delta * u_leaning * float(SAMPLE_COUNT);\n    vec3 color = vec3(0.0);\n\n    for(int i = 0; i < SAMPLE_COUNT; i++) {\n        color += texture2D( u_texture, pos ).rgb;\n        pos += delta;\n    }\n\n    gl_FragColor = vec4( color / float(SAMPLE_COUNT), 1.0 );\n\n}\n"
            })
        }

        function i(t, e) {
            t ? (D = t, A = e) : (t = D, e = A);
            var o = ~~(t * n.motionRenderTargetScale),
                i = ~~(e * n.motionRenderTargetScale);
            if (m.setSize(o, i), !n.useSampling) {
                var a = ~~(t * n.linesRenderTargetScale),
                    s = ~~(e * n.linesRenderTargetScale);
                v.setSize(a, s);
                var u, l = !n.useDithering,
                    c = l ? a * s : r(a, s);
                c > b.length / 6 && (b = new Float32Array(6 * c), y = new p.BufferAttribute(b, 3), M.removeAttribute("position"), M.addAttribute("position", y));
                var d, h, f = 0,
                    g = a * s;
                for (u = 0; u < g; u++) d = u % a, h = ~~(u / a), (l || d + (1 & h) & 1) && (b[f + 0] = b[f + 3] = (d + .5) / a, b[f + 1] = b[f + 4] = (h + .5) / s, b[f + 2] = 0, b[f + 5] = .001 + .999 * Math.random(), f += 6);
                y.needsUpdate = !0, M.drawRange.count = 2 * c
            }
            E = n.useDithering, I = n.useSampling
        }

        function r(t, e) {
            return 1 & t && 1 & e ? ((t - 1) * (e - 1) >> 1) + (t >> 1) + (e >> 1) : t * e >> 1
        }

        function a(t, e, o) {
            E !== n.useDithering ? i() : I !== n.useSampling && i();
            var r = n.useSampling,
                a = 1e3 / (t < 16.667 ? 16.667 : t) / n.targetFPS,
                l = h.getColorState();
            d.renderer.setClearColor(0, 1), d.renderer.clearTarget(m, !0), d.scene.traverseVisible(s), d.renderScene(m);
            for (var c = 0, p = F.length; c < p; c++) u(F[c]);
            F = [], r || (S.uniforms.u_maxDistance.value = n.maxDistance, S.uniforms.u_jitter.value = n.jitter, S.uniforms.u_fadeStrength.value = n.fadeStrength, S.uniforms.u_motionMultiplier.value = n.motionMultiplier * a, S.uniforms.u_depthTest.value = n.depthTest, S.uniforms.u_opacity.value = n.opacity, S.uniforms.u_leaning.value = Math.max(.001, Math.min(.999, n.leaning)), S.uniforms.u_depthBias.value = Math.max(1e-5, n.depthBias), S.uniforms.u_texture.value = e, d.renderer.setClearColor(0, 0), d.renderer.clearTarget(v, !0), d.renderer.render(x, _, v)), h.setColorState(l), r ? (w.uniforms.u_maxDistance.value = n.maxDistance, w.uniforms.u_fadeStrength.value = n.fadeStrength, w.uniforms.u_motionMultiplier.value = n.motionMultiplier * a, w.uniforms.u_leaning.value = Math.max(.001, Math.min(.999, n.leaning)), w.uniforms.u_texture.value = e, d.render(w, o)) : (this.uniforms.u_lineAlphaMultiplier.value = 1 + n.useDithering, f.render.call(this, t, e, o))
        }

        function s(t) {
            t.motionMaterial ? (t._tmpMaterial = t.material, t.material = t.motionMaterial, t.material.uniforms.u_motionMultiplier.value = t.material.motionMultiplier) : t.material && (t.visible = !1), F.push(t)
        }

        function u(t) {
            t.motionMaterial ? (t.material = t._tmpMaterial, t._tmpMaterial = l, n.skipMatrixUpdate || t.motionMaterial.uniforms.u_prevModelViewMatrix.value.copy(t.modelViewMatrix)) : t.visible = !0
        }
        var l, c = t(61),
            d = t(63),
            h = t(56),
            p = t(42),
            n = e.exports = new c,
            f = c.prototype;
        n.init = o, n.resize = i, n.render = a, n.useSampling = !1, n.skipMatrixUpdate = !1, n.fadeStrength = 1, n.motionMultiplier = 1, n.maxDistance = 100, n.targetFPS = 60, n.leaning = .5, n.jitter = 0, n.opacity = 1, n.depthBias = .002, n.depthTest = !1, n.useDithering = !1, n.motionRenderTargetScale = 1, n.linesRenderTargetScale = .5;
        var m, v, g, _, x, b, y, M, S, w, E, I, D, A, F = []
    }, {
        42: 42,
        56: 56,
        61: 61,
        63: 63
    }],
    67: [function(t, e, n) {
        function o(t, e, n) {
            h = t, p = e, f = f, a.init(t, e, n), s.init(), a.queue.push(s), c.init(), a.queue.push(c), u.init(), a.queue.push(u), l.init(), a.queue.push(l)
        }

        function i(t, e) {
            a.resize(t, e)
        }

        function r(t) {
            a.renderQueue(t), n.visualizeTarget && d.copy(n.visualizeTarget)
        }
        var a = t(63),
            s = t(64),
            u = t(62),
            l = t(68),
            c = t(66),
            d = t(56);
        n.init = o, n.resize = i, n.render = r, n.visualizeTarget = void 0;
        var h, p, f
    }, {
        56: 56,
        62: 62,
        63: 63,
        64: 64,
        66: 66,
        68: 68
    }],
    68: [function(t, e, n) {
        function o() {
            r.init.call(this, {
                uniforms: {
                    u_reduction: {
                        type: "f",
                        value: .3
                    },
                    u_boost: {
                        type: "f",
                        value: 1.2
                    }
                },
                fragmentShader: "#define GLSLIFY 1\nuniform sampler2D u_texture;\nuniform vec2 u_resolution;\nuniform float u_aspect;\n\nuniform float u_reduction;\nuniform float u_boost;\n\nvarying vec2 v_uv;\n\nfloat range(float vmin, float vmax, float value) {\n  return (value - vmin) / (vmax - vmin);\n}\n\nvoid main() {\n\n  vec4 color = texture2D( u_texture, v_uv );\n\n  vec2 center = u_resolution * 0.5;\n  float vignette = range(0.25, 1.0, length( v_uv - vec2(0.5) ));\n  vignette = u_boost - vignette * u_reduction;\n\n  color.rgb *= vignette;\n  gl_FragColor = color;\n\n}\n"
            })
        }
        var i = t(61);
        e.exports = new i;
        var r = i.prototype;
        e.exports.init = o
    }, {
        61: 61
    }],
    69: [function(t, e, n) {
        var o = t(35),
            i = t(29),
            r = n.query = o(window.location.href.replace("#", "?"));
        n.useStats = !1;
        var a = {
            0: [0, 0, 0],
            "4k": [64, 64, .29],
            "8k": [128, 64, .42],
            "16k": [128, 128, .48],
            "32k": [256, 128, .55],
            "65k": [256, 256, .6],
            "131k": [512, 256, .85],
            "252k": [512, 512, 1.2],
            "524k": [1024, 512, 1.4],
            "1m": [1024, 1024, 1.6],
            "2m": [2048, 1024, 2],
            "4m": [2048, 2048, 2.5]
        };
        n.amountList = i(a), r.amount = a[r.amount] ? r.amount : "0";
        var s = a[r.amount];
        n.simulatorTextureWidth = s[0], n.simulatorTextureHeight = s[1], n.useStats = !1, n.useBillboardParticle = !1, n.lightSpeed = 0, n.bloomOpacity = .45, n.particlesDropRadius = 20, n.particlesFromY = 300, n.particlesYDynamicRange = 300, n.handBounceRatio = .1, n.handForce = .015, n.gravity = 10, n.fxaa = !1;
        var u = n.motionBlurQualityMap = {
            best: 1,
            high: .5,
            medium: 1 / 3,
            low: .25
        };
        n.motionBlurQualityList = i(u), r.motionBlurQuality = u[r.motionBlurQuality] ? r.motionBlurQuality : "medium", n.motionBlur = !0, n.motionBlurPause = !1, n.bloom = !1, n.vignette = !1, n.vignetteMultiplier = .8, n.uarm_speed = 3, n.uarm_z_limit = 50
    }, {
        29: 29,
        35: 35
    }],
    70: [function(t, e, n) {
        function o() {
            return i || (i = new r.MeshStandardMaterial({
                roughness: .86,
                metalness: .45,
                color: 11184810,
                emissive: 0
            })), i
        }
        var i, r = (t(69), t(42));
        n.getMaterial = o
    }, {
        42: 42,
        69: 69
    }],
    71: [function(t, e, n) {
        var o = (t(85), t(6)),
            i = o.vec3,
            r = o.mat3,
            a = o.mat4,
            s = (t(46), e.exports = function(t, e) {
                this.finger = t, this._center = null, this._matrix = null, this.type = e.type, this.prevJoint = e.prevJoint, this.nextJoint = e.nextJoint, this.width = e.width;
                var n = new Array(3);
                i.sub(n, e.nextJoint, e.prevJoint), this.length = i.length(n), this.basis = e.basis
            });
        s.prototype.left = function() {
            return this._left ? this._left : (this._left = r.determinant(this.basis[0].concat(this.basis[1]).concat(this.basis[2])) < 0, this._left)
        }, s.prototype.matrix = function() {
            if (this._matrix) return this._matrix;
            var t = this.basis,
                e = this._matrix = a.create();
            return e[0] = t[0][0], e[1] = t[0][1], e[2] = t[0][2], e[4] = t[1][0], e[5] = t[1][1], e[6] = t[1][2], e[8] = t[2][0], e[9] = t[2][1], e[10] = t[2][2], e[3] = this.center()[0], e[7] = this.center()[1], e[11] = this.center()[2], this.left() && (e[0] *= -1, e[1] *= -1, e[2] *= -1), this._matrix
        }, s.prototype.lerp = function(t, e) {
            i.lerp(t, this.prevJoint, this.nextJoint, e)
        }, s.prototype.center = function() {
            if (this._center) return this._center;
            var t = i.create();
            return this.lerp(t, .5), this._center = t, t
        }, s.prototype.direction = function() {
            return [-1 * this.basis[2][0], -1 * this.basis[2][1], -1 * this.basis[2][2]]
        }
    }, {
        46: 46,
        6: 6,
        85: 85
    }],
    72: [function(t, e, n) {
        var o = e.exports = function(t) {
            this.pos = 0, this._buf = [], this.size = t
        };
        o.prototype.get = function(t) {
            if (void 0 == t && (t = 0), !(t >= this.size || t >= this._buf.length)) return this._buf[(this.pos - t - 1) % this.size]
        }, o.prototype.push = function(t) {
            return this._buf[this.pos % this.size] = t, this.pos++
        }
    }, {}],
    73: [function(t, e, n) {
        var o = t(86).chooseProtocol,
            i = t(5).EventEmitter,
            r = t(46),
            a = e.exports = function(t) {
                this.opts = r.defaults(t || {}, {
                    host: "127.0.0.1",
                    enableGestures: !1,
                    scheme: this.getScheme(),
                    port: this.getPort(),
                    background: !1,
                    optimizeHMD: !1,
                    requestProtocolVersion: a.defaultProtocolVersion
                }), this.host = this.opts.host, this.port = this.opts.port, this.scheme = this.opts.scheme, this.protocolVersionVerified = !1, this.background = null, this.optimizeHMD = null, this.on("ready", function() {
                    this.enableGestures(this.opts.enableGestures), this.setBackground(this.opts.background), this.setOptimizeHMD(this.opts.optimizeHMD), this.opts.optimizeHMD ? console.log("Optimized for head mounted display usage.") : console.log("Optimized for desktop usage.")
                })
            };
        a.defaultProtocolVersion = 6, a.prototype.getUrl = function() {
            return this.scheme + "//" + this.host + ":" + this.port + "/v" + this.opts.requestProtocolVersion + ".json"
        }, a.prototype.getScheme = function() {
            return "ws:"
        }, a.prototype.getPort = function() {
            return 6437
        }, a.prototype.setBackground = function(t) {
            this.opts.background = t, this.protocol && this.protocol.sendBackground && this.background !== this.opts.background && (this.background = this.opts.background, this.protocol.sendBackground(this, this.opts.background))
        }, a.prototype.setOptimizeHMD = function(t) {
            this.opts.optimizeHMD = t, this.protocol && this.protocol.sendOptimizeHMD && this.optimizeHMD !== this.opts.optimizeHMD && (this.optimizeHMD = this.opts.optimizeHMD, this.protocol.sendOptimizeHMD(this, this.opts.optimizeHMD))
        }, a.prototype.handleOpen = function() {
            this.connected || (this.connected = !0, this.emit("connect"))
        }, a.prototype.enableGestures = function(t) {
            this.gesturesEnabled = !!t, this.send(this.protocol.encode({
                enableGestures: this.gesturesEnabled
            }))
        }, a.prototype.handleClose = function(t, e) {
            this.connected && (this.disconnect(), 1001 === t && this.opts.requestProtocolVersion > 1 && (this.protocolVersionVerified ? this.protocolVersionVerified = !1 : this.opts.requestProtocolVersion--), this.startReconnection())
        }, a.prototype.startReconnection = function() {
            var t = this;
            this.reconnectionTimer || (this.reconnectionTimer = setInterval(function() {
                t.reconnect()
            }, 500))
        }, a.prototype.stopReconnection = function() {
            this.reconnectionTimer = clearInterval(this.reconnectionTimer)
        }, a.prototype.disconnect = function(t) {
            if (t || this.stopReconnection(), this.socket) return this.socket.close(), delete this.socket, delete this.protocol, delete this.background, delete this.optimizeHMD, delete this.focusedState, this.connected && (this.connected = !1, this.emit("disconnect")), !0
        }, a.prototype.reconnect = function() {
            this.connected ? this.stopReconnection() : (this.disconnect(!0), this.connect())
        }, a.prototype.handleData = function(t) {
            var e, n = JSON.parse(t);
            void 0 === this.protocol ? (e = this.protocol = o(n), this.protocolVersionVerified = !0, this.emit("ready")) : e = this.protocol(n), this.emit(e.type, e)
        }, a.prototype.connect = function() {
            if (!this.socket) return this.socket = this.setupSocket(), !0
        }, a.prototype.send = function(t) {
            this.socket.send(t)
        }, a.prototype.reportFocus = function(t) {
            this.connected && this.focusedState !== t && (this.focusedState = t, this.emit(this.focusedState ? "focus" : "blur"), this.protocol && this.protocol.sendFocused && this.protocol.sendFocused(this, this.focusedState))
        }, r.extend(a.prototype, i.prototype)
    }, {
        46: 46,
        5: 5,
        86: 86
    }],
    74: [function(t, e, n) {
        var o = e.exports = t(73),
            i = t(46),
            r = e.exports = function(t) {
                o.call(this, t);
                var e = this;
                this.on("ready", function() {
                    e.startFocusLoop()
                }), this.on("disconnect", function() {
                    e.stopFocusLoop()
                })
            };
        i.extend(r.prototype, o.prototype), r.__proto__ = o, r.prototype.useSecure = function() {
            return "https:" === location.protocol
        }, r.prototype.getScheme = function() {
            return this.useSecure() ? "wss:" : "ws:"
        }, r.prototype.getPort = function() {
            return this.useSecure() ? 6436 : 6437
        }, r.prototype.setupSocket = function() {
            var t = this,
                e = new WebSocket(this.getUrl());
            return e.onopen = function() {
                t.handleOpen()
            }, e.onclose = function(e) {
                t.handleClose(e.code, e.reason)
            }, e.onmessage = function(e) {
                t.handleData(e.data)
            }, e.onerror = function(e) {
                t.useSecure() && "wss:" === t.scheme && (t.scheme = "ws:", t.port = 6437, t.disconnect(), t.connect())
            }, e
        }, r.prototype.startFocusLoop = function() {
            if (!this.focusDetectorTimer) {
                var t = this,
                    e = null;
                e = void 0 !== document.hidden ? "hidden" : void 0 !== document.mozHidden ? "mozHidden" : void 0 !== document.msHidden ? "msHidden" : void 0 !== document.webkitHidden ? "webkitHidden" : void 0, void 0 === t.windowVisible && (t.windowVisible = void 0 === e || !1 === document[e]);
                var n = window.addEventListener("focus", function(e) {
                        t.windowVisible = !0, i()
                    }),
                    o = window.addEventListener("blur", function(e) {
                        t.windowVisible = !1, i()
                    });
                this.on("disconnect", function() {
                    window.removeEventListener("focus", n), window.removeEventListener("blur", o)
                });
                var i = function() {
                    var n = void 0 === e || !1 === document[e];
                    t.reportFocus(n && t.windowVisible)
                };
                i(), this.focusDetectorTimer = setInterval(i, 100)
            }
        }, r.prototype.stopFocusLoop = function() {
            this.focusDetectorTimer && (clearTimeout(this.focusDetectorTimer), delete this.focusDetectorTimer)
        }
    }, {
        46: 46,
        73: 73
    }],
    75: [function(t, e, n) {
        var o = t(47),
            i = t(73),
            r = t(46),
            a = e.exports = function(t) {
                i.call(this, t);
                var e = this;
                this.on("ready", function() {
                    e.reportFocus(!0)
                })
            };
        r.extend(a.prototype, i.prototype), a.__proto__ = i, a.prototype.setupSocket = function() {
            var t = this,
                e = new o(this.getUrl());
            return e.on("open", function() {
                t.handleOpen()
            }), e.on("message", function(e) {
                t.handleData(e)
            }), e.on("close", function(e, n) {
                t.handleClose(e, n)
            }), e.on("error", function() {
                t.startReconnection()
            }), e
        }
    }, {
        46: 46,
        47: 47,
        73: 73
    }],
    76: [function(t, e, n) {
        (function(n) {
            var o = t(79),
                i = t(81),
                r = t(85),
                a = t(78),
                s = t(72),
                u = t(84),
                l = t(5).EventEmitter,
                c = t(80).gestureListener,
                d = t(77),
                h = t(46),
                p = e.exports = function(e) {
                    var i = void 0 !== n && n.versions && n.versions.node,
                        r = this;
                    e = h.defaults(e || {}, {
                        inNode: i
                    }), this.inNode = e.inNode, e = h.defaults(e || {}, {
                        frameEventName: this.useAnimationLoop() ? "animationFrame" : "deviceFrame",
                        suppressAnimationLoop: !this.useAnimationLoop(),
                        loopWhileDisconnected: !0,
                        useAllPlugins: !1,
                        checkVersion: !0
                    }), this.animationFrameRequested = !1, this.onAnimationFrame = function(t) {
                        r.lastConnectionFrame.valid && r.emit("animationFrame", r.lastConnectionFrame), r.emit("frameEnd", t), r.loopWhileDisconnected && (!1 !== r.connection.focusedState || r.connection.opts.background) ? window.requestAnimationFrame(r.onAnimationFrame) : r.animationFrameRequested = !1
                    }, this.suppressAnimationLoop = e.suppressAnimationLoop, this.loopWhileDisconnected = e.loopWhileDisconnected, this.frameEventName = e.frameEventName, this.useAllPlugins = e.useAllPlugins, this.history = new s(200), this.lastFrame = o.Invalid, this.lastValidFrame = o.Invalid, this.lastConnectionFrame = o.Invalid, this.accumulatedGestures = [], this.checkVersion = e.checkVersion, void 0 === e.connectionType ? this.connectionType = t(this.inBrowser() ? 74 : 75) : this.connectionType = e.connectionType, this.connection = new this.connectionType(e), this.streamingCount = 0, this.devices = {}, this.plugins = {}, this._pluginPipelineSteps = {}, this._pluginExtendedMethods = {}, e.useAllPlugins && this.useRegisteredPlugins(), this.setupFrameEvents(e), this.setupConnectionEvents(), this.startAnimationLoop()
                };
            p.prototype.gesture = function(t, e) {
                var n = c(this, t);
                return void 0 !== e && n.stop(e), n
            }, p.prototype.setBackground = function(t) {
                return this.connection.setBackground(t), this
            }, p.prototype.setOptimizeHMD = function(t) {
                return this.connection.setOptimizeHMD(t), this
            }, p.prototype.inBrowser = function() {
                return !this.inNode
            }, p.prototype.useAnimationLoop = function() {
                return this.inBrowser() && !this.inBackgroundPage()
            }, p.prototype.inBackgroundPage = function() {
                return "undefined" != typeof chrome && chrome.extension && chrome.extension.getBackgroundPage && chrome.extension.getBackgroundPage() === window
            }, p.prototype.connect = function() {
                return this.connection.connect(), this
            }, p.prototype.streaming = function() {
                return this.streamingCount > 0
            }, p.prototype.connected = function() {
                return !!this.connection.connected
            }, p.prototype.startAnimationLoop = function() {
                this.suppressAnimationLoop || this.animationFrameRequested || (this.animationFrameRequested = !0, window.requestAnimationFrame(this.onAnimationFrame))
            }, p.prototype.disconnect = function() {
                return this.connection.disconnect(), this
            }, p.prototype.frame = function(t) {
                return this.history.get(t) || o.Invalid
            }, p.prototype.loop = function(t) {
                return t && ("function" == typeof t ? this.on(this.frameEventName, t) : this.setupFrameEvents(t)), this.connect()
            }, p.prototype.addStep = function(t) {
                this.pipeline || (this.pipeline = new u(this)), this.pipeline.addStep(t)
            }, p.prototype.processFrame = function(t) {
                t.gestures && (this.accumulatedGestures = this.accumulatedGestures.concat(t.gestures)), this.lastConnectionFrame = t, this.startAnimationLoop(), this.emit("deviceFrame", t)
            }, p.prototype.processFinishedFrame = function(t) {
                if (this.lastFrame = t, t.valid && (this.lastValidFrame = t), t.controller = this, t.historyIdx = this.history.push(t), t.gestures) {
                    t.gestures = this.accumulatedGestures, this.accumulatedGestures = [];
                    for (var e = 0; e != t.gestures.length; e++) this.emit("gesture", t.gestures[e], t)
                }
                this.pipeline && ((t = this.pipeline.run(t)) || (t = o.Invalid)), this.emit("frame", t), this.emitHandEvents(t)
            }, p.prototype.emitHandEvents = function(t) {
                for (var e = 0; e < t.hands.length; e++) this.emit("hand", t.hands[e])
            }, p.prototype.setupFrameEvents = function(t) {
                t.frame && this.on("frame", t.frame), t.hand && this.on("hand", t.hand)
            }, p.prototype.setupConnectionEvents = function() {
                var t = this;
                this.connection.on("frame", function(e) {
                    t.processFrame(e)
                }), this.on(this.frameEventName, function(e) {
                    t.processFinishedFrame(e)
                });
                var e = function() {
                        if (t.connection.opts.requestProtocolVersion < 5 && 0 == t.streamingCount) {
                            t.streamingCount = 1;
                            var n = {
                                attached: !0,
                                streaming: !0,
                                type: "unknown",
                                id: "Lx00000000000"
                            };
                            t.devices[n.id] = n, t.emit("deviceAttached", n), t.emit("deviceStreaming", n), t.emit("streamingStarted", n), t.connection.removeListener("frame", e)
                        }
                    },
                    n = function() {
                        if (t.streamingCount > 0) {
                            for (var e in t.devices) t.emit("deviceStopped", t.devices[e]), t.emit("deviceRemoved", t.devices[e]);
                            t.emit("streamingStopped", t.devices[e]), t.streamingCount = 0;
                            for (var e in t.devices) delete t.devices[e]
                        }
                    };
                this.connection.on("focus", function() {
                    t.loopWhileDisconnected && t.startAnimationLoop(), t.emit("focus")
                }), this.connection.on("blur", function() {
                    t.emit("blur")
                }), this.connection.on("protocol", function(e) {
                    e.on("beforeFrameCreated", function(e) {
                        t.emit("beforeFrameCreated", e)
                    }), e.on("afterFrameCreated", function(e, n) {
                        t.emit("afterFrameCreated", e, n)
                    }), t.emit("protocol", e)
                }), this.connection.on("ready", function() {
                    t.checkVersion && !t.inNode && t.checkOutOfDate(), t.emit("ready")
                }), this.connection.on("connect", function() {
                    t.emit("connect"), t.connection.removeListener("frame", e), t.connection.on("frame", e)
                }), this.connection.on("disconnect", function() {
                    t.emit("disconnect"), n()
                }), this.connection.on("deviceConnect", function(o) {
                    o.state ? (t.emit("deviceConnected"), t.connection.removeListener("frame", e), t.connection.on("frame", e)) : (t.emit("deviceDisconnected"), n())
                }), this.connection.on("deviceEvent", function(e) {
                    var n = e.state,
                        o = t.devices[n.id],
                        i = {};
                    for (var r in n) o && o.hasOwnProperty(r) && o[r] == n[r] || (i[r] = !0);
                    t.devices[n.id] = n, i.attached && t.emit(n.attached ? "deviceAttached" : "deviceRemoved", n), i.streaming && (n.streaming ? (t.streamingCount++, t.emit("deviceStreaming", n), 1 == t.streamingCount && t.emit("streamingStarted", n), i.attached || t.emit("deviceConnected")) : i.attached && n.attached || (t.streamingCount--, t.emit("deviceStopped", n), 0 == t.streamingCount && t.emit("streamingStopped", n), t.emit("deviceDisconnected")))
                }), this.on("newListener", function(t, e) {
                    "deviceConnected" != t && "deviceDisconnected" != t || console.warn(t + " events are depricated.  Consider using 'streamingStarted/streamingStopped' or 'deviceStreaming/deviceStopped' instead")
                })
            }, p.prototype.checkOutOfDate = function() {
                console.assert(this.connection && this.connection.protocol);
                var t = this.connection.protocol.serviceVersion,
                    e = this.connection.protocol.version,
                    n = this.connectionType.defaultProtocolVersion;
                return n > e && (console.warn("Your Protocol Version is v" + e + ", this app was designed for v" + n), d.warnOutOfDate({
                    sV: t,
                    pV: e
                }), !0)
            }, p._pluginFactories = {}, p.plugin = function(t, e) {
                return this._pluginFactories[t] && console.warn('Plugin "' + t + '" already registered'), this._pluginFactories[t] = e
            }, p.plugins = function() {
                return h.keys(this._pluginFactories)
            };
            var f = function(t, e, n) {
                    -1 != ["beforeFrameCreated", "afterFrameCreated"].indexOf(e) ? this.on(e, n) : (this.pipeline || (this.pipeline = new u(this)), this._pluginPipelineSteps[t] || (this._pluginPipelineSteps[t] = []), this._pluginPipelineSteps[t].push(this.pipeline.addWrappedStep(e, n)))
                },
                m = function(t, e, n) {
                    var s;
                    switch (this._pluginExtendedMethods[t] || (this._pluginExtendedMethods[t] = []), e) {
                        case "frame":
                            s = o;
                            break;
                        case "hand":
                            s = i;
                            break;
                        case "pointable":
                            s = r, h.extend(a.prototype, n), h.extend(a.Invalid, n);
                            break;
                        case "finger":
                            s = a;
                            break;
                        default:
                            throw t + ' specifies invalid object type "' + e + '" for prototypical extension'
                    }
                    h.extend(s.prototype, n), h.extend(s.Invalid, n), this._pluginExtendedMethods[t].push([s, n])
                };
            p.prototype.use = function(t, e) {
                var n, o, i, r;
                if (!(o = "function" == typeof t ? t : p._pluginFactories[t])) throw "Leap Plugin " + t + " not found.";
                if (e || (e = {}), this.plugins[t]) return h.extend(this.plugins[t], e), this;
                this.plugins[t] = e, r = o.call(this, e);
                for (i in r) n = r[i], "function" == typeof n ? f.call(this, t, i, n) : m.call(this, t, i, n);
                return this
            }, p.prototype.stopUsing = function(t) {
                var e, n, o = this._pluginPipelineSteps[t],
                    i = this._pluginExtendedMethods[t],
                    r = 0;
                if (this.plugins[t]) {
                    if (o)
                        for (r = 0; r < o.length; r++) this.pipeline.removeStep(o[r]);
                    if (i)
                        for (r = 0; r < i.length; r++) {
                            e = i[r][0], n = i[r][1];
                            for (var a in n) delete e.prototype[a], delete e.Invalid[a]
                        }
                    return delete this.plugins[t], this
                }
            }, p.prototype.useRegisteredPlugins = function() {
                for (var t in p._pluginFactories) this.use(t)
            }, h.extend(p.prototype, l.prototype)
        }).call(this, t(39))
    }, {
        39: 39,
        46: 46,
        5: 5,
        72: 72,
        74: 74,
        75: 75,
        77: 77,
        78: 78,
        79: 79,
        80: 80,
        81: 81,
        84: 84,
        85: 85
    }],
    77: [function(t, e, n) {
        (function(t) {
            var n = e.exports = function(t, e) {
                this.options = e || {}, this.message = t, this.createElement()
            };
            n.prototype.createElement = function() {
                this.element = document.createElement("div"), this.element.className = "leapjs-dialog", this.element.style.position = "fixed", this.element.style.top = "8px", this.element.style.left = 0, this.element.style.right = 0, this.element.style.textAlign = "center", this.element.style.zIndex = 1e3;
                var t = document.createElement("div");
                this.element.appendChild(t), t.style.className = "leapjs-dialog", t.style.display = "inline-block", t.style.margin = "auto", t.style.padding = "8px", t.style.color = "#222", t.style.background = "#eee", t.style.borderRadius = "4px", t.style.border = "1px solid #999", t.style.textAlign = "left", t.style.cursor = "pointer", t.style.whiteSpace = "nowrap", t.style.transition = "box-shadow 1s linear", t.innerHTML = this.message, this.options.onclick && t.addEventListener("click", this.options.onclick), this.options.onmouseover && t.addEventListener("mouseover", this.options.onmouseover), this.options.onmouseout && t.addEventListener("mouseout", this.options.onmouseout), this.options.onmousemove && t.addEventListener("mousemove", this.options.onmousemove)
            }, n.prototype.show = function() {
                return document.body.appendChild(this.element), this
            }, n.prototype.hide = function() {
                return document.body.removeChild(this.element), this
            }, n.warnOutOfDate = function(t) {
                t || (t = {});
                var e = "http://developer.leapmotion.com?";
                t.returnTo = window.location.href;
                for (var o in t) e += o + "=" + encodeURIComponent(t[o]) + "&";
                var i;
                return i = new n("This site requires Leap Motion Tracking V2.<button id='leapjs-accept-upgrade'  style='color: #444; transition: box-shadow 100ms linear; cursor: pointer; vertical-align: baseline; margin-left: 16px;'>Upgrade</button><button id='leapjs-decline-upgrade' style='color: #444; transition: box-shadow 100ms linear; cursor: pointer; vertical-align: baseline; margin-left: 8px; '>Not Now</button>", {
                    onclick: function(t) {
                        if ("leapjs-decline-upgrade" != t.target.id) {
                            var n = window.open(e, "_blank", "height=800,width=1000,location=1,menubar=1,resizable=1,status=1,toolbar=1,scrollbars=1");
                            window.focus && n.focus()
                        }
                        return i.hide(), !0
                    },
                    onmousemove: function(t) {
                        t.target == document.getElementById("leapjs-decline-upgrade") ? (document.getElementById("leapjs-decline-upgrade").style.color = "#000", document.getElementById("leapjs-decline-upgrade").style.boxShadow = "0px 0px 2px #5daa00", document.getElementById("leapjs-accept-upgrade").style.color = "#444", document.getElementById("leapjs-accept-upgrade").style.boxShadow = "none") : (document.getElementById("leapjs-accept-upgrade").style.color = "#000", document.getElementById("leapjs-accept-upgrade").style.boxShadow = "0px 0px 2px #5daa00", document.getElementById("leapjs-decline-upgrade").style.color = "#444", document.getElementById("leapjs-decline-upgrade").style.boxShadow = "none")
                    },
                    onmouseout: function() {
                        document.getElementById("leapjs-decline-upgrade").style.color = "#444", document.getElementById("leapjs-decline-upgrade").style.boxShadow = "none", document.getElementById("leapjs-accept-upgrade").style.color = "#444", document.getElementById("leapjs-accept-upgrade").style.boxShadow = "none"
                    }
                }), i.show()
            }, n.hasWarnedBones = !1, n.warnBones = function() {
                this.hasWarnedBones || (this.hasWarnedBones = !0, console.warn("Your Leap Service is out of date"), void 0 !== t && t.versions && t.versions.node || this.warnOutOfDate({
                    reason: "bones"
                }))
            }
        }).call(this, t(39))
    }, {
        39: 39
    }],
    78: [function(t, e, n) {
        var o = t(85),
            i = t(71),
            r = t(77),
            a = t(46),
            s = e.exports = function(t) {
                o.call(this, t), this.dipPosition = t.dipPosition, this.pipPosition = t.pipPosition, this.mcpPosition = t.mcpPosition, this.carpPosition = t.carpPosition, this.extended = t.extended, this.type = t.type, this.finger = !0, this.positions = [this.carpPosition, this.mcpPosition, this.pipPosition, this.dipPosition, this.tipPosition], t.bases ? this.addBones(t) : r.warnBones()
            };
        a.extend(s.prototype, o.prototype), s.prototype.addBones = function(t) {
            this.metacarpal = new i(this, {
                type: 0,
                width: this.width,
                prevJoint: this.carpPosition,
                nextJoint: this.mcpPosition,
                basis: t.bases[0]
            }), this.proximal = new i(this, {
                type: 1,
                width: this.width,
                prevJoint: this.mcpPosition,
                nextJoint: this.pipPosition,
                basis: t.bases[1]
            }), this.medial = new i(this, {
                type: 2,
                width: this.width,
                prevJoint: this.pipPosition,
                nextJoint: this.dipPosition,
                basis: t.bases[2]
            }), this.distal = new i(this, {
                type: 3,
                width: this.width,
                prevJoint: this.dipPosition,
                nextJoint: t.btipPosition,
                basis: t.bases[3]
            }), this.bones = [this.metacarpal, this.proximal, this.medial, this.distal]
        }, s.prototype.toString = function() {
            return "Finger [ id:" + this.id + " " + this.length + "mmx | width:" + this.width + "mm | direction:" + this.direction + " ]"
        }, s.Invalid = {
            valid: !1
        }
    }, {
        46: 46,
        71: 71,
        77: 77,
        85: 85
    }],
    79: [function(t, e, n) {
        var o = t(81),
            i = t(85),
            r = t(80).createGesture,
            a = t(6),
            s = a.mat3,
            u = a.vec3,
            l = t(83),
            c = t(78),
            d = t(46),
            h = e.exports = function(t) {
                if (this.valid = !0, this.id = t.id, this.timestamp = t.timestamp, this.hands = [], this.handsMap = {}, this.pointables = [], this.tools = [], this.fingers = [], t.interactionBox && (this.interactionBox = new l(t.interactionBox)), this.gestures = [], this.pointablesMap = {}, this._translation = t.t, this._rotation = d.flatten(t.r), this._scaleFactor = t.s, this.data = t, this.type = "frame", this.currentFrameRate = t.currentFrameRate, t.gestures)
                    for (var e = 0, n = t.gestures.length; e != n; e++) this.gestures.push(r(t.gestures[e]));
                this.postprocessData(t)
            };
        h.prototype.postprocessData = function(t) {
            t || (t = this.data);
            for (var e = 0, n = t.hands.length; e != n; e++) {
                var r = new o(t.hands[e]);
                r.frame = this, this.hands.push(r), this.handsMap[r.id] = r
            }
            t.pointables = d.sortBy(t.pointables, function(t) {
                return t.id
            });
            for (var a = 0, s = t.pointables.length; a != s; a++) {
                var u = t.pointables[a],
                    l = u.dipPosition ? new c(u) : new i(u);
                l.frame = this, this.addPointable(l)
            }
        }, h.prototype.addPointable = function(t) {
            if (this.pointables.push(t), this.pointablesMap[t.id] = t, (t.tool ? this.tools : this.fingers).push(t), void 0 !== t.handId && this.handsMap.hasOwnProperty(t.handId)) {
                var e = this.handsMap[t.handId];
                switch (e.pointables.push(t), (t.tool ? e.tools : e.fingers).push(t), t.type) {
                    case 0:
                        e.thumb = t;
                        break;
                    case 1:
                        e.indexFinger = t;
                        break;
                    case 2:
                        e.middleFinger = t;
                        break;
                    case 3:
                        e.ringFinger = t;
                        break;
                    case 4:
                        e.pinky = t
                }
            }
        }, h.prototype.tool = function(t) {
            var e = this.pointable(t);
            return e.tool ? e : i.Invalid
        }, h.prototype.pointable = function(t) {
            return this.pointablesMap[t] || i.Invalid
        }, h.prototype.finger = function(t) {
            var e = this.pointable(t);
            return e.tool ? i.Invalid : e
        }, h.prototype.hand = function(t) {
            return this.handsMap[t] || o.Invalid
        }, h.prototype.rotationAngle = function(t, e) {
            if (!this.valid || !t.valid) return 0;
            var n = this.rotationMatrix(t),
                o = .5 * (n[0] + n[4] + n[8] - 1),
                i = Math.acos(o);
            if (i = isNaN(i) ? 0 : i, void 0 !== e) {
                var r = this.rotationAxis(t);
                i *= u.dot(r, u.normalize(u.create(), e))
            }
            return i
        }, h.prototype.rotationAxis = function(t) {
            return this.valid && t.valid ? u.normalize(u.create(), [this._rotation[7] - t._rotation[5], this._rotation[2] - t._rotation[6], this._rotation[3] - t._rotation[1]]) : u.create()
        }, h.prototype.rotationMatrix = function(t) {
            if (!this.valid || !t.valid) return s.create();
            var e = s.transpose(s.create(), this._rotation);
            return s.multiply(s.create(), t._rotation, e)
        }, h.prototype.scaleFactor = function(t) {
            return this.valid && t.valid ? Math.exp(this._scaleFactor - t._scaleFactor) : 1
        }, h.prototype.translation = function(t) {
            return this.valid && t.valid ? u.subtract(u.create(), this._translation, t._translation) : u.create()
        }, h.prototype.toString = function() {
            var t = "Frame [ id:" + this.id + " | timestamp:" + this.timestamp + " | Hand count:(" + this.hands.length + ") | Pointable count:(" + this.pointables.length + ")";
            return this.gestures && (t += " | Gesture count:(" + this.gestures.length + ")"), t += " ]"
        }, h.prototype.dump = function() {
            var t = "";
            t += "Frame Info:<br/>", t += this.toString(), t += "<br/><br/>Hands:<br/>";
            for (var e = 0, n = this.hands.length; e != n; e++) t += "  " + this.hands[e].toString() + "<br/>";
            t += "<br/><br/>Pointables:<br/>";
            for (var o = 0, i = this.pointables.length; o != i; o++) t += "  " + this.pointables[o].toString() + "<br/>";
            if (this.gestures) {
                t += "<br/><br/>Gestures:<br/>";
                for (var r = 0, a = this.gestures.length; r != a; r++) t += "  " + this.gestures[r].toString() + "<br/>"
            }
            return t += "<br/><br/>Raw JSON:<br/>", t += JSON.stringify(this.data)
        }, h.Invalid = {
            valid: !1,
            hands: [],
            fingers: [],
            tools: [],
            gestures: [],
            pointables: [],
            pointable: function() {
                return i.Invalid
            },
            finger: function() {
                return i.Invalid
            },
            hand: function() {
                return o.Invalid
            },
            toString: function() {
                return "invalid frame"
            },
            dump: function() {
                return this.toString()
            },
            rotationAngle: function() {
                return 0
            },
            rotationMatrix: function() {
                return s.create()
            },
            rotationAxis: function() {
                return u.create()
            },
            scaleFactor: function() {
                return 1
            },
            translation: function() {
                return u.create()
            }
        }
    }, {
        46: 46,
        6: 6,
        78: 78,
        80: 80,
        81: 81,
        83: 83,
        85: 85
    }],
    80: [function(t, e, n) {
        var o = t(6),
            i = o.vec3,
            r = t(5).EventEmitter,
            a = t(46),
            s = (n.createGesture = function(t) {
                var e;
                switch (t.type) {
                    case "circle":
                        e = new u(t);
                        break;
                    case "swipe":
                        e = new l(t);
                        break;
                    case "screenTap":
                        e = new c(t);
                        break;
                    case "keyTap":
                        e = new d(t);
                        break;
                    default:
                        throw "unknown gesture type"
                }
                return e.id = t.id, e.handIds = t.handIds.slice(), e.pointableIds = t.pointableIds.slice(), e.duration = t.duration, e.state = t.state, e.type = t.type, e
            }, n.gestureListener = function(t, e) {
                var n = {},
                    o = {};
                t.on("gesture", function(t, i) {
                    if (t.type == e) {
                        if (("start" == t.state || "stop" == t.state) && void 0 === o[t.id]) {
                            var r = new s(t, i);
                            o[t.id] = r, a.each(n, function(t, e) {
                                r.on(e, t)
                            })
                        }
                        o[t.id].update(t, i), "stop" == t.state && delete o[t.id]
                    }
                });
                var i = {
                    start: function(t) {
                        return n.start = t, i
                    },
                    stop: function(t) {
                        return n.stop = t, i
                    },
                    complete: function(t) {
                        return n.stop = t, i
                    },
                    update: function(t) {
                        return n.update = t, i
                    }
                };
                return i
            }, n.Gesture = function(t, e) {
                this.gestures = [t], this.frames = [e]
            });
        s.prototype.update = function(t, e) {
            this.lastGesture = t, this.lastFrame = e, this.gestures.push(t), this.frames.push(e), this.emit(t.state, this)
        }, s.prototype.translation = function() {
            return i.subtract(i.create(), this.lastGesture.startPosition, this.lastGesture.position)
        }, a.extend(s.prototype, r.prototype);
        var u = function(t) {
            this.center = t.center, this.normal = t.normal, this.progress = t.progress, this.radius = t.radius
        };
        u.prototype.toString = function() {
            return "CircleGesture [" + JSON.stringify(this) + "]"
        };
        var l = function(t) {
            this.startPosition = t.startPosition, this.position = t.position, this.direction = t.direction, this.speed = t.speed
        };
        l.prototype.toString = function() {
            return "SwipeGesture [" + JSON.stringify(this) + "]"
        };
        var c = function(t) {
            this.position = t.position, this.direction = t.direction, this.progress = t.progress
        };
        c.prototype.toString = function() {
            return "ScreenTapGesture [" + JSON.stringify(this) + "]"
        };
        var d = function(t) {
            this.position = t.position, this.direction = t.direction, this.progress = t.progress
        };
        d.prototype.toString = function() {
            return "KeyTapGesture [" + JSON.stringify(this) + "]"
        }
    }, {
        46: 46,
        5: 5,
        6: 6
    }],
    81: [function(t, e, n) {
        var o = t(85),
            i = t(71),
            r = t(6),
            a = r.mat3,
            s = r.vec3,
            u = t(46),
            l = e.exports = function(t) {
                this.id = t.id, this.palmPosition = t.palmPosition, this.direction = t.direction, this.palmVelocity = t.palmVelocity, this.palmNormal = t.palmNormal, this.sphereCenter = t.sphereCenter, this.sphereRadius = t.sphereRadius, this.valid = !0, this.pointables = [], this.fingers = [], t.armBasis ? this.arm = new i(this, {
                    type: 4,
                    width: t.armWidth,
                    prevJoint: t.elbow,
                    nextJoint: t.wrist,
                    basis: t.armBasis
                }) : this.arm = null, this.tools = [], this._translation = t.t, this._rotation = u.flatten(t.r), this._scaleFactor = t.s, this.timeVisible = t.timeVisible, this.stabilizedPalmPosition = t.stabilizedPalmPosition, this.type = t.type, this.grabStrength = t.grabStrength, this.pinchStrength = t.pinchStrength, this.confidence = t.confidence
            };
        l.prototype.finger = function(t) {
            var e = this.frame.finger(t);
            return e && e.handId == this.id ? e : o.Invalid
        }, l.prototype.rotationAngle = function(t, e) {
            if (!this.valid || !t.valid) return 0;
            if (!t.hand(this.id).valid) return 0;
            var n = this.rotationMatrix(t),
                o = .5 * (n[0] + n[4] + n[8] - 1),
                i = Math.acos(o);
            if (i = isNaN(i) ? 0 : i, void 0 !== e) {
                var r = this.rotationAxis(t);
                i *= s.dot(r, s.normalize(s.create(), e))
            }
            return i
        }, l.prototype.rotationAxis = function(t) {
            if (!this.valid || !t.valid) return s.create();
            var e = t.hand(this.id);
            return e.valid ? s.normalize(s.create(), [this._rotation[7] - e._rotation[5], this._rotation[2] - e._rotation[6], this._rotation[3] - e._rotation[1]]) : s.create()
        }, l.prototype.rotationMatrix = function(t) {
            if (!this.valid || !t.valid) return a.create();
            var e = t.hand(this.id);
            if (!e.valid) return a.create();
            var n = a.transpose(a.create(), this._rotation);
            return a.multiply(a.create(), e._rotation, n)
        }, l.prototype.scaleFactor = function(t) {
            if (!this.valid || !t.valid) return 1;
            var e = t.hand(this.id);
            return e.valid ? Math.exp(this._scaleFactor - e._scaleFactor) : 1
        }, l.prototype.translation = function(t) {
            if (!this.valid || !t.valid) return s.create();
            var e = t.hand(this.id);
            return e.valid ? [this._translation[0] - e._translation[0], this._translation[1] - e._translation[1], this._translation[2] - e._translation[2]] : s.create()
        }, l.prototype.toString = function() {
            return "Hand (" + this.type + ") [ id: " + this.id + " | palm velocity:" + this.palmVelocity + " | sphere center:" + this.sphereCenter + " ] "
        }, l.prototype.pitch = function() {
            return Math.atan2(this.direction[1], -this.direction[2])
        }, l.prototype.yaw = function() {
            return Math.atan2(this.direction[0], -this.direction[2])
        }, l.prototype.roll = function() {
            return Math.atan2(this.palmNormal[0], -this.palmNormal[1])
        }, l.Invalid = {
            valid: !1,
            fingers: [],
            tools: [],
            pointables: [],
            left: !1,
            pointable: function() {
                return o.Invalid
            },
            finger: function() {
                return o.Invalid
            },
            toString: function() {
                return "invalid frame"
            },
            dump: function() {
                return this.toString()
            },
            rotationAngle: function() {
                return 0
            },
            rotationMatrix: function() {
                return a.create()
            },
            rotationAxis: function() {
                return s.create()
            },
            scaleFactor: function() {
                return 1
            },
            translation: function() {
                return s.create()
            }
        }
    }, {
        46: 46,
        6: 6,
        71: 71,
        85: 85
    }],
    82: [function(t, e, n) {
        e.exports = {
            Controller: t(76),
            Frame: t(79),
            Gesture: t(80),
            Hand: t(81),
            Pointable: t(85),
            Finger: t(78),
            InteractionBox: t(83),
            CircularBuffer: t(72),
            UI: t(87),
            JSONProtocol: t(86).JSONProtocol,
            glMatrix: t(6),
            mat3: t(6).mat3,
            vec3: t(6).vec3,
            loopController: void 0,
            version: t(90),
            _: t(46),
            EventEmitter: t(5).EventEmitter,
            loop: function(t, e) {
                return t && void 0 === e && "[object Function]" === {}.toString.call(t) && (e = t, t = {}), this.loopController ? t && this.loopController.setupFrameEvents(t) : this.loopController = new this.Controller(t), this.loopController.loop(e), this.loopController
            },
            plugin: function(t, e) {
                this.Controller.plugin(t, e)
            }
        }
    }, {
        46: 46,
        5: 5,
        6: 6,
        72: 72,
        76: 76,
        78: 78,
        79: 79,
        80: 80,
        81: 81,
        83: 83,
        85: 85,
        86: 86,
        87: 87,
        90: 90
    }],
    83: [function(t, e, n) {
        var o = t(6),
            i = o.vec3,
            r = e.exports = function(t) {
                this.valid = !0, this.center = t.center, this.size = t.size, this.width = t.size[0], this.height = t.size[1], this.depth = t.size[2]
            };
        r.prototype.denormalizePoint = function(t) {
            return i.fromValues((t[0] - .5) * this.size[0] + this.center[0], (t[1] - .5) * this.size[1] + this.center[1], (t[2] - .5) * this.size[2] + this.center[2])
        }, r.prototype.normalizePoint = function(t, e) {
            var n = i.fromValues((t[0] - this.center[0]) / this.size[0] + .5, (t[1] - this.center[1]) / this.size[1] + .5, (t[2] - this.center[2]) / this.size[2] + .5);
            return e && (n[0] = Math.min(Math.max(n[0], 0), 1), n[1] = Math.min(Math.max(n[1], 0), 1), n[2] = Math.min(Math.max(n[2], 0), 1)), n
        }, r.prototype.toString = function() {
            return "InteractionBox [ width:" + this.width + " | height:" + this.height + " | depth:" + this.depth + " ]"
        }, r.Invalid = {
            valid: !1
        }
    }, {
        6: 6
    }],
    84: [function(t, e, n) {
        var o = e.exports = function(t) {
            this.steps = [], this.controller = t
        };
        o.prototype.addStep = function(t) {
            this.steps.push(t)
        }, o.prototype.run = function(t) {
            for (var e = this.steps.length, n = 0; n != e && t; n++) t = this.steps[n](t);
            return t
        }, o.prototype.removeStep = function(t) {
            var e = this.steps.indexOf(t);
            if (-1 === e) throw "Step not found in pipeline";
            this.steps.splice(e, 1)
        }, o.prototype.addWrappedStep = function(t, e) {
            var n = this.controller,
                o = function(o) {
                    var i, r, a;
                    for (i = "frame" == t ? [o] : o[t + "s"] || [], r = 0, a = i.length; r < a; r++) e.call(n, i[r]);
                    return o
                };
            return this.addStep(o), o
        }
    }, {}],
    85: [function(t, e, n) {
        var o = t(6),
            i = (o.vec3, e.exports = function(t) {
                this.valid = !0, this.id = t.id, this.handId = t.handId, this.length = t.length, this.tool = t.tool, this.width = t.width, this.direction = t.direction, this.stabilizedTipPosition = t.stabilizedTipPosition, this.tipPosition = t.tipPosition, this.tipVelocity = t.tipVelocity, this.touchZone = t.touchZone, this.touchDistance = t.touchDistance, this.timeVisible = t.timeVisible
            });
        i.prototype.toString = function() {
            return "Pointable [ id:" + this.id + " " + this.length + "mmx | width:" + this.width + "mm | direction:" + this.direction + " ]"
        }, i.prototype.hand = function() {
            return this.frame.hand(this.handId)
        }, i.Invalid = {
            valid: !1
        }
    }, {
        6: 6
    }],
    86: [function(t, e, n) {
        var o = t(79),
            i = (t(81), t(85), t(78), t(46)),
            r = t(5).EventEmitter,
            a = function(t) {
                this.type = t.type, this.state = t.state
            };
        n.chooseProtocol = function(t) {
            var e;
            switch (t.version) {
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                    e = s(t), e.sendBackground = function(t, n) {
                        t.send(e.encode({
                            background: n
                        }))
                    }, e.sendFocused = function(t, n) {
                        t.send(e.encode({
                            focused: n
                        }))
                    }, e.sendOptimizeHMD = function(t, n) {
                        t.send(e.encode({
                            optimizeHMD: n
                        }))
                    };
                    break;
                default:
                    throw "unrecognized version"
            }
            return e
        };
        var s = n.JSONProtocol = function(t) {
            var e = function(t) {
                if (t.event) return new a(t.event);
                e.emit("beforeFrameCreated", t);
                var n = new o(t);
                return e.emit("afterFrameCreated", n, t), n
            };
            return e.encode = function(t) {
                return JSON.stringify(t)
            }, e.version = t.version, e.serviceVersion = t.serviceVersion, e.versionLong = "Version " + t.version, e.type = "protocol", i.extend(e, r.prototype), e
        }
    }, {
        46: 46,
        5: 5,
        78: 78,
        79: 79,
        81: 81,
        85: 85
    }],
    87: [function(t, e, n) {
        n.UI = {
            Region: t(89),
            Cursor: t(88)
        }
    }, {
        88: 88,
        89: 89
    }],
    88: [function(t, e, n) {
        e.exports = function() {
            return function(t) {
                var e = t.pointables.sort(function(t, e) {
                    return t.z - e.z
                })[0];
                return e && e.valid && (t.cursorPosition = e.tipPosition), t
            }
        }
    }, {}],
    89: [function(t, e, n) {
        var o = t(5).EventEmitter,
            i = t(46),
            r = e.exports = function(t, e) {
                this.start = new Vector(t), this.end = new Vector(e), this.enteredFrame = null
            };
        r.prototype.hasPointables = function(t) {
            for (var e = 0; e != t.pointables.length; e++) {
                var n = t.pointables[e].tipPosition;
                if (n.x >= this.start.x && n.x <= this.end.x && n.y >= this.start.y && n.y <= this.end.y && n.z >= this.start.z && n.z <= this.end.z) return !0
            }
            return !1
        }, r.prototype.listener = function(t) {
            var e = this;
            return t && t.nearThreshold && this.setupNearRegion(t.nearThreshold),
                function(t) {
                    return e.updatePosition(t)
                }
        }, r.prototype.clipper = function() {
            var t = this;
            return function(e) {
                return t.updatePosition(e), t.enteredFrame ? e : null
            }
        }, r.prototype.setupNearRegion = function(t) {
            var e = this.nearRegion = new r([this.start.x - t, this.start.y - t, this.start.z - t], [this.end.x + t, this.end.y + t, this.end.z + t]),
                n = this;
            e.on("enter", function(t) {
                n.emit("near", t)
            }), e.on("exit", function(t) {
                n.emit("far", t)
            }), n.on("exit", function(t) {
                n.emit("near", t)
            })
        }, r.prototype.updatePosition = function(t) {
            return this.nearRegion && this.nearRegion.updatePosition(t), this.hasPointables(t) && null == this.enteredFrame ? (this.enteredFrame = t, this.emit("enter", this.enteredFrame)) : this.hasPointables(t) || null == this.enteredFrame || (this.enteredFrame = null, this.emit("exit", this.enteredFrame)), t
        }, r.prototype.normalize = function(t) {
            return new Vector([(t.x - this.start.x) / (this.end.x - this.start.x), (t.y - this.start.y) / (this.end.y - this.start.y), (t.z - this.start.z) / (this.end.z - this.start.z)])
        }, r.prototype.mapToXY = function(t, e, n) {
            var o = this.normalize(t),
                i = o.x,
                r = o.y;
            return i > 1 ? i = 1 : i < -1 && (i = -1), r > 1 ? r = 1 : r < -1 && (r = -1), [(i + 1) / 2 * e, (1 - r) / 2 * n, o.z]
        }, i.extend(r.prototype, o.prototype)
    }, {
        46: 46,
        5: 5
    }],
    90: [function(t, e, n) {
        e.exports = {
            full: "0.6.4",
            major: 0,
            minor: 6,
            dot: 4
        }
    }, {}],
    91: [function(t, e, n) {
        function o(t, e, n, o, i) {
            return (t - e) * (i - o) / (n - e) + o
        }

        function i(t, e, n) {
            return t < e ? e : t > n ? n : t
        }

        function r(t, e, n) {
            return (t !== c || e !== d || n !== h) && (c = t, d = e, h = n, !0)
        }

        function a() {
            document.getElementById("pause-text").innerHTML = l ? "Press Space to <strong>Start</strong>" : "Press Space to <strong>Stop</strong>"
        }

        function s(t) {
            l || (z_limit = Number(u.uarm_z_limit.toFixed(1)), positions = t.palmPosition, _x = o(i(positions[0], -150, 150), -150, 150, -300, 300), _y = o(i(positions[2], -150, 150), -150, 150, 350, 150), _z = o(i(positions[1], 100, 400), 100, 400, z_limit, 250), x = Number(_x.toFixed(1)), y = Number(_y.toFixed(1)), z = Number(_z.toFixed(1)), window.UArm.socket_info.socket_connected && window.UArm.uarm_info.uarm_connected && r(x, y, z) && window.UArm.set_position({
                x: y,
                y: -x,
                z: z,
                wait: !1,
                speed: u.uarm_speed * 20,
                cmd: 'G1',
                timeout: 0.3,
                page: 'LeapMotion',
            }), !p && t.grabStrength > .8 ? (p = !0, window.UArm.set_pump({
                ON: !0,
                wait: !1
            }), window.UArm.set_gripper({
                ON: !0,
                wait: !1
            })) : p && t.grabStrength <= .8 && (p = !1, window.UArm.set_pump({
                ON: !1,
                wait: !1
            }), window.UArm.set_gripper({
                ON: !1,
                wait: !1
            }))), a()
        }
        var u = t(69);
        n.control_uarm = s;
        var l = !0;
        document.getElementById("pause-text").innerHTML = "Press Space to <strong>Start</strong>", window.onkeypress = function(t) {
            console.log("on key press = " + event.keyCode), 32 == t.charCode && (l = 0 == l), a(), console.log(l)
        };
        var c = 0,
            d = 0,
            h = 0,
            p = !1
    }, {
        69: 69
    }]
}, {}, [51]);
