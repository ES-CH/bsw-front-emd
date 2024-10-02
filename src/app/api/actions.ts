export async function loginUser(formData: FormData) {
    const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        body: formData,
    });
    const data = await response.json();
    return data;
}