// @name         avgle HLS playlist downloader
// @version      0.0.1
// @description  decrypts and downloads avgle HLS playlist in browser
// @author       avotoko

(function(){
	"use strict";
	function addObjectMethodMonitor(obj, name, monitor)
	{
		if (obj && typeof obj[name] === "function" && typeof monitor === "function"){
			let original = "ahpd_original_" + name, monitors = "ahpd_"+name+"_monitors", id = Date.now();
			if (! obj[original]){
				obj[original] = obj[name];
				obj[name] = function(){
					Object.keys(obj[monitors]).forEach(k=>obj[monitors][k].apply(this, arguments));
					return obj[original].apply(this, arguments);
				};
				obj[monitors] = {};
			}
			obj[monitors][id] = monitor;
			return {
				obj: obj,
				original: original,
				monitors: monitors,
				id: id,
				remove: function(){
					delete obj[monitors][id];
					if (Object.keys(obj[monitors]).length === 0){
						obj[name] = obj[original];
						delete obj[original];
						delete obj[monitors];
					}
				}
			};
		}
	}
	
	function decryptPlaylist(playlist, options)
	{
		let a = playlist.split('\n');
		for (let i = 0 ; i < a.length ; i++){
			if (a[i].length === 0)
				continue;
			if (a[i].charAt(0) === "#"){
				let tag = a[i];
				if (/^#EXT-X-ENDLIST/.test(tag))
					break;
				continue;
			}
			let uri = a[i];
			if (! /^https:\/\//.test(uri)){
				console.log("decriptURI:",uri);
				options.uri = uri;
				options.decryptURI();
				if (! options.uri)
					throw Error("can't decrypt uri");
				console.log(" -->", options.uri);
				a[i] = options.uri;
			}
		}
		return a.join('\n');
	}
	
	function downloadPlaylist(playlist, filename)
	{
		let d = document,
			a = d.createElement("a");
		a.href = URL.createObjectURL(new Blob([playlist],{type:"application/x-mpegURL"}));
		a.setAttribute("download",filename);
		a.click();
	}

	function main()
	{
		let h = addObjectMethodMonitor(Object, "defineProperty", function(obj, prop, descriptor){
			if (prop === "responseText"){
				console.log("got defineProperty(",prop,") call");
				if (! (descriptor && descriptor.value))
					throw new Error("responseText has no value");
				let responseText = descriptor.value;
				console.log("responseText:\n"+responseText);
				if (! responseText.includes('#EXTM3U'))
					throw new Error("responseText must include '#EXTM3U'");
				let options = videojs.Hls.xhr.beforeRequest({uri:"!dummy"});
				if (typeof options.decryptURI !== "function")
					throw new Error("can't retrieve decryptURI function");
				console.log("decryptURI:",options.decryptURI.toString());
				let playlist = decryptPlaylist(responseText, options);
				console.log("decrypted playlist:\n"+ playlist);
				console.log("start download playlist");
				downloadPlaylist(playlist, "avgle.m3u8"); // "avgle"+video_id+".m3u8"
			}
		});
		console.log("hooked Object.defineProperty.\nwaiting defineProperty(obj,'responseText',desc) call");
	}
	console.clear = function(){};
	try {
		main();
	}
	catch(e){
		console.log("error:",e.message);
	}
})();

