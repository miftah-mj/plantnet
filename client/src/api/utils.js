import axios from "axios";

// Upload image and return the URL
export const uploadImage = async (imageData) => {
    const formData = new FormData();
    formData.append("image", imageData);

    // send image to imgbb
    const { data } = await axios.post(
        `https://api.imgbb.com/1/upload?key=${
            import.meta.env.VITE_IMGBB_API_KEY
        }`,
        formData
    );
    return data.data.display_url;
};

// Save user data in the database
export const saveUser = async (user) => {
    await axios.post(`${import.meta.env.VITE_API_URL}/users/${user?.email}`, {
        email: user?.email,
        name: user?.displayName,
        photo: user?.photoURL,
    });
};
