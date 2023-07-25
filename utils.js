let once = false;

const preProcessing = ({source: src, destination: dst}) => {

    // apply gaussian blur and grayscale to simplify image information
    // src.copyTo(dst);
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
    cv.convertScaleAbs(dx, dx);
    cv.normalize(dx, dx, 0, 255, cv.NORM_MINMAX);
    cv.threshold(dx, close, 0, 255, cv.THRESH_BINARY+cv.THRESH_OTSU);
    cv.morphologyEx(close, close, cv.MORPH_DILATE, kernelx);

    cv.findContours(close, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    for (let i = 0; i < contours.size(); ++i) {
        let rec = new cv.Rect();
        rec = cv.boundingRect(contours.get(i));
        if (rec.height / rec.width > 10){
            cv.drawContours(close,contours,i,new cv.Scalar(255,255,255), -1);
        } else {
            cv.drawContours(close,contours,i,new cv.Scalar(0,0,0), -1);
        }
    }
    cv.morphologyEx(close, close, cv.MORPH_CLOSE, new cv.Mat(), new cv.Point(-1,-1), 2);
    let closex = new cv.Mat();
    close.copyTo(closex);

    let kernely = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(10,2));
    let dy = new cv.Mat();
    cv.Sobel(normalized, dy, cv.CV_16S,0,2);
    cv.convertScaleAbs(dy, dy);
    cv.normalize(dy, dy, 0, 255, cv.NORM_MINMAX);
    cv.threshold(dy, close, 0, 255, cv.THRESH_BINARY+cv.THRESH_OTSU);
    cv.morphologyEx(close, close, cv.MORPH_DILATE, kernely);

    cv.findContours(close, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    for (let i = 0; i < contours.size(); ++i) {
        let rec = new cv.Rect();
        rec = cv.boundingRect(contours.get(i));
        if (rec.width / rec.height > 10){
            cv.drawContours(close,contours,i,new cv.Scalar(255,255,255), -1);
        } else {
            cv.drawContours(close,contours,i,new cv.Scalar(0,0,0), -1);
        }
    }

    cv.morphologyEx(close, close, cv.MORPH_DILATE, new cv.Mat(), new cv.Point(-1,-1), 2);
    let closey = new cv.Mat();
    close.copyTo(closey);

    cv.bitwise_and(closex, closey, normalized);

    cv.findContours(normalized, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);
    
    let centroids = [];

    for (let i = 0; i < contours.size(); ++i) {
        let mom = cv.moments(contours.get(i));
        let p = new cv.Point((mom.m10 / mom.m00), (mom.m01/mom.m00));
        cv.circle(src, p, 10, new cv.Scalar(255, 255, 0), -1);
        centroids.push(p);
    }
    src.copyTo(dst);


    let reArr = [];

    while(centroids.length) reArr.push(centroids.splice(0,121));

    if(reArr.length > 0){
        console.log(reArr);
        once = true;
    }





}