import { InputForm } from "./form"
export default function Register() {
    return (
        <div className="h-screen flex justify-center items-center bg-gradient-to-br from-white via-blue-100 to-white">
            <div className="border rounded-2xl p-8 bg-background">
                <div className="text-4xl font-bold">Create a Classfolder</div>
                <div className="flex justify-center items-center mt-5 w-full">
                    <InputForm />
                </div>
            </div>
        </div>
    )
}