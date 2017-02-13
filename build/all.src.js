
// build time: 20170212
		/* minifyOnSave, filenamePattern: ../dist/$1.$2 */

(function(g, und) {

	Base.Version = '1.0.0';

})((! function() {
	{
		if (typeof(Base) === 'undefined') B = Base = {}
	};
}(), window));

	/* minifyOnSave, filenamePattern: ../dist/$1.$2 */


(function(g, und) {
	var kvdb = g.indexedDB || g.mozIndexedDB || g.webkitIndexedDB || g.msIndexedDB;

	function error(msg) {
		console.error(msg);
	}

	function IDBStorage() {
		var DBNAME = 'Base.ForageStorage',
			DBVERSION = 1,
			STORENAME = 'ForageStorage',
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

		function support() {
			return !!kvdb;
		}

		//export
		return {
			/**
			 * 是否支持存储
			 * @type {[type]}
			 */
			support: support,
			/**
			 * 获取
			 * @type {[type]}
			 */
			get: get,

			/**
			 * 设置
			 * @type {[type]}
			 */
			set: set,

			/**
			 * 删除
			 * @type {[type]}
			 */
			remove: remove,

			/**
			 * 清空
			 * @type {[type]}
			 */
			clear: clear
		};
	}

	//export
	Base.Storage = new IDBStorage();

})(window);

	/* minifyOnSave, filenamePattern: ../dist/$1.$2 */


