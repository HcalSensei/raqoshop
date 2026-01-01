import { useMemo, useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Alert from "../../ui/alert/Alert";
import { baseUrl } from '../../functionGeneral';

interface UsersItem {
    id_utilisateur: string,
    nom: string,
    email: string,
    telephone: string,
    numero_CNI: string,
    numero_permis: string
    , login: string
    , mot_de_passe: string
    , statutUser?: "Actif" | "En cours de validation" | "Annulée"
    , roleid: string
    , createdAt: string
    , modifyAt: string
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
    const [filter, setFilter] = useState<"ALL" | UsersItem["statutUser"]>("ALL");
    const [modalOpen, setModalOpen] = useState(false);
    const [error, setError] = useState(null);
    const [newRoleItem, setNewRoleItem] = useState<Partial<roleI>>({
        libelle: "",
        description: "",
        statutRole: "Actif",
    })
    const [newUserItem, setNewUserItem] = useState<Partial<UsersEditItem>>({
        nom: ""
        , login: ""
        , email: ""
        , telephone: ""
        , numero_CNI: ""
        , numero_permis: ""
        , mot_de_passe: ""
        , roleid: ""
        , statutUser: "Actif"
        , createdAt: ""
        , modifyAt: ""
        , updating: false
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
                setUsers(dataUsers.data)
                setRoles(dataRoles.data)
                console.log(dataUsers.data);

            } catch (err: any) {
                setError(err);
                console.error(error);
            }
        }

        fetchData();
    }, [baseUrl]);

    const handleAddUserItem = async (e: any) => {
        e.preventDefault();
        if (!newUserItem.nom || !newUserItem.login || !newUserItem.mot_de_passe || !newUserItem.roleid) return;
        let newUser: any

        try {
            if (newUserItem.updating) {
                console.log("updating...");
                newUser = {
                    nom: newUserItem.nom!,
                    login: newUserItem.login!,
                    roleid: newUserItem.roleid!,
                    email: newUserItem.email!,
                    telephone: newUserItem.telephone!,
                    numero_CNI: newUserItem.numero_CNI!,
                    numero_permis: newUserItem.numero_permis!,
                    mot_de_passe: newUserItem.mot_de_passe!,
                    statutUser: newUserItem.statutUser,
                    createdAt: newUserItem.createdAt!,
                    modifyAt: newUserItem.modifyAt!,
                };
            }
            else {
                console.log("registering...");
                newUser = {
                    nom: newUserItem.nom!,
                    login: newUserItem.login!,
                    roleid: newUserItem.roleid!,
                    email: newUserItem.email!,
                    telephone: newUserItem.telephone!,
                    numero_CNI: newUserItem.numero_CNI!,
                    numero_permis: newUserItem.numero_permis!,
                    mot_de_passe: newUserItem.mot_de_passe!,
                    statutUser: newUserItem.statutUser,
                    createdAt: newUserItem.createdAt!,
                    modifyAt: newUserItem.modifyAt!,
                };
                const createUser = await fetch(`${baseUrl}register-user`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newUser),
                });
                setModalOpen(false);
                let dataCreateUsers = await createUser.json()
                if (dataCreateUsers.error) {
                    setError(dataCreateUsers.message);
                    console.log(dataCreateUsers);
                }

                // window.location.reload()
            }
        } catch (error) {
            alert('Error registering/Updateting role: role may already exist.');
            console.error('Error registering module:', error);
        }

    }

    const showEditUser = (id_utilisateur: string) => {
        const userToEdit = users.find((user) => user.id_utilisateur === id_utilisateur);
        setNewUserItem({
            nom: userToEdit?.nom,
            email: userToEdit?.email,
            telephone: userToEdit?.telephone,
            numero_CNI: userToEdit?.numero_CNI,
            numero_permis: userToEdit?.numero_permis,
            login: userToEdit?.login,
            mot_de_passe: userToEdit?.mot_de_passe,
            roleid: userToEdit?.roleid,
            statutUser: userToEdit?.statutUser,
            createdAt: userToEdit?.createdAt,
            modifyAt: userToEdit?.modifyAt,
            updating: true
        });

        setModalOpen(true);
    }

    const showLogin = (roleid: string | undefined) => {
        let filteredrole = roles.filter((role) => role.id_role === roleid && (role.libelle === 'Utilisateur-stock' || role.libelle === 'Utilisateur-admin' || role.libelle === 'Utilisateur-caisse'));
        let filteredlivreur = roles.filter((role) => role.id_role === roleid && role.libelle === 'Livreur');
        let filteredautre = roles.filter((role) => role.id_role === roleid && (role.libelle !== 'Livreur' && role.libelle !== 'Utilisateur-stock' && role.libelle !== 'Utilisateur-admin' && role.libelle !== 'Utilisateur-caisse'));

        if (filteredrole.length > 0) {
            return (
                <>
                    <input
                        type="text"
                        placeholder="login"
                        className="w-full rounded-lg border px-3 py-2"
                        value={newUserItem.login}
                        onChange={(e) => setNewUserItem({ ...newUserItem, login: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        className="w-full rounded-lg border px-3 py-2"
                        value={newUserItem.mot_de_passe}
                        onChange={(e) => setNewUserItem({ ...newUserItem, mot_de_passe: e.target.value })}
                    />
                </>
            );

        }

        if (filteredlivreur.length > 0) {
            return (
                <>
                    <input
                        type="text"
                        placeholder="Mail"
                        className="w-full rounded-lg border px-3 py-2"
                        value={newUserItem.email}
                        onChange={(e) => setNewUserItem({ ...newUserItem, email: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Telephone"
                        className="w-full rounded-lg border px-3 py-2"
                        value={newUserItem.telephone}
                        onChange={(e) => setNewUserItem({ ...newUserItem, telephone: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Numero de CNI"
                        className="w-full rounded-lg border px-3 py-2"
                        value={newUserItem.numero_CNI}
                        onChange={(e) => setNewUserItem({ ...newUserItem, numero_CNI: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Numero de permis de conduire"
                        className="w-full rounded-lg border px-3 py-2"
                        value={newUserItem.numero_permis}
                        onChange={(e) => setNewUserItem({ ...newUserItem, numero_permis: e.target.value })}
                    />
                </>
            );
        }

        if (filteredautre.length > 0) {
            return (
                <>
                    <input
                        type="text"
                        placeholder="Mail"
                        className="w-full rounded-lg border px-3 py-2"
                        value={newUserItem.email}
                        onChange={(e) => setNewUserItem({ ...newUserItem, email: e.target.value })}
                    />
                </>
            )
        }
        return null
    }

    return (
        <div className="space-y-4">
            {/* Bouton ajouter */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <input
                    type="text"
                    placeholder="Rechercher un utilisateur..."
                    className="w-64 rounded-lg border px-3 py-2 text-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button
                    onClick={() => setModalOpen(true)}
                    className="rounded-lg bg-brand-500 px-4 py-2 text-white text-sm hover:bg-brand-600"
                >
                    Nouveau utilisateur
                </button>
            </div>

            {error ? (
                <Alert
                    variant="error"
                    title="Error"
                    message={error as string}
                    showLink={false}
                />
            ) : null
            }

            {/* Tableau */}
            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                            <TableCell isHeader className="px-5 py-3 text-start text-xs font-medium text-gray-500">#</TableCell>
                            <TableCell isHeader className="px-5 py-3 text-start text-xs font-medium text-gray-500">Nom et prénoms</TableCell>
                            <TableCell isHeader className="px-5 py-3 text-start text-xs font-medium text-gray-500">Email</TableCell>
                            <TableCell isHeader className="px-5 py-3 text-start text-xs font-medium text-gray-500">Téléphone</TableCell>
                            <TableCell isHeader className="px-5 py-3 text-start text-xs font-medium text-gray-500">Login</TableCell>
                            <TableCell isHeader className="px-5 py-3 text-start text-xs font-medium text-gray-500">Statut</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {users.map((item, index) => (
                            <TableRow key={item.id_utilisateur}>
                                <TableCell className="px-5 py-3 text-sm">{index + 1}</TableCell>
                                <TableCell className="px-5 py-3 text-sm">{item.nom}</TableCell>
                                <TableCell className="px-5 py-3 text-sm">{item.email ? item.email : "N/A"}</TableCell>
                                <TableCell className="px-5 py-3 text-sm">{item.telephone ? item.telephone : "N/A"}</TableCell>
                                <TableCell className="px-5 py-3 text-sm">{item.login}</TableCell>
                                <TableCell className="px-5 py-3 text-sm">
                                    {item.statutUser === "Actif" ? (
                                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                            Actif
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                                            Inactif
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell className="px-5 py-3 text-sm">
                                    <button
                                        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                                        onClick={() => showEditUser(item.id_utilisateur)}
                                    >
                                        Modifier
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            </div>

            {/* Modal ajouter utilisateur */}
            {modalOpen && (
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
                            {showLogin(newUserItem.roleid)}
                            <select
                                className="w-full rounded-lg border px-3 py-2"
                                value={newUserItem.roleid}
                                onChange={(e) => setNewUserItem({ ...newUserItem, roleid: e.target.value })}
                            >
                                <option value="">Selectionner un rôle</option>
                                {roles.map((role) => (
                                    <option key={role.libelle} value={role.id_role}>{role.libelle}</option>
                                ))}
                                {/* <option value="Actif">Actif</option>
                                <option value="En cours de constitution">En cours de constitution</option>
                                <option value="Annulée">Annulée</option> */}
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
                                onClick={() => setModalOpen(false)}
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