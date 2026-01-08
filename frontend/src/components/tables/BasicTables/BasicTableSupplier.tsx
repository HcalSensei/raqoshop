import { useState, useEffect } from "react";
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  PDFDownloadLink, 
  Image
} from "@react-pdf/renderer";
import logo from "/images/logo/logo.png";
import { 
  PencilSquareIcon, 
  TrashIcon, 
  PlusIcon,
  ArrowDownTrayIcon 
} from "@heroicons/react/24/outline";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { baseUrl, getApiMessage } from '../../functionGeneral';
import Badge from "../../ui/badge/Badge";

// --- Interfaces ---
export interface supplierI {
  id_fournisseurs: string;
  nom_fournisseurs: string;
  contact_fournisseurs: string;
  mail_fournisseurs: string;
  statutFournisseurs?: string;
  createdAt: string;
  modifyAt: string;
}

export interface supplierEditI extends supplierI {
  updating: boolean;
}

export interface errorTI {
  isError: boolean;
  message: string;
}

// --- Styles PDF ---
const pdfStyles = StyleSheet.create({
  page: { padding: 30, fontSize: 10 },
  title: { fontSize: 16, marginBottom: 20, fontWeight: 'bold' },
  date: { fontSize: 8, color: '#6b7280', marginTop: 4 },
  table: { display: "flex", width: "auto", marginTop: 15 },
  tableRow: { flexDirection: "row", borderBottomColor: '#E5E7EB', borderBottomWidth: 1, minHeight: 25, alignItems: 'center' },
  header: { backgroundColor: '#F9FAFB', fontWeight: 'bold' },
  col: { width: "25%" },
  logo: { width: 232, height: 76,},
  footer: { position: "absolute", bottom: 20, left: 30, right: 30, fontSize: 9, textAlign: "center", borderTopWidth: 1, paddingTop: 5,},
});

const SupplierPDF = ({ data }: { data: supplierI[] }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
        <Image style={pdfStyles.logo} src={logo}  />
        <Text style={pdfStyles.title}>Liste des Fournisseurs</Text>
      <View style={[pdfStyles.tableRow, pdfStyles.header]}>
        <Text style={pdfStyles.col}>Fournisseurs</Text>
        <Text style={pdfStyles.col}>Contact</Text>
        <Text style={pdfStyles.col}>Email</Text>
        <Text style={pdfStyles.col}>Statut</Text>
      </View>
      {data.map((s, i) => (
        <View key={i} style={pdfStyles.tableRow}>
          <Text style={pdfStyles.col}>{s.nom_fournisseurs}</Text>
          <Text style={pdfStyles.col}>{s.contact_fournisseurs}</Text>
          <Text style={pdfStyles.col}>{s.mail_fournisseurs}</Text>
          <Text style={pdfStyles.col}>{s.statutFournisseurs}</Text>
        </View>
      ))}
      <Text
      style={pdfStyles.footer}
      fixed
      render={({ pageNumber, totalPages }) =>
        `Page ${pageNumber} / ${totalPages}`
      }
     
    />
    </Page>
  </Document>
);

