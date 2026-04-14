import React, { useState } from 'react';
import { User, Camera, Save, ArrowLeft } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { admin, updateAdmin } = useAdmin();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: admin.name,
    designation: admin.designation
  });
  const [preview, setPreview] = useState(admin.photo);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxSize = 300;

          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          setPreview(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateAdmin({
      ...formData,
      photo: preview,
      initials: formData.name.charAt(0).toUpperCase()
    });
    alert('Profile updated successfully!');
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          <button 
            onClick={() => navigate(-1)} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
          >
            <ArrowLeft size={24} style={{ marginRight: '0.5rem' }} />
          </button>
          Admin Profile Settings
        </h1>
      </div>

      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="card-header">
          <h2>Update Administrator Details</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
              <div style={{ position: 'relative' }}>
                <div 
                  className="avatar" 
                  style={{ 
                    width: '120px', 
                    height: '120px', 
                    fontSize: '3rem', 
                    overflow: 'hidden',
                    border: '4px solid var(--border)' 
                  }}
                >
                  {preview ? (
                    <img 
                      src={preview} 
                      alt="Profile" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    admin.initials
                  )}
                </div>
                <label 
                  htmlFor="photo-upload" 
                  style={{ 
                    position: 'absolute', 
                    bottom: '0', 
                    right: '0', 
                    backgroundColor: 'var(--primary)', 
                    color: 'white', 
                    padding: '0.5rem', 
                    borderRadius: '50%', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  <Camera size={18} />
                </label>
                <input 
                  id="photo-upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoChange} 
                  style={{ display: 'none' }} 
                />
              </div>
              <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Click the camera icon to update photo
              </p>
            </div>

            <div className="form-group">
              <label className="label">Full Name</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="label">Designation</label>
              <input 
                type="text" 
                value={formData.designation} 
                onChange={(e) => setFormData({...formData, designation: e.target.value})} 
                required 
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <button type="submit" className="btn-primary">
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
