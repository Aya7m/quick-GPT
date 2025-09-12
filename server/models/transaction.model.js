import mongoose from "mongoose";

const transationSchema = new mongoose.Schema({
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true
    },
    amount: {
        type: Number,
        require: true
    },
    planId: {
        type: String,
        require: true
    },
    credits: {
        type: Number,
        require: true
    },
    isPaid: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
});

export const Transaction = mongoose.model("Transaction", transationSchema);