export default function BasicTableSupplier() {
  const [suppliers, setSuppliers] = useState<supplierI[]>([]);
  const [error, setError] = useState<errorTI>({ isError: false, message: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [newSupplierItem, setNewSupplierItem] = useState<Partial<supplierEditI>>({
    nom_fournisseurs: "",
    contact_fournisseurs: "",
    mail_fournisseurs: "",
    statutFournisseurs: "Actif",
    updating: false,
  });

  // --- Actions ---
  const showEditSupplierItem = (id: string | undefined) => {
    const s = suppliers.find((sup) => sup.id_fournisseurs === id);
    if (s) {
      setNewSupplierItem({ ...s, updating: true });
      setModalOpen(true);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await fetch(`${baseUrl}fournisseurs`);
      const data = await response.json();
      setSuppliers(data.data || []);
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => { fetchSuppliers(); }, []);

  const handleAddSupplierItem = async (e: any) => {
    e.preventDefault();
    const endpoint = newSupplierItem.updating 
        ? `update-fournisseur/${newSupplierItem.id_fournisseurs}` 
        : `add-fournisseur`;

    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSupplierItem),
      });
      const data = await response.json();
      setError({ isError: !!data.error, message: data.message });
      if (!data.error) {
        setModalOpen(false);
        fetchSuppliers();
      }
    } catch (error) {
      alert('Erreur lors de l\'enregistrement');
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
          Gestion Fournisseurs
        </h3>
        <div className="flex gap-3">
          <PDFDownloadLink
            document={<SupplierPDF data={suppliers} />}
            fileName="liste_fournisseurs.pdf"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-white/[0.1] dark:bg-white/[0.03] dark:text-white"
          >
            <ArrowDownTrayIcon className="size-4" />
            PDF
          </PDFDownloadLink>
          <button
            onClick={() => {
              setNewSupplierItem({ nom_fournisseurs: "", contact_fournisseurs: "", mail_fournisseurs: "", statutFournisseurs: "Actif", updating: false });
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            <PlusIcon className="size-4" />
            Ajouter
          </button>
        </div>
      </div>

      {getApiMessage(error.isError, error.message)}

      {/* Tableau TailAdmin Style */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">#</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Fournisseur</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Contact</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Email</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Statut</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400">Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {suppliers.map((supplier, index) => (
                <TableRow key={supplier.id_fournisseurs || index}>
                  <TableCell className="px-5 py-4 text-start text-sm text-gray-600 dark:text-gray-400">
                    {index + 1}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <span className="block font-medium text-gray-800 dark:text-white/90">
                      {supplier.nom_fournisseurs}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <span className="block text-sm text-gray-800 dark:text-white/90">{supplier.contact_fournisseurs}</span>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <span className="block text-xs text-gray-800 dark:text-white/90">{supplier.mail_fournisseurs}</span>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <Badge color={supplier.statutFournisseurs === "Actif" ? "success" : "warning"}>
                      {supplier.statutFournisseurs}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <div className="flex justify-center gap-3">
                      <button 
                        onClick={() => showEditSupplierItem(supplier.id_fournisseurs)}
                        className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <PencilSquareIcon className="size-5" />
                      </button>
                      <button className="text-gray-500 hover:text-red-600 dark:hover:text-red-400">
                        <TrashIcon className="size-5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal - Style TailAdmin */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900 border border-gray-200 dark:border-white/[0.1]">
            <h3 className="mb-5 text-lg font-bold text-gray-800 dark:text-white">
              {newSupplierItem.updating ? "Modifier le fournisseur" : "Ajouter un fournisseur"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Nom complet</label>
                <input
                  type="text"
                  value={newSupplierItem.nom_fournisseurs}
                  onChange={(e) => setNewSupplierItem({ ...newSupplierItem, nom_fournisseurs: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-white/[0.1] dark:bg-white/[0.03]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Contact</label>
                    <input
                    type="text"
                    value={newSupplierItem.contact_fournisseurs}
                    onChange={(e) => setNewSupplierItem({ ...newSupplierItem, contact_fournisseurs: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-white/[0.1] dark:bg-white/[0.03]"
                    />
                </div>
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Statut</label>
                    <select
                        value={newSupplierItem.statutFournisseurs}
                        onChange={(e) => setNewSupplierItem({ ...newSupplierItem, statutFournisseurs: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-white/[0.1] dark:bg-white/[0.03]"
                    >
                        <option value="Actif">Actif</option>
                        <option value="En cours de validation">En cours</option>
                        <option value="Annulée">Annulée</option>
                    </select>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Email</label>
                <input
                  type="email"
                  value={newSupplierItem.mail_fournisseurs}
                  onChange={(e) => setNewSupplierItem({ ...newSupplierItem, mail_fournisseurs: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-white/[0.1] dark:bg-white/[0.03]"
                />
              </div>
            </div>
            <div className="mt-7 flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-white/[0.1] dark:text-white"
              >
                Annuler
              </button>
              <button
                onClick={handleAddSupplierItem}
                className="rounded-lg bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                {newSupplierItem.updating ? "Mettre à jour" : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}