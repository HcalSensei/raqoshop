import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { baseUrl, getApiMessage } from '../../functionGeneral';

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
    updating: boolean
}


export interface errorTI {
    isError: boolean,
    message: string
}
export default function BasicTableSupplier() {
    const [suppliers, setSuppliers] = useState<supplierI[]>([])
    const [error, setError] = useState<errorTI>({ isError: false, message: "" });
    const [modalOpen, setModalOpen] = useState(false);
    const [newSupplierItem, setNewSupplierItem] = useState<Partial<supplierEditI>>({
        nom_fournisseurs: "",
        contact_fournisseurs: "",
        mail_fournisseurs: "",
        statutFournisseurs: "Actif",
        updating: false
    });

    const showEditSupplierItem = (id_fournisseurs: string | undefined) => {
        const supplierToEdit = suppliers.find((supplier) => supplier.id_fournisseurs === id_fournisseurs);
        setNewSupplierItem({
            id_fournisseurs: supplierToEdit?.id_fournisseurs,
            nom_fournisseurs: supplierToEdit?.nom_fournisseurs,
            contact_fournisseurs: supplierToEdit?.contact_fournisseurs,
            mail_fournisseurs: supplierToEdit?.mail_fournisseurs,
            statutFournisseurs: supplierToEdit?.statutFournisseurs,
            updating: true
        });
        setModalOpen(true);
    }

    const showCancelSupplierItem = () => {
        setNewSupplierItem({
            id_fournisseurs: "",
            nom_fournisseurs: "",
            contact_fournisseurs: "",
            mail_fournisseurs: "",
            statutFournisseurs: "Actif",
        });
        setModalOpen(false);
    }

    const handleAddSupplierItem = async (e: any) => {
        e.preventDefault();
        if (!newSupplierItem.nom_fournisseurs || !newSupplierItem.contact_fournisseurs || !newSupplierItem.mail_fournisseurs) return;
        let newSupplier
        try {
            if (newSupplierItem.updating) {
                console.log("updating...");
                newSupplier = {
                    id_fournisseurs: newSupplierItem.id_fournisseurs,
                    nom_fournisseurs: newSupplierItem.nom_fournisseurs,
                    contact_fournisseurs: newSupplierItem.contact_fournisseurs,
                    mail_fournisseurs: newSupplierItem.mail_fournisseurs,
                    statutSupplier: newSupplierItem.statutFournisseurs,
                };
                const updateSupplier = await fetch(`${baseUrl}update-fournisseur/${newSupplierItem.id_fournisseurs}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newSupplier),
                });
                const data = await updateSupplier.json();
                if (data.error) {

                    setError({ isError: true, message: data.message });
                } else {
                    setError({ isError: false, message: data.message });
                }
                setModalOpen(false);
                window.location.reload()
            }
            else {
                console.log("creating...");

                newSupplier = {
                    id_fournisseurs: newSupplierItem.id_fournisseurs,
                    nom_fournisseurs: newSupplierItem.nom_fournisseurs,
                    contact_fournisseurs: newSupplierItem.contact_fournisseurs,
                    mail_fournisseurs: newSupplierItem.mail_fournisseurs,
                    statutFournisseurs: newSupplierItem.statutFournisseurs,
                };
                const createSupplier = await fetch(`${baseUrl}add-fournisseur`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newSupplier),
                });
                const data = await createSupplier.json();
                if (data.error) {

                    setError({ isError: true, message: data.message });
                } else {
                    setError({ isError: false, message: data.message });
                }

                setModalOpen(false);
                setNewSupplierItem({
                    nom_fournisseurs: "",
                    contact_fournisseurs: "",
                    mail_fournisseurs: "",
                    statutFournisseurs: "Actif",
                    updating: false
                })
                // window.location.reload()
            }
        } catch (error) {
            alert('Error registering/Updateting supplier: supplier may already exist.');
            console.error('Error registering supplier:', error);
        }

    }

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await fetch(`${baseUrl}fournisseurs`);
                let data = await response.json();
                console.log(data);
                setSuppliers(data.data)

            } catch (err: any) {
                setError(err);
                console.error(error);
            }
        }

        fetchSuppliers();
    }, [baseUrl]);

    return (
        <div className="space-y-4">
            {/* Bouton ajouter */}
            <div className="flex justify-end">
                <button
                    onClick={() => setModalOpen(true)}
                    className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                >
                    Ajouter un fournisseur
                </button>
            </div>

            {getApiMessage(error.isError, error.message)}

            {/* Tableau */}
            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                            <TableCell isHeader className="px-5 py-3 text-start text-xs font-medium text-gray-500">#</TableCell>
                            <TableCell isHeader className="px-5 py-3 text-start text-xs font-medium text-gray-500">Nom</TableCell>
                            <TableCell isHeader className="px-5 py-3 text-start text-xs font-medium text-gray-500">Contact</TableCell>
                            <TableCell isHeader className="px-5 py-3 text-start text-xs font-medium text-gray-500">Email</TableCell>
                            <TableCell isHeader className="px-5 py-3 text-start text-xs font-medium text-gray-500">Statut</TableCell>
                            <TableCell isHeader className="px-5 py-3 text-start text-xs font-medium text-gray-500">Actions</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {suppliers.map((supplier, index) => (
                            <TableRow key={index}>
                                <TableCell className="px-5 py-3 text-start text-xs font-medium text-gray-500">{index + 1}</TableCell>
                                <TableCell className="px-5 py-3 text-start text-xs font-medium text-gray-500">{supplier.nom_fournisseurs}</TableCell>
                                <TableCell className="px-5 py-3 text-start text-xs font-medium text-gray-500">{supplier.contact_fournisseurs}</TableCell>
                                <TableCell className="px-5 py-3 text-start text-xs font-medium text-gray-500">{supplier.mail_fournisseurs}</TableCell>
                                <TableCell className="px-5 py-3 text-start text-xs font-medium text-gray-500">{supplier.statutFournisseurs}</TableCell>
                                <TableCell className="px-5 py-3 text-start text-xs font-medium text-gray-500">
                                    <select
                                        className="rounded-lg border px-3 py-2 text-sm"
                                    >
                                        <option >
                                            <button
                                                onClick={() => showEditSupplierItem(supplier.id_fournisseurs)}
                                                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                                            >
                                                Modifier
                                            </button>
                                        </option>
                                        <option>
                                            <button
                                                onClick={() => showCancelSupplierItem()}
                                                className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                                            >
                                                Supprimer
                                            </button>
                                        </option>
                                    </select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/* Modal ajouter fournisseur */}
                {modalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                        <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
                            <h3 className="mb-4 text-lg font-semibold">Ajouter un fournisseur</h3>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="Nom"
                                    value={newSupplierItem.nom_fournisseurs}
                                    onChange={(e) => setNewSupplierItem({ ...newSupplierItem, nom_fournisseurs: e.target.value })}
                                    className="w-full rounded-lg border px-3 py-2 text-sm"
                                />
                                <input
                                    type="text"
                                    placeholder="Contact"
                                    value={newSupplierItem.contact_fournisseurs}
                                    onChange={(e) => setNewSupplierItem({ ...newSupplierItem, contact_fournisseurs: e.target.value })}
                                    className="w-full rounded-lg border px-3 py-2 text-sm"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={newSupplierItem.mail_fournisseurs}
                                    onChange={(e) => setNewSupplierItem({ ...newSupplierItem, mail_fournisseurs: e.target.value })}
                                    className="w-full rounded-lg border px-3 py-2 text-sm"
                                />
                                <select
                                    value={newSupplierItem.statutFournisseurs}
                                    onChange={(e) => setNewSupplierItem({ ...newSupplierItem, statutFournisseurs: e.target.value })}
                                    className="w-full rounded-lg border px-3 py-2 text-sm"
                                >
                                    <option value="Actif">Actif</option>
                                    <option value="En cours de validation">En cours de validation</option>
                                    <option value="Annulée">Annulée</option>
                                </select>
                            </div>
                            <div className="mt-6 flex justify-end gap-2">
                                <button
                                    className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                                    onClick={handleAddSupplierItem}
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
        </div>
    )
}
