/* minifyOnSave, filenamePattern: ../dist/$1.$2 */


(function(g, und) {
	var el = 'addEventListener',
		de = document.documentElement,
		//document对象全局定义
		global = g.document,
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
			model: att(de, 'model') || 'cache',
			assets: att(de, 'assets') || '',
			version: att(de, 'version') || 0,
			cdncache: att(de, 'cdncache') == 'true',
			notify: att(de, 'notify'),
			success: att(de, 'onsuccess'),
			progress: att(de, 'onprogress')
		};

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
				dom.wasRequire = true;
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
					opt = {
						original: dom,
						observer: dom.hasAttribute('observer'),
						//pos:att(dom, 'model')
						model: att(dom, 'model') || gopt.model,
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
