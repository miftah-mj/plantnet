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
        FormData
    );
    return data.data.display_url;
};
