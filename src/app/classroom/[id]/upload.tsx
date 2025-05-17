"use client"
import { UploadButton } from "../../../utilis/uploadthing";

export default function UploadDocument({ ClassId }: { ClassId: String }) {
    async function upload(name: string, url: string) {
        const res = await fetch('/api/document', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, url, ClassId }),
        }
        )
    }
    return <>
        <UploadButton
            endpoint="pdfUploader"
            onClientUploadComplete={(res) => {
                if (res && res.length > 0) {
                    const name = res[0]?.name
                    const url = res[0]?.ufsUrl
                    upload(name, url)
                }
            }}
            onUploadError={(error: Error) => {
                console.log("error")

                alert(`Image Upload Error: ${error.message}`);
            }}
        ></UploadButton>
    </>
}