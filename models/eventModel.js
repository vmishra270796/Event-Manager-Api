import mongoose from "mongoose";

const eventSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "Please add an event name"],
    },
    event_date: {
      type: Date,
      required: [true, "Please add an event date"],
    },
    event_type: {
      type: String,
      required: true,
      enum: ["image", "video"],
    },
    file_path: {
      type: String,
      required: true,
    },
    web_link: {
      type: String,
    },
    attendees: [
      {
        Name: String,
        Mobile: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
