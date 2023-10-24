import categories from "@/utils/categories";
import {timeStamp} from "console";
import {Schema, Model, model, Document, models} from "mongoose";

// Define the interface for the Product document
interface ProductDocument extends Document {
  title: string;
  description: string;
  bulletPoints?: string[];
  thumbnail: {url: string; id: string};
  images?: {url: string; id: string}[];
  price: {
    base: number;
    discounted: number;
  };
  quantity: number;
  category: string;
}

// Create a schema for the Product
const productSchema = new Schema<ProductDocument>(
  {
    title: {type: String, required: true},
    description: {type: String, required: true},
    bulletPoints: [String],
    thumbnail: {
      type: {
        url: {type: String, required: true},
        id: {type: String, required: true},
      },
    },
    images: [
      {
        url: {type: String, required: true},
        id: {type: String, required: true},
      },
    ],
    price: {
      base: {type: Number, required: true},
      discounted: {type: Number, required: true},
    },
    quantity: {type: Number, required: true},
    category: {type: String, enum: [...categories], required: true},
  },
  {timestamps: true}
);

// Define the virtual property "sale" on the schema
productSchema.virtual("sale").get(function (this: ProductDocument) {
  return (this.price.base - this.price.discounted) / this.price.base;
});

// Create the Product model if it doesn't already exist
const ProductModel =
  models.Product || model<ProductDocument>("Product", productSchema);

export default ProductModel as Model<ProductDocument>;
