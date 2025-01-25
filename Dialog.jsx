import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";
import { FaTimes } from "react-icons/fa";

const ProfileOrderDetail = ({ isOpen, closeModal, order }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
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
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                >
                  Order Details
                  <FaTimes className="cursor-pointer" onClick={closeModal} />
                </DialogTitle>
                <div className="mt-4">
                  <div className="mb-4">
                    <p className="text-gray-900 font-semibold">
                      Status: {order.status}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-900">
                        Total Items: {order.orderItemList.length}
                      </p>
                      <p className="text-gray-900">
                        Total Price: ${order.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-4 max-h-48 pr-2 overflow-y-scroll custom-scrollbar">
                    {order.orderItemList.map((item) => (
                      <li
                        key={item.id}
                        className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm"
                      >
                        <div>
                          <p className="text-gray-900 font-semibold">
                            {item.product.name}
                          </p>
                          <p className="text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="text-gray-900">
                          ${item.price.toFixed(2)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ProfileOrderDetail;
