import React, { useState, useEffect, useMemo } from "react";
import { baseUrl } from '../../functionGeneral';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import QRCode from "react-qr-code";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import Button from "../../ui/button/Button";
import logo from "/images/logo/logo.png";
import { Image } from "@react-pdf/renderer";
import { 
  EyeIcon, 
  PencilSquareIcon, 
  CheckCircleIcon 
} from "@heroicons/react/24/outline";

// --- Constantes ---
const DRIVERS = ["Moussa Koné", "Sékou Touré", "Alain Koffi", "Yao Kouassi"];
const ITEMS_PER_PAGE = 5;

// --- Interfaces ---
interface OrderItem { id_article: string; nom: string; quantity: number; prix: string; }
interface Order {
  id: number; reference: string; client: string; date_commande: string; montant_total: string;
  status: "En cours" | "Livré"; type_commande: "Livraison" | "Retrait Magasin";
  driver: string; location: string; items: OrderItem[];
}
interface Client { id_client: string; nom: string; email: string; telephone: string; roleid: string; statutUser: 'Actif' | 'Inactif'; updating: boolean; }
interface roleI { id_role: string; libelle: string; description: string; }

// --- Style pour le PDF ---
const pdfStyles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 110, 
    paddingHorizontal: 30,
    fontSize: 11,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  logo: {
    width: 232,
    height: 76,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
  },

  infoBlock: {
    marginBottom: 15,
  },

  table: {
    borderWidth: 1,
    borderColor: "#000",
  },

  tableRow: {
    flexDirection: "row",
  },

  tableHeader: {
    backgroundColor: "#eee",
    borderBottomWidth: 1,
  },

  cellProduct: {
    flex: 2,
    padding: 5,
    borderRightWidth: 1,
  },

  cellQty: {
    flex: 1,
    padding: 5,
    borderRightWidth: 1,
    textAlign: "center",
  },

  cellTotal: {
    flex: 1,
    padding: 5,
    textAlign: "right",
  },

  total: {
    marginTop: 10,
    textAlign: "right",
    fontSize: 14,
    fontWeight: "bold",
  },

  /* ELEMENTS FIXÉ */
  mentions: {
    position: "absolute",
    bottom: 55,
    left: 30,
    right: 200,
    fontSize: 9,
    lineHeight: 1.4,
  },

  stampBox: {
    position: "absolute",
    bottom: 55,
    right: 30,
    width: 150,
    height: 80,
    borderWidth: 1,
    padding: 5,
    textAlign: "center",
    fontSize: 9,
  },

  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    fontSize: 9,
    textAlign: "center",
    borderTopWidth: 1,
    paddingTop: 5,
  },
});

// --- VISUEL PDF---
const OrderPDF = ({ order }: { order: Order }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>

      {/* HEADER */}
      <View style={pdfStyles.header}>
        <Image style={pdfStyles.logo} src={logo}  />
        <Text style={pdfStyles.title}>
          BON DE COMMANDE - {order.reference}
        </Text>
      </View>

      {/* INFOS */}
      <View style={pdfStyles.infoBlock}>
        <Text>Client : {order.client}</Text>
        <Text>
          Type : {order.type_commande}
          {order.type_commande === "Livraison" && ` | Livreur : ${order.driver}`}
        </Text>
        <Text>Lieu : {order.location}</Text>
      </View>

      {/* TABLE */}
      <View style={pdfStyles.table}>
        <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
          <Text style={pdfStyles.cellProduct}>Produit</Text>
          <Text style={pdfStyles.cellQty}>Qté</Text>
          <Text style={pdfStyles.cellTotal}>Total</Text>
        </View>

        {order.items.map((item, i) => (
          <View key={i} style={pdfStyles.tableRow}>
            <Text style={pdfStyles.cellProduct}>{item.nom}</Text>
            <Text style={pdfStyles.cellQty}>{item.quantity}</Text>
            <Text style={pdfStyles.cellTotal}>{item.prix}</Text>
          </View>
        ))}
      </View>

      {/* TOTAL */}
      <Text style={pdfStyles.total}>Total : {order.montant_total}</Text>

      {/* MENTIONS */}
      <View style={pdfStyles.mentions} fixed>
        <Text>
          • Garantie valable 3 jours après la date de livraison.
        </Text>
        <Text>
          • Toute réclamation doit être formulée dans ce délai.
        </Text>
        <Text>
          • Les marchandises vendues ne sont ni reprises ni échangées après validation.
        </Text>
        <Text>
          • Le présent document tient lieu de bon de livraison et de facture proforma.
        </Text>
      </View>

      {/* CACHET & SIGNATURE */}
      
        <View style={pdfStyles.stampBox} fixed>
          <Text>Cachet de l'entreprise</Text>
        </View>

      {/* FOOTER FIXE */}
      <Text
      
        style={pdfStyles.footer}
        fixed
        render={({ pageNumber, totalPages }) =>
          `Page ${pageNumber} / ${totalPages} — Document généré le ${new Date().toLocaleDateString()}`
        }
      />

    </Page>
  </Document>
);


