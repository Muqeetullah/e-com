import {compare, genSalt, hash} from "bcrypt";
import {Model, Schema, model, Document, ObjectId, models} from "mongoose";

interface PasswordResetTokenDocument extends Document {
  user: ObjectId;
  token: string;
  createdTime: Date;
}

interface Methods {
  compareToken(token: string): Promise<boolean>;
}

const PasswordResetTokenSchema = new Schema<
  PasswordResetTokenDocument,
  {},
  Methods
>({
  user: {type: Schema.Types.ObjectId, ref: "User", required: true},
  token: {type: String, required: true},
  createdTime: {type: Date, default: Date.now, expires: "24h"}, // Remove the parentheses from Date.now
});

// Pre-save hook to hash the token and set the expiration date
PasswordResetTokenSchema.pre("save", async function (next) {
  if (!this.isModified("token")) {
    return next();
  }
  // Hash the token with a salt round of 10

  const salt = await genSalt(10);
  const hashedToken = await hash(this.token, salt);
  this.token = hashedToken;

  next();
});

// Method to compare a plain token with the hashed token
PasswordResetTokenSchema.methods.compareToken = async function (plainToken) {
  try {
    return await compare(plainToken, this.token);
  } catch (error) {
    throw error;
  }
};

const PasswordResetTokenModel =
  models.PasswordResetToken ||
  model("PasswordResetToken", PasswordResetTokenSchema);

export default PasswordResetTokenModel as Model<
  PasswordResetTokenDocument,
  {},
  Methods
>; // Export the model
