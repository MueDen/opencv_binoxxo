let video = document.getElementById('video');
const height = 560
const width = 720
let streaming = false;
const startVideo = () => {
    navigator.getUserMedia(
        {video : true, audio: false},
        stream => video.srcObject = stream,
        err => console.log(err)
    )
}

let canvasFrame = document.getElementById("canvasFrame"); // canvasFrame is the id of <canvas>
let context = canvasFrame.getContext("2d");
const FPS = 30;
function processVideo() {
    let dst = new cv.Mat.zeros(height, width, cv.CV_8UC3);
    let src = new cv.Mat(height, width, cv.CV_8UC4);
    if(!streaming){
        return;
    }
    let begin = Date.now();
    // draw video to the input slot on the page
    context.drawImage(video, 0, 0, width, height);
    // take the video data from input and save it to the src matrix
    // console.log(context.getImageData(0, 0, width, height).data)
    src.data.set(context.getImageData(0, 0, width, height).data);
    
    preProcessing({source: src, destination: dst})
    // show the generated images from video in short succession for output video
    cv.imshow("canvasFrame", dst);
    let delay = 10000/FPS - (Date.now() - begin);
    // recursively call process Video
    src.delete();
    dst.delete();
    setTimeout(processVideo, delay);


}
// schedule first one.
const startStream = () => {
    streaming = true;
    document.getElementById('video').style.display = 'flex';
    document.getElementById('canvasFrame').style.display = 'flex';
    setTimeout(processVideo, 0);
    startVideo();
}

const stopStream = () => {
    streaming = false;
    video.srcObject = null;
    document.getElementById('video').style.display = 'none';
    document.getElementById('canvasFrame').style.display = 'none';

    return
}



