import { useState, useEffect } from "react";
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  PDFDownloadLink 
} from "@react-pdf/renderer";
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

// --- Interfaces ---
interface StockItem {
  id_article: string;
  id_fournisseurs?: string;
  reference: string;
  codeBar: string;
  nom: string;
  prix: number;
  stock: any[]; 
  statutArticle: "En vente" | "Non vendable";
}

export interface AddStockI {
  id_stock: string;
  id_article: string;
  quantite: number;
  lieu_entreposer: string;
  statutStock: string;
}

interface NewStockItem extends StockItem {
  updating: boolean;
}

export interface errorTI {
  isError: boolean;
  message: string;
}

// --- Styles pour le PDF ---
const pdfStyles = StyleSheet.create({
  page: { padding: 30, fontSize: 10, fontFamily: 'Helvetica' },
  header: { marginBottom: 20, borderBottom: 1, paddingBottom: 10 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  date: { fontSize: 8, color: '#6b7280', marginTop: 4 },
  table: { display: "flex", width: "auto", marginTop: 15 },
  tableRow: { flexDirection: "row", borderBottomColor: '#E5E7EB', borderBottomWidth: 1, minHeight: 25, alignItems: 'center' },
  tableColHeader: { width: "20%", backgroundColor: '#F9FAFB', padding: 5 },
  tableCol: { width: "20%", padding: 5 },
  tableCellHeader: { fontWeight: 'bold', color: '#374151', fontSize: 9 },
  tableCell: { color: '#4B5563' }
});


const StockPDFDocument = ({ data, suppliers }: { data: StockItem[], suppliers: supplierI[] }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <View style={pdfStyles.header}>
        <Text style={pdfStyles.title}>Rapport d'Inventaire Stock</Text>
        <Text style={pdfStyles.date}>Généré le {new Date().toLocaleDateString()} à {new Date().toLocaleTimeString()}</Text>
      </View>
      
      <View style={pdfStyles.table}>
        <View style={[pdfStyles.tableRow, { backgroundColor: '#F9FAFB' }]}>
          <View style={pdfStyles.tableColHeader}><Text style={pdfStyles.tableCellHeader}>Produit</Text></View>
          <View style={pdfStyles.tableColHeader}><Text style={pdfStyles.tableCellHeader}>Référence</Text></View>
          <View style={pdfStyles.tableColHeader}><Text style={pdfStyles.tableCellHeader}>Fournisseur</Text></View>
          <View style={pdfStyles.tableColHeader}><Text style={pdfStyles.tableCellHeader}>Prix</Text></View>
          <View style={pdfStyles.tableColHeader}><Text style={pdfStyles.tableCellHeader}>Statut</Text></View>
        </View>

        {data.map((item, index) => (
          <View key={index} style={pdfStyles.tableRow}>
            <View style={pdfStyles.tableCol}><Text style={pdfStyles.tableCell}>{item.nom}</Text></View>
            <View style={pdfStyles.tableCol}><Text style={pdfStyles.tableCell}>{item.reference}</Text></View>
            <View style={pdfStyles.tableCol}>
              <Text style={pdfStyles.tableCell}>
                {suppliers.find(s => s.id_fournisseurs === item.id_fournisseurs)?.nom_fournisseurs || "N/A"}
              </Text>
            </View>
            <View style={pdfStyles.tableCol}><Text style={pdfStyles.tableCell}>{item.prix} FCFA</Text></View>
            <View style={pdfStyles.tableCol}><Text style={pdfStyles.tableCell}>{item.statutArticle}</Text></View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

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

  // Filtrage des données
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

        if (data.data) setSuppliers(data.data);
        if (dataStock.data) setStock(dataStock.data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };
    fetchSuppliers();
  }, []);

  // --- Handlers (Gardés tels quels) ---
  const handleAddStockItem = async (e: any) => {
    e.preventDefault();
    if (!newItem.nom || !newItem.reference || !newItem.codeBar) return;
    try {
        const newStockItemData = {
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
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newStockItemData),
        });
        const data = await response.json();
        setStock((prev) => [...prev, data.data]);
        setError({ isError: !!data.error, message: data.message });
        setNewItem({ nom: "", id_fournisseurs: "", reference: "", codeBar: "", prix: 0, statutArticle: "En vente" });
        setModalOpen(false);
    } catch (error) { console.error(error); }
  };

  const handleAddQtyStock = async (e: any) => {
    e.preventDefault();
    if (!stockAdd.id_article || !stockAdd.quantite || !stockAdd.lieu_entreposer) return;
    try {
      const response = await fetch(`${baseUrl}add-stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...stockAdd, statutStock: "Disponible" }),
      });
      const data = await response.json();
      setError({ isError: !!data.error, message: data.message });
      setModalStockOpen(false);
    } catch (error) { console.error(error); }
  };

  const CancelShowModal = () => { setModalOpen(false); setSupplierSearch(""); };
  const showAddStockModal = (id_article: string) => {
    const art = stock.find(i => i.id_article === id_article);
    if (art) {
        setNewItem({ ...art, updating: false });
        setStockAdd({ id_article });
    }
    setModalStockOpen(true);
  };
  const CancelAddStockModal = () => {
    setStockAdd({ id_article: "" });
    setNewItem({ nom: "", id_fournisseurs: "", reference: "", codeBar: "", prix: 0, statutArticle: "En vente", updating: false });
    setSupplierSearch("");
    setModalStockOpen(false);
  }
  return (
    <div className="space-y-4">
      {/* Barre d'outils supérieure */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-3 items-center">
            <input
                type="text"
                placeholder="Rechercher un produit..."
                className="w-64 rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-white/[0.03] dark:border-white/[0.05]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            
            {/* BOUTON PDF DOWNLOAD LINK */}
            <PDFDownloadLink
                document={<StockPDFDocument data={filteredStock} suppliers={suppliers} />}
                fileName={`Stock_${new Date().toLocaleDateString()}.pdf`}
                className="inline-flex items-center justify-center rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
            >
                {({ loading }) => (loading ? "Calcul..." : "Télécharger PDF")}
            </PDFDownloadLink>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="rounded-lg bg-green-600 px-4 py-2 text-white text-sm font-medium hover:bg-green-700 transition-all"
        >
          Entrée en stock
        </button>
      </div>

      <div className="flex gap-3">
        <select
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-white/[0.03] dark:border-white/[0.05]"
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
        >
          <option value="ALL">Tous les statuts</option>
          <option value="En vente">En vente</option>
          <option value="Non vendable">Non vendable</option>
        </select>
      </div>

      {getApiMessage(error.isError, error.message)}

      {/* TABLEAU AVEC STYLE TAILADMIN */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Produit</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Référence</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">CodeBar</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Fournisseur</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Prix</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Statut</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {filteredStock.map((item) => (
                <TableRow key={item.id_article}>
                  <TableCell className="px-5 py-4 text-start font-medium text-gray-800 dark:text-white/90">{item.nom}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start">{item.reference}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start">{item.codeBar}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start">
                    {suppliers.find(s => s.id_fournisseurs === item.id_fournisseurs)?.nom_fournisseurs || "N/A"}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start">{item.prix}</TableCell>
                  <TableCell className="px-5 py-4">
                    <Badge color={item.statutArticle === "En vente" ? "success" : "warning"}>
                      {item.statutArticle}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Button size="sm" variant="primary" onClick={() => showAddStockModal(item.id_article)}>
                        Stock +
                      </Button>
                      <button className="text-gray-500 hover:text-brand-500 transition-colors">
                        <BoxIcon className="size-5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredStock.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="px-5 py-8 text-center text-sm text-gray-500">Aucun produit en stock</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
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