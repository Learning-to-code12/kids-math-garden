var model;

async function loadModel() {

  model = await tf.loadGraphModel('Tensorflow_JS/model.json');

}

function predictImage() {
  //console.log('Processing');
  // Load Image:-
  let image = cv.imread(canvas);
  // convert to black and white:-
  cv.cvtColor(image, image, cv.COLOR_RGBA2GRAY, 0);
  cv.threshold(image, image, 175, 255, cv.THRESH_BINARY);

  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();

// resizing image to the 20 and 20 px
  cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

  let cnt = contours.get(0);
  let rect =  cv.boundingRect(cnt);
  image = image.roi(rect);

  var height = image.rows;
  var width = image.cols;


  if (height > width) {
    height = 20;
    const scaleFactor = image.rows/height;
    width = Math.round(image.cols/scaleFactor);
  } else {
    width = 20;
    const scaleFactor = image.cols/width
    height = Math.round(image.rows/scaleFactor);
  }

  let newSize = new cv.Size(width, height);
  cv.resize(image, image, newSize, 0 , 0, cv.INTER_AREA);
// adding padding to the sides(black paddding)

  const LEFT = Math.ceil((4 + (20 - width)/ 2));
  const RIGHT = Math.floor((4 + (20 - width)/ 2));
  const TOP = Math.ceil((4 + (20 - height)/ 2));
  const BOTTOM = Math.floor((4 + (20 - height)/ 2));

  const BLACK = new cv.Scalar(0, 0 , 0, 0);
  cv.copyMakeBorder(image, image, TOP, BOTTOM, LEFT, RIGHT, cv.BORDER_CONSTANT, BLACK);



  // center of mass
  cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
  cnt = contours.get(0);
  const Moments = cv.moments(cnt, false);

  const cx = Moments.m10 / Moments.m00;
  const cy = Moments.m01 / Moments.m00;

  //console.log(`Moo: ${Moments.m00}, cx: ${cx}, cy: ${cy}`);

  const X_SHIFT = Math.round(image.cols/2.0 - cx);
  const Y_SHIFT = Math.round(image.rows/2.0 - cy);

// shifting image as per the center of mass:-
  newSize = new cv.Size(image.cols,image.rows);
  const M = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, X_SHIFT, 0, 1, Y_SHIFT]);

  cv.warpAffine(image, image, M, newSize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, BLACK);

// normalising the pixel values:-
  let pixelValues = image.data;

  pixelValues = Float32Array.from(pixelValues);

  pixelValues = pixelValues.map(function(item){
    return item/255.0;
  });


  //creating a tensor of final pixel values:-
  const X = tf.tensor([pixelValues]);
  // console.log(X.shape);
  // console.log(X.dtype);
  const result = model.predict(X);
  result.print();

  //console.log(tf.memory());

// data sync gives back an array an sas it contains only one integer so we are getting 0th element:-
  const output = result.dataSync()[0];


// testing only
  // const outputCanvas = document.createElement('CANVAS');
  // cv.imshow(outputCanvas, image);
  // document.body.appendChild(outputCanvas);

  // cleanup
  image.delete();
  contours.delete();
  cnt.delete();
  hierarchy.delete();
  M.delete();
  // to free up the tensor memory
  X.dispose();
  result.dispose();

  return output;


}
