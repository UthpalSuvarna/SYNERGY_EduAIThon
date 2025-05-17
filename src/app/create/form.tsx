"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { date, z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "../../components/ui/input"
import { useSession } from "next-auth/react"
import { Textarea } from "../../components/ui/textarea"

const FormSchema = z.object({
    classname: z.string().min(5, {
        message: "Classname must be at least 5 characters.",
    }),
    description: z.string().min(2, {
        message: "Write description",
    })
})

export function InputForm() {
    const { data: session } = useSession();
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            classname: "",
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {

        const registerdata = {
            ...data,
            adminMail: session?.user?.email,
        }


        fetch("api/classroom", {
            method: "POST",
            body: JSON.stringify(registerdata),
            headers: {
                "Content-Type": "application/json"
            },
        }).then((res) => {
            console.log(res);
        })

    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                <FormField
                    control={form.control}
                    name="classname"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Classname</FormLabel>
                            <FormControl>
                                <Input placeholder="" {...field} />
                            </FormControl>
                            <FormDescription>

                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Discription</FormLabel>
                            <FormControl>
                                <Input placeholder="" {...field} />
                            </FormControl>
                            <FormDescription>

                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}