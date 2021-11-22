var aidnlib, three, index, __extends = this && this.__extends || function () {
    var n = Object.setPrototypeOf || {__proto__: []} instanceof Array && function (t, e) {
        t.__proto__ = e
    } || function (t, e) {
        for (var i in e) e.hasOwnProperty (i) && (t[i] = e[i])
    };
    return function (t, e) {
        function i () {
            this.constructor = t
        }

        n (t, e), t.prototype = null === e ? Object.create (e) : (i.prototype = e.prototype, new i)
    }
} ();
!function (t) {
    var r = (e.get = function (t) {
        return this._data[t]
    }, e.add = function (t, e) {
        this._data[t] = e
    }, e._data = {}, e);

    function e () {
    }

    t.Assets = r;
    var n = function () {
    };
    t.Ref = n;
    var i = (o.prototype.initialize = function (t) {
        void 0 === t && (t = null), n.stw = aidn.window.width (), n.sth = aidn.window.height (), t && 0 == t.isFit && (this._isFit = !1), aidn.util.needExpandArea (!0), aidn.window.addDummyDiv ()
    }, o.prototype._start = function () {
        var t = this;
        n.time = Date.now () / 1e3, aidn.window.resize (function () {
            return t._resize ()
        }, this._isFit), this._resize (), this._update ()
    }, o.prototype.addUpdate = function (t, e) {
        t.__key || (t.__key = "key_" + this.__keyCount, this.__keyCount++), this.__updates[t.__key] = e
    }, o.prototype.removeUpdate = function (t) {
        t.__key && delete this.__updates[t.__key]
    }, o.prototype.addResize = function (t, e) {
        t.__key2 || (t.__key2 = "key_" + this.__keyCount, this.__keyCount++), this.__resizes[t.__key2] = e
    }, o.prototype.removeResize = function (t) {
        t.__key2 && delete this.__resizes[t.__key2]
    }, o.prototype._update = function () {
        var t, e = Date.now () / 1e3;
        for (t in n.delta = e - n.time, n.time = e, this.__updates) this.__updates[t] ()
    }, o.prototype._resize = function () {
        for (var t in n.stw = aidn.window.width (), n.sth = aidn.window.height (), this.__resizes) this.__resizes[t] ()
    }, o);

    function o () {
        this.__keyCount = 0, this.__updates = {}, this.__resizes = {}, this._isFit = !0
    }

    t.MainBase = i;
    var s = (a.prototype.start = function () {
        var e = this;
        aidn.util.checkMobile () ? (window.addEventListener ("deviceorientation", function (t) {
            return e._deviceorientation (t)
        }), window.addEventListener ("orientationchange", function (t) {
            return e._orientationchange (t)
        }, !1), this._orientationchange (), this._timeoutId = setTimeout (function () {
            return e._failedDeviceOrientation ()
        }, 2e3), this._isAndroid = aidn.util.checkAndroid ()) : ($ ("body").on ("mousemove", function (t) {
            return e._mouseMove (t)
        }), this._update ())
    }, a.prototype.addUpdate = function (t, e) {
        t.__keyx || (t.__keyx = "keyx_" + this.__keyCount, this.__keyCount++), this.__updates[t.__keyx] = e
    }, a.prototype.removeUpdate = function (t) {
        t.__keyx && delete this.__updates[t.__keyx]
    }, a.prototype._updateRate = function (t, e) {
        for (var i in this.__updates) this.__updates[i] (t, e)
    }, a.prototype._mouseMove = function (t) {
        var e = n.stw / 2, i = n.sth / 2, t = aidn.event.getPos (t);
        this._dx = (t.x - e) / e, this._dy = (t.y - i) / i
    }, a.prototype._update = function () {
        var t = this;
        this._rx += (this._dx - this._rx) / 5, this._ry += (this._dy - this._ry) / 5, this._updateRate (this._rx, this._ry), window.requestAnimationFrame (function () {
            return t._update ()
        })
    }, a.prototype._deviceorientation = function (t) {
        var e = t.gamma, i = t.beta;
        null != this._timeoutId && (clearTimeout (this._timeoutId), this._timeoutId = null), 0 != this._ori && (t = i, i = e, e = t, 90 == this._ori && (i = -i), -90 == this._ori && (e = -e));
        e /= 35, e = Math.max (e, -1);
        e = Math.min (e, 1);
        i /= 35, i = Math.max (i, -1);
        i = Math.min (i, 1), this._updateRate (e, i)
    }, a.prototype._devicemotion = function (t) {
        var e = t.accelerationIncludingGravity || t.acceleration;
        this._ax < -100 ? (this._ax = e.x, this._ay = e.y) : (this._ax += (e.x - this._ax) / 3, this._ay += (e.y - this._ay) / 3);
        var i = Math.floor (10 * this._ax) / 10, t = -Math.floor (10 * this._ay) / 10;
        this._isAndroid && (i = -i, t = -t), 0 != this._ori && (e = t, t = i, i = e, 90 == this._ori && (t = -t), -90 == this._ori && (i = -i));
        i /= 5, i = Math.max (i, -1);
        i = Math.min (i, 1);
        t /= 5, t = Math.max (t, -1);
        t = Math.min (t, 1), this._updateRate (i, t)
    }, a.prototype._orientationchange = function (t) {
        void 0 === t && (t = null), this._ori = parseInt (window.orientation.toString ()) || 0, -1 == this._ori && (this._ori = 0)
    }, a.prototype._failedDeviceOrientation = function () {
        var e = this;
        window.addEventListener ("devicemotion", function (t) {
            return e._devicemotion (t)
        })
    }, a);

    function a () {
        this._ori = 0, this._dx = 0, this._dy = 0, this._rx = 0, this._ry = 0, this.__updates = {}, this.__keyCount = 0, this._timeoutId = null, this._isAndroid = !1, this._ax = -1e3, this._ay = -1e3
    }

    t.DeviceManager = s;
    var h = (u.prototype.dispatchEvent = function (t) {
        var e, i = t instanceof p ? (e = t.type, t) : new p (e = t);
        if (null != this.listeners[e]) for (var n = (i.currentTarget = this).listeners[e].length, o = 0; o < n && this.listeners[e]; o++) {
            var r = this.listeners[e][o];
            try {
                r.handler (i)
            } catch (t) {
                window.console && console.error (t.stack)
            }
        }
    }, u.prototype.addEventListener = function (t, e, i) {
        void 0 === i && (i = 0), null == this.listeners[t] && (this.listeners[t] = []), this.listeners[t].push (new _ (t, e, i)), this.listeners[t].sort (function (t, e) {
            return e.priolity - t.priolity
        })
    }, u.prototype.removeEventListener = function (t, e) {
        if (this.hasEventListener (t, e)) for (var i = 0; i < this.listeners[t].length; i++) {
            var n = this.listeners[t][i];
            if (n.equalCurrentListener (t, e)) return n.handler = null, void this.listeners[t].splice (i, 1)
        }
    }, u.prototype.clearEventListener = function () {
        this.listeners = {}
    }, u.prototype.containEventListener = function (t) {
        return null != this.listeners[t] && 0 < this.listeners[t].length
    }, u.prototype.hasEventListener = function (t, e) {
        if (null == this.listeners[t]) return !1;
        for (var i = 0; i < this.listeners[t].length; i++) if (this.listeners[t][i].equalCurrentListener (t, e)) return !0;
        return !1
    }, u);

    function u () {
        this.listeners = {}
    }

    t.EventDispatcher = h;
    var _ = (c.prototype.equalCurrentListener = function (t, e) {
        return this.type == t && this.handler == e
    }, c);

    function c (t, e, i) {
        void 0 === e && (e = null), void 0 === i && (i = 0), this.type = t = void 0 === t ? null : t, this.handler = e, this.priolity = i
    }

    var p = function (t, e) {
        void 0 === e && (e = null), this.type = t = void 0 === t ? null : t, this.data = e
    };
    t.Event = p;
    var d, i = (__extends (l, d = h), l.prototype.execute = function () {
    }, l.prototype.cancel = function () {
    }, l.prototype._dispatchComplete = function () {
        this._loaded = !0, this.dispatchEvent (new m (m.COMPLETE))
    }, l.prototype._dispatchFailed = function () {
        this.dispatchEvent (new m (m.FAILED))
    }, l.prototype._dispatchProgress = function (t) {
        var e = new m (m.PROGRESS);
        e.progress = t, this.dispatchEvent (e)
    }, l);

    function l () {
        var t = d.call (this) || this;
        return t._loaded = !1, t
    }

    t.CommandBase = i;
    var f, m = (__extends (y, f = p), y.COMPLETE = "complete", y.FAILED = "failed", y.PROGRESS = "progress", y);

    function y (t) {
        return f.call (this, t) || this
    }

    t.CommandEvent = m;
    var b, s = (__extends (v, b = i), v.prototype.execute = function () {
        if (this._loaded = !1, this._now = this._compnum = this._compRate = 0, this._compflags = [], this._progRates = [], this._total <= this._compnum) return this._dispatchProgress (1), void this._dispatchComplete ();
        for (var t = Math.min (this._total, this._connectionNum), e = 0; e < t; e++) this._execute ()
    }, v.prototype.cancel = function () {
        if (!(this._total <= this._compnum)) for (var t = 0; t < this._total; t++) try {
            var e = this._commands[t];
            this._removeEvents (e), e.cancel ()
        } catch (t) {
        }
    }, v.prototype.add = function (t, e) {
        void 0 === e && (e = 1), this._commands[this._total] = t, this._rates[this._total] = e, this._sum += e, this._total++
    }, v.prototype._execute = function () {
        var t, e = this;
        this._now < this._total ? (this._rates[this._now] = this._rates[this._now] / this._sum, this._progRates[this._now] = 0, (t = this._commands[this._now]).__id = this._now, t.addEventListener (m.COMPLETE, function (t) {
            return e._complete (t)
        }), t.addEventListener (m.PROGRESS, function (t) {
            return e._progress (t)
        }), t.addEventListener (m.FAILED, function (t) {
            return e._failed (t)
        }), t.execute (), this._now++) : this._total <= this._compnum && (this._dispatchProgress (1), this._dispatchComplete ())
    }, v.prototype._removeEvents = function (t) {
        t.clearEventListener ()
    }, v.prototype._completeCommand = function (t, e) {
    }, v.prototype._complete = function (t) {
        var e = t.currentTarget.__id, t = this._commands[e];
        this._removeEvents (t), this._compRate += this._rates[e], this._compflags[e] = !0, this.__progress (), this._completeCommand (t, e), this._compnum++, this._execute ()
    }, v.prototype._progress = function (t) {
        var e = t.currentTarget.__id;
        this._progRates[e] = t.progress * this._rates[e], this.__progress ()
    }, v.prototype.__progress = function () {
        for (var t = 0, e = 0; e < this._now; e++) this._compflags[e] || (t += this._progRates[e]);
        this._dispatchProgress (this._compRate + t)
    }, v.prototype._failed = function (t) {
        t = t.currentTarget.__id, t = this._commands[t];
        this._removeEvents (t), this._dispatchFailed ()
    }, Object.defineProperty (v.prototype, "loaded", {
        get: function () {
            return this._loaded
        }, enumerable: !0, configurable: !0
    }), v);

    function v (t) {
        void 0 === t && (t = 1);
        var e = b.call (this) || this;
        return e._rates = [], e._sum = 0, e._commands = [], e._now = 0, e._total = 0, e._compnum = 0, e._compflags = [], e._connectionNum = t, e
    }

    t.SequentialCommand = s;
    var g, h = (__extends (x, g = i), x.prototype.execute = function () {
        function t () {
            i._complete ()
        }

        function e (t) {
            i._progress (t)
        }

        var i = this;
        this._audio = new aidn.AutoAudio (null), this._isplay ? (this._audio.load ([this._url], null, this._trimvol, e), this._audio.play (0, !1, t, 0, 0)) : this._audio.load ([this._url], t, this._trimvol, e)
    }, x.prototype._progress = function (t) {
        this._dispatchProgress (t)
    }, x.prototype._complete = function () {
        this._isplay && this._audio.stop ();
        var t = (t = this._id) || this._url;
        r.add (t, this._audio), this._dispatchComplete ()
    }, x);

    function x (t, e, i, n) {
        void 0 === e && (e = null), void 0 === i && (i = !1), void 0 === n && (n = -1);
        var o = g.call (this) || this;
        return o._id = e, o._url = t, o._isplay = i, o._trimvol = n, o
    }

    t.AudioLoadCommand = h;
    var E, h = (__extends (w, E = i), w.prototype.execute = function () {
        var e = this, i = new Image, n = this._name, t = this._type == j.PIXI ? function () {
            var t = new PIXI.Texture (new PIXI.BaseTexture (i));
            PIXI.Texture.addTextureToCache (t, n), r.add (n, t), setTimeout (function () {
                e._complete ()
            }, 10)
        } : this._type == j.THREE ? function () {
            var t = new THREE.Texture (i);
            t.needsUpdate = !0, r.add (n, t), setTimeout (function () {
                e._complete ()
            }, 10)
        } : function () {
            r.add (n, i), setTimeout (function () {
                e._complete ()
            }, 10)
        };
        i.onload = t, i.src = this._url
    }, w.prototype._complete = function () {
        this._dispatchComplete ()
    }, w);

    function w (t, e, i) {
        void 0 === e && (e = null), void 0 === i && (i = -1);
        var n = E.call (this) || this;
        return n._url = t, n._type = i, (n._name = e) || (n._name = t), n
    }

    t.ImageLoadCommand = h;
    var R, s = (__extends (P, R = s), P);

    function P (t, e, i) {
        void 0 === i && (i = 0);
        for (var n = R.call (this, e = void 0 === e ? 1 : e) || this, o = t.length, r = 0; r < o; r++) n.add (new O (t[r], i));
        return n
    }

    t.ScriptsLoaderCommand = s;
    var T, O = (__extends (M, T = i), M.prototype.execute = function () {
        var t = this;
        $.ajax ({url: this._url + "?" + this._ver, cache: !0, dataType: "script"}).then (function () {
            return t._complete ()
        }, function () {
            return t._failed ()
        })
    }, M.prototype._complete = function () {
        this._dispatchComplete ()
    }, M.prototype._failed = function () {
        this._dispatchFailed ()
    }, M);

    function M (t, e) {
        void 0 === e && (e = 0);
        var i = T.call (this) || this;
        return i._url = t, i._ver = e, i
    }

    var j = (C.PIXI = 0, C.THREE = 1, C.IMG = 2, C);

    function C () {
    }

    t.JsonBase64Type = j;
    var k, i = (__extends (H, k = i), H.prototype.execute = function () {
        var e = this, t = {
            method: "GET", url: this._url, dataType: "json", success: function (t) {
                e._complete (t)
            }, xhr: function () {
                var t = $.ajaxSettings.xhr ();
                return t.onprogress = function (t) {
                    e._dispatchProgress (e._jsonRate * (t.loaded / t.total))
                }, t
            }
        };
        $.ajax (t)
    }, H.prototype._setupAudio = function (t) {
        this._context = t
    }, H.prototype._complete = function (t) {
        var e, i = 0;
        for (e in this._data = t) this._keys[i++] = e;
        this._now = -1, this._len = i, this._next ()
    }, H.prototype._next = function () {
        var e, i, t, n, o;
        this._now++, this._now < this._len ? (this._dispatchProgress (this._jsonRate + (1 - this._jsonRate) * (this._now / this._len)), i = (e = this)._keys[this._now], t = this._data[i], 0 < i.lastIndexOf (".mp3") || 0 < i.lastIndexOf (".ogg") ? aidn.util.webaudio ? (this._context && (aidn.___waContext = this._context), o = new aidn.WebAudio, r.add (i, o), o.load (t, function () {
            e._next ()
        })) : setTimeout (function () {
            e._next ()
        }, 10) : (n = new Image, o = this._type == j.PIXI ? function () {
            var t = new PIXI.Texture (new PIXI.BaseTexture (n));
            PIXI.Texture.addToCache ? PIXI.Texture.addToCache (t, i) : PIXI.Texture.addTextureToCache (t, i), r.add (i, t), setTimeout (function () {
                e._next ()
            }, 10)
        } : this._type == j.THREE ? function () {
            var t = new THREE.Texture (n);
            t.needsUpdate = !0, r.add (i, t), setTimeout (function () {
                e._next ()
            }, 10)
        } : function () {
            r.add (i, n), setTimeout (function () {
                e._next ()
            }, 10)
        }, n.onload = o, n.src = t)) : this._dispatchComplete ()
    }, H);

    function H (t, e, i) {
        void 0 === e && (e = 0), void 0 === i && (i = .3);
        var n = k.call (this) || this;
        return n._keys = [], n._context = null, n._url = t, n._type = e, n._jsonRate = i, n
    }

    t.JsonBase64LoadCommand = i;
    I.prototype.set = function (t, e) {
        return void 0 === e && (e = 0), this.x = t = void 0 === t ? 0 : t, this.y = e, this
    }, I.prototype.clone = function () {
        return new I (this.x, this.y)
    }, I.prototype.distance = function (t) {
        var e = this.x - t.x, t = this.y - t.y;
        return Math.sqrt (e * e + t * t)
    }, i = I;

    function I (t, e) {
        void 0 === e && (e = 0), this.x = t = void 0 === t ? 0 : t, this.y = e
    }

    t.Point = i;
    L.random = function (t) {
        var e = this.seed;
        return null != (t = void 0 === t ? null : t) && (e = t), e ^= e << 13, e ^= e >> 17, (this.seed = e ^= e << 15) / 4294967296 + .5
    }, L.randInt = function (t, e, i) {
        return void 0 === i && (i = null), Math.floor (this.rand (t, e + 1, i))
    }, L.rand = function (t, e, i) {
        return this.random (i = void 0 === i ? null : i) * (e - t) + t
    }, L.arrayShuffle = function (t) {
        for (var e = t.length, i = 0; i < e; i++) {
            var n = this.randInt (0, e - 1), o = t[i];
            t[i] = t[n], t[n] = o
        }
    }, L.seed = 0, i = L;

    function L () {
    }

    t.Util = i
} (aidnlib = aidnlib || {}), function (t) {
    var o, e = aidnlib.CommandBase, r = aidnlib.Assets, s = aidnlib.Ref,
        i = (__extends (n, o = e), n.prototype.execute = function () {
            var i = this;
            window.JSZipUtils.getBinaryContent (this._url, function (t, e) {
                i._zipComplete (t, e)
            })
        }, n.prototype._zipComplete = function (t, e) {
            var i = this;
            window.JSZipUtils.loadAsync (e).then (function (t) {
                i._binayComplete (t)
            })
        }, n.prototype._binayComplete = function (t) {
            var e, i = 0;
            for (e in (this._zip = t).files) this._keys[i++] = e;
            this._now = -1, this._len = i, this._next ()
        }, n.prototype._next = function () {
            var e, i;
            this._now++, this._now < this._len ? (this._dispatchProgress (this._now / this._len), i = (e = this)._keys[this._now], this._zip.file (i).async ("arraybuffer").then (function (t) {
                e._arrayComplete (t, i)
            })) : this._dispatchComplete ()
        }, n.prototype._arrayComplete = function (t, e) {
            var i, n, o = this;
            0 < e.lastIndexOf (".vmd") && (n = (i = this._loader).parser.parseVmd (t, !0), this._vs.push (n), t = this._mesh, t = i.animationBuilder.build (n, t), r.add ("Motion" + this._n, t), r.add (e, t), this._n++), setTimeout (function () {
                return o._next ()
            }, 10)
        }, n);

    function n (t, e, i) {
        var n = o.call (this) || this;
        return n._keys = [], n._n = 0, n._vs = [], n._url = t, n._loader = e, n._mesh = i, n
    }

    t.ZipLoadCommand = i;
    var a, i = (__extends (h, a = e), h.prototype.execute = function () {
        var e = this;
        this._loader || (this._loader = r.get ("loader")), this._mesh || (this._mesh = r.get ("mesh"));
        var t = new XMLHttpRequest;
        (this._xhr = t).open ("GET", this._url, !0), t.responseType = "arraybuffer", t.onload = function (t) {
            return e._loadComplete (t)
        }, t.send ()
    }, h.prototype._loadComplete = function (t) {
        var e = this._xhr.response, i = this._loader, n = i.parser.parseVmd (e, !0), e = this._mesh,
            e = i.animationBuilder.build (n, e);
        r.add (this._key, e), this._dispatchComplete ()
    }, h);

    function h (t, e, i, n) {
        void 0 === e && (e = "motion"), void 0 === i && (i = null), void 0 === n && (n = null);
        var o = a.call (this) || this;
        return o._url = t, o._loader = i, o._mesh = n, o._key = e, o
    }

    t.ThreeVmdLoadCommand = i;
    var u, i = (__extends (_, u = e), _.prototype.execute = function () {
        var e = this, t = new THREE.MMDLoader;
        r.add ("loader", t), r.add (this._pmdUrl + "_loader", t), t.load (this._pmdUrl, function (t) {
            e._complete (t)
        }, function (t) {
            e._progress (t)
        })
    }, _.prototype._progress = function (t) {
        t.lengthComputable && (t = t.loaded / t.total, this._dispatchProgress (t))
    }, _.prototype._complete = function (t) {
        r.add (this._key, t), r.add (this._pmdUrl, t), this._dispatchComplete ()
    }, _);

    function _ (t, e) {
        void 0 === e && (e = "mesh");
        var i = u.call (this) || this;
        return i._pmdUrl = t, i._key = e, i
    }

    t.ThreePmdLoadCommand = i;
    c.prototype.setPosVec = function (t) {
        return this.x = t.x, this.y = t.y, this.z = t.z, this
    }, c.prototype.setPos = function (t, e, i) {
        return this.x = t, this.y = e, this.z = i, this
    }, c.prototype.setRot = function (t, e, i) {
        return this.rotationX = t, this.rotationY = e, this.rotationZ = i, this
    }, c.prototype.getPos = function () {
        return this._target.position.clone ()
    }, c.prototype.getRot = function () {
        return this._target.rotation
    }, c.prototype.get2D = function (t, e) {
        void 0 === e && (e = null);
        var i = .5 * s.stw, n = .5 * s.sth, o = this._target.position.clone ();
        return e && o.add (e), o.project (t), o.x = Math.round ((o.x + 1) * i), o.y = Math.round ((1 - o.y) * n), new THREE.Vector2 (o.x, o.y)
    }, Object.defineProperty (c.prototype, "parent", {
        get: function () {
            return this._parent
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (c.prototype, "target", {
        get: function () {
            return this._target
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (c.prototype, "x", {
        get: function () {
            return this._target.position.x
        }, set: function (t) {
            this._target.position.x = t
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (c.prototype, "y", {
        get: function () {
            return this._target.position.y
        }, set: function (t) {
            this._target.position.y = t
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (c.prototype, "z", {
        get: function () {
            return this._target.position.z
        }, set: function (t) {
            this._target.position.z = t
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (c.prototype, "rotationX", {
        get: function () {
            return this._target.rotation.x
        }, set: function (t) {
            this._target.rotation.x = t
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (c.prototype, "rotationY", {
        get: function () {
            return this._target.rotation.y
        }, set: function (t) {
            this._target.rotation.y = t
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (c.prototype, "rotationZ", {
        get: function () {
            return this._target.rotation.z
        }, set: function (t) {
            this._target.rotation.z = t
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (c.prototype, "scale", {
        get: function () {
            return this._target.scale.x
        }, set: function (t) {
            t = this.__checkSc (t), this._target.scale.set (t, t, t)
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (c.prototype, "scaleX", {
        get: function () {
            return this._target.scale.x
        }, set: function (t) {
            t = this.__checkSc (t), this._target.scale.x = t
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (c.prototype, "scaleY", {
        get: function () {
            return this._target.scale.y
        }, set: function (t) {
            t = this.__checkSc (t), this._target.scale.y = t
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (c.prototype, "scaleZ", {
        get: function () {
            return this._target.scale.z
        }, set: function (t) {
            t = this.__checkSc (t), this._target.scale.z = t
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (c.prototype, "visible", {
        get: function () {
            return this._target.visible
        }, set: function (t) {
            this._target.visible = t
        }, enumerable: !0, configurable: !0
    }), c.prototype.__checkSc = function (t) {
        return t = 0 == t ? .001 : t
    }, Object.defineProperty (c.prototype, "renderOrder", {
        get: function () {
            return this._target.renderOrder
        }, set: function (t) {
            this._target.renderOrder = t
        }, enumerable: !0, configurable: !0
    }), e = c;

    function c (t, e) {
        void 0 === e && (e = null), t = (t = void 0 === t ? null : t) || new THREE.Object3D, this._target = t, e ? (this._parent = e, this._parent.add (this._target)) : this._parent = t.parent
    }

    t.ThreeBase = e;
    var p = (Object.defineProperty (d.prototype, "bone", {
        get: function () {
            return this._bone
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (d.prototype, "defRot", {
        get: function () {
            return this._defRot
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (d.prototype, "defPos", {
        get: function () {
            return this._defPos
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (d.prototype, "x", {
        get: function () {
            return this._bone.position.x
        }, set: function (t) {
            this._bone.position.x = t
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (d.prototype, "y", {
        get: function () {
            return this._bone.position.y
        }, set: function (t) {
            this._bone.position.y = t
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (d.prototype, "z", {
        get: function () {
            return this._bone.position.z
        }, set: function (t) {
            this._bone.position.z = t
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (d.prototype, "rotationX", {
        get: function () {
            return this._bone.rotation.x
        }, set: function (t) {
            this._bone.rotation.x = t
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (d.prototype, "rotationY", {
        get: function () {
            return this._bone.rotation.y
        }, set: function (t) {
            this._bone.rotation.y = t
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (d.prototype, "rotationZ", {
        get: function () {
            return this._bone.rotation.z
        }, set: function (t) {
            this._bone.rotation.z = t
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (d.prototype, "scale", {
        get: function () {
            return this._bone.scale.x
        }, set: function (t) {
            this._bone.scale.set (t, t, t)
        }, enumerable: !0, configurable: !0
    }), d.prototype.add = function () {
        for (var t, e = [], i = 0; i < arguments.length; i++) e[i] = arguments[i];
        (t = this._bone).add.apply (t, e)
    }, d);

    function d (t) {
        this._bone = t, this._defRot = t.rotation.clone (), this._defPos = t.position.clone ()
    }

    var l, i = (__extends (f, l = e), Object.defineProperty (f.prototype, "mesh", {
        get: function () {
            return this._mesh
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (f.prototype, "bones", {
        get: function () {
            return this._bones
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (f.prototype, "acs", {
        get: function () {
            return this._acs
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (f.prototype, "morphs", {
        get: function () {
            return this._mesh.morphTargetInfluences
        }, enumerable: !0, configurable: !0
    }), f.prototype.logInfo = function () {
        var t = this._mesh;
        console.log ("mesh.morphTargetDictionary:"), console.log (t.morphTargetDictionary), console.log ("mesh.skeleton.bones:"), console.log (t.skeleton.bones)
    }, f.prototype.initAnimation = function (t, e) {
        void 0 === e && (e = -1);
        var i = new THREE.MMDAnimationHelper ({sync: !1});
        i.enabled.physics = !1, this._helper = i, this._helper.add (this._mesh, {animation: t, physics: !1});
        t = this._helper.objects.get (this._helper.meshes[0]).mixer._actions;
        return this._acs = t, this.playAnimationId (e), t
    }, f.prototype.playAnimationId = function (t) {
        void 0 === t && (t = -1);
        for (var e = this._acs, i = 0; i < e.length; i++) e[i].weight = i == t ? 1 : 0
    }, f.prototype.update = function () {
        this._helper ? this._helper.update (s.delta) : this._ikSolver && this._ikSolver.update ()
    }, f);

    function f (t, e, i) {
        void 0 === i && (i = !1);
        var n = l.call (this, t, e) || this;
        (n._mesh = t).geometry.userData && t.geometry.userData.MMD && (n._ikSolver = new THREE.CCDIKSolver (t, t.geometry.userData.MMD.iks)), n._bones = [];
        for (var o = t.skeleton.bones.length, r = 0; r < o; r++) n._bones[r] = new p (t.skeleton.bones[r]);
        for (var s, a = t.material, r = 0; r < a.length; r++) i && (s = a[r], (s = new THREE.MeshBasicMaterial ({
            map: s.map,
            skinning: !0
        })).userData.outlineParameters = [], t.material[r] = s, t.material[r].needsUpdate = !0);
        return n
    }

    t.MMDManager = i;
    var m, i = (__extends (y, m = e), y.prototype.centerTrans = function (t, e, i) {
        void 0 === t && (t = 0), void 0 === e && (e = 0), void 0 === i && (i = 0), this._geometry && (this._geometry.applyMatrix ? this._geometry.applyMatrix ((new THREE.Matrix4).makeTranslation (t, e, i)) : this._geometry.applyMatrix4 ((new THREE.Matrix4).makeTranslation (t, e, i)))
    }, y.prototype.updateTexture = function (t, e) {
        void 0 === e && (e = !1), this._material.map = t, this._material.needsUpdate = !0, this._map = this._material.map, this._material.blending = e ? THREE.AdditiveBlending : THREE.NormalBlending
    }, Object.defineProperty (y.prototype, "alpha", {
        get: function () {
            return this._material.opacity
        }, set: function (t) {
            this._material.opacity = t
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (y.prototype, "mesh", {
        get: function () {
            return this._mesh
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (y.prototype, "geometry", {
        get: function () {
            return this._geometry
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (y.prototype, "material", {
        get: function () {
            return this._material
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (y.prototype, "texOffsetX", {
        get: function () {
            return this._map.offset.x
        }, set: function (t) {
            this._map.offset.x = t
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (y.prototype, "texOffsetY", {
        get: function () {
            return this._map.offset.y
        }, set: function (t) {
            this._map.offset.y = t
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (y.prototype, "texRepeatX", {
        get: function () {
            return this._map.repeat.x
        }, set: function (t) {
            this._map.repeat.x = t
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (y.prototype, "texRepeatY", {
        get: function () {
            return this._map.repeat.y
        }, set: function (t) {
            this._map.repeat.y = t
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (y.prototype, "color", {
        get: function () {
            return this._color.getHex ()
        }, set: function (t) {
            this._color.setHex (t)
        }, enumerable: !0, configurable: !0
    }), y);

    function y (t, e) {
        e = m.call (this, t, e = void 0 === e ? null : e) || this;
        if (t.geometry) try {
            e._mesh = t
        } catch (t) {
        }
        return t.geometry && (e._geometry = t.geometry), t.material && (e._material = t.material, e._map = e._material.map, e._color = e._material.color), e
    }

    t.PrimBase = i;
    var b, e = (__extends (v, b = i), Object.defineProperty (v.prototype, "sprite", {
        get: function () {
            return this._sprite
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (v.prototype, "material", {
        get: function () {
            return this._sprite.material
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (v.prototype, "rotation", {
        get: function () {
            return this._sprite.material.rotation
        }, set: function (t) {
            this._sprite.material.rotation = t
        }, enumerable: !0, configurable: !0
    }), v);

    function v (t, e) {
        var i = this, e = new THREE.Sprite (e);
        return (i = b.call (this, e, t) || this)._sprite = e, i
    }

    t.PrimSprite = e;
    var g, e = (__extends (x, g = i), Object.defineProperty (x.prototype, "line", {
        get: function () {
            return this._line
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (x.prototype, "material", {
        get: function () {
            return this._line.material
        }, enumerable: !0, configurable: !0
    }), x);

    function x (t, e, i, n) {
        void 0 === e && (e = null), void 0 === i && (i = -1), void 0 === n && (n = 1);
        var o, r = this, s = new THREE.Geometry;
        return s.vertices = t, 0 <= i ? (o = new THREE.LineBasicMaterial ({
            color: i,
            linewidth: n,
            linecap: "square",
            linejoin: "miter"
        }), o = new THREE.Line (s, o)) : (o = new THREE.Line (s)).visible = !1, (r = g.call (this, o, e) || this)._line = o, r
    }

    t.PrimLine = e;
    var E, e = (__extends (w, E = i), w);

    function w (t, e, i, n, o, r) {
        void 0 === i && (i = 1), void 0 === n && (n = 1), void 0 === o && (o = 1), void 0 === r && (r = 1);
        var s = this, r = new THREE.PlaneGeometry (i, n, o, r), e = new THREE.Mesh (r, e);
        return (s = E.call (this, e, t) || this)._mesh = e, s
    }

    t.PrimPlane = e;
    var R, e = (__extends (P, R = i), P);

    function P (t, e, i, n, o, r, s, a) {
        void 0 === r && (r = 1), void 0 === s && (s = 1), void 0 === a && (a = 1);
        var h = this, a = new THREE.BoxGeometry (i, n, o, r, s, a), e = new THREE.Mesh (a, e);
        return (h = R.call (this, e, t) || this)._mesh = e, h
    }

    t.PrimCube = e;
    var T, e = (__extends (O, T = i), O);

    function O (t, e, i, n, o) {
        void 0 === n && (n = 8), void 0 === o && (o = 6);
        var r = this, o = new THREE.SphereGeometry (i, n, o), e = new THREE.Mesh (o, e);
        return (r = T.call (this, e, t) || this)._mesh = e, r
    }

    t.PrimSphere = e;
    var M, e = (__extends (j, M = i), j);

    function j (t, e, i, n, o, r, s, a) {
        void 0 === r && (r = 8), void 0 === s && (s = 1), void 0 === a && (a = !1);
        var h = this, a = new THREE.CylinderGeometry (i, n, o, r, s, a), e = new THREE.Mesh (a, e);
        return (h = M.call (this, e, t) || this)._mesh = e, h
    }

    t.PrimCylinder = e;
    var C, e = (__extends (k, C = i), k);

    function k (t, e, i, n, o, r) {
        void 0 === o && (o = 8), void 0 === r && (r = 1);
        var s = this, r = new THREE.RingGeometry (i, n, o, r), e = new THREE.Mesh (r, e);
        return (s = C.call (this, e, t) || this)._mesh = e, s
    }

    t.PrimRing = e;
    var H, i = (__extends (I, H = i), I);

    function I (t, e, i, n, o, r) {
        void 0 === n && (n = 2), void 0 === o && (o = 8), void 0 === r && (r = 8);
        var s = this, o = new THREE.TorusGeometry (i, n, r, o), e = new THREE.Mesh (o, e);
        return (s = H.call (this, e, t) || this)._mesh = e, s
    }

    t.PrimTorus = i
} (three = three || {}), function (t) {
    var h = aidn.math, i = aidnlib.Ref, e = aidnlib.MainBase, u = aidnlib.Assets, n = aidnlib.DeviceManager,
        o = aidnlib.JsonBase64LoadCommand, r = aidnlib.JsonBase64Type, s = aidnlib.SequentialCommand,
        a = aidnlib.CommandEvent, _ = three.ThreeBase;

    function c () {
        (p.main || new b).initialize ()
    }

    t.check = function () {
        $ (function () {
            p.main || new b
        }), function t () {
            "undefined" == typeof THREE ? setTimeout (function () {
                return t ()
            }, 10) : $ (c)
        } ()
    };
    var p = (d.enableDevice = !1, d);

    function d () {
    }

    var l, f = (__extends (m, l = s), m);

    function m () {
        var t = l.call (this, 1) || this;
        t.add (new aidnlib.ScriptsLoaderCommand (["shared/main/js/lib.js"])), t.add (new o ("shared/main/img/miku/tex.json", r.THREE));
        var e = "shared/main/img/miku/box_miku.pmd";
        return 0 <= navigator.userAgent.indexOf ("Firefox") && (e = "shared/main/img/mikuu_ff/box_miku.pmd"), t.add (new three.ThreePmdLoadCommand (e)), t
    }

    var y, b = (__extends (v, y = e), v.prototype.initialize = function () {
        var t = this;
        y.prototype.initialize.call (this), $ ("#menu").show ();
        var e = new f;
        e.addEventListener (a.COMPLETE, function () {
            return t._initComplete ()
        }), e.execute ()
    }, v.prototype._initComplete = function () {
        this._three = new k, this._start (), $ ("#view").stop ().delay (200).animate ({opacity: .5}, 700, "linear")
    }, v.prototype._start = function () {
        y.prototype._start.call (this)
    }, v.prototype._update = function () {
        var t = this;
        y.prototype._update.call (this), window.requestAnimFrame (function () {
            return t._update ()
        })
    }, v.prototype._resize = function () {
        y.prototype._resize.call (this), $ ("#menu").show (), $ ("#menu").css ("display", "block")
    }, v);

    function v () {
        var t = y.call (this) || this;
        return p.main = t, p.isMobile = aidn.util.checkMobile (), p.isMobile && $ (".nico").attr ("href", "http://sp.nicovideo.jp/mylist/4009728?sort=8"), aidn.util.checkJapanese () || $ (".nico").hide (), $ ("#menu").stop ().show (), $ ("#loading").hide (), p.device = new n, p.device.start (), t
    }

    Object.defineProperty (g.prototype, "pass", {
        get: function () {
            return this._pass
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (g.prototype, "enabled", {
        get: function () {
            return this._pass.enabled
        }, set: function (t) {
            this._pass.enabled = t
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (g.prototype, "renderToScreen", {
        get: function () {
            return this._pass.renderToScreen
        }, set: function (t) {
            this._pass.renderToScreen = t
        }, enumerable: !0, configurable: !0
    }), g.prototype.start = function (t) {
        var e = this;
        void 0 === t && (t = 120), this.enabled = !0, 0 < t && (clearTimeout (this.__timeoutId), this.__timeoutId = setTimeout (function () {
            return e.__complete ()
        }, t))
    }, g.prototype.__complete = function () {
        this.enabled = !1
    }, e = g;

    function g (t) {
        this.__timeoutId = -1, t.enabled = !1, this._pass = t
    }

    var x, E = (__extends (w, x = e), Object.defineProperty (w.prototype, "uniforms", {
        get: function () {
            return this._epass.uniforms
        }, enumerable: !0, configurable: !0
    }), w.prototype.start = function (t) {
        x.prototype.start.call (this, t = void 0 === t ? 120 : t)
    }, w);

    function w () {
        var t = this, e = .6;
        p.isMobile && (e = .8);
        e = new THREE.DotScreenPass (new THREE.Vector2 (0, 0), .5, e);
        return (t = x.call (this, e) || this)._epass = e, t
    }

    var R = (P.prototype._init = function () {
        this._efDotSc = new E, this._efDotSc.start (-1), this._effects = [this._efDotSc], this._total = this._effects.length
    }, P.prototype.setSize = function (t, e) {
        this._renderer.setSize (t, e), this._comp.setSize (t, e)
    }, P.prototype.render = function () {
        for (var t = this._total, e = [this._pass], i = 1, n = 0; n < t; n++) this._effects[n].enabled && (e[i] = this._effects[n].pass, i++);
        if (1 < i) {
            for (n = 0; n < i; n++) e[n].renderToScreen = n == i - 1;
            this._comp.passes = e, this._comp.render ()
        } else this._renderer.render (this._scene, this._camera)
    }, P);

    function P (t, e, i) {
        this._effects = [], this._total = 0;
        var n = new THREE.RenderPass (i, e), o = new THREE.EffectComposer (t);
        this._renderer = t, this._camera = e, this._scene = i, this._comp = o, this._pass = n, this._init ()
    }

    var T = (Object.defineProperty (O.prototype, "defRot", {
        get: function () {
            return this._defRot
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (O.prototype, "defPos", {
        get: function () {
            return this._defPos
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (O.prototype, "x", {
        get: function () {
            return this._bone.position.x
        }, set: function (t) {
            this._bone.position.x = t
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (O.prototype, "y", {
        get: function () {
            return this._bone.position.y
        }, set: function (t) {
            this._bone.position.y = t
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (O.prototype, "z", {
        get: function () {
            return this._bone.position.z
        }, set: function (t) {
            this._bone.position.z = t
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (O.prototype, "rotX", {
        get: function () {
            return this._bone.rotation.x
        }, set: function (t) {
            this._bone.rotation.x = t
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (O.prototype, "rotY", {
        get: function () {
            return this._bone.rotation.y
        }, set: function (t) {
            this._bone.rotation.y = t
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (O.prototype, "rotZ", {
        get: function () {
            return this._bone.rotation.z
        }, set: function (t) {
            this._bone.rotation.z = t
        }, enumerable: !0, configurable: !0
    }), Object.defineProperty (O.prototype, "scale", {
        get: function () {
            return this._bone.scale.x
        }, set: function (t) {
            this._bone.scale.set (t, t, t)
        }, enumerable: !0, configurable: !0
    }), O.CENTER = 0, O.UPPER_BODY = 2, O.NECK = 3, O.HEAD = 4, O.L_SHOULDER = 6, O.L_ARM = 7, O.L_ELBOW = 8, O.R_SHOULDER = 11, O.R_ARM = 12, O.R_ELBOW = 13, O.LOWER_BODY = 16, O.L_HAIR1 = 26, O.R_HAIR1 = 27, O.L_HAIR2 = 28, O.R_HAIR2 = 29, O.L_HAIR3 = 30, O.R_HAIR3 = 31, O);

    function O (t) {
        this._bone = t, this._defRot = t.rotation.clone (), this._defPos = t.position.clone ()
    }

    var M, j = (__extends (C, M = _), Object.defineProperty (C.prototype, "mesh", {
        get: function () {
            return this._mesh
        }, enumerable: !0, configurable: !0
    }), C.prototype._deviceUpdate = function (t, e) {
        p.enableDevice = !0, p.isMobile && (e -= .2, t *= 1.4), this._poseUpdate (t, e)
    }, C.prototype._poseUpdate = function (t, e) {
        this._bones[T.UPPER_BODY].rotX = h.toRad (30 * e - 15), this._bones[T.UPPER_BODY].rotZ = -h.toRad (20 * t), this._bones[T.NECK].rotZ = -h.toRad (20 * t), this._bones[T.L_HAIR1].rotZ = -h.toRad (20 * e - 20), this._bones[T.R_HAIR1].rotZ = h.toRad (20 * e - 20), this._bones[T.L_HAIR2].rotZ = -h.toRad (30 * e - 30), this._bones[T.R_HAIR2].rotZ = h.toRad (30 * e - 30), this._bones[T.L_ARM].rotZ = -h.toRad (50 * e - 20), this._bones[T.R_ARM].rotZ = h.toRad (50 * e - 20), this._bones[T.L_ELBOW].rotZ = -h.toRad (10 + 30 * e), this._bones[T.R_ELBOW].rotZ = h.toRad (10 + 30 * e)
    }, C.prototype.update = function () {
        var t, e;
        this._mesh.rotation.y += .85 * i.delta, p.enableDevice || (t = .8 * Math.sin (1.23 * i.time), e = .8 * Math.cos (1.41 * i.time), this._poseUpdate (t, e))
    }, C);

    function C (t) {
        var i = this, e = u.get ("mesh");
        e.castShadow = !0, (i = M.call (this, e, t) || this)._mesh = e, i._bones = [];
        for (var n = e.skeleton.bones.length, o = 0; o < n; o++) i._bones[o] = new T (e.skeleton.bones[o]);
        for (var r = e.material, o = 0; o < r.length; o++) {
            var s = r[o];
            s.shininess = 0, s.userData.outlineParameters = {};
            var a = new THREE.MeshBasicMaterial ({map: s.map, skinning: !0});
            a.userData.outlineParameters = [], a.needsUpdate = !0, e.material[o] = a, s.needsUpdate = !0
        }
        t = new THREE.MMDAnimationHelper ({sync: !1});
        return t.enabled.physics = !1, i._helper = t, i._bones[T.L_ARM].rotZ = -h.toRad (30), i._bones[T.R_ARM].rotZ = h.toRad (30), --i._bones[T.L_HAIR2].y, --i._bones[T.R_HAIR2].y, i._mesh.rotation.y = -h.toDeg (60), p.device.addUpdate (i, function (t, e) {
            return i._deviceUpdate (t, e)
        }), i
    }

    var k = (H.prototype._deviceUpdate = function (t, e) {
        p.enableDevice = !0, this._updatePosition (t, e)
    }, H.prototype._updatePosition = function (t, e) {
        this._camera.position.y = +e + 5, this._camera.position.z = 16 + 6 * e, this._camera.position.x = +t + 0
    }, H.prototype._update = function () {
        var t, e;
        this._model.update (), this._box.rotationY = this._model.mesh.rotation.y, p.enableDevice || (t = .8 * Math.sin (1.33 * i.time), e = .8 * Math.cos (1.11 * i.time), this._updatePosition (t, e)), this._effeMng.render ()
    }, H.prototype._resize = function () {
        var t = i.stw, e = i.sth;
        this._camera.fov = 30 + e / t * 10, this._camera.aspect = t / e, this._camera.updateProjectionMatrix (), this._effeMng.setSize (t, e), this._effeMng.render ()
    }, H);

    function H () {
        var i = this, t = new THREE.PerspectiveCamera (45, window.innerWidth / window.innerHeight, .05, 400);
        t.position.z = 20, t.position.y = 6;
        var e = new THREE.Scene;
        e.background = new THREE.Color (16777215);
        var n = Math.min (window.devicePixelRatio, 2), o = document.getElementById ("view"),
            r = this._renderer = new THREE.WebGLRenderer ({antialias: !0});
        r.setPixelRatio (n), r.setSize (window.innerWidth, window.innerHeight), o.appendChild (r.domElement), this._renderer = r, this._scene = e, this._camera = t, this._model = new j (e), this._effeMng = new R (r, t, e), p.main.addUpdate (this, function () {
            return i._update ()
        }), p.main.addResize (this, function () {
            return i._resize ()
        });
        e = new THREE.MeshBasicMaterial ({color: 13421772}), e = new three.PrimCube (this._scene, e, 1, 1, 1);
        e.scale = 7, e.y = 0 - e.scaleY / 2, this._box = e, p.device.addUpdate (this, function (t, e) {
            return i._deviceUpdate (t, e)
        })
    }
} (index = index || {}), index.check ();