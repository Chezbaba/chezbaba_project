import { useState, useEffect } from "react";
import { X, Star } from "lucide-react";
import { Temoignage } from "./TestimonialTable";

interface TestimonialModalProps {
    testimonial: Temoignage | null;
    onClose: () => void;
    onSave: (data: Partial<Temoignage>) => void;
}

export function TestimonialModal({
    testimonial,
    onClose,
    onSave,
}: TestimonialModalProps) {
    const [formData, setFormData] = useState<Partial<Temoignage>>({
        nom: "",
        prenom: "",
        texte: "",
        note: 5,
    });

    useEffect(() => {
        if (testimonial) {
            setFormData(testimonial);
        } else {
            setFormData({
                nom: "",
                prenom: "",
                texte: "",
                note: 5,
            });
        }
    }, [testimonial]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">
                        {testimonial ? "Modifier le témoignage" : "Ajouter un témoignage"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Prénom
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.prenom || ""}
                                onChange={(e) =>
                                    setFormData({ ...formData, prenom: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nom
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.nom || ""}
                                onChange={(e) =>
                                    setFormData({ ...formData, nom: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Note
                        </label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, note: star })}
                                    className="p-1"
                                >
                                    <Star
                                        className={`h-6 w-6 ${star <= (formData.note || 0)
                                                ? "text-yellow-500 fill-current"
                                                : "text-gray-300"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Message
                        </label>
                        <textarea
                            required
                            rows={4}
                            value={formData.texte || ""}
                            onChange={(e) =>
                                setFormData({ ...formData, texte: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition resize-none"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition"
                        >
                            Enregistrer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
