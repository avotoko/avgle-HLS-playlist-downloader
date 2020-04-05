# avgle HLS playlist downloader
decrypts and downloads avgle HLS playlist in browser.
### Usage ###
1. Open the video page in browser.
2. Run avgle-hls-playlist-downloader.js
3. Close ad overwrapping the video.
4. download starts automatically or download dialog opens when the playlist is successfully retrieved and decrypted.
5. You can play the video with streamlink.  
streamlink --http-header Referer=https://avgle.com/ file://location/avgle.m3u8 best

Outputs errors and other information to the console of the browser's developer tools.  
Tested on firefox+ublock origin and chrome + adblock plus.  

