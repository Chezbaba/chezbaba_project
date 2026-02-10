import React from "react";
import Link from "next/link";
import styles from "./AnimatedButton.module.css";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps {
    href?: string;
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
}

const AnimatedButton = ({ href, onClick, children, className }: AnimatedButtonProps) => {
    if (href) {
        return (
            <Link href={href} className={cn(styles.animatedButton, className)}>
                <span>{children}</span>
            </Link>
        );
    }

    return (
        <button onClick={onClick} className={cn(styles.animatedButton, className)}>
            <span>{children}</span>
        </button>
    );
};

export default AnimatedButton;
