# avgle HLS playlist downloader
Decrypt and download HLS playlist(m3u8) of avgle.com video in browser.
* Bookmarklet and usage is posted on my blog. https://avotoko.blogspot.com/2020/04/avgle-hls-playlist-downloader.html
* Tested on firefox + ublock origin. 
### Usage ###
1. Open the video page in browser.
2. Run avgle-hls-playlist-downloader.js (as bookmarklet)
3. Click close button overlapping the video.
4. [Download HLS Playlist] button will appear when the playlist is successfully retrieved and decrypted.
5. Click the button and download avgle.m3u8.
5. You can play the video using Streamlink.  
`streamlink --http-header Referer=https://avgle.com/ file://<location>/avgle.m3u8 best`  
Or you can download the video.  
`streamlink --http-header Referer=https://avgle.com/ file://<location>/avgle.m3u8 best -o video.ts`  
**You must specify the url instead of the local path of m3u8 file.**  
How to convert local path to url: https://en.wikipedia.org/wiki/File_URI_scheme  
[Exsample for Windows]  
downloaded file path: c:\temp\avgle.m3u8  
url: file:///c:/temp/avgle.m3u8  
command line:  
`streamlink --http-header referer=https://avgle.com/ file:///c:/temp/avgle.m3u8 best`  

* Outputs errors and other information to the console of the browser's developer tools.  


