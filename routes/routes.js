const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");
const middleware = require("../middleware/middleware");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploadsmore");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    console.log(file);
    cb(null, uniqueSuffix + ".png", file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (mimetype && extname) {
      return cb(null, true); 
    }
    cb(new Error("File type not supported"));
  },
});

router.post("/reg", controller.reg);
router.get("/login", controller.login);
router.get("/data", middleware.auth, controller.data);
router.post("/filefs", controller.create);
router.post("/filedelete", controller.delete);
router.post("/fileinjson", controller.json_file);
router.get("/read_json", controller.read_json);
router.post("/makedirt", controller.makedirt);
router.post("/upload", upload.single("file"), controller.upload);
router.post("/uploads", upload.array("files", 12), controller.upload);

module.exports = router;
