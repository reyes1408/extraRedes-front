import { useState, useEffect } from "react";
import { Card, Typography, Button, Input } from "@material-tailwind/react";

const ProductCrud = () => {
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState("");
  const [idUsuario, setIdUsuario] = useState("");
  const [editingProductId, setEditingProductId] = useState(null);

  useEffect(() => {
    // Obtener lista de productos
    fetch("http://localhost:5000/productos")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error("Error al obtener productos:", err));

    // Obtener lista de usuarios
    fetch("http://localhost:5000/usuarios")
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
      .catch((err) => console.error("Error al obtener usuarios:", err));
  }, []);

  const handleAddProduct = () => {
    const product = { nombre, idUsuario };

    fetch("http://localhost:5000/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    })
      .then((res) => res.json())
      .then((newProduct) => {
        setProductos([...productos, newProduct]);
        setNombre("");
        setIdUsuario("");
      })
      .catch((err) => console.error("Error al agregar producto:", err));
  };

  const handleEditProduct = (id, updatedProduct) => {
    fetch(`http://localhost:5000/productos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct),
    })
      .then((res) => res.json())
      .then(() => {
        setProductos(
          productos.map((product) =>
            product.id === id ? { ...product, ...updatedProduct } : product
          )
        );
        setEditingProductId(null);
        setNombre("");
        setIdUsuario("");
      })
      .catch((err) => console.error("Error al editar producto:", err));
  };

  const handleDeleteProduct = (id) => {
    fetch(`http://localhost:5000/productos/${id}`, { method: "DELETE" })
      .then(() => setProductos(productos.filter((product) => product.id !== id)))
      .catch((err) => console.error("Error al eliminar producto:", err));
  };

  const startEditing = (product) => {
    setEditingProductId(product.id);
    setNombre(product.nombre);
    setIdUsuario(product.idUsuario);
  };

  return (
    <div className="p-6 bg-slate-200 shadow rounded">
      {/* Formulario */}
      <Card className="p-4 mb-6 w-full">
        <Typography variant="h6" className="mb-4 font-bold text-gray-800">
          {editingProductId ? "Editar Producto" : "Agregar Producto"}
        </Typography>
        <div className="flex gap-4 w-full">
          <Input
            placeholder="Nombre del Producto"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="flex-1"
          />
          <select
            className="flex-1 p-2 border rounded-md"
            value={idUsuario}
            onChange={(e) => setIdUsuario(e.target.value)}
          >
            <option value="">Seleccionar Usuario</option>
            {usuarios.map((usuario) => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.nombre}
              </option>
            ))}
          </select>
          <Button
            className={editingProductId ? "bg-yellow-400 h-10 px-5" : "bg-green-600 h-10 px-5"}
            onClick={() =>
              editingProductId
                ? handleEditProduct(editingProductId, { nombre, idUsuario })
                : handleAddProduct()
            }
          >
            {editingProductId ? "Actualizar" : "Agregar"}
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
                  Usuario
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
            {productos.map((producto, index) => {
              const isLast = index === productos.length - 1;
              const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

              return (
                <tr key={producto.id}>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray">
                      {producto.nombre}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray">
                      {usuarios.find((user) => user.id === producto.idUsuario)?.nombre || "N/A"}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-yellow-400"
                        onClick={() => startEditing(producto)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-600"
                        onClick={() => handleDeleteProduct(producto.id)}
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

export default ProductCrud;
