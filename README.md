# avgle HLS playlist downloader
Decrypt and download HLS playlist(m3u8) of avgle.com video in browser.
* Tested on firefox+ublock origin. 
### Usage ###
1. Open the video page in browser.
2. Run avgle-hls-playlist-downloader.js (as bookmarklet)
3. Click close button overlapping the video.
4.  [Download HLS Playlist] button will appear when the playlist is successfully retrieved and decrypted.
5. You can play the video using Streamlink etc.  
streamlink --http-header Referer=https://avgle.com/ file://location/avgle.m3u8 best

* Outputs errors and other information to the console of the browser's developer tools.  


