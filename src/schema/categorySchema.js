import * as yup from "yup";

export default yup.object.shape({
  category_name: yup.string().required("Category Name is Required")
});