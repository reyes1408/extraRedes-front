import UserCrud from './components/UserCrud';
import ProductCrud from './components/ProductCrud';

function App() {
  return (
    <div className="App">
      <div className="container mx-auto">
        <UserCrud />
        <ProductCrud />
      </div>
    </div>
  );
}

export default App;
