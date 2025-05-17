import React from "react";
import { signIn } from "@/auth"

const page = () => {
    return (
        <div>
            <form
                action={async () => {
                    "use server"
                    await signIn("google")
                }}
            >
                <button type="submit">Signin with Google</button>
            </form>
        </div>
    );
};

export default page;