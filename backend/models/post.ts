import mongoose, { Schema, Types } from "mongoose";

const postSchema = new Schema(
  {
    title: {
      required: true,
      type: String,
    },
    devRole: {
      required: true,
      type: String,
    },
    description: {
      required: true,
      type: String,
    },
    platform: {
      required: true,
      type: String,
    },
    url: {
      required: true,
      type: String,
    },
    upvotes: {
      default: 0,
      type: Number,
    },
    upvotedBy: {
      type: [
        {
          type: Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
    downvotedBy: {
      type: [
        {
          type: Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
    creator: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: {
      type: [
        {
          type: Types.ObjectId,
          ref: "Comment",
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
