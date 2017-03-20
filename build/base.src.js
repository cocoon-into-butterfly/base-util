
// build time: 20170306
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
		reg = /complete|loaded|interactive/,
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
		wasReady || reg.test(g.readyState) ? fn.call(fn) : array[i].push(fn);
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

	