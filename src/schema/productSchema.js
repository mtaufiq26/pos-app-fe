import * as Yup from "yup";

const productSchema = Yup.object().shape({
  product_name: Yup.string().required("Product Name is required"),
  price: Yup.number("Price is number").required("Price is required"),
  description: Yup.string(),
  category_id: Yup.number(),
  product_image: Yup.mixed()
});

export default productSchema;