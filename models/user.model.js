import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  bio: {
    type: String,
  },
  skills: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
    },
  ],
  experiences: [
    {
      title: {
        type: String,
        required: true,
      },
      yearsOfExperience: {
        type: Number,
        required: true,
      },
      description: {
        type: String,
      },
      level: {
        type: String,
        enum: ["Novice", "Intermediate", "Advanced", "Expert"],
        default: "Novice",
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  important: Boolean,
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return null;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.log(error.message);
    next();
  }
});

export default mongoose.model("User", userSchema);
