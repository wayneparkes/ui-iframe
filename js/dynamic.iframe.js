(function() {

	'use strict';


	var isIE7 = (new RegExp('MSIE [7]')).exec(navigator.userAgent)
	,	scripts = document.getElementsByTagName('script')
	,	thisScriptTag = scripts[scripts.length - 1]
	,	url = getUrl();


	function getUrl () {
		
		var qs = function(key) {
			return decodeURI(window.location.search.replace(new RegExp('^(?:.*[&\\?]' + encodeURI(key).replace(/[\.\+\*]/g, '\\$&') + '(?:\\=([^&]*))?)?.*$', 'i'), '$1'));
		};

		return (qs('url')) ? qs('url') : thisScriptTag.getAttribute('data-url');
	}


	// Check for dynamically loaded script
	if (!url) {
		var scriptFileName = 'dynamic.iframe.js';

		for (var i = 0, l = scripts.length; i < l; i++) {
			if ((scripts[i].src && scripts[i].src.indexOf(scriptFileName) !== -1) && !(!!scripts[i].getAttribute('data-handled'))) {
				scripts[i].setAttribute('data-handled', 'true');
				thisScriptTag = scripts[i];
				url = getUrl();
			}
		}
	}


	function Iframe () {

		this.iframe = document.createElement('iframe');
		this.iframe.setAttribute('src', url);
		this.iframe.setAttribute('frameborder', 0);

		if (isIE7) this.iframe.setAttribute('frameBorder', 0);


		this.iframeWrapper = document.createElement('div');
		this.iframeWrapper.className = 'iframe-wrapper';


		this.iframeWrapper.appendChild(this.iframe);


		if (thisScriptTag.parentNode) {
			thisScriptTag.parentNode.insertBefore(this.iframeWrapper, thisScriptTag);

			this.iframe.controller = this;

			if (isIE7) {
				this.iframe.style.overflow = 'auto';
				this.iframe.style.position = 'static';
			} else {
				this.setupMessaging();
			}
		} else {
			throw new ReferenceError('Unable to find a target element to append the iframe to');
		}
	}


	Iframe.prototype = {
		_events : {
			height : function(value) {
				this.iframeWrapper.style.height = value +'px';
			}
		,	width : function(value) {
				this.iframeWrapper.style.width = value +'px';
			}
		,	getTopPathname : function() {
				var wl = window.top.location;
				this.iframe.contentWindow.postMessage(wl.protocol +'//'+ wl.hostname + wl.pathname, '*');
			}
		}
	,	setupMessaging : function() {

			var _this = this;

			if ('postMessage' in window) {
				if (window.addEventListener) {
					window.addEventListener('message', function(e) {
						_this.handleMessage.call(_this, e);
					}, false);
				} else if (window.attachEvent) {
					window.attachEvent('onmessage', function(e) {
						_this.handleMessage.call(_this, e);
					});
				}
			}
		}
	,	handleMessage : function(e) {

			var data = e.data.split('|');

			if (this.iframe.contentWindow === e.source) {
				if (typeof this._events[data[0]] !== 'undefined') {
					this._events[data[0]].call(this, data[1]);
				}
			}
		}
	};


	(function() {
		var styleSheets = document.getElementsByTagName('style')
		,	styleCreated = false
		,	createStyleSheet = function() {

			var css = '.iframe-wrapper { height: 100px; clear:both; position: relative; width: 100%; -webkit-transition: all 0.125s ease-in-out; -moz-transition: all 0.125s ease-in-out; -ms-transition: all 0.125s ease-in-out; -o-transition: all 0.125s ease-in-out; transition: all 0.125s ease-in-out; }.iframe-wrapper iframe { height: 100%; left: 0; overflow: hidden; position: absolute; top: 0; width: 100%; }'
			,	head = document.head || document.getElementsByTagName('head')[0]
			,	style = document.createElement('style');

			style.setAttribute('type', 'text/css');
			style.setAttribute('title', 'dynamic.iframe');

			if (style.styleSheet) {
				style.styleSheet.cssText = css;
			} else if ('createTextNode' in document) {
				style.appendChild(document.createTextNode(css));
			}

			head.appendChild(style);
		};

		for (var i = 0, len = styleSheets.length; i < len; i++) {
			if (styleSheets[i].getAttribute('title') === 'dynamic.iframe') {
				styleCreated = true;
				break;
			}
		}

		if (!styleCreated) {
			createStyleSheet();
		}
	})();


	if (url) {
		new Iframe();
	}
})();