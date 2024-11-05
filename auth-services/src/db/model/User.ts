import mongoose from "mongoose";
import bcrypt from "bcryptjs";

interface UserAttrs {
  email: string;
  password: string;
}

interface UserModel extends mongoose.Model<any> {
  build(attrs: UserAttrs): any;
}

const user = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

user.pre("save", async function (done) {
  if (this.isModified("password")) {
    const salt = 10;

    const hashed = await bcrypt.hash(this.get("password"), salt);
    this.set("password", hashed);
  }
  done();
});

user.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<any, UserModel>("User", user);

export { User };
