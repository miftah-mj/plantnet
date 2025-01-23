import { useState } from "react";
import UpdateUserModal from "../../Modal/UpdateUserModal";
import PropTypes from "prop-types";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const UserDataRow = ({ userData, refetch }) => {
    const axiosSecure = useAxiosSecure();
    const { email, role, status } = userData || {};
    const [isOpen, setIsOpen] = useState(false);

    // Handle updating user role
    const updateRole = async (selectedRole) => {
        if (role === selectedRole) return;
        try {
            await axiosSecure.patch(`/users/role/${email}`, {
                role: selectedRole,
            });

            toast.success("Role Updated");
            refetch();
        } catch (err) {
            toast.error(err.response.data);
        } finally {
            setIsOpen(false);
        }
    };

    return (
        <tr>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap">{email}</p>
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap capitalize">
                    {role}
                </p>
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {status ? (
                    <p
                        className={` ${
                            status === "requested"
                                ? "text-yellow-500"
                                : "text-green-500"
                        } whitespace-no-wrap capitalize`}
                    >
                        {status}
                    </p>
                ) : (
                    <p className="text-red-500 whitespace-no-wrap capitalize">
                        unavailable
                    </p>
                )}
            </td>

            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <span
                    onClick={() => setIsOpen(true)}
                    className="relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight"
                >
                    <span
                        aria-hidden="true"
                        className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                    ></span>
                    <span className="relative">Update Role</span>
                </span>
                {/* Modal */}
                <UpdateUserModal
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    role={role}
                    updateRole={updateRole}
                />
            </td>
        </tr>
    );
};

UserDataRow.propTypes = {
    userData: PropTypes.object,
    refetch: PropTypes.func,
};

export default UserDataRow;
