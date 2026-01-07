import { useMemo, useState, useEffect } from "react";
import { baseUrl, getApiMessage, getFilePathFromDBPath } from '../../functionGeneral';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Driver {
  id_utilisateur: string;
  imageCniRecto: any;
  imageCniVerso: any;
  imagePermisRecto: any;
  imagePermisVerso: any;
  nom: string;
  email: string;
  telephone: string;
  numero_CNI: string;
  numero_permis: string;
  roleid: string;
  delivered: number;
  inProgress: number;
  statutUser?: "Active" | "Pending" | "Cancel | ended";
  orders?: { id: number; reference: string; status: string }[];
}

interface driverUpdate extends Driver {
  updating: boolean;
}

interface roleI {
  id_role: string,
  libelle: string,
  description: string,
  statutRole?: "Actif" | "En cours de validation" | "Annulée"
}

export default function DriverCrud() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [search, setSearch] = useState("");
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [newDriverModal, setNewDriverModal] = useState(false);
  const [newDriver, setNewDriver] = useState<Partial<driverUpdate>>({});
  const [roles, setRoles] = useState<roleI[]>([]);
  const [error, setError] = useState({ isError: false, message: "" });
  const [showPictureModal, setShowPictureModal] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [responseRoles, responseDrivers] = await Promise.all([
          fetch(`${baseUrl}roles`),
          fetch(`${baseUrl}drivers`)
        ])

        const dataRoles = await responseRoles.json()
        const dataDrivers = await responseDrivers.json()
        setRoles(dataRoles.data)
        setDrivers(dataDrivers.data)
        for (let i of dataDrivers.data) {
          for (let j of i.images) {
            console.log(j);
            if (j.objet_photo === "permis_recto") {
              i.imagePermisRecto = j.file_path
            }
            if (j.objet_photo === "permis_verso") {
              i.imagePermisVerso = j.file_path
            }
            if (j.objet_photo === "cni_recto") {
              i.imageCniRecto = j.file_path
            }
            if (j.objet_photo === "cni_verso") {
              i.imageCniVerso = j.file_path
            }
          }

        }



      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    }

    fetchData()
  }, [])

  /* Filtrage */
  const filteredDrivers = useMemo(
    () =>
      drivers.filter(
        (d) =>
          d.nom.toLowerCase().includes(search.toLowerCase()) ||
          d.email.toLowerCase().includes(search.toLowerCase())
      ),
    [drivers, search]
  );

  const filteredRoles: any[] = roles.filter((item) => {
    const matchSearch = item.libelle.toLowerCase().includes('livreur');
    return matchSearch;
  });

  /* Ajouter un nouveau livreur */
  const addDriver = async () => {
    if (!newDriver.nom || !newDriver.email) return;
    const driver = {
      ...newDriver,
      statutUser: "Active",
    }

    const response = await fetch(`${baseUrl}register-driver`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(driver),
    });

    const data = await response.json();
    if (data.error) {
      setError({ isError: true, message: data.message });
    } else {
      setError({ isError: false, message: data.message });
    }

    setNewDriverModal(false);
    setNewDriver({});
  };

  const showEditNewDriverModal = (idDriver: string) => {
    const driver = drivers.find((d) => d.id_utilisateur === idDriver);
    if (!driver) return;
    console.log(driver);
    setNewDriverModal(true);
    setNewDriver(driver);
  }

  const CancelEditDrivelModal = () => {
    setNewDriverModal(false);
    setNewDriver({});
  }

  const HandleAddPicture = async () => {
    if (!newDriver.id_utilisateur) return;
    const formData = new FormData();

    formData.append("utilisateurId", newDriver.id_utilisateur);
    if (newDriver.imagePermisRecto) {
      newDriver.imagePermisRecto.forEach((file: any) => {
        formData.append("files", file);
      })
      formData.append("objet_photo", "permis_recto")
    }
    if (newDriver.imagePermisVerso) {
      newDriver.imagePermisVerso.forEach((file: any) => {
        formData.append("files", file);
      })
      formData.append("objet_photo", "permis_verso")
    }
    if (newDriver.imageCniRecto) {
      newDriver.imageCniRecto.forEach((file: any) => {
        formData.append("files", file);
      })
      formData.append("objet_photo", "cni_recto")
    }
    if (newDriver.imageCniVerso) {
      newDriver.imageCniVerso.forEach((file: any) => {
        formData.append("files", file);
      })
      formData.append("objet_photo", "cni_verso")
    }
    console.log(formData);

    try {
      console.log(`${baseUrl}image-user/add`);

      const response = await fetch(`${baseUrl}image-user/add`, {
        method: "PUT",
        headers: {
          // "Content-Type": "application/json",
        },
        body: formData,
      });

      const data = await response.json();
      if (data.error) {
        setError({ isError: true, message: data.message });
      } else {
        setError({ isError: false, message: data.message });
      }

      setShowPictureModal(false);
      setNewDriver({});
    } catch (error) {
      console.error("Error adding picture:", error);
    }
  }

  const handelShowPictureModal = (idDriver: string) => {
    const driver = drivers.find((d) => d.id_utilisateur === idDriver);
    if (!driver) return;
    console.log(driver);
    setShowPictureModal(true);
    setNewDriver(driver);
  }

  const CancelShowPictureModal = () => {
    setShowPictureModal(false);
    setNewDriver({});
  }


  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <input
          type="text"
          placeholder="Rechercher un livreur..."
          className="w-64 rounded-lg border px-3 py-2 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => setNewDriverModal(true)}
          className="rounded-lg bg-brand-500 px-4 py-2 text-white text-sm hover:bg-brand-600"
        >
          Nouveau livreur
        </button>
      </div>

      {getApiMessage(error.isError, error.message)}

      {/* Tableau TailAdmin */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
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
                  Zone
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Livrées
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  En cours
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {filteredDrivers.map((driver) => (
                <TableRow key={driver.id_utilisateur}>
                  <TableCell className="px-5 py-4 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full">
                        <img
                          width={40}
                          height={40}
                          // src={driver.imageCniRecto[0]}
                          alt={driver.nom}
                        />
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800 dark:text-white/90">
                          <button
                            className="text-sm text-brand-500 hover:underline"
                            onClick={() => handelShowPictureModal(driver.id_utilisateur)}
                          >
                            {driver.nom}
                          </button>
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start">
                    {driver.email}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start">
                    {driver.delivered}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start">
                    {driver.inProgress}
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        className="text-sm text-brand-500 hover:underline"
                        onClick={() => setSelectedDriver(driver)}
                      >
                        Détails
                      </button>
                      <button
                        className="text-sm text-yellow-600 hover:underline"
                        onClick={() => showEditNewDriverModal(driver.id_utilisateur)}
                      >
                        Modifier
                      </button>
                      <button
                        className="text-sm text-red-600 hover:underline"
                      //onClick={() => deleteDriver(driver.id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredDrivers.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="px-5 py-8 text-center text-sm text-gray-500"
                  >
                    Aucun livreur trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal Détails */}
      {selectedDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
              {selectedDriver.nom}
            </h3>

            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <p><strong>Zone :</strong> {selectedDriver.email}</p>
              <p><strong>Commandes livrées :</strong> {selectedDriver.delivered}</p>
              <p><strong>En cours :</strong> {selectedDriver.inProgress}</p>
            </div>

            {/* Graphique efficacité */}
            <div className="mt-6 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: "Livrées", value: selectedDriver.delivered },
                    { name: "En cours", value: selectedDriver.inProgress },
                  ]}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#4ade80" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Commandes en cours */}
            <div className="mt-4">
              <h4 className="font-medium text-gray-800 dark:text-white">Commandes</h4>
              <ul className="mt-2 ml-4 list-disc text-sm text-gray-600 dark:text-gray-300">
                {selectedDriver.orders?.map((order) => (
                  <li key={order.id}>
                    {order.reference} - {order.status}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700"
                onClick={() => setSelectedDriver(null)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nouveau livreur */}
      {newDriverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
              Nouveau livreur
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nom du livreur"
                className="w-full rounded-lg border px-3 py-2 text-sm"
                value={newDriver.nom || ""}
                onChange={(e) =>
                  setNewDriver({ ...newDriver, nom: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Mail"
                className="w-full rounded-lg border px-3 py-2"
                value={newDriver.email}
                onChange={(e) => setNewDriver({ ...newDriver, email: e.target.value })}
              />
              <input
                type="text"
                placeholder="Telephone"
                className="w-full rounded-lg border px-3 py-2"
                value={newDriver.telephone}
                onChange={(e) => setNewDriver({ ...newDriver, telephone: e.target.value })}
              />
              <input
                type="text"
                placeholder="Numero de CNI"
                className="w-full rounded-lg border px-3 py-2"
                value={newDriver.numero_CNI}
                onChange={(e) => setNewDriver({ ...newDriver, numero_CNI: e.target.value })}
              />
              <input
                type="text"
                placeholder="Numero de permis de conduire"
                className="w-full rounded-lg border px-3 py-2"
                value={newDriver.numero_permis}
                onChange={(e) => setNewDriver({ ...newDriver, numero_permis: e.target.value })}
              />
              <select
                className="w-full rounded-lg border px-3 py-2"
                value={newDriver.roleid}
                onChange={(e) => setNewDriver({ ...newDriver, roleid: e.target.value })}
              >
                <option value="">Selectionner un rôle</option>
                {filteredRoles.map((role) => (
                  <option key={role.libelle} value={role.id_role}>{role.libelle}</option>
                ))}
              </select>

              {/* {newDriver.updating && (
                <input
                  type="file"
                  className="w-full rounded-lg border px-3 py-2"
                  onChange={(e) => setNewDriver({ ...newDriver, imageCni: e.target.files?.[0] })}
                />
              )} */}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700"
                onClick={() => CancelEditDrivelModal()}
              >
                Annuler
              </button>
              <button
                className="rounded-lg bg-brand-500 px-4 py-2 text-sm text-white hover:bg-brand-600"
                onClick={addDriver}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/*Modal d'affichage et d'ajout d'images*/}
      {showPictureModal && (
        <div className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-boxdark w-full max-w-4xl rounded-2xl p-6 shadow-2xl max-h-[73vh] overflow-y-auto">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
              Permis et CNI
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <img
                    src={newDriver.imagePermisRecto ? getFilePathFromDBPath(newDriver.imagePermisRecto) : "/images/grid-image/image-02.png"}
                    alt=" grid"
                    className="border border-gray-200 rounded-xl dark:border-gray-800"
                  />
                  <label htmlFor="PERM-RECTO" className="mt-2 block text-sm font-medium text-gray-700 dark:text-gray-400">Permis de conduire recto</label>
                  <input
                    type="file"
                    placeholder="Nom du livreur"
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    // value={newDriver.imagePermisRecto}
                    onChange={(e) =>
                      setNewDriver({ ...newDriver, imagePermisRecto: e.target.files ? Array.from(e.target.files) : [] })
                    }
                  />
                </div>

                <div>
                  <img
                    src={newDriver.imagePermisVerso ? getFilePathFromDBPath(newDriver.imagePermisVerso) : "/images/grid-image/image-03.png"}
                    alt=" grid"
                    className="border border-gray-200 rounded-xl dark:border-gray-800"
                  />
                  <label htmlFor="PERM-VERSO" className="mt-2 block text-sm font-medium text-gray-700 dark:text-gray-400">Permis de conduire verso</label>
                  <input
                    type="file"
                    placeholder="Nom du livreur"
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    // value={newDriver.imagePermisVerso}
                    onChange={(e) =>
                      setNewDriver({ ...newDriver, imagePermisVerso: e.target.files ? Array.from(e.target.files) : [] })
                    }
                  />
                </div>

              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <img
                    src={newDriver.imageCniRecto ? getFilePathFromDBPath(newDriver.imageCniRecto) : "/images/grid-image/image-02.png"}
                    alt=" grid"
                    className="border border-gray-200 rounded-xl dark:border-gray-800"
                  />
                  <label htmlFor="CNI-RECTO" className="mt-2 block text-sm font-medium text-gray-700 dark:text-gray-400">CNI recto</label>
                  <input
                    type="file"
                    placeholder="Nom du livreur"
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    // value={newDriver.imageCniRecto}
                    onChange={(e) =>
                      setNewDriver({ ...newDriver, imageCniRecto: e.target.files ? Array.from(e.target.files) : [] })
                    }
                  />
                </div>

                <div>
                  <img
                    src={newDriver.imageCniVerso ? getFilePathFromDBPath(newDriver.imageCniVerso) : "/images/grid-image/image-03.png"}
                    alt=" grid"
                    className="border border-gray-200 rounded-xl dark:border-gray-800"
                  />
                  <label htmlFor="CNI-VERSO" className="mt-2 block text-sm font-medium text-gray-700 dark:text-gray-400">CNI verso</label>
                  <input
                    type="file"
                    placeholder="Nom du livreur"
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    // value={newDriver.imageCniVerso}
                    onChange={(e) =>
                      setNewDriver({ ...newDriver, imageCniVerso: e.target.files ? Array.from(e.target.files) : [] })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700"
                onClick={() => CancelShowPictureModal()}
              >
                Annuler
              </button>
              <button
                className="rounded-lg bg-brand-500 px-4 py-2 text-sm text-white hover:bg-brand-600"
                onClick={HandleAddPicture}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
