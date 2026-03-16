import React from "react";
import { AllImages } from "./images/AllImages.jsx";
import { ImageDetails } from "./images/ImageDetails.jsx";
import { UploadPage } from "./UploadPage.jsx";
import { LoginPage } from "./LoginPage.jsx";
import { MainLayout } from "./MainLayout.jsx";
import {VALID_ROUTES} from "../../shared/ValidRoutes.js"
import { Routes, Route } from "react-router";
import {ProtectedRoute} from "./ProtectedRoute.jsx";


function getUsernameFromAuthToken(authToken) {
    if (!authToken) {
        return "";
    }

    try {
        const payloadBase64Url = authToken.split(".")[1];
        if (!payloadBase64Url) {
            return "";
        }

        const payloadBase64 = payloadBase64Url
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        const payloadJson = window.atob(payloadBase64);
        const payload = JSON.parse(payloadJson);

        return payload?.username || "";
    } catch {
        return "";
    }
}

function App() {
    const [authToken, setAuthToken] = React.useState("");
    const currentUsername = getUsernameFromAuthToken(authToken);

    return (
        <Routes>
            <Route path={VALID_ROUTES.HOME} element={<MainLayout />}>
                <Route index element={
                    <ProtectedRoute authToken={authToken}>
                        <AllImages authToken={authToken} />
                    </ProtectedRoute>
                }/>
                <Route path={VALID_ROUTES.UPLOAD.slice(1)}
                       element={
                            <ProtectedRoute authToken={authToken}>
                                <UploadPage authToken={authToken} />
                            </ProtectedRoute>
                       } />
                <Route path={VALID_ROUTES.LOGIN.slice(1)}
                       element={
                        <LoginPage
                            isRegistering={false}
                            onAuthSuccess={setAuthToken}
                        />
                } />

                <Route
                    path={VALID_ROUTES.REGISTER.slice(1)}
                    element={
                        <LoginPage
                            isRegistering={true}
                            onAuthSuccess={setAuthToken}
                        />
                    }
                />
                <Route path={VALID_ROUTES.IMAGE_DETAILS.slice(1)} 
                       element={
                        <ProtectedRoute authToken={authToken}>
                            <ImageDetails
                                authToken={authToken}
                                currentUsername={currentUsername}
                            />
                        </ProtectedRoute>
                } />
            </Route>
            
        </Routes>
    );
}

export default App;