(function(g, und) {
	var el = 'addEventListener',
		de = document.documentElement,
		//document对象全局定义
		global = g.document,

		//浏览器地址栏参数model=dev,表强制使用dev模式
		forceDev = false,
		//终止
		EOF = und,

		//html head头
		head = global.head || de,

		//当前时间戳,进行远程请求时添加时间戳,防止cnd缓存
		timestep = (new Date()).getTime(),

		//正则表达式分离script标签
		//ScriptFragment = '<script[^>]*>([\\S\\s]*?)<\/script\\s*>',
		ScriptFragment = '<script\\s*type="text/javascript"[^>]*>([\\S\\s]*?)<\/script\\s*>',

		//监视器
		Mutation = (function() {
			return g.MutationObserver ||
				g.WebKitMutationObserver ||
				g.MozMutationObserver;
		})(),

		gopt = {
			model: forceDev || att(de, 'model') || 'cache',
			assets: att(de, 'assets') || '',
			version: att(de, 'version') || 0,
			cdncache: att(de, 'cdncache') == 'true',
			notify: att(de, 'notify'),
			success: att(de, 'onsuccess'),
			progress: att(de, 'onprogress')
		};

	//读取浏览器参数, model=dev表示强制使用开发模式
	(function() {
		var pars = location.search.substring(1);
		if (pars) {
			var reg = /([^&=]+)=([^&]*)/g,
				m;
			while (m = reg.exec(pars)) {
				if (m[1] == 'model') {
					m[2] == 'dev' && (forceDev = 'dev');
					break;
				}
			}
		}
	})();

	function depend(arr, opt) {
		var self = this;
		self.depends = arr;
		self.index = 0;
		self.opt = opt || gopt;
		//self.opt.append = append;
		this.next = function() {
			var t = self,
				p = t.opt['progress'],
				res = t.index < t.depends.length ? t.depends[t.index++] : EOF;
			if (res != EOF) {
				p && g[p] && g[p](t.index, t.depends.length);
				typeof res === 'string' && (res = [res, self.opt.version]);
				if (res.length < 4) {
					var dom = self.opt.original,
						pre = 'html',
						match = /\.js|\.css|.tpl/gi.exec(res[0]);
					match && (pre = match[0].substring(1));
					var len = res.length;
					len == 1 ? (res = [dom, res[0], self.opt.version, pre]) : (len == 2 && (res = [dom, res[0], res[1], pre]));
					res.push(self.opt.observer);
					//pre == 'html' || pre == 'tpl' && (res[0] = global.body, res.push('append'));
				}
				res.original = self.opt.original;
			}
			return res;
		};
		this.loader = function() {
			var n = this.next();
			if (n != EOF) {
				self.creator.create(self, n);
			} else {
				//结束
				var o = self.opt,
					e;
				o['callback'] && o.callback();
				o['success'] && eval(o.success);
				if (o['notify']) {
					e = global.createEvent('CustomEvent');
					e.initCustomEvent(o.notify, true, true, {});
					global.dispatchEvent(e);
				}
			}
		};
		if (arr && arr.length > 0) {
			var m = self.opt.model;
			m = Base.Storage.support() ? (m == 'cache' || m == 'release' || m == 'deploy' || m == und) : false;
			self.creator = m ? cache : dnative;
			self.loader();
		}
	}

	//-----------------------create------------------------------------------
	//不使用cache加载资源
	var dnative = {
		create: function(self, item) {
			this[item[3]](item[0], burl(item, self.opt), function() {
				!item[4] && rov(item[0]);
				self.loader();
			}, item)
		},
		js: function(dom, url, fn) {
			var node = create('script', {
				type: 'text/javascript',
				charset: "utf-8",
				src: url
			});
			fn && (node[el]("load", fn, false),
				node[el]("error", fn, false));
			head.appendChild(node);
		},
		css: function(dom, url, fn) {
			var link = create('link');
			link.href = url;
			link.rel = 'stylesheet';
			link.type = 'text/css';
			link[el]("load", fn, false);
			head.appendChild(link);
		},
		html: function(dom, src, fn, item) {
			get(src, function(html) {
				render(dom, html, item[4], fn);
			});
		},
		tpl: function(dom, src, fn, item) {
			get(src, function(html) {
				tpl(dom, html, fn, item);
			});
		}
	};

	//使用cache加载资源
	var cache = {
		create: function(self, item) {
			var f = this;
			f.cached(item[1], burl(item, self.opt), item[2], function(code) {
				f[item[3]](item[0], code, function() {
					!item[4] && rov(item.original);
					self.loader();
				}, item);
			});
		},
		cached: function(key, url, ver, fn) {
			var k = hashCode(key);
			Base.Storage.get(k, function(res) {
				var hit = false,
					pos;
				if (res && startsWith(res, '${')) {
					pos = res.indexOf('}');
					pos > 0 && ver + '' == res.substring(2, pos) && (hit = true);
				}
				hit ? (fn(res.substring(pos + 2))) : (get(url, function(code) {
					Base.Storage.set(k, '${' + ver + '}"' + code, function() {
						fn(code);
					});
				}));
			});
		},
		js: function(dom, code, fn) {
			evalScripts(dom, code, fn);
		},
		css: function(dom, code, fn) {
			var node = create('style', {
				type: "text/css"
			});
			//css节点不能删除
			// function proxy(e) {
			// 	debugger;
			// 	dom.removeChild(node);
			// 	fn && fn();
			// }
			// node[el]('load', proxy, false);
			// node[el]('error', proxy, false);

			node.appendChild(global.createTextNode(code));
			head.appendChild(node);
			fn && fn();
		},
		html: function(dom, code, fn, item) {
			render(dom, code, item[4], fn);
		},
		tpl: tpl
	}

	//---------------------------util-----------------------------------
	function create(tag, at) {
		var n = global.createElement(tag);
		if (at) {
			for (var k in at) {
				att(n, k, at[k]);
			}
		}
		return n;
	}

	/**
	 * 删除节点
	 * @param  {[type]} ele [description]
	 * @return {[type]}     [description]
	 */
	function rov(ele) {
		ele && ele.parentElement && ele.parentNode.removeChild(ele);
	}

	/**
	 * 把字符串分割成数组
	 * @param  {[type]} s [description]
	 * @return {[type]}   [description]
	 */
	function toArray(s) {
		var a = [],
			sp = s.split(/\n|;|,|\|/g);
		s && sp.forEach(function(v) {
			v = v.trim();
			v && !startsWith(v, '//') && !startsWith(v, '#') && a.push(v);
		});
		return a.length > 0 ? a : und;
	}

	/**
	 *   获取节点上属性
	 * @param  {[type]} dom [description]
	 * @param  {[type]} k   [description]
	 * @return {[type]}     [description]
	 */
	function att(dom, k, v) {
		if (v != und) {
			dom.setAttribute(k, v);
		} else {
			var s;
			if (Array.isArray(k)) {
				for (var i in k) {
					s = dom.getAttribute(k[i]);
					if (s != null) {
						break;
					}
				}
			} else {
				s = dom.getAttribute(k)
			}
			s && (s.replace(/(^\s*)|(\s*$)/g, ''))
			return s;
		}
	}

	/**
	 * 构建URL地址
	 * @param  {[type]} item [description]
	 * @param  {[type]} opt [description]
	 * @return {[type]}     [description]
	 */
	function burl(item, opt) {
		var a = opt['assets'],
			cdn = opt['cdncache'],
			u = item[1],
			pos = u.lastIndexOf('?');
		u += pos > 0 ? '&' : '?';
		return (a ? a : '') + u + (cdn === und || cdn === false ? "timestep=" + timestep + '&version=' + item[2] : '');
	}

	function get(url, fn) {
		xhr('GET', url, true, fn);
	}

	function xhr(mthod, url, async, fn) {
		var xhr = new XMLHttpRequest();
		xhr.onload = function() {
			if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
				fn && fn(xhr.responseText);
			}
		};
		xhr.withCredentials = true;
		xhr.open(mthod || 'GET', url, async);
		xhr.send(null);
		if (async === false) return xhr.responseText;
	}

	/**
	 * Web Socket请求
	 * @param  {[type]} url [description]
	 * @return {[type]}     [description]
	 */
	function ws(dom, url) {
		var socket,
			subject = att(dom, 'subject') || 'defaultsubject';
		if (window.WebSocket) {
			socket = new WebSocket(url);
			socket.onmessage = function(event) {

				//console.dir("  message : " + event.data);
			};
			socket.onopen = function(event) {
				socket.send(subject);
				//console.dir("  open : " + event.data);
			};
			socket.onclose = function(event) {
				console.dir("  close : " + event.data)
			};
		} else {
			alert('你的浏览器不支持Web Socket.');
		}
	}

	/**
	 * 创建片段代码
	 * @param  {[type]} html [description]
	 * @return {[type]}      [description]
	 */
	function fragment(html) {
		var frag, tmp, doc = global;
		if (html) {
			tmp = create('div');
			frag = doc.createDocumentFragment();
			tmp.innerHTML = html;
			while (tmp.firstChild) {
				frag.appendChild(tmp.firstChild);
			}
		}
		return frag;
	};

	/**
	 * 从字符串中分离html标签和script标签
	 * @param  {String} c 输入字符串
	 * @return {Array}   返回数组数组格式: [ html ,js ]
	 */
	function stripScripts(c) {
		var reg = new RegExp(ScriptFragment, 'img'),
			m, index = 0,
			html = "",
			js = "";
		while ((m = reg.exec(c)) != null) {
			html += c.substring(index, m.index);
			js += m[1] + '\n';
			index = m.index + m[0].length;
		};
		//m == null && (html = c);
		index == 0 ? (html = c) : (index < c.length && (html += c.substring(index, c.length)));
		return [html, js];
	}

	/**
	 * 执行javascript 代码
	 * @param  {[type]}   dom  [description]
	 * @param  {[type]}   code [description]
	 * @param  {Function} fn   [description]
	 * @return {[type]}        [description]
	 */
	function evalScripts(dom, code, fn) {
		var node = create('script', {
				type: 'text/javascript',
				charset: "utf-8"
			}),
			url;
		URL ? (url = URL.createObjectURL(new Blob([code])), att(node, "src", url)) : node.text = code;

		function proxy(e) {
			rov(node);
			fn && fn();
		}
		node[el]('load', proxy, false);
		node[el]('error', proxy, false);
		head.appendChild(node);
	}

	/**
	 * html 字符串渲染
	 * @param  {[type]}   dom    [description]
	 * @param  {[type]}   str    [description]
	 * @param  {[type]}   inner [description]
	 * @param  {Function} fn     [description]
	 * @return {[type]}          [description]
	 */
	function render(dom, str, inner, fn) {
		var res = stripScripts(str);
		if (res[0]) {
			var frag = fragment(res[0]),
				method = 'replaceWith';
			include(frag);
			if (dom) {
				//dom.wasRequire = true;
				//console.log(frag.querySelectorAll('include,require'));
				//dom[append = 'append' ? 'appendChild' : 'replaceWith'](frag);
				//dom.replaceWith(frag);
				if (inner) {
					dom.innerHTML = "";
					method = 'appendChild';
					!dom['wasObserver'] && (
						dom['wasObserver'] = true,
						observer(dom, function(arr) {
							var tar = [],
								ele;
							arr.forEach(function(v) {
								ele = v.target;
								if (!contains(tar, ele)) {
									ele['wasRequire'] = 0;
									tar.push(ele);
								}
							});
							requireTag(tar);
						})
					)
				}
				dom[method](frag);
			} else {
				global.body.appendChild(frag);
			}
		}
		res[1] ? evalScripts(dom, res[1], fn) : (fn && fn());
	}

	/**
	 * 模板字符串渲染
	 * @param  {[type]}   dom  [description]
	 * @param  {[type]}   html [description]
	 * @param  {Function} fn   [description]
	 * @param  {[type]}   item [description]
	 * @return {[type]}        [description]
	 */
	function tpl(dom, html, fn, item) {
		var data,
			url = att(dom, ['bind', 'bind-remote', 'data-url', 'bind-call']);
		if (url) {
			/*
			//支持websockt通信
			if (startsWith(url, 'ws://')) {
				ws(dom, url);
				data = "WebSocketAwait";
			} else {
				data = xhr("post", url, false);
			}
			*/
			data = xhr("post", url, false);
			if (data) {
				var obj = JSON.parse(data);
				if (obj.ec == 0) {
					data = obj['obj'] || obj['list'];
					data['original-data'] = obj;
				}
			}
		}
		data && (html = compile(html, data));
		render(dom, html, item[4], fn);
	}

	function hashCode(url) {
		var url = url.replace(/\//g, ''),
			hash = 0,
			c;
		for (var i = 0; i < url.length; i++) {
			c = url.charCodeAt(i);
			if (c != 32 && c != 10 && c != 13 && c != 9) {
				hash = hash * 31 + c;
				if (hash > 0x7fffffff || hash < -0x80000000) {
					hash &= 0xFFFFFFFF;
				}
			}
		}
		return 'h' + hash.toString(16);
	}

	/**
	 * startsWith 函数存在兼容性,重新实现startsWith函数
	 * @param  {String} str    字符串
	 * @param  {String} prefix 前缀
	 * @return {Boolean}        结果
	 */
	function startsWith(str, prefix) {
		return str.slice(0, prefix.length) === prefix;
	}

	function contains(arr, obj) {
		for (var i = 0; i < arr.length; i++) {
			if (obj == arr[i]) {
				return true;
			}
		}
		return false;
	}
	/**
	 * 模板翻译
	 * @param  {[type]} tpl  [description]
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	function compile(tpl, data) {
		var fn = new Function("obj",
			"var p=[],print=function(){p.push.apply(p,arguments);};" +
			"with(obj){p.push('" +
			tpl
			.replace(/[\r\t\n]/g, " ")
			.split("<#").join("\t")
			.replace(/((^|#>)[^\t]*)'/g, "$1\r")
			.replace(/\t=(.*?)#>/g, "',$1,'")
			.split("\t").join("');")
			.split("#>").join("p.push('")
			.split("\r").join("\\'") + "');}return p.join('');");
		return fn(data);
	}

	/**
	 * 监视属性变更
	 * @param  {[type]}   dom [description]
	 * @param  {Function} fn  [description]
	 * @return {[type]}       [description]
	 */
	function observer(dom, fn) {
		(new Mutation(fn)).observe(dom, {
			'attributes': true,
			attributeFilter: ['bind', 'bind-remote', 'data-url', 'bind-call', 'depends', 'require', 'include', 'src', 'href']
		});
	}
	//-------------------------------------------------------------
	function require(arr, opt) {
		new depend(arr, typeof opt === 'function' ? {
			callback: opt,
			model: gopt.model,
			assets: gopt.assets,
			version: gopt.version,
			cdncache: gopt.cdncache,
			notify: gopt.notify,
			success: gopt.success,
			progress: gopt.progress
		} : opt);
	}

	function include(dom, fn) {
		var cluster = 0,
			call = function(array) {
				// array.forEach(function(v) {
				// 	v.parentNode.removeChild(v);
				// });
				cluster--;
				cluster == 0 && fn && fn();
			};
		//查找页面中包含的require和include标签
		[
			['require,[require]', head],
			['include,[include]', und]
		].forEach(function(v) {
			var req = dom.querySelectorAll(v[0]);
			req.length > 0 && (cluster++, requireTag(req, v[1], function() {
				call(req);
			}));
		});
	}

	var requireTag = function(deps, append, callback) {
		var dom,
			u,
			opt;
		if (deps.length > 0) {
			for (var i = 0, l = deps.length; i < l; i++) {
				dom = deps[i];
				//在在节点上查找 depends  require src href 属性内容引入资源
				//例如:
				//	<script type="text/javascript" src="../src/require.js" require="a.css,b.js"/></script>
				u = att(dom, ['depends', 'require', 'include', 'src', 'href']);
				//如果属性上无法查找到引入的资源,在资源的内部查找文本,作为资源进行引入
				//例如:
				//	<script type="text/javascript" src="../src/require.js" >
				//		a.css
				//		b.js
				//	</script>
				//	注意: 这种写法script节点上有src属性, 节点内部内容不会被执行. 浏览器只会加载src指定的js文件
				//		 script节点内部的js代码不会被执行,只能当做文本处理
				!u && (u = dom.text || dom.innerHTML);
				if (u && !dom['wasRequire']) {
					dom.wasRequire = true;
					opt = {
						original: dom,
						observer: dom.hasAttribute('observer'),
						//pos:att(dom, 'model')
						model: forceDev || att(dom, 'model') || gopt.model,
						assets: att(dom, 'assets') || gopt.assets,
						version: att(dom, 'version') || gopt.version,
						cdncache: att(dom, 'cdncache') || gopt.cdncache,
						notify: att(dom, 'notify') || gopt.notify,
						success: att(dom, 'onsuccess') || gopt.success,
						progress: att(dom, 'onprogress') || gopt.progress,
						callback: callback
					}
					u = toArray(u);
					u.length > 0 && new depend(u, opt);
					//u && req.push.apply(req, u);
				}
			}
		}
	}
	requireTag(global.querySelectorAll('script[depends],script[require]'), head)
	var handler = function() {
		global.removeEventListener("DOMContentLoaded", handler, false);
		include(global);
	}
	global[el]("DOMContentLoaded", handler, false);
	//--------------------------------------------------------------

	//export
	//g.require = require;
	//g.include = include;
	g.Require = Base.Require = {

		/**
		 * 绑定require的notify事件
		 * @param  {String}   subject 主题
		 * @param  {Function} fn      执行函数
		 * @return {Void}           无
		 */
		bindNotify: function(subject, fn) {
			global[el](subject, fn, false);
		},

		/**
		 * 清除缓存
		 * @return {[type]} [description]
		 */
		clean: function() {
			Base.Storage.support() && Base.Storage.clear();
		},
		/**
		 * require函数
		 * @type {[type]}
		 */
		require: require,
		include: include
	}
})(window);

	/* minifyOnSave, filenamePattern: ../dist/$1.$2 */

