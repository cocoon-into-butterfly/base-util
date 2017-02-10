/* minifyOnSave, filenamePattern: ../dist/$1.$2 */

/**
 * 远程方法调用
 */
(function(g, und) {

	/**
	 * 远程方法调用, 配合服务action调用, 要求服务端返回json,格式如下:
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
	 *
	 * 注意:
	 * 		1> 这里使用的同步请求
	 * 		2> 如果服务端错误,方法抛出Error
	 * @param  {[type]} url     [description]
	 * @param  {[type]} data    [description]
	 * @param  {[type]} headers [description]
	 * @return {[type]}         [description]
	 */
	function call(url, data, headers) {
		var parm = [];
		for (var k in data || {}) {
			parm.push(k + '=' + encodeURIComponent(data[k]));
		}
		var opt = {
				method: 'post',
				url: url,
				dataType: 'json',
				credentials: true,
				//强制使用同步方式请求
				async: false,
				headers: headers,
				data: parm.join('&'),
			},
			res = Base.Xhr.get(opt);
		if (res.ec == 0) {
			return res.obj || res.list;
		} else {
			var e = new Error(res.es);
			e.code = res.ec;
			throw e;
		}
	}

	function query(action, data, headers) {
		return call(action + '/query.do', data, headers);
	}

	function insert(action, data, headers) {
		return call(action + '/insert.do', data, headers);
	}

	function update(action, data, headers) {
		return call(action + '/insert.do', data, headers);
	}

	function del(action, data, headers) {
		return call(action + '/delete.do', data, headers);
	}

})(window);
