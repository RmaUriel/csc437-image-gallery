import { AllImages } from "./images/AllImages.jsx";
import { ImageDetails } from "./images/ImageDetails.jsx";
import { UploadPage } from "./UploadPage.jsx";
import { LoginPage } from "./LoginPage.jsx";
import { MainLayout } from "./MainLayout.jsx";

import { Routes, Route } from "react-router";

function App() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<AllImages />} />
                <Route path="upload" element={<UploadPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="images/:imageId" element={<ImageDetails />} />
            </Route>
        </Routes>
    );
}

export default App;