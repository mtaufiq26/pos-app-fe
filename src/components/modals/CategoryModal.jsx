import { Modal, Button, Form, Input, Table, InputGroup } from "react-daisyui";
import { useFormik } from "formik";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  getCategories,
  addCategory,
  editCategory,
  removeCategory,
} from "../../api";
import Swal from "sweetalert2";
import { useState, useRef, useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import * as yup from "yup";

export default function CategoryModal(props) {
  const { onClickBackdrop, onSuccess, open } = props;
  const [itemId, setItemId] = useState(0);
  const [newMode, setNewMode] = useState(false);
  const queryClient = useQueryClient();
  const categories = useQuery({
    queryKey: ["categories", "select"],
    queryFn: async () => await getCategories(),
    networkMode: "always"
  });

  const submitFunc = async (data) => {
    !itemId && newMode
      ? await addCategory(data)
      : await editCategory(itemId, data);
  };

  const inputRef = useRef();

  const mutation = useMutation({
    mutationFn: async (data) => await submitFunc(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setItemId(0);
      inputRef.current.value = "";
    },
    networkMode: "always"
  });
  const formik = useFormik({
    initialValues: {
      category_name: "",
    },
    validationSchema: yup.object().shape({ category_name: yup.string().required() }),
    onSubmit: (values) => {
      mutation.mutate(values);
      formik.resetForm();
    },
  });


  const deleteCategory = (itemId) => {
    Swal.fire({
      title: "Confirm",
      text: " Do you want to delete category?",
      icon: "question",
      showDenyButton: true,
      confirmButtonText: "Yes"
    }).then(
      (result) => {
        if (result.isConfirmed) {
          removeCategory(itemId).then(() => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            Swal.fire({
              title: "Success",
              text: "Category Deleted",
              icon: "warning",
            });
          });
        }
      }
    )
  };

  const saveNew = () => {
    newMode && formik.submitForm();
  };

  const saveChange = () => itemId && formik.submitForm();

  useEffect(() => {
    console.log(`Item ID : ${itemId}`);
  }, [itemId]);

  useEffect(() => {
    if (newMode) {
      inputRef.current.focus();
      setItemId(0);
    }
  }, [newMode]);

  return (
    <Modal open={open} onClickBackdrop={() => {onClickBackdrop(); setNewMode(false)}}>
      <Modal.Header>Categories</Modal.Header>
      <Modal.Body>
        <div className={`mb-3 flex gap-1 ${!newMode && "hidden"}`}>
          <Input
            type="text"
            placeholder="Your New Category"
            className="w-full"
            onChange={(e) =>
              formik.setFieldValue("category_name", e.currentTarget.value)
            }
            ref={inputRef}
          />
          <Button color="success" onClick={saveNew}>
            OK
          </Button>
          <Button color="error" onClick={() => setNewMode(false)}>
            Cancel
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table width="100%" cellPadding="3">
            <Table.Head>
              <span> </span>
              <span>Name</span>
              <span>
                <Button
                  color="success"
                  startIcon={<FaPlus />}
                  className={`${newMode && "hidden"}`}
                  onClick={() => setNewMode(true)}
                >
                  New
                </Button>
              </span>
            </Table.Head>
            <Table.Body>
              {categories.data?.map((value) => {
                return (
                  <Table.Row key={value.category_id}>
                    <span />
                    <span>
                      <Input
                        type="text"
                        onChange={(e) => {
                          setItemId(value.category_id);
                          formik.setFieldValue(
                            "category_name",
                            e.currentTarget.value
                          );
                        }}
                        onBlur={(e) => {
                          e.currentTarget.value = "";
                          saveChange();
                        }}
                        placeholder={value.category_name}
                      />
                    </span>
                    <span>
                      <Button
                        color="ghost"
                        className="rounded-full"
                        onClick={() => deleteCategory(value.category_id)}
                      >
                        <FaTrash />
                      </Button>
                    </span>
                  </Table.Row>
                );
              })}
              {/* {JSON.stringify(categories.data)} */}
            </Table.Body>
          </Table>
        </div>
      </Modal.Body>
    </Modal>
  );
}
