import MDEditor from "@uiw/react-md-editor";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { montserrat } from "@/styles/fonts";
import { fetchDataFromAPI } from "@/lib/utils/fetchData";

// Types
import { CategoryFromAPI } from "@/lib/types/category.types";
import { ColorFromAPI } from "@/lib/types/color.types";
import { GenderFromAPI } from "@/lib/types/gender.types";
import { SizeFromAPI } from "@/lib/types/size.types";
import { ProductFromAPI } from "@/lib/types/product.types";

import {
  FileText,
  Package,
  DollarSign,
  Box,
  Folder,
  User,
  Palette,
  Ruler,
  Image as ImageIcon,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MAX_UPLOAD_SIZE_MB,
  ALLOWED_IMAGE_FORMATS,
  MAX_PRODUCT_DESCRIPTION_LENGTH,
  DELIVERY_OPTIONS,
  WARRANTY_OPTIONS,
} from "@/lib/constants/settings";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  editingProduct?: ProductFromAPI | null;
  categories: CategoryFromAPI[];
  genders: GenderFromAPI[];
  colors: ColorFromAPI[];
  sizes: SizeFromAPI[];
}

const initialFormData: ProductFromAPI = {
  id: "",
  type: null,
  nom: "",
  objet: "",
  description: "",
  prix: 0,
  prixPromo: undefined,
  qteStock: 0,
  delaiLivraison: "",
  garantie: "",
  noteMoyenne: 0,
  totalEvaluations: 0,
  dateCreation: new Date(),
  dateModification: new Date(),
  genre: null,
  categorie: null,
  couleurs: [],
  tailles: [],
  fournisseur: undefined,
  vendeur: undefined,
  images: [],
};

