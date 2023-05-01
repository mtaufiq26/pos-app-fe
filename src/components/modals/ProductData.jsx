import React, { useEffect, useRef, useState } from "react";
import { Modal, Button, Form, Input, FileInput, Textarea } from "react-daisyui";
import { useFormik } from "formik";
import { editProduct, newProduct } from "../../api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategories } from "../../api";
import Swal from "sweetalert2";
import * as Yup from "yup";
import Select from "react-select";

function ProductData(props) {
  const { itemId, open, itemData, onClickBackdrop, onAddProduct } = props;
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
    onError: () =>
      Swal.fire({
        title: "Error",
        text: `Can't ${itemId ? "edit" : "add"} product`,
        icon: "error",
      }),
    onSuccess: () => {
      Swal.fire({
        title: "Success",
        icon: "success",
        text: `Product ${itemId ? "Edited" : "Added"}`,
      }).then((result) => {
        if (result.isConfirmed || result.isDismissed) {
          onAddProduct();
        }
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
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
    validationSchema: Yup.object().shape({
      product_name: Yup.string().required("Product Name is required"),
      price: Yup.number("Price is number").required("Price is required"),
      description: Yup.string(),
      category_id: Yup.number().required("Category is required"),
      // product_image: Yup.mixed().default(null)
    }),
    onSubmit: (values) => {
      // console.log(values);
      mutation.mutate(values);
      formik.resetForm();
    },
  });

  const mySelect = useRef();

  useEffect(() => {
    if (Object.keys(itemData)) {
      Object.keys(itemData).forEach((value) => {
        formik.setFieldValue(value, itemData[value]);
      });
      mySelect.current.setValue({ value: itemData.category_id, label: itemData.category_name });
    }
  }, [itemData]);

  useEffect(() => {
    !itemId && formik.resetForm();
    // console.log(mySelect.current);
  }, [itemId]);

  return (
    <Modal open={open} onClickBackdrop={onClickBackdrop}>
      <Form onSubmit={formik.handleSubmit} encType="multipart/form-data">
        <Modal.Header>
          {itemId ? "Edit" : "Add New"} Product {itemId && `#${itemId}`}
        </Modal.Header>
        <Modal.Body className="p-3">
          <div className="mb-4">
            <label htmlFor="product_name">Product Name</label>
            <Input
              className="w-full mb-3"
              type="text"
              name="product_name"
              id="product_name"
              placeholder="Enter Product Name"
              value={formik.values.product_name}
              onChange={formik.handleChange}
            />
            <label htmlFor="product_name" className="text-yellow-600">{formik.errors.product_name}</label>
          </div>

          <div className="mb-4">
            <label htmlFor="price">Price</label>
            <Input
              className="w-full mb-3"
              type="number"
              name="price"
              id="price"
              placeholder="Enter Price (number only)"
              value={formik.values.price}
              onChange={formik.handleChange}
            />
            <label htmlFor="price" className="text-yellow-800">{formik.errors.price}</label>
          </div>

          <div className="mb-4">
            <label htmlFor="description">Description</label>
            <Textarea
              className="w-full mb-3"
              name="description"
              id="description"
              placeholder="Enter your Description"
              value={formik.values.description}
              onChange={formik.handleChange}
            />
            <label htmlFor="description" className="text-yellow-800">{formik.errors.description}</label>
          </div>

          <div className="mb-4">
            <label htmlFor="category_id">Category</label>
            <Select
              inputId="category_id"
              name="category_id"
              isSearchable
              placeholder="Select Category"
              onChange={(e) => formik.setFieldValue("category_id", e.value)}
              ref={mySelect}
              options={query.data?.map((arr) => ({
                value: arr.category_id,
                label: arr.category_name,
              }))}
              // value={formik.values.category_id}
              className="react-select-container mb-3"
              classNamePrefix="react-select"
            />
            <label htmlFor="category_id" className="text-yellow-600">{formik.errors.category_id}</label>
          </div>

          <div className="mb-4">
            <label htmlFor="product_image">Product Image</label>
            <FileInput
              accept="image/*"
              className="w-full"
              name="product_image"
              id="product_image"
              onChange={(e) => formik.setFieldValue("product_image", e.currentTarget.files[0])}
              required={itemId ? false : true}
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
