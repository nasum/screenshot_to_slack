var WebClient = require('@slack/client').WebClient;
var fs = require('fs');
var request = require('request');
var token = ""

var web = new WebClient(token);

function screenShot(){
  let desktopCapturer = require('electron').desktopCapturer
  desktopCapturer.getSources({types: ['window', 'screen']}, (error, sources) => {
    if (error) throw error
    for (let i = 0; i < sources.length; ++i) {
      console.log(sources[i].name)
      if (sources[i].name === 'Entire screen') {
        navigator.webkitGetUserMedia({
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: sources[i].id,
              minWidth: 1280,
              maxWidth: 1280,
              minHeight: 720,
              maxHeight: 720
            }
          }
        }, handleStream, handleError)
        return
      }
    }
  })

  function handleStream (stream) {
    document.querySelector('video').src = URL.createObjectURL(stream)
  }

  function handleError (e) {
    console.log(e)
  }
  // let remote = require('electron').remote
  // remote.getCurrentWindow().capturePage(function handleCapture (img) {
  //   remote.require('fs').writeFile("screen_shot.png", img.toPng(), function(){
  //     postSlack('./screen_shot.png')
  //   })
  // })
}

function postSlack(filePath){
  console.log(filePath)
  var contentOpts = {
    file: fs.createReadStream(filePath),
    channels: 'general',
    mimetype: 'image/png',
    filetype: 'auto'
  };
  web.files.upload("screen_shot", contentOpts, function handleContentFileUpload(err, res) {
    console.log(res);
  })
}
