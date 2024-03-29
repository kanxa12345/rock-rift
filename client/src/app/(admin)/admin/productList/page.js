"use client";
import DashboardLayout from "@/components/dashboardLayout/page";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { FaXmark } from "react-icons/fa6";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import {
  Dropdown,
  Input,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Switch,
  Pagination,
} from "@nextui-org/react";

const ProductSchema = Yup.object().shape({
  product: Yup.string().required("Required"),
  price: Yup.number().required("Required"),
});

const page = () => {
  const [product, setProduct] = useState([]);
  const [count, setCount] = useState(0);
  const [productDetail, setProductDetail] = useState();
  const [openAction, setOpenAction] = useState(null);
  const [openEditForm, setOpenEditForm] = useState(null);

  const fetchProductDetail = async (productId) => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/product/${productId}`
      );
      setProductDetail(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchProduct = async (page = 1) => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products?page=${page}`
      );
      setProduct(data.productList);
      setCount(data.count);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (productId) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/product/${productId}`
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [handleDelete]);

  const handleAction = (num) => {
    if (openAction === null || openAction !== num) {
      setOpenAction(num);
    } else if (openAction === num) {
      setOpenAction(null);
    }
  };

  // if (openAction !== null) {
  //   document.body.addEventListener("click", setOpenAction(null));
  // }

  const handleSave = async (values) => {
    // try {
    //   const formData = new FormData();
    //   const config = {
    //     headers: {
    //       "content-type": "multipart/form-data",
    //     },
    //   };
    //   for (let file of inputRef.current.files) {
    //     formData.append("productImages", file);
    //   }
    //   for (let item in values) {
    //     formData.append(item, values[item]);
    //   }
    //   const response = await axios.post(
    //     `${process.env.NEXT_PUBLIC_API_URL}/products`,
    //     formData,
    //     config
    //   );
    //   if (response.status === 201) {
    //     router.push("/admin/productList");
    //   }
    // } catch (err) {
    //   console.log(err);
    // }
  };

  const { handleSubmit, resetForm, handleChange, values, errors, touched } =
    useFormik({
      initialValues: {
        category: productDetail ? productDetail.category : "",
        subCategory: productDetail ? productDetail.subCategory : "",
        product: productDetail ? productDetail.product : "",
        price: productDetail ? productDetail.price : "",
        isFeatured: productDetail ? productDetail.isFeatured : false,
      },
      validationSchema: ProductSchema,
      onSubmit: (values) => {
        values.category = selectedCategory;
        values.subCategory = selectedSubCategory;
        handleSave(values);
        resetForm();
      },
    });

  return (
    <DashboardLayout>
      <div className="w-full h-full bg-gray-100 p-6 space-y-4">
        <div className="w-full flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Product List</h2>
          <Link
            href="/admin/products"
            className="py-1 px-2 bg-blue-700 text-white"
          >
            Add Product
          </Link>
        </div>
        <div className="bg-white">
          <table className="w-full">
            <thead className="border-b-2 sticky bg-white top-0">
              <tr className="text-lg">
                <th className="text-start ps-4 py-2">Product</th>
                <th className="text-start ps-4 py-2">Category</th>
                <th className="text-start ps-4 py-2">Price</th>
                <th className="text-start ps-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {product?.map((item, id) => (
                <tr key={id} className="border-b">
                  <td className="flex flex-col ps-4 py-3">
                    {/* <img
                      src={item.image}
                      alt={item.product}
                      className="w-32 h-32 object-contain"
                    /> */}
                    <h3 className="text-lg font-semibold">{item.product}</h3>
                  </td>
                  <td className="ps-6 py-3 font-medium">
                    <p className="w-20">{item.category}</p>
                  </td>
                  <td className="ps-6 py-3 font-medium">
                    <p className="w-20">{item.price}</p>
                  </td>
                  <td className="ps-6 py-3 font-medium relative">
                    <button onClick={() => handleAction(id)}>
                      <HiDotsVertical />
                    </button>
                    {openAction === id && (
                      <div className="absolute flex flex-col items-start w-32 gap-2 p-3 bg-gray-50 shadow-md z-10 top-10 -left-16">
                        <button
                          onClick={() => {
                            fetchProductDetail(item._id);
                            setOpenEditForm(id);
                            setOpenAction(null);
                          }}
                          className="w-full text-start"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            handleDelete(item._id);f
                            setOpenAction(null);
                          }}
                          className="w-full text-start"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                    {openEditForm === id && (
                      <div className="fixed w-full h-full inset-0 z-[100] flex justify-center items-center bg-black bg-opacity-70">
                        <div className="w-1/3 p-8 bg-white shadow-lg space-y-2">
                          <button
                            onClick={() => setOpenEditForm(null)}
                            className="size-10 ms-auto bg-white flex items-center justify-center rounded-full shadow-lg"
                          >
                            <FaXmark />
                          </button>
                          <div className="w-full flex flex-col items-start gap-6">
                            <h3 className="text-2xl font-bold">
                              Edit Productdetail
                            </h3>
                            <Formik>
                              <form
                                onSubmit={handleSubmit}
                                className="flex flex-col items-center gap-6 w-full"
                              >
                                <div className="flex flex-col items-start w-full gap-5">
                                  <Input
                                    type="text"
                                    name="product"
                                    variant="underlined"
                                    value={values.product}
                                    onChange={handleChange}
                                    className="border border-gray-500 p-1 w-full focus:outline-none"
                                  />
                                  {errors.product && touched.product ? (
                                    <div>{errors.product}</div>
                                  ) : null}
                                  <Input
                                    type="number"
                                    name="price"
                                    variant="underlined"
                                    value={values.price}
                                    onChange={handleChange}
                                    className="border border-gray-500 p-1 w-full focus:outline-none"
                                  />
                                  {errors.price && touched.price ? (
                                    <div>{errors.price}</div>
                                  ) : null}
                                  <div className="w-full flex justify-between items-center">
                                    <div>
                                      <p>Is featured?</p>
                                      <Switch
                                        name="isFeatured"
                                        value={values.isFeatured}
                                        onChange={handleChange}
                                        aria-label="Automatic updates"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex justify-between w-full">
                                    <Dropdown>
                                      <DropdownTrigger>
                                        <Button variant="bordered">
                                          {values.category}
                                        </Button>
                                      </DropdownTrigger>
                                      {/* <DropdownMenu aria-label="Static Actions">
                                        {categories.map((item, id) => {
                                          return (
                                            <DropdownItem
                                              onClick={(e) =>
                                                setSelectedCategory(
                                                  e.target.outerText
                                                )
                                              }
                                              key={id}
                                            >
                                              {item.category}
                                            </DropdownItem>
                                          );
                                        })}
                                      </DropdownMenu> */}
                                    </Dropdown>
                                    <Dropdown>
                                      <DropdownTrigger>
                                        <Button variant="bordered">
                                          {values.subCategory}
                                        </Button>
                                      </DropdownTrigger>
                                      {/* <DropdownMenu aria-label="Static Actions">
                                        {categories.map((item) => {
                                          return (
                                            item.category ===
                                              selectedCategory &&
                                            item.subCategory.map(
                                              (subCategoryItem, id) => (
                                                <DropdownItem
                                                  onClick={(e) =>
                                                    setSelectedSubCategory(
                                                      e.target.outerText
                                                    )
                                                  }
                                                  key={id}
                                                >
                                                  {subCategoryItem}
                                                </DropdownItem>
                                              )
                                            )
                                          );
                                        })}
                                      </DropdownMenu> */}
                                    </Dropdown>
                                  </div>
                                </div>

                                <button
                                  type="submit"
                                  className="bg-thirdColor text-white py-1 px-2"
                                >
                                  Save Changes
                                </button>
                              </form>
                            </Formik>
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            onChange={(page) => fetchProduct(page)}
            isCompact
            showControls
            total={Math.ceil(count / 10) || 1}
            initialPage={1}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default page;
