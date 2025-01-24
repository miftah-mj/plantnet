import PropTypes from "prop-types";
import { useState } from "react";
import DeleteModal from "../../Modal/DeleteModal";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const SellerOrderDataRow = ({ purchaseData, refetch }) => {
    const { name, customer, price, quantity, status, address, _id, plantId } =
        purchaseData || {};
    const axiosSecure = useAxiosSecure();

    let [isOpen, setIsOpen] = useState(false);
    const closeModal = () => setIsOpen(false);

    // Delete a purchase
    const handleDelete = async () => {
        try {
            console.log("Deleted: ", _id);
            await axiosSecure.delete(`/purchases/${_id}`);
            // Increase the quantity
            await axiosSecure.patch(`/plants/quantity/${plantId}`, {
                quantityUpdate: quantity,
                status: "increase",
            });
            // Call refetch to update the UI
            refetch();
            toast.success("Purchase deleted successfully!");
        } catch (err) {
            console.log(err);
            toast.error(err.response.data);
        } finally {
            closeModal();
        }
    };

    // Update the status of the purchase
    const handleStatusChange = async (newStatus) => {
        if (status === newStatus) return;
        console.log(newStatus);
        // Update the status using patch request
        try {
            await axiosSecure.patch(`/purchases/${_id}`, {
                status: newStatus,
            });
            refetch();
            toast.success("Status updated!");
        } catch (err) {
            console.log(err);
            toast.error(err.response.data);
        }
    };

    return (
        <tr>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap">{name}</p>
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap">
                    {customer?.email}
                </p>
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap">${price}</p>
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap">{quantity}</p>
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap">{address}</p>
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap">{status}</p>
            </td>

            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <div className="flex items-center gap-2">
                    <select
                        required
                        defaultValue={status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        disabled={status === "Delivered"}
                        className="p-1 border-2 border-lime-300 focus:outline-lime-500 rounded-md text-gray-900 whitespace-no-wrap bg-white"
                        name="category"
                    >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">Start Processing</option>
                        <option value="Delivered">Deliver</option>
                    </select>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="relative disabled:cursor-not-allowed cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight"
                    >
                        <span
                            aria-hidden="true"
                            className="absolute inset-0 bg-red-200 opacity-50 rounded-full"
                        ></span>
                        <span className="relative">Cancel</span>
                    </button>
                </div>
                {/* Delete Modal */}
                <DeleteModal
                    isOpen={isOpen}
                    closeModal={closeModal}
                    handleDelete={handleDelete}
                />
            </td>
        </tr>
    );
};

SellerOrderDataRow.propTypes = {
    purchaseData: PropTypes.object,
    order: PropTypes.object,
    refetch: PropTypes.func,
};

export default SellerOrderDataRow;
