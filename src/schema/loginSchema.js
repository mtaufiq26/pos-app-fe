import * as Yup from "yup";

const loginSchema = Yup.object().shape({
  email: Yup.string().email().required("Email is required"),
  password: Yup.string().min(6, "Minimum char length is 6").required("Password is required")
});

export default loginSchema;