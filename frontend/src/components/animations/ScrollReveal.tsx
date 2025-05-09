import React, { ReactNode, useRef, useEffect, useState } from 'react';
import { motion, useInView, useAnimation, Variants } from 'framer-motion';

interface ScrollRevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    once?: boolean;
    variants?: Variants;
}

const defaultVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
};

const ScrollReveal: React.FC<ScrollRevealProps> = ({
    children,
    className,
    delay = 0,
    duration = 0.5,
    once = true,
    variants = defaultVariants,
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once });
    const controls = useAnimation();

    useEffect(() => {
        if (isInView) {
            controls.start('visible');
        } else if (!once) {
            controls.start('hidden');
        }
    }, [isInView, controls, once]);

    return (
        <motion.div
            ref={ref}
            variants={variants}
            initial="hidden"
            animate={controls}
            transition={{ duration, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default ScrollReveal;