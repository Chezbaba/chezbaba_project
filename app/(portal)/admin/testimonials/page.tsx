"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { TestimonialHeader } from "@/components/portal/admin/testimonialspage/TestimonialHeader";
import { TestimonialTable, Temoignage } from "@/components/portal/admin/testimonialspage/TestimonialTable";
import { TestimonialModal } from "@/components/portal/admin/testimonialspage/TestimonialModal";
import { montserrat } from "@/styles/fonts";

export default function TestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Temoignage[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Temoignage | null>(null);

    const fetchTestimonials = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/testimonials");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setTestimonials(data);
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors du chargement des témoignages");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const handleSave = async (data: Partial<Temoignage>) => {
        try {
            const url = editingTestimonial
                ? `/api/testimonials/${editingTestimonial.id}`
                : "/api/testimonials";
            const method = editingTestimonial ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Failed to save");

            toast.success(editingTestimonial ? "Témoignage mis à jour" : "Témoignage ajouté");
            setShowModal(false);
            setEditingTestimonial(null);
            fetchTestimonials();
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de l'enregistrement");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Voulez-vous vraiment supprimer ce témoignage ?")) return;
        try {
            const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");
            toast.success("Témoignage supprimé");
            fetchTestimonials();
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de la suppression");
        }
    };

    return (
        <div className={`min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-10 ${montserrat.className}`}>
            <div className="max-w-7xl mx-auto">
                <TestimonialHeader
                    onAdd={() => {
                        setEditingTestimonial(null);
                        setShowModal(true);
                    }}
                />
                <TestimonialTable
                    testimonials={testimonials}
                    loading={loading}
                    onEdit={(t) => {
                        setEditingTestimonial(t);
                        setShowModal(true);
                    }}
                    onDelete={handleDelete}
                />

                {showModal && (
                    <TestimonialModal
                        testimonial={editingTestimonial}
                        onClose={() => {
                            setShowModal(false);
                            setEditingTestimonial(null);
                        }}
                        onSave={handleSave}
                    />
                )}
            </div>
        </div>
    );
}
