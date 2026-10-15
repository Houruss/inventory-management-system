import { useEffect, useMemo, useState } from "react";
import ProductForm from "./components/ProductForm";

const LOW_STOCK_LIMIT = 5;

const priceFormatter = new Intl.NumberFormat("es-GT", {
  style: "currency",
  currency: "GTQ",
  minimumFractionDigits: 2,
});

function formatPrice(value) {
  return priceFormatter.format(Number(value) || 0);
}

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Cargar productos desde Spring Boot
  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        const response = await fetch("/api/products");

        if (!response.ok) {
          throw new Error("No se pudo consultar el inventario.");
        }

        const data = await response.json();

        if (active) {
          setProducts(data);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Error de conexión con el servidor.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  // Obtener categorías disponibles
  const categories = useMemo(() => {
    return [
      ...new Set(
        products.map((product) => product.category?.trim() || "Sin categoría"),
      ),
    ].sort((a, b) => a.localeCompare(b, "es"));
  }, [products]);

  // Buscar y filtrar productos
  const filteredProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("es");

    return products.filter((product) => {
      const category = product.category?.trim() || "Sin categoría";

      const matchesCategory = !categoryFilter || category === categoryFilter;

      const matchesSearch =
        !query ||
        [product.id, product.name, product.description, category].some(
          (value) =>
            String(value ?? "")
              .toLocaleLowerCase("es")
              .includes(query),
        );

      return matchesCategory && matchesSearch;
    });
  }, [products, search, categoryFilter]);

  // Indicadores del dashboard
  const totalUnits = products.reduce(
    (sum, product) => sum + Number(product.stock),
    0,
  );

  const inventoryValue = products.reduce(
    (sum, product) => sum + Number(product.price) * Number(product.stock),
    0,
  );

  const lowStockCount = products.filter(
    (product) => Number(product.stock) <= LOW_STOCK_LIMIT,
  ).length;

  // Abrir formulario para registrar
  function openCreateForm() {
    setEditingProduct(null);
    setActionError("");
    setIsFormOpen(true);
  }

  // Abrir formulario para editar
  function openEditForm(product) {
    setEditingProduct(product);
    setActionError("");
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingProduct(null);
  }

  // Agregar un nuevo producto
  function handleProductCreated(newProduct) {
    setProducts((previous) => [...previous, newProduct]);

    setSuccessMessage(
      `Producto "${newProduct.name}" registrado correctamente.`,
    );

    setActionError("");
    closeForm();
  }

  // Actualizar un producto
  function handleProductUpdated(updatedProduct) {
    setProducts((previous) =>
      previous.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product,
      ),
    );

    setSuccessMessage(
      `Producto "${updatedProduct.name}" actualizado correctamente.`,
    );

    setActionError("");
    closeForm();
  }

  // Solicitar confirmación para eliminar
  function requestDelete(product) {
    setProductToDelete(product);
    setActionError("");
  }

  // Confirmar eliminación
  async function confirmDelete() {
    if (!productToDelete || deletingId !== null) return;

    const product = productToDelete;

    setDeletingId(product.id);
    setActionError("");

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(data?.message || "No se pudo eliminar el producto.");
      }

      setProducts((previous) =>
        previous.filter((item) => item.id !== product.id),
      );

      setSuccessMessage(`Producto "${product.name}" eliminado correctamente.`);

      setProductToDelete(null);
    } catch (err) {
      setActionError(err.message || "Error de conexión con el servidor.");
      setProductToDelete(null);
    } finally {
      setDeletingId(null);
    }
  }

  function getStockStatus(stock) {
    if (stock === 0) {
      return { label: "Agotado", className: "out" };
    }

    if (stock <= LOW_STOCK_LIMIT) {
      return { label: "Stock bajo", className: "low" };
    }

    return { label: "Disponible", className: "available" };
  }

  return (
    <div className="app-shell">
      {/* Menú lateral */}
      <aside className="sidebar">
        <a className="brand" href="#resumen">
          <span className="brand-symbol" aria-hidden="true">
            ▦
          </span>

          <span className="brand-copy">
            <strong>Inventario</strong>
            <small>Panel de administración</small>
          </span>
        </a>

        <div className="sidebar-navigation">
          <p className="sidebar-caption">ESPACIO DE TRABAJO</p>

          <nav aria-label="Navegación principal">
            <a className="sidebar-link" href="#resumen">
              Resumen
            </a>

            <a className="sidebar-link" href="#productos">
              Productos
            </a>
          </nav>
        </div>

        <div className="sidebar-footer">
          <span className={`connection-dot ${error ? "disconnected" : ""}`} />

          <span>
            {error
              ? "Sin conexión"
              : loading
                ? "Conectando..."
                : "Inventario cargado"}
          </span>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="workspace">
        <header className="topbar">
          <span>
            Espacio de trabajo
            <span className="breadcrumb-separator">/</span>
            Inventario
          </span>

          <span className="topbar-tag">Sistema de gestión</span>
        </header>

        <main className="page-content">
          <section className="page-heading" id="resumen">
            <div>
              <p className="eyebrow">VISTA GENERAL</p>

              <h1>Gestión de inventario</h1>

              <p className="page-description">
                Controla tus productos, existencias y precios desde un solo
                lugar.
              </p>
            </div>

            <button
              className="button-primary"
              type="button"
              onClick={openCreateForm}
              disabled={loading || Boolean(error)}
            >
              <span aria-hidden="true">＋</span>
              Nuevo producto
            </button>
          </section>

          {/* Estadísticas */}
          <section className="stats-grid" aria-label="Resumen del inventario">
            <article className="stat-card">
              <span className="stat-label">Productos registrados</span>

              <strong className="stat-value">{products.length}</strong>

              <span className="stat-note">Artículos en el catálogo</span>

              <span className="stat-accent accent-blue" />
            </article>

            <article className="stat-card">
              <span className="stat-label">Unidades disponibles</span>

              <strong className="stat-value">{totalUnits}</strong>

              <span className="stat-note">Existencias acumuladas</span>

              <span className="stat-accent accent-purple" />
            </article>

            <article className="stat-card">
              <span className="stat-label">Valor del inventario</span>

              <strong className="stat-value value-money">
                {formatPrice(inventoryValue)}
              </strong>

              <span className="stat-note">Precio × unidades en stock</span>

              <span className="stat-accent accent-green" />
            </article>

            <article className="stat-card">
              <span className="stat-label">Stock bajo o agotado</span>

              <strong className="stat-value">{lowStockCount}</strong>

              <span className="stat-note">
                Productos con {LOW_STOCK_LIMIT} unidades o menos
              </span>

              <span className="stat-accent accent-amber" />
            </article>
          </section>

          {/* Mensajes de éxito y error */}
          {successMessage && (
            <div className="alert alert-success" role="status">
              <span>{successMessage}</span>

              <button
                type="button"
                onClick={() => setSuccessMessage("")}
                aria-label="Cerrar mensaje"
              >
                ×
              </button>
            </div>
          )}

          {actionError && (
            <div className="alert alert-error" role="alert">
              <span>{actionError}</span>

              <button
                type="button"
                onClick={() => setActionError("")}
                aria-label="Cerrar error"
              >
                ×
              </button>
            </div>
          )}

          {/* Catálogo de productos */}
          <section
            className="inventory-panel"
            id="productos"
            aria-labelledby="products-heading"
          >
            <div className="panel-header">
              <div>
                <h2 id="products-heading">Catálogo de productos</h2>

                <p>Consulta y administra los artículos registrados.</p>
              </div>

              <span className="result-count">
                {filteredProducts.length} resultados
              </span>
            </div>

            {/* Buscador y filtro */}
            <div className="filters-row">
              <label className="search-box">
                <span className="sr-only">Buscar productos</span>

                <span className="search-icon" aria-hidden="true">
                  ⌕
                </span>

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar productos por nombre, categoría o ID..."
                />
              </label>

              <label className="category-box">
                <span className="sr-only">Filtrar productos por categoría</span>

                <select
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                >
                  <option value="">Todas las categorías</option>

                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Tabla de inventario */}
            {loading ? (
              <div className="table-message" role="status">
                Cargando productos...
              </div>
            ) : error ? (
              <div className="table-message error-state" role="alert">
                {error} Comprueba que Spring Boot esté funcionando.
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="table-message empty-state">
                <strong>
                  {products.length === 0
                    ? "Aún no hay productos"
                    : "No encontramos coincidencias"}
                </strong>

                <p>
                  {products.length === 0
                    ? "Registra tu primer producto para comenzar."
                    : "Prueba con otra búsqueda o categoría."}
                </p>

                {products.length > 0 && (
                  <button
                    className="button-outline"
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setCategoryFilter("");
                    }}
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            ) : (
              <div className="table-scroll">
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>PRODUCTO</th>
                      <th>ID</th>
                      <th>CATEGORÍA</th>
                      <th>PRECIO</th>
                      <th>UNIDADES</th>
                      <th>ESTADO</th>
                      <th>ACCIONES</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProducts.map((product) => {
                      const stock = Number(product.stock);
                      const status = getStockStatus(stock);

                      return (
                        <tr key={product.id}>
                          <td>
                            <div className="product-cell">
                              <span
                                className="product-avatar"
                                aria-hidden="true"
                              >
                                {product.name?.trim().charAt(0).toUpperCase() ||
                                  "P"}
                              </span>

                              <span className="product-copy">
                                <strong>{product.name}</strong>

                                <small
                                  title={
                                    product.description || "Sin descripción"
                                  }
                                >
                                  {product.description || "Sin descripción"}
                                </small>
                              </span>
                            </div>
                          </td>

                          <td className="cell-muted">#{product.id}</td>

                          <td>
                            <span className="category-badge">
                              {product.category || "Sin categoría"}
                            </span>
                          </td>

                          <td className="cell-price">
                            {formatPrice(product.price)}
                          </td>

                          <td>{stock}</td>

                          <td>
                            <span className={`stock-badge ${status.className}`}>
                              {status.label}
                            </span>
                          </td>

                          <td>
                            <div className="row-actions">
                              <button
                                type="button"
                                className="action-edit"
                                onClick={() => openEditForm(product)}
                                disabled={deletingId !== null}
                              >
                                Editar
                              </button>

                              <button
                                type="button"
                                className="action-delete"
                                onClick={() => requestDelete(product)}
                                disabled={deletingId !== null}
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="panel-footer">
              Mostrando {filteredProducts.length} de {products.length} productos
            </div>
          </section>
        </main>
      </div>

      {/* Ventana para crear o editar */}
      {isFormOpen && (
        <div className="modal-backdrop">
          <div
            className="form-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-dialog-title"
          >
            <ProductForm
              key={editingProduct?.id ?? "new"}
              editingProduct={editingProduct}
              onProductCreated={handleProductCreated}
              onProductUpdated={handleProductUpdated}
              onCancelEdit={closeForm}
            />
          </div>
        </div>
      )}

      {/* Ventana para confirmar eliminación */}
      {productToDelete && (
        <div className="modal-backdrop">
          <div
            className="confirm-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            aria-describedby="delete-description"
          >
            <div className="danger-icon" aria-hidden="true">
              !
            </div>

            <h2 id="delete-title">¿Eliminar producto?</h2>

            <p id="delete-description">
              Estás a punto de eliminar <strong>{productToDelete.name}</strong>.
              Esta acción no se puede deshacer.
            </p>

            <div className="dialog-actions">
              <button
                type="button"
                className="button-outline"
                onClick={() => setProductToDelete(null)}
                disabled={deletingId !== null}
                autoFocus
              >
                Cancelar
              </button>

              <button
                type="button"
                className="button-danger"
                onClick={confirmDelete}
                disabled={deletingId !== null}
              >
                {deletingId !== null ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
