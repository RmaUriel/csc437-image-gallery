import { useState } from "react";

import { useParams } from "react-router";
import { useEffect } from "react";
import { ImageNameEditor } from "./ImageNameEditor";

export function ImageDetails({authToken, currentUsername}) {
    const { imageId } = useParams();
    const [image, _setImage] = useState(null);
    const [loading, _setLoading] = useState(true);
    const [error, _setError] = useState("");

    useEffect(() => {
        async function doFetch() {
            try {
                const response = await fetch(`/api/images/${imageId}`,{
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    }
                });

                if (response.status === 404) {
                    _setImage(null);
                    _setError("");
                    return;
                }

                if (!response.ok) {
                    throw new Error(
                        `Error: HTTP ${response.status} ${response.statusText}`
                    );
                }

                const img = await response.json();

                _setImage(img);
                _setError("");
            } catch (err) {
                _setError(String(err.message || err));
            } finally {
                _setLoading(false);
            }
        }

        doFetch();
    }, [imageId, authToken]);

    if (loading) {
        return <p>Loading...</p>;
    }
    if (!image) {
        return <h2> Image not found</h2>
    }

    if (error !== "") {
        return <p>Error: {error}</p>;
    }
    const isOwner = image.authorId === currentUsername;


    return (
        <>
            <h2>{image.name}</h2>
            <p>By {image.author?.username ?? "Unknown"}</p>
            {isOwner? (
            <ImageNameEditor
                imageId={imageId}
                initialValue={image.name}
                authToken={authToken}
                onRenameSuccess={(newName) => {
                    _setImage((prev) =>
                        prev ? { ...prev, name: newName } : prev
                    );
                }}
            />
                ) : (
                    <p> Can only rename your owned imaged</p>
            )}
            <img className="ImageDetails-img" src={image.src} alt={image.name} />
        </>
    )
}
