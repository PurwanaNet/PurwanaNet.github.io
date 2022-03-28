var turf_script = document.createElement('script');
turf_script.id = 'turfscr';
//turf_script.type = 'module';
turf_script.src = "https://unpkg.com/@turf/turf@6.5.0/turf.min.js";
document.body.appendChild(turf_script);

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";SameSite=None; Secure;" + expires + ";path=/";
}
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
var getJSON = function(url, callback) {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
	
	//xhr.setRequestHeader('Access-Control-Allow-Origin', '*');

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
/*
var waitForElm = function(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}*/

function getGeoLocationCountry(){
	if(getCookie('geoloccountry')==''){
		return {"country":"N/A","code":"N/A"};
	}else{
		return JSON.parse(getCookie('geoloccountry'));
	}
}
//waitForElm('#turfscr').then((elm) => {console.log('Element is ready');});
var findGeoLocationCountry = function(){
	if(getCookie('geoloccountry')==''){
		//console.log("geoloccountry empty");
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
			//console.log("i'm tracking you!");
			  //x.innerHTML = "Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude;
			  var pt = turf.point([position.coords.longitude,position.coords.latitude]);
				getJSON('https://assets.purwana.net/countries.json',  function(err, data) {

					if (err != null) {
						console.error(err);
						onFindGeoLocationCountryDone();
					} else {
						var countrycodes =  null;
						getJSON('https://assets.purwana.net/countrycodes.json',  function(err2, data2) {
							if (err2 != null) {
								console.error(err2);
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
										console.log('country found!',data.features[k].properties.ADMIN);
										setCookie('geoloccountry', '{"country":"'+data.features[k].properties.ADMIN+'"'+((countrycodes!=null)?',"code":"'+countrycodes[data.features[k].properties.ADMIN]+'"':'')+'}', 2);
										onFindGeoLocationCountryDone();
										break;
									}
								}else if(data.features[k].geometry.type=='MultiPolygon'){
									//console.log('multipolygon');
									var multipolygon = turf.multiPolygon(data.features[k].geometry.coordinates);
									//console.log('multipolygon:',multipolygon);
									if(turf.booleanPointInPolygon(pt, multipolygon)){
										console.log('country found!',data.features[k].properties.ADMIN);
										setCookie('geoloccountry', '{"country":"'+data.features[k].properties.ADMIN+'"'+((countrycodes!=null)?',"code":"'+countrycodes[data.features[k].properties.ADMIN]+'"':'')+'}', 2);
										onFindGeoLocationCountryDone();
										break;
									}
								}

							}							
						});
					}
				});	  
			},
			function(error) {
			if (error.code == error.PERMISSION_DENIED)
			  console.log("you denied me :-(");
			  onFindGeoLocationCountryDone();
			});
		}else{
			console.log('geolocation not available');
			onFindGeoLocationCountryDone();
		}
	}else{
		console.log("you hve already request for geo loc. use getGeoLocationCountry()");
		onFindGeoLocationCountryDone();
	}
	
}
function resetGeoLocationCountry(){
	setCookie('geoloccountry', '', 1);
	findGeoLocationCountry();
}
//findGeoLocationCountry();