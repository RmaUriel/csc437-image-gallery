import { useState } from "react";
import { ImageGrid } from "./ImageGrid.jsx";
import { useEffect } from "react";

export function AllImages({authToken}) {
    const [imageData, _setImageData] = useState([]);
    const [loading, _setLoading] = useState(true);
    const [error, _setError] = useState("");

    useEffect(() => {
        async function doFetch() {
            try {
                const response = await fetch("/api/images", {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });

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
    }, [authToken]);

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
