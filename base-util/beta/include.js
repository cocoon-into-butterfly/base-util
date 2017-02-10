(function(g, und) {
	var timestep = (new Date()).getTime(),
		ScriptFragment = '<script[^>]*>([\\S\\s]*?)<\/script\\s*>';

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
		m == null && (html = c);
		return [html, js];
	}

	function fragment(html) {
		var frag, tmp, doc = document;
		if (html) {
			tmp = doc.createElement("div");
			frag = doc.createDocumentFragment();
			tmp.innerHTML = html;
			while (tmp.firstChild) {
				frag.appendChild(tmp.firstChild);
			}
		}
		return frag;
	};


	function render(dom, src) {
		var res = stripScripts(src),
			notify = dom.getAttribute('notify'),
			fn = dom.getAttribute('onsuccess');
		if (res[0]) {
			var frag = fragment(res[0]);
			include(frag);
			dom.replaceWith(frag);
		}
		if (res[1]) {
			var sc = document.createElement("script");
			sc.setAttribute("type", 'text/javascript');
			sc.setAttribute("charset", "utf-8");
			if (URL) {
				var url = URL.createObjectURL(new Blob([res[1]]));
				sc.setAttribute("src", url);
			} else {
				sc.text = res[1];
			}
			sc.addEventListener('load', function(e) {
				document.body.removeChild(sc);
			}, false);
			document.body.appendChild(sc);
		}

		//渲染成功后触发事件
		if (notify) {
			var e = document.createEvent('CustomEvent');
			e.initCustomEvent(notify, true, true, {});
			document.dispatchEvent(e);
		}
		fn && eval(fn);

	}

	function burl(src) {
		var pos = src.lastIndexOf('?');
		src += pos > 0 ? '&' : '?';
		return src + "?timestep=" + timestep;
	}

	function remote(dom, src, ver, fn) {
		var encache = Base['Options'] ? Base.Options.cache : true;
		!ver && (ver = 0);
		Base.Storage.get(src, function(res) {
			var hit = false,
				r = function(content) {
					render(dom, content);
					fn && fn();
				};
			if (encache == true && res && res.startsWith('${')) {
				var pos = res.indexOf('}');
				if (pos > 0 && ver + '' == res.substring(2, pos)) {
					hit = true;
					r(res.substring(pos + 1));
				}
			}
			if (hit == false) {
				var xhr = new XMLHttpRequest();
				xhr.onload = function() {
					if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
						Base.Storage.set(src, '${' + ver + '}' + xhr.responseText, function() {
							r(xhr.responseText);
						});
					}
				};
				xhr.open('GET', burl(src), true);
				xhr.send(null);
			}
		});
	}

	/**
	 * html 实现include功能(内部可以相互嵌套)
	 * index.html :
	 * <include src="a.html"  />
	 * <include src="a.html" />
	 *
	 * a.html :
	 * <div>a</div>
	 * <include src="b.html" />
	 *
	 * b.html
	 * <div>b</div>
	 *
	 * include节点上属性定义:
	 * 		1> version 表示当前被引入内容的版本号,如果版本号发生变更从指定的地址获取内容,否则从本地获取内容
	 * 		2> notify 表示当前include节点被渲染完成后发起的通知事件名称,接收事件方式如下:
	 * 					document.addEventListener(notify,function(){})
	 *      	同时也可以使用jquer的on方法处理事件
	 *      			$(document).on(notify,function(){})
	 *      3> onsuccess  渲染成功后执行事件
	 *
	 * 完整实例:
	 * 	index.html :
	 *  <include src="a.html" version="2.0.0" nogify="includeReady" onsuccess="success()"/>
	 *	<script type="text/javascript">
	 * 		document.addEventListener('includeReady',function(){
	 *
	 * 	 	})
	 * 	 	function success(){
	 *
	 * 	 	}
	 *  </script>
	 *
	 * a.html :
	 * 	<div>test include</div>
	 * @param  {Document} dom  [description]
	 * @param  {[type]} sync [description]
	 * @return {[type]}      [description]
	 */
	function include(dom) {
		var arr = dom.querySelectorAll('include[src]'),
			ver = Base['Options'] ? Base.Options.version : 0,
			dom,
			src;
		if (arr) {
			for (var i = 0, l = arr.length; i < l; i++) {
				dom = arr[i];
				src = dom.getAttribute('src');
				src && remote(dom, src, dom.getAttribute('version') || ver);
			}
		}
	}
	Base.Include = {
		include: include,
		remote: remote,
	}
})((! function() {
	{
		if (typeof(Base) === 'undefined') B = Base = {}
	};
}(), window));
