<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%
	/*
		web.xml中添加配置context-param
		<context-param>
			<param-name>model</param-name>
			<param-value>release</param-value>
		</context-param>

		<context-param>
			<param-name>version</param-name>
			<param-value>v1.0.0</param-value>
		</context-param>
	*/

	//从web.xml中获取配置model和version参数. 每次版本发布修改web.xml中配置的version, 用户刷新自动升级到最新的页面
	//也可以写入到项目配置文件中
	ServletContext sc = getServletContext();
	String model = sc.getInitParameter("release");
	String version =  sc.getInitParameter("version");
	if(model == null){
		model ="release";
	}
	if(version == null){
		version = "v1.0.0";
	}
%>
<!DOCTYPE html>
<html model="<%=model %>" version="<%=version %>" cdncache="false" notify="LappRequireNotify" assets="" onprogress="" onsuccess="">
	<head>
		<meta charset="utf-8">
		<title>Lapp title example</title>

		<!-- 导入依赖的css和js -->
		<!--
			<script type="text/javascript" src="../dist/require.js" notify="requireReady" require="" >
				css/normalize.css
				css/...
				js/base.js
				js/jquery.js
				js/swiper.js
				js/...
			</script>
		-->
	</head>
	<body>
		<!-- 导入轻应用页面结构 -->
		<!--
			<include src="" trigger="requireReady" notify="domReady" >
				frag/head.html
				frag/content.html
				frag/footer.html
			</include>
		-->
	</body>
