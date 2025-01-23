import { useState } from "react";
import PropTypes from "prop-types";
import DeleteModal from "../../Modal/DeleteModal";
import UpdatePlantModal from "../../Modal/UpdatePlantModal";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const PlantDataRow = ({ plant, refetch }) => {
    const { image, name, category, price, quantity, _id } = plant || {};
    const axiosSecure = useAxiosSecure();
    // delete modal
    let [isOpen, setIsOpen] = useState(false);
    //update modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    function openModal() {
        setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
    }

    const handleDeletePlant = async () => {
        try {
            await axiosSecure.delete(`/plants/${_id}`);
            refetch();
            toast.success("Plant Deleted...");
        } catch (err) {
            toast.error(err.response.data);
        } finally {
            setIsOpen(false);
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
                <span
                    onClick={openModal}
                    className="relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight"
                >
                    <span
                        aria-hidden="true"
                        className="absolute inset-0 bg-red-200 opacity-50 rounded-full"
                    ></span>
                    <span className="relative">Delete</span>
                </span>

                {/* Delete Modal */}
                <DeleteModal
                    isOpen={isOpen}
                    closeModal={closeModal}
                    handleDelete={handleDeletePlant}
                />
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <span
                    onClick={() => setIsEditModalOpen(true)}
                    className="relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight"
                >
                    <span
                        aria-hidden="true"
                        className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                    ></span>
                    <span className="relative">Update</span>
                </span>

                {/* Update Modal */}
                <UpdatePlantModal
                    isOpen={isEditModalOpen}
                    setIsEditModalOpen={setIsEditModalOpen}
                />
            </td>
        </tr>
    );
};

PlantDataRow.propTypes = {
    plant: PropTypes.object.isRequired,
    refetch: PropTypes.func.isRequired,
};
export default PlantDataRow;
