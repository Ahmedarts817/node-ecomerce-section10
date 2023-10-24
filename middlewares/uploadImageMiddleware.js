const multer = require("multer");
//disk storage engine
// const multerStorage = multer.diskStorage({
//     destination:function(req,file,cb){

//         cb(null,'uploads/categories')
//     },
//     filename:function(req,file,cb){
//         const ext = file.mimetype.split('/')[1];
//         const fileName = `category-${uuidv4()}-${Date.now()}.${ext}`;
//         cb(null,fileName)
//     }
// })
//multer memory storage engine to use sharp
exports.uploadSingleImage = (fieldName) => {
  const multerStorage = multer.memoryStorage();
  // multer file filter
  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("only images are allowed", 400), false);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  //upload category image
  return upload.single(fieldName);
};

//upload number of images
exports.uploadMixOfImages = (array) => {
  const multerStorage = multer.memoryStorage();
  // multer file filter
  const multerFilter = function (req, file, cb) {
    console.log(file);
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("only images are allowed", 400), false);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  //upload category image
  return upload.fields(array);
};
