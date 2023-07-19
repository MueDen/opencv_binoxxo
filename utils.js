const preProcessing = ({source: src, destination: dst}) => {
        // // Manipulate src data and push it dst matrix
    cv.GaussianBlur(src,dst,new cv.Size(5,5),0)
    let gray = cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
    cv.Canny(src, dst, 50, 100, 3, false)
    // return cv2.GaussianBlur(src,(5,5),0)
    // gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
    let mask = new cv.Mat(src.size().height, src.size().width, cv.CV_8UC4);
    // console.log(mask)

    // mask = np.zeros((gray.shape),np.uint8)
    // kernel1 = cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(11,11))

    // close = cv2.morphologyEx(gray,cv2.MORPH_CLOSE,kernel1)
    // div = np.float32(gray)/(close)
    // res = np.uint8(cv2.normalize(div,div,0,255,cv2.NORM_MINMAX))
    // res2 = cv2.cvtColor(res,cv2.COLOR_GRAY2BGR)


}