import { FadeInSection } from "@/components/popUp/FadeInSection"
import { Button } from "@/components/ui/button"
import { useAuth } from '@/auth/useAuth'
import { useNavigate } from "react-router-dom"
import { Boxes, Printer, MessageSquare, CircleGauge, ShelvingUnit } from "lucide-react"
import logo from "@/assets/Pictures/FimLogga.png"
import activePrintsExample from "@/assets/Pictures/activeprintsexample2.png"
import HeroSection from "@/assets/Pictures/HeroSection.png"







export default function InfoPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleCreateAccount = () => {
        navigate("/signup");
    }
    const handleSignIn = () => {
        navigate("/login");
    }

    return (
        <main className="bg-slate-900 text-slate-100">
            <section className="relative overflow-hidden">
                <img
                    src={HeroSection}
                    alt="FIM app dashboard preview"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-900/55" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/45 to-slate-900/10" />

                <div className="relative mx-auto grid min-h-[72vh] max-w-7xl grid-cols-1 gap-10 px-6 py-16 md:grid-cols-2 md:items-center">
                    <FadeInSection>
                        <div className="max-w-2xl">
                            {/* <div className="inline-flex items-center gap-3 rounded-full border border-sky-300/40 bg-sky-500/10 px-4 py-1.5 text-sm text-sky-200">
                                <img src={logo} alt="FIM" className="h-5 w-5 object-contain" />
                                Built for practical 3D printing workflows
                            </div> */}

                            <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
                                Keep filament inventory, print status, and planning in one place
                            </h1>

                            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-100 md:text-lg">
                                FIM helps you manage spools, monitor active prints, and stay connected with other makers without jumping between tools.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-2 text-sm text-slate-100">
                                <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1"><ShelvingUnit className="h-4 w-4" />Inventory tracking</span>
                                <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1"><CircleGauge className="h-4 w-4" />Active print updates</span>
                                <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1"><MessageSquare className="h-4 w-4" />Community forum</span>
                            </div>

                            {!user && (
                                <div className="mt-8 flex flex-wrap items-center gap-3">
                                    <Button className="border-white/30 bg-white/10 hover:bg-white/20" onClick={handleCreateAccount}>
                                        Create account
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="bg-sky-500 text-white hover:bg-sky-600"
                                        onClick={handleSignIn}
                                    >
                                        Sign in
                                    </Button>
                                </div>
                            )}
                        </div>
                    </FadeInSection>
                </div>
            </section>

            <section className="bg-slate-50 py-16 text-slate-900">
                <div className="mx-auto max-w-7xl px-6">
                    <FadeInSection>
                        <div className="mb-10 text-center">
                            <h2 className="text-3xl font-semibold tracking-tight">Designed for real maker workflows</h2>
                            <p className="mt-3 text-slate-600">Core tools to keep your setup organized and your prints organized.</p>
                        </div>
                    </FadeInSection>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                        <FadeInSection>
                            <article className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <Boxes className="h-6 w-6 text-sky-700" />
                                <h3 className="mt-4 text-lg font-semibold">Spool inventory</h3>
                                <p className="mt-2 text-sm text-slate-600">Track material, color, diameter, and remaining weight for every spool.</p>
                            </article>
                        </FadeInSection>
                        <FadeInSection>
                            <article className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <Printer className="h-6 w-6 text-sky-700" />
                                <h3 className="mt-4 text-lg font-semibold">Print status</h3>
                                <p className="mt-2 text-sm text-slate-600">See what is running now and follow updates in one clean view.</p>
                            </article>
                        </FadeInSection>
                        <FadeInSection>
                            <article className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <MessageSquare className="h-6 w-6 text-sky-700" />
                                <h3 className="mt-4 text-lg font-semibold">Community Forum</h3>
                                <p className="mt-2 text-sm text-slate-600">Share setups, ask questions, and learn from other 3D printing users.</p>
                            </article>
                        </FadeInSection>
                        <FadeInSection>
                            <article className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <CircleGauge className="h-6 w-6 text-sky-700" />
                                <h3 className="mt-4 text-lg font-semibold">Faster planning</h3>
                                <p className="mt-2 text-sm text-slate-600">Know what filament is available before starting the next project.</p>
                            </article>
                        </FadeInSection>
                    </div>
                </div>
            </section>

            <section className="bg-white py-16 text-slate-900">
                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 lg:grid-cols-2 lg:items-center">
                    <FadeInSection>
                        <div>
                            <h2 className="text-3xl font-semibold tracking-tight">How FIM fits your routine</h2>
                            <ol className="mt-8 space-y-6">
                                <li className="rounded-2xl border border-slate-200 p-5">
                                    <p className="text-sm font-semibold text-sky-700">Step 1</p>
                                    <h3 className="mt-1 text-lg font-semibold">Add your spools</h3>
                                    <p className="mt-2 text-sm text-slate-600">Save your filament details once and keep inventory accurate over time.</p>
                                </li>
                                <li className="rounded-2xl border border-slate-200 p-5">
                                    <p className="text-sm font-semibold text-sky-700">Step 2</p>
                                    <h3 className="mt-1 text-lg font-semibold">Track active prints</h3>
                                    <p className="mt-2 text-sm text-slate-600">Follow print progress and check statuses without context switching.</p>
                                </li>
                                <li className="rounded-2xl border border-slate-200 p-5">
                                    <p className="text-sm font-semibold text-sky-700">Step 3</p>
                                    <h3 className="mt-1 text-lg font-semibold">Plan next jobs</h3>
                                    <p className="mt-2 text-sm text-slate-600">Use current stock visibility to choose your next print with confidence.</p>
                                </li>
                            </ol>
                        </div>
                    </FadeInSection>

                    <FadeInSection>
                        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
                            <img
                                src={activePrintsExample}
                                alt="Active prints dashboard"
                                className="h-[520px] w-full rounded-2xl object-cover object-top"
                            />
                        </div>
                    </FadeInSection>
                </div>
            </section>

            <section className="bg-slate-900 py-20 text-center text-white">
                <FadeInSection>
                    <div className="mx-auto max-w-3xl px-6">
                        <h2 className="text-3xl font-semibold sm:text-4xl">Ready to organize your 3D printing workflow?</h2>
                        <p className="mt-3 text-slate-200">Track spools, monitor prints, and plan projects in one system.</p>
 
                        {!user && (
                            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                                <Button className="bg-sky-500 text-white hover:bg-sky-600" onClick={handleCreateAccount}>
                                    Create an account
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-white/30 bg-white/10 text-white hover:bg-white/20"
                                    onClick={handleSignIn}
                                >
                                    I already have an account
                                </Button>
                            </div>
                        )}
                    </div>
                </FadeInSection>
                <div className="mr-10 flex justify-end">
                    <img src={logo} alt="FIM" className="h-16 w-16" />
                </div>
            </section>
        </main>
    )
}