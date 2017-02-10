(function(g, und) {
	var kvdb = g.indexedDB || g.mozIndexedDB || g.webkitIndexedDB || g.msIndexedDB,
		EOF = und,
		boothead = document.getElementsByTagName('head')[0],
		timestep = (new Date()).getTime();

	function depend(arr, opt) {
		var self = this;
		self.bootjs = arr;
		self.bootIndex = 0;
		self.opt = opt || {
			model: 'cache',
			assets: '',
			version: 0,
			cdncache: false
		};

		/**
		 * 获取下一下导入资源
		 * @return {Array} 资源数组, 格式[ url, version, suffix ];
		 */
		this.next = function() {
			var t = self,
				res = t.bootIndex < t.bootjs.length ? t.bootjs[t.bootIndex++] : EOF;
			t.opt['progress'] && t.opt.progress(t.bootIndex, t.bootjs.length);
			str(res) && (res = [res, self.opt.version]);
			if (array(res)) {
				var pre = 'js';
				/\.css/gi.test(res[0]) && (pre = 'css');
				if (res.length == 1) {
					res = [res[0], self.opt.version, pre];
				} else if (res.length == 2) {
					res = [res[0], res[1], pre];
				}
			}
			return res;
		}

		/**
		 * 带有缓存引导js文件
		 * @param  {[type]} url [description]
		 * @return {[type]}     [description]
		 */
		this.cacheLoadNext = function(url) {
			if (!url) {
				ready(self.opt);
				return;
			}

			LaunchStorage.get(url[0], function(res) {
				var hit = false,
					fn = function(content) {
						(url[2] == 'js' ? createCodeNode : createStyleSheet)(boothead, content, function() {
							self.cacheLoadNext(self.next());
						});
					};
				if (res && res.startsWith('"{')) {
					var pos = res.indexOf('}');
					if (pos > 0 && url[1] + '' == res.substring(2, pos)) {
						hit = true;
						fn(res.substring(pos + 3));
					}
				}
				if (!hit) {
					var xhr = new XMLHttpRequest();
					xhr.onload = function() {
						if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
							LaunchStorage.set(url[0], '"{' + url[1] + '}";' + xhr.responseText, function() {
								fn(xhr.responseText);
							});
						}
					};
					xhr.open('GET', burl(url, self.opt), true);
					xhr.send(null);
				}
			});
		}

		this.nativeLoadNext = function(url) {
			if (!url) {
				ready(self.opt)
				return;
			}
			(url[2] == 'js' ? nativeJsNode : nativeCssNode)(boothead, burl(url, self.opt), function() {
				self.nativeLoadNext(self.next());
			});
		}

		//开始引导
		if (arr && arr.length > 0) {
			var m = self.opt.model,
				m = kvdb ? (m == 'cache' || m == 'release' || m == 'deploy' || m == und) : false, //  ,
				n = this.next();
			this[m ? 'cacheLoadNext' : 'nativeLoadNext'](n);
		} else {
			fn && fn();
		}
	}

	function toarr(s) {
		var a = [],
			sp = s.split(/\n|;|,|\|/g);
		s && sp.forEach(function(v) {
			v = v.trim();
			v && a.push(v);
		});
		return a.length > 0 ? a : und;
	}

	function att(dom, k) {;
		var s = dom.getAttribute(k);
		s && (s.replace(/(^\s*)|(\s*$)/g, ''))
		return s;
	}

	function str(s) {
		return (typeof s === 'string') || s instanceof String;
	}

	function array(a) {
		return toString.call(a) === '[object Array]';
	}

	function burl(obj, opt) {
		var a = opt['assets'],
			cdn = opt['cdncache'],
			u = obj[0],
			pos = u.lastIndexOf('?');
		u += pos > 0 ? '&' : '?';
		return (a ? a : '') + u + (cdn === und || cdn === false ? "timestep=" + timestep + '&version=' + obj[1] : '');
	}

	function ready(opt) {
		var global = g.document,
			r = opt['ready'],
			event;
		r && r();

		if (opt['notify']) {
			event = global.createEvent('CustomEvent');
			event.initCustomEvent(opt['notify'], true, true, opt);
			global.dispatchEvent(event);
		}
		event = global.createEvent('CustomEvent');
		event.initCustomEvent('Base.LaunchReady', true, true, {});
		global.dispatchEvent(event);
	}

	function nativeJsNode(head, url, fn) {
		var script = document.createElement("script");
		script.setAttribute("type", "text/javascript");
		script.setAttribute("charset", "utf-8");
		script.setAttribute("src", url);
		script.addEventListener("load", fn, false);
		head.appendChild(script);
	}

	function nativeCssNode(head, url, fn) {
		var link = document.createElement('link');
		link.href = url;
		link.rel = 'stylesheet';
		link.type = 'text/css';
		link.addEventListener("load", fn, false);
		head.appendChild(link);
	}

	function createCodeNode(head, code, fn) {
		var node = document.createElement("script"),
			url;
		node.setAttribute("type", 'text/javascript');
		node.setAttribute("charset", "utf-8");
		if (URL) {
			url = URL.createObjectURL(new Blob([code]));
			node.setAttribute("src", url);
		} else {
			node.text = code;
		}

		function proxy(e) {
			head.removeChild(node);
			fn();
		}
		node.addEventListener('load', proxy, false);
		node.addEventListener('error', proxy, false);
		head.appendChild(node);
	}

	function createStyleSheet(head, code, fn) {
		var node = document.createElement("style");　　　　　
		node.setAttribute("type", "text/css");
		node.appendChild(document.createTextNode(code));
		head.appendChild(node);
		fn();
	}

	//---------------------------------------------------------------------

	var LaunchStorage = (function() {
		"use strict";

		if (kvdb) {
			function error(msg) {
				console.error(msg);
			}

			function IDBStorage() {
				var DBNAME = 'Base.Launchdb',
					DBVERSION = 1,
					STORENAME = 'LaunchCache',
					db = null;

				function withStore(type, f) {
					if (db) {
						f(db.transaction(STORENAME, type).objectStore(STORENAME));
						return;
					}
					var openreq = kvdb.open(DBNAME, DBVERSION);
					openreq.onerror = function withStoreOnError() {
						error("不能打开数据库: '" + openreq.error.name + "'");
					};
					openreq.onupgradeneeded = function withStoreOnUpgradeNeeded() {
						openreq.result.createObjectStore(STORENAME);
					};
					openreq.onsuccess = function withStoreOnSuccess() {
						db = openreq.result;
						f(db.transaction(STORENAME, type).objectStore(STORENAME));
					};
				}

				function get(key, callback) {
					withStore('readonly', function getBody(store) {
						var req = store.get(key);
						req.onsuccess = function getOnSuccess() {
							var value = req.result !== undefined ? req.result : null;
							callback(value);
						};
						req.onerror = function getOnError() {
							error('Error in storage.get(): ' + req.error.name);
						};
					});
				}

				function remove(key, callback) {
					withStore('readwrite', function removeBody(store) {
						var req = store['delete'](key);
						if (callback) {
							req.onsuccess = function removeOnSuccess() {
								callback();
							};
						}
						req.onerror = function removeOnError() {
							error('Error in storage.remove(): ' + req.error.name);
						};
					});
				}

				function set(key, value, callback) {
					withStore('readwrite', function setBody(store) {
						var req = store.put(value, key);
						if (callback) {
							req.onsuccess = function setOnSuccess() {
								callback();
							};
						}
						req.onerror = function setOnError() {
							error('写入失败: ' + req.error.name);
						};
					});
				}

				function clear(callback) {
					withStore('readwrite', function clearBody(store) {
						var req = store.clear();
						if (callback) {
							req.onsuccess = function clearOnSuccess() {
								callback();
							};
						}
						req.onerror = function clearOnError() {
							error('清除失败: ' + req.error.name);
						};
					});
				}
				return {
					get: get,
					set: set,
					remove: remove,
					clear: clear
				};

			}
			return new IDBStorage();
		}
	}());

	//---------------------------------------------------------------------
	var deps = document.querySelectorAll('script[depends]'),
		dom,
		u,
		ps,
		ry,
		opt;
	if (deps) {
		for (var i = 0, l = deps.length; i < l; i++) {
			dom = deps[i];
			u = att(dom, 'depends');
			if (u) {
				opt = {
					model: att(dom, 'model') || 'cache',
					assets: att(dom, 'assets') || '',
					version: att(dom, 'version') || 0,
					cdncache: att(dom, 'cdncache') == 'true',
					notify: att(dom, 'notify')
				}
				ps = att(dom, 'onprogress') || att(dom, 'progress');
				if (ps) {
					ps = g[ps];
					opt.progress = ps ? ps : und;
				}
				ry = att(dom, 'onready') || att(dom, 'ready');
				if (ry) {
					ry = g[ry];
					opt.ready = ry ? ry : und;
				}
				var urls = toarr(u);
				urls && new depend(urls, opt);
			}
		}
	}

	//export
	Base.launch = function(arr, opt) {
		str(arr) && (arr = toarr(arr));
		arr && new depend(arr, opt);
	}
})((! function() {
	{
		if (typeof(Base) === 'undefined') B = Base = {}
	};
}(), window));
