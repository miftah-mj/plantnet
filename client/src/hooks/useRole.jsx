import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const useRole = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    // Fetch the role of the user
    const { data: role, isLoading } = useQuery({
        queryKey: ["role", user?.email],
        queryFn: async () => {
            const { data } = await axiosSecure(`/users/role/${user?.email}`);
            return data.role;
        },
    });
    
    console.log('role:', role);
    return [role, isLoading];
};

export default useRole;
