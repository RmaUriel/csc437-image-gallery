import { useState } from "react";
import { fetchAll } from "./ImageFetcher.js";
import { ImageGrid } from "./ImageGrid.jsx";
import { useEffect } from "react";

export function AllImages() {
    const [imageData, _setImageData] = useState(fetchAll);
    const [loading, _setLoading] = useState(true);
    const [error, _setError] = useState("");

    useEffect(() => {
        async function doFetch() {
            try {
                const response = await fetch("/api/images");

                if (!response.ok) {
                    throw new Error(
                        `Error: HTTP ${response.status} ${response.statusText}`
                    );
                }

                const images = await response.json();
                _setImageData(images);
                _setError("");
            } catch (err) {
                _setError(String(err.message || err));
            } finally {
                _setLoading(false);
            }
        }

        doFetch();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error !== "") {
        return <p>Error: {error}</p>;
    }


    return (
        <>
            <h2>All Images</h2>
            <ImageGrid images={imageData} />
        </>
    );
}
