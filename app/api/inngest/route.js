import {serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { syncUserCreation, syncUserDeletion, syncUserUpdation } from "@/inngest/functions";

export const { GET, POST, PUT} = serve({
    clint: inngest,
    functions: [
        syncUserCreation,
        syncUserUpdation,
        syncUserDeletion
    ]
})