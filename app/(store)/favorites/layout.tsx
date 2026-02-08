import Header from "@/components/layout/store/Header";
import StoreFooter from "@/components/layout/store/Footer";

export default function FavoritesLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Header />
            {children}
            <StoreFooter />
        </>
    );
}
