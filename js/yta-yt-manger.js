window.setTimeout(func,1500)
function func(){
	if (window.location.pathname == '/my_videos') {
		// create li container for videolist
		var myvideoidslicya = document.createElement('li');
		myvideoidslicya.setAttribute('id', 'myvideoidslicya');
		myvideoidslicya.setAttribute('class', 'vm-video-item');
		$('#vm-playlist-video-list-ol').append(myvideoidslicya);
	
		//create div container for videolist
		var myvideoidsboxcya = document.createElement('div');
		myvideoidsboxcya.setAttribute('id', 'myvideoidsboxcya');
		myvideoidsboxcya.setAttribute('class', 'vm-video-item-content');
		$("#myvideoidslicya").html(myvideoidsboxcya);
	
		// List of my videos
		var myvideoidstextarea = document.createElement('textarea');
		myvideoidstextarea.setAttribute('id', 'myvideoidscya');
		myvideoidstextarea.setAttribute('class', 'yt-uix-form-input-text video-revshare-web-description textbox');
		myvideoidstextarea.setAttribute('style', 'width: 100%; min-height: 245px; font-family: monospace; padding: 5px 10px; resize: vertical; border: 0px; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box;');
		myvideoidstextarea.spellcheck = false;
		myvideoidstextarea.value = '';
		$("#myvideoidsboxcya").html(myvideoidstextarea);
		
		// Get ids
		var videos = document.getElementsByClassName('vm-video-item');
		for (var i=0; i < videos.length; i++) {
			var video_id = videos[i].id.substring('vm-video-'.length);
			var title = videos[i].getElementsByClassName('vm-video-title-content')[0].textContent;
			myvideoidstextarea.value += video_id+' #'+title+'\n';
		}
	}
}	