var aidnlib, three, main, __extends = this && this.__extends || function () {
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
    var r = function () {
        function t () {
        }

        return t.get = function (t) {
            return this._data[t]
        }, t.add = function (t, e) {
            this._data[t] = e
        }, t._data = {}, t
    } ();
    t.Assets = r;
    var o = function () {
    };
    t.Ref = o;
    var e = function () {
        function t () {
            this.__keyCount = 0, this.__updates = {}, this.__resizes = {}, this._isFit = !0
        }

        return t.prototype.initialize = function (t) {
            void 0 === t && (t = null), o.stw = aidn.window.width (), o.sth = aidn.window.height (), t && 0 == t.isFit && (this._isFit = !1), aidn.util.needExpandArea (!0), aidn.window.addDummyDiv ()
        }, t.prototype._start = function () {
            var t = this;
            o.time = Date.now () / 1e3, aidn.window.resize (function () {
                return t._resize ()
            }, this._isFit), this._resize (), this._update ()
        }, t.prototype.addUpdate = function (t, e) {
            t.__key || (t.__key = "key_" + this.__keyCount, this.__keyCount++), this.__updates[t.__key] = e
        }, t.prototype.removeUpdate = function (t) {
            t.__key && delete this.__updates[t.__key]
        }, t.prototype.addResize = function (t, e) {
            t.__key2 || (t.__key2 = "key_" + this.__keyCount, this.__keyCount++), this.__resizes[t.__key2] = e
        }, t.prototype.removeResize = function (t) {
            t.__key2 && delete this.__resizes[t.__key2]
        }, t.prototype._update = function () {
            var t = Date.now () / 1e3;
            for (var e in o.delta = t - o.time, o.time = t, this.__updates) this.__updates[e] ()
        }, t.prototype._resize = function () {
            for (var t in o.stw = aidn.window.width (), o.sth = aidn.window.height (), this.__resizes) this.__resizes[t] ()
        }, t
    } ();
    t.MainBase = e;
    var i = function () {
        function t () {
            this._ori = 0, this._dx = 0, this._dy = 0, this._rx = 0, this._ry = 0, this.__updates = {}, this.__keyCount = 0, this._timeoutId = null, this._isAndroid = !1, this._ax = -1e3, this._ay = -1e3
        }

        return t.prototype.start = function () {
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
        }, t.prototype.addUpdate = function (t, e) {
            t.__keyx || (t.__keyx = "keyx_" + this.__keyCount, this.__keyCount++), this.__updates[t.__keyx] = e
        }, t.prototype.removeUpdate = function (t) {
            t.__keyx && delete this.__updates[t.__keyx]
        }, t.prototype._updateRate = function (t, e) {
            for (var i in this.__updates) this.__updates[i] (t, e)
        }, t.prototype._mouseMove = function (t) {
            var e = o.stw / 2, i = o.sth / 2, n = aidn.event.getPos (t);
            this._dx = (n.x - e) / e, this._dy = (n.y - i) / i
        }, t.prototype._update = function () {
            var t = this;
            this._rx += (this._dx - this._rx) / 5, this._ry += (this._dy - this._ry) / 5, this._updateRate (this._rx, this._ry), window.requestAnimationFrame (function () {
                return t._update ()
            })
        }, t.prototype._deviceorientation = function (t) {
            var e = t.gamma, i = t.beta;
            if (null != this._timeoutId && (clearTimeout (this._timeoutId), this._timeoutId = null), 0 != this._ori) {
                var n = i;
                i = e, e = n, 90 == this._ori && (i = -i), -90 == this._ori && (e = -e)
            }
            var o = e / 35;
            o = Math.max (o, -1), o = Math.min (o, 1);
            var s = i / 35;
            s = Math.max (s, -1), s = Math.min (s, 1), this._updateRate (o, s)
        }, t.prototype._devicemotion = function (t) {
            var e = t.accelerationIncludingGravity || t.acceleration;
            this._ax < -100 ? (this._ax = e.x, this._ay = e.y) : (this._ax += (e.x - this._ax) / 3, this._ay += (e.y - this._ay) / 3);
            var i = Math.floor (10 * this._ax) / 10, n = -Math.floor (10 * this._ay) / 10;
            if (this._isAndroid && (i = -i, n = -n), 0 != this._ori) {
                var o = n;
                n = i, i = o, 90 == this._ori && (n = -n), -90 == this._ori && (i = -i)
            }
            var s = i / 5;
            s = Math.max (s, -1), s = Math.min (s, 1);
            var r = n / 5;
            r = Math.max (r, -1), r = Math.min (r, 1), this._updateRate (s, r)
        }, t.prototype._orientationchange = function (t) {
            void 0 === t && (t = null), this._ori = parseInt (window.orientation.toString ()) || 0, -1 == this._ori && (this._ori = 0)
        }, t.prototype._failedDeviceOrientation = function () {
            var e = this;
            window.addEventListener ("devicemotion", function (t) {
                return e._devicemotion (t)
            })
        }, t
    } ();
    t.DeviceManager = i;
    var n = function () {
        function t () {
            this.listeners = {}
        }

        return t.prototype.dispatchEvent = function (t) {
            var e, i;
            if (t instanceof a ? (i = t.type, e = t) : e = new a (i = t), null != this.listeners[i]) for (var n = (e.currentTarget = this).listeners[i].length, o = 0; o < n && this.listeners[i]; o++) {
                var s = this.listeners[i][o];
                try {
                    s.handler (e)
                } catch (t) {
                    window.console && console.error (t.stack)
                }
            }
        }, t.prototype.addEventListener = function (t, e, i) {
            void 0 === i && (i = 0), null == this.listeners[t] && (this.listeners[t] = []), this.listeners[t].push (new s (t, e, i)), this.listeners[t].sort (function (t, e) {
                return e.priolity - t.priolity
            })
        }, t.prototype.removeEventListener = function (t, e) {
            if (this.hasEventListener (t, e)) for (var i = 0; i < this.listeners[t].length; i++) {
                var n = this.listeners[t][i];
                if (n.equalCurrentListener (t, e)) return n.handler = null, void this.listeners[t].splice (i, 1)
            }
        }, t.prototype.clearEventListener = function () {
            this.listeners = {}
        }, t.prototype.containEventListener = function (t) {
            return null != this.listeners[t] && 0 < this.listeners[t].length
        }, t.prototype.hasEventListener = function (t, e) {
            if (null == this.listeners[t]) return !1;
            for (var i = 0; i < this.listeners[t].length; i++) {
                if (this.listeners[t][i].equalCurrentListener (t, e)) return !0
            }
            return !1
        }, t
    } ();
    t.EventDispatcher = n;
    var s = function () {
        function t (t, e, i) {
            void 0 === t && (t = null), void 0 === e && (e = null), void 0 === i && (i = 0), this.type = t, this.handler = e, this.priolity = i
        }

        return t.prototype.equalCurrentListener = function (t, e) {
            return this.type == t && this.handler == e
        }, t
    } (), a = function (t, e) {
        void 0 === t && (t = null), void 0 === e && (e = null), this.type = t, this.data = e
    };
    t.Event = a;
    var u = function (e) {
        function t () {
            var t = e.call (this) || this;
            return t._loaded = !1, t
        }

        return __extends (t, e), t.prototype.execute = function () {
        }, t.prototype.cancel = function () {
        }, t.prototype._dispatchComplete = function () {
            this._loaded = !0, this.dispatchEvent (new h (h.COMPLETE))
        }, t.prototype._dispatchFailed = function () {
            this.dispatchEvent (new h (h.FAILED))
        }, t.prototype._dispatchProgress = function (t) {
            var e = new h (h.PROGRESS);
            e.progress = t, this.dispatchEvent (e)
        }, t
    } (n);
    t.CommandBase = u;
    var h = function (e) {
        function t (t) {
            return e.call (this, t) || this
        }

        return __extends (t, e), t.COMPLETE = "complete", t.FAILED = "failed", t.PROGRESS = "progress", t
    } (a);
    t.CommandEvent = h;
    var _ = function (i) {
        function t (t) {
            void 0 === t && (t = 1);
            var e = i.call (this) || this;
            return e._rates = [], e._sum = 0, e._commands = [], e._now = 0, e._total = 0, e._compnum = 0, e._compflags = [], e._connectionNum = t, e
        }

        return __extends (t, i), t.prototype.execute = function () {
            if (this._loaded = !1, this._now = this._compnum = this._compRate = 0, this._compflags = [], this._progRates = [], this._total <= this._compnum) return this._dispatchProgress (1), void this._dispatchComplete ();
            for (var t = Math.min (this._total, this._connectionNum), e = 0; e < t; e++) this._execute ()
        }, t.prototype.cancel = function () {
            if (!(this._total <= this._compnum)) for (var t = 0; t < this._total; t++) try {
                var e = this._commands[t];
                this._removeEvents (e), e.cancel ()
            } catch (t) {
            }
        }, t.prototype.add = function (t, e) {
            void 0 === e && (e = 1), this._commands[this._total] = t, this._rates[this._total] = e, this._sum += e, this._total++
        }, t.prototype._execute = function () {
            var e = this;
            if (this._now < this._total) {
                this._rates[this._now] = this._rates[this._now] / this._sum, this._progRates[this._now] = 0;
                var t = this._commands[this._now];
                t.__id = this._now, t.addEventListener (h.COMPLETE, function (t) {
                    return e._complete (t)
                }), t.addEventListener (h.PROGRESS, function (t) {
                    return e._progress (t)
                }), t.addEventListener (h.FAILED, function (t) {
                    return e._failed (t)
                }), t.execute (), this._now++
            } else this._total <= this._compnum && (this._dispatchProgress (1), this._dispatchComplete ())
        }, t.prototype._removeEvents = function (t) {
            t.clearEventListener ()
        }, t.prototype._completeCommand = function (t, e) {
        }, t.prototype._complete = function (t) {
            var e = t.currentTarget.__id, i = this._commands[e];
            this._removeEvents (i), this._compRate += this._rates[e], this._compflags[e] = !0, this.__progress (), this._completeCommand (i, e), this._compnum++, this._execute ()
        }, t.prototype._progress = function (t) {
            var e = t.currentTarget.__id;
            this._progRates[e] = t.progress * this._rates[e], this.__progress ()
        }, t.prototype.__progress = function () {
            for (var t = 0, e = 0; e < this._now; e++) this._compflags[e] || (t += this._progRates[e]);
            this._dispatchProgress (this._compRate + t)
        }, t.prototype._failed = function (t) {
            var e = t.currentTarget.__id, i = this._commands[e];
            this._removeEvents (i), this._dispatchFailed ()
        }, Object.defineProperty (t.prototype, "loaded", {
            get: function () {
                return this._loaded
            }, enumerable: !0, configurable: !0
        }), t
    } (u);
    t.SequentialCommand = _;
    var c = function (s) {
        function t (t, e, i, n) {
            void 0 === e && (e = null), void 0 === i && (i = !1), void 0 === n && (n = -1);
            var o = s.call (this) || this;
            return o._id = e, o._url = t, o._isplay = i, o._trimvol = n, o
        }

        return __extends (t, s), t.prototype.execute = function () {
            var e = this, t = function () {
                e._complete ()
            }, i = function (t) {
                e._progress (t)
            };
            this._audio = new aidn.AutoAudio (null), this._isplay ? (this._audio.load ([this._url], null, this._trimvol, i), this._audio.play (0, !1, t, 0, 0)) : this._audio.load ([this._url], t, this._trimvol, i)
        }, t.prototype._progress = function (t) {
            this._dispatchProgress (t)
        }, t.prototype._complete = function () {
            this._isplay && this._audio.stop ();
            var t = this._id;
            t || (t = this._url), r.add (t, this._audio), this._dispatchComplete ()
        }, t
    } (u);
    t.AudioLoadCommand = c;
    var l = function (o) {
        function t (t, e, i) {
            void 0 === e && (e = null), void 0 === i && (i = -1);
            var n = o.call (this) || this;
            return n._url = t, n._type = i, (n._name = e) || (n._name = t), n
        }

        return __extends (t, o), t.prototype.execute = function () {
            var t, e = this, i = new Image, n = this._name;
            t = this._type == d.PIXI ? function () {
                var t = new PIXI.Texture (new PIXI.BaseTexture (i));
                PIXI.Texture.addTextureToCache (t, n), r.add (n, t), setTimeout (function () {
                    e._complete ()
                }, 10)
            } : this._type == d.THREE ? function () {
                var t = new THREE.Texture (i);
                t.needsUpdate = !0, r.add (n, t), setTimeout (function () {
                    e._complete ()
                }, 10)
            } : function () {
                r.add (n, i), setTimeout (function () {
                    e._complete ()
                }, 10)
            }, i.onload = t, i.src = this._url
        }, t.prototype._complete = function () {
            this._dispatchComplete ()
        }, t
    } (u);
    t.ImageLoadCommand = l;
    var p = function (r) {
        function t (t, e, i) {
            void 0 === e && (e = 1), void 0 === i && (i = 0);
            for (var n = r.call (this, e) || this, o = t.length, s = 0; s < o; s++) n.add (new f (t[s], i));
            return n
        }

        return __extends (t, r), t
    } (_);
    t.ScriptsLoaderCommand = p;
    var f = function (n) {
        function t (t, e) {
            void 0 === e && (e = 0);
            var i = n.call (this) || this;
            return i._url = t, i._ver = e, i
        }

        return __extends (t, n), t.prototype.execute = function () {
            var t = this;
            $.ajax ({url: this._url + "?" + this._ver, cache: !0, dataType: "script"}).then (function () {
                return t._complete ()
            }, function () {
                return t._failed ()
            })
        }, t.prototype._complete = function () {
            this._dispatchComplete ()
        }, t.prototype._failed = function () {
            this._dispatchFailed ()
        }, t
    } (u), d = function () {
        function t () {
        }

        return t.PIXI = 0, t.THREE = 1, t.IMG = 2, t
    } ();
    t.JsonBase64Type = d;
    var y = function (o) {
        function t (t, e, i) {
            void 0 === e && (e = 0), void 0 === i && (i = .3);
            var n = o.call (this) || this;
            return n._keys = [], n._context = null, n._url = t, n._type = e, n._jsonRate = i, n
        }

        return __extends (t, o), t.prototype.execute = function () {
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
        }, t.prototype._setupAudio = function (t) {
            this._context = t
        }, t.prototype._complete = function (t) {
            this._data = t;
            var e = 0;
            for (var i in t) this._keys[e++] = i;
            this._now = -1, this._len = e, this._next ()
        }, t.prototype._next = function () {
            if (this._now++, this._now < this._len) {
                this._dispatchProgress (this._jsonRate + (1 - this._jsonRate) * (this._now / this._len));
                var e = this, i = this._keys[this._now], t = this._data[i];
                if (0 < i.lastIndexOf (".mp3") || 0 < i.lastIndexOf (".ogg")) if (aidn.util.webaudio) {
                    this._context && (aidn.___waContext = this._context);
                    var n = new aidn.WebAudio;
                    r.add (i, n), n.load (t, function () {
                        e._next ()
                    })
                } else setTimeout (function () {
                    e._next ()
                }, 10); else {
                    var o, s = new Image;
                    o = this._type == d.PIXI ? function () {
                        var t = new PIXI.Texture (new PIXI.BaseTexture (s));
                        PIXI.Texture.addToCache ? PIXI.Texture.addToCache (t, i) : PIXI.Texture.addTextureToCache (t, i), r.add (i, t), setTimeout (function () {
                            e._next ()
                        }, 10)
                    } : this._type == d.THREE ? function () {
                        var t = new THREE.Texture (s);
                        t.needsUpdate = !0, r.add (i, t), setTimeout (function () {
                            e._next ()
                        }, 10)
                    } : function () {
                        r.add (i, s), setTimeout (function () {
                            e._next ()
                        }, 10)
                    }, s.onload = o, s.src = t
                }
            } else this._dispatchComplete ()
        }, t
    } (u);
    t.JsonBase64LoadCommand = y;
    var m = function () {
        function t (t, e) {
            void 0 === t && (t = 0), void 0 === e && (e = 0), this.x = t, this.y = e
        }

        return t.prototype.set = function (t, e) {
            return void 0 === t && (t = 0), void 0 === e && (e = 0), this.x = t, this.y = e, this
        }, t.prototype.clone = function () {
            return new t (this.x, this.y)
        }, t.prototype.distance = function (t) {
            var e = this.x - t.x, i = this.y - t.y;
            return Math.sqrt (e * e + i * i)
        }, t
    } ();
    t.Point = m;
    var v = function () {
        function t () {
        }

        return t.random = function (t) {
            void 0 === t && (t = null);
            var e = this.seed;
            return null != t && (e = t), e ^= e << 13, e ^= e >> 17, e ^= e << 15, (this.seed = e) / 4294967296 + .5
        }, t.randInt = function (t, e, i) {
            return void 0 === i && (i = null), Math.floor (this.rand (t, e + 1, i))
        }, t.rand = function (t, e, i) {
            return void 0 === i && (i = null), this.random (i) * (e - t) + t
        }, t.arrayShuffle = function (t) {
            for (var e = t.length, i = 0; i < e; i++) {
                var n = this.randInt (0, e - 1), o = t[i];
                t[i] = t[n], t[n] = o
            }
        }, t.seed = 0, t
    } ();
    t.Util = v
} (aidnlib || (aidnlib = {})), function (t) {
    var e = aidnlib.CommandBase, a = aidnlib.Assets, s = aidnlib.Ref, i = function (o) {
        function t (t, e, i) {
            var n = o.call (this) || this;
            return n._keys = [], n._n = 0, n._vs = [], n._url = t, n._loader = e, n._mesh = i, n
        }

        return __extends (t, o), t.prototype.execute = function () {
            var i = this;
            JSZipUtils.getBinaryContent (this._url, function (t, e) {
                i._zipComplete (t, e)
            })
        }, t.prototype._zipComplete = function (t, e) {
            var i = this;
            JSZip.loadAsync (e).then (function (t) {
                i._binayComplete (t)
            })
        }, t.prototype._binayComplete = function (t) {
            this._zip = t;
            var e = 0;
            for (var i in t.files) this._keys[e++] = i;
            this._now = -1, this._len = e, this._next ()
        }, t.prototype._next = function () {
            if (this._now++, this._now < this._len) {
                this._dispatchProgress (this._now / this._len);
                var e = this, i = this._keys[this._now];
                this._zip.file (i).async ("arraybuffer").then (function (t) {
                    e._arrayComplete (t, i)
                })
            } else this._dispatchComplete ()
        }, t.prototype._arrayComplete = function (t, e) {
            var i = this;
            if (0 < e.lastIndexOf (".vmd")) {
                var n = this._loader, o = n.parser.parseVmd (t, !0);
                this._vs.push (o);
                var s = this._mesh, r = n.animationBuilder.build (o, s);
                a.add ("Motion" + this._n, r), a.add (e, r), this._n++
            }
            setTimeout (function () {
                return i._next ()
            }, 10)
        }, t
    } (e);
    t.ZipLoadCommand = i;
    var n = function (s) {
        function t (t, e, i, n) {
            void 0 === e && (e = "motion"), void 0 === i && (i = null), void 0 === n && (n = null);
            var o = s.call (this) || this;
            return o._url = t, o._loader = i, o._mesh = n, o._key = e, o
        }

        return __extends (t, s), t.prototype.execute = function () {
            var e = this;
            this._loader || (this._loader = a.get ("loader")), this._mesh || (this._mesh = a.get ("mesh"));
            var t = new XMLHttpRequest;
            (this._xhr = t).open ("GET", this._url, !0), t.responseType = "arraybuffer", t.onload = function (t) {
                return e._loadComplete (t)
            }, t.send ()
        }, t.prototype._loadComplete = function (t) {
            var e = this._xhr.response, i = this._loader, n = i.parser.parseVmd (e, !0), o = this._mesh,
                s = i.animationBuilder.build (n, o);
            a.add (this._key, s), this._dispatchComplete ()
        }, t
    } (e);
    t.ThreeVmdLoadCommand = n;
    var o = function (n) {
        function t (t, e) {
            void 0 === e && (e = "mesh");
            var i = n.call (this) || this;
            return i._pmdUrl = t, i._key = e, i
        }

        return __extends (t, n), t.prototype.execute = function () {
            var e = this, t = new THREE.MMDLoader;
            a.add ("loader", t), a.add (this._pmdUrl + "_loader", t), t.load (this._pmdUrl, function (t) {
                e._complete (t)
            }, function (t) {
                e._progress (t)
            })
        }, t.prototype._progress = function (t) {
            if (t.lengthComputable) {
                var e = t.loaded / t.total;
                this._dispatchProgress (e)
            }
        }, t.prototype._complete = function (t) {
            var e = t;
            a.add (this._key, e), a.add (this._pmdUrl, e), this._dispatchComplete ()
        }, t
    } (e);
    t.ThreePmdLoadCommand = o;
    var r = function () {
        function t (t, e) {
            void 0 === t && (t = null), void 0 === e && (e = null), t || (t = new THREE.Object3D), this._target = t, e ? (this._parent = e, this._parent.add (this._target)) : this._parent = t.parent
        }

        return t.prototype.setPosVec = function (t) {
            return this.x = t.x, this.y = t.y, this.z = t.z, this
        }, t.prototype.setPos = function (t, e, i) {
            return this.x = t, this.y = e, this.z = i, this
        }, t.prototype.setRot = function (t, e, i) {
            return this.rotationX = t, this.rotationY = e, this.rotationZ = i, this
        }, t.prototype.getPos = function () {
            return this._target.position.clone ()
        }, t.prototype.getRot = function () {
            return this._target.rotation
        }, t.prototype.get2D = function (t, e) {
            void 0 === e && (e = null);
            var i = .5 * s.stw, n = .5 * s.sth, o = this._target.position.clone ();
            return e && o.add (e), o.project (t), o.x = Math.round ((o.x + 1) * i), o.y = Math.round ((1 - o.y) * n), new THREE.Vector2 (o.x, o.y)
        }, Object.defineProperty (t.prototype, "parent", {
            get: function () {
                return this._parent
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty (t.prototype, "target", {
            get: function () {
                return this._target
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty (t.prototype, "x", {
            get: function () {
                return this._target.position.x
            }, set: function (t) {
                this._target.position.x = t
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty (t.prototype, "y", {
            get: function () {
                return this._target.position.y
            }, set: function (t) {
                this._target.position.y = t
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty (t.prototype, "z", {
            get: function () {
                return this._target.position.z
            }, set: function (t) {
                this._target.position.z = t
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty (t.prototype, "rotationX", {
            get: function () {
                return this._target.rotation.x
            }, set: function (t) {
                this._target.rotation.x = t
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty (t.prototype, "rotationY", {
            get: function () {
                return this._target.rotation.y
            }, set: function (t) {
                this._target.rotation.y = t
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty (t.prototype, "rotationZ", {
            get: function () {
                return this._target.rotation.z
            }, set: function (t) {
                this._target.rotation.z = t
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty (t.prototype, "scale", {
            get: function () {
                return this._target.scale.x
            }, set: function (t) {
                t = this.__checkSc (t), this._target.scale.set (t, t, t)
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty (t.prototype, "scaleX", {
            get: function () {
                return this._target.scale.x
            }, set: function (t) {
                t = this.__checkSc (t), this._target.scale.x = t
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty (t.prototype, "scaleY", {
            get: function () {
                return this._target.scale.y
            }, set: function (t) {
                t = this.__checkSc (t), this._target.scale.y = t
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty (t.prototype, "scaleZ", {
            get: function () {
                return this._target.scale.z
            }, set: function (t) {
                t = this.__checkSc (t), this._target.scale.z = t
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty (t.prototype, "visible", {
            get: function () {
                return this._target.visible
            }, set: function (t) {
                this._target.visible = t
            }, enumerable: !0, configurable: !0
        }), t.prototype.__checkSc = function (t) {
            return 0 == t && (t = .001), t
        }, Object.defineProperty (t.prototype, "renderOrder", {
            get: function () {
                return this._target.renderOrder
            }, set: function (t) {
                this._target.renderOrder = t
            }, enumerable: !0, configurable: !0
        }), t
    } ();
    t.ThreeBase = r;
    var _ = function () {
        function t (t) {
            this._bone = t, this._defRot = t.rotation.clone (), this._defPos = t.position.clone ()
        }

        return Object.defineProperty (t.prototype, "bone", {
            get: function () {
                return this._bone
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty (t.prototype, "defRot", {
            get: function () {
                return this._defRot
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty (t.prototype, "defPos", {
            get: function () {
                return this._defPos
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty (t.prototype, "x", {
            get: function () {
                return this._bone.position.x
            }, set: function (t) {
                this._bone.position.x = t
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty (t.prototype, "y", {
            get: function () {
                return this._bone.position.y
            }, set: function (t) {
                this._bone.position.y = t
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty (t.prototype, "z", {
            get: function () {
                return this._bone.position.z
            }, set: function (t) {
                this._bone.position.z = t
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty (t.prototype, "rotationX", {
            get: function () {
                return this._bone.rotation.x
            }, set: function (t) {
                this._bone.rotation.x = t
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty (t.prototype, "rotationY", {
            get: function () {
                return this._bone.rotation.y
            }, set: function (t) {
                this._bone.rotation.y = t
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty (t.prototype, "rotationZ", {
            get: function () {
                return this._bone.rotation.z
            }, set: function (t) {
                this._bone.rotation.z = t
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty (t.prototype, "scale", {
            get: function () {
                return this._bone.scale.x
            }, set: function (t) {
                this._bone.scale.set (t, t, t)
            }, enumerable: !0, configurable: !0
        }), t.prototype.add = function () {
            for (var t, e = [], i = 0; i < arguments.length; i++) e[i] = arguments[i];
            (t = this._bone).add.apply (t, e)
        }, t
    } (), u = function (h) {
        function t (t, e, i) {
            void 0 === i && (i = !1);
            var n = h.call (this, t, e) || this;
            n._mesh = t, n._bones = [];
            for (var o = t.skeleton.bones.length, s = 0; s < o; s++) n._bones[s] = new _ (t.skeleton.bones[s]);
            var r = t.material;
            for (s = 0; s < r.length; s++) if (i) {
                var a = r[s], u = new THREE.MeshBasicMaterial ({map: a.map, skinning: !0});
                u.userData.outlineParameters = [], t.material[s] = u, t.material[s].needsUpdate = !0
            }
            return n
        }

        return __extends (t, h), Object.defineProperty (t.prototype, "mesh", {
            get: function () {
                return this._mesh
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty (t.prototype, "bones", {
            get: function () {
                return this._bones
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty (t.prototype, "acs", {
            get: function () {
                return this._acs
            }, enumerable: !0, configurable: !0
        }), t.prototype.logInfo = function () {
            var t = this._mesh;
            console.log ("mesh.morphTargetDictionary:"), console.log (t.morphTargetDictionary), console.log ("mesh.skeleton.bones:"), console.log (t.skeleton.bones)
        }, t.prototype.initAnimation = function (t, e) {
            void 0 === e && (e = -1);
            var i = new THREE.MMDAnimationHelper ({sync: !1});
            i.enabled.physics = !1, this._helper = i, this._helper.add (this._mesh, {animation: t, physics: !1});
            var n = this._helper.objects.get (this._helper.meshes[0]).mixer._actions;
            return this._acs = n, this.playAnimationId (e), n
        }, t.prototype.playAnimationId = function (t) {
            void 0 === t && (t = -1);
            for (var e = this._acs, i = 0; i < e.length; i++) e[i].weight = i == t ? 1 : 0
        }, t.prototype.update = function () {
            this._helper && this._helper.update (s.delta)
        }, t
    } (r);
    t.MMDManager = u;
    var h = function (n) {
        function t (t, e) {
            void 0 === e && (e = null);
            var i = n.call (this, t, e) || this;
            if (t.geometry) try {
                i._mesh = t
            } catch (t) {
            }
            return t.geometry && (i._geometry = t.geometry), t.material && (i._material = t.material, i._map = i._material.map, i._color = i._material.color), i
        }

        return __extends (t, n), t.prototype.centerTrans = function (t, e, i) {
            void 0 === t && (t = 0), void 0 === e && (e = 0), void 0 === i && (i = 0), this._geometry && this._geometry.applyMatrix ((new THREE.Matrix4).makeTranslation (t, e, i))
        }, t.prototype.updateTexture = function (t, e) {
            void 0 === e && (e = !1), this._material.map = t, this._material.needsUpdate = !0, this._map = this._material.map, this._material.blending = e ? THREE.AdditiveBlending : THREE.NormalBlending
        }, Object.defineProperty (t.prototype, "alpha", {
            get: function () {
                return this._material.opacity
            }, set: function (t) {
                this._material.opacity = t
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty (t.prototype, "mesh", {
            get: function () {
                return this._mesh
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty (t.prototype, "geometry", {
            get: function () {
                return this._geometry
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty (t.prototype, "material", {
            get: function () {
                return this._material
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty (t.prototype, "texOffsetX", {
            get: function () {
                return this._map.offset.x
            }, set: function (t) {
                this._map.offset.x = t
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty (t.prototype, "texOffsetY", {
            get: function () {
                return this._map.offset.y
            }, set: function (t) {
                this._map.offset.y = t
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty (t.prototype, "texRepeatX", {
            get: function () {
                return this._map.repeat.x
            }, set: function (t) {
                this._map.repeat.x = t
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty (t.prototype, "texRepeatY", {
            get: function () {
                return this._map.repeat.y
            }, set: function (t) {
                this._map.repeat.y = t
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty (t.prototype, "color", {
            get: function () {
                return this._color.getHex ()
            }, set: function (t) {
                this._color.setHex (t)
            }, enumerable: !0, configurable: !0
        }), t
    } (r), c = function (o) {
        function t (t, e) {
            var i = this, n = new THREE.Sprite (e);
            return (i = o.call (this, n, t) || this)._sprite = n, i
        }

        return __extends (t, o), Object.defineProperty (t.prototype, "sprite", {
            get: function () {
                return this._sprite
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty (t.prototype, "material", {
            get: function () {
                return this._sprite.material
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty (t.prototype, "rotation", {
            get: function () {
                return this._sprite.material.rotation
            }, set: function (t) {
                this._sprite.material.rotation = t
            }, enumerable: !0, configurable: !0
        }), t
    } (t.PrimBase = h);
    t.PrimSprite = c;
    var l = function (u) {
        function t (t, e, i, n) {
            void 0 === e && (e = null), void 0 === i && (i = -1), void 0 === n && (n = 1);
            var o, s = this, r = new THREE.Geometry;
            if (r.vertices = t, 0 <= i) {
                var a = new THREE.LineBasicMaterial ({color: i, linewidth: n, linecap: "square", linejoin: "miter"});
                o = new THREE.Line (r, a)
            } else (o = new THREE.Line (r)).visible = !1;
            return (s = u.call (this, o, e) || this)._line = o, s
        }

        return __extends (t, u), Object.defineProperty (t.prototype, "line", {
            get: function () {
                return this._line
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty (t.prototype, "material", {
            get: function () {
                return this._line.material
            }, enumerable: !0, configurable: !0
        }), t
    } (h);
    t.PrimLine = l;
    var p = function (h) {
        function t (t, e, i, n, o, s) {
            void 0 === i && (i = 1), void 0 === n && (n = 1), void 0 === o && (o = 1), void 0 === s && (s = 1);
            var r = this, a = new THREE.PlaneGeometry (i, n, o, s), u = new THREE.Mesh (a, e);
            return (r = h.call (this, u, t) || this)._mesh = u, r
        }

        return __extends (t, h), t
    } (h);
    t.PrimPlane = p;
    var f = function (c) {
        function t (t, e, i, n, o, s, r, a) {
            void 0 === s && (s = 1), void 0 === r && (r = 1), void 0 === a && (a = 1);
            var u = this, h = new THREE.BoxGeometry (i, n, o, s, r, a), _ = new THREE.Mesh (h, e);
            return (u = c.call (this, _, t) || this)._mesh = _, u
        }

        return __extends (t, c), t
    } (h);
    t.PrimCube = f;
    var d = function (u) {
        function t (t, e, i, n, o) {
            void 0 === n && (n = 8), void 0 === o && (o = 6);
            var s = this, r = new THREE.SphereGeometry (i, n, o), a = new THREE.Mesh (r, e);
            return (s = u.call (this, a, t) || this)._mesh = a, s
        }

        return __extends (t, u), t
    } (h);
    t.PrimSphere = d;
    var y = function (c) {
        function t (t, e, i, n, o, s, r, a) {
            void 0 === s && (s = 8), void 0 === r && (r = 1), void 0 === a && (a = !1);
            var u = this, h = new THREE.CylinderGeometry (i, n, o, s, r, a), _ = new THREE.Mesh (h, e);
            return (u = c.call (this, _, t) || this)._mesh = _, u
        }

        return __extends (t, c), t
    } (h);
    t.PrimCylinder = y;
    var m = function (h) {
        function t (t, e, i, n, o, s) {
            void 0 === o && (o = 8), void 0 === s && (s = 1);
            var r = this, a = new THREE.RingGeometry (i, n, o, s), u = new THREE.Mesh (a, e);
            return (r = h.call (this, u, t) || this)._mesh = u, r
        }

        return __extends (t, h), t
    } (h);
    t.PrimRing = m;
    var v = function (h) {
        function t (t, e, i, n, o, s) {
            void 0 === n && (n = 2), void 0 === o && (o = 8), void 0 === s && (s = 8);
            var r = this, a = new THREE.TorusGeometry (i, n, s, o), u = new THREE.Mesh (a, e);
            return (r = h.call (this, u, t) || this)._mesh = u, r
        }

        return __extends (t, h), t
    } (h);
    t.PrimTorus = v
} (three || (three = {})), function (c) {
    var a = aidnlib.Assets, o = aidnlib.Ref, t = three.ThreeBase, d = three.PrimPlane, e = three.PrimCube,
        l = function (t, e) {
            return t
        }, _ = function (t, e) {
            return t
        }, y = function (t) {
            return 0
        }, u = function (t, e, i) {
            this.x = t, this.y = e, this.z = i
        }, h = function () {
        }, i = function () {
            function t (t) {
                this.__timeoutId = -1, t.enabled = !1, this._pass = t
            }

            return Object.defineProperty (t.prototype, "pass", {
                get: function () {
                    return this._pass
                }, enumerable: !0, configurable: !0
            }), Object.defineProperty (t.prototype, "enabled", {
                get: function () {
                    return this._pass.enabled
                }, set: function (t) {
                    this._pass.enabled = t
                }, enumerable: !0, configurable: !0
            }), Object.defineProperty (t.prototype, "renderToScreen", {
                get: function () {
                    return this._pass.renderToScreen
                }, set: function (t) {
                    this._pass.renderToScreen = t
                }, enumerable: !0, configurable: !0
            }), t.prototype.start = function (t) {
                var e = this;
                void 0 === t && (t = 120), this.enabled = !0, clearTimeout (this.__timeoutId), this.__timeoutId = setTimeout (function () {
                    return e.__complete ()
                }, t)
            }, t.prototype.__complete = function () {
                this.enabled = !1
            }, t
        } (), n = function (i) {
            function t () {
                var t = this, e = new THREE.DotScreenPass (new THREE.Vector2 (0, 0), .5, .8);
                return (t = i.call (this, e) || this)._epass = e, t
            }

            return __extends (t, i), Object.defineProperty (t.prototype, "uniforms", {
                get: function () {
                    return this._epass.uniforms
                }, enumerable: !0, configurable: !0
            }), t.prototype.start = function () {
                i.prototype.start.call (this)
            }, t
        } (i), s = function (i) {
            function t () {
                var t = this, e = new THREE.GlitchPass;
                return ((t = i.call (this, e) || this)._epass = e).goWild = !0, e.amount = 200, t
            }

            return __extends (t, i), Object.defineProperty (t.prototype, "uniforms", {
                get: function () {
                    return this._epass.uniforms
                }, enumerable: !0, configurable: !0
            }), t.prototype.start = function (t) {
                void 0 === t && (t = 0), 0 == t ? (this._epass.seedX = l (.2, .3), this._epass.seedY = l (.2, .3)) : (this._epass.seedX = l (.9, 1.4), this._epass.seedY = l (.9, 1.4)), i.prototype.start.call (this)
            }, t
        } (i), r = function (i) {
            function t () {
                var t = this, e = new THREE.AfterimagePass (.95);
                return (t = i.call (this, e) || this)._epass = e, t
            }

            return __extends (t, i), Object.defineProperty (t.prototype, "uniforms", {
                get: function () {
                    return this._epass.uniforms
                }, enumerable: !0, configurable: !0
            }), t
        } (i), p = function (n) {
            function t () {
                var t = this, e = new THREE.Vector2 (window.innerWidth, window.innerHeight),
                    i = new THREE.PixelPass (e, 32);
                return (t = n.call (this, i) || this)._epass = i, t._ratio = Math.min (window.devicePixelRatio, 2), t
            }

            return __extends (t, n), Object.defineProperty (t.prototype, "uniforms", {
                get: function () {
                    return this._epass.uniforms
                }, enumerable: !0, configurable: !0
            }), t.prototype.start = function () {
                this._epass.uniforms.pixelSize.value = _ (32, 64), this._epass.uniforms.resolution.value.x = o.stw * this._ratio / _ (1, 3), this._epass.uniforms.resolution.value.y = o.sth * this._ratio / _ (1, 3), n.prototype.start.call (this)
            }, t
        } (i), f = function (i) {
            function t () {
                var t = this, e = new THREE.ShaderPass (THREE.SliceShader);
                return (t = i.call (this, e) || this)._epass = e, t
            }

            return __extends (t, i), Object.defineProperty (t.prototype, "uniforms", {
                get: function () {
                    return this._epass.uniforms
                }, enumerable: !0, configurable: !0
            }), Object.defineProperty (t.prototype, "amtX", {
                get: function () {
                    return this.uniforms.amtX.value
                }, set: function (t) {
                    this.uniforms.amtX.value = t
                }, enumerable: !0, configurable: !0
            }), Object.defineProperty (t.prototype, "divX", {
                get: function () {
                    return this.uniforms.divX.value
                }, set: function (t) {
                    this.uniforms.divX.value = t
                }, enumerable: !0, configurable: !0
            }), Object.defineProperty (t.prototype, "offX", {
                get: function () {
                    return this.uniforms.offX.value
                }, set: function (t) {
                    this.uniforms.offX.value = t
                }, enumerable: !0, configurable: !0
            }), Object.defineProperty (t.prototype, "amtY", {
                get: function () {
                    return this.uniforms.amtY.value
                }, set: function (t) {
                    this.uniforms.amtY.value = t
                }, enumerable: !0, configurable: !0
            }), Object.defineProperty (t.prototype, "divY", {
                get: function () {
                    return this.uniforms.divY.value
                }, set: function (t) {
                    this.uniforms.divY.value = t
                }, enumerable: !0, configurable: !0
            }), Object.defineProperty (t.prototype, "offY", {
                get: function () {
                    return this.uniforms.offY.value
                }, set: function (t) {
                    this.uniforms.offY.value = t
                }, enumerable: !0, configurable: !0
            }), t.prototype.start = function (t) {
                void 0 === t && (t = 0), 0 == t ? (this.amtY = 0, this.amtX = l (.3, .7), this.divX = l (5, 30), this.offX = l (0, 1)) : (this.amtX = 0, this.amtY = l (.3, .7), this.divY = l (5, 30), this.offY = l (0, 1)), i.prototype.start.call (this)
            }, t
        } (i), m = function (i) {
            function t () {
                var t = this, e = new THREE.ShaderPass (THREE.BinarizationShader);
                return (t = i.call (this, e) || this)._epass = e, t
            }

            return __extends (t, i), Object.defineProperty (t.prototype, "uniforms", {
                get: function () {
                    return this._epass.uniforms
                }, enumerable: !0, configurable: !0
            }), Object.defineProperty (t.prototype, "threshold", {
                get: function () {
                    return this.uniforms.threshold.value
                }, set: function (t) {
                    this.uniforms.threshold.value = t
                }, enumerable: !0, configurable: !0
            }), Object.defineProperty (t.prototype, "blend", {
                get: function () {
                    return this.uniforms.blend.value
                }, set: function (t) {
                    this.uniforms.blend.value = t
                }, enumerable: !0, configurable: !0
            }), Object.defineProperty (t.prototype, "colB", {
                get: function () {
                    return this.uniforms.colB.value
                }, set: function (t) {
                    this.uniforms.colB.value = t
                }, enumerable: !0, configurable: !0
            }), Object.defineProperty (t.prototype, "colW", {
                get: function () {
                    return this.uniforms.colW.value
                }, set: function (t) {
                    this.uniforms.colW.value = t
                }, enumerable: !0, configurable: !0
            }), t.prototype.start = function () {
                0 == c.Context.audioState ? this.threshold = .3 : this.threshold = .8, i.prototype.start.call (this)
            }, t
        } (i), v = function (i) {
            function t () {
                var t = this, e = new THREE.ShaderPass (THREE.RGBShiftShader);
                return (t = i.call (this, e) || this)._epass = e, t
            }

            return __extends (t, i), Object.defineProperty (t.prototype, "uniforms", {
                get: function () {
                    return this._epass.uniforms
                }, enumerable: !0, configurable: !0
            }), Object.defineProperty (t.prototype, "shiftR", {
                get: function () {
                    return this.uniforms.shiftR.value
                }, enumerable: !0, configurable: !0
            }), Object.defineProperty (t.prototype, "shiftG", {
                get: function () {
                    return this.uniforms.shiftG.value
                }, enumerable: !0, configurable: !0
            }), Object.defineProperty (t.prototype, "shiftB", {
                get: function () {
                    return this.uniforms.shiftB.value
                }, enumerable: !0, configurable: !0
            }), t.prototype.start = function () {
                this.shiftR.set (l (-.1, .1), l (-.1, .1)), this.shiftG.set (l (-.1, .1), l (-.1, .1)), this.shiftB.set (l (-.1, .1), l (-.1, .1)), i.prototype.start.call (this)
            }, t
        } (i), b = function (i) {
            function t () {
                var t = this, e = new THREE.ShaderPass (THREE.DotShader);
                return (t = i.call (this, e) || this)._epass = e, t
            }

            return __extends (t, i), Object.defineProperty (t.prototype, "uniforms", {
                get: function () {
                    return this._epass.uniforms
                }, enumerable: !0, configurable: !0
            }), Object.defineProperty (t.prototype, "resolution", {
                get: function () {
                    return this.uniforms.resolution.value
                }, enumerable: !0, configurable: !0
            }), Object.defineProperty (t.prototype, "baseColor", {
                get: function () {
                    return this.uniforms.baseColor.value
                }, enumerable: !0, configurable: !0
            }), Object.defineProperty (t.prototype, "space", {
                get: function () {
                    return this.uniforms.space.value
                }, set: function (t) {
                    this.uniforms.space.value = t
                }, enumerable: !0, configurable: !0
            }), Object.defineProperty (t.prototype, "size", {
                get: function () {
                    return this.uniforms.size.value
                }, set: function (t) {
                    this.uniforms.size.value = t
                }, enumerable: !0, configurable: !0
            }), t.prototype.start = function () {
                this.resolution.set (o.stw, o.sth), 0 == c.Context.audioState ? this.baseColor.set (0, 0, 0) : this.baseColor.set (1, 1, 1), this.space = _ (32, 80), this.size = _ (32, 128), i.prototype.start.call (this)
            }, t
        } (i), g = function () {
            function t (t, e, i) {
                this._effects = [], this._total = 0;
                var n = new THREE.RenderPass (i, e), o = new THREE.EffectComposer (t);
                this._renderer = t, this._camera = e, this._scene = i, this._comp = o, this._pass = n, this._init ()
            }

            return t.prototype._init = function () {
                this._effects.push (this._efDotSc = new n), this._effects.push (this._efGlitch = new s), this._effects.push (this._efAfter = new r), this._effects.push (this._efPixel = new p), this._effects.push (this._efSlice = new f), this._effects.push (this._efDot = new b), this._effects.push (this._efBinari = new m), this._effects.push (this._efRGB = new v), this._total = this._effects.length
            }, t.prototype.hit = function (t) {
                if (t < this._total) this._effects[t].start (); else switch (t -= this._total) {
                    case 0:
                        this._efGlitch.start ();
                        break;
                    case 1:
                        this._efPixel.start ();
                        break;
                    case 2:
                        this._efSlice.start ();
                        break;
                    case 3:
                        this._efBinari.start ();
                        break;
                    case 4:
                        this._efRGB.start ();
                        break;
                    case 5:
                        this._efGlitch.start (1);
                        break;
                    case 6:
                        this._efPixel.start ();
                        break;
                    case 7:
                        this._efSlice.start (1);
                        break;
                    case 8:
                        this._efBinari.start ();
                        break;
                    case 9:
                    default:
                        this._efRGB.start ()
                }
            }, t.prototype.setSize = function (t, e) {
                this._renderer.setSize (t, e), this._comp.setSize (t, e)
            }, t.prototype.render = function () {
                for (var t = this._total, e = [this._pass], i = 1, n = 0; n < t; n++) this._effects[n].enabled && (e[i] = this._effects[n].pass, i++);
                if (1 < i) {
                    for (n = 0; n < i; n++) e[n].renderToScreen = n == i - 1;
                    this._comp.passes = e, this._comp.render ()
                } else this._renderer.render (this._scene, this._camera)
            }, t
        } (), w = function () {
            function t (t) {
                this._bone = t, this._defRot = t.rotation.clone (), this._defPos = t.position.clone ()
            }

            return Object.defineProperty (t.prototype, "defRot", {
                get: function () {
                    return this._defRot
                }, enumerable: !0, configurable: !0
            }), Object.defineProperty (t.prototype, "defPos", {
                get: function () {
                    return this._defPos
                }, enumerable: !0, configurable: !0
            }), Object.defineProperty (t.prototype, "x", {
                get: function () {
                    return this._bone.position.x
                }, set: function (t) {
                    this._bone.position.x = t
                }, enumerable: !0, configurable: !0
            }), Object.defineProperty (t.prototype, "y", {
                get: function () {
                    return this._bone.position.y
                }, set: function (t) {
                    this._bone.position.y = t
                }, enumerable: !0, configurable: !0
            }), Object.defineProperty (t.prototype, "z", {
                get: function () {
                    return this._bone.position.z
                }, set: function (t) {
                    this._bone.position.z = t
                }, enumerable: !0, configurable: !0
            }), Object.defineProperty (t.prototype, "rotX", {
                get: function () {
                    return this._bone.rotation.x
                }, set: function (t) {
                    this._bone.rotation.x = t
                }, enumerable: !0, configurable: !0
            }), Object.defineProperty (t.prototype, "rotY", {
                get: function () {
                    return this._bone.rotation.y
                }, set: function (t) {
                    this._bone.rotation.y = t
                }, enumerable: !0, configurable: !0
            }), Object.defineProperty (t.prototype, "rotZ", {
                get: function () {
                    return this._bone.rotation.z
                }, set: function (t) {
                    this._bone.rotation.z = t
                }, enumerable: !0, configurable: !0
            }), t.prototype.motionRot = function (t, e) {
                void 0 === e && (e = null), e || (e = new THREE.Euler (0, 0, 0));
                var i = {ease: Power2.easeOut};
                0 != t.x && (this.rotX = this._defRot.x + t.x + e.x, i.rotX = this._defRot.x + e.x), 0 != t.y && (this.rotY = this._defRot.y + t.y + e.y, i.rotY = this._defRot.y + e.y), 0 != t.z && (this.rotZ = this._defRot.z + t.z + e.z, i.rotZ = this._defRot.z + e.z), TweenMax.killTweensOf (this), TweenMax.to (this, .15, i)
            }, t.prototype.motionPos = function (t, e) {
                void 0 === e && (e = null), e || (e = new THREE.Vector3 (0, 0, 0));
                var i = {ease: Power2.easeOut};
                0 != t.x && (this.x = this._defPos.x + t.x + e.x, i.x = this._defPos.x + e.x), 0 != t.y && (this.y = this._defPos.y + t.y + e.y, i.y = this._defPos.y + e.y), 0 != t.z && (this.z = this._defPos.z + t.z + e.z, i.z = this._defPos.z + e.z), TweenMax.killTweensOf (this), TweenMax.to (this, .2, i)
            }, t.CENTER = 0, t.UPPER_BODY = 2, t.NECK = 3, t.HEAD = 4, t.L_SHOULDER = 6, t.L_ARM = 7, t.R_SHOULDER = 11, t.R_ARM = 12, t.LOWER_BODY = 16, t.L_HAIR1 = 26, t.R_HAIR1 = 27, t.L_HAIR2 = 28, t.R_HAIR2 = 29, t.L_HAIR3 = 30, t.R_HAIR3 = 31, t
        } (), x = function () {
            function t (t) {
                this._obj = {}, this._offy = 0, this._isAll = !1, this._param = {r: 1.3, ra: 1}, this._mesh = t;
                var e = this._mesh.geometry, i = e.attributes.position.array;
                i.slice ? this._vts = i.slice () : this._vts = i.subarray (0, i.length);
                for (var n = i.length, o = {}, s = 0; s < n; s += 3) {
                    var r = new u (i[s], i[s + 1], i[s + 2]);
                    r.id = s;
                    var a = r.x + "_" + r.y + "_" + r.z;
                    o[a] || (o[a] = []), o[a].push (r)
                }
                this._obj = o, e.attributes.position.needsUpdate = !0, t.geometry.computeBoundingBox (), this._offy = .5 * (t.geometry.boundingBox.min.y - t.geometry.boundingBox.max.y)
            }

            return t.prototype.start = function () {
                var t = this;
                setInterval (function () {
                    return t._update ()
                }, 60)
            }, t.prototype.motionTwintail = function () {
                var t = this;
                this._param.r = l (2.2, 2.7) * T.aspRate (), this._param.ra = 1, TweenMax.killTweensOf (this._param), TweenMax.to (this._param, .4, {
                    r: 1.3,
                    ease: Power1.easeIn,
                    onComplete: function () {
                        return t._motionComplete ()
                    }
                })
            }, t.prototype.motionAll = function () {
                var t = this;
                this._isAll = !0, this._param.r = this._param.ra = l (1.8, 2.4) * T.aspRate (), TweenMax.killTweensOf (this._param), TweenMax.to (this._param, .4, {
                    ra: 1,
                    r: 1.3,
                    ease: Power1.easeOut,
                    onComplete: function () {
                        return t._motionComplete ()
                    }
                })
            }, t.prototype._motionComplete = function () {
                this._update (), this._isAll = !1, this._param.r = 1.3
            }, t.prototype._update = function () {
                var t, e, i, n = this._mesh.geometry, o = n.attributes.position.array;
                for (var s in this._obj) for (var r = this._obj[s], a = r.length, u = 0; u < a; u++) {
                    var h = r[u], _ = 2.465 < Math.abs (h.x) && h.z < -.45;
                    if (this._isAll || _) {
                        var c = this._param.r;
                        _ || (c = this._param.ra), 0 == u ? (t = o[h.id] = h.x * l (1, c), e = o[h.id + 1] = (h.y + this._offy) * l (1, c) - this._offy, i = o[h.id + 2] = h.z * l (1, c)) : (o[h.id] = t, o[h.id + 1] = e, o[h.id + 2] = i)
                    }
                }
                n.attributes.position.needsUpdate = !0
            }, t
        } (), E = function () {
            function t (t) {
                var e = this;
                this._bones = [];
                var i = a.get ("mesh");
                i.position.y = -6, i.castShadow = !0;
                for (var n = (this._mesh = i).skeleton.bones.length, o = 0; o < n; o++) this._bones[o] = new w (i.skeleton.bones[o]);
                this._bones[w.L_HAIR2].y -= 4, this._bones[w.R_HAIR2].y -= 4, this._verticesMng = new x (i), this._verticesMng.start ();
                var s = i.material;
                for (o = 0; o < s.length; o++) {
                    var r = s[o];
                    r.shininess = 0, r.userData.outlineParameters = {}, r.needsUpdate = !0
                }
                t.add (i), new THREE.MMDAnimationHelper ({sync: !1}).enabled.physics = !1, c.Context.main.addBeat (this, function (t) {
                    return e._beat (t)
                })
            }

            return Object.defineProperty (t.prototype, "vertices", {
                get: function () {
                    return this._verticesMng
                }, enumerable: !0, configurable: !0
            }), t.prototype.motionHead = function () {
                this._bones[w.NECK].motionRot (new THREE.Euler (y (35), 0, 0)), this._bones[w.L_ARM].motionRot (new THREE.Euler (0, 0, y (-30))), this._bones[w.R_ARM].motionRot (new THREE.Euler (0, 0, y (30)))
            }, t.prototype.motionTwintail = function () {
                this._bones[w.L_HAIR2].motionPos (new THREE.Vector3 (0, -4, 0), new THREE.Vector3 (0, -4)), this._bones[w.R_HAIR2].motionPos (new THREE.Vector3 (0, -4, 0), new THREE.Vector3 (0, -4))
            }, t.prototype.update = function () {
                var t = .5 * o.delta;
                this._mesh.rotateY (t)
            }, t.prototype._beat = function (t) {
                if (t % 2 == 0) {
                    var e = this._bones[w.CENTER];
                    e.y = e.defPos.y + .5, TweenMax.to (e, .2, {
                        y: e.defPos.y,
                        ease: Back.easeOut.config (1)
                    }), this._bones[w.L_ARM].motionRot (new THREE.Euler (0, 0, y (30)), new THREE.Euler (0, 0, y (-30))), this._bones[w.R_ARM].motionRot (new THREE.Euler (0, 0, y (-30)), new THREE.Euler (0, 0, y (30)))
                }
            }, t
        } (), T = function () {
            function t () {
            }

            return t.getSize = function (t) {
                var e = h.camera, i = o.stw / o.sth, n = (e.position.z - t) * Math.tan (y (e.fov / 2)) * 2.1;
                return new THREE.Vector2 (i * n, n)
            }, t.aspRate = function () {
                return Math.sqrt (o.stw / o.sth)
            }, t
        } (), k = function () {
            function t () {
            }

            return t.getCol = function (t) {
                if (this._matCol[t]) return this._matCol[t];
                var e = new THREE.MeshBasicMaterial ({color: t, side: THREE.DoubleSide});
                return this._matCol[t] = e
            }, t.getColLine = function (t) {
                if (this._matColLine[t]) return this._matColLine[t];
                var e = new THREE.LineMaterial ({color: t, linewidth: 1, dashed: !1});
                return this._matColLine[t] = e
            }, t._matCol = {}, t._matColLine = {}, t
        } (), P = function () {
            function t () {
            }

            return t.get = function (t) {
                if (!t.id) return console.log ("Que.get: class id is not defined"), null;
                var e = t.id;
                return this._que[e] && 0 < this._que[e].length ? this._que[e].pop () : new t
            }, t.add = function (t, e) {
                if (e.id) {
                    var i = e.id;
                    this._que[i] || (this._que[i] = []), this._que[i].push (t)
                } else console.log ("Que.add: class id is not defined")
            }, t._que = {}, t
        } (), R = function () {
            function t () {
            }

            return t.get = function () {
                return 1 == c.Context.audioState ? this.__get (this._COL_SET[1]) : this.__get (this._COL_SET[0])
            }, t.__get = function (t) {
                return t[_ (0, t.length - 1)]
            }, t.BG_COLS = [1120799, 15528183], t._COL_SET = [[16777215, 16777215, 9884371, 16738987], [5139564, 5139564, 9884371, 16738987]], t
        } (), M = function () {
            function t () {
                this._vts = []
            }

            return t.prototype.init = function (t) {
                void 0 === t && (t = 0);
                var e = this._plane;
                if (e) e.mesh.material = k.getCol (t); else {
                    var i = h.scene;
                    e = new d (i, k.getCol (t), 1, 1);
                    for (var n = (this._plane = e).geometry.vertices.length, o = 0; o < n; o++) this._vts[o] = e.geometry.vertices[o].clone ()
                }
                e.z = -30, e.visible = !1
            }, t.prototype.show = function (t) {
                var e = this;
                void 0 === t && (t = .7);
                var i = this._plane;
                i.z = -30, TweenMax.killTweensOf (i);
                for (var n = i.geometry.vertices.length, o = [], s = 0; s < n; s++) o[s] = s;
                aidn.util.shuffleArray (o);
                for (s = 0; s < n; s++) {
                    var r = o[s], a = i.geometry.vertices[r], u = this._vts[r], h = {x: u.x, y: u.y, ease: Bounce.easeOut};
                    0 == s && (h.onUpdate = function () {
                        return e._update ()
                    }, h.onComplete = function () {
                        return e._showComplete ()
                    });
                    var _ = Math.max (t - .1 * s, 0);
                    TweenMax.killTweensOf (a), TweenMax.set (a, {x: 0, y: 0}), TweenMax.to (a, _, h)
                }
                i.geometry.verticesNeedUpdate = !0, i.visible = !0, c.Context.main.addResize (this, function () {
                    return e._resize ()
                }), this._resize ()
            }, t.prototype.hide = function (t) {
                var e = this;
                void 0 === t && (t = .7);
                var i = this._plane;
                this._resize (), TweenMax.killTweensOf (i), TweenMax.to (i, t, {
                    z: i.z - 1, onComplete: function () {
                        return e._hideComplete ()
                    }
                })
            }, t.prototype._update = function () {
                this._plane.geometry.verticesNeedUpdate = !0
            }, t.prototype._showComplete = function () {
                this._plane.geometry.verticesNeedUpdate = !0
            }, t.prototype._hideComplete = function () {
                c.Context.main.removeResize (this), this._plane.visible = !1, P.add (this, t)
            }, t.prototype._resize = function () {
                var t = T.getSize (this._plane.z);
                this._plane.scaleX = t.x, this._plane.scaleY = t.y
            }, t.id = "bg", t
        } (), C = function () {
            function t () {
                this._cols = R.BG_COLS
            }

            return t.prototype.start = function () {
                this.__bg && this.__bg.hide (), this.__bg = P.get (M), this.__bg.init (this._cols[0]), this.__bg.show (0)
            }, t.prototype.change = function () {
                this.__bg.hide ();
                var t = c.Context.audioState;
                this.__bg = P.get (M), this.__bg.init (this._cols[t]), this.__bg.show (), 0 == t ? $ ("#ui svg,#bts").addClass ("start") : $ ("#ui svg,#bts").removeClass ("start")
            }, t
        } (), O = function (e) {
            function t () {
                var t = e.call (this, h.scene, k.getCol (R.get ()), 1, 1) || this;
                return t._prog = {p0: 0, p1: 0}, t
            }

            return __extends (t, e), t.prototype.init = function (t) {
                void 0 === t && (t = 0), this._type = t, this._mesh.material = k.getCol (R.get ())
            }, t.prototype.show = function (t) {
                void 0 === t && (t = null), this._callback = t, this.visible = !0;
                var e = l (.1, .4);
                switch (this._type) {
                    case 0:
                        this.z = 5;
                        var i = (s = T.getSize (this.z)).y * l (0, 1) - s.y / 2, n = new THREE.Vector3 (-s.x / 2, i, 0),
                            o = new THREE.Vector3 (s.x / 2, i, 0);
                        this._move (n, o, e);
                        break;
                    case 1:
                        this.z = 5;
                        var s, r = (s = T.getSize (this.z)).x * l (0, 1) - s.x / 2;
                        n = new THREE.Vector3 (r, s.y / 2, 0), o = new THREE.Vector3 (r, -s.y / 2, 0);
                        this._move (n, o, e);
                        break;
                    default:
                        this.z = 0;
                        n = new THREE.Vector3 (l (-10, 10), l (-10, 10), l (-10, 10)), o = new THREE.Vector3 (l (-10, 10), l (-10, 10), l (-10, 10));
                        this._move (n, o, e)
                }
            }, t.prototype._move = function (t, e, i) {
                var n = this;
                void 0 === i && (i = .1);
                this._tx = 0, this._ty = 0;
                this._vs = t, this._ve = e, this.visible = !1, Math.abs (t.x - e.x) < Math.abs (t.y - e.y) ? this._tx = i : this._ty = i;
                this._prog.p0 = this._prog.p1 = 0, TweenMax.to (this._prog, .24, {
                    p0: 1,
                    ease: Power2.easeOut,
                    onUpdate: function () {
                        return n._update ()
                    }
                }), TweenMax.to (this._prog, .24, {
                    p1: 1, ease: Power2.easeOut, delay: .24, onUpdate: function () {
                        return n._update ()
                    }, onComplete: function () {
                        return n._complete ()
                    }
                })
            }, t.prototype._update = function () {
                this.visible = !0;
                for (var t = this._vs, e = this._ve, i = this._tx, n = this._ty, o = this._geometry.vertices, s = this._prog.p0, r = this._prog.p1, a = 0; a < 4; a++) {
                    var u = a % 2 == 0 ? -1 : 1;
                    a < 2 ? (o[a].x = (e.x - t.x) * r + t.x + i * u, o[a].y = (e.y - t.y) * r + t.y + n * u, o[a].z = (e.z - t.z) * r + t.z) : (o[a].x = (e.x - t.x) * s + t.x + i * u, o[a].y = (e.y - t.y) * s + t.y + n * u, o[a].z = (e.z - t.z) * s + t.z)
                }
                this._geometry.verticesNeedUpdate = !0
            }, t.prototype._complete = function () {
                this.visible = !1, this._callback && this._callback (this)
            }, t
        } (d), z = function () {
            function t () {
                this._que = []
            }

            return t.prototype.show = function (t) {
                var e = this;
                void 0 === t && (t = 0);
                for (var i = _ (2, 3), n = 0; n < i; n++) {
                    var o, s;
                    switch (o = 0 < this._que.length ? this._que.pop () : new O, t) {
                        case 0:
                            s = _ (0, 1);
                            break;
                        case 1:
                            s = 2;
                            break;
                        default:
                            s = _ (0, 2)
                    }
                    o.init (s), o.show (function (t) {
                        return e._complete (t)
                    })
                }
            }, t.prototype._complete = function (t) {
                this._que.push (t)
            }, t
        } (), j = function (o) {
            function t () {
                var t = o.call (this, h.scene, k.getCol (R.get ()), 1, 1, 2, 2) || this;
                t._vts = [];
                for (var e = t._geometry.vertices, i = e.length, n = 0; n < i; n++) t._vts[n] = e[n].clone ();
                return t
            }

            return __extends (t, o), t.prototype.init = function () {
                this._mesh.material = k.getCol (R.get ())
            }, t.prototype.show = function (t) {
                var e = this;
                void 0 === t && (t = null), this.z = -20, this._callback = t, this.visible = !0;
                for (var i = this._geometry.vertices, n = (i = this._geometry.vertices).length, o = 0; o < n; o++) i[o].x = this._vts[o].x, i[o].y = this._vts[o].y, i[o].z = this._vts[o].z;
                var s = 0, r = 2 * T.aspRate ();
                for (o = 0; o < n; o++) if (4 != o) {
                    var a = l (.2, .5);
                    s = Math.max (s, a), TweenMax.to (i[o], a, {
                        x: this._vts[o].x * l (3, 17) * r,
                        y: this._vts[o].y * l (3, 17) * r,
                        ease: Power2.easeOut
                    })
                }
                TweenMax.to (this, s, {
                    z: this.z - 1, onUpdate: function () {
                        return e._update ()
                    }, onComplete: function () {
                        return e._complete ()
                    }
                }), this._geometry.verticesNeedUpdate = !0
            }, t.prototype._update = function () {
                this._geometry.verticesNeedUpdate = !0
            }, t.prototype._complete = function () {
                this.visible = !1, this._callback && this._callback (this)
            }, t
        } (d), H = function () {
            function t () {
                this._que = []
            }

            return t.prototype.show = function () {
                var t, e = this;
                (t = 0 < this._que.length ? this._que.pop () : new j).init (), t.show (function (t) {
                    return e._complete (t)
                })
            }, t.prototype._complete = function (t) {
                this._que.push (t)
            }, t
        } (), B = function (n) {
            function t () {
                for (var t = n.call (this, h.scene, null, 1, 1, 1) || this, e = [], i = 0; i < 6; i++) e[i] = k.getCol (R.get ());
                return t._mesh.material = e, t
            }

            return __extends (t, n), t.prototype.init = function (t) {
                this.scale = .5 * t;
                for (var e = [], i = 0; i < 6; i++) e[i] = k.getCol (R.get ());
                this._mesh.material = e
            }, t.prototype.show = function (t) {
                var e = this;
                void 0 === t && (t = null), this._callback = t, this.visible = !0, this.z = l (-10, 10);
                var i = T.getSize (this.z).multiplyScalar (.46);
                this.x = l (-i.x, i.x), this.y = l (-i.y, i.y);
                var n = Math.random () < .5 ? 1 : -1, o = Math.random () < .5 ? 1 : -1;
                this.rotationX = l (0, 1), this.rotationY = l (0, 1);
                var s = {
                    rotationX: this.rotationX + n,
                    rotationY: this.rotationX + o,
                    ease: Power2.easeOut,
                    onComplete: function () {
                        return e._complete ()
                    }
                };
                TweenMax.killTweensOf (this), TweenMax.to (this, .4, s)
            }, t.prototype._complete = function () {
                this.visible = !1, this._callback && this._callback (this)
            }, t
        } (e), I = function () {
            function t () {
                this._que = []
            }

            return t.prototype.show = function (t) {
                var e = this;
                void 0 === t && (t = 0);
                for (var i = _ (1, 3), n = 0; n < i; n++) {
                    var o;
                    (o = 0 < this._que.length ? this._que.pop () : new B).init (l (2, 6)), o.show (function (t) {
                        return e._complete (t)
                    })
                }
            }, t.prototype._complete = function (t) {
                this._que.push (t)
            }, t
        } (), S = function (e) {
            function t () {
                var t = e.call (this, null, h.scene) || this;
                return t._scales = [[{x: 2.2, y: 1}, {x: 4, y: .4}], [{y: 3.2, x: .7}, {y: 5, x: .5}]], t
            }

            return __extends (t, e), t.prototype.init = function (t, e, i) {
                void 0 === t && (t = 2), void 0 === e && (e = 0), void 0 === i && (i = 0);
                var n = this._plane;
                n || (n = new d (this.target, s)), n.alpha = .2, n.scaleX = n.scaleY = 1, n.rotationZ = y (90), n.z = t, this._type = i;
                var o = this._scales[this._type][0];
                n.scaleY = o.y, n.scaleX = o.x;
                var s = k.getCol (e);
                n.mesh.material = s, this._plane = n
            }, t.prototype.show = function (t) {
                var e = this;
                void 0 === t && (t = null), this._callback = t;
                var i = this._plane;
                this.visible = i.visible = !0;
                var n = this._scales[this._type][1];
                i.y = -18, TweenMax.killTweensOf (i), TweenMax.to (i, .7, {
                    y: 18,
                    scaleX: n.x,
                    scaleY: n.y,
                    ease: Power1.easeOut,
                    onComplete: function () {
                        return e._complete ()
                    }
                })
            }, t.prototype._complete = function () {
                this.visible = this._plane.visible = !1, this._callback && this._callback (this)
            }, t
        } (t), A = function () {
            function t () {
                this._que = []
            }

            return t.prototype.show = function (t) {
                var e = this;
                void 0 === t && (t = 0);
                for (var i = _ (3, 6), n = 360 / i, o = l (7, 11) * T.aspRate (), s = y (l (0, 90)), r = R.get (), a = 0; a < i; a++) {
                    var u;
                    (u = 0 < this._que.length ? this._que.pop () : new S).init (o, r, t);
                    var h = y (n * a);
                    u.rotationY = h + s, u.show (function (t) {
                        return e._complete (t)
                    })
                }
            }, t.prototype._complete = function (t) {
                this._que.push (t)
            }, t
        } (), L = function (i) {
            function t () {
                var t = this, e = new THREE.Wireframe;
                return (t = i.call (this, e, h.scene) || this)._wireframe = e, t._geoms = [new THREE.WireframeGeometry2 (new THREE.TetrahedronBufferGeometry (10, 0)), new THREE.WireframeGeometry2 (new THREE.BoxBufferGeometry (10, 10, 10, 1, 1, 1)), new THREE.WireframeGeometry2 (new THREE.IcosahedronBufferGeometry (10, 0)), new THREE.WireframeGeometry2 (new THREE.IcosahedronBufferGeometry (10, 1))], t.visible = !1, t
            }

            return __extends (t, i), t.prototype.init = function (t, e) {
                void 0 === t && (t = 10), void 0 === e && (e = 0), t *= T.aspRate (), this._wireframe.geometry = this._geoms[e % 4];
                var i = k.getColLine (R.get ());
                i.linewidth = l (1, 6), i.resolution.set (o.stw, o.sth), i.needsUpdate = !0, this._wireframe.material = i;
                var n = t / 10;
                this._wireframe.computeLineDistances (), this._wireframe.scale.set (n, n, n)
            }, t.prototype.show = function (t) {
                var e = this;
                void 0 === t && (t = null), this._callback = t, this.visible = !0;
                var i = Math.random () < .5 ? 1 : -1, n = Math.random () < .5 ? 1 : -1;
                this.rotationX = l (0, 1), this.rotationY = l (0, 1);
                var o = {
                    rotationX: this.rotationX + i,
                    rotationY: this.rotationX + n,
                    ease: Power2.easeOut,
                    onComplete: function () {
                        return e._complete ()
                    }
                };
                TweenMax.killTweensOf (this), TweenMax.to (this, .4, o)
            }, t.prototype._complete = function () {
                this.visible = !1, this._callback && this._callback (this)
            }, t
        } (t), q = function () {
            function t () {
            }

            return t.prototype.show = function () {
                var t = l (8, 12), e = _ (0, 3), i = this._wire;
                i || (i = this._wire = new L), this._wire.init (t, e), this._wire.show ()
            }, t
        } (), U = function (e) {
            function t () {
                var t = e.call (this, null, h.scene) || this;
                return t._planes = [], t
            }

            return __extends (t, e), t.prototype.init = function (t, e, i) {
                void 0 === t && (t = 10), void 0 === e && (e = 8), void 0 === i && (i = .3);
                for (var n = [], o = 360 / e, s = 0; s < e; s++) {
                    var r = new THREE.Vector3 (0, 0, 0), a = y (o * s);
                    r.x = Math.cos (a) * t, r.y = Math.sin (a) * t, n[s] = r
                }
                n[s] = n[0];
                var u = R.get ();
                for (s = 0; s < e; s++) {
                    var h = n[s], _ = n[s + 1], c = k.getCol (u), l = this._planes[s];
                    l || (l = new d (this._target, c)), l.visible = !0, l.mesh.material = c;
                    var p = l.geometry.vertices;
                    p[0].x = p[1].x = h.x, p[0].y = p[1].y = h.y, p[0].z = i, p[1].z = -i, p[2].x = p[3].x = _.x, p[2].y = p[3].y = _.y, p[2].z = i, p[3].z = -i, l.geometry.verticesNeedUpdate = !0, this._planes[s] = l
                }
                var f = this._planes.length;
                for (s = e; s < f; s++) this._planes[s].visible = !1
            }, t.prototype.show = function (t, e) {
                var i = this;
                if (void 0 === t && (t = null), void 0 === e && (e = 0), this._callback = t, this.visible = !0, this.rotationX = this.rotationY = 0, 0 == e) this.rotationX = y (90), this.y = -20, TweenMax.to (this, .8, {
                    y: 20,
                    ease: Power1.easeOut,
                    onComplete: function () {
                        return i._complete ()
                    }
                }); else {
                    this.y = 0;
                    var n = l (0, 90), o = Math.random () < .5 ? 90 : -90, s = {
                        ease: Power2.easeOut, onComplete: function () {
                            return i._complete ()
                        }
                    };
                    Math.random () < .6 ? (this.rotationY = y (n), s.rotationY = y (n + o)) : (this.rotationX = y (n), s.rotationX = y (n + o)), TweenMax.killTweensOf (this), TweenMax.to (this, .4, s)
                }
            }, t.prototype._complete = function () {
                this.visible = !1, this._callback && this._callback (this)
            }, t
        } (t), X = function () {
            function t () {
                this._que = []
            }

            return t.prototype.show = function (t) {
                var e = this;
                void 0 === t && (t = 0);
                var i, n = l (6, 10) * T.aspRate (), o = _ (3, 8), s = l (.15, .6);
                0 == t ? ((i = 0 < this._que.length ? this._que.pop () : new U).init (n, o, s), i.show (function (t) {
                    return e._complete (t)
                })) : ((i = this._poly) || (i = this._poly = new U), i.init (n, o, 1.35 * s), i.show (null, t))
            }, t.prototype._complete = function (t) {
                this._que.push (t)
            }, t
        } (), D = function () {
            function t () {
                var t = this;
                this._ratio = 1, l = aidn.math.rand, _ = aidn.math.randInt, y = aidn.math.toRad;
                var e = new THREE.PerspectiveCamera (45, window.innerWidth / window.innerHeight, .01, 200);
                e.position.z = 25;
                var i = new THREE.Scene;
                i.background = new THREE.Color (1118481);
                var n = new THREE.AmbientLight (11184810);
                i.add (n);
                var o = new THREE.DirectionalLight (3355443);
                o.position.set (0, 1, -6).normalize (), o.castShadow = !0, i.add (o);
                var s = Math.min (window.devicePixelRatio, 2);
                this._ratio = s;
                var r = document.getElementById ("view"), a = new THREE.WebGLRenderer ({antialias: !0});
                a.setPixelRatio (s), a.setSize (window.innerWidth, window.innerHeight), r.appendChild (a.domElement), this._renderer = a, this._scene = i, this._camera = e, h.scene = i, h.camera = e, this._effeMng = new g (a, e, i), this._model = new E (i), this._bgMng = new C, this._cylinderMng = new A, this._polygonMng = new X, this._wireMng = new q, this._cubeMng = new I, this._squareMng = new H, this._lineMng = new z, this._ids = [];
                for (var u = 0; u < 31; u++) this._ids[u] = u;
                aidn.util.shuffleArray (this._ids), this._ids.push (31), c.Context.main.addUpdate (this, function () {
                    return t._update ()
                }), c.Context.main.addResize (this, function () {
                    return t._resize ()
                })
            }

            return t.prototype.start = function () {
                this._bgMng.start (), $ ("#view").css ("display", "block")
            }, t.prototype.stop = function (t) {
                var e = this;
                void 0 === t && (t = 0), TweenMax.delayedCall (t, function () {
                    return e._stop ()
                })
            }, t.prototype._stop = function () {
                $ ("#view").css ("display", "none")
            }, t.prototype.hit = function (t) {
                switch (t = this._ids[t]) {
                    case 18:
                        this._lineMng.show (2);
                        break;
                    case 19:
                        this._lineMng.show (1);
                        break;
                    case 20:
                        this._cubeMng.show (1);
                        break;
                    case 21:
                        this._polygonMng.show (1);
                        break;
                    case 22:
                        this._model.vertices.motionTwintail ();
                        break;
                    case 23:
                        this._model.vertices.motionAll ();
                        break;
                    case 24:
                        this._lineMng.show ();
                        break;
                    case 25:
                        this._squareMng.show ();
                        break;
                    case 26:
                        this._cubeMng.show ();
                        break;
                    case 27:
                        this._wireMng.show ();
                        break;
                    case 28:
                        this._polygonMng.show (1);
                        break;
                    case 29:
                        this._polygonMng.show ();
                        break;
                    case 30:
                        this._cylinderMng.show ();
                        break;
                    case 31:
                        this._bgMng.change ();
                        break;
                    default:
                        16 == t && this._cylinderMng.show (1), this._effeMng.hit (t)
                }
            }, t.prototype._update = function () {
                this._model.update (), this._effeMng.render ()
            }, t.prototype._resize = function () {
                var t = o.stw, e = o.sth;
                this._camera.fov = 1 < t / e ? 39 : 49, this._camera.aspect = t / e, this._camera.updateProjectionMatrix (), this._effeMng.setSize (t, e), this._effeMng.render ()
            }, t
        } ();
    c.ThreeManager = D
} (main || (main = {})), function (n) {
    var o = aidnlib.SequentialCommand, s = aidnlib.ScriptsLoaderCommand, r = aidnlib.JsonBase64LoadCommand,
        a = aidnlib.JsonBase64Type, u = aidnlib.CommandEvent, h = aidnlib.Assets, _ = aidnlib.Ref;
    n.check = function () {
        !function t () {
            "undefined" == typeof aidn || "undefined" == typeof jQuery || "undefined" == typeof THREE || "undefined" == typeof TweenMax ? setTimeout (function () {
                return t ()
            }, 10) : $ (function () {
                (new g).initialize ()
            })
        } ()
    };
    var e, t, c = function () {
        function t () {
        }

        return t.isMobile = !1, t.isJa = !0, t.isFull = !1, t.isFeedback = !0, t.state = 0, t.audioState = 0, t
    } ();
    n.Context = c, (t = e || (e = {}))[t.TOP = 0] = "TOP", t[t.MAIN = 1] = "MAIN";
    var l = function () {
        function t () {
        }

        return t.BGM = "data/bgm.mp3", t.BGM_BLANK = "../shared/sound/blank.mp3", t.LINK_CONTENT = "../contents/", t
    } (), p = function (e) {
        function t () {
            var t = e.call (this, 2) || this;
            return t.add (new s (["https://cdn.jsdelivr.net/npm/jquery.easing@1.4.1/jquery.easing.min.js"])), t.add (new aidnlib.AudioLoadCommand (l.BGM_BLANK)), t
        }

        return __extends (t, e), t
    } (o), f = function (n) {
        function t () {
            var t = n.call (this, 1) || this, e = new o (4);
            e.add (new aidnlib.AudioLoadCommand (l.BGM)), e.add (new s (["js/lib.js"])), e.add (new r ("data/sound/sound.json")), e.add (new r ("data/miku/tex.json", a.THREE)), t.add (e, 9);
            var i = "data/miku/box_miku.pmd";
            return 0 <= navigator.userAgent.indexOf ("Firefox") && (i = "data/miku_ff/box_miku.pmd"), t.add (new three.ThreePmdLoadCommand (i), 1), t
        }

        return __extends (t, n), t
    } (o), d = function () {
        function t () {
            this._ori = 0, this._dx = 0, this._dy = 0, this._rx = 0, this._ry = 0, this.__updates = {}, this.__keyCount = 0, c.device = this
        }

        return t.prototype.start = function () {
            var e = this;
            c.isMobile ? (window.addEventListener ("deviceorientation", function (t) {
                return e._deviceorientation (t)
            }), window.addEventListener ("orientationchange", function (t) {
                return e._orientationchange (t)
            }, !1), this._orientationchange ()) : ($ ("body").on ("mousemove", function (t) {
                return e._mouseMove (t)
            }), c.main.addUpdate (this, function () {
                return e._update ()
            }))
        }, t.prototype.addUpdate = function (t, e) {
            t.__keyx || (t.__keyx = "keyx_" + this.__keyCount, this.__keyCount++), this.__updates[t.__keyx] = e
        }, t.prototype.removeUpdate = function (t) {
            t.__keyx && delete this.__updates[t.__keyx]
        }, t.prototype._updateRate = function (t, e) {
            for (var i in this.__updates) this.__updates[i] (t, e)
        }, t.prototype._mouseMove = function (t) {
            var e = _.stw / 2, i = _.sth / 2, n = aidn.event.getPos (t);
            this._dx = -(n.x - e) / e, this._dy = -(n.y - i) / i
        }, t.prototype._update = function () {
            this._rx += (this._dx - this._rx) / 12, this._ry += (this._dy - this._ry) / 12, this._updateRate (this._rx, this._ry)
        }, t.prototype._deviceorientation = function (t) {
            var e = t.gamma, i = t.beta;
            if (0 != this._ori) {
                var n = i;
                i = e, e = n, 90 == this._ori && (i = -i), -90 == this._ori && (e = -e)
            }
            var o = e / 30;
            o = Math.max (o, -1.5), o = Math.min (o, 1.5);
            var s = i / 30;
            s = Math.max (s, -1.5), s = Math.min (s, 1.5), this._updateRate (o, s)
        }, t.prototype._orientationchange = function (t) {
            void 0 === t && (t = null), this._ori = parseInt (window.orientation.toString ()) || 0, -1 == this._ori && (this._ori = 0)
        }, t
    } ();
    n.DeviceManager = d;
    var y = function () {
        function t (t) {
            this._wa = t, this._filterBiquad = t.initBiquadFilter ("allpass")
        }

        return Object.defineProperty (t.prototype, "filterBiquad", {
            get: function () {
                return this._filterBiquad
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty (t.prototype, "volume", {
            get: function () {
                return this._wa.volume
            }, set: function (t) {
                this._wa.volume = t
            }, enumerable: !0, configurable: !0
        }), t.prototype.play = function (t, e, i) {
            void 0 === t && (t = 1), void 0 === e && (e = 0), void 0 === i && (i = 0), this._wa.play (0, !1, null, i, t, e)
        }, t.prototype.stop = function (t) {
            var e = this;
            void 0 === t && (t = 0), t <= 0 ? this._wa.stop () : TweenMax.to (this._wa, t, {
                volume: 0,
                ease: Power0.easeNone,
                onComplete: function () {
                    return e._wa.stop ()
                }
            })
        }, t
    } (), i = function () {
        function t (t) {
            void 0 === t && (t = ""), this._was = [];
            for (var e = this._total = 0; e < 1e3; e++) {
                var i = h.get (t + e + ".mp3");
                if (!i) break;
                this._was[e] = new y (i)
            }
            this._total = this._was.length
        }

        return Object.defineProperty (t.prototype, "total", {
            get: function () {
                return this._total
            }, enumerable: !0, configurable: !0
        }), t.prototype.play = function (t, e, i) {
            void 0 === e && (e = 1), void 0 === i && (i = 0), t %= this._total, this._was[t].play (e, i)
        }, t.prototype.stop = function (t) {
            t %= this._total, this._was[t].stop ()
        }, t.prototype.copyBiquad = function (t, e) {
            t %= this._total;
            var i = this._was[t].filterBiquad;
            i.type = e.type, i.frequency.value = e.frequency.value
        }, t
    } (), m = function () {
        function t () {
            this.BPM = 388, this._startTime = 0, this._fl = !1, this.__startFl = !1, this._nowBeat = -1, this.__id0 = -1, this.__id1 = -1, this._bgmVol = .8, this._beatCt = -1, this.__keyCount = 0, this.__beats = {}, this._isUseDevice = !1, this._volRate = 1, this._beat = 6e4 / this.BPM, this._aseta = new i (""), this._asetb = new i ("b"), this._ids = [];
            for (var t = 0; t < 31; t++) this._ids[t] = t;
            for (aidn.util.shuffleArray (this._ids), this._ids.push (31), this._volsa = [], this._volsb = [], t = 0; t < 32; t++) this._volsa[t] = 1, this._volsb[t] = 1;
            this._volsa[2] = 1.2, this._volsa[8] = .65, this._volsa[9] = .6, this._volsa[13] = .85, this._volsa[14] = 1.1, this._volsa[15] = .5, this._volsa[16] = .65, this._volsa[18] = 1.25, this._volsa[19] = 1.2, this._volsa[20] = 1.2, this._volsa[28] = .7, this._volsa[29] = .7, this._volsa[30] = .75, this._volsb[9] = .4, this._volsb[12] = .65, this._volsb[15] = .6, this._volsb[16] = 1.25, this._volsb[17] = 1.2, this._volsb[24] = 1.25, this._volsb[29] = .85, this._volsb[30] = .7
        }

        return t.prototype.setVolume = function (t) {
            this._bgmVol = t, this._bgm && (TweenMax.killTweensOf (this._bgm), TweenMax.to (this._bgm, .8, {
                volume: this._bgmVol,
                ease: Power0.easeNone
            }))
        }, t.prototype.start = function () {
            var i = this;
            this.__startFl || (this.__startFl = !0, this._bgmVol = .8, this._bgm || (this._bgm = new y (h.get (l.BGM).audio)), this._bgm.play (0, 0, 0), this._bgm.volume = 0, TweenMax.killTweensOf (this._bgm), TweenMax.to (this._bgm, 1.6, {
                volume: this._bgmVol,
                ease: Power0.easeNone
            }), this._startTime = 1e3 * aidn.___waContext.currentTime, c.main.addUpdate (this, function () {
                return i._update ()
            }), c.device.addUpdate (this, function (t, e) {
                return i._updateDevice (t, e)
            }))
        }, t.prototype.stop = function () {
            this.__startFl = !1, this._bgm.stop (), c.main.removeUpdate (this), c.device.removeUpdate (this)
        }, t.prototype.playShot = function (t) {
            return this._action (t)
        }, t.prototype._action = function (t) {
            var e = 1e3 * aidn.___waContext.currentTime - this._startTime, i = Math.floor (e / this._beat);
            if (this._nowBeat == i) return i;
            var n = (((this._nowBeat = i) + 1) * this._beat - e) / 1e3,
                o = 0 == c.audioState ? this._aseta : this._asetb, s = 0 == c.audioState ? this._volsa : this._volsb,
                r = this._ids[t] % o.total;
            if (this.__id0 = r, this.__id1 = -1, o.copyBiquad (r, this._bgm.filterBiquad), o.play (r, s[r] * this._volRate, n), .89 < Math.random ()) {
                .3 < Math.random () && (r = aidn.math.randInt (0, o.total - 1));
                var a = ((i + 1.5) * this._beat - e) / 1e3;
                o.copyBiquad (r, this._bgm.filterBiquad), o.play (r, .75 * s[r] * this._volRate, a), this.__id1 = r
            }
            return i
        }, t.prototype.addBeat = function (t, e) {
            t.__key3 || (t.__key3 = "key_" + this.__keyCount, this.__keyCount++), this.__beats[t.__key3] = e
        }, t.prototype.removeBeat = function (t) {
            t.__key3 && delete this.__beats[t.__key3]
        }, t.prototype.useDevice = function (t) {
            void 0 === t && (t = !1), c.isMobile || (t ? this._isUseDevice = !0 : (this._isUseDevice = !1, this._bgm.filterBiquad.type = "allpass"))
        }, t.prototype._update = function () {
            var t = 1e3 * aidn.___waContext.currentTime - this._startTime, e = Math.floor (t / this._beat);
            if (e != this._beatCt) {
                for (var i in this.__beats) this.__beats[i] (e);
                this._beatCt = e
            }
            var n = e % 32;
            if (28 <= n) {
                if (this._fl) return;
                this._fl = !0;
                var o = ((e + 32 - n) * this._beat - t) / 1e3;
                this._bgm.play (this._bgmVol, o)
            } else 1 <= n && n < 4 && (this._fl = !1)
        }, t.prototype._updateDevice = function (t, e) {
            if (!c.isMobile) {
                if (!this._isUseDevice) return;
                t *= 1.5
            }
            var i, n = this._bgm.filterBiquad;
            if (this._volRate = 1, t < -.1) {
                i = Math.min (-t - .1, 1), n.type = "lowpass";
                var o = n.frequency.value = 22050 - 21050 * i;
                o < 3e3 && (this._volRate = .9 + .1 * (o - 1e3) / 2e3)
            } else .1 < t ? (i = Math.min (t - .1, 1), n.type = "highpass", n.frequency.value = 2400 * i) : n.type = "allpass"
        }, t
    } (), v = function () {
        function t (t) {
            this._target = t
        }

        return t.prototype.touch = function () {
            var t = this;
            c.isFeedback && this._target.stop ().css ({
                opacity: 1,
                visibility: "visible"
            }).animate ({opacity: 0}, 200, "linear", function () {
                return t._complete ()
            })
        }, t.prototype._reset = function () {
            this._target.removeClass ("last")
        }, t.prototype._setlast = function () {
            this._target.addClass ("last")
        }, t.prototype._complete = function () {
            this._target.css ({visibility: "hidden"})
        }, t
    } (), b = function () {
        function t (t) {
            this._buttons = [], this._nx = 4, this._ny = 8, this._preId = -1, this._isStart = !1, this._hitHandler = t, this._init ()
        }

        return t.prototype._init = function () {
            for (var t = this, e = "", i = 0; i < 8; i++) {
                e += "<div>", this._buttons[i] = [];
                for (var n = 0; n < 8; n++) e += "<span class='b'></span>";
                e += "</div>"
            }
            $ ("#bts").html (e);
            for (var o = $ (".b"), s = o.length, r = 0; r < s; r++) {
                var a = $ (o.get (r)), u = r % 8, h = Math.floor (r / 8);
                this._buttons[h][u] = new v (a)
            }
            c.main.addResize (this, function () {
                return t._resize ()
            }), this._resize ()
        }, t.prototype.start = function () {
            this.__on ()
        }, t.prototype.stop = function () {
            this.__off ()
        }, t.prototype.__on = function () {
            var e = this;
            this._isStart = !1, $ ("#view").css ("cursor", "pointer"), c.isMobile || ($ ("#view").on ("mousedown", function (t) {
                return e.__start (t)
            }), $ ("#view").on ("mousemove", function (t) {
                return e.__move (t)
            }), $ ("#view").on ("mouseup", function (t) {
                return e.__end (t)
            }), $ (window).on ("keydown", function (t) {
                return e.__keydown (t)
            }), $ (window).on ("keyup", function (t) {
                return e.__keyup (t)
            })), (c.isMobile || window.TouchEvent) && ($ ("#view").on ("touchstart", function (t) {
                return e.__start (t)
            }), $ ("#view").on ("touchmove", function (t) {
                return e.__move (t)
            }), $ ("#view").on ("touchend", function (t) {
                return e.__end (t)
            }))
        }, t.prototype.__off = function () {
            $ ("#view").css ("cursor", "auto"), c.isMobile || ($ ("#view").off ("mousedown"), $ ("#view").off ("mousemove"), $ ("#view").off ("mouseup"), $ (window).off ("keydown"), $ (window).off ("keyup")), (c.isMobile || window.TouchEvent) && ($ ("#view").off ("touchstart"), $ ("#view").off ("touchmove"), $ ("#view").off ("touchend"))
        }, t.prototype.__start = function (t) {
            this._isStart = !0;
            var e = aidn.event.getPos (t);
            if (this.__hitPos (e.x, e.y), t.originalEvent && t.originalEvent.touches) for (var i = t.originalEvent.touches.length, n = 1; n < i; n++) {
                var o = t.originalEvent.touches[n];
                this.__hitPos (o.pageX, o.pageY)
            }
            c.main.audio.useDevice (!1)
        }, t.prototype.__move = function (t) {
            if (this._isStart) {
                var e = aidn.event.getPos (t);
                this.__hitPos (e.x, e.y)
            }
            t.preventDefault ()
        }, t.prototype.__end = function (t) {
            this._isStart && (this.__hit (-1), this._isStart = !1)
        }, t.prototype.__keydown = function (t) {
            var e = -1;
            e = 65 <= t.keyCode ? t.keyCode - 55 : 48 <= t.keyCode ? t.keyCode - 48 : t.keyCode, this.__hit (e), c.main.audio.useDevice (!0)
        }, t.prototype.__keyup = function (t) {
            this.__hit (-1)
        }, t.prototype.__hitPos = function (t, e) {
            var i = _.stw, n = _.sth, o = this._nx, s = this._ny,
                r = Math.floor (t / (i / o)) + Math.floor (e / (n / s)) * o;
            this.__hit (r)
        }, t.prototype.__hit = function (t) {
            if (t %= 32, this._preId != t && 0 <= (this._preId = t)) {
                var e = t % this._nx, i = Math.floor (t / this._nx), n = this._buttons;
                n[i] && n[i][e] && n[i][e].touch (), this._hitHandler (t)
            }
        }, t.prototype._resize = function () {
            this._buttons[3][7]._reset (), this._buttons[7][3]._reset (), _.sth < _.stw ? (this._nx = 8, this._ny = 4, this._buttons[3][7]._setlast ()) : (this._nx = 4, this._ny = 8, this._buttons[7][3]._setlast ())
        }, t
    } (), g = function (i) {
        function t () {
            var t = i.call (this) || this;
            return t._isLoaded = !1, t.__uiFlag = !1, t
        }

        return __extends (t, i), Object.defineProperty (t.prototype, "audio", {
            get: function () {
                return this._audio
            }, enumerable: !0, configurable: !0
        }), t.prototype.initialize = function () {
            var t = this;
            c.main = this, c.isMobile = aidn.util.checkMobile (), c.isJa = aidn.util.checkJapanese (), c.isFull = aidn.util.enabledFullscreen (), c.isJa ? $ (".en").css ("display", "none") : $ (".ja").css ("display", "none"), c.isFull && $ ("#bt_full").show (), "0" == aidn.util.getCookie ("feedback") && this._changeFeedback (!1), i.prototype.initialize.call (this);
            var e = new p;
            e.addEventListener (u.COMPLETE, function () {
                return t._initComplete ()
            }), e.execute ()
        }, t.prototype._initComplete = function () {
            var i = this;
            $ ("#loading").fadeOut (200, "linear"), $ ("#cover_bk").slideUp (400, "easeInQuart"), this._blank = h.get (l.BGM_BLANK), c.isMobile && this._blank.play (0, !1), $ ("#bt_play").on ("click", function (t) {
                return i._clickPlay (t)
            }), $ ("#bt_about").on ("click", function (t) {
                return i._clickAbout (t)
            }), $ ("#bt_back").on ("click", function (t) {
                return i._clickBack (t)
            }), $ ("#bt_full").on ("click", function (t) {
                return i._clickFull (t)
            }), $ ("#about a").on ("click", function (t) {
                return i._clickAboutA (t)
            }), $ ("#bt_feedback").on ("click", function (t) {
                return i._clickFeedback (t)
            }), $ ("#cover_bk,#bt_close").on ("click", function (t) {
                return i._clickClose (t)
            });
            var n = location.href;
            $ ("#tw").on ("click", function (t) {
                var e = document.title;
                aidn.social.shareTw (n, !0, e, "daniwell_aidn", "MIKUWARP")
            }), $ ("#fb").on ("click", function (t) {
                aidn.social.shareFb (n, !0)
            }), $ ("#gp").on ("click", function (t) {
                aidn.social.shareGp (n, !0)
            }), aidn.util.webaudio ? $ (".ng").hide () : $ (".ok").hide (), (new d).start (), this._emTopBg = $ ("#top_bg"), this._emAbtBg = $ ("#about_bg"), c.device.addUpdate (this, function (t, e) {
                return i._deviceMotion (t, e)
            }), this._start (), aidn.adv.show ()
        }, t.prototype.addBeat = function (t, e) {
            this._audio.addBeat (t, e)
        }, t.prototype.removeBeat = function (t) {
            this._audio.removeBeat (t)
        }, t.prototype._deviceMotion = function (t, e) {
            c.isMobile ? (this._emTopBg.css ({
                top: 50 + 4 * e + "%",
                left: 50 + 5 * t + "%"
            }), this._emAbtBg.css ({
                top: 50 + 6 * e + "%",
                left: 50 + 7 * t + "%"
            })) : (this._emTopBg.css ({
                top: 52 + 2 * e + "%",
                left: 50 + 2 * t + "%"
            }), this._emAbtBg.css ({top: 50 + 2 * e + "%", left: 50 + 2 * t + "%"}))
        }, t.prototype._secondProgress = function (t) {
            $ ("#loading_prog").css ("width", 100 * t.progress + "%")
        }, t.prototype._secondComplete = function () {
            var e = this;
            $ ("#loading_prog").fadeOut (200, "linear"), this._isLoaded = !0, this._audio = new m, this._three = new n.ThreeManager, this._buttons = new b (function (t) {
                return e._hit (t)
            }), this._startMain ()
        }, t.prototype._startMain = function () {
            c.state = e.MAIN, c.audioState = 0, aidn.adv.hide (), this._buttons.start (), this._three.start (), this._audio.start (), $ ("#cover").stop ().slideUp (400, "easeInQuart"), $ ("#ui svg,#bts").addClass ("start"), this.__uiFlag = !1, this.__fadeInUI (), this._resize ()
        }, t.prototype._stopMain = function () {
            c.state == e.MAIN && (c.state = e.TOP, aidn.adv.show (), this._buttons.stop (), this._three.stop (.4), this._audio.stop (), $ ("#cover").stop ().slideDown (400, "easeInQuart"), $ ("#ui svg,#bts").removeClass ("start"), $ ("#ui div, #finger").hide (), $ (".top,#ui div").stop ().delay (300).fadeIn (200, "linear"), c.isFull || $ ("#bt_full").stop ().hide ())
        }, t.prototype.__fadeInUI = function () {
            this.__uiFlag || (this.__uiFlag = !0, $ ("#ui div,#finger").stop ().fadeIn (200, "linear"), c.isFull || $ ("#bt_full").stop ().hide ())
        }, t.prototype.__fadeOutUI = function () {
            this.__uiTime = 1.4, this.__uiFlag && (this.__uiFlag = !1, $ ("#ui div,#finger").stop ().fadeOut (200, "linear"), c.isFull || $ ("#bt_full").stop ().hide ())
        }, t.prototype._hit = function (t) {
            this.__fadeOutUI (), 31 == t && (0 == c.audioState ? c.audioState = 1 : c.audioState = 0), this._audio.playShot (t), this._three.hit (t)
        }, t.prototype._clickPlay = function (t) {
            var e = this;
            if ($ (".top,#ui div").stop ().hide (), this._isLoaded) this._startMain (); else {
                this._blank.play (0, !1);
                var i = new f;
                i.addEventListener (u.PROGRESS, function (t) {
                    return e._secondProgress (t)
                }), i.addEventListener (u.COMPLETE, function () {
                    return e._secondComplete ()
                }), i.execute ()
            }
        }, t.prototype._clickAbout = function (t) {
            $ ("#cover_bk").stop ().slideDown (400, "easeInQuart"), $ (".about").stop ().delay (400).fadeIn (100, "linear"), c.state == e.MAIN && this._audio.setVolume (.2)
        }, t.prototype._clickBack = function (t) {
            switch (c.state) {
                case e.TOP:
                    location.href = l.LINK_CONTENT;
                    break;
                case e.MAIN:
                    this._stopMain ()
            }
        }, t.prototype._clickClose = function (t) {
            $ ("#cover_bk").stop ().slideUp (400, "easeInQuart"), $ (".about").stop ().fadeOut (150, "linear"), c.state == e.MAIN && this._audio.setVolume (.8)
        }, t.prototype._clickFull = function (t) {
            aidn.util.fullscreen ()
        }, t.prototype._clickAboutA = function (t) {
            this._stopMain ()
        }, t.prototype._clickFeedback = function (t) {
            this._changeFeedback (!c.isFeedback)
        }, t.prototype._changeFeedback = function (t) {
            c.isFeedback = t, aidn.util.setCookie ("feedback", t ? 1 : 0, 31536e3), t ? $ ("#bt_feedback span").text ("FEEDBACK [ON]") : $ ("#bt_feedback span").text ("FEEDBACK [OFF]")
        }, t.prototype._update = function () {
            var t = this;
            switch (i.prototype._update.call (this), c.state) {
                case e.TOP:
                    break;
                case e.MAIN:
                    this.__uiTime -= _.delta, this.__uiTime < 0 && this.__fadeInUI ()
            }
            window.requestAnimationFrame (function () {
                return t._update ()
            })
        }, t.prototype._resize = function () {
            i.prototype._resize.call (this);
            var t = $ ("#about");
            this._emAbtBg.width (t.width ()), this._emAbtBg.height (t.height ())
        }, t
    } (aidnlib.MainBase)
} (main || (main = {})), main.check ();