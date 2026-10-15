import { useState } from "react";

const initialForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
};

const fieldLabels = {
  name: "Nombre",
  description: "Descripción",
  price: "Precio",
  stock: "Stock",
  category: "Categoría",
};

function ProductForm({
  editingProduct,
  onProductCreated,
  onProductUpdated,
  onCancelEdit,
}) {
  const isEditing = editingProduct !== null;

  const [form, setForm] = useState(() =>
    editingProduct
      ? {
          name: editingProduct.name ?? "",
          description: editingProduct.description ?? "",
          price: String(editingProduct.price ?? ""),
          stock: String(editingProduct.stock ?? ""),
          category: editingProduct.category ?? "",
        }
      : { ...initialForm },
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (saving) return;

    setSaving(true);
    setError("");

    const productData = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      category: form.category.trim(),
    };

    try {
      const response = await fetch(
        isEditing ? `/api/products/${editingProduct.id}` : "/api/products",
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        },
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (data?.errors) {
          const messages = Object.entries(data.errors)
            .map(
              ([field, message]) =>
                `${fieldLabels[field] || field}: ${message}`,
            )
            .join(". ");

          throw new Error(messages);
        }

        throw new Error(data?.message || "No se pudo guardar el producto.");
      }

      if (!data || data.id == null) {
        throw new Error("El servidor no devolvió los datos del producto.");
      }

      if (isEditing) {
        onProductUpdated(data);
      } else {
        onProductCreated(data);
      }
    } catch (err) {
      setError(err.message || "Error de conexión con el servidor.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div className="form-dialog-header">
        <div>
          <span className="dialog-eyebrow">PRODUCTOS</span>

          <h2 id="product-dialog-title">
            {isEditing ? "Editar producto" : "Nuevo producto"}
          </h2>

          <p>
            {isEditing
              ? "Actualiza la información del artículo."
              : "Completa los datos para agregarlo al inventario."}
          </p>
        </div>

        <button
          className="dialog-close"
          type="button"
          onClick={onCancelEdit}
          disabled={saving}
          aria-label="Cerrar formulario"
        >
          ×
        </button>
      </div>

      <div className="form-grid">
        <label className="form-field full-width">
          <span>
            Nombre del producto <em>*</em>
          </span>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ej. Monitor Samsung"
            maxLength={120}
            disabled={saving}
            autoFocus
            required
          />
        </label>

        <label className="form-field">
          <span>Categoría</span>

          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Ej. Monitores"
            disabled={saving}
          />
        </label>

        <label className="form-field">
          <span>
            Precio (GTQ) <em>*</em>
          </span>

          <input
            name="price"
            type="number"
            min="0.01"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            placeholder="0.00"
            disabled={saving}
            required
          />
        </label>

        <label className="form-field full-width">
          <span>
            Unidades en stock <em>*</em>
          </span>

          <input
            name="stock"
            type="number"
            min="0"
            step="1"
            value={form.stock}
            onChange={handleChange}
            placeholder="0"
            disabled={saving}
            required
          />
        </label>

        <label className="form-field full-width">
          <span>Descripción</span>

          <textarea
            name="description"
            rows={3}
            value={form.description}
            onChange={handleChange}
            placeholder="Breve descripción del producto (opcional)"
            disabled={saving}
          />
        </label>
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="form-dialog-footer">
        <button
          type="button"
          className="button-outline"
          onClick={onCancelEdit}
          disabled={saving}
        >
          Cancelar
        </button>

        <button type="submit" className="button-primary" disabled={saving}>
          {saving
            ? "Guardando..."
            : isEditing
              ? "Guardar cambios"
              : "Registrar producto"}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
