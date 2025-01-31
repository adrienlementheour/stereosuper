/*
 * Shadowbox.js, version 3.0.3
 * http://shadowbox-js.com/
 *
 * Copyright 2007-2010, Michael J. I. Jackson
 * Date: 2010-10-25 18:59:02 +0000
 */
 (function(au, k) {
    var Q = {
        version: "3.0.3"
    };
    var J = navigator.userAgent.toLowerCase();
    if (J.indexOf("windows") > -1 || J.indexOf("win32") > -1) {
        Q.isWindows = true
    } else {
        if (J.indexOf("macintosh") > -1 || J.indexOf("mac os x") > -1) {
            Q.isMac = true
        } else {
            if (J.indexOf("linux") > -1) {
                Q.isLinux = true
            }
        }
    }
    Q.isIE = J.indexOf("msie") > -1;
    Q.isIE6 = J.indexOf("msie 6") > -1;
    Q.isIE7 = J.indexOf("msie 7") > -1;
    Q.isGecko = J.indexOf("gecko") > -1 && J.indexOf("safari") == -1;
    Q.isWebKit = J.indexOf("applewebkit/") > -1;
    var ab = /#(.+)$/,
    af = /^(light|shadow)box\[(.*?)\]/i,
    az = /\s*([a-z_]*?)\s*=\s*(.+)\s*/,
    f = /[0-9a-z]+$/i,
    aD = /(.+\/)shadowbox\.js/i;
    var A = false,
    a = false,
    l = {},
    z = 0,
    R,
    ap;
    Q.current = -1;
    Q.dimensions = null;
    Q.ease = function(K) {
        return 1 + Math.pow(K - 1, 3)
    };
    Q.errorInfo = {
        fla: {
            name: "Flash",
            url: "http://www.adobe.com/products/flashplayer/"
        },
        qt: {
            name: "QuickTime",
            url: "http://www.apple.com/quicktime/download/"
        },
        wmp: {
            name: "Windows Media Player",
            url: "http://www.microsoft.com/windows/windowsmedia/"
        },
        f4m: {
            name: "Flip4Mac",
            url: "http://www.flip4mac.com/wmv_download.htm"
        }
    };
    Q.gallery = [];
    Q.onReady = aj;
    Q.path = null;
    Q.player = null;
    Q.playerId = "sb-player";
    Q.options = {
        animate: true,
        animateFade: true,
        autoplayMovies: true,
        continuous: false,
        enableKeys: true,
        flashParams: {
            bgcolor: "#000000",
            allowfullscreen: true
        },
        flashVars: {},
        flashVersion: "9.0.115",
        handleOversize: "resize",
        handleUnsupported: "link",
        onChange: aj,
        onClose: aj,
        onFinish: aj,
        onOpen: aj,
        showMovieControls: true,
        skipSetup: false,
        slideshowDelay: 0,
        viewportPadding: 20
    };
    Q.getCurrent = function() {
        return Q.current > -1 ? Q.gallery[Q.current] : null
    };
    Q.hasNext = function() {
        return Q.gallery.length > 1 && (Q.current != Q.gallery.length - 1 || Q.options.continuous)
    };
    Q.isOpen = function() {
        return A
    };
    Q.isPaused = function() {
        return ap == "pause"
    };
    Q.applyOptions = function(K) {
        l = aC({},
        Q.options);
        aC(Q.options, K)
    };
    Q.revertOptions = function() {
        aC(Q.options, l)
    };
    Q.init = function(aG, aJ) {
        if (a) {
            return
        }
        a = true;
        if (Q.skin.options) {
            aC(Q.options, Q.skin.options)
        }
        if (aG) {
            aC(Q.options, aG)
        }
        if (!Q.path) {
            var aI,
            S = document.getElementsByTagName("script");
            for (var aH = 0, K = S.length; aH < K; ++aH) {
                aI = aD.exec(S[aH].src);
                if (aI) {
                    Q.path = aI[1];
                    break
                }
            }
        }
        if (aJ) {
            Q.onReady = aJ
        }
        P()
    };
    Q.open = function(S) {
        if (A) {
            return
        }
        var K = Q.makeGallery(S);
        Q.gallery = K[0];
        Q.current = K[1];
        S = Q.getCurrent();
        if (S == null) {
            return
        }
        Q.applyOptions(S.options || {});
        G();
        if (Q.gallery.length) {
            S = Q.getCurrent();
            if (Q.options.onOpen(S) === false) {
                return
            }
            A = true;
            Q.skin.onOpen(S, c)
        }
    };
    Q.close = function() {
        if (!A) {
            return
        }
        A = false;
        if (Q.player) {
            Q.player.remove();
            Q.player = null
        }
        if (typeof ap == "number") {
            clearTimeout(ap);
            ap = null
        }
        z = 0;
        aq(false);
        Q.options.onClose(Q.getCurrent());
        Q.skin.onClose();
        Q.revertOptions()
    };
    Q.play = function() {
        if (!Q.hasNext()) {
            return
        }
        if (!z) {
            z = Q.options.slideshowDelay * 1000
        }
        if (z) {
            R = aw();
            ap = setTimeout(function() {
                z = R = 0;
                Q.next()
            },
            z);
            if (Q.skin.onPlay) {
                Q.skin.onPlay()
            }
        }
    };
    Q.pause = function() {
        if (typeof ap != "number") {
            return
        }
        z = Math.max(0, z - (aw() - R));
        if (z) {
            clearTimeout(ap);
            ap = "pause";
            if (Q.skin.onPause) {
                Q.skin.onPause()
            }
        }
    };
    Q.change = function(K) {
        if (! (K in Q.gallery)) {
            if (Q.options.continuous) {
                K = (K < 0 ? Q.gallery.length + K: 0);
                if (! (K in Q.gallery)) {
                    return
                }
            } else {
                return
            }
        }
        Q.current = K;
        if (typeof ap == "number") {
            clearTimeout(ap);
            ap = null;
            z = R = 0
        }
        Q.options.onChange(Q.getCurrent());
        c(true)
    };
    Q.next = function() {
        Q.change(Q.current + 1)
    };
    Q.previous = function() {
        Q.change(Q.current - 1)
    };
    Q.setDimensions = function(aS, aJ, aQ, aR, aI, K, aO, aL) {
        var aN = aS,
        aH = aJ;
        var aM = 2 * aO + aI;
        if (aS + aM > aQ) {
            aS = aQ - aM
        }
        var aG = 2 * aO + K;
        if (aJ + aG > aR) {
            aJ = aR - aG
        }
        var S = (aN - aS) / aN,
        aP = (aH - aJ) / aH,
        aK = (S > 0 || aP > 0);
        if (aL && aK) {
            if (S > aP) {
                aJ = Math.round((aH / aN) * aS)
            } else {
                if (aP > S) {
                    aS = Math.round((aN / aH) * aJ)
                }
            }
        }
        Q.dimensions = {
            height: aS + aI,
            width: aJ + K,
            innerHeight: aS,
            innerWidth: aJ,
            top: Math.floor((aQ - (aS + aM)) / 2 + aO),
            left: Math.floor((aR - (aJ + aG)) / 2 + aO),
            oversized: aK
        };
        return Q.dimensions
    };
    Q.makeGallery = function(aI) {
        var K = [],
        aH = -1;
        if (typeof aI == "string") {
            aI = [aI]
        }
        if (typeof aI.length == "number") {
            aF(aI,
            function(aK, aL) {
                if (aL.content) {
                    K[aK] = aL
                } else {
                    K[aK] = {
                        content: aL
                    }
                }
            });
            aH = 0
        } else {
            if (aI.tagName) {
                var S = Q.getCache(aI);
                aI = S ? S: Q.makeObject(aI)
            }
            if (aI.gallery) {
                K = [];
                var aJ;
                for (var aG in Q.cache) {
                    aJ = Q.cache[aG];
                    if (aJ.gallery && aJ.gallery == aI.gallery) {
                        if (aH == -1 && aJ.content == aI.content) {
                            aH = K.length
                        }
                        K.push(aJ)
                    }
                }
                if (aH == -1) {
                    K.unshift(aI);
                    aH = 0
                }
            } else {
                K = [aI];
                aH = 0
            }
        }
        aF(K,
        function(aK, aL) {
            K[aK] = aC({},
            aL)
        });
        return [K, aH]
    };
    Q.makeObject = function(aH, aG) {
        var aI = {
            content: aH.href,
            title: aH.getAttribute("title") || "",
            link: aH
        };
        if (aG) {
            aG = aC({},
            aG);
            aF(["player", "title", "height", "width", "gallery"],
            function(aJ, aK) {
                if (typeof aG[aK] != "undefined") {
                    aI[aK] = aG[aK];
                    delete aG[aK]
                }
            });
            aI.options = aG
        } else {
            aI.options = {}
        }
        if (!aI.player) {
            aI.player = Q.getPlayer(aI.content)
        }
        var K = aH.getAttribute("rel");
        if (K) {
            var S = K.match(af);
            if (S) {
                aI.gallery = escape(S[2])
            }
            aF(K.split(";"),
            function(aJ, aK) {
                S = aK.match(az);
                if (S) {
                    aI[S[1]] = S[2]
                }
            })
        }
        return aI
    };
    Q.getPlayer = function(aG) {
        if (aG.indexOf("#") > -1 && aG.indexOf(document.location.href) == 0) {
            return "inline"
        }
        var aH = aG.indexOf("?");
        if (aH > -1) {
            aG = aG.substring(0, aH)
        }
        var S,
        K = aG.match(f);
        if (K) {
            S = K[0].toLowerCase()
        }
        if (S) {
            if (Q.img && Q.img.ext.indexOf(S) > -1) {
                return "img"
            }
            if (Q.swf && Q.swf.ext.indexOf(S) > -1) {
                return "swf"
            }
            if (Q.flv && Q.flv.ext.indexOf(S) > -1) {
                return "flv"
            }
            if (Q.qt && Q.qt.ext.indexOf(S) > -1) {
                if (Q.wmp && Q.wmp.ext.indexOf(S) > -1) {
                    return "qtwmp"
                } else {
                    return "qt"
                }
            }
            if (Q.wmp && Q.wmp.ext.indexOf(S) > -1) {
                return "wmp"
            }
        }
        return "iframe"
    };
    function G() {
        var aH = Q.errorInfo,
        aI = Q.plugins,
        aK,
        aL,
        aO,
        aG,
        aN,
        S,
        aM,
        K;
        for (var aJ = 0; aJ < Q.gallery.length; ++aJ) {
            aK = Q.gallery[aJ];
            aL = false;
            aO = null;
            switch (aK.player) {
            case "flv":
            case "swf":
                if (!aI.fla) {
                    aO = "fla"
                }
                break;
            case "qt":
                if (!aI.qt) {
                    aO = "qt"
                }
                break;
            case "wmp":
                if (Q.isMac) {
                    if (aI.qt && aI.f4m) {
                        aK.player = "qt"
                    } else {
                        aO = "qtf4m"
                    }
                } else {
                    if (!aI.wmp) {
                        aO = "wmp"
                    }
                }
                break;
            case "qtwmp":
                if (aI.qt) {
                    aK.player = "qt"
                } else {
                    if (aI.wmp) {
                        aK.player = "wmp"
                    } else {
                        aO = "qtwmp"
                    }
                }
                break
            }
            if (aO) {
                if (Q.options.handleUnsupported == "link") {
                    switch (aO) {
                    case "qtf4m":
                        aN = "shared";
                        S = [aH.qt.url, aH.qt.name, aH.f4m.url, aH.f4m.name];
                        break;
                    case "qtwmp":
                        aN = "either";
                        S = [aH.qt.url, aH.qt.name, aH.wmp.url, aH.wmp.name];
                        break;
                    default:
                        aN = "single";
                        S = [aH[aO].url, aH[aO].name]
                    }
                    aK.player = "html";
                    aK.content = '<div class="sb-message">' + s(Q.lang.errors[aN], S) + "</div>"
                } else {
                    aL = true
                }
            } else {
                if (aK.player == "inline") {
                    aG = ab.exec(aK.content);
                    if (aG) {
                        aM = ad(aG[1]);
                        if (aM) {
                            aK.content = aM.innerHTML
                        } else {
                            aL = true
                        }
                    } else {
                        aL = true
                    }
                } else {
                    if (aK.player == "swf" || aK.player == "flv") {
                        K = (aK.options && aK.options.flashVersion) || Q.options.flashVersion;
                        if (Q.flash && !Q.flash.hasFlashPlayerVersion(K)) {
                            aK.width = 310;
                            aK.height = 177
                        }
                    }
                }
            }
            if (aL) {
                Q.gallery.splice(aJ, 1);
                if (aJ < Q.current) {--Q.current
                } else {
                    if (aJ == Q.current) {
                        Q.current = aJ > 0 ? aJ - 1: aJ
                    }
                }--aJ
            }
        }
    }
    function aq(K) {
        if (!Q.options.enableKeys) {
            return
        } (K ? F: M)(document, "keydown", an)
    }
    function an(aG) {
        if (aG.metaKey || aG.shiftKey || aG.altKey || aG.ctrlKey) {
            return
        }
        var S = v(aG),
        K;
        switch (S) {
        case 81:
        case 88:
        case 27:
            K = Q.close;
            break;
        case 37:
            K = Q.previous;
            break;
        case 39:
            K = Q.next;
            break;
        case 32:
            K = typeof ap == "number" ? Q.pause: Q.play;
            break
        }
        if (K) {
            n(aG);
            K()
        }
    }
    function c(aK) {
        aq(false);
        var aJ = Q.getCurrent();
        var aG = (aJ.player == "inline" ? "html": aJ.player);
        if (typeof Q[aG] != "function") {
            throw "unknown player " + aG
        }
        if (aK) {
            Q.player.remove();
            Q.revertOptions();
            Q.applyOptions(aJ.options || {})
        }
        Q.player = new Q[aG](aJ, Q.playerId);
        if (Q.gallery.length > 1) {
            var aH = Q.gallery[Q.current + 1] || Q.gallery[0];
            if (aH.player == "img") {
                var S = new Image();
                S.src = aH.content
            }
            var aI = Q.gallery[Q.current - 1] || Q.gallery[Q.gallery.length - 1];
            if (aI.player == "img") {
                var K = new Image();
                K.src = aI.content
            }
        }
        Q.skin.onLoad(aK, W)
    }
    function W() {
        if (!A) {
            return
        }
        if (typeof Q.player.ready != "undefined") {
            var K = setInterval(function() {
                if (A) {
                    if (Q.player.ready) {
                        clearInterval(K);
                        K = null;
                        Q.skin.onReady(e)
                    }
                } else {
                    clearInterval(K);
                    K = null
                }
            },
            10)
        } else {
            Q.skin.onReady(e)
        }
    }
    function e() {
        if (!A) {
            return
        }
        Q.player.append(Q.skin.body, Q.dimensions);
        Q.skin.onShow(I)
    }
    function I() {
        if (!A) {
            return
        }
        if (Q.player.onLoad) {
            Q.player.onLoad()
        }
        Q.options.onFinish(Q.getCurrent());
        if (!Q.isPaused()) {
            Q.play()
        }
        aq(true)
    }
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(S, aG) {
            var K = this.length >>> 0;
            aG = aG || 0;
            if (aG < 0) {
                aG += K
            }
            for (; aG < K; ++aG) {
                if (aG in this && this[aG] === S) {
                    return aG
                }
            }
            return - 1
        }
    }
    function aw() {
        return (new Date).getTime()
    }
    function aC(K, aG) {
        for (var S in aG) {
            K[S] = aG[S]
        }
        return K
    }
    function aF(aH, aI) {
        var S = 0,
        K = aH.length;
        for (var aG = aH[0]; S < K && aI.call(aG, S, aG) !== false; aG = aH[++S]) {}
    }
    function s(S, K) {
        return S.replace(/\{(\w+?)\}/g,
        function(aG, aH) {
            return K[aH]
        })
    }
    function aj() {}
    function ad(K) {
        return document.getElementById(K)
    }
    function C(K) {
        K.parentNode.removeChild(K)
    }
    var h = true,
    x = true;
    function d() {
        var K = document.body,
        S = document.createElement("div");
        h = typeof S.style.opacity === "string";
        S.style.position = "fixed";
        S.style.margin = 0;
        S.style.top = "20px";
        K.appendChild(S, K.firstChild);
        x = S.offsetTop == 20;
        K.removeChild(S)
    }
    Q.getStyle = (function() {
        var K = /opacity=([^)]*)/,
        S = document.defaultView && document.defaultView.getComputedStyle;
        return function(aJ, aI) {
            var aH;
            if (!h && aI == "opacity" && aJ.currentStyle) {
                aH = K.test(aJ.currentStyle.filter || "") ? (parseFloat(RegExp.$1) / 100) + "": "";
                return aH === "" ? "1": aH
            }
            if (S) {
                var aG = S(aJ, null);
                if (aG) {
                    aH = aG[aI]
                }
                if (aI == "opacity" && aH == "") {
                    aH = "1"
                }
            } else {
                aH = aJ.currentStyle[aI]
            }
            return aH
        }
    })();
    Q.appendHTML = function(aG, S) {
        if (aG.insertAdjacentHTML) {
            aG.insertAdjacentHTML("BeforeEnd", S)
        } else {
            if (aG.lastChild) {
                var K = aG.ownerDocument.createRange();
                K.setStartAfter(aG.lastChild);
                var aH = K.createContextualFragment(S);
                aG.appendChild(aH)
            } else {
                aG.innerHTML = S
            }
        }
    };
    Q.getWindowSize = function(K) {
        if (document.compatMode === "CSS1Compat") {
            return document.documentElement["client" + K]
        }
        return document.body["client" + K]
    };
    Q.setOpacity = function(aG, K) {
        var S = aG.style;
        if (h) {
            S.opacity = (K == 1 ? "": K)
        } else {
            S.zoom = 1;
            if (K == 1) {
                if (typeof S.filter == "string" && (/alpha/i).test(S.filter)) {
                    S.filter = S.filter.replace(/\s*[\w\.]*alpha\([^\)]*\);?/gi, "")
                }
            } else {
                S.filter = (S.filter || "").replace(/\s*[\w\.]*alpha\([^\)]*\)/gi, "") + " alpha(opacity=" + (K * 100) + ")"
            }
        }
    };
    Q.clearOpacity = function(K) {
        Q.setOpacity(K, 1)
    };
    function o(S) {
        var K = S.target ? S.target: S.srcElement;
        return K.nodeType == 3 ? K.parentNode: K
    }
    function V(S) {
        var K = S.pageX || (S.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft)),
        aG = S.pageY || (S.clientY + (document.documentElement.scrollTop || document.body.scrollTop));
        return [K, aG]
    }
    function n(K) {
        K.preventDefault()
    }
    function v(K) {
        return K.which ? K.which: K.keyCode
    }
    function F(aH, aG, S) {
        if (aH.addEventListener) {
            aH.addEventListener(aG, S, false)
        } else {
            if (aH.nodeType === 3 || aH.nodeType === 8) {
                return
            }
            if (aH.setInterval && (aH !== au && !aH.frameElement)) {
                aH = au
            }
            if (!S.__guid) {
                S.__guid = F.guid++
            }
            if (!aH.events) {
                aH.events = {}
            }
            var K = aH.events[aG];
            if (!K) {
                K = aH.events[aG] = {};
                if (aH["on" + aG]) {
                    K[0] = aH["on" + aG]
                }
            }
            K[S.__guid] = S;
            aH["on" + aG] = F.handleEvent
        }
    }
    F.guid = 1;
    F.handleEvent = function(aH) {
        var K = true;
        aH = aH || F.fixEvent(((this.ownerDocument || this.document || this).parentWindow || au).event);
        var S = this.events[aH.type];
        for (var aG in S) {
            this.__handleEvent = S[aG];
            if (this.__handleEvent(aH) === false) {
                K = false
            }
        }
        return K
    };
    F.preventDefault = function() {
        this.returnValue = false
    };
    F.stopPropagation = function() {
        this.cancelBubble = true
    };
    F.fixEvent = function(K) {
        K.preventDefault = F.preventDefault;
        K.stopPropagation = F.stopPropagation;
        return K
    };
    function M(aG, S, K) {
        if (aG.removeEventListener) {
            aG.removeEventListener(S, K, false)
        } else {
            if (aG.events && aG.events[S]) {
                delete aG.events[S][K.__guid]
            }
        }
    }
    var y = false,
    al;
    if (document.addEventListener) {
        al = function() {
            document.removeEventListener("DOMContentLoaded", al, false);
            Q.load()
        }
    } else {
        if (document.attachEvent) {
            al = function() {
                if (document.readyState === "complete") {
                    document.detachEvent("onreadystatechange", al);
                    Q.load()
                }
            }
        }
    }
    function g() {
        if (y) {
            return
        }
        try {
            document.documentElement.doScroll("left")
        } catch(K) {
            setTimeout(g, 1);
            return
        }
        Q.load()
    }
    function P() {
        if (document.readyState === "complete") {
            return Q.load()
        }
        if (document.addEventListener) {
            document.addEventListener("DOMContentLoaded", al, false);
            au.addEventListener("load", Q.load, false)
        } else {
            if (document.attachEvent) {
                document.attachEvent("onreadystatechange", al);
                au.attachEvent("onload", Q.load);
                var K = false;
                try {
                    K = au.frameElement === null
                } catch(S) {}
                if (document.documentElement.doScroll && K) {
                    g()
                }
            }
        }
    }
    Q.load = function() {
        if (y) {
            return
        }
        if (!document.body) {
            return setTimeout(Q.load, 13)
        }
        y = true;
        d();
        Q.onReady();
        if (!Q.options.skipSetup) {
            Q.setup()
        }
        Q.skin.init()
    };
    Q.plugins = {};
    if (navigator.plugins && navigator.plugins.length) {
        var w = [];
        aF(navigator.plugins,
        function(K, S) {
            w.push(S.name)
        });
        w = w.join(",");
        var ai = w.indexOf("Flip4Mac") > -1;
        Q.plugins = {
            fla: w.indexOf("Shockwave Flash") > -1,
            qt: w.indexOf("QuickTime") > -1,
            wmp: !ai && w.indexOf("Windows Media") > -1,
            f4m: ai
        }
    } else {
        var p = function(K) {
            var S;
            try {
                S = new ActiveXObject(K)
            } catch(aG) {}
            return !! S
        };
        Q.plugins = {
            fla: p("ShockwaveFlash.ShockwaveFlash"),
            qt: p("QuickTime.QuickTime"),
            wmp: p("wmplayer.ocx"),
            f4m: false
        }
    }
    var X = /^(light|shadow)box/i,
    am = "shadowboxCacheKey",
    b = 1;
    Q.cache = {};
    Q.select = function(S) {
        var aG = [];
        if (!S) {
            var K;
            aF(document.getElementsByTagName("a"),
            function(aJ, aK) {
                K = aK.getAttribute("rel");
                if (K && X.test(K)) {
                    aG.push(aK)
                }
            })
        } else {
            var aI = S.length;
            if (aI) {
                if (typeof S == "string") {
                    if (Q.find) {
                        aG = Q.find(S)
                    }
                } else {
                    if (aI == 2 && typeof S[0] == "string" && S[1].nodeType) {
                        if (Q.find) {
                            aG = Q.find(S[0], S[1])
                        }
                    } else {
                        for (var aH = 0; aH < aI; ++aH) {
                            aG[aH] = S[aH]
                        }
                    }
                }
            } else {
                aG.push(S)
            }
        }
        return aG
    };
    Q.setup = function(K, S) {
        aF(Q.select(K),
        function(aG, aH) {
            Q.addCache(aH, S)
        })
    };
    Q.teardown = function(K) {
        aF(Q.select(K),
        function(S, aG) {
            Q.removeCache(aG)
        })
    };
    Q.addCache = function(aG, K) {
        var S = aG[am];
        if (S == k) {
            S = b++;
            aG[am] = S;
            F(aG, "click", u)
        }
        Q.cache[S] = Q.makeObject(aG, K)
    };
    Q.removeCache = function(K) {
        M(K, "click", u);
        delete Q.cache[K[am]];
        K[am] = null
    };
    Q.getCache = function(S) {
        var K = S[am];
        return (K in Q.cache && Q.cache[K])
    };
    Q.clearCache = function() {
        for (var K in Q.cache) {
            Q.removeCache(Q.cache[K].link)
        }
        Q.cache = {}
    };
    function u(K) {
        Q.open(this);
        if (Q.gallery.length) {
            n(K)
        }
    }
    Q.lang = {
        code: "fr",
        of: "de",
        loading: "",
        cancel: "Annuler",
        next: "Suivant",
        previous: "Précédent",
        play: "Lire",
        pause: "Pause",
        close: "Fermer",
        errors: {
            single: 'Vous devez installer le plugin <a href="{0}">{1}</a> pour afficher ce contenu.',
            shared: 'Vous devez installer les plugins <a href="{0}">{1}</a> et <a href="{2}">{3}</a> pour afficher ce contenu.',
            either: 'Vous devez installer le plugin <a href="{0}">{1}</a> ou <a href="{2}">{3}</a> pour afficher ce contenu.'
        }
    };
    var D,
    at = "sb-drag-proxy",
    E,
    j,
    ag;
    function ax() {
        E = {
            x: 0,
            y: 0,
            startX: null,
            startY: null
        }
    }
    function aA() {
        var K = Q.dimensions;
        aC(j.style, {
            height: K.innerHeight + "px",
            width: K.innerWidth + "px"
        })
    }
    function O() {
        ax();
        var K = ["position:absolute", "cursor:" + (Q.isGecko ? "-moz-grab": "move"), "background-color:" + (Q.isIE ? "#fff;filter:alpha(opacity=0)": "transparent")].join(";");
        Q.appendHTML(Q.skin.body, '<div id="' + at + '" style="' + K + '"></div>');
        j = ad(at);
        aA();
        F(j, "mousedown", L)
    }
    function B() {
        if (j) {
            M(j, "mousedown", L);
            C(j);
            j = null
        }
        ag = null
    }
    function L(S) {
        n(S);
        var K = V(S);
        E.startX = K[0];
        E.startY = K[1];
        ag = ad(Q.player.id);
        F(document, "mousemove", H);
        F(document, "mouseup", i);
        if (Q.isGecko) {
            j.style.cursor = "-moz-grabbing"
        }
    }
    function H(aI) {
        var K = Q.player,
        aJ = Q.dimensions,
        aH = V(aI);
        var aG = aH[0] - E.startX;
        E.startX += aG;
        E.x = Math.max(Math.min(0, E.x + aG), aJ.innerWidth - K.width);
        var S = aH[1] - E.startY;
        E.startY += S;
        E.y = Math.max(Math.min(0, E.y + S), aJ.innerHeight - K.height);
        aC(ag.style, {
            left: E.x + "px",
            top: E.y + "px"
        })
    }
    function i() {
        M(document, "mousemove", H);
        M(document, "mouseup", i);
        if (Q.isGecko) {
            j.style.cursor = "-moz-grab"
        }
    }
    Q.img = function(S, aG) {
        this.obj = S;
        this.id = aG;
        this.ready = false;
        var K = this;
        D = new Image();
        D.onload = function() {
            K.height = S.height ? parseInt(S.height, 10) : D.height;
            K.width = S.width ? parseInt(S.width, 10) : D.width;
            K.ready = true;
            D.onload = null;
            D = null
        };
        D.src = S.content
    };
    Q.img.ext = ["bmp", "gif", "jpg", "jpeg", "png"];
    Q.img.prototype = {
        append: function(S, aI) {
            var aG = document.createElement("img");
            aG.id = this.id;
            aG.src = this.obj.content;
            aG.style.position = "absolute";
            var K,
            aH;
            if (aI.oversized && Q.options.handleOversize == "resize") {
                K = aI.innerHeight;
                aH = aI.innerWidth
            } else {
                K = this.height;
                aH = this.width
            }
            aG.setAttribute("height", K);
            aG.setAttribute("width", aH);
            S.appendChild(aG)
        },
        remove: function() {
            var K = ad(this.id);
            if (K) {
                C(K)
            }
            B();
            if (D) {
                D.onload = null;
                D = null
            }
        },
        onLoad: function() {
            var K = Q.dimensions;
            if (K.oversized && Q.options.handleOversize == "drag") {
                O()
            }
        },
        onWindowResize: function() {
            var aH = Q.dimensions;
            switch (Q.options.handleOversize) {
            case "resize":
                var K = ad(this.id);
                K.height = aH.innerHeight;
                K.width = aH.innerWidth;
                break;
            case "drag":
                if (ag) {
                    var aG = parseInt(Q.getStyle(ag, "top")),
                    S = parseInt(Q.getStyle(ag, "left"));
                    if (aG + this.height < aH.innerHeight) {
                        ag.style.top = aH.innerHeight - this.height + "px"
                    }
                    if (S + this.width < aH.innerWidth) {
                        ag.style.left = aH.innerWidth - this.width + "px"
                    }
                    aA()
                }
                break
            }
        }
    };
    var ao = false,
    Y = [],
    q = ["sb-nav-close", "sb-nav-next", "sb-nav-play", "sb-nav-pause", "sb-nav-previous"],
    aa,
    ae,
    Z,
    m = true;
    function N(aG, aQ, aN, aL, aR) {
        var K = (aQ == "opacity"),
        aM = K ? Q.setOpacity: function(aS, aT) {
            aS.style[aQ] = "" + aT + "px"
        };
        if (aL == 0 || (!K && !Q.options.animate) || (K && !Q.options.animateFade)) {
            aM(aG, aN);
            if (aR) {
                aR()
            }
            return
        }
        var aO = parseFloat(Q.getStyle(aG, aQ)) || 0;
        var aP = aN - aO;
        if (aP == 0) {
            if (aR) {
                aR()
            }
            return
        }
        aL *= 1000;
        var aH = aw(),
        aK = Q.ease,
        aJ = aH + aL,
        aI;
        var S = setInterval(function() {
            aI = aw();
            if (aI >= aJ) {
                clearInterval(S);
                S = null;
                aM(aG, aN);
                if (aR) {
                    aR()
                }
            } else {
                aM(aG, aO + aK((aI - aH) / aL) * aP)
            }
        },
        10)
    }
    function aB() {
        aa.style.height = Q.getWindowSize("Height") + "px";
        aa.style.width = Q.getWindowSize("Width") + "px"
    }
    function aE() {
        aa.style.top = document.documentElement.scrollTop + "px";
        aa.style.left = document.documentElement.scrollLeft + "px"
    }
    function ay(K) {
        if (K) {
            aF(Y,
            function(S, aG) {
                aG[0].style.visibility = aG[1] || ""
            })
        } else {
            Y = [];
            aF(Q.options.troubleElements,
            function(aG, S) {
                aF(document.getElementsByTagName(S),
                function(aH, aI) {
                    Y.push([aI, aI.style.visibility]);
                    aI.style.visibility = "hidden"
                })
            })
        }
    }
    function r(aG, K) {
        var S = ad("sb-nav-" + aG);
        if (S) {
            S.style.display = K ? "": "none"
        }
    }
    function ah(K, aJ) {
        var aI = ad("sb-loading"),
        aG = Q.getCurrent().player,
        aH = (aG == "img" || aG == "html");
        if (K) {
            Q.setOpacity(aI, 0);
            aI.style.display = "block";
            var S = function() {
                Q.clearOpacity(aI);
                if (aJ) {
                    aJ()
                }
            };
            if (aH) {
                N(aI, "opacity", 1, Q.options.fadeDuration, S)
            } else {
                S()
            }
        } else {
            var S = function() {
                aI.style.display = "none";
                Q.clearOpacity(aI);
                if (aJ) {
                    aJ()
                }
            };
            if (aH) {
                N(aI, "opacity", 0, Q.options.fadeDuration, S)
            } else {
                S()
            }
        }
    }
    function t(aO) {
        var aJ = Q.getCurrent();
        ad("sb-title-inner").innerHTML = aJ.title || "";
        var aP,
        aL,
        S,
        aQ,
        aM;
        if (Q.options.displayNav) {
            aP = true;
            var aN = Q.gallery.length;
            if (aN > 1) {
                if (Q.options.continuous) {
                    aL = aM = true
                } else {
                    aL = (aN - 1) > Q.current;
                    aM = Q.current > 0
                }
            }
            if (Q.options.slideshowDelay > 0 && Q.hasNext()) {
                aQ = !Q.isPaused();
                S = !aQ
            }
        } else {
            aP = aL = S = aQ = aM = false
        }
        r("close", aP);
        r("next", aL);
        r("play", S);
        r("pause", aQ);
        r("previous", aM);
        var K = "";
        if (Q.options.displayCounter && Q.gallery.length > 1) {
            var aN = Q.gallery.length;
            if (Q.options.counterType == "skip") {
                var aI = 0,
                aH = aN,
                aG = parseInt(Q.options.counterLimit) || 0;
                if (aG < aN && aG > 2) {
                    var aK = Math.floor(aG / 2);
                    aI = Q.current - aK;
                    if (aI < 0) {
                        aI += aN
                    }
                    aH = Q.current + (aG - aK);
                    if (aH > aN) {
                        aH -= aN
                    }
                }
                while (aI != aH) {
                    if (aI == aN) {
                        aI = 0
                    }
                    K += '<a onclick="Shadowbox.change(' + aI + ');"';
                    if (aI == Q.current) {
                        K += ' class="sb-counter-current"'
                    }
                    K += ">" + (++aI) + "</a>"
                }
            } else {
                K = [Q.current + 1, Q.lang.of, aN].join(" ")
            }
        }
        ad("sb-counter").innerHTML = K;
        aO()
    }
    function U(aH) {
        var K = ad("sb-title-inner"),
        aG = ad("sb-info-inner"),
        S = 0.35;
        K.style.visibility = aG.style.visibility = "";
        if (K.innerHTML != "") {
            N(K, "marginTop", 0, S)
        }
        N(aG, "marginTop", 0, S, aH)
    }
    function av(aG, aM) {
        var aK = ad("sb-title"),
        K = ad("sb-info"),
        aH = aK.offsetHeight,
        aI = K.offsetHeight,
        aJ = ad("sb-title-inner"),
        aL = ad("sb-info-inner"),
        S = (aG ? 0.35: 0);
        N(aJ, "marginTop", aH, S);
        N(aL, "marginTop", aI * -1, S,
        function() {
            aJ.style.visibility = aL.style.visibility = "hidden";
            aM()
        })
    }
    function ac(K, aH, S, aJ) {
        var aI = ad("sb-wrapper-inner"),
        aG = (S ? Q.options.resizeDuration: 0);
        N(Z, "top", aH, aG);
        N(aI, "height", K, aG, aJ)
    }
    function ar(K, aH, S, aI) {
        var aG = (S ? Q.options.resizeDuration: 0);
        N(Z, "left", aH, aG);
        N(Z, "width", K, aG, aI)
    }
    function ak(aM, aG) {
        var aI = ad("sb-body-inner"),
        aM = parseInt(aM),
        aG = parseInt(aG),
        S = Z.offsetHeight - aI.offsetHeight,
        K = Z.offsetWidth - aI.offsetWidth,
        aK = ae.offsetHeight,
        aL = ae.offsetWidth,
        aJ = parseInt(Q.options.viewportPadding) || 20,
        aH = (Q.player && Q.options.handleOversize != "drag");
        return Q.setDimensions(aM, aG, aK, aL, S, K, aJ, aH)
    }
    var T = {};
    T.markup = '<div id="sb-container"><div id="sb-overlay"></div><div id="sb-wrapper"><div id="sb-title"><div id="sb-title-inner"></div></div><div id="sb-info"><div id="sb-info-inner"><div id="sb-counter"></div><div id="sb-nav"><a id="sb-nav-close" title="{close}" onclick="Shadowbox.close()"></a><a id="sb-nav-next" title="{next}" onclick="Shadowbox.next()"></a><a id="sb-nav-play" title="{play}" onclick="Shadowbox.play()"></a><a id="sb-nav-pause" title="{pause}" onclick="Shadowbox.pause()"></a><a id="sb-nav-previous" title="{previous}" onclick="Shadowbox.previous()"></a></div></div></div><div id="sb-wrapper-inner"><div id="sb-body"><div id="sb-body-inner"></div><div id="sb-loading"><div id="sb-loading-inner"><span>{loading}</span></div></div></div></div></div></div>';
    T.options = {
        animSequence: "sync",
        counterLimit: 10,
        counterType: "default",
        displayCounter: false,
        displayNav: true,
        fadeDuration: 0.35,
        initialHeight: 300,
        initialWidth: 300,
        modal: false,
        overlayColor: "#fff",
        overlayOpacity: 0.7,
        resizeDuration: 0.45,
        showOverlay: true,
        troubleElements: ["select", "object", "embed", "canvas"]
    };
    T.init = function() {
        Q.appendHTML(document.body, s(T.markup, Q.lang));
        T.body = ad("sb-body-inner");
        aa = ad("sb-container");
        ae = ad("sb-overlay");
        Z = ad("sb-wrapper");
        if (!x) {
            aa.style.position = "absolute"
        }
        if (!h) {
            var aG,
            K,
            S = /url\("(.*\.png)"\)/;
            aF(q,
            function(aI, aJ) {
                aG = ad(aJ);
                if (aG) {
                    K = Q.getStyle(aG, "backgroundImage").match(S);
                    if (K) {
                        aG.style.backgroundImage = "none";
                        aG.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true,src=" + K[1] + ",sizingMethod=scale);"
                    }
                }
            })
        }
        var aH;
        F(au, "resize",
        function() {
            if (aH) {
                clearTimeout(aH);
                aH = null
            }
            if (A) {
                aH = setTimeout(T.onWindowResize, 10)
            }
        })
    };
    T.onOpen = function(K, aG) {
        m = false;
        aa.style.display = "block";
        aB();
        var S = ak(Q.options.initialHeight, Q.options.initialWidth);
        ac(S.innerHeight, S.top);
        ar(S.width, S.left);
        if (Q.options.showOverlay) {
            ae.style.backgroundColor = Q.options.overlayColor;
            Q.setOpacity(ae, 0);
            if (!Q.options.modal) {
                F(ae, "click", Q.close)
            }
            ao = true
        }
        if (!x) {
            aE();
            F(au, "scroll", aE)
        }
        ay();
        aa.style.visibility = "visible";
        if (ao) {
            N(ae, "opacity", Q.options.overlayOpacity, Q.options.fadeDuration, aG)
        } else {
            aG()
        }
    };
    T.onLoad = function(S, K) {
        ah(true);
        while (T.body.firstChild) {
            C(T.body.firstChild)
        }
        av(S,
        function() {
            if (!A) {
                return
            }
            if (!S) {
                Z.style.visibility = "visible"
            }
            t(K)
        })
    };
    T.onReady = function(aH) {
        if (!A) {
            return
        }
        var S = Q.player,
        aG = ak(S.height, S.width);
        var K = function() {
            U(aH)
        };
        switch (Q.options.animSequence) {
        case "hw":
            ac(aG.innerHeight, aG.top, true,
            function() {
                ar(aG.width, aG.left, true, K)
            });
            break;
        case "wh":
            ar(aG.width, aG.left, true,
            function() {
                ac(aG.innerHeight, aG.top, true, K)
            });
            break;
        default:
            ar(aG.width, aG.left, true);
            ac(aG.innerHeight, aG.top, true, K)
        }
    };
    T.onShow = function(K) {
        ah(false, K);
        m = true
    };
    T.onClose = function() {
        if (!x) {
            M(au, "scroll", aE)
        }
        M(ae, "click", Q.close);
        Z.style.visibility = "hidden";
        var K = function() {
            aa.style.visibility = "hidden";
            aa.style.display = "none";
            ay(true)
        };
        if (ao) {
            N(ae, "opacity", 0, Q.options.fadeDuration, K)
        } else {
            K()
        }
    };
    T.onPlay = function() {
        r("play", false);
        r("pause", true)
    };
    T.onPause = function() {
        r("pause", false);
        r("play", true)
    };
    T.onWindowResize = function() {
        if (!m) {
            return
        }
        aB();
        var K = Q.player,
        S = ak(K.height, K.width);
        ar(S.width, S.left);
        ac(S.innerHeight, S.top);
        if (K.onWindowResize) {
            K.onWindowResize()
        }
    };
    Q.skin = T;
    au.Shadowbox = Q
})(window);