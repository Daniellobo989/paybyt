import React, { useState } from 'react';
import axios from 'axios';

function ProductForm({ sellerId }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await 
axios.post('http://localhost:4000/api/products', {
        name,
        description,
        price: parseFloat(price),
        seller: sellerId
      });
      
      console.log('Resposta do servidor:', response.data);
      
      if (response.data.message) {
        alert('Produto cadastrado com sucesso!');
        setName('');
        setDescription('');
        setPrice('');
        window.location.reload(); // Recarrega a página para mostrar o novo produto;
      }
    } catch (err) {
      console.error('Erro detalhado:', err);
      alert('Erro ao cadastrar produto: ' + (err.response?.data?.error || 
err.message));
    }
  };

  return (
    <div className="mb-8 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Cadastrar 
Produto</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            className="w-full p-2 border border-gray-300 rounded 
focus:outline-none focus:border-blue-500"
            placeholder="Nome do produto"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <input
            className="w-full p-2 border border-gray-300 rounded 
focus:outline-none focus:border-blue-500"
            placeholder="Descrição"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <input
            className="w-full p-2 border border-gray-300 rounded 
focus:outline-none focus:border-blue-500"
            placeholder="Preço"
            type="number"
            step="0.01"
            value={price}
            onChange={e => setPrice(e.target.value)}
            required
          />
        </div>
        <button 
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded 
hover:bg-blue-700 transition-colors"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}

export default ProductForm;
