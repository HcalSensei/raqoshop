import { useMemo, useState, useEffect, use } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { baseUrl } from '../../functionGeneral';

export interface roleI {
    id_role: string | undefined,
    libelle: string,
    description: string,
    statutRole?: "Actif" | "En cours de validation" | "Annulée"
}

export interface roleEditI extends roleI {
    updating: boolean
}

export default function BasicTableRole() {
    const [roles, setRoles] = useState<roleI[]>([])
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [newRoleItem, setNewRoleItem] = useState<Partial<roleEditI>>({
        libelle: "",
        description: "",
        statutRole: "Actif",
        updating: false
    })

    const handleAddRoleItem = async (e: any) => {
        e.preventDefault();
        if (!newRoleItem.libelle || !newRoleItem.description) return;
        let newRole

        try {
            if (newRoleItem.updating) {
                console.log("updating...");
                newRole = {
                    id_role: newRoleItem.id_role,
                    libelle: newRoleItem.libelle,
                    description: newRoleItem.description,
                    statutRole: newRoleItem.statutRole,
                };
                const createrole = await fetch(`${baseUrl}update-roles/${newRoleItem.id_role}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newRole),
                });
                setModalOpen(false);
                window.location.reload()
            }
            else {
                console.log("creating...");
                newRole = {
                    id_role: newRoleItem.id_role,
                    libelle: newRoleItem.libelle,
                    description: newRoleItem.description,
                    statutRole: newRoleItem.statutRole,
                };
                const updateRole = await fetch(`${baseUrl}create-roles`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newRole),
                });
                setModalOpen(false);
                window.location.reload()
            }
        } catch (error) {
            alert('Error registering/Updateting role: role may already exist.');
            console.error('Error registering module:', error);
        }

        // setRoles([...roles, newRole]);
        setNewRoleItem({
            id_role: "",
            libelle: "",
            description: "",
            statutRole: "Actif",
        });
    };

    const showEditRoleItem = (id_role: string | undefined) => {
        const roleToEdit = roles.find((role) => role.id_role === id_role);
        setNewRoleItem({
            id_role: roleToEdit?.id_role,
            libelle: roleToEdit?.libelle,
            description: roleToEdit?.description,
            statutRole: roleToEdit?.statutRole,
            updating: true
        });
        setModalOpen(true);

    }

    const showCancelRoleItem = () => {
        setNewRoleItem({
            id_role: "",
            libelle: "",
            description: "",
            statutRole: "Actif",
        });
        setModalOpen(false);
    }

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetch(`${baseUrl}roles`);
                let data = await response.json();
                // console.log(data);
                setRoles(data.data)

            } catch (err: any) {
                setError(err);
                console.error(error);
            }
        }

        fetchRoles();
    }, [baseUrl]);

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

            {/* Tableau */}
            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                            <TableCell isHeader className="px-5 py-3 text-start text-xs font-medium text-gray-500">#</TableCell>
                            <TableCell isHeader className="px-5 py-3 text-start text-xs font-medium text-gray-500">Libellé</TableCell>
                            <TableCell isHeader className="px-5 py-3 text-start text-xs font-medium text-gray-500">Description</TableCell>
                            <TableCell isHeader className="px-5 py-3 text-start text-xs font-medium text-gray-500">Statut</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {roles.map((item, index) => (
                            <TableRow key={item.libelle}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{item.libelle}</TableCell>
                                <TableCell>{item.description}</TableCell>
                                <TableCell>{item.statutRole}</TableCell>
                                <TableCell><button
                                    className="rounded-sm bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700"
                                    onClick={() => showEditRoleItem(item.id_role)}
                                >
                                    Editer
                                </button>
                                </TableCell>
                                <TableCell><button
                                    className="rounded-sm bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                                >
                                    Désactiver
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
                                placeholder="libelle"
                                className="w-full rounded-lg border px-3 py-2"
                                value={newRoleItem.libelle}
                                onChange={(e) => setNewRoleItem({ ...newRoleItem, libelle: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="description"
                                className="w-full rounded-lg border px-3 py-2"
                                value={newRoleItem.description}
                                onChange={(e) => setNewRoleItem({ ...newRoleItem, description: e.target.value })}
                            />
                            <select
                                className="w-full rounded-lg border px-3 py-2"
                                value={newRoleItem.statutRole}
                                onChange={(e) => setNewRoleItem({ ...newRoleItem, statutRole: e.target.value as roleI["statutRole"] })}
                            >
                                <option value="Actif">Actif</option>
                                <option value="En cours de constitution">En cours de constitution</option>
                                <option value="Annulée">Annulée</option>
                            </select>
                        </div>
                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                                onClick={handleAddRoleItem}
                            >
                                Ajouter
                            </button>
                            <button
                                className="rounded-lg bg-gray-800 px-4 py-2 text-white"
                                onClick={showCancelRoleItem}
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