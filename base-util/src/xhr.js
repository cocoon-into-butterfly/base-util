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
