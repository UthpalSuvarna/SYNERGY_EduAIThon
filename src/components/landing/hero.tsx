import Link from "next/link"
export default function HeroSection() {
    return (

        <section className="container mx-auto w-full">
            <div className="grid place-items-center lg:max-w-screen-xl gap-5 mx-auto py-16 md:py-32">
                <h1 className="lg:text-8xl md:text-6xl text-4xl font-extrabold mx-auto">Welcome Back<span className="text-primary"></span></h1>
                <p className="max-w-screen-sm mx-auto md:text-xl text-sm md:px-0 px-12 text-muted-foreground text-center">
                    LearningRoom is an innovative educational platform designed to enhance student engagement and retention.
                </p>
                <div className="md:space-x-4 md:flex grid gap-y-2">
                    <Link
                        href="/classroom"
                        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-extrabold text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        prefetch={false}
                    >
                        Classrooms
                    </Link>
                    <Link
                        href="/create"
                        className="m-0 inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-extrabold shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        prefetch={false}
                    >
                        Create
                    </Link>
                </div>
            </div>

        </section>
    )
}