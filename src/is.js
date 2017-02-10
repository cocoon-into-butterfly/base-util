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
