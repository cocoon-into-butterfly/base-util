/* minifyOnSave, filenamePattern: ../dist/$1.$2 */
(function(g, und) {

	var o = function(obj) {
		for (var k in obj) {
			o[k] = obj[k];
		}
	};

	var reg = /([^&=]+)=([^&]*)/g,
		pars = location.search.substring(1),
		m;
	while (m = reg.exec(pars)) {
		o[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
	}
	Base.Options = o
})(window);
