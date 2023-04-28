import { Button, Card, Select, Table } from "react-daisyui";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProducts, deleteProduct } from "../api";
import {
  FaChevronDown,
  FaChevronUp,
  FaPencilAlt,
  FaTrash,
} from "react-icons/fa";
import ProductData from "./modals/ProductData";
import { formatRupiah } from "../api";
import CategoryModal from "./modals/CategoryModal";
import { Img } from "react-image";
import Swal from "sweetalert2";

export default function Products() {
  // Menggunakan React Query agar bisa cache hasil fetching API
  const [page, setPage] = useState(1);
  const [orderBy, setOrderBy] = useState("product_name");
  const [sortDesc, setSortDesc] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [itemId, setItemId] = useState(0);
  const [itemData, setItemData] = useState({});

  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["products", page, orderBy, sortDesc],
    queryFn: async () => await getProducts(page, orderBy, sortDesc),
  });

  const sortItem = (orderBy) => {
    setOrderBy(orderBy);
    setSortDesc((desc) => !desc);
  };

  const toggleProductModal = (data) => {
    setItemData(data);
    setItemId(data.product_id);
    setOpenModal((open) => !open);
  };

  const toggleCategoryModal = () => setOpenCategoryModal((open) => !open);

  const removeItem = (itemId) => {
    Swal.fire({
      title: "Confirm",
      text: "Do you want to delete this product?",
      icon: "question",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProduct(itemId).then(() =>
          queryClient.invalidateQueries({ queryKey: ["products"] })
        );
      }
    });
  };

  useEffect(() => {
    // itemId > 0 && setOpenModal(true);
    console.log(itemData);
  }, [itemData]);

  return (
    <Card className="bg-base-200 shadow-md shadow-blue-700">
      <ProductData
        open={openModal}
        itemId={itemId}
        itemData={itemData}
        onClickBackdrop={() => toggleProductModal(0)}
        onAddProduct={() => toggleProductModal(0)}
      />
      <CategoryModal
        open={openCategoryModal}
        onClickBackdrop={toggleCategoryModal}
        onSuccess={toggleCategoryModal}
      />
      <Card.Body>
        <Card.Title className="mb-3">Products</Card.Title>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Button color="success" onClick={toggleProductModal}>
            Add Product
          </Button>
          <Button color="info" onClick={toggleCategoryModal}>
            Category
          </Button>
        </div>
        <div className="overflow-x-auto mb-4">
          <Table cellPadding="3" width={"100%"}>
            <Table.Head>
              <span
                className="hover:cursor-pointer flex justify-center items-center gap-2"
                onClick={() => sortItem("product_name")}
              >
                Item Name {sortDesc ? <FaChevronUp /> : <FaChevronDown />}
              </span>
              <span
                className="hover:cursor-pointer flex justify-center items-center gap-2"
                onClick={() => sortItem("price")}
              >
                Price {sortDesc ? <FaChevronUp /> : <FaChevronDown />}
              </span>
              <span>Description</span>
              <span>Category</span>
              <span>Actions</span>
            </Table.Head>
            <Table.Body>
              {query.data?.rows?.map((value) => (
                <Table.Row key={value.product_id}>
                  <span>
                    {value.product_name}{" "}
                    <Img
                      src={value.image_url}
                      style={{ maxWidth: "200px", maxHeight: "200px" }}
                    />
                  </span>
                  <span>{formatRupiah(value.price)}</span>
                  <span>{value.description}</span>
                  <span>{value.category_name}</span>
                  <span className="flex gap-1">
                    <Button
                      color="ghost"
                      className="rounded-full"
                      onClick={() => toggleProductModal(value)}
                    >
                      <FaPencilAlt />
                    </Button>
                    <Button
                      color="ghost"
                      className="rounded-full"
                      onClick={() => removeItem(value.product_id)}
                    >
                      <FaTrash />
                    </Button>
                  </span>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
        <div className="flex justify-center items-center gap-2">
          Page
          <Select></Select>
        </div>
      </Card.Body>
    </Card>
  );
}
