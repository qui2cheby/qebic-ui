import React, {useEffect, useState} from 'react'
import { listProducts, saveProduct, updateProduct, deleteProduct, listCategories } from '../services/ProductService';

const initialForm = {
    barcode: '',
    description: '',
    brand: '',
    presentation: '',
    detail: '',
    unitPrice: '',
    category_uuid: '',
    active: true,
};

const ListProductsComponent = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState(initialForm);
    const [editingProduct, setEditingProduct] = useState(null);

    const fetchProducts = () => {
        listProducts()
            .then((response) => {
                const payload = response.data;
                const items = Array.isArray(payload?.datos) ? payload.datos : [];
                setProducts(items);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
                setProducts([]);
            });
    };

    const fetchCategories = () => {
        listCategories()
            .then((response) => {
                const payload = response.data;
                const items = Array.isArray(payload?.datos) ? payload.datos : [];
                setCategories(items);
            })
            .catch((error) => {
                console.error('Error fetching categories:', error);
                setCategories([]);
            });
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const productData = {
            ...(editingProduct ?? {}),
            description: formData.description,
            detail: formData.detail,
            presentation: formData.presentation,
            brand: formData.brand,
            barcode: formData.barcode,
            category: formData.category_uuid ? { uuid: formData.category_uuid } : null,
            companyUuid: editingProduct?.companyUuid ?? '1',
            direccionUuid: editingProduct?.direccionUuid ?? '1',
            unitPrice: Number(formData.unitPrice) || 0,
            active: editingProduct ? formData.active : String(formData.active),
        };

        const saveRequest = editingProduct ? updateProduct(productData) : saveProduct(productData);
        saveRequest
            .then(() => {
                setFormData(initialForm);
                setEditingProduct(null);
                setShowModal(false);
                fetchProducts();
            })
            .catch((error) => {
                console.error(editingProduct ? 'Error updating product:' : 'Error saving product:', error);
                alert(editingProduct ? 'No se pudo actualizar el producto' : 'No se pudo guardar el producto');
            });
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setFormData({
            barcode: product.barcode ?? '',
            description: product.description ?? '',
            brand: product.brand ?? '',
            presentation: product.presentation ?? '',
            detail: product.detail ?? '',
            unitPrice: product.unitPrice ?? '',
            category_uuid: product.category?.uuid ?? product.categoryUuid ?? '',
            active: product.active == null || product.active === true || product.active === 'true',
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingProduct(null);
        setFormData(initialForm);
    };

    const handleDeleteProduct = (productId) => {
        deleteProduct(productId)
            .then(() => {
                setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
            })
            .catch((error) => {
                console.error('Error deleting product:', error);
                alert('No se pudo eliminar el producto');
            });
    };

    return (
        <div className='container mt-4'>
            <div className='d-flex justify-content-between align-items-center mb-3'>
                <h2>Products</h2>
                <button className='btn btn-primary' onClick={() => setShowModal(true)}>
                    Nuevo producto
                </button>
            </div>

            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Barcode</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th style={{ width: '120px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan="4">No products available</td>
                        </tr>
                    ) : (
                        products.map(product => {
                            const productId = product.id;
                            return (
                                <tr key={productId}>
                                    <td>{product.barcode}</td>
                                    <td>{product.description}</td>
                                    <td>${Number(product.unitPrice ?? 0).toFixed(2)}</td>
                                    <td>
                                        <button
                                            type='button'
                                            className='btn btn-outline-primary btn-sm me-1'
                                            onClick={() => handleEditProduct(product)}
                                            title='Edit product'
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type='button'
                                            className='btn btn-danger btn-sm'
                                            onClick={() => handleDeleteProduct(productId)}
                                            title='Delete product'
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>

            {showModal && (
                <div className='modal d-block' style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className='modal-dialog modal-lg modal-dialog-centered'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h5 className='modal-title'>{editingProduct ? 'Editar producto' : 'Nuevo producto'}</h5>
                                <button
                                    type='button'
                                    className='btn-close'
                                    onClick={handleCloseModal}
                                ></button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className='modal-body'>
                                    <div className='row g-3'>
                                        <div className='col-md-6'>
                                            <label className='form-label'>Barcode</label>
                                            <input
                                                type='text'
                                                className='form-control'
                                                name='barcode'
                                                value={formData.barcode}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div className='col-md-6'>
                                            <label className='form-label'>Description</label>
                                            <input
                                                type='text'
                                                className='form-control'
                                                name='description'
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div className='col-md-6'>
                                            <label className='form-label'>Brand</label>
                                            <input
                                                type='text'
                                                className='form-control'
                                                name='brand'
                                                value={formData.brand}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className='col-md-6'>
                                            <label className='form-label'>Presentation</label>
                                            <input
                                                type='text'
                                                className='form-control'
                                                name='presentation'
                                                value={formData.presentation}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className='col-md-12'>
                                            <label className='form-label'>Detail</label>
                                            <textarea
                                                className='form-control'
                                                rows='3'
                                                name='detail'
                                                value={formData.detail}
                                                onChange={handleInputChange}
                                            ></textarea>
                                        </div>

                                        <div className='col-md-6'>
                                            <label className='form-label'>Category</label>
                                            <select
                                                className='form-control'
                                                name='category_uuid'
                                                value={formData.category_uuid}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value=''>Select a category</option>
                                                {categories.map((category) => (
                                                    <option key={category.uuid} value={category.uuid}>
                                                        {category.description}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className='col-md-6'>
                                            <label className='form-label'>Price</label>
                                            <input
                                                type='number'
                                                className='form-control'
                                                name='unitPrice'
                                                min='0'
                                                step='0.01'
                                                value={formData.unitPrice}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div className='col-md-12 d-flex align-items-end'>
                                            <div className='form-check'>
                                                <input
                                                    className='form-check-input'
                                                    type='checkbox'
                                                    name='active'
                                                    checked={formData.active}
                                                    onChange={handleInputChange}
                                                    id='productActive'
                                                />
                                                <label className='form-check-label' htmlFor='productActive'>
                                                    Active
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='modal-footer'>
                                    <button
                                        type='button'
                                        className='btn btn-secondary'
                                        onClick={handleCloseModal}
                                    >
                                        Cancelar
                                    </button>
                                    <button type='submit' className='btn btn-success'>
                                        {editingProduct ? 'Actualizar' : 'Guardar'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ListProductsComponent