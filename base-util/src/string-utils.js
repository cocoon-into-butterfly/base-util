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
