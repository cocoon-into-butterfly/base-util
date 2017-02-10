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
			<require>
				css/normalize.css
				css/...
				js/base.js
				js/jquery.js
				js/swiper.js
				js/...
			</require>
		-->
	</head>
	<body>
		<!-- 导入轻应用页面结构 -->
		<!--
			<include src="">
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
!function(g,und){function depend(arr,opt){var self=this;if(self.depends=arr,self.index=0,self.opt=opt||gopt,this.next=function(){var e=self,t=e.opt.progress,n=e.index<e.depends.length?e.depends[e.index++]:EOF;if(n!=EOF){if(t&&g[t]&&g[t](e.index,e.depends.length),"string"==typeof n&&(n=[n,self.opt.version]),n.length<4){var r=self.opt.original,o="html",a=/\.js|\.css|.tpl/gi.exec(n[0]);a&&(o=a[0].substring(1));var i=n.length;1==i?n=[r,n[0],self.opt.version,o]:2==i&&(n=[r,n[0],n[1],o]),n.push(self.opt.observer)}n.original=self.opt.original}return n},this.loader=function(){var n=this.next();if(n!=EOF)self.creator.create(self,n);else{var o=self.opt,e;o.callback&&o.callback(),o.success&&eval(o.success),o.notify&&(e=global.createEvent("CustomEvent"),e.initCustomEvent(o.notify,!0,!0,{}),global.dispatchEvent(e))}},arr&&arr.length>0){var m=self.opt.model;m=!!Base.Storage.support()&&("cache"==m||"release"==m||"deploy"==m||m==und),self.creator=m?cache:dnative,self.loader()}}function create(e,t){var n=global.createElement(e);if(t)for(var r in t)att(n,r,t[r]);return n}function rov(e){e&&e.parentElement&&e.parentNode.removeChild(e)}function toArray(e){var t=[],n=e.split(/\n|;|,|\|/g);return e&&n.forEach(function(e){e=e.trim(),e&&!startsWith(e,"//")&&!startsWith(e,"#")&&t.push(e)}),t.length>0?t:und}function att(e,t,n){if(n==und){var r;if(Array.isArray(t)){for(var o in t)if(r=e.getAttribute(t[o]),null!=r)break}else r=e.getAttribute(t);return r&&r.replace(/(^\s*)|(\s*$)/g,""),r}e.setAttribute(t,n)}function burl(e,t){var n=t.assets,r=t.cdncache,o=e[1],a=o.lastIndexOf("?");return o+=a>0?"&":"?",(n?n:"")+o+(r===und||r===!1?"timestep="+timestep+"&version="+e[2]:"")}function get(e,t){xhr("GET",e,!0,t)}function xhr(e,t,n,r){var o=new XMLHttpRequest;if(o.onload=function(){(o.status>=200&&o.status<300||304===o.status)&&r&&r(o.responseText)},o.withCredentials=!0,o.open(e||"GET",t,n),o.send(null),n===!1)return o.responseText}function ws(e,t){var n,r=att(e,"subject")||"defaultsubject";window.WebSocket?(n=new WebSocket(t),n.onmessage=function(e){},n.onopen=function(e){n.send(r)},n.onclose=function(e){console.dir("  close : "+e.data)}):alert("你的浏览器不支持Web Socket.")}function fragment(e){var t,n,r=global;if(e)for(n=create("div"),t=r.createDocumentFragment(),n.innerHTML=e;n.firstChild;)t.appendChild(n.firstChild);return t}function stripScripts(e){for(var t,n=new RegExp(ScriptFragment,"img"),r=0,o="",a="";null!=(t=n.exec(e));)o+=e.substring(r,t.index),a+=t[1]+"\n",r=t.index+t[0].length;return 0==r?o=e:r<e.length&&(o+=e.substring(r,e.length)),[o,a]}function evalScripts(e,t,n){function r(e){rov(a),n&&n()}var o,a=create("script",{type:"text/javascript",charset:"utf-8"});URL?(o=URL.createObjectURL(new Blob([t])),att(a,"src",o)):a.text=t,a[el]("load",r,!1),a[el]("error",r,!1),head.appendChild(a)}function render(e,t,n,r){var o=stripScripts(t);if(o[0]){var a=fragment(o[0]),i="replaceWith";include(a),e?(e.wasRequire=!0,n&&(e.innerHTML="",i="appendChild",!e.wasObserver&&(e.wasObserver=!0,observer(e,function(e){var t,n=[];e.forEach(function(e){t=e.target,contains(n,t)||(t.wasRequire=0,n.push(t))}),requireTag(n)}))),e[i](a)):global.body.appendChild(a)}o[1]?evalScripts(e,o[1],r):r&&r()}function tpl(e,t,n,r){var o,a=att(e,["bind","bind-remote","data-url","bind-call"]);if(a&&(o=xhr("post",a,!1))){var i=JSON.parse(o);0==i.ec&&(o=i.obj||i.list,o["original-data"]=i)}o&&(t=compile(t,o)),render(e,t,r[4],n)}function hashCode(e){for(var t,e=e.replace(/\//g,""),n=0,r=0;r<e.length;r++)t=e.charCodeAt(r),32!=t&&10!=t&&13!=t&&9!=t&&(n=31*n+t,(n>2147483647||n<-2147483648)&&(n&=4294967295));return"h"+n.toString(16)}function startsWith(e,t){return e.slice(0,t.length)===t}function contains(e,t){for(var n=0;n<e.length;n++)if(t==e[n])return!0;return!1}function compile(e,t){var n=new Function("obj","var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('"+e.replace(/[\r\t\n]/g," ").split("<#").join("\t").replace(/((^|#>)[^\t]*)'/g,"$1\r").replace(/\t=(.*?)#>/g,"',$1,'").split("\t").join("');").split("#>").join("p.push('").split("\r").join("\\'")+"');}return p.join('');");return n(t)}function observer(e,t){new Mutation(t).observe(e,{attributes:!0,attributeFilter:["bind","bind-remote","data-url","bind-call","depends","require","include","src","href"]})}function require(e,t){new depend(e,"function"==typeof t?{callback:t,model:gopt.model,assets:gopt.assets,version:gopt.version,cdncache:gopt.cdncache,notify:gopt.notify,success:gopt.success,progress:gopt.progress}:t)}function include(e,t){var n=0,r=function(e){n--,0==n&&t&&t()};[["require,[require]",head],["include,[include]",und]].forEach(function(t){var o=e.querySelectorAll(t[0]);o.length>0&&(n++,requireTag(o,t[1],function(){r(o)}))})}var el="addEventListener",de=document.documentElement,global=g.document,EOF=und,head=global.head||de,timestep=(new Date).getTime(),ScriptFragment='<script\\s*type="text/javascript"[^>]*>([\\S\\s]*?)</script\\s*>',Mutation=function(){return g.MutationObserver||g.WebKitMutationObserver||g.MozMutationObserver}(),gopt={model:att(de,"model")||"cache",assets:att(de,"assets")||"",version:att(de,"version")||0,cdncache:"true"==att(de,"cdncache"),notify:att(de,"notify"),success:att(de,"onsuccess"),progress:att(de,"onprogress")},dnative={create:function(e,t){this[t[3]](t[0],burl(t,e.opt),function(){!t[4]&&rov(t[0]),e.loader()},t)},js:function(e,t,n){var r=create("script",{type:"text/javascript",charset:"utf-8",src:t});n&&(r[el]("load",n,!1),r[el]("error",n,!1)),head.appendChild(r)},css:function(e,t,n){var r=create("link");r.href=t,r.rel="stylesheet",r.type="text/css",r[el]("load",n,!1),head.appendChild(r)},html:function(e,t,n,r){get(t,function(t){render(e,t,r[4],n)})},tpl:function(e,t,n,r){get(t,function(t){tpl(e,t,n,r)})}},cache={create:function(e,t){var n=this;n.cached(t[1],burl(t,e.opt),t[2],function(r){n[t[3]](t[0],r,function(){!t[4]&&rov(t.original),e.loader()},t)})},cached:function(e,t,n,r){var o=hashCode(e);Base.Storage.get(o,function(e){var a,i=!1;e&&startsWith(e,"${")&&(a=e.indexOf("}"),a>0&&n+""==e.substring(2,a)&&(i=!0)),i?r(e.substring(a+2)):get(t,function(e){Base.Storage.set(o,"${"+n+'}"'+e,function(){r(e)})})})},js:function(e,t,n){evalScripts(e,t,n)},css:function(e,t,n){var r=create("style",{type:"text/css"});r.appendChild(global.createTextNode(t)),head.appendChild(r),n&&n()},html:function(e,t,n,r){render(e,t,r[4],n)},tpl:tpl},requireTag=function(e,t,n){var r,o,a;if(e.length>0)for(var i=0,s=e.length;i<s;i++)r=e[i],o=att(r,["depends","require","include","src","href"]),!o&&(o=r.text||r.innerHTML),o&&!r.wasRequire&&(a={original:r,observer:r.hasAttribute("observer"),model:att(r,"model")||gopt.model,assets:att(r,"assets")||gopt.assets,version:att(r,"version")||gopt.version,cdncache:att(r,"cdncache")||gopt.cdncache,notify:att(r,"notify")||gopt.notify,success:att(r,"onsuccess")||gopt.success,progress:att(r,"onprogress")||gopt.progress,callback:n},o=toArray(o),o.length>0&&new depend(o,a))};requireTag(global.querySelectorAll("script[depends],script[require]"),head);var handler=function(){global.removeEventListener("DOMContentLoaded",handler,!1),include(global)};global[el]("DOMContentLoaded",handler,!1),g.Require=Base.Require={bindNotify:function(e,t){global[el](e,t,!1)},clean:function(){Base.Storage.support()&&Base.Storage.clear()},require:require,include:include}}(window);(function(f,g){for(var b=function(a){for(var c in a)b[c]=a[c]},d=/([^&=]+)=([^&]*)/g,e=location.search.substring(1),a;a=d.exec(e);)b[decodeURIComponent(a[1])]=decodeURIComponent(a[2]);Base.Options=b})(window);
</script>