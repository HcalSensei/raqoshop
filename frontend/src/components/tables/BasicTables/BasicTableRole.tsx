import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";
import { 
    PencilSquareIcon, 
    TrashIcon, 
    PlusIcon, 
    ShieldCheckIcon 
} from "@heroicons/react/24/outline";
import { baseUrl, getApiMessage } from '../../functionGeneral';

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
    const [error, setError] = useState({ isError: false, message: "" });
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
        
        try {
            const endpoint = newRoleItem.updating ? `update-roles/${newRoleItem.id_role}` : `create-roles`;
            const response = await fetch(`${baseUrl}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRoleItem),
            });
            
            let data = await response.json();
            setModalOpen(false);
            setError({ isError: !!data.error, message: data.message });
            
            // Recharger les données après succès
            if (!data.error) fetchRoles();

        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await fetch(`${baseUrl}roles`);
            let data = await response.json();
            setRoles(data.data)
        } catch (err: any) {
            setError({ isError: true, message: "Erreur de connexion au serveur" });
        }
    }

    useEffect(() => {
        fetchRoles();
    }, [baseUrl]);

    const showEditRoleItem = (id_role: string | undefined) => {
        const roleToEdit = roles.find((role) => role.id_role === id_role);
        setNewRoleItem({ ...roleToEdit, updating: true });
        setModalOpen(true);
    }

    const showCancelRoleItem = () => {
        setNewRoleItem({ libelle: "", description: "", statutRole: "Actif", updating: false });
        setModalOpen(false);
    }

    return (
        <div className="space-y-5">
            {/* Header section */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Gestion des Rôles</h2>
                <button
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-all"
                >
                    <PlusIcon className="size-5" />
                    Ajouter un rôle
                </button>
            </div>

            {getApiMessage(error.isError, error.message)}

            {/* Tableau style TailAdmin */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell isHeader className="px-5 py-4 text-start text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">#</TableCell>
                                <TableCell isHeader className="px-5 py-4 text-start text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Libellé</TableCell>
                                <TableCell isHeader className="px-5 py-4 text-start text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Description</TableCell>
                                <TableCell isHeader className="px-5 py-4 text-start text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Statut</TableCell>
                                <TableCell isHeader className="px-5 py-4 text-end text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Actions</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {roles.map((item, index) => (
                                <TableRow key={item.id_role} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01]">
                                    <TableCell className="px-5 py-4 text-sm text-gray-500">{index + 1}</TableCell>
                                    <TableCell className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheckIcon className="size-4 text-brand-500" />
                                            <span className="text-sm font-medium text-gray-800 dark:text-white/90">{item.libelle}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{item.description}</TableCell>
                                    <TableCell className="px-5 py-4 text-sm">
                                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                                            item.statutRole === "Actif" 
                                            ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400" 
                                            : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                                        }`}>
                                            {item.statutRole}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-end">
                                        <div className="flex justify-end gap-3">
                                            <button 
                                                onClick={() => showEditRoleItem(item.id_role)}
                                                className="text-gray-500 hover:text-brand-500 transition-colors"
                                                title="Modifier"
                                            >
                                                <PencilSquareIcon className="size-5" />
                                            </button>
                                            <button 
                                                className="text-gray-500 hover:text-red-500 transition-colors"
                                                title="Désactiver"
                                            >
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

            {/* Modal style TailAdmin */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-900 border border-gray-200 dark:border-white/[0.1]">
                        <h3 className="mb-6 text-xl font-bold text-gray-800 dark:text-white">
                            {newRoleItem.updating ? "Modifier le rôle" : "Créer un nouveau rôle"}
                        </h3>
                        <form onSubmit={handleAddRoleItem} className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">Libellé</label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-white/[0.1] dark:bg-white/[0.03] dark:text-white"
                                    value={newRoleItem.libelle}
                                    onChange={(e) => setNewRoleItem({ ...newRoleItem, libelle: e.target.value })}
                                    placeholder="ex: Administrateur"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">Description</label>
                                <textarea
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-white/[0.1] dark:bg-white/[0.03] dark:text-white"
                                    value={newRoleItem.description}
                                    onChange={(e) => setNewRoleItem({ ...newRoleItem, description: e.target.value })}
                                    rows={3}
                                    placeholder="Description des permissions..."
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">Statut</label>
                                <select
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-white/[0.1] dark:bg-white/[0.03] dark:text-white"
                                    value={newRoleItem.statutRole}
                                    onChange={(e) => setNewRoleItem({ ...newRoleItem, statutRole: e.target.value as any })}
                                >
                                    <option value="Actif">Actif</option>
                                    <option value="En cours de validation">En cours de validation</option>
                                    <option value="Annulée">Annulée</option>
                                </select>
                            </div>
                            
                            <div className="mt-8 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={showCancelRoleItem}
                                    className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-white/[0.1] dark:text-white"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
                                >
                                    {newRoleItem.updating ? "Enregistrer" : "Créer le rôle"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}