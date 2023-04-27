import { Modal, Button, Form, Input } from "react-daisyui";
import { useFormik } from "formik";
import Swal from "sweetalert2";

export default function CategoryModal (props) {
  const formik = useFormik({
    initialValues: {
      category_name: ""
    },
    onSubmit: (values) => {

    }
  });

  return (
    <Modal open={open} onClickBackdrop={onClickBackdrop}>
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Header>
          Categories
        </Modal.Header>
        <Modal.Body>
          <div className="mb-4">
            <label htmlFor="category_name">Category Name</label>
          </div>
        </Modal.Body>
      </Form>
    </Modal>
  )
}