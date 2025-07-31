import Event from "../models/eventModel.js";
import xlsx from "xlsx";

const parseAttendees = (filePath) => {
  if (!filePath) return [];
  try {
    const workbook = xlsx.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    return xlsx.utils.sheet_to_json(worksheet, {
      header: ["Name", "Mobile"],
      range: 1,
    });
  } catch (error) {
    console.error("Excel Parsing Error:", error);
    return [];
  }
};

const getEvents = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, name, date } = req.query;
    const query = {};
    if (name) query.name = { $regex: name, $options: "i" };
    if (date) query.event_date = date;

    const events = await Event.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((page - 1) * limit);

    res.json(events);
  } catch (error) {
    next(error);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event && event.user.equals(req.user._id)) {
      res.json(event);
    } else {
      res.status(404);
      throw new Error("Event not found or not authorized");
    }
  } catch (error) {
    next(error);
  }
};

const createEvent = async (req, res, next) => {
  try {
    const { name, event_date, event_type, web_link } = req.body;

    const eventFilePath = req.files?.eventFile?.[0]?.path;
    const attendeeFilePath = req.files?.attendeeFile?.[0]?.path;

    if (!eventFilePath) {
      res.status(400);
      throw new Error("Event file is required");
    }

    const event = new Event({
      name,
      event_date,
      event_type,
      web_link,
      file_path: eventFilePath,
      attendees: parseAttendees(attendeeFilePath),
      user: req.user._id,
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event || !event.user.equals(req.user._id)) {
      res.status(404);
      throw new Error("Event not found or not authorized");
    }

    const { name, event_date, event_type, web_link } = req.body;
    event.name = name || event.name;
    event.event_date = event_date || event.event_date;
    event.event_type = event_type || event.event_type;
    event.web_link = web_link; // Allow setting to empty string

    if (req.files?.eventFile) event.file_path = req.files.eventFile[0].path;
    if (req.files?.attendeeFile)
      event.attendees = parseAttendees(req.files.attendeeFile[0].path);

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event && event.user.equals(req.user._id)) {
      await event.deleteOne();
      res.json({ message: "Event removed" });
    } else {
      res.status(404);
      throw new Error("Event not found or not authorized");
    }
  } catch (error) {
    next(error);
  }
};

export { getEvents, getEventById, createEvent, updateEvent, deleteEvent };
