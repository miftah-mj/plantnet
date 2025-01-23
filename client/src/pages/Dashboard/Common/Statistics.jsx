import { Helmet } from "react-helmet-async";
import AdminStatistics from "../../../components/Dashboard/Statistics/AdminStatistics";
import useRole from "../../../hooks/useRole";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";

const Statistics = () => {
    const [role, isLoading] = useRole();

    if (role == "customer") return <Navigate to="/dashboard/my-orders" />;
    if (role == "seller") return <Navigate to="/dashboard/my-inventory" />;
    if (isLoading) return <LoadingSpinner />;

    return (
        <div>
            <Helmet>
                <title>Dashboard</title>
            </Helmet>

            {role === "admin" && <AdminStatistics />}
        </div>
    );
};

export default Statistics;
