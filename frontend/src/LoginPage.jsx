import React, {useActionState } from "react";
import "./LoginPage.css";
import { Link, useNavigate } from "react-router";

export function LoginPage({isRegistering= false, onAuthSuccess}) {
    const usernameInputId = React.useId();
    const passwordInputId = React.useId();
    const emailInputId = React.useId();
    const navigate = useNavigate();

    async function submitAuthForm (_previousResult, formData) {

        const username = String(formData.get("username") ?? "");
        const email = String(formData.get("email") ?? "");
        const password = String(formData.get("password") ?? "");

        const endpoint = isRegistering ? "/api/users" : "/api/auth/tokens";
        const body = isRegistering
            ? { username, email, password }
            : { username, password };

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            let data = null;
            try {
                data = await response.json();
            } catch {

            }

            if (!response.ok) {
                return (
                    data?.message ||
                    (isRegistering
                        ? "Could not create account."
                        : "Could not log in.")
                );
            }

            if (!data?.token) {
                return "Authentication succeeded, but no auth token was returned.";
            }

            if (isRegistering) {
                console.log("Successfully created account");
            } else {
                console.log(data.token);
            }

            onAuthSuccess?.(data.token);
            navigate("/");

            return "";
        } catch (err) {
            return String(err?.message ?? err);
        }
    }


        const [result, formAction, isPending] = useActionState(submitAuthForm, "");
        return (
            <>
                <h2>{isRegistering ? "Register a new account": "Log in"}</h2>
                <form className="LoginPage-form" action={formAction}>
                    <label htmlFor={usernameInputId}>Username</label>
                        <input id={usernameInputId} name="username" required disabled={isPending}/>
                    {isRegistering && (
                        <>
                            <label htmlFor={emailInputId}>Email</label>
                            <input id={emailInputId} name="email" type="email" required disabled={isPending}/>
                            </>
                        )}
                    <label htmlFor={passwordInputId}>Password</label>
                        <input id={passwordInputId} name="password" type="password" required disabled={isPending}/>

                    <input type="submit" value={isPending ? "Submitting..." : isRegistering ? "Register" : "Submit"} disabled={isPending}/>
                </form>

                {result ? (
                    <div aria-live="polite">
                        <p>{result}</p>
                    </div>
                ) : null}

                {isRegistering ? (
                    <p>
                        Already have an account? <Link to="/login"> Login here</Link>
                    </p>
                ) : (
                    <p>
                        Don't have an account? <Link to="/register">Register here</Link>
                    </p>
                )}
            </>
        );

}


