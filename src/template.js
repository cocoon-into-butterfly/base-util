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
