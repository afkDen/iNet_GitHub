import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Aya — Kwentuhan",
    description: "Set up your outing preferences with Aya",
};

export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Full-screen onboarding — no BottomNav rendered here.
    // The root layout's BottomNav checks pathname and hides itself,
    // but this layout also ensures no pb-16 padding from the root <main>.
    return <>{children}</>;
}
