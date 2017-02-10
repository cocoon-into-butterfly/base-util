(function(g, und) {

	function parms(opt) {
		var QPARM_REG = /([^&=]+)=([^&]*)/g,
			pars = location.search.substr(1),
			m;
		while (m = QPARM_REG.exec(pars)) {
			opt[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
		}
		opt.security = 'https:' == document.location.protocol;
		return opt;
	}
	Base.Options = function(obj) {
		if (obj) {
			for (var k in obj) {
				Base.Options[k] = obj[k];
			}
		}
	};

	var g = document.documentElement,
		t;

	Base.Options.version = g.getAttribute('version') || '1.0.0';
	t = g.getAttribute('cache') || g.getAttribute('encache');
	if (!t) t = true;
	else {
		t = t.toLowerCase() == 'false' ? false : true;
	}
	Base.Options.cache = t;


	//export
	parms(Base.Options);
})((! function() {
	{
		if (typeof(Base) === 'undefined') B = Base = {}
	};
}(), window));
