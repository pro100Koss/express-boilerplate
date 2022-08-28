import mongoose, {Document, Schema} from 'mongoose';
import {AnyJson} from '@/types/AnyJson';

export interface IProduct extends Document {
  id: string;
  name: string;
  description: string;
  price: number;
  userId: string;
}

export const ProductSchema = new Schema<IProduct>(
  {
    name: String,
    description: String,
    price: Number,
  },
  {
    versionKey: false,
    toObject: {
      transform(doc: Document<IProduct>, ret: AnyJson) {
        delete ret.__v;
        delete ret._id;
        ret.id = doc._id;
      },
    },
  },
);

ProductSchema.virtual('userRef', {
  ref: 'User',
  localField: 'userId',
  foreignField: 'id',
});

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
export default Product;
