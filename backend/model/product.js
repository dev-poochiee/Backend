const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your product name!"],
  },
  description: {
    type: String,
    required: [true, "Please enter your product description!"],
  },
  category: {
    type: String,
    required: [true, "Please enter your product category!"],
  },
  tags: {
    type: String,
  },
  originalPrice: {
    type: Number,
  },
  discountPrice: {
    type: Number,
    required: [true, "Please enter your product price!"],
  },
  // stock: {
  //   type: Number,
  //   required: [true, "Please enter your product stock!"],
  // },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  reviews: [
    {
      user: {
        type: Object,
      },
      rating: {
        type: Number,
      },
      comment: {
        type: String,
      },
      productId: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now(),
      }
    },
  ],
  ratings: {
    type: Number,
  },
  shopId: {
    type: String,
    required: true,
  },
  shop: {
    type: Object,
    required: true,
  },
  sold_out: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  // Merged fields from the service schema
  availableDays: [
    {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5, 6],
    },
  ],
  availableTimeSlots: [
    {
      startTime: String,
      endTime: String,
    },
  ],
  bookedSlots: [
    {
      selectedDate: {
        type: Date,
        required: true,
      },
      selectedSlot: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("Product", productSchema);
