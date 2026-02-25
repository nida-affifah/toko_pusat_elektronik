import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import api from "../utils/api";
import "./produk.css";

function Produk() {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    nama_produk: "",
    harga: "",
    stok: "",
    id_kategori: "",
    id_supplier: "",
    gambar: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "/";
    fetchData();
  }, []);

  const fetchData = () => {
    api.get("/produk")
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nama_produk", form.nama_produk);
    formData.append("harga", form.harga);
    formData.append("stok", form.stok);
    formData.append("id_kategori", form.id_kategori);
    formData.append("id_supplier", form.id_supplier);
    if (form.gambar) formData.append("gambar", form.gambar);

    try {
      if (editId) {
        await api.put(`/produk/${editId}`, formData);
        alert("Produk berhasil diupdate");
      } else {
        await api.post("/produk", formData);
        alert("Produk berhasil ditambahkan");
      }

      setShowForm(false);
      setEditId(null);
      setForm({
        nama_produk: "",
        harga: "",
        stok: "",
        id_kategori: "",
        id_supplier: "",
        gambar: null,
      });
      setPreview(null);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Terjadi error");
    }
  };

  // ================= EDIT =================
  const handleEdit = (item) => {
    setForm({
      nama_produk: item.nama_produk,
      harga: item.harga,
      stok: item.stok,
      id_kategori: item.id_kategori || "",
      id_supplier: item.id_supplier || "",
      gambar: null,
    });

    setPreview(item.gambar_url);
    setEditId(item.id_produk);
    setShowForm(true);
  };

  // ================= DELETE =================
  const handleDelete = (id) => {
    if (confirm("Hapus produk?")) {
      api.delete(`/produk/${id}`).then(() => {
        alert("Produk dihapus");
        fetchData();
      });
    }
  };

  // ================= IMAGE =================
  const handleImage = (file) => {
    setForm({ ...form, gambar: file });
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="container">
      <Sidebar />

      <div className="content">
        <div className="header">
          <h1>Produk</h1>
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            + Tambah Produk
          </button>
        </div>

        <div className="product-grid">
          {data.map(item => (
            <div className="product-card" key={item.id_produk}>
              <div className="product-image">
                <img
                  src={item.gambar_url || "https://via.placeholder.com/300x200"}
                  alt={item.nama_produk}
                />
              </div>

              <div className="product-body">
                <div className="product-title">{item.nama_produk}</div>
                <div>Rp {item.harga}</div>
                <div>Stok: {item.stok}</div>

                <div className="product-actions">
                  <button onClick={() => handleEdit(item)}>Edit</button>
                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(item.id_produk)}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ================= MODAL ================= */}
        {showForm && (
          <div className="modal">
            <form className="modal-content" onSubmit={handleSubmit}>
              <h2>{editId ? "Edit Produk" : "Tambah Produk"}</h2>

              <input
                type="text"
                placeholder="Nama produk"
                value={form.nama_produk}
                onChange={(e) =>
                  setForm({ ...form, nama_produk: e.target.value })
                }
                required
              />

              <input
                type="number"
                placeholder="Harga"
                value={form.harga}
                onChange={(e) =>
                  setForm({ ...form, harga: e.target.value })
                }
                required
              />

              <input
                type="number"
                placeholder="Stok"
                value={form.stok}
                onChange={(e) =>
                  setForm({ ...form, stok: e.target.value })
                }
                required
              />

              <input
                type="number"
                placeholder="ID Kategori"
                value={form.id_kategori}
                onChange={(e) =>
                  setForm({ ...form, id_kategori: e.target.value })
                }
                required
              />

              <input
                type="number"
                placeholder="ID Supplier"
                value={form.id_supplier}
                onChange={(e) =>
                  setForm({ ...form, id_supplier: e.target.value })
                }
                required
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImage(e.target.files[0])}
              />

              {preview && (
                <img className="preview" src={preview} alt="preview" />
              )}

              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  Simpan
                </button>
                <button type="button" onClick={() => setShowForm(false)}>
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Produk;