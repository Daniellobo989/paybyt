import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Produtos</h2>
      <ul>
        {products.map(product => (
          <li key={product._id} className="mb-2 p-2 border rounded">
            <strong>{product.name}</strong> - R$ {product.price}
            <br />
            <span className="text-sm text-gray-600">Vendedor: 
{product.seller?.name}</span>
            <br />
            <span className="text-sm">{product.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;
