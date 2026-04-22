import AnimationContainer from "@/components/ui/animation-container"
import Logo from "../Logo"

const Footer = () => {
    return (
        <footer id="contribute" className="flex flex-col relative items-center justify-center border-t border-border/40 pt-16 pb-8 md:pb-0 px-6 lg:px-8 w-full max-w mx-auto lg:pt-32 bg-[radial-gradient(35%_180px_at_50%_0%,oklch(45%_0.18_260/0.04),transparent)] scroll-mt-32">

            <div className="absolute top-0 left-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-1.5 bg-primary/20 rounded-full"></div>

            <div className="grid gap-8 xl:grid-cols-3 xl:gap-8 w-full px-4 max-w-6xl">

                <AnimationContainer delay={0.1}>
                    <div className="flex flex-col items-start justify-start md:max-w-50">
                        <div className="flex items-start">
                            <Logo />
                            <span className="ml-2 text-xl font-heading">Dasi</span>
                        </div>
                        <p className="mt-4 text-muted-foreground text-sm">
                            A private, beautiful home for your thoughts and reflections.
                        </p>
                    </div>
                </AnimationContainer>

                <div className="grid-cols-2 gap-8 grid mt-16 xl:col-span-2 xl:mt-0">
                    <div className="md:grid md:grid-cols-2 md:gap-8">
                        <AnimationContainer delay={0.2}>
                            <div>
                                <h3 className="text-base font-heading text-foreground">
                                    Product
                                </h3>
                                <ul className="mt-4 text-sm text-muted-foreground">
                                    <li className="mt-2">
                                        <a href="#features" className="hover:text-primary transition-all duration-300">
                                            Features
                                        </a>
                                    </li>
                                    <li className="mt-2">
                                        <a href="#features" className="hover:text-primary transition-all duration-300">
                                            Security
                                        </a>
                                    </li>
                                    <li className="mt-2">
                                        <a href="#features" className="hover:text-primary transition-all duration-300">
                                            Privacy
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </AnimationContainer>
                        <AnimationContainer delay={0.3}>
                            <div className="mt-10 md:mt-0 flex flex-col">
                                <h3 className="text-base font-heading text-foreground">
                                    Community
                                </h3>
                                <ul className="mt-4 text-sm text-muted-foreground">
                                    <li>
                                        <a href="#" className="hover:text-primary transition-all duration-300">
                                            GitHub
                                        </a>
                                    </li>
                                    <li className="mt-2">
                                        <a href="#" className="hover:text-primary transition-all duration-300">
                                            Twitter
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </AnimationContainer>
                    </div>
                    <div className="md:grid md:grid-cols-2 md:gap-8">
                        <AnimationContainer delay={0.4}>
                            <div>
                                <h3 className="text-base font-heading text-foreground">
                                    Resources
                                </h3>
                                <ul className="mt-4 text-sm text-muted-foreground">
                                    <li className="mt-2">
                                        <a href="#" className="hover:text-primary transition-all duration-300">
                                            Blog
                                        </a>
                                    </li>
                                    <li className="mt-2">
                                        <a href="#" className="hover:text-primary transition-all duration-300">
                                            Support
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </AnimationContainer>
                        <AnimationContainer delay={0.5}>
                            <div className="mt-10 md:mt-0 flex flex-col">
                                <h3 className="text-base font-heading text-foreground">
                                    Company
                                </h3>
                                <ul className="mt-4 text-sm text-muted-foreground">
                                    <li>
                                        <a href="#" className="hover:text-primary transition-all duration-300">
                                            About Us
                                        </a>
                                    </li>
                                    <li className="mt-2">
                                        <a href="#" className="hover:text-primary transition-all duration-300">
                                            Privacy
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </AnimationContainer>
                    </div>
                </div>

            </div>

            <div className="my-10 border-t border-border/40 pt-8 md:flex md:items-center md:justify-between w-full max-w-6xl px-4">
                <AnimationContainer delay={0.6}>
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} Dasi. Built with care for your privacy.
                    </p>
                </AnimationContainer>
            </div>
        </footer>
    )
}

export default Footer