export default function BaseTableOrder() {
  // --- États ---
  const [orders, setOrders] = useState<Order[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [roles, setRoles] = useState<roleI[]>([]);
  
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [modalClientOpen, setModalClientOpen] = useState(false);
  
  const [searchArticle, setSearchArticle] = useState("");
  const [clientSearch, setClientSearch] = useState("");
  const [newUserItem, setNewUserItem] = useState<Partial<Client>>({ nom: "", email: "", telephone: "", roleid: "", statutUser: "Actif" });
  
  const [newOrder, setNewOrder] = useState({
    id_client: "", type_commande: "Livraison" as "Livraison" | "Retrait Magasin",
    driver: "", location: "", items: [] as OrderItem[]
  });

  // --- Chargement des données ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resOrders, resCatalog, resClients, resRoles] = await Promise.all([
          fetch(`${baseUrl}orders`),
          fetch(`${baseUrl}catalog`),
          fetch(`${baseUrl}get-client`),
          fetch(`${baseUrl}roles`)
        ]);
        const dOrders = await resOrders.json();
        const dCatalog = await resCatalog.json();
        const dClients = await resClients.json();
        const dRoles = await resRoles.json();

        setOrders(dOrders.data || []);
        setArticles(dCatalog.data || []);
        setClients(dClients.data || []);
        setRoles(dRoles.data || []);
      } catch (error) {
        console.error("Erreur de chargement:", error);
      }
    };
    fetchData();
  }, []);

 
  const filteredOrders = useMemo(() => {
    return orders.filter(o => 
      o.client.toLowerCase().includes(search.toLowerCase()) || 
      o.reference.toLowerCase().includes(search.toLowerCase())
    );
  }, [orders, search]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  
  const calculateTotal = () => newOrder.items.reduce((acc, i) => acc + (i.quantity * Number(i.prix)), 0);

  const toggleProduct = (p: any) => {
    const exists = newOrder.items.find(i => i.id_article === p.id_article);
    if (exists) {
      setNewOrder({ ...newOrder, items: newOrder.items.filter(i => i.id_article !== p.id_article) });
    } else {
      setNewOrder({ ...newOrder, items: [...newOrder.items, { id_article: p.id_article, nom: p.nom, quantity: 1, prix: String(p.prix) }] });
    }
  };

  const handleSaveOrder = async () => {
    const clientObj = clients.find(c => c.id_client === newOrder.id_client);
    const order: Order = {
      id: Date.now(),
      reference: `CMD-${Math.floor(1000 + Math.random() * 9000)}`,
      client: clientObj ? clientObj.nom : "Client Inconnu",
      type_commande: newOrder.type_commande,
      date_commande: new Date().toLocaleDateString(),
      montant_total: `${calculateTotal()} CFA`,
      status: "En cours",
      driver: newOrder.type_commande === "Livraison" ? newOrder.driver : "N/A",
      location: newOrder.type_commande === "Livraison" ? newOrder.location : "En magasin",
      items: newOrder.items.map(i => ({ ...i, prix: `${i.prix} CFA` }))
    };

    try {
      await fetch(`${baseUrl}add-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
      setOrders([order, ...orders]);
      setIsAddModalOpen(false);
      setNewOrder({ id_client: "", type_commande: "Livraison", driver: "", location: "", items: [] });
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddClient = async () => {
    try {
      const res = await fetch(`${baseUrl}resgiter-client`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserItem),
      });
      const data = await res.json();
      if (!data.error) {
        setModalClientOpen(false);
        // Optionnel : Re-fetch clients ici
      }
    } catch (error) { console.error(error); }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* barre d'outils */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-stroke">
        <input 
          type="text" 
          placeholder="Rechercher client ou référence..." 
          className="w-64 p-2 border rounded-lg outline-none focus:border-primary" 
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} 
        />
        <Button onClick={() => setIsAddModalOpen(true)}>+ Nouvelle Commande</Button>
      </div>

      {/* Tableau principal */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Référence
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Client
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Type
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Livreur
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Total
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-end text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {paginatedOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors">
                  <TableCell className="px-5 py-4 text-start">
                    <span className="block font-medium text-gray-800 dark:text-white/90">
                      {order.reference}
                    </span>
                  </TableCell>
                  
                  <TableCell className="px-5 py-4 text-start text-sm text-gray-500 dark:text-gray-400">
                    {order.client}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-start">
                    <Badge color={order.type_commande === "Livraison" ? "info" : "success"}>
                      {order.type_commande}
                    </Badge>
                  </TableCell>

                  <TableCell className="px-5 py-4 text-start text-sm text-gray-500 dark:text-gray-400">
                    {order.driver || "—"}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-start font-medium text-gray-800 dark:text-white/90">
                    {order.montant_total}
                  </TableCell>

                  <TableCell className="px-5 py-4">
                    <div className="flex items-center justify-end gap-3">
                      {/* VOIR / DETAILS */}
                      <button
                        className="text-gray-500 hover:text-brand-500 transition-colors"
                        title="Voir les détails"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>

                      {/* MODIFIER */}
                      <button
                        className="text-gray-500 hover:text-amber-500 transition-colors"
                        title="Modifier la commande"
                        onClick={() => {
                          // Logique pour ouvrir le modal de modification
                          console.log("Modifier", order.id);
                        }}
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>

                      {/* FINALISER */}
                      <button
                        className="text-gray-500 hover:text-green-600 transition-colors"
                        title="Finaliser la commande"
                        onClick={() => {
                          // Logique pour changer le statut à "Livré"
                          console.log("Finaliser", order.id);
                        }}
                      >
                        <CheckCircleIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {paginatedOrders.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    Aucune commande trouvée
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination intégrée au conteneur */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 dark:border-white/[0.05]">
            <p className="text-theme-xs text-gray-500 dark:text-gray-400">
              Page {currentPage} sur {totalPages}
            </p>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="text-theme-xs"
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(p => p - 1)}
              >
                Précédent
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-theme-xs"
                disabled={currentPage === totalPages} 
                onClick={() => setCurrentPage(p => p + 1)}
              >
                Suivant
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Ajout Commande */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Nouvelle Commande</h2>
              <Button variant="outline" size="sm" onClick={() => { setIsAddModalOpen(false); setModalClientOpen(true); }}>+ Créer Client</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">CLIENT</label>
                <select 
                  className="w-full rounded-lg border px-3 py-2" 
                  value={newOrder.id_client} 
                  onChange={(e) => setNewOrder({ ...newOrder, id_client: e.target.value })}
                >
                  <option value="">Sélectionner...</option>
                  {clients.map(c => <option key={c.id_client} value={c.id_client}>{c.nom}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">SERVICE</label>
                <select className="w-full p-2 border rounded-lg" value={newOrder.type_commande} onChange={e => setNewOrder({ ...newOrder, type_commande: e.target.value as any })}>
                  <option value="Livraison">Livraison</option>
                  <option value="Retrait Magasin">Retrait Magasin</option>
                </select>
              </div>
              {newOrder.type_commande === "Livraison" && (
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">LIVREUR</label>
                  <select className="w-full p-2 border rounded-lg" onChange={e => setNewOrder({ ...newOrder, driver: e.target.value })}>
                    <option value="">-- Sélectionner --</option>
                    {DRIVERS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              )}
            </div>

            {/* Catalogue & Sélection Produits */}
            <div className="border rounded-xl mb-6">
              <div className="bg-gray-50 p-3 flex justify-between items-center">
                <span className="font-bold text-sm">Articles</span>
                <Button size="sm" onClick={() => setIsCatalogOpen(!isCatalogOpen)}>{isCatalogOpen ? "Fermer" : "+ Catalogue"}</Button>
              </div>
              {isCatalogOpen && (
                <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-2 bg-blue-50/30 border-b max-h-40 overflow-y-auto">
                  {articles.filter(a => a.nom.toLowerCase().includes(searchArticle.toLowerCase())).map(p => (
                    <div key={p.id_article} onClick={() => toggleProduct(p)} className={`p-2 border rounded cursor-pointer text-sm ${newOrder.items.some(i => i.id_article === p.id_article) ? 'bg-primary text-white' : 'bg-white'}`}>
                      {p.nom}
                    </div>
                  ))}
                </div>
              )}
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr><th className="p-2 text-left">Nom</th><th className="p-2 w-20">Qté</th><th className="p-2 text-right">Prix</th></tr>
                </thead>
                <tbody>
                  {newOrder.items.map((item, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-2">{item.nom}</td>
                      <td className="p-2">
                        <input type="number" className="w-full border rounded p-1" value={item.quantity} onChange={e => {
                          const updated = [...newOrder.items];
                          updated[idx].quantity = Number(e.target.value);
                          setNewOrder({ ...newOrder, items: updated });
                        }} />
                      </td>
                      <td className="p-2 text-right">{(item.quantity * Number(item.prix)).toLocaleString()} CFA</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-xl font-bold">Total: <span className="text-primary">{calculateTotal().toLocaleString()} CFA</span></div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Annuler</Button>
                <Button onClick={handleSaveOrder} disabled={!newOrder.id_client || newOrder.items.length === 0}>Enregistrer</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Détails & QR Code */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">{selectedOrder.reference}</h2>
              <QRCode value={selectedOrder.reference} size={50} />
            </div>
            <div className="space-y-2 text-sm border-t pt-4">
              <p><strong>Client:</strong> {selectedOrder.client}</p>
              <p><strong>Service:</strong> {selectedOrder.type_commande}</p>
              <p><strong>Livreur:</strong> {selectedOrder.driver}</p>
            </div>
            <div className="my-4 border-t pt-4 max-h-40 overflow-y-auto">
              {selectedOrder.items.map((it, i) => (
                <div key={i} className="flex justify-between text-sm italic py-1">
                  <span>{it.nom} x{it.quantity}</span>
                  <span>{it.prix}</span>
                </div>
              ))}
            </div>
            <p className="text-right font-bold text-lg border-t pt-2 text-primary">Total: {selectedOrder.montant_total}</p>
            <div className="flex gap-2 mt-6">
              <PDFDownloadLink document={<OrderPDF order={selectedOrder} />} fileName={`CMD_${selectedOrder.reference}.pdf`} className="flex-1">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Exporter PDF</Button>
              </PDFDownloadLink>
              <Button variant="outline" onClick={() => setSelectedOrder(null)}>Fermer</Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nouveau Client */}
      {modalClientOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Nouveau Client</h3>
            <div className="space-y-3">
              <input placeholder="Nom" className="w-full border p-2 rounded" onChange={e => setNewUserItem({...newUserItem, nom: e.target.value})} />
              <input placeholder="Email" className="w-full border p-2 rounded" onChange={e => setNewUserItem({...newUserItem, email: e.target.value})} />
              <input placeholder="Téléphone" className="w-full border p-2 rounded" onChange={e => setNewUserItem({...newUserItem, telephone: e.target.value})} />
              <select className="w-full border p-2 rounded" onChange={e => setNewUserItem({...newUserItem, roleid: e.target.value})}>
                <option value="">Rôle</option>
                {roles.map(r => <option key={r.id_role} value={r.id_role}>{r.libelle}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button onClick={handleAddClient}>Créer</Button>
              <Button variant="outline" onClick={() => setModalClientOpen(false)}>Annuler</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}