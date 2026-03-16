import { useState } from "react";

type Props = {
    imageId: string;
    initialValue?: string;
    onRenameSuccess?: (newName: string) => void;
    authToken: string;
};

export function ImageNameEditor({ imageId, initialValue, onRenameSuccess, authToken}: Props) {
    const [isEditingName, setIsEditingName] = useState(false);
    const [nameInput, setNameInput] = useState(initialValue || "");

    const [isRenaming, setIsRenaming] = useState(false);
    const [error, setError] = useState("");

    function handleEditPressed() {
        setIsEditingName(true);
        setNameInput(initialValue || "");
        setError("");
    }

    // @ts-ignore
    async function handleSubmitPressed() {

        setError("");
        setIsRenaming(true);

        try {
            const response = await fetch(`/api/images/${imageId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({ name: nameInput }),
            });

            if (response.status === 204) {
                setIsEditingName(false);
                onRenameSuccess?.(nameInput);
                return;
            }


            let msg = `Error: HTTP ${response.status} ${response.statusText}`;
            try {
                const data = await response.json();
                if (data?.message) msg = data.message;
            } catch {

            }

            setError(msg);
        } catch (err) {
            setError(String((err as any)?.message ?? err));
        } finally {
            setIsRenaming(false);
        }
    }

    if (isEditingName) {
        return (
            <div style={{ margin: "1em 0" }}>
                <div aria-live="polite">
                    {isRenaming && <p>Renaming image...</p>}
                    {error !== "" && <p>Error: {error}</p>}
                </div>

                <label>
                    New Name
                    <input
                        required
                        style={{ marginLeft: "0.5em" }}
                        value={nameInput}
                        disabled={isRenaming}
                        onChange={(e) => setNameInput(e.target.value)}
                    />
                </label>
                <button
                    disabled={isRenaming || nameInput.length === 0}
                    onClick={handleSubmitPressed}
                >
                    Submit
                </button>
                <button disabled={isRenaming} onClick={() => setIsEditingName(false)}>
                    Cancel
                </button>
            </div>
        );
    } else {
        return (
            <div style={{ margin: "1em 0" }}>
                <div aria-live="polite">
                    {error !== "" && <p>Error: {error}</p>}
                </div>
                <button onClick={handleEditPressed}>Edit name</button>
            </div>
        );
    }
}