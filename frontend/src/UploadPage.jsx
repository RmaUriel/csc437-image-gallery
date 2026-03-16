import React from "react";
import { useNavigate } from "react-router";

export function UploadPage({authToken}) {

    const fileInputId = React.useId();
    const navigate = useNavigate();

    const[previewDataUrl, setPreviewDataUrl] = React.useState("");
    const [submitting, setSubmitting] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    function readAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

    async function onFileChange(evt) {
        const file = evt.target.files && evt.target.files[0];
        if (!file){
            setPreviewDataUrl("");
            return;
        }
        try{
            const dataUrl = await readAsDataURL(file);
            setPreviewDataUrl(String(dataUrl));
        } catch (error) {
            console.error("Error reading file for preview: ", error);
            setPreviewDataUrl("");
        }
    }

    async function onSubmit(evt) {
        evt.preventDefault();
        setErrorMessage("");
        const form= evt.currentTarget;
        const formData = new FormData(form);

        if (!formData.get("image") || !formData.get("name")) {
            setErrorMessage("Please provide an image and its title");
            return;
        }
        setSubmitting(true);

        try{
            const response = await fetch("/api/images",{
                method: "POST",
                headers: {
                    Authorization: authToken ? `Bearer ${authToken}` : ""
                }, body: formData
            });

            if (response.ok) {
                const data = await response.json().catch(() => ({}));
                const newId = data?.id ?? data?.insertedId ?? null;
                if (newId) {
                    navigate(`/images/${newId}`);
                    return;
                } else {
                    navigate("/");
                    return;
                }
            }else {
                const payload = await response.json().catch(() => ({}));
                    setErrorMessage(payload?.message || `Upload failed: ${response.statusText}`);
                    setPreviewDataUrl("");
            }
        } catch (error) {
            console.error("Upload error:", error);
            setErrorMessage(String(error));
            setPreviewDataUrl("");
        } finally{
            setSubmitting(false);
        }
    }
    return (
        <>
            <h2>Upload</h2>
            <form onSubmit={onSubmit}>
                <div>
                    <label htmlFor={fileInputId}>Choose image to upload: </label>
                    <input
                        id={fileInputId}
                        name="image"
                        type="file"
                        accept=".png,.jpg,.jpeg"
                        required
                        onChange={onFileChange}
                        disabled={submitting}
                    />
                </div>
                <div>
                    <label>
                        <span>Image title: </span>
                        <input name="name" required disabled={submitting} />
                    </label>
                </div>

                <div>
                    <img
                        style={{ width: "20em", maxWidth: "100%" }}
                        src={previewDataUrl || ""}
                        alt={previewDataUrl ? "Image preview" : ""}
                    />
                </div>

                {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}

                <input type="submit" value="Confirm upload" disabled={submitting} />
            </form>
        </>
    );
}
