import { useState, useEffect } from "react";
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
import { EyeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
// --- Données Statiques ---
const DRIVERS = ["Moussa Koné", "Sékou Touré", "Alain Koffi", "Yao Kouassi"];

// --- Interfaces ---
interface OrderItem { id_article: string; nom: string; quantity: number; prix: string; }
interface Order {
  id: number; reference: string; client: string; date_commande: string; montant_total: string;
  status: "En cours" | "Livré"; type_commande: "Livraison" | "Retrait Magasin";
  driver: string; location: string; items: OrderItem[];
}

interface Client {
  id_client: string,
  nom: string,
  email: string,
  telephone: string,
  roleid: string,
  statutUser: 'Actif' | 'Inactif',
  updating: boolean
}

export interface roleI {
  id_role: string,
  libelle: string,
  description: string,
  statutRole?: "Actif" | "En cours de validation" | "Annulée"
}


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
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [articles, setArticles] = useState<any[]>([]);
  const [searchArticle, setSearchArticle] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [clientSearch, setClientSearch] = useState("");
  const [roles, setRoles] = useState<roleI[]>([]);
  const [modalClientOpen, setModalClientOpen] = useState(false);
  const [error, setError] = useState(null);
  const [newUserItem, setNewUserItem] = useState<Partial<Client>>({
    nom: ""
    , email: ""
    , telephone: ""
    , roleid: ""
    , statutUser: "Actif"
    , updating: false
  });

  const [newOrder, setNewOrder] = useState({
    id_client: "", type_commande: "Livraison" as "Livraison" | "Retrait Magasin",
    driver: "", location: "", items: [] as OrderItem[], prix: 0
  });

  const calculateTotal = () => newOrder.items.reduce((acc, i) => acc + (i.quantity * Number(i.prix)), 0);

  const toggleProduct = (p: any) => {
    const exists = newOrder.items.find(i => i.nom === p.nom);
    if (exists) {
      setNewOrder({ ...newOrder, items: newOrder.items.filter(i => i.nom !== p.nom) });
    } else {
      setNewOrder({ ...newOrder, items: [...newOrder.items, { id_article: p.id_article, nom: p.nom, quantity: 1, prix: String(p.prix) }] });
    }
  };

  const handleAddUserItem = async (e: any) => {
    e.preventDefault();
    if (!newUserItem.nom || !newUserItem.roleid || !newUserItem.email || !newUserItem.telephone) return;
    let newUser: any

    try {
      console.log("registering...");
      newUser = {
        nom: newUserItem.nom!,
        roleid: newUserItem.roleid!,
        email: newUserItem.email!,
        telephone: newUserItem.telephone!,
        statutUser: newUserItem.statutUser,
      };
      const createUser = await fetch(`${baseUrl}resgiter-client`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      setModalClientOpen(false);
      let dataCreateUsers = await createUser.json()
      if (dataCreateUsers.error) {
        setError(dataCreateUsers.message);
        console.log(dataCreateUsers);
      }

      // window.location.reload()

    } catch (error) {
      alert('Error registering/Updateting role: role may already exist.');
      console.error('Error registering module:', error);
    }

  }

  const handleSaveOrder = async () => {
    const order: Order = {
      id: Date.now(), reference: `CMD-${Math.floor(1000 + Math.random() * 9000)}`,
      client: newOrder.id_client, type_commande: newOrder.type_commande, date_commande: new Date().toLocaleDateString(),
      montant_total: `${calculateTotal()} CFA`, status: "En cours",
      driver: newOrder.type_commande === "Livraison" ? newOrder.driver : "N/A",
      location: newOrder.type_commande === "Livraison" ? newOrder.location : "En magasin",
      items: newOrder.items.map(i => ({ ...i, prix: `${i.prix} CFA` }))
    };
    setOrders([order, ...orders]);
    try {
      const createOrder = await fetch(`${baseUrl}add-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });
      let dataCreateOrder = await createOrder.json()
      setError(dataCreateOrder.message);
      console.log(dataCreateOrder);
    } catch (error) {
      alert('Error registering/Updateting role: role may already exist.');
      console.error('Error registering module:', error);
    }

    setIsAddModalOpen(false);
    setNewOrder({ id_client: "", type_commande: "Livraison", driver: "", location: "", items: [], prix: 0 });
  };


// Fonction pour mettre à jour le statut de la commande 
const handleFinalize = (orderId: number) => {
 
};

  let filteredArticles: any[] = articles.filter((item) => {
    const matchSearch = item.nom.toLowerCase().includes(searchArticle.toLowerCase());
    return matchSearch;
  });

  let filteredRoles: any[] = roles.filter((item) => {
    const matchSearch = item.libelle.toLowerCase().includes('client');
    return matchSearch;
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const [responseOrders, response, responseClient, responseRoles] = await Promise.all([
          fetch(`${baseUrl}orders`),
          fetch(`${baseUrl}catalog`),
          fetch(`${baseUrl}get-client`),
          fetch(`${baseUrl}roles`)
        ]);

        const dataOrders = await responseOrders.json();
        const dataRoles = await responseRoles.json();
        const dataClient = await responseClient.json();
        const data = await response.json();

        setOrders(dataOrders.data);
        setArticles(data.data);
        setClients(dataClient.data);
        setRoles(dataRoles.data);

      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="p-4 md:p-6 space-y-6 min-h-screen">

      {/* Barre d'actions */}
      
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Gestion des Commandes</h2>
        <div className="flex gap-3">
            <input
            type="text"
            placeholder="Rechercher une commande..."
            className="w-64 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            />
            <button
            onClick={() => setIsAddModalOpen(true)}
            className="rounded-lg bg-brand-500 px-4 py-2 text-white text-sm font-medium hover:bg-brand-600 transition-colors">
            + Nouvelle commande
            </button>
            <button
            onClick={() => downloadOrderList()}
            className="rounded-lg bg-brand-500 px-4 py-2 text-white text-sm font-medium hover:bg-brand-600 transition-colors">
              <ArrowDownTrayIcon className="h-6 w-6 text-white-500" />
            </button>
        </div>
      </div>

      {/* Tableau Principal */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
            <TableRow className="bg-gray-50">
              <TableCell isHeader className="px-5 py-3 text-center text-theme-xs font-bold uppercase text-gray-500">Réference</TableCell>
              <TableCell isHeader className="px-5 py-3 text-center text-theme-xs font-bold uppercase text-gray-500">Client</TableCell>
              <TableCell isHeader className="px-5 py-3 text-center text-theme-xs font-bold uppercase text-gray-500">Type</TableCell>
              <TableCell isHeader className="px-5 py-3 text-center text-theme-xs font-bold uppercase text-gray-500">Livreur</TableCell>
              <TableCell isHeader className="px-5 py-3 text-center text-theme-xs font-bold uppercase text-gray-500">Total</TableCell>
              <TableCell isHeader className="px-5 py-3 text-center text-theme-xs font-bold uppercase text-gray-500">Action</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {orders.filter(o => o.client.toLowerCase().includes(search.toLowerCase())).map(o => (
              <TableRow key={o.id}>
                <TableCell className="font-bold text-primary">
                  <div className="flex justify-center text-sm"> {o.reference} </div>
                  </TableCell>
                <TableCell> <div className="flex justify-center text-sm"> {o.client} </div></TableCell>
                <TableCell> <div className="flex justify-center text-sm"> <Badge color={o.type_commande === "Livraison" ? "info" : "success"}>{o.type_commande}</Badge> </div></TableCell>
                <TableCell className="text-sm italic"> <div className="flex justify-center text-sm"> {o.driver} </div></TableCell>
                <TableCell className="text-right font-bold"> <div className="flex justify-center text-sm"> {o.montant_total} </div></TableCell>
                <TableCell>
                <td className="py-5 px-4">
                      <div className="flex items-center space-x-3.5">
                        {/* Bouton Détails */}
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="hover:text-primary"
                          title="Voir Détails"
                        >
                          <EyeIcon className="h-5 w-5" /> 
                        </button>

                        {/* Bouton Finaliser (uniquement si Pending) */}
                        
                          <button
                           
                            className="text-success hover:scale-110 transition-transform"
                            title="Finaliser la commande"
                          >
                           <CheckCircleIcon className="h-5 w-5" />
                          </button>
                      
                      </div>
                    </td>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>

      {/* MODAL AJOUT */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-boxdark w-full max-w-4xl rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6">Nouvelle Commande</h2>
            <div className="flex justify-end">
              <Button onClick={() => { setIsAddModalOpen(false); setModalClientOpen(true) }}>Créer client</Button>
            </div>

            {/* Section Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">CLIENT</label>
                <input
                  list="clients-list"
                  type="text"
                  placeholder="Choisissez un client..."
                  className="w-full rounded-lg border px-3 py-2"
                  value={clientSearch}
                  onChange={(e) => {
                    const val = e.target.value;
                    setClientSearch(val);
                    const client = clients.find(s => s.nom === val);
                    if (client) {
                      setNewOrder({ ...newOrder, id_client: client.id_client });
                    } else {
                      if (val === "" && newOrder.id_client) {
                        setNewOrder({ ...newOrder, id_client: "" });
                      }
                    }
                  }}
                />
                <datalist id="clients-list" className="w-full rounded-lg border px-3 py-2">
                  {clients.map((s) => (
                    <option key={s.id_client} value={s.nom} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">TYPE SERVICE</label>
                <select className="w-full p-2 border rounded-lg" value={newOrder.type_commande} onChange={e => setNewOrder({ ...newOrder, type_commande: e.target.value as any })}>
                  <option value="Livraison">Livraison</option>
                  <option value="Retrait Magasin">Retrait Magasin</option>
                </select>
              </div>

              {/* Gestion Livreur Dynamique */}
              {newOrder.type_commande === "Livraison" && (
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">CHOISIR LIVREUR</label>
                  <select className="w-full p-2 border rounded-lg text-primary font-medium" onChange={e => setNewOrder({ ...newOrder, driver: e.target.value })}>
                    <option value="">-- Sélectionner --</option>
                    {DRIVERS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              )}
            </div>

            {newOrder.type_commande === "Livraison" && (
              <div className="mb-6">
                <label className="text-xs font-bold text-gray-400 block mb-1">ADRESSE DE LIVRAISON</label>
                <input type="text" className="w-full p-2 border rounded-lg" placeholder="Ex: Cocody Angré, Rue L12" onChange={e => setNewOrder({ ...newOrder, location: e.target.value })} />
              </div>
            )}

            {/* Liste Articles Simplifiée */}
            <div className="border rounded-xl overflow-hidden mb-6">
              <div className="bg-gray-50 p-3 flex justify-between items-center border-b">
                <span className="font-bold text-sm text-gray-600">Articles Sélectionnés</span>
                <input type="text" placeholder="Rechercher..." className="w-64 p-2 border rounded-lg outline-none focus:border-primary" onChange={(e) => setSearchArticle(e.target.value)} />
                <Button variant="outline" size="sm" onClick={() => setIsCatalogOpen(!isCatalogOpen)}>
                  {isCatalogOpen ? "Valider la liste" : "+ Choisir Articles"}
                </Button>
              </div>

              {/* Le Catalogue (Selection rapide) */}
              {isCatalogOpen && (
                <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-2 bg-blue-50/30 border-b">
                  {filteredArticles.map(p => {
                    const isSelected = newOrder.items.some(i => i.id_article === p.id_article);
                    return (
                      <div key={p.id_article} onClick={() => toggleProduct(p)} className={`p-2 border rounded-lg cursor-pointer text-sm flex justify-between items-center transition-all ${isSelected ? 'bg-primary text-white' : 'bg-white hover:border-primary'}`}>
                        <span>{p.nom}</span>
                        {isSelected && <span>✓</span>}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tableau des articles choisis */}
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-3">Produit</th>
                    <th className="p-3 w-24">Quantité</th>
                    <th className="p-3 w-32">Prix (CFA)</th>
                    <th className="p-3 text-right">Sous-total</th>
                  </tr>
                </thead>
                <tbody>
                  {newOrder.items.map((item, idx) => (
                    <tr key={idx} className="border-b last:border-0">
                      <td className="p-3 font-medium">{item.nom}</td>
                      <td className="p-3">
                        <input type="number" className="w-full border rounded p-1" value={item.quantity} onChange={e => {
                          const updated = [...newOrder.items];
                          updated[idx].quantity = Number(e.target.value);
                          setNewOrder({ ...newOrder, items: updated });
                        }} />
                      </td>
                      <td className="p-3">
                        <input type="number" className="w-full border rounded p-1" value={item.prix} onChange={e => {
                          const updated = [...newOrder.items];
                          updated[idx].prix = e.target.value;
                          setNewOrder({ ...newOrder, items: updated });
                        }} />
                      </td>
                      <td className="p-3 text-right font-bold">{(item.quantity * Number(item.prix)).toLocaleString()} CFA</td>
                    </tr>
                  ))}
                  {newOrder.items.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-gray-400 italic">Aucun article sélectionné</td></tr>}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">Total: <span className="text-primary">{calculateTotal().toLocaleString()} CFA</span></div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Annuler</Button>
                <Button onClick={handleSaveOrder} disabled={!newOrder.id_client || newOrder.items.length === 0}>Enregistrer</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DÉTAILS */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">{selectedOrder.reference}</h2>
              <QRCode value={selectedOrder.reference} size={40} />
            </div>
            <div className="space-y-2 text-sm mb-6 border-y py-4">
              <p><strong>Client:</strong> {selectedOrder.client}</p>
              <p><strong>Service:</strong> {selectedOrder.type_commande}</p>
              <p><strong>Livreur:</strong> {selectedOrder.driver}</p>
              <p><strong>Lieu:</strong> {selectedOrder.location}</p>
            </div>
            <div className="space-y-1 mb-6">
              {selectedOrder.items.map((it, i) => (
                <div key={i} className="flex justify-between text-sm italic">
                  <span>{it.nom} x{it.quantity}</span>
                  <span>{it.prix}</span>
                </div>
              ))}
              <p className="text-right font-bold text-lg pt-2 border-t text-primary">Total: {selectedOrder.montant_total}</p>
            </div>
            <div className="flex gap-2">
              <PDFDownloadLink document={<OrderPDF order={selectedOrder} />} fileName={`CMD_${selectedOrder.reference}.pdf`} className="flex-1">
                <Button className="w-full bg-meta-3">Exporter PDF</Button>
              </PDFDownloadLink>
              <Button variant="outline" onClick={() => setSelectedOrder(null)}>Fermer</Button>
            </div>
          </div>
        </div>
      )}

      {modalClientOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
            <h3 className="mb-4 text-lg font-semibold">Ajouter un utilisateur</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nom et prénoms"
                className="w-full rounded-lg border px-3 py-2"
                value={newUserItem.nom}
                onChange={(e) => setNewUserItem({ ...newUserItem, nom: e.target.value })}
              />
              <>
                <input
                  type="text"
                  placeholder="Mail"
                  className="w-full rounded-lg border px-3 py-2"
                  value={newUserItem.email}
                  onChange={(e) => setNewUserItem({ ...newUserItem, email: e.target.value })}
                />
              </>
              <>
                <input
                  type="text"
                  placeholder="Téléphone"
                  className="w-full rounded-lg border px-3 py-2"
                  value={newUserItem.telephone}
                  onChange={(e) => setNewUserItem({ ...newUserItem, telephone: e.target.value })}
                />
              </>
              <select
                className="w-full rounded-lg border px-3 py-2"
                value={newUserItem.roleid}
                onChange={(e) => setNewUserItem({ ...newUserItem, roleid: e.target.value })}
              >
                <option value="">Selectionner un rôle</option>
                {filteredRoles.map((role) => (
                  <option key={role.libelle} value={role.id_role}>{role.libelle}</option>
                ))}
              </select>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                onClick={handleAddUserItem}
              >
                Ajouter
              </button>
              <button
                className="rounded-lg bg-gray-800 px-4 py-2 text-white"
                onClick={() => setModalClientOpen(false)}
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