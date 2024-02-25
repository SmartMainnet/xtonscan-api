import mongoose from 'mongoose'

const { Schema } = mongoose

const Transactions = new Schema(
  {
    message_id: {
      type: Number,
      required: true,
    },
    events: [],
    next_from: Number,
    is_end: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
)

Transactions.index({ message_id: 1 }, { unique: true })

export const TransactionsModel = mongoose.model('Transactions', Transactions)
