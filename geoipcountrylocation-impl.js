importScripts("https://unpkg.com/@turf/turf@6.5.0/turf.min.js");

var getJSON = function(url, callback) {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
	

    xhr.onload = function() {

        var status = xhr.status;

        if (status == 200) {
            callback(null, xhr.response);
        } else {
            callback(status);
        }
    };

    xhr.send();
};



//waitForElm('#turfscr').then((elm) => {console.log('Element is ready');});
var findGeoLocationCountry = function(coords){
	var pt = turf.point(coords);
	getJSON('https://assets.purwana.net/countries.json',  function(err, data) {

		if (err != null) {
			self.console.error(err);
			self.postMessage(['','geolocationdone']);
		} else {
			var countrycodes =  null;
			getJSON('https://assets.purwana.net/countrycodes.json',  function(err2, data2) {
				if (err2 != null) {
					self.console.error(err2);
				}else{
					countrycodes = data2;
				}
				for(var k in data.features) {
					//console.log(data.features[k].properties.ADMIN);
					if(data.features[k].geometry.type=='Polygon'){
						//console.log('polygon');
						var polygon = turf.polygon(data.features[k].geometry.coordinates);
						//console.log('polygon:',polygon);
						if(turf.booleanPointInPolygon(pt, polygon)){
							self.console.log('country found!',data.features[k].properties.ADMIN);
							//setCookie('geoloccountry', '{"country":"'+data.features[k].properties.ADMIN+'"'+((countrycodes!=null)?',"code":"'+countrycodes[data.features[k].properties.ADMIN]+'"':'')+'}', 2);
							self.postMessage(['{"country":"'+data.features[k].properties.ADMIN+'"'+((countrycodes!=null)?',"code":"'+countrycodes[data.features[k].properties.ADMIN]+'"':'')+'}','geolocationdone']);
							break;
						}
					}else if(data.features[k].geometry.type=='MultiPolygon'){
						//console.log('multipolygon');
						var multipolygon = turf.multiPolygon(data.features[k].geometry.coordinates);
						//console.log('multipolygon:',multipolygon);
						if(turf.booleanPointInPolygon(pt, multipolygon)){
							self.console.log('country found!',data.features[k].properties.ADMIN);
							//setCookie('geoloccountry', '{"country":"'+data.features[k].properties.ADMIN+'"'+((countrycodes!=null)?',"code":"'+countrycodes[data.features[k].properties.ADMIN]+'"':'')+'}', 2);
							self.postMessage(['{"country":"'+data.features[k].properties.ADMIN+'"'+((countrycodes!=null)?',"code":"'+countrycodes[data.features[k].properties.ADMIN]+'"':'')+'}','geolocationdone']);
							break;
						}
					}

				}							
			});
		}
	});	  
}

self.addEventListener('message', function (e) {
//self.curcounter=self.curcounter+ 1;
  self.console.log('Worker: Message received from main script');
  var functionName = e.data[1];
  var point = e.data[0];
  switch (functionName) {
    case 'findGeoLocationCountry':
      findGeoLocationCountry(point);
      break;
  }
});
//findGeoLocationCountry();