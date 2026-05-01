import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) { setError(err.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'16px', padding:'40px', width:'100%', maxWidth:'400px' }}>
        <h1 style={{ fontSize:'24px', fontWeight:'600', marginBottom:'8px' }}>Create account</h1>
        <p style={{ color:'var(--muted)', fontSize:'14px', marginBottom:'28px' }}>Get started for free</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="John Doe" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Min 6 characters" required />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="btn-primary" style={{ width:'100%', marginTop:'8px', padding:'12px' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p style={{ textAlign:'center', marginTop:'20px', fontSize:'14px', color:'var(--muted)' }}>
          Have an account? <Link to="/login" style={{ color:'var(--accent)' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}