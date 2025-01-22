import PropTypes from "prop-types";
import { useState } from "react";
import DeleteModal from "../../Modal/DeleteModal";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const CustomerOrderDataRow = ({ purchase, refetch }) => {
    const { name, category, price, quantity, status, image, _id, plantId } =
        purchase;
    console.log(purchase);
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
        } catch (err) {
            console.log(err);
        } finally {
            closeModal();
        }
    };

    return (
        <tr>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className="block relative">
                            <img
                                alt="profile"
                                src={image}
                                className="mx-auto object-cover rounded h-10 w-15 "
                            />
                        </div>
                    </div>
                </div>
            </td>

            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap">{name}</p>
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap">{category}</p>
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap">${price}</p>
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap">{quantity}</p>
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap">{status}</p>
            </td>

            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <button
                    onClick={() => setIsOpen(true)}
                    className="relative disabled:cursor-not-allowed cursor-pointer inline-block px-3 py-1 font-semibold text-lime-900 leading-tight"
                >
                    <span className="absolute cursor-pointer inset-0 bg-red-200 opacity-50 rounded-full"></span>
                    <span className="relative cursor-pointer">Cancel</span>
                </button>

                <DeleteModal
                    isOpen={isOpen}
                    closeModal={closeModal}
                    handleDelete={handleDelete}
                />
            </td>
        </tr>
    );
};

CustomerOrderDataRow.propTypes = {
    purchase: PropTypes.object.isRequired,
    refetch: PropTypes.func.isRequired,
};
export default CustomerOrderDataRow;
