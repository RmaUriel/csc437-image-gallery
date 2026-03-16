import { AllImages } from "./images/AllImages.jsx";
import { ImageDetails } from "./images/ImageDetails.jsx";
import { UploadPage } from "./UploadPage.jsx";
import { LoginPage } from "./LoginPage.jsx";
import { MainLayout } from "./MainLayout.jsx";
import {VALID_ROUTES} from "../../shared/ValidRoutes.js"

import { Routes, Route } from "react-router";

function App() {
    return (
        <Routes>
            <Route path={VALID_ROUTES.HOME} element={<MainLayout />}>
                <Route index element={<AllImages />} />
                <Route path={VALID_ROUTES.UPLOAD.slice(1)} element={<UploadPage />} />
                <Route path={VALID_ROUTES.LOGIN.slice(1)} element={<LoginPage />} />
                <Route path={VALID_ROUTES.IMAGE_DETAILS.slice(1)} element={<ImageDetails />} />
            </Route>
        </Routes>
    );
}

export default App;