(function(g, und) {
	document.addEventListener("LaunchReady", function(e) {
		console.log("LaunchReady : " + c);
	}, false);


	Base.ready(function() {
		console.log('Base.WasReady.ready' + '    ' + c);
	})
})(window);
