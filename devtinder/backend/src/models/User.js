import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import validator from "validator";
const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            required: true,
            trim: true,
            enum: ['male', 'female', 'other'],
            message: '{VALUE} is not supported'
        },
        age: {
            type: Number,
            required: [true, "Age is required"],
            min: [18, "Age must be at least 18"],
            max: [100, "Age must be at most 100"]
        },

        photoUrl: {
            type: String,
            default: "https://geographyandyou.com/images/user-profile.png",
            validate(value) {
                if (!validator.isURL(value)) {
                    throw new Error("Invalid Photo URL: " + value);
                }
            },
        },
        about: {
            type: String,
            default: "This is a default about of the user!",
        },
        skills: {
            type: [String],
        },

        githubId: {
            type: String,
        },
        linkedinId: {
            type: String,
        },
        college: {
            type: String,
        },
        company: {
            type: String,
        },
        interestedIn: {
            type: [String],
            enum: ['male', 'female', 'other'],
            default: []
        }
    },
    {
        timestamps: true,
    }
)

UserSchema.methods.comparepassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

UserSchema.methods.getJWTToken = async function () {
    return await jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
}

const User = model("User", UserSchema);
export default User;
