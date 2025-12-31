import { useMemo, useState, useEffect } from "react";
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

// --- Données Statiques ---
const DRIVERS = ["Moussa Koné", "Sékou Touré", "Alain Koffi", "Yao Kouassi"];
const PRODUCT_CATALOG = [
  { id: 1, name: "Ciment CPJ 45", prix: 5000 },
  { id: 2, name: "Fer à béton 12mm", prix: 4500 },
  { id: 3, name: "Peinture Satinée 20L", prix: 25000 },
  { id: 4, name: "Briques de 15", prix: 450 },
  { id: 5, name: "Sable de lagune", prix: 85000 },
  { id: 6, name: "Gravier 15/25", prix: 18000 },
];

// --- Interfaces ---
interface OrderItem { product: string; quantity: number; prix: string; }
interface Order {
  id: number; reference: string; client: string; date: string; total: string;
  status: "Pending" | "Delivered"; type: "Livraison" | "Retrait Magasin";
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

// --- Styles PDF ---
const pdfStyles = StyleSheet.create({
  page: { padding: 30, fontSize: 10 },
  header: { marginBottom: 20, borderBottomWidth: 1, paddingBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  cell: { flex: 1 },
  total: { marginTop: 20, textAlign: "right", fontSize: 14, fontWeight: "bold" }
});

const OrderPDF = ({ order }: { order: Order }) => (
  <Document>
    <Page style={pdfStyles.page}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>BON DE COMMANDE - {order.reference}</Text>
      <View style={{ marginBottom: 20 }}>
        <Text>Client: {order.client}</Text>
        <Text>Type: {order.type} {order.type === "Livraison" && `| Livreur: ${order.driver}`}</Text>
        <Text>Lieu: {order.location}</Text>
      </View>
      <View style={{ borderBottomWidth: 1, flexDirection: "row", paddingBottom: 5, marginBottom: 5 }}>
        <Text style={{ flex: 2 }}>Produit</Text>
        <Text style={{ flex: 1 }}>Qté</Text>
        <Text style={{ flex: 1, textAlign: "right" }}>Total</Text>
      </View>
      {order.items.map((item, i) => (
        <View key={i} style={{ flexDirection: "row", marginBottom: 3 }}>
          <Text style={{ flex: 2 }}>{item.product}</Text>
          <Text style={{ flex: 1 }}>{item.quantity}</Text>
          <Text style={{ flex: 1, textAlign: "right" }}>{item.prix}</Text>
        </View>
      ))}
      <Text style={pdfStyles.total}>Total: {order.total}</Text>
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
    id_client: "", type: "Livraison" as "Livraison" | "Retrait Magasin",
    driver: "", location: "", items: [] as OrderItem[], prix: 0
  });

  const calculateTotal = () => newOrder.items.reduce((acc, i) => acc + (i.quantity * Number(i.prix)), 0);

  const toggleProduct = (p: any) => {
    const exists = newOrder.items.find(i => i.product === p.nom);
    if (exists) {
      setNewOrder({ ...newOrder, items: newOrder.items.filter(i => i.product !== p.nom) });
    } else {
      setNewOrder({ ...newOrder, items: [...newOrder.items, { product: p.nom, quantity: 1, prix: String(p.prix) }] });
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

  const handleSaveOrder = () => {
    const order: Order = {
      id: Date.now(), reference: `CMD-${Math.floor(1000 + Math.random() * 9000)}`,
      client: newOrder.id_client, type: newOrder.type, date: new Date().toLocaleDateString(),
      total: `${calculateTotal()} CFA`, status: "Pending",
      driver: newOrder.type === "Livraison" ? newOrder.driver : "N/A",
      location: newOrder.type === "Livraison" ? newOrder.location : "En magasin",
      items: newOrder.items.map(i => ({ ...i, prix: `${i.prix} CFA` }))
    };
    setOrders([order, ...orders]);
    setIsAddModalOpen(false);
    setNewOrder({ id_client: "", type: "Livraison", driver: "", location: "", items: [], prix: 0 });
  };

  let filteredArticles: any[] = articles.filter((item) => {
    const matchSearch = item.nom.toLowerCase().includes(searchArticle.toLowerCase());
    return matchSearch;
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const [response, responseClient, responseRoles] = await Promise.all([
          fetch(`${baseUrl}catalog`),
          fetch(`${baseUrl}get-client`),
          fetch(`${baseUrl}roles`)
        ]);

        const dataRoles = await responseRoles.json();
        const dataClient = await responseClient.json();
        const data = await response.json();

        console.log(dataRoles);
        console.log(dataClient);
        console.log(data);

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
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* Barre d'actions */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-stroke">
        <input type="text" placeholder="Rechercher..." className="w-64 p-2 border rounded-lg outline-none focus:border-primary" onChange={(e) => setSearch(e.target.value)} />
        <Button onClick={() => setIsAddModalOpen(true)}>+ Nouvelle Commande</Button>
      </div>

      {/* Tableau Principal */}
      <div className="bg-white rounded-xl shadow-sm border border-stroke overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableCell isHeader>Réf</TableCell>
              <TableCell isHeader>Client</TableCell>
              <TableCell isHeader>Type</TableCell>
              <TableCell isHeader>Livreur</TableCell>
              <TableCell isHeader className="text-right">Total</TableCell>
              <TableCell isHeader>Action</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.filter(o => o.client.toLowerCase().includes(search.toLowerCase())).map(o => (
              <TableRow key={o.id}>
                <TableCell className="font-bold text-primary">{o.reference}</TableCell>
                <TableCell>{o.client}</TableCell>
                <TableCell><Badge color={o.type === "Livraison" ? "info" : "success"}>{o.type}</Badge></TableCell>
                <TableCell className="text-sm italic">{o.driver}</TableCell>
                <TableCell className="text-right font-bold">{o.total}</TableCell>
                <TableCell><button onClick={() => setSelectedOrder(o)} className="text-primary hover:underline">Détails</button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
                      console.log(newOrder);

                    } else {
                      // If no exact match (yet), we don't set the ID.
                      // But if the user clears it, we definitely clear the ID.
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
                <select className="w-full p-2 border rounded-lg" value={newOrder.type} onChange={e => setNewOrder({ ...newOrder, type: e.target.value as any })}>
                  <option value="Livraison">Livraison</option>
                  <option value="Retrait Magasin">Retrait Magasin</option>
                </select>
              </div>

              {/* Gestion Livreur Dynamique */}
              {newOrder.type === "Livraison" && (
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">CHOISIR LIVREUR</label>
                  <select className="w-full p-2 border rounded-lg text-primary font-medium" onChange={e => setNewOrder({ ...newOrder, driver: e.target.value })}>
                    <option value="">-- Sélectionner --</option>
                    {DRIVERS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              )}
            </div>

            {newOrder.type === "Livraison" && (
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
                    const isSelected = newOrder.items.some(i => i.product === p.id_article);
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
                      <td className="p-3 font-medium">{item.product}</td>
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
              <p><strong>Service:</strong> {selectedOrder.type}</p>
              <p><strong>Livreur:</strong> {selectedOrder.driver}</p>
              <p><strong>Lieu:</strong> {selectedOrder.location}</p>
            </div>
            <div className="space-y-1 mb-6">
              {selectedOrder.items.map((it, i) => (
                <div key={i} className="flex justify-between text-sm italic">
                  <span>{it.product} x{it.quantity}</span>
                  <span>{it.prix}</span>
                </div>
              ))}
              <p className="text-right font-bold text-lg pt-2 border-t text-primary">Total: {selectedOrder.total}</p>
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
                {roles.map((role) => (
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