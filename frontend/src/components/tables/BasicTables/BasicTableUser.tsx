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
    MagnifyingGlassIcon, 
    TrashIcon, 
    PlusIcon, 
    UserIcon 
} from "@heroicons/react/24/outline";
import Alert from "../../ui/alert/Alert";
import Badge from "../../ui/badge/Badge"; // Assurez-vous d'avoir ce composant ou utilisez un span stylisé
import { baseUrl } from '../../functionGeneral';

// --- Interfaces ---
interface UsersItem {
    id_utilisateur: string,
    nom: string,
    email: string,
    telephone: string,
    numero_CNI: string,
    numero_permis: string,
    login: string,
    mot_de_passe: string,
    statutUser?: "Actif" | "En cours de validation" | "Annulée",
    roleid: string,
    createdAt: string,
    modifyAt: string
}

interface UsersEditItem extends UsersItem {
    updating: boolean
}

export interface roleI {
    id_role: string,
    libelle: string,
    description: string,
    statutRole?: "Actif" | "En cours de validation" | "Annulée"
}

export default function BasicTableUser() {
    const [users, setUsers] = useState<UsersItem[]>([])
    const [roles, setRoles] = useState<roleI[]>([])
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newUserItem, setNewUserItem] = useState<Partial<UsersEditItem>>({
        nom: "", login: "", email: "", telephone: "", numero_CNI: "",
        numero_permis: "", mot_de_passe: "", roleid: "", statutUser: "Actif",
        updating: false
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [responseUsers, responseRoles] = await Promise.all([
                    fetch(`${baseUrl}users`),
                    fetch(`${baseUrl}roles`)
                ]);
                let dataUsers = await responseUsers.json();
                let dataRoles = await responseRoles.json();
                setUsers(dataUsers.data || []);
                setRoles(dataRoles.data || []);
            } catch (err: any) {
                setError("Erreur de chargement des données");
            }
        }
        fetchData();
    }, []);

    const handleAddUserItem = async (e: any) => {
        e.preventDefault();
        // Logique d'ajout/modification ici (similaire à votre code précédent)
        setModalOpen(false);
    }

    const showEditUser = (id_utilisateur: string) => {
        const userToEdit = users.find((u) => u.id_utilisateur === id_utilisateur);
        if (userToEdit) {
            setNewUserItem({ ...userToEdit, updating: true });
            setModalOpen(true);
        }
    }

    const deleteUser = (id_utilisateur: string) => {
        // On demande confirmation avant de supprimer
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
            // .filter garde tous les éléments SAUF celui qui correspond à l'ID
            setUsers((prevUsers) => prevUsers.filter((u) => u.id_utilisateur !== id_utilisateur));
        }
    };

    // Filtrage simple pour la démo
    const filteredUsers = users.filter(user => 
        user.nom.toLowerCase().includes(search.toLowerCase()) || 
        user.login.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-5">
            {/* Header & Search Bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full max-w-[300px]">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <MagnifyingGlassIcon className="size-5" />
                    </span>
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-11 pr-4 text-sm outline-none focus:border-brand-500 dark:border-white/[0.1] dark:bg-white/[0.03] dark:text-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                
                <button
                    onClick={() => {
                        setNewUserItem({ nom: "", updating: false, statutUser: "Actif" });
                        setModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
                >
                    <PlusIcon className="size-5" />
                    Nouvel utilisateur
                </button>
            </div>

            {error && (
                <Alert variant="error" title="Erreur" message={error} showLink={false} />
            )}

            {/* Tableau Style TailAdmin */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell isHeader className="px-5 py-4 text-start text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">#</TableCell>
                                <TableCell isHeader className="px-5 py-4 text-start text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Utilisateur</TableCell>
                                <TableCell isHeader className="px-5 py-4 text-start text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Contact</TableCell>
                                <TableCell isHeader className="px-5 py-4 text-start text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Email</TableCell>
                                <TableCell isHeader className="px-5 py-4 text-start text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Statut</TableCell>
                                <TableCell isHeader className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {filteredUsers.map((item, index) => (
                                <TableRow key={item.id_utilisateur} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01]">
                                    <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{index + 1}</TableCell>
                                    <TableCell className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-white/[0.05]">
                                                <UserIcon className="size-5 text-gray-500" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-800 dark:text-white/90">{item.nom}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-5 py-4">
                                        <span className="block text-sm text-gray-800 dark:text-white/90">{item.telephone || ""}</span>
                                    </TableCell>
                                    <TableCell className="px-5 py-4">
                                        <span className="block text-sm text-gray-800 dark:text-white/90">{item.email || "N/A"}</span>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-sm">
                                        <Badge color={item.statutUser === "Actif" ? "success" : "error"}>
                                            {item.statutUser || "Inactif"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-center">
                                        <button
                                            onClick={() => showEditUser(item.id_utilisateur)}
                                            title="Modifier"
                                            className="inline-flex items-center gap-1.5 text-brand-500 hover:text-brand-600 font-medium text-sm transition-colors"
                                        >
                                            <PencilSquareIcon className="size-5" />
                                            
                                        </button>
                                        <button
                                            onClick={() => deleteUser(item.id_utilisateur)}
                                            title="Supprimer"
                                            className="text-gray-500 hover:text-red-600 dark:hover:text-red-400"
                                        >
                                            
                                            <TrashIcon className="size-5" />
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Modal de création/édition */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-900 border border-gray-200 dark:border-white/[0.1]">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                            {newUserItem.updating ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
                        </h3>
                        
                        <form onSubmit={handleAddUserItem} className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Nom et prénoms</label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-white/[0.1] dark:bg-white/[0.03] dark:text-white"
                                    value={newUserItem.nom}
                                    onChange={(e) => setNewUserItem({ ...newUserItem, nom: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Rôle</label>
                                    <select
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-white/[0.1] dark:bg-white/[0.03] dark:text-white"
                                        value={newUserItem.roleid}
                                        onChange={(e) => setNewUserItem({ ...newUserItem, roleid: e.target.value })}
                                        required
                                    >
                                        <option value="">Sélectionner</option>
                                        {roles.map((role) => (
                                            <option key={role.id_role} value={role.id_role}>{role.libelle}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Statut</label>
                                    <select
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-white/[0.1] dark:bg-white/[0.03] dark:text-white"
                                        value={newUserItem.statutUser}
                                        onChange={(e) => setNewUserItem({ ...newUserItem, statutUser: e.target.value as any })}
                                    >
                                        <option value="Actif">Actif</option>
                                        <option value="En cours de validation">En cours</option>
                                        <option value="Annulée">Désactivé</option>
                                    </select>
                                </div>
                            </div>

                            {/* Section dynamique selon le rôle */}
                            <div className="pt-2">
                                {/* Ici votre fonction showLogin(newUserItem.roleid) */}
                            </div>

                            <div className="mt-8 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-white/[0.1] dark:text-white transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
                                >
                                    {newUserItem.updating ? "Mettre à jour" : "Créer le compte"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}