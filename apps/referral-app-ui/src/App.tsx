import './App.css';
import ReferralList from './components/ReferralList';

function App() {
  return (
    <div className='min-h-screen bg-gray-100'>
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-4xl font-bold text-center text-blue-600 mb-8'>Referral List</h1>

        <ReferralList />
      </div>
    </div>
  );
}

export default App;
