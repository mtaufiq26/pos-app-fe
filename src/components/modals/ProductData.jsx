import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  FileInput,
  Textarea,
  Select
} from "react-daisyui";
// import Select from "react-tailwindcss-select";
import { useFormik } from "formik";
import { editProduct, newProduct } from "../../api";
// import productSchema from "../../schema/productSchema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategories } from "../../api";
import Swal from "sweetalert2";
import * as Yup from "yup";

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
      category_id: Yup.number(),
      // product_image: Yup.mixed().default(null)
    }),
    onSubmit: (values) => {
      console.log(values);
      mutation.mutate(values);
      formik.resetForm()
    },
  });

  useEffect(() => {
    if (Object.keys(itemData)){
      // const datas = {
      //   product_name: itemData.product_name,
      //   price: itemData.price,
      //   description: itemData.description,
      //   category_id: itemData.category_id,
      //   product_image: null
      // }
      Object.keys(itemData).forEach(value => {
        formik.setFieldValue(value, itemData[value]);
      });
    }
  }, [itemData]);

  useEffect(() => {
    console.log(formik.values);
  }, [formik.values]);

  return (
    <Modal open={open} onClickBackdrop={onClickBackdrop}>
      <Form onSubmit={formik.handleSubmit} encType="multipart/form-data">
        <Modal.Header>{itemId ? "Edit" : "Add New"} Product {itemId && `#${itemId}`}</Modal.Header>
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
              value={formik.values.category_id}
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
            {/* <Select 
              options={
                query.data?.map(value => {
                  return {
                    value: value.category_id,
                    label: value.category_name
                  }
                })
              } 
              classNames={{
                list: "bg-base-200",
                menu: "bg-base-200",
                searchBox: "bg-base-200 p-3 w-full flex",
                searchIcon: "max-w-5 max-h-5 absolute text-right top-5 end-5"
              }}
              isSearchable={true}
              /> */}
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
