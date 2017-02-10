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
