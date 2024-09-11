import multer, { FileFilterCallback } from "multer";
import { Request, Response, NextFunction } from "express";
import path from "path";

class FileImportMiddleware {
  private static storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

  private static fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    const filetypes = /xlsx|xls|csv/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only Excel files are allowed!"));
    }
  };

  private static upload = multer({
    storage: FileImportMiddleware.storage,
    fileFilter: FileImportMiddleware.fileFilter,
  });

  public static singleFile() {
    return (req: Request, res: Response, next: NextFunction) => {
      FileImportMiddleware.upload.single("file")(req, res, (err: any) => {
        console.log(req.body);
        console.log(req.file);
        if (err) {
          return res
            .status(400)
            .json({ message: "File upload failed.", error: err.message });
        }

        next();
      });
    };
  }
}

export default FileImportMiddleware;
