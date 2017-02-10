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
		wasReady ? fn.call(fn) : array[i].push(fn);
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
