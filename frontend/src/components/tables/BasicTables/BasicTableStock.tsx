import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Badge from "../../ui/badge/Badge";

interface StockItem {
  id: number;
  product: string;
  category: string;
  quantity: number;
  supplier: string;
  status: "In Stock" | "Low" | "Out";
}

const initialStock: StockItem[] = [
  {
    id: 1,
    product: "Laptop HP ProBook",
    category: "Informatique",
    quantity: 42,
    supplier: "TechSupplier",
    status: "In Stock",
  },
  {
    id: 2,
    product: "Imprimante Canon",
    category: "Bureautique",
    quantity: 6,
    supplier: "OfficePlus",
    status: "Low",
  },
];

export default function BaseTableStock() {
  const [stock, setStock] = useState<StockItem[]>(initialStock);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | StockItem["status"]>("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [newItem, setNewItem] = useState<Partial<StockItem>>({
    product: "",
    category: "",
    quantity: 0,
    supplier: "",
    status: "In Stock",
  });

  const filteredStock = stock.filter((item) => {
    const matchSearch = item.product
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchFilter = filter === "ALL" || item.status === filter;
    return matchSearch && matchFilter;
  });

  const deleteItem = (id: number) => {
    setStock((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddItem = () => {
    if (!newItem.product || !newItem.category || !newItem.supplier) return;

    const id = stock.length ? Math.max(...stock.map((i) => i.id)) + 1 : 1;
    setStock((prev) => [...prev, { ...newItem, id } as StockItem]);
    setNewItem({ product: "", category: "", quantity: 0, supplier: "", status: "In Stock" });
    setModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Bouton ajouter */}
      <div className="flex justify-end">
        <button
          onClick={() => setModalOpen(true)}
          className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          Entrée en stock
        </button>
      </div>

      {/* Filtres et recherche */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          className="w-1/3 rounded-lg border px-3 py-2 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="rounded-lg border px-3 py-2 text-sm"
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value as "ALL" | StockItem["status"])
          }
        >
          <option value="ALL">Tous</option>
          <option value="In Stock">En stock</option>
          <option value="Low">Stock faible</option>
          <option value="Out">Rupture</option>
        </select>
      </div>

      {/* Tableau */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 text-start text-xs font-medium text-gray-500">Produit</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-xs font-medium text-gray-500">Catégorie</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-xs font-medium text-gray-500">Quantité</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-xs font-medium text-gray-500">Fournisseur</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-xs font-medium text-gray-500">Statut</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-xs font-medium text-gray-500">Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {filteredStock.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="px-5 py-4 text-sm">{item.product}</TableCell>
                <TableCell className="px-5 py-4 text-sm">{item.category}</TableCell>
                <TableCell className="px-5 py-4 text-sm">{item.quantity}</TableCell>
                <TableCell className="px-5 py-4 text-sm">{item.supplier}</TableCell>
                <TableCell className="px-5 py-4">
                  <Badge
                    size="sm"
                    color={
                      item.status === "In Stock"
                        ? "success"
                        : item.status === "Low"
                        ? "warning"
                        : "error"
                    }
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-5 py-4">
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-sm font-medium text-red-600 hover:underline"
                  >
                    Supprimer
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
                value={newItem.product}
                onChange={(e) => setNewItem({ ...newItem, product: e.target.value })}
              />
              <input
                type="text"
                placeholder="Catégorie"
                className="w-full rounded-lg border px-3 py-2"
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              />
              <input
                type="number"
                placeholder="Quantité"
                className="w-full rounded-lg border px-3 py-2"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
              />
              <input
                type="text"
                placeholder="Fournisseur"
                className="w-full rounded-lg border px-3 py-2"
                value={newItem.supplier}
                onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
              />
              <select
                className="w-full rounded-lg border px-3 py-2"
                value={newItem.status}
                onChange={(e) => setNewItem({ ...newItem, status: e.target.value as StockItem["status"] })}
              >
                <option value="In Stock">En stock</option>
                <option value="Low">Stock faible</option>
                <option value="Out">Rupture</option>
              </select>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                onClick={handleAddItem}
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
