/* eslint-disable react/prop-types */
import {
    Dialog,
    Transition,
    TransitionChild,
    DialogPanel,
    DialogTitle,
} from "@headlessui/react";
import { Fragment, useState } from "react";
import Button from "../Shared/Button/Button";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-hot-toast";

const PurchaseModal = ({ closeModal, isOpen, plant }) => {
    const { user } = useAuth();
    const { name, category, price, quantity } = plant;

    const [totalQuantity, setTotalQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState(price);

    const handleQuantity = (value) => {
        if (value > quantity) {
            setTotalQuantity(quantity);
            return toast.error("Quantity exceeds available stock");
        } else if (value < 0) {
            setTotalQuantity(1);
            return toast.error("Quantity cannot be less than 1");
        }
        setTotalQuantity(value);
        setTotalPrice(price * value);
    };

    const handlePurchase = async () => {
        // handle purchase
    };

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
                            <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <DialogTitle
                                    as="h3"
                                    className="text-lg font-medium text-center leading-6 text-gray-900"
                                >
                                    Review Info Before Purchase
                                </DialogTitle>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        Plant: {name}
                                    </p>
                                </div>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        Category: {category}
                                    </p>
                                </div>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        Customer: {user?.displayName}
                                    </p>
                                </div>

                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        Price: ${price}
                                    </p>
                                </div>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        Available Quantity: {quantity}
                                    </p>
                                </div>

                                {/* Quantity inpput */}
                                <div className="space-x-2 text-sm mt-2">
                                    <label
                                        htmlFor="quantity"
                                        className="text-gray-600"
                                    >
                                        Quantity:
                                    </label>
                                    <input
                                        value={totalQuantity}
                                        onChange={(e) =>
                                            handleQuantity(
                                                parseInt(e.target.value)
                                            )
                                        }
                                        className="p-2 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white"
                                        name="quantity"
                                        id="quantity"
                                        type="number"
                                        placeholder="Quantity"
                                        required
                                    />
                                </div>

                                {/* Address input */}
                                <div className="space-x-2 text-sm mt-2">
                                    <label
                                        htmlFor="address"
                                        className="text-gray-600"
                                    >
                                        Address:
                                    </label>
                                    <input
                                        className="p-2 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white"
                                        name="address"
                                        id="address"
                                        type="text"
                                        placeholder="Shipping Address"
                                        required
                                    />
                                </div>

                                {/* Button Component */}
                                <div className="mt-3">
                                    <Button
                                        onClick={handlePurchase}
                                        label={`Pay $${totalPrice}`}
                                    />
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default PurchaseModal;