export const ProductForm = ({
  isOpen,
  onClose,
  onSubmit,
  editingProduct,
  categories,
  genders,
  colors,
  sizes,
}: ProductFormProps) => {
  const [formData, setFormData] = useState<ProductFromAPI>(initialFormData);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setFormData(editingProduct);
    } else {
      setFormData(initialFormData);
      setMainImage(null);
      setAdditionalImages([]);
    }
  }, [editingProduct]);

  const validateImage = (file: File): boolean => {
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > MAX_UPLOAD_SIZE_MB) {
      toast.error(
        `L'image dépasse la taille maximale de ${MAX_UPLOAD_SIZE_MB} Mo`
      );
      return false;
    }
    if (!ALLOWED_IMAGE_FORMATS.includes(file.type)) {
      toast.error("Format d'image non supporté. Utilisez JPEG, PNG ou WebP.");
      return false;
    }
    return true;
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isMain: boolean
  ) => {
    const files = e.target.files;
    if (!files) return;

    if (isMain) {
      const file = files[0];
      if (file && validateImage(file)) {
        setMainImage(file);
      } else {
        setMainImage(null);
        e.target.value = "";
      }
    } else {
      const newImages = Array.from(files).filter(validateImage);
      if (newImages.length > 2) {
        toast.error(
          "Vous ne pouvez ajouter que 2 images supplémentaires maximum."
        );
        setAdditionalImages([]);
        e.target.value = "";
      } else {
        setAdditionalImages(newImages.slice(0, 2));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (editingProduct) {
      if (editingProduct.type === "marketplace") {
        toast.error("Vous ne pouvez pas modifier les produits marketplace.");
        setIsLoading(false);
        return;
      }

      const updateData = {
        nom: formData.nom,
        objet: formData.objet || "",
        description: formData.description || "",
        prix: formData.prix,
        prixPromo: formData.prixPromo || null,
        qteStock: formData.qteStock,
        categorieId: formData.categorie ? formData.categorie.id : undefined,
        genreId: formData.genre ? formData.genre.id : undefined,
        couleurs: formData.couleurs.map((c) => c.id),
        tailles: formData.tailles.map((t) => t.id),
        delaiLivraison: formData.delaiLivraison || null,
        garantie: formData.garantie || null,
      };

      const result = await fetchDataFromAPI<ProductFromAPI>(
        `/api/products/${editingProduct.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        }
      );

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Produit mis à jour avec succès");
        setFormData(initialFormData);
        setMainImage(null);
        setAdditionalImages([]);
        onSubmit();
      }
    } else {
      if (!mainImage) {
        toast.error(
          "Une image principale est requise pour ajouter un produit."
        );
        setIsLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("nom", formData.nom);
      formDataToSend.append("objet", formData.objet || "");
      formDataToSend.append("description", formData.description || "");
      formDataToSend.append("prix", formData.prix.toString());
      formDataToSend.append("qteStock", formData.qteStock.toString());
      if (formData.delaiLivraison) formDataToSend.append("delaiLivraison", formData.delaiLivraison);
      if (formData.prixPromo) formDataToSend.append("prixPromo", formData.prixPromo.toString());
      if (formData.garantie) formDataToSend.append("garantie", formData.garantie);

      if (formData.categorie)
        formDataToSend.append("categorieId", formData.categorie.id);
      if (formData.genre) formDataToSend.append("genreId", formData.genre.id);
      formData.couleurs.forEach((color) =>
        formDataToSend.append("couleurs", color.id)
      );
      formData.tailles.forEach((size) =>
        formDataToSend.append("tailles", size.id)
      );
      formDataToSend.append("images", mainImage);
      additionalImages.forEach((img) => formDataToSend.append("images", img));

      const result = await fetchDataFromAPI<ProductFromAPI>("/api/products", {
        method: "POST",
        body: formDataToSend,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Produit ajouté avec succès");
        onSubmit();
        setFormData(initialFormData);
        setMainImage(null);
        setAdditionalImages([]);
      }
    }
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white p-6 sm:p-8 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto border border-gray-200/50">
        {/* Header */}
        <div className="relative mb-6">
          <button
            onClick={() => {
              setFormData(initialFormData);
              setMainImage(null);
              setAdditionalImages([]);
              onClose();
            }}
            className="absolute top-0 right-0 text-gray-600 hover:text-gray-800 transition-colors duration-200 text-lg font-bold"
          >
            ✕
          </button>
          <h2
            className={`text-2xl sm:text-3xl font-extrabold text-gray-900 ${montserrat.className}`}
          >
            {editingProduct ? "Modifier le produit" : "Ajouter un produit"}
          </h2>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* General Information Section */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Package className="h-5 w-5 text-gray-600" /> Informations
              générales
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FileText className="h-4 w-4" /> Nom
                </label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) =>
                    setFormData({ ...formData, nom: e.target.value })
                  }
                  className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FileText className="h-4 w-4" /> Objet
                </label>
                <input
                  type="text"
                  value={formData.objet || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, objet: e.target.value })
                  }
                  className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black transition-all duration-200"
                />
              </div>
              <div className="sm:col-span-2" data-color-mode="light">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FileText className="h-4 w-4" /> Description
                </label>
                <MDEditor
                  value={formData.description || ""}
                  onChange={(value) => {
                    if (
                      (value || "").length <= MAX_PRODUCT_DESCRIPTION_LENGTH
                    ) {
                      setFormData({ ...formData, description: value || "" });
                    }
                  }}
                  className="mt-1 border rounded-lg shadow-sm"
                  style={{ minHeight: "150px" }}
                  preview="edit"
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {formData.description?.length || 0} /{" "}
                  {MAX_PRODUCT_DESCRIPTION_LENGTH} caractères
                </div>
              </div>
            </div>
          </div>

          {/* Pricing and Stock Section */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-gray-600" /> Prix et stock
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <DollarSign className="h-4 w-4" /> Prix (FCFA)
                </label>
                <input
                  type="number"
                  value={formData.prix}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      prix: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black transition-all duration-200"
                  min="0"
                  step="1"
                  required
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <DollarSign className="h-4 w-4" /> Prix Promo (FCFA) <span className="text-xs text-gray-500 font-normal">(Optionnel)</span>
                </label>
                <input
                  type="number"
                  value={formData.prixPromo || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      prixPromo: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                  className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black transition-all duration-200"
                  min="0"
                  step="1"
                  placeholder="Ex: 13000"
                />
                {formData.prix > 0 && formData.prixPromo && (
                  <p className="text-xs text-green-600 mt-1 font-medium">
                    Réduction : {Math.round(((formData.prix - formData.prixPromo) / formData.prix) * 100)}%
                  </p>
                )}
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Box className="h-4 w-4" /> Quantité en stock
                </label>
                <input
                  type="number"
                  value={formData.qteStock}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      qteStock: parseInt(e.target.value) || 0,
                    })
                  }
                  className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black transition-all duration-200"
                  min="0"
                  required
                />
              </div>
            </div>
          </div>

          {/* Delivery & Warranty Section */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Package className="h-5 w-5 text-gray-600" /> Livraison et Garantie
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Package className="h-4 w-4" /> Délai de livraison
                </label>
                <select
                  value={formData.delaiLivraison || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, delaiLivraison: e.target.value })
                  }
                  className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black transition-all duration-200"
                >
                  <option value="">Sélectionner un délai</option>
                  {DELIVERY_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                  <option value="Autre">Autre (préciser dans description)</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FileText className="h-4 w-4" /> Garantie
                </label>
                <select
                  value={formData.garantie || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, garantie: e.target.value })
                  }
                  className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black transition-all duration-200"
                >
                  <option value="">Sélectionner une garantie</option>
                  {WARRANTY_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Attributes Section */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Folder className="h-5 w-5 text-gray-600" /> Attributs
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Folder className="h-4 w-4" /> Catégorie
                </label>
                <select
                  value={formData.categorie?.id || ""}
                  onChange={(e) => {
                    const selectedCategory = categories.find(
                      (c) => c.id === e.target.value
                    );
                    setFormData({
                      ...formData,
                      categorie: selectedCategory || null,
                    });
                  }}
                  className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black transition-all duration-200"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nom}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <User className="h-4 w-4" /> Genre
                </label>
                <select
                  value={formData.genre?.id || ""}
                  onChange={(e) => {
                    const selectedGender = genders.find(
                      (g) => g.id === e.target.value
                    );
                    setFormData({ ...formData, genre: selectedGender || null });
                  }}
                  className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black transition-all duration-200"
                >
                  <option value="">Sélectionner un genre</option>
                  {genders.map((gen) => (
                    <option key={gen.id} value={gen.id}>
                      {gen.nom}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Palette className="h-4 w-4" /> Couleurs
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {formData.couleurs.length > 0
                        ? `${formData.couleurs.length} couleur(s) sélectionnée(s)`
                        : "Sélectionner les couleurs"}
                      <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[300px] h-[300px] overflow-y-auto">
                    <DropdownMenuLabel>Couleurs disponibles</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {colors.map((color) => (
                      <DropdownMenuCheckboxItem
                        key={color.id}
                        checked={formData.couleurs.some((c) => c.id === color.id)}
                        onCheckedChange={(checked) => {
                          const newCouleurs = checked
                            ? [...formData.couleurs, color]
                            : formData.couleurs.filter((c) => c.id !== color.id);
                          setFormData({ ...formData, couleurs: newCouleurs });
                        }}
                      >
                        <div className="flex items-center gap-2 w-full">
                          <span
                            className="w-4 h-4 rounded-full border border-gray-200"
                            style={{ backgroundColor: color.code }}
                          />
                          {color.nom}
                        </div>
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Ruler className="h-4 w-4" /> Tailles
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {formData.tailles.length > 0
                        ? `${formData.tailles.length} taille(s) sélectionnée(s)`
                        : "Sélectionner les tailles"}
                      <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[300px] h-[300px] overflow-y-auto">
                    <DropdownMenuLabel>Tailles disponibles</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {sizes.map((size) => (
                      <DropdownMenuCheckboxItem
                        key={size.id}
                        checked={formData.tailles.some((t) => t.id === size.id)}
                        onCheckedChange={(checked) => {
                          const newTailles = checked
                            ? [...formData.tailles, size]
                            : formData.tailles.filter((t) => t.id !== size.id);
                          setFormData({ ...formData, tailles: newTailles });
                        }}
                      >
                        {size.nom}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Images Section */}
          {!editingProduct && (
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-gray-600" /> Images
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <ImageIcon className="h-4 w-4" /> Image principale (requise)
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => handleFileChange(e, true)}
                    className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black transition-all duration-200"
                    required
                  />
                  {mainImage && (
                    <p className="mt-1 text-sm text-gray-600 truncate">
                      {mainImage.name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <ImageIcon className="h-4 w-4" /> Images supplémentaires
                    (max 2)
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => handleFileChange(e, false)}
                    className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black transition-all duration-200"
                    multiple
                  />
                  {additionalImages.length > 0 && (
                    <div className="mt-1 text-sm text-gray-600">
                      {additionalImages.map((img, index) => (
                        <p key={index} className="truncate">
                          {img.name}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-center gap-4">
            <button
              type="submit"
              className="bg-gradient-to-r from-gray-800 to-black text-white px-8 py-3 rounded-lg font-semibold hover:from-gray-900 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading
                ? "Enregistrement..."
                : editingProduct
                  ? "Mettre à jour"
                  : "Ajouter"}
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData(initialFormData);
                setMainImage(null);
                setAdditionalImages([]);
                onClose();
              }}
              className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300 shadow-md"
            >
              Annuler
            </button>
          </div>
        </form>

        <style jsx>{`
          @media (prefers-reduced-motion: reduce) {
            .animate-fade-in,
            .animate-slide-in,
            [data-animate] {
              animation: none !important;
              transition: none !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
};
