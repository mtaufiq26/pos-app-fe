import React, { useState } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  FileInput,
  Textarea,
  Select,
} from "react-daisyui";
import { useFormik } from "formik";
import { editProduct, newProduct } from "../../api";
import productSchema from "../../schema/productSchema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategories } from "../../api";
import Swal from "sweetalert2";

function ProductData(props) {
  const { itemId, open, onClickBackdrop, onAddProduct } = props;
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await getCategories(),
  });
  // const [product_image, setProductImage] = useState([]);
  const submitFunc = async (values) => {
    !itemId ? await newProduct(values) : await editProduct(itemId, values);
  };
  const mutation = useMutation({
    mutationFn: async (formData) => await submitFunc(formData),
    onSuccess: () => {
      Swal.fire({
        title: "Success",
        icon: "success",
        text: "Product Added",
      }).then((result) => {
        if (result.isConfirmed || result.isDismissed) {
          onAddProduct();
        }
      });
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  });
  const formik = useFormik({
    initialValues: {
      product_name: "",
      price: "0",
      description: "",
      category_id: "1",
      product_image: null,
    },
    validationSchema: productSchema,
    onSubmit: (values) => {
      // const { product_name, price, description, category_id, product_image } = values;
      // console.log(values);
      // alert(values.product_image)
      mutation.mutate(values);
      formik.resetForm()
    },
  });

  return (
    <Modal open={open} onClickBackdrop={onClickBackdrop}>
      <Form onSubmit={formik.handleSubmit} encType="multipart/form-data">
        <Modal.Header>{itemId ? "Edit" : "Add New"} Product</Modal.Header>
        <Modal.Body className="p-3">
          <div className="mb-4">
            <label htmlFor="product_name">Product Name</label>
            <Input
              className="w-full"
              type="text"
              name="product_name"
              id="product_name"
              placeholder="Enter Product Name"
              value={formik.values.product_name}
              onChange={formik.handleChange}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="price">Price</label>
            <Input
              className="w-full"
              type="number"
              name="price"
              id="price"
              placeholder="Enter Price (number only)"
              value={formik.values.price}
              onChange={formik.handleChange}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description">Description</label>
            <Textarea
              className="w-full"
              name="description"
              id="description"
              placeholder="Enter your Description"
              value={formik.values.description}
              onChange={formik.handleChange}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="category_id">Category</label>
            <Select
              className="w-full"
              name="category_id"
              id="category_id"
              onChange={formik.handleChange}
            >
              {query.data?.map((value, key) => {
                return (
                  <Select.Option key={key} value={value.category_id}>
                    {value.category_name}
                  </Select.Option>
                );
              })}
            </Select>
          </div>

          <div className="mb-4">
            <label htmlFor="product_image">Product Image</label>
            <FileInput
              accept="image/*"
              className="w-full"
              name="product_image"
              id="product_image"
              onChange={(e) => formik.setFieldValue("product_image", e.currentTarget.files[0])}
            />
          </div>
        </Modal.Body>
        <Modal.Actions>
          <Button className="w-full" color="success" type="submit">
            Confirm
          </Button>
        </Modal.Actions>
      </Form>
    </Modal>
  );
}

export default ProductData;
