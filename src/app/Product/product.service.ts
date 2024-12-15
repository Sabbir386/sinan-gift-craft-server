// product.service.ts

import { TProduct } from "./product.interface";
import { Product } from "./product.model";

// Helper function to generate slug
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()  // Convert to lowercase
    .trim()         // Remove extra spaces
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphen
    .replace(/^-+|-+$/g, '');    // Remove leading or trailing hyphens
};
const createProduct = async (payload: TProduct) => {
  if (!payload.slug) {
    payload.slug = generateSlug(payload.name); // Generate slug if not provided
  } else {
    payload.slug = generateSlug(payload.slug); // Ensure slug is in the correct format
  }

  return await Product.create(payload);
};


const getAllProducts = async () => {
  return await Product.find().populate('category subCategory');
};

const getSingleProduct = async (id: string) => {
  return await Product.findById(id).populate('category subCategory');
};

const updateProduct = async (id: string, payload: Partial<TProduct>) => {
  if (payload.slug) {
    payload.slug = generateSlug(payload.slug); // Ensure slug is in the correct format
  } else if (payload.name) {
    payload.slug = generateSlug(payload.name); // Generate slug from name if name is updated
  }

  return await Product.findByIdAndUpdate(id, payload, { new: true }).populate('category subCategory');
};

const deleteProduct = async (id: string) => {
  await Product.findByIdAndDelete(id);
};

export const ProductServices = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};