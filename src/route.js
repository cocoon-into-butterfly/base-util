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
