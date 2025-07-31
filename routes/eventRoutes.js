import express from "express";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controller/eventController.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({ storage: storage });

import path from "path";

router
  .route("/")
  .get(protect, getEvents)
  .post(
    protect,
    upload.fields([{ name: "eventFile" }, { name: "attendeeFile" }]),
    createEvent
  );

router
  .route("/:id")
  .get(protect, getEventById)
  .put(
    protect,
    upload.fields([{ name: "eventFile" }, { name: "attendeeFile" }]),
    updateEvent
  )
  .delete(protect, deleteEvent);

export default router;
