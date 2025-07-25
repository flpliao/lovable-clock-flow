import { Toaster } from '@/components/ui/toaster';
import AppRoutes from '@/routes/AppRoutes';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <AppRoutes />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