(function(g, und) {
	"use strict";

	var op = Object.prototype,
		ap = Array.prototype,
		T = true,
		F = false;
	var toString = op.toString,
		hasOwn = op.hasOwnProperty,
		index_of = (
			ap.indexOf ?
			function(arr, val) {
				return arr.indexOf(val);
			} :
			function(arr, val) {
				for (var i = 0; i < arr.length; i++) {
					if (arr[i] === val) {
						return i;
					}
				}
				return -1;
			}
		),
		Is = {

			/**
			 * 是否是字符串, true:是  ; false:否
			 * @param  {[type]} s [description]
			 * @return {[type]}   [description]
			 */
			str: function(s) {
				return (typeof s === 'string') || s instanceof String;
			},

			number: function(n) {
				return (typeof n === 'number') || n instanceof Number;
			},

			bool: function(b) {
				return b === !!b || b instanceof Boolean;
			},
			/**
			 * 是否是函数
			 * @param  {[type]}   f [description]
			 * @return {Function}   [description]
			 */
			fn: function(f) {
				return (typeof f === 'function');
			},

			/**
			 * 是否是数组
			 * @type {[type]}
			 */
			array: Array.isArray || function(a) {
				return toString.call(a) === '[object Array]';
			},

			/**
			 * 是否是Object对象
			 * @param  {[type]} o [description]
			 * @return {[type]}   [description]
			 */
			obj: function(o) {
				return o === Object(o);
			},

			/**
			 * 是否值正则表达式
			 * @param  {[type]} r [description]
			 * @return {[type]}   [description]
			 */
			regex: function(r) {
				return !!(r && r.test && r.exec && (r.ignoreCase || r.ignoreCase === false));
			},

			numeric: function(n) {
				return !isNaN(parseFloat(n)) && isFinite(n);
			},

			/**
			 * 是否是时间对象
			 * @param  {[type]} date [description]
			 * @return {[type]}      [description]
			 */
			date: function(date) {
				return date instanceof Date;
			},

			/**
			 * 是否是时间
			 * 	time('1486009338057')	--> true
			 * 	time('1486009400')	--> true
			 *
			 * 	time(1486009338057)	--> true
			 * 	time(1486009400)	--> true
			 *
			 *  time('2017-1-1 23:23:23')	--> true
			 *  time('2017-01-01 23:23:23.1234')  --> true
			 *  time('2017-1-1')	--> true
			 *  time('2017年1月1日')	--> true
			 *  time('2017年1月1日 23时23分23秒')	--> true
			 *
			 *  time('Thu Feb 02 2017 12:28:15 GMT+0800 (CST)')  --> true
			 *  time('Thu Feb 02 12:29:20 CST 2017') --> true
			 *  time(new Date()) --> true
			 *
			 *
			 * @return {[type]} [description]
			 */
			time: function(t) {
				var res = F;
				if (Is.number(t)) {
					t = t + '';
				}
				if (Is.str(t)) {
					//精确到毫秒时间或者精确到秒的时间
					res = /^[0-9]{13}$|^[0-9]{10}$/.test(t)
					if (!res) {
						try {
							var s = t.replace(/年|月|日/g, '-');
							s = s.replace(/时|分|秒/g, ':');
							var time = Date.parse(s);
							res = !!time;
						} catch (e) {}
					}
				} else if (Is.date(t)) {
					res = T;
				}
				return res;
			},
			/**
			 * 是否是null
			 * @param  {[type]} obj [description]
			 * @return {[type]}     [description]
			 */
			null: function(obj) {
				return obj === null;
			},

			/**
			 * 是否是undefined
			 * @param  {[type]} obj [description]
			 * @return {[type]}     [description]
			 */
			und: function(obj) {
				return obj === (void 0);
			},

			/**
			 * 是否是arguments 对象
			 * @param  {[type]} arg [description]
			 * @return {[type]}     [description]
			 */
			arg: function(arg) {
				return arg && hasOwn.call(arg, 'callee');
			},
			/**
			 * 判断两个对象是否由同一个构造函数构造而来
			 * @param  {[Object]} obj1
			 * @param  {[Object]} obj2
			 * @return {[bool]}
			 *
			 * 例1:
			 * var obj1 = new Date()
			 * var obj2 = new Date()
			 * obj1.__proto__ ===obj2.__proto__  => true
			 * obj1.costructor===obj2.constructor  =>false
			 * obj1.constructor===obj2.constructor =>true
			 * obj1.constructor===obj2.constructor =>false
			 *
			 * 例2:
			 * var Clazz1 =  jEditor.Class.class({
			 *    show:function(){
			 *	    return this.msg;
			 *    }
			 * });
			 * var Clazz2 =  jEditor.Class.class({
			 *
			 * });
			 *
			 * var o1 =new Clazz1(),
			 * o2 = new Clazz2(),
			 * o11 = new Clazz1();
			 * o1.constructor===o2.constructor   =>false
			 * o1.constructor === o2.constructor   =>false
			 * o1.constructor === o11.constructor   =>true
			 */
			ins: function(obj1, obj2) {
				var pro = "__proto__",
					con = "constructor";
				//return pro in obj1?obj1[pro] === obj2[pro]:obj1[con] === obj2[con];
				return obj1[pro] ? obj1[pro] === obj2[pro] : obj1[con] === obj2[con];
			},
			/**
			 * 是否是json字符串, 例如:
			 * 	 json("a"); --->  false
			 * 	 json("\"a\"");  --->  true
			 *   json("{ a: 42 }");  --->  false
			 *   json("{ \"a\": 42 }")  --->  true
			 * @returns {Boolean} 是否是json字符串, true:是;  false:否
			 */
			json: function(str) {
				if (Is.empty(str)) return F;
				str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@');
				str = str.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
				str = str.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
				return (/^[\],:{}\s]*$/).test(str);
			},
			/**
			 * 判断变量或者属性是否赋值, true: 已经赋值; false:未赋值
			 *    var a = {
			 *     		f1:undefined,
			 *     	 	f2:null
			 *     }
			 *    Is.set(a)         --->        true;
			 *    Is.set(a.f1)         --->       false;
			 *    Is.set(a.f2)         --->       false;
			 * @return {[type]}   [description]
			 */
			set: function(v) {
				return v !== null && v !== (void 0);
			},

			window: function(obj) {
				return !!obj && obj === obj.window && 'location' in obj && 'navigator' in obj && 'document' in
					obj && 'isNaN' in
					obj &&
					'isFinite' in obj;
			},

			/**
			 * 是否是document对象
			 * @param  {[type]} d [description]
			 * @return {[type]}   [description]
			 */
			doc: function(d) {
				return !!d && 'nodeType' in d && d.nodeType === 9;
			},

			/**
			 * 是否element对象
			 * @param  {[type]} ele [description]
			 * @return {[type]}     [description]
			 */
			ele: function(ele) {
				return !!ele && (
					typeof HTMLElement === "object" ? ele instanceof HTMLElement : //DOM2
					ele && typeof ele === "object" && ele !== null && ele.nodeType === 1 && typeof ele.nodeName ===
					"string"
				);
			},

			/**
			 * 是否是Fragment对象
			 * @param  {[type]} ele [description]
			 * @return {[type]}     [description]
			 */
			frag: function(ele) {
				return ele['setAttribute'] === und && ele.toString().indexOf('DocumentFragment') > 0;
			},

			/**
			 * 判断属性是在对象或者数组中
			 *  var a = [1,2,3,4,5,6]
			 *  Is.inside(a,2)     --->   true
			 *  Is.inside(a,10)     --->  false
			 *
			 *	var a ={
			 *			f:1
			 *		}
			 *  Is.inside(a,'f')     -->     true
			 *
			 * @param  {Object/Array} obj 目标对象
			 * @param  {String} val 属性
			 * @return {[type]}     [description]
			 */
			inside: function(obj, val) {
				if (obj instanceof Array) {
					return index_of(obj, val) > -1;
				} else if (typeof(obj) === "object") {
					for (var prop in obj) {
						if (hasOwn.call(obj, prop)) {
							return T;
						}
					}
					return F;
				} else {
					return F;
				}
			},

			/**
			 * 是否是空白字符串,例如:
			 * 	''.blank();  --->  false
			 *  '  '.blank();  --->  true
			 *
			 *  ' a '.blank(); --->  false
			 * @returns {Boolean} 是否是空白字符串, true:是;  false:否
			 */
			blank: function(str) {
				return !!str && /^\s*$/.test(str);
			},

			/**
			 * 是否是空对象, 例如:
			 *  empty([]) --> true
			 *  empty(null) --> true
			 *  empty(undefined) --> true
			 *  empty('') --> true
			 *  empty('\t') --> true
			 *  empty('   ') --> true
			 *
			 * 	empty(false) --> false
			 * 	empty(true) --> false
			 *  empty({}) --> false
			 *  empty(window) --> false
			 * @param {Object} obj 任意javascript对象
			 * @return {Boolean} 返回true/false
			 */
			empty: function(obj) {
				var res = obj === false ? obj : !obj;
				if (!res) {
					res = Is.array(obj) ? obj.length === 0 : (Is.str(obj) ? Is.blank(obj) : res);
				}
				return res;
			}
		};

	//export
	g.Is = Base.Is = Is;
})(window);

	/* minifyOnSave, filenamePattern: ../dist/$1.$2 */

