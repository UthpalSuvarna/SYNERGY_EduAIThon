import React from "react";
import { signIn, signOut } from "@/auth"

const page = () => {
    return (
        <div>
            <form
                action={async () => {
                    "use server"
                    await signOut()
                }}
            >
                <button type="submit">Sign out</button>
            </form>
        </div>
    );
};

export default page;