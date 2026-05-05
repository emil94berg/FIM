import { useEffect, useRef, useState } from "react";

type fadeProps = {
    children: React.ReactNode;
}

export function FadeInSection({children}: fadeProps) {
    const fadeRef = useRef(null);
    const [isVisable, setIsVisable] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisable(true);
                }
            },
            { threshold: 0.2 }
        );
        if (fadeRef.current) {
            observer.observe(fadeRef.current);
        }

        return () => {
            if (fadeRef.current) observer.unobserve(fadeRef.current);
        };
    }, [])

    return (
        <div ref={fadeRef}
            className={`mx-auto max-w-4xl transition-all duration-700 ease-in-out mb-10
            ${isVisable ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            {children}
        </div>
    )
}