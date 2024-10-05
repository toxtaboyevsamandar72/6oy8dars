import React, { useEffect, useState, useRef } from 'react';

const Card = () => {
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const productRef = useRef([]);

  const nameRef = useRef(null); 
  const priceRef = useRef(null); 
  const descriptionRef = useRef(null); 

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); 
      try {
        const response = await fetch('https://auth-rg69.onrender.com/api/products/all');
        if (!response.ok) {
          throw new Error('Network response was not ok'); 
        }
        const data = await response.json(); 
        setProducts(data); 
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts(); 
  }, []); 

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    const newProduct = {
      name: nameRef.current.value,
      price: parseFloat(priceRef.current.value),
      description: descriptionRef.current.value,
    };

    try {
      const response = await fetch('https://auth-rg69.onrender.com/api/products/private', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error('Failed to add product'); 
      }

      const data = await response.json(); 
      setProducts(prevProducts => [...prevProducts, data]);

      
      nameRef.current.value = '';
      priceRef.current.value = '';
      descriptionRef.current.value = '';
      setErrorMessage(''); 
    } catch (error) {
      setErrorMessage('Error adding product: ' + error.message); 
    }
  };

  if (loading) {
    return <div className="text-center text-xl">Loading...</div>; 
  }

  return (
    <div className="p-36">
     
      <div className="mb-8">
        <form onSubmit={handleSubmit} className="bg-slate-600 p-4 rounded shadow w-1/3 mx-auto">
          
          <input
            ref={nameRef}
            type="text"
            placeholder="Product Name"
            className="border p-2 rounded mb-2 w-full"
            required
          />
          <input
            ref={priceRef}
            type="number"
            placeholder="Product Price"
            className="border p-2 rounded mb-2 w-full"
            required
          />
          <textarea
            ref={descriptionRef}
            placeholder="Product Description"
            className="border p-2 rounded mb-2 w-full"
            required
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded ">Save</button>
        </form>

        
        
      </div>

     
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product, index) => (
          <div
            key={product.id}
            ref={(el) => (productRef.current[index] = el)} 
            className="border p-4 rounded shadow bg-slate-400 text-yellow-700 mb-4"
          >
            <h2 className="text-lg font-bold text-blue-800">Name: {product.name}</h2>
            <p className="text-yellow-700">Description: {product.description}</p>
            <p className="text-lg font-semibold">Price: {`$${product.price}`}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
