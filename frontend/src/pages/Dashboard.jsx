import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const STATUSES = ['pending', 'in_progress', 'completed'];
const PRIORITIES = ['low', 'medium', 'high'];
const statusColor = { pending:'#f0a050', in_progress:'#6c63ff', completed:'#4caf89' };
const priorityColor = { low:'#4caf89', medium:'#f0a050', high:'#e25e6a' };

function TaskModal({ task, onClose, onSave }) {
  const [form, setForm] = useState({
    title: task?.title||'', description: task?.description||'',
    status: task?.status||'pending', priority: task?.priority||'medium', dueDate: task?.dueDate||'',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const { data } = task
        ? await api.put(`/tasks/${task.id}`, form)
        : await api.post('/tasks', form);
      onSave(data.data); onClose();
    } catch (err) { setError(err.response?.data?.message || 'Failed to save'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, padding:'20px' }}>
      <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:'16px', padding:'32px', width:'100%', maxWidth:'480px' }}>
        <h2 style={{ marginBottom:'24px', fontSize:'18px' }}>{task ? 'Edit Task' : 'New Task'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input value={form.title} onChange={e => setForm({...form, title:e.target.value})} placeholder="Task title" required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={form.description} onChange={e => setForm({...form, description:e.target.value})} rows={3} style={{ resize:'vertical' }} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <div className="form-group">
              <label>Status</label>
              <select value={form.status} onChange={e => setForm({...form, status:e.target.value})}>
                {STATUSES.map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select value={form.priority} onChange={e => setForm({...form, priority:e.target.value})}>
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Due Date</label>
            <input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate:e.target.value})} />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <div style={{ display:'flex', gap:'10px', justifyContent:'flex-end', marginTop:'8px' }}>
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Task'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState({ status:'', priority:'' });

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.status) params.status = filter.status;
      if (filter.priority) params.priority = filter.priority;
      const { data } = await api.get('/tasks', { params });
      setTasks(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTasks(); }, [filter]);

  const handleSave = (saved) => {
    setTasks(prev => {
      const idx = prev.findIndex(t => t.id === saved.id);
      if (idx >= 0) { const n=[...prev]; n[idx]=saved; return n; }
      return [saved, ...prev];
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try { await api.delete(`/tasks/${id}`); setTasks(p => p.filter(t => t.id !== id)); }
    catch { alert('Delete failed'); }
  };

  return (
    <div style={{ minHeight:'100vh' }}>
      <nav style={{ background:'var(--surface)', borderBottom:'1px solid var(--border)', padding:'0 24px', height:'60px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ fontWeight:'600', fontSize:'18px', color:'var(--accent)' }}>Primetrade</span>
        <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
          <span style={{ fontSize:'14px', color:'var(--muted)' }}>
            {user.name}
            <span style={{ background:'var(--accent)', color:'#fff', fontSize:'11px', padding:'2px 8px', borderRadius:'20px', marginLeft:'6px' }}>{user.role}</span>
          </span>
          <button className="btn-ghost" onClick={() => { localStorage.clear(); navigate('/login'); }} style={{ padding:'6px 14px' }}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'32px 24px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
          <div>
            <h1 style={{ fontSize:'22px', fontWeight:'600' }}>My Tasks</h1>
            <p style={{ color:'var(--muted)', fontSize:'14px', marginTop:'4px' }}>{tasks.length} total</p>
          </div>
          <button className="btn-primary" onClick={() => { setEditingTask(null); setModalOpen(true); }}>+ New Task</button>
        </div>

        <div style={{ display:'flex', gap:'12px', marginBottom:'24px', flexWrap:'wrap' }}>
          <select value={filter.status} onChange={e => setFilter({...filter, status:e.target.value})} style={{ width:'auto', minWidth:'150px' }}>
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
          </select>
          <select value={filter.priority} onChange={e => setFilter({...filter, priority:e.target.value})} style={{ width:'auto', minWidth:'150px' }}>
            <option value="">All Priorities</option>
            {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          {(filter.status||filter.priority) && (
            <button className="btn-ghost" onClick={() => setFilter({status:'',priority:''})} style={{ padding:'8px 14px' }}>Clear</button>
          )}
        </div>

        {loading ? (
          <p style={{ color:'var(--muted)', textAlign:'center', padding:'60px 0' }}>Loading...</p>
        ) : tasks.length === 0 ? (
          <p style={{ color:'var(--muted)', textAlign:'center', padding:'60px 0' }}>No tasks yet. Create one!</p>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'16px' }}>
            {tasks.map(task => (
              <div key={task.id} style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:'12px', padding:'20px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' }}>
                  <h3 style={{ fontSize:'15px', fontWeight:'500', flex:1, paddingRight:'8px' }}>{task.title}</h3>
                  <div style={{ display:'flex', gap:'6px' }}>
                    <button className="btn-ghost" onClick={() => { setEditingTask(task); setModalOpen(true); }} style={{ padding:'4px 10px', fontSize:'12px' }}>Edit</button>
                    <button className="btn-danger" onClick={() => handleDelete(task.id)} style={{ padding:'4px 10px', fontSize:'12px' }}>Del</button>
                  </div>
                </div>
                {task.description && <p style={{ fontSize:'13px', color:'var(--muted)', marginBottom:'12px', lineHeight:'1.5' }}>{task.description}</p>}
                <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                  <span style={{ fontSize:'11px', padding:'3px 10px', borderRadius:'20px', background:statusColor[task.status]+'22', color:statusColor[task.status] }}>{task.status.replace('_',' ')}</span>
                  <span style={{ fontSize:'11px', padding:'3px 10px', borderRadius:'20px', background:priorityColor[task.priority]+'22', color:priorityColor[task.priority] }}>{task.priority}</span>
                  {task.dueDate && <span style={{ fontSize:'11px', color:'var(--muted)' }}>Due: {task.dueDate}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <TaskModal task={editingTask} onClose={() => { setModalOpen(false); setEditingTask(null); }} onSave={handleSave} />
      )}
    </div>
  );
}