import { useState, useEffect } from "react";
import { baseUrl, getApiMessage } from '../../functionGeneral';
import { supplierI } from "./BasicTableSupplier";
import { BoxIcon } from "../../../icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import Button from "../../ui/button/Button";

interface StockItem {
  id_article: string;
  id_fournisseurs?: string;
  reference: string;
  codeBar: string;
  nom: string;
  prix: number;
  stock: StockItem[];
  statutArticle: "En vente" | "Non vendable",
}
export interface AddStockI {
  id_stock: string;
  id_article: string;
  quantite: number; // decimal in DB, number in TS
  lieu_entreposer: string;
  statutStock: string;
}

interface NewStockItem extends StockItem {
  updating: boolean;
}
export interface errorTI {
  isError: boolean,
  message: string
}

export default function BaseTableStock() {
  const [stock, setStock] = useState<StockItem[]>([]);
  const [stockAdd, setStockAdd] = useState<Partial<AddStockI>>({});
  const [suppliers, setSuppliers] = useState<supplierI[]>([]);
  const [supplierSearch, setSupplierSearch] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | StockItem["statutArticle"]>("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStockOpen, setModalStockOpen] = useState(false);
  const [error, setError] = useState<errorTI>({ isError: false, message: "" });
  const [newItem, setNewItem] = useState<Partial<NewStockItem>>({
    nom: "",
    id_fournisseurs: "",
    reference: "",
    codeBar: "",
    prix: 0,
    statutArticle: "En vente",
    updating: false,
  });

  let filteredStock: StockItem[] = stock.filter((item) => {
    const matchSearch = item.nom.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "ALL" || item.statutArticle === filter;
    return matchSearch && matchFilter;
  });

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch(`${baseUrl}fournisseurs`);
        const data = await response.json();
        const responseStock = await fetch(`${baseUrl}articles`);
        const dataStock = await responseStock.json();
        console.log(dataStock);

        setStock(dataStock.data);
        if (data.data) {
          setSuppliers(data.data);
        }

        if (dataStock.data) {
          setStock(dataStock.data);

        }
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };
    fetchSuppliers();
  }, []);

  const handleAddStockItem = async (e: any) => {
    e.preventDefault();
    if (!newItem.nom || !newItem.reference || !newItem.codeBar) return;
    let newStockItemData;
    try {
      if (newItem.updating) {

      } else {
        newStockItemData = {
          id_article: "",
          id_fournisseurs: newItem.id_fournisseurs,
          nom: newItem.nom,
          reference: newItem.reference,
          codeBar: newItem.codeBar,
          prix: newItem.prix,
          statutArticle: newItem.statutArticle,
        };

        const response = await fetch(`${baseUrl}add-article`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newStockItemData),
        });
        const data = await response.json();

        setStock((prev) => [...prev, data.data]);
        if (data.error) {
          setError({ isError: true, message: data.message });
        } else {
          setError({ isError: false, message: data.message });
        }
        setNewItem({ nom: "", id_fournisseurs: "", reference: "", codeBar: "", prix: 0, statutArticle: "En vente" });
        setSupplierSearch("");
        setModalOpen(false);
      }

    } catch (error) {
      alert('Error registering/Updateting role: role may already exist.');
      console.error('Error registering module:', error);
    }
  };

  const handleAddQtyStock = async (e: any) => {
    e.preventDefault();
    if (!stockAdd.id_article || !stockAdd.quantite || !stockAdd.lieu_entreposer) return;
    let qtyData = {
      id_article: stockAdd.id_article,
      quantite: stockAdd.quantite,
      lieu_entreposer: stockAdd.lieu_entreposer,
      statutStock: "Disponible",
    }
    try {
      const response = await fetch(`${baseUrl}add-stock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(qtyData),
      });
      const data = await response.json();
      if (data.error) {
        setError({ isError: true, message: data.message });
      } else {
        setError({ isError: false, message: data.message });
      }
      setStockAdd({ id_article: "", quantite: 0, lieu_entreposer: "", statutStock: "" });
      setModalStockOpen(false);
    } catch (error) {
      alert('Error registering/Updateting role: role may already exist.');
      console.error('Error registering module:', error);
    }

  }

  const CancelShowModal = () => {
    setNewItem({ nom: "", id_fournisseurs: "", reference: "", codeBar: "", prix: 0, statutArticle: "En vente" });
    setSupplierSearch("");
    setModalOpen(false);
  }


  const showAddStockModal = (id_article: string) => {
    const ArticleToStock = stock.find((item) => item.id_article === id_article);
    if (ArticleToStock) {
      setNewItem({
        nom: ArticleToStock.nom,
        id_fournisseurs: ArticleToStock.id_fournisseurs,
        reference: ArticleToStock.reference,
        codeBar: ArticleToStock.codeBar,
        prix: ArticleToStock.prix,
        statutArticle: ArticleToStock.statutArticle,
        updating: false,
      });
      setStockAdd({ id_article });
    }
    setModalStockOpen(true);
  }

  const CancelAddStockModal = () => {
    setStockAdd({ id_article: "" });
    setNewItem({ nom: "", id_fournisseurs: "", reference: "", codeBar: "", prix: 0, statutArticle: "En vente", updating: false });
    setSupplierSearch("");
    setModalStockOpen(false);
  }

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
            setFilter(e.target.value as "ALL" | StockItem["statutArticle"])
          }
        >
          <option value="ALL">Tous</option>
          <option value="En vente">En vente</option>
          <option value="Non vendable">Non vendable</option>
          <option value="Out">Rupture</option>
        </select>
      </div>

      {getApiMessage(error.isError, error.message)}
      {/* Tableau */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 text-start text-xs font-medium text-gray-500">Produit</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-xs font-medium text-gray-500">Référence</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-xs font-medium text-gray-500">CodeBar</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-xs font-medium text-gray-500">Fournisseur</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-xs font-medium text-gray-500">Prix</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-xs font-medium text-gray-500">Statut</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-xs font-medium text-gray-500">Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {filteredStock.map((item) => (
              <TableRow key={item.id_article}>
                <TableCell className="px-5 py-4 text-sm">{item.nom}</TableCell>
                <TableCell className="px-5 py-4 text-sm">{item.reference}</TableCell>
                <TableCell className="px-5 py-4 text-sm">{item.codeBar}</TableCell>
                <TableCell className="px-5 py-4 text-sm">{suppliers.find(s => s.id_fournisseurs === item.id_fournisseurs)?.nom_fournisseurs || "N/A"}</TableCell>
                <TableCell className="px-5 py-4 text-sm">{item.prix}</TableCell>
                <TableCell className="px-5 py-4">
                  <Badge
                    size="sm"
                    color={
                      item.statutArticle === "En vente"
                        ? "success"
                        : item.statutArticle === "Non vendable"
                          ? "warning"
                          : "error"
                    }
                  >
                    {item.statutArticle}
                  </Badge>
                </TableCell>
                <TableCell className="px-5 py-4">

                  <div className="flex items-center gap-5">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => showAddStockModal(item.id_article)}
                    >
                      Ajouter au stock
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      startIcon={<BoxIcon className="size-5" />}
                    >
                      Editer
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      startIcon={<BoxIcon className="size-5" />}
                    >
                      Editer
                    </Button>
                  </div>
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
                placeholder="Nom du produit"
                className="w-full rounded-lg border px-3 py-2"
                value={newItem.nom}
                onChange={(e) => setNewItem({ ...newItem, nom: e.target.value })}
              />
              <input
                type="text"
                placeholder="Référence"
                className="w-full rounded-lg border px-3 py-2"
                value={newItem.reference}
                onChange={(e) => setNewItem({ ...newItem, reference: e.target.value })}
              />
              <input
                type="text"
                placeholder="Code Barre"
                className="w-full rounded-lg border px-3 py-2"
                value={newItem.codeBar}
                onChange={(e) => setNewItem({ ...newItem, codeBar: e.target.value })}
              />
              <div>
                <input
                  list="suppliers-list"
                  type="text"
                  placeholder="Choisissez un fournisseur..."
                  className="w-full rounded-lg border px-3 py-2"
                  value={supplierSearch}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSupplierSearch(val);
                    const supplier = suppliers.find(s => s.nom_fournisseurs === val);
                    if (supplier) {
                      setNewItem({ ...newItem, id_fournisseurs: supplier.id_fournisseurs });
                    } else {
                      // If no exact match (yet), we don't set the ID.
                      // But if the user clears it, we definitely clear the ID.
                      if (val === "" && newItem.id_fournisseurs) {
                        setNewItem({ ...newItem, id_fournisseurs: "" });
                      }
                    }
                  }}
                />
                <datalist id="suppliers-list" className="w-full rounded-lg border px-3 py-2">
                  {suppliers.map((s) => (
                    <option key={s.id_fournisseurs} value={s.nom_fournisseurs} />
                  ))}
                </datalist>
              </div>
              <input
                type="number"
                placeholder="Prix"
                className="w-full rounded-lg border px-3 py-2"
                value={newItem.prix}
                onChange={(e) => setNewItem({ ...newItem, prix: Number(e.target.value) })}
              />
              <select
                className="w-full rounded-lg border px-3 py-2"
                value={newItem.statutArticle}
                onChange={(e) => setNewItem({ ...newItem, statutArticle: e.target.value as StockItem["statutArticle"] })}
              >
                <option value="In Stock">En stock</option>
                <option value="Low">Stock faible</option>
                <option value="Out">Rupture</option>
              </select>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                onClick={handleAddStockItem}
              >
                Ajouter
              </button>
              <button
                className="rounded-lg bg-gray-800 px-4 py-2 text-white"
                onClick={() => CancelShowModal()}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {modalStockOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
            <h3 className="mb-4 text-lg font-semibold">Ajouter un produit</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nom du produit"
                className="w-full rounded-lg border px-3 py-2"
                value={newItem.nom}
                onChange={(e) => setNewItem({ ...newItem, nom: e.target.value })}
                disabled={true}
              />
              <input
                type="number"
                placeholder="Quantité"
                className="w-full rounded-lg border px-3 py-2"
                value={stockAdd.quantite}
                onChange={(e) => setStockAdd({ ...stockAdd, quantite: Number(e.target.value) })}
              />
              <select
                className="w-full rounded-lg border px-3 py-2"
                value={stockAdd.lieu_entreposer}
                onChange={(e) => setStockAdd({ ...stockAdd, lieu_entreposer: e.target.value })}
              >
                <option >Lieu d'entreposage</option>
                <option value="Hors du magasin">Hors du magasin</option>
                <option value="Dans le magasin">Dans le magasin</option>
                <option value="Reserve">Reserve</option>
              </select>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                onClick={handleAddQtyStock}
              >
                Ajouter
              </button>
              <button
                className="rounded-lg bg-gray-800 px-4 py-2 text-white"
                onClick={() => CancelAddStockModal()}
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
