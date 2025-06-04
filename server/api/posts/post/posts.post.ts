import axios from 'axios';

export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  const session = await getUserSession(event);
  if (!session?.user?.token) {
    throw new Error("No token installed");
  }

  const formData = await readMultipartFormData(event);

  if (!formData || formData.length === 0) {
    throw new Error("No form data received");
  }

  const axiosFormData = new FormData();
  formData.forEach(({ name, data, filename, type }) => {
    if (filename) {
      axiosFormData.append(name, new Blob([data], { type }), filename);
    } else {
      axiosFormData.append(name, data);
    }
  });
  try {
    const response = await axios.post('https://bro-world.org/api/v1/platform/post', axiosFormData, {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.data) {
      return response.data;
    }
    throw new Error("No data returned from API");
  }
  catch (error) {
    console.error("Error updating profile:", error.response?.data || error.message);
    throw new Error("Failed to update profile");
  }
});
