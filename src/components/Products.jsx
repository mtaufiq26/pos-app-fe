import { Button, Card, Table, Select, Input, InputGroup } from "react-daisyui";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProducts, deleteProduct, getCategories, getUserData } from "../api";
import {
  FaBan,
  FaCartPlus,
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaPencilAlt,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import ProductData from "./modals/ProductData";
import { formatRupiah } from "../api";
import CategoryModal from "./modals/CategoryModal";
import { Img } from "react-image";
import RSelect from "react-select";
import Swal from "sweetalert2";
import axios from "axios";
import endpoint from "../endpoint";
import Cookies from "js-cookie";
import { searchProducts } from "../api";
import { BarLoader } from "react-spinners";
import { trimText } from "../actions";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeItem } from "../features/store/cart/cartSlice";

export default function Products() {
  // Menggunakan React Query agar bisa cache hasil fetching API
  const [page, setPage] = useState(1);
  const [orderBy, setOrderBy] = useState("product_name");
  const [sortDesc, setSortDesc] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [itemId, setItemId] = useState(0);
  const [itemData, setItemData] = useState({});
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [categoryList, setCategoryList] = useState([]);

  const [productCart, setProductCart] = useState([]);

  const cart = useSelector((state) => state.cart.data);
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["products", page, orderBy, sortDesc, searchText, categoryFilter],
    queryFn: async () =>
      searchText || categoryFilter
        ? await searchProducts(categoryFilter, searchText)
        : await getProducts(page, orderBy, sortDesc),
    onError: () => {
      Cookies.remove("token");
      window.location.reload();
    },
    networkMode: "always"
  });
  const cookieData = Cookies.get("token");

  const dispatch = useDispatch();

  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await getCategories(),
    onSuccess: (data) => {
      setCategoryList([...data]);
    },
    networkMode: "always"
  });

  // const addToCart = (product_id, product_name, price) => {
  //   setProductCart ({ product_id, product_name, price, quantity: 1 });
  // }

  const myUser = useQuery({
    queryKey: ["userdata"],
    queryFn: async () => await getUserData(),
    networkMode: "always"
  });

  const mutation = useMutation({
    mutationFn: async ({ item, active }) =>
      await axios.post(
        `${endpoint}/products/status/${item}`,
        {
          active,
        },
        {
          headers: {
            Authorization: `Bearer ${cookieData}`,
          },
        }
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
    networkMode: "always"
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
    !search && setSearchText("");
  }, [search]);

  useEffect(() => {
    console.log(cart);
  }, [cart]);

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
        <Card.Title className="mb-3">
          <h1 className="text-2xl mb-3">{myUser.data?.store_name || ""}</h1>
        </Card.Title>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Button color="success" onClick={() => toggleProductModal(0)}>
            Add Product
          </Button>
          <Button color="info" onClick={toggleCategoryModal}>
            Category
          </Button>
          <Input
            type="search"
            placeholder="Search..."
            className="w-full"
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
          <RSelect
            className="react-select-container"
            classNamePrefix="react-select"
            placeholder="Category..."
            options={[
              { value: "", label: "All" },
              ...categoryList.map(({ category_id, category_name }) => {
                return {
                  value: category_id,
                  label: category_name,
                };
              }),
            ]}
            inputId="select-category"
            isSearchable
            closeMenuOnSelect
            defaultValue={""}
            onChange={(e) => setCategoryFilter(e.value)}
            escapeClearsValue
          />
        </div>
        <Button
          color="black"
          className="gap-2"
          onClick={() => {
            setSearchText(search);
          }}
        >
          <FaSearch /> Search
        </Button>
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
              <span className="text-center">Actions</span>
            </Table.Head>
            <Table.Body>
              {query.data?.rows?.map((value) => (
                <Table.Row
                  key={value.product_id}
                  className={`${!value.active && "opacity-40"}`}
                >
                  <span>
                    {value.product_name}{" "}
                    <Img
                      src={value.image_url}
                      style={{ maxWidth: "200px", maxHeight: "200px" }}
                    />
                  </span>
                  <span>{formatRupiah(value.price)}</span>
                  <span className="whitespace-pre-wrap">
                    {trimText(value.description)}
                  </span>
                  <span>{value.category_name}</span>
                  <span>
                    <InputGroup>
                      <Button
                        onClick={() => toggleProductModal(value)}
                      >
                        <FaPencilAlt />
                      </Button>
                      <Button
                        onClick={() => removeItem(value.product_id)}
                      >
                        <FaTrash />
                      </Button>
                      <Button
                        className="flex justify-center items-center"
                        onClick={() => dispatch(addToCart(value))}
                        disabled={!value.active}
                      >
                        <FaCartPlus />
                      </Button>
                      <Button
                        color={!value.active && "success"}
                        onClick={() =>
                          mutation.mutate({
                            item: value.product_id,
                            active: !value.active,
                          })
                        }
                      >
                        {value.active ? <FaBan /> : <FaCheck />}
                      </Button>
                    </InputGroup>
                  </span>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {query.isLoading && (
            <div className="flex justify-center items-center flex-col p-5">
              <div>Please Wait</div>
              <BarLoader color="#0055FF" className="mb-3" />
            </div>
          )}
        </div>
        <div className="flex justify-center items-center gap-2">
          Page
          <Select onChange={(e) => setPage(Number(e.currentTarget.value))}>
            {query.data?.pages?.map((value) => (
              <Select.Option value={value} key={value}>
                {value}
              </Select.Option>
            ))}
          </Select>
        </div>
      </Card.Body>
    </Card>
  );
}
