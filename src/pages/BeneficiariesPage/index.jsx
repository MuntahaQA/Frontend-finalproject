import React, { useState, useEffect } from "react";
import sendRequest from "../../utilities/sendRequest";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "./styles.css";

export default function BeneficiariesPage() {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBeneficiary, setEditingBeneficiary] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [newBeneficiary, setNewBeneficiary] = useState({
    user: {
      username: "",
      email: "",
      password: "",
      first_name: "",
      last_name: "",
    },
    national_id: "",
    phone: "",
    address: "",
    city: "",
    region: "",
    date_of_birth: "",
    family_size: "",
    monthly_income: "",
    special_needs: "",
  });

  async function fetchBeneficiaries() {
    try {
      setLoading(true);
      setErrorMessage(null);

      const data = await sendRequest("/beneficiaries/", "GET");

      let beneficiariesList = [];
      if (data && data.results) {
        beneficiariesList = data.results;
      } else if (Array.isArray(data)) {
        beneficiariesList = data;
      }

      setBeneficiaries(beneficiariesList);
    } catch (error) {
      console.error("Error fetching beneficiaries:", error);
      const readable = error.message || "Failed to load beneficiaries. Please try again later.";
      setErrorMessage(readable);
      setBeneficiaries([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  async function handleCreateBeneficiary(event) {
    event.preventDefault();
    try {
      const userData = {
        email: newBeneficiary.user.email,
        password: newBeneficiary.user.password,
        first_name: newBeneficiary.user.first_name,
        last_name: newBeneficiary.user.last_name,
      };

      if (
        newBeneficiary.user.username &&
        newBeneficiary.user.username !== newBeneficiary.user.email.split("@")[0]
      ) {
        userData.username = newBeneficiary.user.username;
      }

      const beneficiaryData = {
        user: userData,
        national_id: newBeneficiary.national_id,
        phone: newBeneficiary.phone,
        address: newBeneficiary.address,
        city: newBeneficiary.city,
        region: newBeneficiary.region,
        date_of_birth: newBeneficiary.date_of_birth,
        family_size: parseInt(newBeneficiary.family_size) || 1,
        monthly_income: parseFloat(newBeneficiary.monthly_income) || 0,
        special_needs: newBeneficiary.special_needs || "",
      };

      const created = await sendRequest("/beneficiaries/", "POST", beneficiaryData);

      if (created) {
        setBeneficiaries((currentList) => {
          const withoutDuplicate = currentList.filter((b) => b.id !== created.id);
          return [created, ...withoutDuplicate];
        });
      }

      setShowCreateForm(false);
      setNewBeneficiary({
        user: {
          username: "",
          email: "",
          password: "",
          first_name: "",
          last_name: "",
        },
        national_id: "",
        phone: "",
        address: "",
        city: "",
        region: "",
        date_of_birth: "",
        family_size: "",
        monthly_income: "",
        special_needs: "",
      });
      setErrorMessage(null);

      await fetchBeneficiaries();
    } catch (error) {
      console.error("Error creating beneficiary:", error);
      setErrorMessage(error.message || "Failed to create beneficiary. Please try again.");
    }
  }

  function handleEditBeneficiary(beneficiary) {
    setEditingBeneficiary({
      id: beneficiary.id,
      user: {
        username: beneficiary.user?.username || "",
        email: beneficiary.user?.email || "",
        first_name: beneficiary.user?.first_name || "",
        last_name: beneficiary.user?.last_name || "",
      },
      national_id: beneficiary.national_id || "",
      phone: beneficiary.phone || "",
      address: beneficiary.address || "",
      city: beneficiary.city || "",
      region: beneficiary.region || "",
      date_of_birth: beneficiary.date_of_birth ? beneficiary.date_of_birth.split("T")[0] : "",
      family_size: beneficiary.family_size || "",
      monthly_income: beneficiary.monthly_income || "",
      special_needs: beneficiary.special_needs || "",
    });
    setShowCreateForm(false);
  }

  async function handleUpdateBeneficiary(event) {
    event.preventDefault();
    try {
      const beneficiaryData = {
        user: {
          first_name: editingBeneficiary.user.first_name,
          last_name: editingBeneficiary.user.last_name,
        },
        national_id: editingBeneficiary.national_id,
        phone: editingBeneficiary.phone,
        address: editingBeneficiary.address,
        city: editingBeneficiary.city,
        region: editingBeneficiary.region,
        date_of_birth: editingBeneficiary.date_of_birth,
        family_size: parseInt(editingBeneficiary.family_size) || 1,
        monthly_income: parseFloat(editingBeneficiary.monthly_income) || 0,
        special_needs: editingBeneficiary.special_needs || "",
      };

      const updated = await sendRequest(
        `/beneficiaries/${editingBeneficiary.id}/`,
        "PUT",
        beneficiaryData
      );

      if (updated) {
        setBeneficiaries((currentList) =>
          currentList.map((b) => (b.id === editingBeneficiary.id ? updated : b))
        );
      }

      setEditingBeneficiary(null);
      setErrorMessage(null);

      await fetchBeneficiaries();
    } catch (error) {
      console.error("Error updating beneficiary:", error);
      setErrorMessage(error.message || "Failed to update beneficiary. Please try again.");
    }
  }

  async function handleDeleteBeneficiary(beneficiaryId) {
    try {
      await sendRequest(`/beneficiaries/${beneficiaryId}/`, "DELETE");

      setBeneficiaries((currentList) => currentList.filter((b) => b.id !== beneficiaryId));

      setDeleteConfirmId(null);
      setErrorMessage(null);

      await fetchBeneficiaries();
    } catch (error) {
      console.error("Error deleting beneficiary:", error);
      setErrorMessage(error.message || "Failed to delete beneficiary. Please try again.");
    }
  }

  return (
    <main className="beneficiaries-page">
      <Navbar />

      <section className="beneficiaries-page__content">
        <div className="container">
          <div className="dashboard-header">
            <div>
              <h2 className="title dashboard-title">Manage Beneficiaries</h2>
              <p className="dashboard-subtitle">
                Add and manage beneficiaries for your charity.
              </p>
            </div>

            <div className="dashboard-header-actions">
              <button
                className="button button--primary"
                onClick={() => {
                  setShowCreateForm(!showCreateForm);
                  setEditingBeneficiary(null);
                }}
              >
                {showCreateForm ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    Cancel
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add Beneficiary
                  </>
                )}
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="beneficiaries-page__error" style={{ marginBottom: "1.5rem" }}>
              <p>{errorMessage}</p>
            </div>
          )}

          {(showCreateForm || editingBeneficiary) && (
            <div className="beneficiary-form-card">
              <h3>{editingBeneficiary ? "Edit Beneficiary" : "Add New Beneficiary"}</h3>

              <form onSubmit={editingBeneficiary ? handleUpdateBeneficiary : handleCreateBeneficiary}>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      value={
                        editingBeneficiary
                          ? editingBeneficiary.user.first_name
                          : newBeneficiary.user.first_name
                      }
                      onChange={(event) =>
                        editingBeneficiary
                          ? setEditingBeneficiary({
                            ...editingBeneficiary,
                            user: { ...editingBeneficiary.user, first_name: event.target.value },
                          })
                          : setNewBeneficiary({
                            ...newBeneficiary,
                            user: { ...newBeneficiary.user, first_name: event.target.value },
                          })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      value={
                        editingBeneficiary
                          ? editingBeneficiary.user.last_name
                          : newBeneficiary.user.last_name
                      }
                      onChange={(event) =>
                        editingBeneficiary
                          ? setEditingBeneficiary({
                            ...editingBeneficiary,
                            user: { ...editingBeneficiary.user, last_name: event.target.value },
                          })
                          : setNewBeneficiary({
                            ...newBeneficiary,
                            user: { ...newBeneficiary.user, last_name: event.target.value },
                          })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={
                        editingBeneficiary ? editingBeneficiary.user.email : newBeneficiary.user.email
                      }
                      onChange={(event) =>
                        editingBeneficiary
                          ? setEditingBeneficiary({
                            ...editingBeneficiary,
                            user: { ...editingBeneficiary.user, email: event.target.value },
                          })
                          : setNewBeneficiary({
                            ...newBeneficiary,
                            user: { ...newBeneficiary.user, email: event.target.value },
                          })
                      }
                      required
                      disabled={!!editingBeneficiary}
                    />
                  </div>

                  {!editingBeneficiary && (
                    <div className="form-group">
                      <label>Password *</label>
                      <input
                        type="password"
                        value={newBeneficiary.user.password}
                        onChange={(event) =>
                          setNewBeneficiary({
                            ...newBeneficiary,
                            user: { ...newBeneficiary.user, password: event.target.value },
                          })
                        }
                        required
                      />
                    </div>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>National ID *</label>
                    <input
                      type="text"
                      value={
                        editingBeneficiary ? editingBeneficiary.national_id : newBeneficiary.national_id
                      }
                      onChange={(event) =>
                        editingBeneficiary
                          ? setEditingBeneficiary({ ...editingBeneficiary, national_id: event.target.value })
                          : setNewBeneficiary({ ...newBeneficiary, national_id: event.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone *</label>
                    <input
                      type="tel"
                      value={editingBeneficiary ? editingBeneficiary.phone : newBeneficiary.phone}
                      onChange={(event) =>
                        editingBeneficiary
                          ? setEditingBeneficiary({ ...editingBeneficiary, phone: event.target.value })
                          : setNewBeneficiary({ ...newBeneficiary, phone: event.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Address *</label>
                  <input
                    type="text"
                    value={editingBeneficiary ? editingBeneficiary.address : newBeneficiary.address}
                    onChange={(event) =>
                      editingBeneficiary
                        ? setEditingBeneficiary({ ...editingBeneficiary, address: event.target.value })
                        : setNewBeneficiary({ ...newBeneficiary, address: event.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      value={editingBeneficiary ? editingBeneficiary.city : newBeneficiary.city}
                      onChange={(event) =>
                        editingBeneficiary
                          ? setEditingBeneficiary({ ...editingBeneficiary, city: event.target.value })
                          : setNewBeneficiary({ ...newBeneficiary, city: event.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Region *</label>
                    <input
                      type="text"
                      value={editingBeneficiary ? editingBeneficiary.region : newBeneficiary.region}
                      onChange={(event) =>
                        editingBeneficiary
                          ? setEditingBeneficiary({ ...editingBeneficiary, region: event.target.value })
                          : setNewBeneficiary({ ...newBeneficiary, region: event.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Date of Birth *</label>
                    <input
                      type="date"
                      value={
                        editingBeneficiary ? editingBeneficiary.date_of_birth : newBeneficiary.date_of_birth
                      }
                      onChange={(event) =>
                        editingBeneficiary
                          ? setEditingBeneficiary({ ...editingBeneficiary, date_of_birth: event.target.value })
                          : setNewBeneficiary({ ...newBeneficiary, date_of_birth: event.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Family Size *</label>
                    <input
                      type="number"
                      min="1"
                      value={
                        editingBeneficiary ? editingBeneficiary.family_size : newBeneficiary.family_size
                      }
                      onChange={(event) =>
                        editingBeneficiary
                          ? setEditingBeneficiary({ ...editingBeneficiary, family_size: event.target.value })
                          : setNewBeneficiary({ ...newBeneficiary, family_size: event.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Monthly Income *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      editingBeneficiary ? editingBeneficiary.monthly_income : newBeneficiary.monthly_income
                    }
                    onChange={(event) =>
                      editingBeneficiary
                        ? setEditingBeneficiary({ ...editingBeneficiary, monthly_income: event.target.value })
                        : setNewBeneficiary({ ...newBeneficiary, monthly_income: event.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Special Needs</label>
                  <textarea
                    rows="3"
                    value={
                      editingBeneficiary ? editingBeneficiary.special_needs : newBeneficiary.special_needs
                    }
                    onChange={(event) =>
                      editingBeneficiary
                        ? setEditingBeneficiary({ ...editingBeneficiary, special_needs: event.target.value })
                        : setNewBeneficiary({ ...newBeneficiary, special_needs: event.target.value })
                    }
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="button button--primary">
                    {editingBeneficiary ? "Update Beneficiary" : "Create Beneficiary"}
                  </button>
                  <button
                    type="button"
                    className="button button--secondary"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingBeneficiary(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div className="loading-spinner">
              <p>Loading beneficiaries...</p>
            </div>
          ) : beneficiaries.length === 0 ? (
            <div className="empty-state">
              <h3>No Beneficiaries Available</h3>
              <p>There are currently no beneficiaries registered. Add a new beneficiary to get started.</p>
            </div>
          ) : (
            <div className="beneficiaries-grid">
              {beneficiaries.map((beneficiary) => (
                <div key={beneficiary.id} className="beneficiary-card">
                  <div className="beneficiary-card__header">
                    <h3>
                      {beneficiary.user?.first_name} {beneficiary.user?.last_name}
                    </h3>
                    <div className="beneficiary-card__actions">
                      <button
                        className="button-icon"
                        onClick={() => handleEditBeneficiary(beneficiary)}
                        title="Edit Beneficiary"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button
                        className="button-icon button-icon--danger"
                        onClick={() => setDeleteConfirmId(beneficiary.id)}
                        title="Delete Beneficiary"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="beneficiary-card__body">
                    <div className="beneficiary-info">
                      <p><strong>Email:</strong> {beneficiary.user?.email}</p>
                      <p><strong>National ID:</strong> {beneficiary.national_id}</p>
                      <p><strong>Phone:</strong> {beneficiary.phone}</p>
                      <p><strong>Address:</strong> {beneficiary.address}, {beneficiary.city}, {beneficiary.region}</p>
                      <p><strong>Date of Birth:</strong> {beneficiary.date_of_birth ? new Date(beneficiary.date_of_birth).toLocaleDateString() : "N/A"}</p>
                      <p><strong>Family Size:</strong> {beneficiary.family_size}</p>
                      <p><strong>Monthly Income:</strong> {beneficiary.monthly_income ? `SAR ${parseFloat(beneficiary.monthly_income).toFixed(2)}` : "N/A"}</p>
                      {beneficiary.special_needs && (
                        <p><strong>Special Needs:</strong> {beneficiary.special_needs}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {deleteConfirmId && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>Confirm Delete</h3>
                <p>Are you sure you want to delete this beneficiary? This action cannot be undone.</p>
                <div className="modal-actions">
                  <button
                    className="button button--danger"
                    onClick={() => handleDeleteBeneficiary(deleteConfirmId)}
                  >
                    Delete
                  </button>
                  <button
                    className="button button--secondary"
                    onClick={() => setDeleteConfirmId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
