import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/Admin/AdminLayout';

function Admin({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <AdminLayout handleLogout={handleLogout} navigate={navigate}>
      {children}
    </AdminLayout>
  );
}

export default Admin;