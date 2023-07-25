let once = false;

const preProcessing = ({source: src, destination: dst}) => {

    // apply gaussian blur and grayscale to simplify image information
    cv.GaussianBlur(src, src, new cv.Size(5,5), 0); 
    let gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

    let mask = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC1);
    
    let close = new cv.Mat();
    // Kernel for morphological transformation
    let kernel = cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(11,11));
    cv.morphologyEx(gray, close, cv.MORPH_CLOSE, kernel);

    let div = new cv.Mat();
    gray.convertTo(gray, cv.CV_32FC1);
    cv.divide(gray, close, div, 1, cv.CV_32FC1);

    cv.normalize(div, div, 0, 255, cv.NORM_MINMAX);

    let normalized = new cv.Mat();
    div.convertTo(normalized, cv.CV_8UC1)

    let thresh = new cv.Mat();
    cv.adaptiveThreshold(normalized, thresh,255,0,1,19,2);

    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    // You can try more different parameters
    cv.findContours(thresh, contours, hierarchy, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);
    // draw contours with random Scalar
    let max_area = 0;
    let best_cnt = 0;
    for (let i = 0; i < contours.size(); ++i) {
        let area = cv.contourArea(contours.get(i));
        if (area > 100 && area > max_area){
            max_area = area;
            best_cnt = i;
        }
    }

    // draw the largest contour
    cv.drawContours(mask,contours,best_cnt,new cv.Scalar(255, 255, 255),-1);
    cv.drawContours(mask,contours,best_cnt,new cv.Scalar(0, 0, 0),2);

    cv.bitwise_and(normalized, mask, normalized);
    let kernelx = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(2,10));

    let dx = new cv.Mat();
    cv.Sobel(normalized, dx, cv.CV_16S,1,0);


}