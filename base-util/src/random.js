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
