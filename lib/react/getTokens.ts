import {getCsrfToken} from "next-auth/react";

export const getTokens = async (executeRecaptcha: ((action?: (string | undefined)) => Promise<string>) | undefined) => {
    if (!executeRecaptcha) {
        throw new Error("Recaptcha is not initialized");
    }
    const csrfToken = await getCsrfToken();
    if (!csrfToken) {
        throw new Error("CSRF token is not found");
    }
    const recaptchaToken = await executeRecaptcha('register');
    return {csrfToken, recaptchaToken};
}