import { Button, Card, Select, Table } from "react-daisyui";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProducts } from "../api";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import ProductData from "./modals/ProductData";

export default function Products() {
  // Menggunakan React Query agar bisa cache hasil fetching API
  const [page, setPage] = useState(1);
  const [orderBy, setOrderBy] = useState("product_name");
  const [sortDesc, setSortDesc] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["products", page, orderBy, sortDesc],
    queryFn: async () => await getProducts(page, orderBy, sortDesc),
  });

  const sortItem = (orderBy) => {
    setOrderBy(orderBy);
    setSortDesc((desc) => !desc);
  };

  const toggleProductModal = () => {
    setOpenModal((open) => !open);
  };

  return (
    <Card className="bg-base-200 shadow-md shadow-blue-700">
      <ProductData
        open={openModal}
        onClickBackdrop={toggleProductModal}
        onAddProduct={toggleProductModal}
      />
      <Card.Body>
        <Card.Title className="mb-3">Products</Card.Title>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Button color="success" onClick={toggleProductModal}>
            Add Product
          </Button>
          <Button color="info">Category</Button>
        </div>
        <div className="overflow-x-auto mb-4">
          <Table align="center" cellPadding="3" width={"100%"}>
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
                  <span>{value.product_name}</span>
                  <span>{value.price}</span>
                  <span>{value.description}</span>
                  <span>{value.category_name}</span>
                  <span></span>
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