/**
 * javascript mixin对象
 * 例1(基本使用):
 *
 *Base.extend(Object, {
 *  		a:function(){
 *  			//do ...
 *  		},
 *
 *  		b:function(){
 *  			//do ...
 *  		}
 *  });
 *  Object.a();
 *  Object.b();
 *
 * 例2(数组):
 * Base.extend(Object, [{
 *  			a:function(){
 *  				//do ...
 *  			},
 *
 *  			b:function(){
 *  				//do ...
 *  			}
 *  		  },{
 *  			c:function(){
 *  				//do ...
 *  			}
 *  		 }]
 *  );
 *  Object.a();
 *  Object.b();
 *  Object.c();
 *
 *  例3(数组):
 *  function Fn(){
 *  	//do ...
 *  }
 *  var obj1 =new Fn();
 * Base.extend([Object,obj1], [{
 *  			a:function(){
 *  				//do ...
 *  			},
 *
 *  			b:function(){
 *  				//do ...
 *  			}
 *  		  },{
 *  			c:function(){
 *  				//do ...
 *  			}
 *  		 }]
 *  );
 *  Object.a();
 *  Object.b();
 *  obj1.c()
 *  var obj2 =new Fn();
 *  obj2.c                     --->  undefined
 *
 *
 *  例4(原型链赋值. 注意和例3的区别,执行结果一致,但是绑定原理不一样):
 *  function Fn(){
 *  	//do ...
 *  }
 * Base.extend([ Object , Fn.prototype], [{
 *  			a:function(){
 *  				//do ...
 *  			},
 *  			b:function(){
 *  				//do ...
 *  			}
 *  		  },{
 *  			c:function(){
 *  				//do ...
 *  			}
 *  		 },
 *  		 {field:'field'}
 *  		]
 *  );
 *  Object.a();
 *  Object.b();
 *  var obj1 =new Fn();
 *  obj1.c()
 *
 * 	var obj2 =new Fn();
 *  obj2.c()
 *
 *  例5(模块导入)
 * Base.extend(Object,(function(){
 *  	function fn(){
 *  		//do ...
 *  	}
 *  	return {
 *  		a:function(){
 *  			//do ...
 *  		},
 *
 *  		b:function(){
 *  			//do ...
 *  		},
 *  		fn:fn
 *  	}
 *  })() );
 *
 *
 *
 *
 *
 * @type {Object}
 */
