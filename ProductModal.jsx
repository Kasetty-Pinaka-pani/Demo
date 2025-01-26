import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import CategoryService from "../../service/CategoryService";
import ProductService from "../../service/ProductService";
import { toast } from "react-toastify";

const ProductModal = ({
  isOpen,
  closeModal,
  isEdit,
  productId,
  fetchProducts,
}) => {
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    CategoryService.getAllCategory().then((res) =>
      setCategories(res.categoryList)
    );

    if (isEdit && productId) {
      ProductService.getProductById(productId).then((response) => {
        setName(response.product.name);
        setDescription(response.product.description);
        setPrice(response.product.price);
        setCategoryId(response.product.category.id);
        setImageUrl(response.product.imageUrl);
      });
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setCategoryId("");
      setImage(null);
      setImageUrl(null);
    }
  }, [isEdit, productId]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (image) {
        formData.append("image", image);
      }
      formData.append("categoryId", categoryId);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("productId", productId);

      let response;
      if (isEdit) {
        response = await ProductService.updateProduct(formData);
      } else {
        response = await ProductService.addProduct(formData);
      }

      if (response.status === 200) {
        toast.success(response.message);
        closeModal();
        fetchProducts();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to save product"
      );
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={closeModal}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all relative">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                >
                  {isEdit ? "Edit Product" : "Add Product"}
                  <FaTimes className="cursor-pointer" onClick={closeModal} />
                </DialogTitle>
                <form
                  onSubmit={handleSubmit}
                  className="mt-4 flex flex-col-reverse md:flex-row"
                >
                  <div className="w-full md:w-1/2 pr-0 md:pr-4">
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option value={cat.id} key={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Product name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      placeholder="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="w-full px-4 py-2 bg-customPrimary text-white rounded"
                    >
                      {isEdit ? "Update" : "Add"}
                    </button>
                  </div>
                  <div className="w-full md:w-1/2 pl-0 md:pl-4 flex flex-col items-center">
                    <input
                      type="file"
                      onChange={handleImageChange}
                      className="mb-4"
                    />
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt={name}
                        className="mb-4 max-w-full h-auto"
                      />
                    )}
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ProductModal;
