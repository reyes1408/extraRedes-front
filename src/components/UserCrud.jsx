import { useState, useEffect } from "react";
import { Card, Typography, Button, Input } from "@material-tailwind/react";

const UserCrud = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/usuarios")
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
      .catch((err) => console.error("Error al obtener usuarios:", err));
  }, []);

  const handleAddUser = () => {
    const user = { nombre, password };

    fetch("http://localhost:5000/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((newUser) => {
        setUsuarios([...usuarios, newUser]);
        setNombre("");
        setPassword("");
      })
      .catch((err) => console.error("Error al agregar usuario:", err));
  };

  const handleEditUser = (id, updatedUser) => {
    fetch(`http://localhost:5000/usuarios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser),
    })
      .then((res) => res.json())
      .then(() => {
        setUsuarios(
          usuarios.map((user) => (user.id === id ? { ...user, ...updatedUser } : user))
        );
        setEditingUserId(null);
        setNombre("");
        setPassword("");
      })
      .catch((err) => console.error("Error al editar usuario:", err));
  };

  const handleDeleteUser = (id) => {
    fetch(`http://localhost:5000/usuarios/${id}`, { method: "DELETE" })
      .then(() => setUsuarios(usuarios.filter((user) => user.id !== id)))
      .catch((err) => console.error("Error al eliminar usuario:", err));
  };

  const startEditing = (user) => {
    setEditingUserId(user.id);
    setNombre(user.nombre);
    setPassword(user.password);
  };

  return (
    <div className="p-6 bg-slate-200 shadow rounded mb-5">
      {/* Formulario */}
      <Card className="p-4 mb-6 w-full">
        <Typography variant="h6" className="mb-4 font-bold text-gray-800">
          {editingUserId ? "Editar Usuario" : "Agregar Usuario"}
        </Typography>
        <div className="flex gap-4 w-full">
          <Input
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1"
          />
          <Button
            className={editingUserId ? "bg-yellow-400 h-10 px-5" : "bg-green-600 h-10 px-5"}
            onClick={() =>
              editingUserId
                ? handleEditUser(editingUserId, { nombre, password })
                : handleAddUser()
            }
          >
            {editingUserId ? "Actualizar" : "Agregar"}
          </Button>
        </div>
      </Card>

      {/* Tabla */}
      <Card className="h-full w-full overflow-y-scroll">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Nombre
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Contraseña
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Opciones
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario, index) => {
              const isLast = index === usuarios.length - 1;
              const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

              return (
                <tr key={usuario.id}>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray">
                      {usuario.nombre}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray">
                      {usuario.password}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-yellow-400"
                        onClick={() => startEditing(usuario)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-600"
                        onClick={() => handleDeleteUser(usuario.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default UserCrud;
