"use client";
import ProductForm from "@/components/ProductForm";
import {NewProductInfo} from "@/types";
import {newProductInfoSchema} from "@/utils/productValidationSchema";
import React from "react";
import {toast} from "react-toastify";
import {ValidationError} from "yup";

const CreateProduct = () => {
  const handleAddProduct = async (values: NewProductInfo) => {
    try {
      const results = await newProductInfoSchema.validate(values, {
        abortEarly: false,
      });
      console.log("Results", results);
    } catch (error) {
      if (error instanceof ValidationError) {
        error.inner.map(err => {
          console.log(err.message);
          toast.error(err.message);
        });
      }
    }
  };
  return (
    <div>
      <ProductForm onSubmit={handleAddProduct} />
    </div>
  );
};

export default CreateProduct;
