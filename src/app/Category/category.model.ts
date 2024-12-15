import { Schema, model } from 'mongoose';
import { CategoryModel, TCategory, TUserName } from './category.interface';
// import { BloodGroup, Gender } from './category.constant';


const CategorySchema = new Schema<TCategory, CategoryModel>(
  {
    // id: {
    //   type: String,
    //   required: [true, 'ID is required'],
    // },
    // userTrack: {
    //   type: Schema.Types.ObjectId,
    //   required: [true, 'User objectId is required'],
    // },
    
    categoryName: {
      type: String,
      required: [true, 'Name is required'],
    },
  },
  {
    timestamps: true,
  }
);

// generating full name
// CategorySchema.virtual('fullName').get(function () {
//   return this?.name?.firstName + '' + '' + this?.name?.lastName;
// });

// filter out deleted documents
CategorySchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

CategorySchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

CategorySchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

//checking if user is already exist!
CategorySchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Category.findOne({ id });
  return existingUser;
};

export const Category = model<TCategory, CategoryModel>(
  'Category',
  CategorySchema,
);