</html>
<!-- require js -->
<script type="text/javascript">(function(a,b){Base.Version="1.0.0"})((!function(){"undefined"===typeof Base&&(B=Base={})}(),window));
(function(a,h){var g=a.indexedDB||a.mozIndexedDB||a.webkitIndexedDB||a.msIndexedDB;Base.Storage=new function(){function a(c,d){if(f)d(f.transaction("ForageStorage",c).objectStore("ForageStorage"));else{var b=g.open("Base.ForageStorage",1);b.onerror=function(){console.error("\u4e0d\u80fd\u6253\u5f00\u6570\u636e\u5e93: '"+b.error.name+"'")};b.onupgradeneeded=function(){b.result.createObjectStore("ForageStorage")};b.onsuccess=function(){f=b.result;d(f.transaction("ForageStorage",c).objectStore("ForageStorage"))}}}
var f=null;return{support:function(){return!!g},get:function(c,d){a("readonly",function(b){var e=b.get(c);e.onsuccess=function(){d(void 0!==e.result?e.result:null)};e.onerror=function(){console.error("Error in storage.get(): "+e.error.name)}})},set:function(c,d,b){a("readwrite",function(e){var a=e.put(d,c);b&&(a.onsuccess=function(){b()});a.onerror=function(){console.error("\u5199\u5165\u5931\u8d25: "+a.error.name)}})},remove:function(c,d){a("readwrite",function(b){var a=b["delete"](c);d&&(a.onsuccess=
function(){d()});a.onerror=function(){console.error("Error in storage.remove(): "+a.error.name)}})},clear:function(c){a("readwrite",function(a){var b=a.clear();c&&(b.onsuccess=function(){c()});b.onerror=function(){console.error("\u6e05\u9664\u5931\u8d25: "+b.error.name)}})}}}})(window);
!function(g,und){function depend(arr,opt){var self=this;if(self.depends=arr,self.index=0,self.opt=opt||gopt,this.next=function(){var e=self,t=e.opt.progress,r=e.index<e.depends.length?e.depends[e.index++]:EOF;if(r!=EOF){if(t&&g[t]&&g[t](e.index,e.depends.length),"string"==typeof r&&(r=[r,self.opt.version]),r.length<4){var n=self.opt.original,a="html",o=/\.js|\.css|.tpl/gi.exec(r[0]);o&&(a=o[0].substring(1));var i=r.length;1==i?r=[n,r[0],self.opt.version,a]:2==i&&(r=[n,r[0],r[1],a]),r.push(self.opt.observer)}r.opt=opt,r.original=self.opt.original}return r},this.loader=function(){var n=this.next();if(n!=EOF)self.creator.create(self,n);else{var o=self.opt,e;o.callback&&o.callback(),o.success&&eval(o.success),o.notify&&(e=global.createEvent("CustomEvent"),e.initCustomEvent(o.notify,!0,!0,{}),global.dispatchEvent(e))}},arr&&arr.length>0){var m=self.opt.model;m=!!Base.Storage.support()&&("cache"==m||"release"==m||"deploy"==m||m==und),self.creator=m?cache:dnative,self.loader()}}function create(e,t){var r=global.createElement(e);if(t)for(var n in t)att(r,n,t[n]);return r}function rov(e){e&&"BODY"!=e.tagName&&e.parentElement&&e.parentNode.removeChild(e)}function toArray(e){var t=[],r=e.split(/\n|;|,|\|/g);return e&&r.forEach(function(e){e=e.trim(),e&&!startsWith(e,"//")&&!startsWith(e,"#")&&t.push(e)}),t.length>0?t:und}function att(e,t,r){if(r==und){var n;if(Array.isArray(t)){for(var a in t)if(n=e.getAttribute(t[a]),null!=n)break}else n=e.getAttribute(t);return n&&n.replace(/(^\s*)|(\s*$)/g,""),n}e.setAttribute(t,r)}function burl(e,t){var r=t.domain,n=t.cdncache,a=e[1],o=a.lastIndexOf("?");return a+=o>0?"&":"?",(r?r:"")+a+(n===und||n===!1?"timestep="+timestep+"&version="+e[2]:"")}function get(e,t){xhr("GET",e,!0,t)}function xhr(e,t,r,n){var a=new XMLHttpRequest;if(a.onload=function(){(a.status>=200&&a.status<300||304===a.status)&&n&&n(a.responseText)},a.withCredentials=!0,a.open(e||"GET",t,r),a.send(null),r===!1)return a.responseText}function ws(e,t){var r,n=att(e,"subject")||"defaultsubject";window.WebSocket?(r=new WebSocket(t),r.onmessage=function(e){},r.onopen=function(e){r.send(n)},r.onclose=function(e){console.dir("  close : "+e.data)}):alert("你的浏览器不支持Web Socket.")}function fragment(e){var t,r,n=global;if(e)for(r=create("div"),t=n.createDocumentFragment(),r.innerHTML=e;r.firstChild;)t.appendChild(r.firstChild);return t}function stripScripts(e){for(var t,r=new RegExp(ScriptFragment,"img"),n=0,a="",o="";null!=(t=r.exec(e));)a+=e.substring(n,t.index),o+=t[1]+"\n",n=t.index+t[0].length;return 0==n?a=e:n<e.length&&(a+=e.substring(n,e.length)),[a,o]}function evalScripts(e,t,r){function n(e){rov(o),r&&r()}var a,o=create("script",{type:"text/javascript",charset:"utf-8"});URL?(a=URL.createObjectURL(new Blob([t])),att(o,"src",a)):o.text=t,o[el]("load",n,!1),o[el]("error",n,!1),head.appendChild(o)}function render(e,t,r,n){var a=stripScripts(t);if(a[0]){var o=fragment(a[0]),i="BODY"==e.tagName?"appendChild":"replaceWith";include(o),e?(r&&(e.innerHTML="",i="appendChild",!e.wasObserver&&(e.wasObserver=!0,observer(e,function(e){var t,r=[];e.forEach(function(e){t=e.target,contains(r,t)||(t.wasRequire=0,r.push(t))}),requireTag(r)}))),"replaceWith"==i?e.parentElement.replaceChild(o,e):e[i](o)):global.body.appendChild(o)}a[1]?evalScripts(e,a[1],n):n&&n()}function tpl(e,t,r,n){var a,o=att(e,["bind","bind-remote","data-url","bind-call"]);if(o&&(a=xhr("post",o,!1))){var i=JSON.parse(a);0==i.ec&&(a=i.obj||i.list,a["original-data"]=i)}a&&(t=compile(t,a)),render(e,t,n[4],r)}function hashCode(e){for(var t,e=e.replace(/\//g,""),r=0,n=0;n<e.length;n++)t=e.charCodeAt(n),32!=t&&10!=t&&13!=t&&9!=t&&(r=31*r+t,(r>2147483647||r<-2147483648)&&(r&=4294967295));return"h"+r.toString(16)}function startsWith(e,t){return e.slice(0,t.length)===t}function contains(e,t){for(var r=0;r<e.length;r++)if(t==e[r])return!0;return!1}function compile(e,t){var r=new Function("obj","var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('"+e.replace(/[\r\t\n]/g," ").split("<#").join("\t").replace(/((^|#>)[^\t]*)'/g,"$1\r").replace(/\t=(.*?)#>/g,"',$1,'").split("\t").join("');").split("#>").join("p.push('").split("\r").join("\\'")+"');}return p.join('');");return r(t)}function observer(e,t){new Mutation(t).observe(e,{attributes:!0,attributeFilter:["bind","bind-remote","data-url","bind-call","depends","require","include","src","href"]})}function require(e,t){new depend(e,"function"==typeof t?{callback:t,model:gopt.model,assets:gopt.assets,domain:gopt.domain,version:gopt.version,cdncache:gopt.cdncache,notify:gopt.notify,success:gopt.success,progress:gopt.progress}:t)}function include(e,t){var r=0,n=function(e){r--,0==r&&t&&t()};[["require,[require]",head],["include,[include]",und]].forEach(function(t){var a=e.querySelectorAll(t[0]);a.length>0&&(r++,requireTag(a,t[1],function(){n(a)}))})}var el="addEventListener",de=document.documentElement,global=g.document,forceDev=!1,EOF=und,head=global.head||de,timestep=(new Date).getTime(),relative=/(\.\.\/)+/g,ScriptFragment='<script\\s*type="text/javascript"[^>]*>([\\S\\s]*?)</script\\s*>',Mutation=function(){return g.MutationObserver||g.WebKitMutationObserver||g.MozMutationObserver}(),gopt={model:forceDev||att(de,"model")||"cache",assets:att(de,"assets")||"",domain:att(de,"domain")||"",version:att(de,"version")||0,cdncache:"true"==att(de,"cdncache"),notify:att(de,"notify"),success:att(de,"onsuccess"),progress:att(de,"onprogress")};!function(){var e=location.search.substring(1);if(e)for(var t,r=/([^&=]+)=([^&]*)/g;t=r.exec(e);)if("model"==t[1]){"dev"==t[2]&&(forceDev="dev");break}}();var dnative={create:function(e,t){this[t[3]](t[0],burl(t,e.opt),function(){!t[4]&&rov(t[0]),e.loader()},t)},js:function(e,t,r){var n=create("script",{type:"text/javascript",charset:"utf-8",src:t});r&&(n[el]("load",r,!1),n[el]("error",r,!1)),head.appendChild(n)},css:function(e,t,r){var n=create("link");n.href=t,n.rel="stylesheet",n.type="text/css",n[el]("load",r,!1),head.appendChild(n)},html:function(e,t,r,n){get(t,function(t){render(e,t,n[4],r)})},tpl:function(e,t,r,n){get(t,function(t){tpl(e,t,r,n)})}},cache={create:function(e,t){var r=this;r.cached(t[1],burl(t,e.opt),t[2],function(n){r[t[3]](t[0],n,function(){!t[4]&&rov(t.original),e.loader()},t)})},cached:function(e,t,r,n){var a=hashCode(e);Base.Storage.get(a,function(e){var o,i=!1;e&&startsWith(e,"${")&&(o=e.indexOf("}"),o>0&&r+""==e.substring(2,o)&&(i=!0)),i?n(e.substring(o+2)):get(t,function(e){Base.Storage.set(a,"${"+r+'}"'+e,function(){n(e)})})})},js:function(e,t,r){evalScripts(e,t,r)},css:function(e,t,r,n){t&&n.opt&&n.opt.assets&&(t=t.replace(relative,n.opt.assets));var a=create("style",{type:"text/css"});a.appendChild(global.createTextNode(t)),head.appendChild(a),r&&r()},html:function(e,t,r,n){render(e,t,n[4],r)},tpl:tpl},requireTag=function(e,t,r){var n,a,o,i;if(e.length>0)for(var s=0,c=e.length;s<c;s++)n=e[s],o=att(n,["trigger"]),o?global[el](o,function(e){var t='[trigger="'+e.type+'"]';["require"+t+",[require]"+t,"include"+t+",[include]"+t].forEach(function(e){var t=global.querySelectorAll(e);if(t.length>0){for(var r=[],n=0;n<t.length;n++)t[n].removeAttribute("trigger"),r.push(t[n]);requireTag(r)}})},!1):(a=att(n,["depends","require","include","src","href"]),!a&&(a=n.text||n.innerHTML),a&&!n.wasRequire&&(n.wasRequire=!0,i={original:n,observer:n.hasAttribute("observer"),model:forceDev||att(n,"model")||gopt.model,assets:att(n,"assets")||gopt.assets,domain:att(n,"domain")||gopt.domain,version:att(n,"version")||gopt.version,cdncache:att(n,"cdncache")||gopt.cdncache,notify:att(n,"notify")||gopt.notify,success:att(n,"onsuccess")||gopt.success,progress:att(n,"onprogress")||gopt.progress,callback:r},a=toArray(a),a.length>0&&new depend(a,i)))};requireTag(global.querySelectorAll("script[depends],script[require]"),head);var handler=function(){include(global)};global[el]("DOMContentLoaded",handler,!1),g.Require=Base.Require={bindNotify:function(e,t){global[el](e,t,!1)},clean:function(){Base.Storage.support()&&Base.Storage.clear()},require:require,include:include}}(window);!function(o,n){for(var e,i=function(o){for(var n in o)i[n]=o[n]},t=/([^&=]+)=([^&]*)/g,c=location.search.substring(1);e=t.exec(c);)i[decodeURIComponent(e[1])]=decodeURIComponent(e[2]);o.Options=Base.Options=i}(window);</script>