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
			for (var k in map) {
				add(k, map[k], root);
			}
			fire(g.location.hash);
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
	 * 添加路由规则
	 * @param {[type]} k   [description]
	 * @param {[type]} obj [description]
	 */
	function add(k, obj, root) {
		var before, require, bind, ele;
		if (k == '*') {
			obj && (defaultAction = obj);
		} else {
			if ((typeof obj === 'function')) {
				before = obj;
			} else {
				before = obj['before'];
				require = obj['require'];
				bind = obj['bind'];
				ele = obj['ele'] || root;
				ele = typeof ele === 'string' ? document.querySelector(ele) : ele;
			}
			routes[k] = {
				before: before,
				ele: ele,
				require: require,
				bind: bind
			};
		}
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
				if (handler) {
					handler.before && handler.before.apply(null, result.slice(1));
					if (handler.ele) {
						handler.bind && handler.ele.setAttribute('bind', handler.bind);
						handler.require && handler.ele.setAttribute('require', handler.require);
					}
				}
				found = true;
			}
		}
		if (!found && defaultAction) {
			defaultAction();
		}
	}

	/**
	 * 引自backbone，非常牛逼的正则
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
