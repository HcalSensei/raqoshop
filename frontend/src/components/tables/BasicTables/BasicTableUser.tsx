import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface UsersItem {
  id: number;
  image: string;
  name: string;
  zone: string;
  delivered: number;
  inProgress: number;
  status?: "Actif" | "En cours de validation" | "Annulée";
}

export interface roleI{
    id_role : string,
    libelle : string,
    description : string,
    statutRole?:  "Actif" | "En cours de validation" | "Annulée"
}

export default function BasicTableUser() {
    const [users, setUsers] = useState<UsersItem[]>([])
    const [roles, setRoles] = useState<roleI[]>([])
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"ALL" | UsersItem["status"]>("ALL");
    const [modalOpen, setModalOpen] = useState(false);
    const [newRoleItem, setNewRoleItem] = useState<Partial<roleI>>({
        libelle: "",
        description: "",
        statutRole: "Actif",
    })

    return (
        <div className="space-y-4">
            {/* Bouton ajouter */}
            <div className="flex justify-end">
                <button
                    onClick={() => setModalOpen(true)}
                    className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                >
                    Ajouter un rôle
                </button>
            </div>


            {/* Modal ajouter produit */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
                        <h3 className="mb-4 text-lg font-semibold">Ajouter un produit</h3>
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Produit"
                                className="w-full rounded-lg border px-3 py-2"
                                //value={newItem.product}
                                //onChange={(e) => setNewItem({ ...newItem, product: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Catégorie"
                                className="w-full rounded-lg border px-3 py-2"
                                //value={newItem.category}
                                //onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Quantité"
                                className="w-full rounded-lg border px-3 py-2"
                                // value={newItem.quantity}
                                // onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                            />
                            <input
                                type="text"
                                placeholder="Fournisseur"
                                className="w-full rounded-lg border px-3 py-2"
                                // value={newItem.supplier}
                                // onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                            />
                            <select
                                className="w-full rounded-lg border px-3 py-2"
                                // value={newItem.status}
                                // onChange={(e) => setNewItem({ ...newItem, status: e.target.value as StockItem["status"] })}
                            >
                                <option value="In Stock">En stock</option>
                                <option value="Low">Stock faible</option>
                                <option value="Out">Rupture</option>
                            </select>
                        </div>
                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                                // onClick={handleAddItem}
                            >
                                Ajouter
                            </button>
                            <button
                                className="rounded-lg bg-gray-800 px-4 py-2 text-white"
                                onClick={() => setModalOpen(false)}
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}