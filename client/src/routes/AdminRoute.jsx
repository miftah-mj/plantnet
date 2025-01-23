import PropTypes from "prop-types";
import useRole from "../hooks/useRole";
import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "../components/Shared/LoadingSpinner";

const AdminRoute = ({ children }) => {
    const [role, isLoading] = useRole();
    const location = useLocation();

    if (isLoading) return <LoadingSpinner />;
    if (role == "admin") return children;
    return (
        <Navigate to="/dashboard" state={{ from: location }} replace="true" />
    );
};

AdminRoute.propTypes = {
    children: PropTypes.element,
};
export default AdminRoute;
