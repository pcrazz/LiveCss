function LiveCss(cssPath, interval) {
	
	var Live = this;
	
	Live.cssPath = [];
	Live.interval = 1000; //1 second	
	Live.cssElements = [];
	Live.objInterval = null;
	Live.nonCacheSeed = 0;
		
	//Constructor
	Live.init = function (cssPath, interval) {
		if (typeof cssPath !== 'Array') {
			cssPath = [cssPath];
		}
		
		Live.cssPath = cssPath;
		
		//second param is optional, it may be undefined
		if (typeof interval !== 'undefined') {
			Live.interval = interval;
		}
		Live.createElements();
		Live.objInterval = setInterval(Live.reload, Live.interval);
		
	}
	
	Live.createElements = function () {
		if (!Live.cssPath.length) {
			return;
		}
		
		var head = document.getElementsByTagName('head')[0];
		var c = 0;
		for (i = 0; i < Live.cssPath.length; i++) {
			if (Live.checkFileExists(Live.cssPath[i])) {
				var noCacheParam = '?live_css=' +  Live.nonCacheSeed;
				
				if (Live.cssPath[i].indexOf('?') > -1) {
					var noCacheParam = '&live_css=' +  Live.nonCacheSeed;
				}
				
				Live.cssElements[c] = document.createElement('link');
				Live.cssElements[c].rel = "stylesheet";
				Live.cssElements[c].type = "text/css";
				Live.cssElements[c].href = Live.cssPath[i] + noCacheParam;
				Live.cssElements[c].id = "live_css_" + i;
				head.appendChild(Live.cssElements[c].cloneNode(false));
				c++; 
			}
		}
	}
	
	Live.checkFileExists = function (path) {
		try {
			var http = new XMLHttpRequest();
		    http.open('HEAD', path, false);
		    http.send();
		    return http.status!=404;
		} catch (err) {
			//If cross origin requests error
			if (err.code == 101) {
				// we can't say if file exists or note when error 101 occurs
				// then assume it exists
				return true;
			}
		}
	}
	
	
	Live.reload = function () {
		if (!Live.cssElements.length) {
			Live.destroy();
			return;
		}
		
		var head = document.getElementsByTagName('head')[0];
		
		//Update cache seed
		Live.nonCacheSeed++;
		
		for (i = 0; i < Live.cssElements.length; i++) {
			var el = document.getElementById("live_css_" + i);
			el.id = "old_live_css_" + i
			
			//Avoid cache adding a random param to the end
			Live.cssElements[i].href = Live.cssElements[i].href.replace(/\&live_css=[^&]+/i, '&live_css='+ Live.nonCacheSeed).replace(/\?live_css=[^&]+/i, '?live_css='+ Live.nonCacheSeed);
			
			//Append new CSS
			head.appendChild(Live.cssElements[i].cloneNode(false));
			
			//Remove old CSS
			
			//Set a delay to avoid page flick
			setTimeout(function () {el.parentNode.removeChild(el)}, Math.floor(Live.interval/2));
		}
	}
	
	//Destructor
	Live.destroy = function () {
		if (Live.objInterval !== null) {
			clearInterval(Live.objInterval)
		}
	}
	
	//Construct
	Live.init(cssPath, interval);
	
}
