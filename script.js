const video = document.getElementById('video')
const height = 560
const width = 720
const startVideo = () => {
    navigator.getUserMedia(
        {video : true, audio: false},
        stream => video.srcObject = stream,
        err => console.log(err)
    )
}

let canvasFrame = document.getElementById("canvasFrame"); // canvasFrame is the id of <canvas>
let context = canvasFrame.getContext("2d");
let src = new cv.Mat(height, width, cv.CV_8UC4);
let dst = new cv.Mat(height, width, cv.CV_8UC1);
const FPS = 30;
function processVideo() {
    let begin = Date.now();
    // draw video to the input slot on the page
    context.drawImage(video, 0, 0, width, height);
    // take the video data from input and save it to the src matrix
    src.data.set(context.getImageData(0, 0, width, height).data);
    // Manipulate src data and push it dst matrix
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
    // show the generated images from video in short succession for output video
    cv.imshow("canvasFrame", dst);
    let delay = 1000/FPS - (Date.now() - begin);
    // recursively call process Video
    setTimeout(processVideo, delay);
}
// schedule first one.
setTimeout(processVideo, 0);

startVideo()