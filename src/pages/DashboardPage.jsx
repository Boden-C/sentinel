import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Components';

const DashboardPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white shadow-md rounded-lg w-80 text-center">
                <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                <div className="space-y-4">
                    <Button onClick={() => navigate('/reserve')}>Reserve</Button>
                    <Button onClick={() => navigate('/delete')}>Delete</Button>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
