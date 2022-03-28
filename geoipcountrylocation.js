if (window.Worker) {
	var script_tag = document.createElement('script');
	script_tag.type = 'worker';
	script_tag.id = 'workersource';
	script_tag.text = 'importScripts("https://purwananet.github.io/geoipcountrylocation-impl.js");';
	document.body.appendChild(script_tag);
	function getURL() {
	  const txt = document.getElementById( 'workersource' ).textContent;
	  return URL.createObjectURL( new Blob( [ txt ] ) );
	}
	var worker = new Worker( getURL() );
	worker.onmessage = function(e) {
		//result.textContent = e.data;
		console.log('Message received from worker');
		if(e.data[1]=='geolocationdone'){
			if(e.data[0]!=''){
				setCookie('geoloccountry', e.data[0], 2);
			}
			onFindGeoLocationCountryDone();
		}
	}
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
	function getGeoLocationCountry(){
		if(getCookie('geoloccountry')==''){
			return {"country":"N/A","code":"N/A"};
		}else{
			return JSON.parse(getCookie('geoloccountry'));
		}
	}
	function resetGeoLocationCountry(){
		setCookie('geoloccountry', '', 1);
		findGeoLocationCountry();
	}
	function findGeoLocationCountry(){
		if(getCookie('geoloccountry')==''){
			console.log("geoloccountry empty");
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
				//console.log("i'm tracking you!");
				  //x.innerHTML = "Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude;
				  
				  worker.postMessage([[position.coords.longitude,position.coords.latitude],"findGeoLocationCountry"]);
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

}else{
	var countryloc_script = document.createElement('script');
	countryloc_script.id = 'geoiplocscr';
	countryloc_script.src = "https://purwananet.github.io/geoipcountrylocation-impl-noworker.js";
	document.body.appendChild(countryloc_script);
}
