(function() {

	'use strict';

	var _cachedHeight = 0;

	if (inIframe()) {
		if (!(new RegExp('MSIE [7]')).exec(navigator.userAgent)) {
			document.documentElement.style.overflow = 'hidden';
			document.documentElement.setAttribute('data-iframed', true);
			getTopPathname();
			setTimeout(function() {
				setInterval(poll, 250);
			}, 1000);
		}
	}

	function poll () {
		var _dimension = getDimension('height');

		if (_dimension !== _cachedHeight) {
			_cachedHeight = _dimension;
			broadcastMutation('height', _dimension);
			// console.log('_dimension'+ _dimension);
		}
	}

	function getDimension (type) {
		var body = document.body
		,	dimension = type.charAt(0).toUpperCase() + type.slice(1)
		,	value = Math.min(
				body['scroll'+ dimension],
				body['offset'+ dimension],
				body['client'+ dimension]
			);
		return value;
	}

	function broadcastMutation (type, value) {
		if ('postMessage' in window) {
			window.parent.postMessage(type +'|'+ value, '*');
		}
	}

	function getTopPathname () {

		var setTopPathname = function(pathname) {
			document.documentElement.setAttribute('data-top-pathname', pathname);
		};

		if ('postMessage' in window) {
			window.parent.postMessage('getTopPathname', '*');

			if (window.addEventListener) {
				window.addEventListener('message', function(e) {
					setTopPathname(e.data);
				}, false);
			} else if (window.attachEvent) {
				window.attachEvent('onmessage', function(e) {
					setTopPathname(e.data);
				});
			}
		}
	}

	function inIframe () {
		try {
			return window.self !== window.top;
		} catch (e) {
			return true;
		}
	}

}());