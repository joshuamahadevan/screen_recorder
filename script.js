//getting the DOM elements
const start_btn=document.getElementById("start")
const stop_btn=document.getElementById("stop")
const video=document.getElementById("video")

init()

var isRecording=false;
function init(){
    stop_btn.style.display="none";
    start_btn.addEventListener("click", start_rec)
    stop_btn.addEventListener("click", stop_rec)
}

//options for the displayMedia and mediaRecorder objects
const dmOptions={video: {cursor: "always"},audio: false}
const mrOptions={mimeType: "video/webm; codecs=vp9" }

async function start_rec(){
    //get display media stream from user using .getDisplayMedia() function
    isRecording=true;
    try{ var screen_stream=await navigator.mediaDevices.getDisplayMedia (dmOptions)}
    catch(err){console.error(err); isRecording=false}

    if(isRecording){
        let a=document.querySelector("a")
        if(a){
            a.style.display="none"
        }
        //initialising mediaRecorder object to record display media stream
        var mediaRecorder=new MediaRecorder(screen_stream,mrOptions)
        
        //streaing the video to the HTML video element
        video.srcObject=screen_stream;
        video.controls=false

        //ondataavailable is fired when the recording is complete
        mediaRecorder.ondataavailable=handleDataAvailable;

        //starting recording
        mediaRecorder.start();

        //changing the start button to stop button
        start_btn.style.display="none";
        stop_btn.style.display=""
    }
}

//holds the recorded chunks
var recordedChunks=[]

function handleDataAvailable(event){
    if(isRecording){
        stop_rec()  
    }
    console.log("saving chunk")
    if (event.data.size > 0) {

      recordedChunks[0]=event.data;
      console.log(recordedChunks);
      download();
    } else {
      // ...
    }
}

function download() {
    var blob = new Blob(recordedChunks, {
      type: "video/webm"
    });
    var url = URL.createObjectURL(blob);
    let a=document.querySelector("a")
    if(!a){
        a = document.createElement("a");
        document.body.insertBefore(a,stop_btn)
    }
    a.href = url;
    a.download = `test_${Math.floor(100*Math.random())}.mp4`;
    a.innerHTML="download";
    a.style.display=""
    video.src=url
  }

function stop_rec(){
    let tracks = video.srcObject.getTracks();
    tracks.forEach(track => track.stop());
    video.srcObject = null;

    isRecording=false;

    video.controls=true;

    stop_btn.style.display="none";
    start_btn.style.display=""
}