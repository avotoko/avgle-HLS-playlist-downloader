// @name         avgle HLS playlist downloader
// @version      0.1.0
// @description  decrypts and downloads avgle HLS playlist in browser
// @author       avotoko
/*
*/

(function(){
	"use strict";
	let d = document, ver = "v.0.1.0";
	
	function info(msg)
	{
		let e = d.querySelector('div.ahpd-info');
		e && (e.textContent = msg);
	}
	
	function log()
	{
		console.log.apply(console,["[avgleHPD]"].concat(Array.from(arguments)));
	}
	
	function appendStylesheet(rules, id)
	{
		let e = d.createElement("style");
		if (id)
			e.id = id;
		e.type = "text/css";
		e.innerHTML = rules;
		d.getElementsByTagName("head")[0].appendChild(e);
	}
	
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
			if (/^\s*$/.test(a[i]))
				continue;
			if (a[i].charAt(0) === "#"){
				let tag = a[i];
				if (/^#EXT-X-ENDLIST/.test(tag))
					break;
				continue;
			}
			let uri = a[i];
			if (! /^https:\/\//.test(uri)){
				options.uri = uri;
				options.decryptURI();
				if (! options.uri){
					log("can't decript uri:",uri);
					throw Error("can't decrypt uri");
				}
				a[i] = options.uri;
			}
		}
		return a.join('\n');
	}
	
	function downloadPlaylist(playlist, filename)
	{
		let a = d.querySelector('.ahpd-download');
		a.href = URL.createObjectURL(new Blob([playlist],{type:"application/x-mpegURL"}));
		a.setAttribute("download",filename);
		a.classList.remove("ahpd-hide");
	}

	function main()
	{
		if (! videojs)
			throw new Error("videojs not defined");
		let handle = addObjectMethodMonitor(Object, "defineProperty", function(obj, prop, descriptor){
			if (prop === "responseText"){
				handle.remove();
				log("got defineProperty(",prop,") call");
				if (! (descriptor && descriptor.value))
					throw new Error("responseText has no value");
				let responseText = descriptor.value;
				log("responseText:\n"+responseText);
				if (! responseText.includes('#EXTM3U'))
					throw new Error("responseText must include '#EXTM3U'");
				let options = videojs.Hls.xhr.beforeRequest({uri:"!dummy"});
				if (typeof options.decryptURI !== "function")
					throw new Error("can't retrieve decryptURI function");
				log("decryptURI:\n",options.decryptURI.toString());
				log("decrypting uri in playlist");
				info("decrypting uri in playlist");
				let playlist = decryptPlaylist(responseText, options);
				log("decrypted playlist:\n"+ playlist);
				info("decrypted playlist successfully");
				downloadPlaylist(playlist, "avgle.m3u8"); // "avgle-"+video_id+".m3u8"
			}
		});
		log("hooked Object.defineProperty.\n  waiting defineProperty(obj,'responseText',desc) call");
		info("Please click close button.");
		d.querySelector("#player_3x2_container").addEventListener("click",()=>{
			info("waiting defineProperty(obj,'responseText',desc) call");
		});
	}
	try {
		if (d.querySelector(".ahpd-area")){
			alert("avgleHPD already executed");
			return;
		}
		log("avgle HLS playlist downloader "+ver);
		console.clear = function(){};
		{
			let s, e, sel = "div.container > div.row";
			if (! (e = d.querySelector(sel))){
				log("element '"+sel+"' not found");
				alert("avgleHPD error: "+"element '"+sel+"' not found");
				return;
			}
			appendStylesheet(".ahpd-area{display:flex; font-size:large; }.ahpd-ver{margin-right:5px; background-color:gold; font-weight:bold; text-align:center; vertical-align:middle; border:1px solid transparent; padding:8px 12px; width:min-content; white-space:nowrap; border-radius:4px; }.ahpd-info{margin-right:5px; background-color:beige; text-align:center; border:1px solid transparent; padding:8px 12px; width:min-content; white-space:nowrap; font-size:large; border-radius:4px; }.ahpd-download{font-weight:bold; padding:8px 12px; }.ahpd-download:hover{border:1px outset transparent; } .ahpd-hide{display:none;}");
			let area = e.insertBefore(d.createElement("div"), e.firstElementChild);
			area.className = "ahpd-area";
			e = area.appendChild(d.createElement("div"));
			e.className = "ahpd-ver";
			e.textContent = "avgleHPD " + ver;
			e = area.appendChild(d.createElement("div"));
			e.className = "ahpd-info";
			e.textContent = "avgleHPD information here";
			e = area.appendChild(d.createElement("a"));
			e.className = "btn-primary ahpd-download ahpd-hide";
			e.textContent = "Download HLS Playlist";
		}
		main();
	}
	catch(e){
		log("error:",e.message);
		info("error: "+e.message);
	}
})();
