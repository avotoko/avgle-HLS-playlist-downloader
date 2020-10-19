# avgleHPD - avgle HLS playlist downloader
Decrypt and download HLS playlist(m3u8) of avgle.com video in browser.  
  
**\[Oct. 19 2020]**  
uBlock Origin default filter is blocking the third party script on avgle.com.  
Add the following filters to My Filters to allow access to the script.  
`@@||avotoko.github.io/avgle-HLS-playlist-downloader/avgle-hls-playlist-downloader.js$script,domain=avgle.com`  
* Bookmarklet and usage is posted on my blog. https://avotoko.blogspot.com/2020/04/avgle-hls-playlist-downloader.html
* Tested on firefox + ublock origin. 
### Usage ###
1. Open the video page in browser.
2. Run avgle-hls-playlist-downloader.js (as bookmarklet.)  
ref. [Run avgleHPD using Greasemonkey.](https://github.com/avotoko/avgle-HLS-playlist-downloader/issues/2)
3. Click close button overlapping the video.
4. [Download HLS Playlist] button will appear when the playlist is successfully retrieved and decrypted.
5. Click the button and download avgle.m3u8.
5. You can play the video using Streamlink.  
`streamlink --http-header Referer=https://avgle.com/ file://<location>/avgle.m3u8 best`  
Or you can download the video.  
`streamlink --http-header Referer=https://avgle.com/ file://<location>/avgle.m3u8 best -o video.ts`  
    * **The url described in the playlist(m3u8 file) retrieved by AvgleHPD becomes inaccessible after a while.**  
  Try to run Streamlink as soon as possible after retrieving the playlist.  
    * **You must specify the url instead of the local path of m3u8 file.**  
  How to convert local path to url: https://en.wikipedia.org/wiki/File_URI_scheme  
  [Example for Windows]  
  &emsp;downloaded file path: c:\temp\avgle.m3u8  
  &emsp;url: file:///c:/temp/avgle.m3u8  
  &emsp;command line:  
  &emsp;`streamlink --http-header referer=https://avgle.com/ file:///c:/temp/avgle.m3u8 best`  
  [Convert local path to url using firefox on Windows]  
      1. Open a new tab in firefox.
      2. Drag and drop the m3u8 file to the new tab.
      3. Text contents is displayed in the tab and file url is displayed in the address bar.
      4. Focus the address bar and copy the url.
      5. Paste the url where required.

* Outputs errors and other information to the console of the browser's developer tools.  


