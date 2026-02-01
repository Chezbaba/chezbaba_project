import { Edit, Trash2, Star } from "lucide-react";
import { extractDateString } from "@/lib/utils";

export interface Temoignage {
    id: string;
    nom: string;
    prenom: string;
    texte: string;
    note: number;
    imagePublicId: string | null;
    date: Date | string;
}

interface TestimonialTableProps {
    testimonials: Temoignage[];
    onEdit: (testimonial: Temoignage) => void;
    onDelete: (id: string) => void;
    loading: boolean;
}

export function TestimonialTable({
    testimonials,
    onEdit,
    onDelete,
    loading,
}: TestimonialTableProps) {
    if (loading) return <div className="text-center py-8">Chargement...</div>;
    if (!testimonials.length)
        return <div className="text-center py-8 bg-white rounded-xl border border-gray-200 shadow-sm">Aucun témoignage trouvé</div>;

    return (
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Auteur
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Note
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Message
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                Date
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {testimonials.map((t) => (
                            <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-medium text-gray-900">
                                        {t.prenom} {t.nom}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center text-yellow-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < t.note ? "fill-current" : "text-gray-300"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm text-gray-600 line-clamp-2 max-w-md">
                                        {t.texte}
                                    </p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell text-sm text-gray-500">
                                    {extractDateString(t.date)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onEdit(t)}
                                            className="p-2 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(t.id)}
                                            className="p-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
