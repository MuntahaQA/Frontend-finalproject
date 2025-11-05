import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import * as api from "../../utilities/api";
import "./styles.css";

export default function SignupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const urlType = searchParams.get("type");
  const initialUserType =
    urlType === "charity" || urlType === "ministry" ? urlType : "charity";

  const [userType, setUserType] = useState(initialUserType);
  const [showAlert, setShowAlert] = useState({
    show: false,
    type: "",
    message: "",
  });

  const [charityForm, setCharityForm] = useState({
    organization_name: "",
    registration_number: "",
    issuing_authority: "",
    charity_type: "HEALTH",
    custom_charity_type: "",
    email: "",
    phone: "",
    address: "",
    admin_name: "",
    password: "",
    confirmPassword: "",
    license_certificate: null,
    admin_id_document: null,
  });

  const [ministryForm, setMinistryForm] = useState({
    ministry_name: "",
    ministry_email: "",
    contact_number: "",
    ministry_code: "",
    responsible_person_name: "",
    position: "",
    password: "",
    confirmPassword: "",
    authorization_document: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "charity" || type === "ministry") {
      setUserType(type);
    }
  }, [searchParams]);

  function showAlertMessage(type, message) {
    setShowAlert({ show: true, type, message });
    setTimeout(
      () => setShowAlert({ show: false, type: "", message: "" }),
      5000
    );
  }

  function handleCharityChange(event) {
    const { name, value, files } = event.target;
    if (files && files[0]) {
      setCharityForm({ ...charityForm, [name]: files[0] });
    } else {
      setCharityForm({ ...charityForm, [name]: value });
    }
  }

  function handleMinistryChange(event) {
    const { name, value, files } = event.target;
    if (files && files[0]) {
      setMinistryForm({ ...ministryForm, [name]: files[0] });
    } else {
      setMinistryForm({ ...ministryForm, [name]: value });
    }
  }

  function validateCharityForm() {
    const newErrors = {};
    if (!charityForm.organization_name.trim())
      newErrors.organization_name = "Organization name is required";
    if (!charityForm.registration_number.trim())
      newErrors.registration_number = "Registration number is required";
    if (!charityForm.issuing_authority.trim())
      newErrors.issuing_authority = "Issuing authority is required";
    if (!charityForm.email.trim())
      newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(charityForm.email))
      newErrors.email = "Email is invalid";
    if (!charityForm.phone.trim()) newErrors.phone = "Phone is required";
    if (!charityForm.address.trim()) newErrors.address = "Address is required";
    if (!charityForm.admin_name.trim())
      newErrors.admin_name = "Admin name is required";
    if (
      charityForm.charity_type === "OTHER" &&
      !charityForm.custom_charity_type.trim()
    ) {
      newErrors.custom_charity_type = "Please specify the charity type";
    }
    if (!charityForm.password)
      newErrors.password = "Password is required";
    else if (charityForm.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (charityForm.password !== charityForm.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!charityForm.license_certificate)
      newErrors.license_certificate = "License certificate is required";
    if (!charityForm.admin_id_document)
      newErrors.admin_id_document = "Admin ID document is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function validateMinistryForm() {
    const newErrors = {};
    if (!ministryForm.ministry_name.trim())
      newErrors.ministry_name = "Ministry name is required";
    if (!ministryForm.ministry_email.trim())
      newErrors.ministry_email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(ministryForm.ministry_email))
      newErrors.ministry_email = "Email is invalid";
    if (!ministryForm.contact_number.trim())
      newErrors.contact_number = "Contact number is required";
    if (!ministryForm.ministry_code.trim())
      newErrors.ministry_code = "Ministry code is required";
    if (!ministryForm.responsible_person_name.trim())
      newErrors.responsible_person_name = "Responsible person name is required";
    if (!ministryForm.position.trim())
      newErrors.position = "Position is required";
    if (!ministryForm.password)
      newErrors.password = "Password is required";
    else if (ministryForm.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (ministryForm.password !== ministryForm.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!ministryForm.authorization_document)
      newErrors.authorization_document = "Authorization document is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleCharitySubmit(event) {
    event.preventDefault();
    if (!validateCharityForm()) return;
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(charityForm).forEach(([key, value]) => {
        if (key !== "confirmPassword") formData.append(key, value);
      });

      const result = await api.registerCharity(formData);

      showAlertMessage("success", "Registration successful! Pending approval.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("Registration error:", error);
      showAlertMessage("error", "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleMinistrySubmit(event) {
    event.preventDefault();
    if (!validateMinistryForm()) return;
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(ministryForm).forEach(([key, value]) => {
        if (key !== "confirmPassword") formData.append(key, value);
      });

      const result = await api.registerMinistry(formData);

      showAlertMessage("success", "Registration successful!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("Registration error:", error);
      showAlertMessage("error", "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="signup-page">
      <Navbar />

      {showAlert.show && (
        <div
          className={`alert ${showAlert.type === "success" ? "alert-success" : "alert-error"
            }`}
        >
          {showAlert.message}
        </div>
      )}

      <section className="signup-container">
        <div className="signup-card">
          <h1>Create an account</h1>
          <p className="signup-subtitle">Choose account type and complete the form below.</p>

          <div className="user-type-selector">
            <button
              type="button"
              className={`type-btn ${userType === 'charity' ? 'active' : ''}`}
              onClick={() => {
                setUserType('charity');
                navigate('/register?type=charity', { replace: false });
              }}
            >
              Charity
            </button>
            <button
              type="button"
              className={`type-btn ${userType === 'ministry' ? 'active' : ''}`}
              onClick={() => {
                setUserType('ministry');
                navigate('/register?type=ministry', { replace: false });
              }}
            >
              Ministry
            </button>
          </div>

          {userType === 'charity' && (
            <form className="signup-form" onSubmit={handleCharitySubmit} encType="multipart/form-data">
              <div className="form-group">
                <label>Organization Name</label>
                <input name="organization_name" value={charityForm.organization_name} onChange={handleCharityChange} />
                {errors.organization_name && <small className="error">{errors.organization_name}</small>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Registration Number</label>
                  <input name="registration_number" value={charityForm.registration_number} onChange={handleCharityChange} />
                  {errors.registration_number && <small className="error">{errors.registration_number}</small>}
                </div>
                <div className="form-group">
                  <label>Issuing Authority</label>
                  <input name="issuing_authority" value={charityForm.issuing_authority} onChange={handleCharityChange} />
                  {errors.issuing_authority && <small className="error">{errors.issuing_authority}</small>}
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={charityForm.email} onChange={handleCharityChange} />
                {errors.email && <small className="error">{errors.email}</small>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input name="phone" value={charityForm.phone} onChange={handleCharityChange} />
                  {errors.phone && <small className="error">{errors.phone}</small>}
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input name="address" value={charityForm.address} onChange={handleCharityChange} />
                  {errors.address && <small className="error">{errors.address}</small>}
                </div>
              </div>

              <div className="form-group">
                <label>Admin Name</label>
                <input name="admin_name" value={charityForm.admin_name} onChange={handleCharityChange} />
                {errors.admin_name && <small className="error">{errors.admin_name}</small>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" name="password" value={charityForm.password} onChange={handleCharityChange} />
                  {errors.password && <small className="error">{errors.password}</small>}
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input type="password" name="confirmPassword" value={charityForm.confirmPassword} onChange={handleCharityChange} />
                  {errors.confirmPassword && <small className="error">{errors.confirmPassword}</small>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>License Certificate</label>
                  <input type="file" name="license_certificate" onChange={handleCharityChange} />
                  {errors.license_certificate && <small className="error">{errors.license_certificate}</small>}
                </div>
                <div className="form-group">
                  <label>Admin ID Document</label>
                  <input type="file" name="admin_id_document" onChange={handleCharityChange} />
                  {errors.admin_id_document && <small className="error">{errors.admin_id_document}</small>}
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="button button--primary" disabled={loading}>
                  {loading ? 'Registering...' : 'Register Charity'}
                </button>
              </div>
            </form>
          )}

          {userType === 'ministry' && (
            <form className="signup-form" onSubmit={handleMinistrySubmit} encType="multipart/form-data">
              <div className="form-group">
                <label>Ministry Name</label>
                <input name="ministry_name" value={ministryForm.ministry_name} onChange={handleMinistryChange} />
                {errors.ministry_name && <small className="error">{errors.ministry_name}</small>}
              </div>

              <div className="form-group">
                <label>Email</label>
                <input type="email" name="ministry_email" value={ministryForm.ministry_email} onChange={handleMinistryChange} />
                {errors.ministry_email && <small className="error">{errors.ministry_email}</small>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Contact Number</label>
                  <input name="contact_number" value={ministryForm.contact_number} onChange={handleMinistryChange} />
                  {errors.contact_number && <small className="error">{errors.contact_number}</small>}
                </div>
                <div className="form-group">
                  <label>Ministry Code</label>
                  <input name="ministry_code" value={ministryForm.ministry_code} onChange={handleMinistryChange} />
                  {errors.ministry_code && <small className="error">{errors.ministry_code}</small>}
                </div>
              </div>

              <div className="form-group">
                <label>Responsible Person Name</label>
                <input name="responsible_person_name" value={ministryForm.responsible_person_name} onChange={handleMinistryChange} />
                {errors.responsible_person_name && <small className="error">{errors.responsible_person_name}</small>}
              </div>

              <div className="form-group">
                <label>Position</label>
                <input name="position" value={ministryForm.position} onChange={handleMinistryChange} />
                {errors.position && <small className="error">{errors.position}</small>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" name="password" value={ministryForm.password} onChange={handleMinistryChange} />
                  {errors.password && <small className="error">{errors.password}</small>}
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input type="password" name="confirmPassword" value={ministryForm.confirmPassword} onChange={handleMinistryChange} />
                  {errors.confirmPassword && <small className="error">{errors.confirmPassword}</small>}
                </div>
              </div>

              <div className="form-group">
                <label>Authorization Document</label>
                <input type="file" name="authorization_document" onChange={handleMinistryChange} />
                {errors.authorization_document && <small className="error">{errors.authorization_document}</small>}
              </div>

              <div className="form-actions">
                <button type="submit" className="button button--primary" disabled={loading}>
                  {loading ? 'Registering...' : 'Register Ministry'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
