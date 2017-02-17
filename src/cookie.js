/**
 * cookie
 * @type {RegExp}
 */
(function(g, und) {

	/**
	 * 获取当前域名根域(一级域名,如果是IP直接返回IP)
	 * @return {String} 域名
	 */
	function rootDomain() {
		var ipreg = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/,
			domain = document.domain,
			res;
		if (!ipreg.test(domain)) {
			var sp = domain.split('.');
			if (sp.length > 2)
				res = sp[sp.length - 2] + '.' + sp[sp.length - 1];
		}
		return res;
	}

	function match(name) {
		return document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
	}

	/**
	 * 测试cookie是否存在
	 * @param  {String} name cookie是否存在
	 * @return {Boolean}     true:存在; false:不存在
	 */
	function test(name) {
		return !!match(name);
	}

	/**
	 * 获取cookie, 如果是持久化cookie,更新新的过期时间
	 * @param  {String} name cookie名称
	 * @return {String}      值
	 */
	function get(name) {
		var res = match(name);
		if (res) {
			res = res[2];
			var pos = res.indexOf('PERSIST-');
			//如果是持久化存储,获取数据后重新更新过期时间
			if (pos >= 0) {
				res = res.substring(8);
				update(name, 'PERSIST-' + res, 90);
			}
		}
		return res;
	}

	/**
	 * 删除cookie.
	 * 	注意: 删除cookie的域名, 域名不正确无法删除cookie
	 * 例:
	 * 		Cookie.add('testcookie','123');
	 * 		Cookie.del('testcookie');
	 *
	 * 		Cookie.add('testcookie','123',1);
	 *   	Cookie.del('testcookie');
	 *
	 *
	 * 		//如果cookie设置path, 删除时必须指定path,否则无法删除
	 *		Cookie.add('testcookie','123',1,'/demo');
	 *  	Cookie.del('testcookie','/demo');
	 *
	 *    	//如果cookie设置domain, 删除时必须指定domain,否则无法删除
	 *		Cookie.add('testcookie','123',1,undefined,'base.urlo.cn');
	 *  	Cookie.del('testcookie',undefined,'base.urlo.cn');
	 *
	 *
	 * @param  {String} name   名称
	 * @param  {String} path   cookie所在路径,默认是根
	 * @param  {String} domain cookie所在域, 默认是当前域名的根域(一级域名)
	 * @return {Void}
	 */
	function del(name, path, domain) {
		add(name, 'del', -1000, path, domain);
	}

	/**
	 * 更新cookie
	 * @param {String} name   名称
	 * @param {String} value  值
	 * @param {date} expires 	过期时间,单位天, 如果没有当前session有效,即浏览器关闭立即失效
	 * @param {String} path    路径, 如果没有根路径
	 * @param {String} domain  域名, 如果没有设置根级域名(一级域名)
	 */
	function update(name, value, expires, path, domain) {
		//cookie存在, 删除后重新添加
		if (match(name))
			del(name, path, domain)
		add(name, value, expires, path, domain);
	}

	/**
	 * 存储持久化存储cookie, cookie不提供永久存储的数据,这里只是把cookie过期时间设置为90, 每次读取重新设定过期时间
	 * @param  {[type]} name   [description]
	 * @param  {[type]} value  [description]
	 * @param  {[type]} path   [description]
	 * @param  {[type]} domain [description]
	 * @return {[type]}        [description]
	 */
	function persist(name, value, path, domain) {
		add(name, 'PERSIST-' + value, 90, path, domain);
	}

	/**
	 *
	 * 添加cookie
	 * 		Cookie.add('A','A');
	 *
	 * 		//1天后过期
	 *   	Cookie.add('B','B',1);
	 *
	 *    	//2周后过期
	 *    	Cookie.add('C','C',14);
	 *
	 *     //1年后过期
	 *    	Cookie.add('C','C',365);
	 *
	 * @param {String} name   名称
	 * @param {String} value  值
	 * @param {date} expires 	过期时间,单位天, 如果没有当前session有效,即浏览器关闭立即失效
	 * @param {String} path    路径, 如果没有根路径
	 * @param {String} domain  域名, 如果没有设置根级域名(一级域名)
	 */
	function add(name, value, expires, path, domain) {
		var str = name + "=" + escape(value);
		if (expires) {
			var date = new Date();
			date.setTime(date.getTime() + expires * 24 * 3600 * 1000); //expires单位为天
			str += ";expires=" + date.toGMTString();
		}

		//指定可访问cookie的目录
		!path && (path = '/');
		str += ";path=" + path;

		//如果没有制定域名,域名设置为一级域名
		!domain && (domain = rootDomain());

		//指定可访问cookie的域
		domain && (str += ";domain=" + domain);

		document.cookie = str;
	}

	//export
	g.Cookie = Base.Cookie = {
		add: add,
		test: test,
		get: get,
		del: del,
		update: update,
		persist: persist
	}
})(window);