(function(g, und) {
	"use strict";

	/*
	 * 判断hasownpropety
	 */
	function has(obj, prop) {
		return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	/**
	 * 是否是数组
	 * @param  {[type]} o [description]
	 * @return {[type]}   [description]
	 */
	function isArr(o) {
		return o instanceof Array;
	}

	/**
	 * @param {Object} dest 被添加目标
	 * @param {Object} source 添加对象内容
	 * @private
	 */
	function e0(dest, source) {
		for (var property in source) {
			if (has(source, property)) {
				dest[property] = source[property];
			}
		}
	}

	function e1(dest, source) {
		for (var i in source) {
			e0(dest, source[i]);
		}
	}
	/**
	 * @param {Object/Array} dest 被添加目标
	 * @param {Object/Array} source 添加对象内容
	 * @private
	 */
	function e2(dest, source) {
		for (var i in dest) {
			e1(dest[i], source);
		}
	}

	function mixin(dest, source) {
		if (!isArr(dest) && !isArr(source)) {
			return e0(dest, source);
		}
		if (isArr(dest) && !isArr(source)) {
			for (var i in dest) {
				e0(dest[i], source);
			}
			return;
		}
		if (!(isArr(dest)) && isArr(source)) {
			for (var i in source) {
				e0(dest, source[i]);
			}
			return;
		}
		if (isArr(dest) && isArr(source)) {
			return e2(dest, source);
		}
	}

	/**
	 *Base.extend方法根据参数数量跳转到
	 */
	function despatch() {
		var args = arguments;
		switch (args.length) {
			case 0:
				break; //忽略
			case 1:
				{ //一个参数: 调用自身extend方法
					Object.__ext__(args[0]);
					break;
				}
			case 2: //两个参数: 调用mixin.e方法
				mixin(args[0], args[1]);
				break;
			default: //更多参数: 除第一个参数外其它所有参数转换为数组,然后调用mixin.e方法
				mixin(args[0], slice.call(args, 1));
		}
		return args[0];
	};

	//export
	Object.__ext__ = Base.extend;
	g.extend = Base.extend = Object.extend = despatch;

})(window);

	/* minifyOnSave, filenamePattern: ../dist/$1.$2 */

(function(g, und) {


	/**
	 * 生成命名空间, 例如:
	 *
	 * 	 NS('a.b.c') --> a.b.c
	 *   NS('d/e/f') --> d.e.f
	 *   NS('a1\\a2\\a3') --> a1.a2.a3
	 *   NS('a1|a2|a3')	--> a1.a2.a3
	 *   NS('.b1..b2||b3/b4\\b5') --> b1.b2.b3.b4.b5
	 *
	 *
	 *   NS(Object,'a.b.c') --> Object.a.b.c
	 *
	 *   //在指定对象生成命名空间并绑定对象
	 *   NS(my,'a.b.c', {
	 *   	a:12,
	 *   	b:function(){
	 *   		alert()
	 *   	}
	 *   })
	 *
	 *   //命名空间绑定对象
	 *   NS('a.b.c', {
	 *   	a:12,
	 *   	b:function(){
	 *   		alert()
	 *   	}
	 *   })
	 *
	 * @param {Object} ns 任意javascript对象
	 * @param {String} name 字符串形式命名空间,例如:'a.b.c'
	 * @param {Object} value 在命名空间上绑定对象
	 * @return {Object} 返回命名空间对象
	 */
	function NS(global, name, value) {
		var root = global,
			args = arguments;
		//解析参数
		switch (args.length) {
			case 1:
				root = g;
				name = args[0];
				value = {};
				break;
			case 2:
				if (Is.str(args[0])) {
					value = args[1];
					name = args[0];
					root = g;
				}
			case 3:
				if (!value) value = {};
				break;
		}
		var parts = name.split(/\.|\/|\\|\|/g),
			ln = parts.length - 1,
			leaf = parts[ln],
			part, ns = [];
		for (i = 0; i < ln; i++) {
			part = parts[i];
			if (part) {
				ns.push(part);
				if (Is.str(part)) {
					!root[part] && (root[part] = {
						'NS': ns.join('.')
					});
					root = root[part];
				} else {
					root = part;
				}
			}
		}
		ns.push(leaf);
		value['NS'] = ns.join('.');
		root[leaf] = value;
		return root[leaf];
	}

	//export
	g.NS = NS;
	Base.NS = NS;
})(window);

	/* minifyOnSave, filenamePattern: ../dist/$1.$2 */
(function(g, und) {
	"use strict";


	/**
	 * 删除左右两端的空格
	 * var str=" abc ";
	 * str.trim()   --->  "abc"
	 * @returns {String} 返回字符串
	 */
	function trim() {
		return this.replace(/(^\s*)|(\s*$)/g, '');
	}

	/**
	 * 把字符串中连续多个空格整理为一个空格
	 * var str="a b  c    d     ";
	 * str.tidy()  --->  "a b c d "
	 *
	 * @return {String} 返回字符串
	 */
	function tidy() {
		return this.replace(/\s+/g, ' ');
	}

	/**
	 * 把字符串转换安全字符串(替换特殊的字符)
	 * @return {[type]} [description]
	 */
	function safely() {
		return this.replace(/'|"|-|\/|\\|;|=/g, '');
	}

	/**
	 * 是否已指定前缀字符串开始,例如:
	 * @param {String} prefix 前缀
	 * @param {Number} position 开始位置,默认0
	 */
	function startsWith(prefix, position) {
		position = Object.isNumber(position) ? position : 0;
		return this.lastIndexOf(prefix, position) === position;
	}

	/**
	 * 是否已指定后缀字符串结束
	 * @param {String} suffix 后缀
	 * @param {Number} position 倒序开始位置,默认字符串长度
	 * @returns {Boolean}
	 */
	function endsWith(suffix, position) {
		suffix = String(suffix);
		position = Object.isNumber(position) ? position : this.length;
		if (position < 0) position = 0;
		if (position > this.length) position = this.length;
		var d = position - suffix.length;
		return d >= 0 && this.indexOf(suffix, d) === d;
	}

	/*
	 * 全部字符串替换
	 * @Param:src:被替换的内容
	 * @Param:dest替换的内容
	 * @Param:bool:是否区分大小写
	 * "1112abcabcABC".replaceAll("a","zzz") -->//1112zzzbczzzbcABC
	 * "1112abcabcABC".replaceAll("a","zzz",false) -->//1112zzzbczzzbczzzBC
	 */
	function replaceAll(src, dest, bool) {
		if (!RegExp.prototype.isPrototypeOf(src)) {
			return this.replace(new RegExp(src, (bool ? "gi" : "g")), dest);
		} else {
			return this.replace(src, dest);
		}
	}

	/**
	 * 参考 : https://github.com/facebook/immutable-js/archive/master.zip
	 *       http://jsperf.com/hashing-strings
	 *
	 ** 计算对象hashcode, 计算值与java hashcode方法一致
	 * @param {Object} obj 任意javascript对象
	 * @returns {number} 类型值
	 */
	function hashCode() {
		var hash = 0,
			c;
		for (var i = 0; i < this.length; i++) {
			c = this.charCodeAt(i);
			if (c != 32 && c != 10 && c != 13 && c != 9) {
				hash = hash * 31 + c;
				if (hash > 0x7fffffff || hash < -0x80000000) {
					hash &= 0xFFFFFFFF;
				}
			}
		}
		return hash.toString(16);
	}

	/**
	 * 把字符串按照 \n ; , \ / | 分割成数组,例如:
	 *  var str ="a,b,c";
	 *  str.toArray()   --->  ["a", "b", "c"]
	 *
	 * 	var str ="a;b;c";
	 * 	str.toArray()   --->  ["a", "b", "c"]
	 *
	 *  var str ="a;b|c/d\\c";
	 *  str.toArray()   --->  ["a", "b", "c", "d", "c"]
	 *
	 *  @returns {Array} 分割数组
	 */
	function toArray() {
		return this.split(/\n|;|,|\/|\\|\|| /g);
	}

	/**
	 * 把字符串分割对象分割格式是
	 * 		key1{sp1}value1{sp2}key2{sp1}value2
	 * 	例1(ULR参数):
	 * 		var parm = 'parm1=a&parm2=b&parm3=c';
	 * 		var res = parm.parseText('&','=');
	 *   --->
	 *   	 Object {parm1: "a", parm2: "b", parm3: "c"}
	 * 例2(style):
	 * 		var style = 'width:538px;font-size:13px;line-height:1.54;word-wrap:break-word;word-break:break-word;'
	 * 		var res = style.parseText(';',':');
	 * 	  --->
	 * 	  	Object {'width':"538px",'font-size':"13px",'line-height':"1.54",'word-wrap':"break-word",'word-break': " break-word"}
	 *
	 *例3(cookie)
	 *		略
	 *
	 * ....
	 * @param  {string} sp1  第一级分割
	 * @param  {String} sp2  第二级分割
	 * @param  {Boolean} bool  参数是否进行解码
	 * @return {Object}      解析后对象
	 */

	function parseText(sp1, sp2, bool) {
		var reg = new RegExp('([^' + sp1 + '' + sp2 + ']+)' + sp2 + '([^' + sp1 + ']*)', 'g'),
			m, de = decodeURIComponent,
			result = {};
		while (m = reg.exec(this)) {
			result[m[1].trim()] = bool ? de(m[2].trim()) : m[2].trim();
		}
		return result;
	}

	//export
	Base.extend(String.prototype, {
		tidy: tidy,
		safely: safely,
		startsWith: String.prototype.startsWith || startsWith,
		endsWith: String.prototype.endsWith || endsWith,
		trim: String.prototype.trim || trim,
		replaceAll: String.prototype.replaceAll || replaceAll,
		hashCode: hashCode,
		toArray: toArray,
		parseText: parseText
	});

})(window);

	/* minifyOnSave, filenamePattern: ../dist/$1.$2 */
/**
 * 随机字符串
 */
(function(g, und) {
	"use strict";

	var DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
		'K', 'L', 'M', 'N', 'O',
		'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',
		'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
		'w', 'x', 'y', 'z', '!', '"', '#', '$', '%', '&', '\'', '(', ')', '*', '+', ',', '-', '.', '/', ':', ';', '<',
		'=', '>', '?', '@', '[', '\\', ']', '^', '_', '`', '{',
		'|', '}', '~'
	];

	/**
	 * 随机int值
	 * 例如:
	 * 		next(100)    --->     56
	 * 		next(100)    --->     24
	 *   	next()    --->     1385972025
	 *
	 * @param  {int}   max 最大值,允许为Null
	 * @return {int}     随机int
	 */
	function next(max) {
		return range(0, max);
	}

	/**
	 * 随机区间
	 * 例如:
	 * 		rang( 10, 20 )    --->   19
	 * 		rang( 10, 20 )    --->   14
	 * 		rang( 10, 20 )    --->   16
	 *
	 *   	rang( 0, 200 )    --->   172
	 *     	rang( 0, 200 )    --->   92
	 *
	 * 		rang()    --->     1385972025
	 * @param  {int} min 最小值,默认值0
	 * @param  {int} max 最大值,默认值2147483647
	 * @return {int}     随机int
	 */
	function range(min, max) {
		min = min ? min : 0;
		max = max ? max : 2147483647;
		return 0 | min + Math.random() * (max - min);
	}

	/**
	 * 随机数字,默认长度10
	 * numeric()   --->  "6397714408"
	 * numeric(20)	 --->  "92309566099595988075"
	 *
	 *
	 * @param  {int} length 数字长度
	 * @return {String}        随机结果
	 */
	function numeric(length) {
		return random(length, 0, 10);
	}

	/**
	 * 随机大写字母,默认长度10
	 * 	upper()  --->  "PXJAYEDQFY"
	 * 	upper(20)  --->  "NPNQAKTIBIIJORCFCUIR"
	 * @param  {int} length 长度,默认10
	 * @return {String}        随机结果
	 */
	function upper(length) {
		return random(length, 10, 36);
	}
	/**
	 * 随机小写字母,默认长度10
	 * 	lower()   --->   "ngtddgdjqw"
	 * lower(6)   --->   "lauzdt"
	 * @param  {int} length 长度,默认10
	 * @return {String}        随机结果
	 */
	function lower(length) {
		return random(length, 36, 62);
	}

	/**
	 * 随机字符串,只包含大写字母和小写字母,默认长度10
	 * 	string()  --->  "sCacArUJSZ"
	 *  string(20)   --->   "whqCwtRuSIvwSaTmeYcZ"
	 *
	 * @param  {int} length 长度,默认10
	 * @return {String}        随机结果
	 */
	function string(length) {
		return random(length, 10, 62);
	}

	/**
	 * 随机字母,只包含大小写字母 数字
	 * 	alphabetic()  --->  "1ZP91KOqMb"
	 * alphabetic(20)  --->  "p7ySCK5SaJgIEMFMpoKa"
	 *
	 * @param  {int} length 长度,默认10
	 * @return {String}        随机结果
	 *
	 * @private
	 */
	function alphabetic(length) {
		return random(length, 0, 62);
	}

	/**
	 * 随机算法
	 * @param  {int} count 随机字符串长度
	 * @param  {int} start 开始位置
	 * @param  {int} end   结束位置
	 * @return {String}       随机字符串
	 */
	function random(count, start, end) {
		var ch = 0,
			rand,
			buf = [],
			gap = end - start;
		count = count || 10;
		while (count-- != 0) {
			rand = Math.floor(Math.random() * gap);
			ch = DIGITS[rand + start];
			buf[count] = ch;
		}
		return buf.join('');
	}

	//export
	g.Random = Base.Random = {
		next: next,
		range: range,
		numeric: numeric,
		upper: upper,
		lower: lower,
		string: string,
		alphabetic: alphabetic
	}

})(window);

	/* minifyOnSave, filenamePattern: ../dist/$1.$2 */
/**
 * Ready 方法分三个步骤:
 * 	1.	before
 * 	2. 	ready
 *  3.  after/setup
 *
 * 	执行顺序是:
 *  	before --> ready --> after/setup
 *
 * 例:
 * 	//beffer事件
 * 	Ready.before(function (){console.dir("before 1")})
 * 	Ready.before(function (){console.dir("before 2")})
 *  Ready.before(function (){console.dir("before 3")})
 *  //ready事件
 * 	Ready.ready(function (){console.dir("ready 1")})
 *  Ready.ready(function (){console.dir("ready 2")})
 *  Ready.ready(function (){console.dir("ready 3")})
 *  //after/setup事件
 *  Ready.setup(function C(){console.dir("after 1")})
 *  Ready.after(function C(){console.dir("after 2")})
 *  Ready.after(function C(){console.dir("after 3")})
 *
 */
(function(g, und) {
	"use strict";
	var
		array = [
			//before
			[],
			//ready
			[],
			//after
			[]
		],
		sub = 'DOMContentLoaded',
		wasReady = false,
		global = document;

	function handler(e) {
		if (wasReady) {
			return;
		}
		try {
			var f, i = 0
			for (; i < array.length; i++) {
				try {
					array[i].forEach(function(fn) {
						f = fn;
						fn.call(fn);
					});
				} catch (e) {
					console.error("ready失败, 失败函数是: ");
					console.dir(f);
					console.error(e);
				}
				delete array[i];
			}
		} finally {
			wasReady = true;
			//global.removeEventListener("DOMContentLoaded", handler, false);
			global.removeEventListener(sub, handler, false);
		}
	};

	global.addEventListener(sub, handler, false);
	//global.addEventListener("DOMContentLoaded", handler, false);

	function bind(i, fn) {
		wasReady ? fn.call(fn) : array[i].push(fn);
	}

	var ready = {
		/**
		 * Ready 的before事件
		 * @param  {Function} fn 事件函数
		 * @return {Void}
		 */
		before: function(fn) {
			bind(0, fn);
		},

		/**
		 * Ready的ready事件
		 * @param  {Function} fn 事件函数
		 * @return {Void}
		 */
		ready: function(fn) {
			bind(1, fn);
		},

		/**
		 * Ready的after事件
		 * @param  {Function} fn 事件函数
		 * @return {Void}
		 */
		after: function(fn) {
			bind(2, fn);
		},

		/**
		 * 与after事件相同
		 * @param  {Function} fn 事件函数
		 * @return {[type]}      [description]
		 */
		setup: function(fn) {
			bind(2, fn);
		},

		wasReady: function() {
			return wasReady;
		}
	};
	//export
	g.Ready = Base.Ready = ready;
	g.ready = ready.ready;
	//Base.ready = Base.WasReady.ready;
})(window);

	/* minifyOnSave, filenamePattern: ../dist/$1.$2 */
(function(g, und) {
	var K = 1024,
		M = K * 1024,
		G = M * 1024;

	var format = {

		/**
		 * dateParse('1486009338057')
		 * dateParse('1486009400')
		 * dateParse(1486009338057)
		 * dateParse(1486009400)
		 * dateParse('2017-1-1 23:23:23')
		 * dateParse('2017-01-01 23:23:23.1234')
		 * dateParse('2017-1-1')
		 * dateParse('2017年1月1日')
		 * dateParse('2017年1月1日 23时23分23秒')
		 * dateParse('Thu Feb 02 2017 12:28:15 GMT+0800 (CST)')
		 * dateParse('Thu Feb 02 12:29:20 CST 2017')
		 * dateParse(new Date())
		 *
		 * 解析字符串为时间对象
		 * @param  {String/Long/Date} 字符串或者long类型时间
		 * @return {Date}      时间对象
		 */
		dateParse: function(date) {
			var res,
				time;
			Is.number(date) && (date = date + '');
			if (Is.str(date)) {
				if (/^[0-9]{13}$/.test(date)) {
					time = parseInt(date);
				} else if (/^[0-9]{10}$/.test(date)) {
					time = parseInt(date) * 1000;
				} else {
					try {
						date = date.replace(/年|月|日/g, '-')
						date = date.replace(/时|分|秒/g, ':')
						time = Date.parse(date);
					} catch (e) {}
				}
				time && (res = new Date(time));
			} else if (Is.date(date)) {
				res = date;
			}
			return res;
		},

		/**
		 * 时间格式化. 格式是: 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
		 * 例如:
		 *    dateFormat(new Date() , 'yyyy-MM-dd ')
		 *    dateFormat(new Date() , 'yyyy-MM-dd hh:mm:ss')
		 *    dateFormat(new Date() , 'yyyy-M-d h:m:s.S')
		 *    //精确到毫秒
		 *    dateFormat('1486009338057')
		 *    //精确到秒
		 *    dateFormat('1486009400')
		 *    dateFormat(1486009338057)
		 *    dateFormat(1486009400)
		 *    dateFormat('2017-1-1 23:23:23')
		 *    dateFormat('2017-01-01 23:23:23.1234')
		 *    dateFormat('2017-1-1')
		 *    dateFormat('2017年1月1日')
		 *    dateFormat('2017年1月1日 23时23分23秒')
		 *    dateFormat('Thu Feb 02 2017 12:28:15 GMT+0800 (CST)')
		 *    dateFormat('Thu Feb 02 12:29:20 CST 2017')
		 *    dateFormat(new Date())
		 *
		 * @param  {Date/long/String} date 时间对象
		 * @param  {String} fmt  格式化格式, 默认格式: yyyy-MM-dd hh:mm:ss
		 * @return {String}      格式化结果
		 */
		dateFormat: function(date, fmt) {
			fmt = fmt || 'yyyy-MM-dd hh:mm:ss';
			date = format.dateParse(date);
			var o = {
				"M+": date.getMonth() + 1, //月份
				"d+": date.getDate(), //日
				"h+": date.getHours(), //小时
				"m+": date.getMinutes(), //分
				"s+": date.getSeconds(), //秒
				"q+": Math.floor((date.getMonth() + 3) / 3), //季度
				"S": date.getMilliseconds() //毫秒
			};
			if (/(y+)/.test(fmt))
				fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
			for (var k in o)
				if (new RegExp("(" + k + ")").test(fmt))
					fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			return fmt.trim();
		},

		/**
		 * size(1000)	--> 100Byte
		 * size(1024)	--> 1K
		 * size(1024*1024)	--> 1M
		 * size(1024*1024*1024)	--> 1G
		 * @param  {Long} size 不带单位
		 * @return {String}    换算单位
		 */
		size: function(size) {
			var r = 0,
				t = this;
			if (size >= K && size < M) {
				r = t.round(size / K) + 'K';
			} else if (size >= M && size < G) {
				r = t.round(size / M) + 'M';
			} else if (size >= G) {
				r = t.round(size / G) + 'G';
			} else {
				r = size + 'Byte';
			}
			return r;
		},

		/**
		 * 四舍五入保留两位小数
		 * @param  {[type]} num [description]
		 * @return {[type]}     [description]
		 */
		round: function(num) {
			return Math.round(num * 100) / 100;
		},

		/**
		 * 转换bool类型
		 *
		 * 		bool(null)			--->   false
		 * 		bool(undefined)			--->   false
		 *   	//bool类型
		 *   	bool(true)			--->   true
		 *    	bool(false)			--->   false
		 *
		 *    	//字符串 t 1 true on 都是true,其他都是false(不区分大小写)
		 *    	bool('t')			--->   true
		 *    	bool('T')			--->   true
		 *    	bool('1')			--->   true
		 *    	bool('true')			--->   true
		 *    	bool('on')			--->   true
		 *
		 *    	//数字大于等于1都是true,小于1都是false
		 *     bool(1)			--->   true
		 *     bool(10)			--->   true
		 *     bool(0)			--->   false
		 *
		 *     //其他false
		 *		bool({})			--->   false
		 * @param  {[type]} obj [description]
		 * @return {[type]}     [description]
		 */
		bool: function(obj) {
			var r = false;
			if (obj === null || obj === und) {
				r = false;
			} else if (Is.bool(obj)) {
				r = obj;
			} else if (Is.str(obj)) {
				obj = obj.toLowerCase();
				r = obj == 't' || obj == '1' || obj == 'true' || obj == 'on';
			} else if (Is.number(obj)) {
				r = obj >= 1;
			}
			return r;
		}
	}

	//export
	g.Format = Base.Format = format;
})(window);

	/* minifyOnSave, filenamePattern: ../dist/$1.$2 */
(function(g, und) {

	var o = function(obj) {
		for (var k in obj) {
			o[k] = obj[k];
		}
	};

	var reg = /([^&=]+)=([^&]*)/g,
		pars = location.search.substring(1),
		m;
	while (m = reg.exec(pars)) {
		o[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
	}
	Base.Options = o
})(window);

	/* minifyOnSave, filenamePattern: ../dist/$1.$2 */


(function(g, und) {

	/**
	 * 请求远程地址
	 * @param  {String}   method   请求方法: GET POST DELETE PUT 等等
	 * @param  {String}   url      请求URL地址
	 * @param  {Object}   options  请求参数
	 * @param  {Function} callback 成功回调函数
	 * @param  {Function}   errback  失败回调函数
	 * @return {Void}            [description]
	 */
	function xhr(method, url, options, callback, errback) {
		options = options || {};
		var req = new XMLHttpRequest(),
			response = function() {
				var res = req.responseText,
					ct = req.getResponseHeader('Content-type');
				(ct.indexOf('application/json') >= 0 || options['dataType'] == 'json') && (res = JSON.parse(res));
				return res;
			};
		req.open(method || 'GET', url, options.async === und ? true : options.async);
		if (options.credentials) {
			req.withCredentials = true;
		}
		for (var k in options.headers || {}) {
			req.setRequestHeader(k, options.headers[k]);
		}
		req.onload = function() {
			var fn = ((req.status >= 200 && req.status < 300) || req.status === 304 ? callback : errback),
				res = response();
			fn && fn(res);
		};
		req.send(options.data || options.body || void 0);

		//同步请求直接返回结果
		if (options.async === false) return response();
	}

	//export
	var ret = {};
	[
		'ajax',
		'get',
		'post'
	].forEach(function(v) {
		ret[v] = function(opt) {
			if (Is.str(opt)) opt = {
				url: opt
			};
			return xhr(v == 'ajax' ? opt.method : v, opt.url, opt, opt.success, opt.error);
		}
	});


	/**
	 * 远程方法调用, 配合服务action调用, 要求服务端返回 json 格式:
	 * 正确(ec=0)对象:
	 * 		{
	 *			"ec": 0,
	 *			"obj": {
	 *				"a": "a"
	 *		  	}
	 *	    }
	 *正确(ec=0)列表:
	 * 		{
	 *			"ec": 0,
	 *			"list": [
	 *				{
	 *					"a": "a"
	 *				},
	 *				{
	 *					"a": "b"
	 *				}
	 *			]
	 *	  	}
	 * 错误(ec非0):
	 * 		{
	 *			"ec": 1,
	 *			"ec": "错误原因"
	 *	  	}
	 * @param  {[type]} opt [description]
	 * @return {[type]}     [description]
	 */
	ret.call = function(opt) {
		var suc = opt.success || function(res) {},
			er = opt.error || function(ec, es) {
				alert(es)
			};
		opt.dataType = 'json';
		return xhr(opt.method, opt.url, opt, function(res) {
			res.ec == 0 ? suc(res.obj || res.list) : er(res.ec, res.es);
		}, er);
	}

	g.ajax = ret.ajax;
	Base.Xhr = Base.Ajax = g.Xhr = g.Ajax = ret;
})(window);

	/* minifyOnSave, filenamePattern: ../dist/$1.$2 */


/**
 *
 * 模板代码:
 * 	<div id="tpl1"></div>
 *  <div id="tpl2"></div>
 * 		<script type="text/template" id="test_tpl" >
 * 			<ul>
 * 				<# for ( var i = 0; i < obj.length; i++ ) { #>
 * 				<li><a href="<#=obj[i].url#>"><#=obj[i].name#>&nbsp;-&nbsp;<#=Format.dateFormat(obj[i].ctime)#> </a></li>
 * 				<# } #>
 * 			</ul>
 * 		</script>
 * 生成对象
 *   <script type="text/javascript">
 *   	var users=[
 *   		{"name":"Byron", "url":"http://localhost" ,"ctime":"1486395930045"},
 *   		{"name":"Casper", "url":"http://localhost","ctime":"1486395930045"},
 *   		{"name":"Frank", "url":"http://localhost","ctime":"1486395930045"}
 *   	];
 *   	var str = template("test_tpl", users);
 * 		console.log(str);
 *
 *		Template.render(users,"test_tpl",tpl1);
 *  	Template.render(users,"test_tpl",document.getElementById('tpl2'));
 *
 *   </script>
 *
 * 原理参见 : http://ejohn.org/blog/javascript-micro-templating/
 */
(function(g, und) {

	function compile(tpl, data) {
		// Figure out if we're getting a template, or if we need to
		// load the template - and be sure to cache the result.
		var fn = new Function("obj",
			"var p=[],print=function(){p.push.apply(p,arguments);};" +

			// Introduce the data as local variables using with(){}
			"with(obj){p.push('" +

			// Convert the template into pure JavaScript
			tpl
			.replace(/[\r\t\n]/g, " ")
			.split("<#").join("\t")
			.replace(/((^|#>)[^\t]*)'/g, "$1\r")
			.replace(/\t=(.*?)#>/g, "',$1,'")
			.split("\t").join("');")
			.split("#>").join("p.push('")
			.split("\r").join("\\'") + "');}return p.join('');")

		// Provide some basic currying to the user
		return data ? fn(data) : fn;
	}

	function template(tpl, data) {
		if (tpl instanceof HTMLElement) {
			tpl = tpl.innerHTML.trim();
		} else if (typeof tpl === 'string' && tpl.indexOf('<#') < 0) {
			var dom = document.querySelector(tpl);
			dom && (tpl = dom.innerHTML.trim());
		}
		return compile(tpl, data);
	}


	//export
	g.Template = {

		compile: compile,

		template: template,

		/**
		 * 使用模板把对象渲染到节点上
		 * @param  {Object} obj   渲染的对象
		 * @param  {String} tplid 模板节点ID
		 * @param  {String/Element} target 被渲染的节点, 参数是: 节点id或者节点dom对象
		 * @return {Void}
		 */
		render: function(obj, tplid, target) {
			var dom = Is.ele(target) ? target : document.getElementById(target);
			obj && dom && (dom.innerHTML = template("#" + tplid, obj));
		}
	}

})(window);

	/* minifyOnSave, filenamePattern: ../dist/$1.$2 */
(function(g, und) {

	var routes = {},
		defaultAction;

	var Route = {

		/**
		 * 初始化路由
		 * @param  {Object} map  路由规则
		 * @param  {Element/String} root 根节点
		 * @return {Void}
		 */
		init: function(map, root) {
			this.rebuild(map, root)
			fire(g.location.hash);
		},

		rebuild: function(map, root) {
			for (var k in map) {
				add(k, map[k], root);
			}
		},

		/**
		 * 删除路由
		 * @return {[type]} [description]
		 */
		del: function(k) {
			delete routes[k];
		},

		/**
		 * 动态触发路由,改变hash
		 * @param  {[type]} path [description]
		 * @return {[type]}      [description]
		 */
		go: function(path) {
			path && (location.hash = path);
		},

		/**
		 * 获取路由参数
		 * @type {[type]}
		 */
		param: param,

		/**
		 * 添加路由
		 */
		add: add,

		/**
		 * 动态触发路由,
		 * @type {[type]}
		 */
		trigger: fire

	};

	/**
	 * 获取路由参数
	 * @return {[type]} [description]
	 */
	function param() {
		var newURL = g.location.hash,
			answer = [];
		if (newURL) {
			var url = newURL.replace(/.*#/, '');
			for (var path in routes) {
				var reg = getRegExp(path),
					result = reg.exec(url);
				if (result && result[0]) {
					answer = result.slice(1);
					answer.pop();
					break;
				}
			}
		}
		return answer;
	}

	/**
	 * 添加路由规则
	 * @param {[type]} k   [description]
	 * @param {[type]} obj [description]
	 */
	function add(k, obj, root) {
		var before, require, bind, ele;
		if (typeof obj === 'function') {
			before = obj;
		} else {
			before = obj['before'];
			require = obj['require'];
			bind = obj['bind'];
			ele = obj['ele'] || root;
			ele = typeof ele === 'string' ? document.querySelector(ele) : ele;
		}
		obj = {
			before: before,
			ele: ele,
			require: require,
			bind: bind
		};
		k == '*' ? (defaultAction = obj) : (routes[k] = obj);
	}

	/**
	 * 执行全部匹配路由
	 * @param  {String} onChangeEvent 路径
	 * @return {Void}
	 */
	function fire(path) {
		path = path || '*';
		var url = path.replace(/.*#/, ''),
			found = false,
			handler;
		for (var path in routes) {
			var reg = getRegExp(path),
				result = reg.exec(url);
			if (result && result[0] && result[0] != '') {
				handler = routes[path];
				result.pop();
				handler && (found = true, routePath(handler, result));
			}
		}

		!found && defaultAction && routePath(defaultAction, result);
	}

	/**
	 * 执行路由规则
	 * @param  {[type]} handler [description]
	 * @param  {[type]} result  [description]
	 * @return {[type]}         [description]
	 */
	function routePath(handler, result) {
		var ele = handler.ele;
		handler.before && handler.before.apply(null, result && result.slice(1));
		//发起require请求
		//<div require="frag/g.tpl" bind="js/bind.json" observer></div>
		if (ele) {
			handler.bind && ele.setAttribute('bind', handler.bind);
			handler.require && ele.setAttribute('require', handler.require);
		}
	}

	/**
	 * 参数正则表达式
	 * @param route
	 * @returns {RegExp}
	 */
	function getRegExp(route) {
		var optionalParam = /\((.*?)\)/g,
			namedParam = /(\(\?)?:\w+/g,
			splatParam = /\*\w+/g,
			escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
		route = route.replace(escapeRegExp, '\\$&')
			.replace(optionalParam, '(?:$1)?')
			.replace(namedParam, function(match, optional) {
				return optional ? match : '([^/?]+)';
			})
			.replace(splatParam, '([^?]*?)');
		return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
	}

	'onhashchange' in g && (
		g.addEventListener('hashchange', function(onChangeEvent) {
			fire(onChangeEvent && onChangeEvent.newURL || g.location.hash);
		})
	);

	//export
	g.Route = Base.Route = Route;
})(window);

	