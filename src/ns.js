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
