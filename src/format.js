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
