const multer = require("multer");
const path = require("path");
//const fileName = localStorage.getItem("@namefile");

module.exports = {
  dest: path.resolve(__dirname, "..", "..", "tmp", "uploads"),
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, "..", "..", "tmp", "uploads"));
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const permitidos = [
      "application/pdf"
      // "image/jpeg",
      // "image/pjpeg"
    ];
    if (permitidos.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Formato de arquivo inválido!"));
    }
  }
}