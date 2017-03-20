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
