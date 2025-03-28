import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/scanfood/scan-food';
const MENU_API_URL = 'http://localhost:8000/menu/menuItems';

const Imagescan = () => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        // Fetch all menu items on component mount
        axios.get(MENU_API_URL)
            .then(response => {
                if (response.data.status) {
                    setMenuItems(response.data.AllmenuItems);
                }
            })
            .catch(error => {
                console.error('Error fetching menu items:', error);
            });
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) return alert('Please select an image first!');

        setLoading(true);
        setResult(null);

        const formData = new FormData();
        formData.append('image', image);

        try {
            const response = await axios.post(`${API_URL}/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResult(response.data);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to analyze the image. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getMatchingMenuItems = () => {
        if (!result || !result.tags) return [];

        // Filter the menu items that match the result tags
        return menuItems.filter(item =>
            result.tags.some(tag =>
                item.menuItemDescription.toLowerCase().includes(tag.description.toLowerCase())
            )
        );
    };

    const matchingMenuItems = getMatchingMenuItems();

    return (
        <div className="alldiv" style={{ marginTop: '100px' }}>
            <div className="maintablecontainer">
                <div className="container mt-5">
                    <h1 className="text-center mb-4 text-primary">🍽️ Food Recognition</h1>
                    <form onSubmit={handleSubmit} className="mb-4">
                        <div className="input-group">
                            <input type="file" className="form-control" onChange={handleImageChange} accept="image/*" />
                            <button className="btn btn-success" type="submit">Scan Image</button>
                        </div>
                    </form>

                    <div className="row g-4">
                        {preview && (
                            <div className="col-md-6">
                                <div className="card p-3">
                                    <h3 className="text-center">Selected Image</h3>
                                    <img src={preview} alt="Uploaded Preview" className="img-fluid rounded shadow" style={{ width: 'auto', height: '450px', objectFit: 'cover' }} />
                                </div>
                            </div>
                        )}

                        <div className="col-md-6">
                            {loading && <p className="text-warning">Analyzing image, please wait...</p>}

                            {result && (
                                <div className="card p-3">
                                    <h3 className="text-center mb-10">Analysis Results</h3>
                                    {result.tags?.length > 0 ? (
                                        <div className="result-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', maxHeight: '450px', overflowY: 'auto' }}>
                                            {result.tags.map((tag, index) => (
                                                <div key={index} className="result-card p-2 border rounded shadow-sm text-center">
                                                    <p className="mb-1 fw-bold">{tag.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-danger">No food detected. Try another image.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Display Matching Menu Items */}
                    {matchingMenuItems.length > 0 && (
                        <div className="row mt-4">
                            <h3 className="text-center text-success">Matching Menu Items</h3>
                            {matchingMenuItems.map((item, index) => (
                                <div key={index} className="col-md-4">
                                    <div className="card p-3">
                                       
                                        <img
                                            src={require(`../uploads/${item.menuItemImage}`)}
                                            height="250px"
                                            width="250px"
                                            alt="menuItemImage"
                                        />
                                        <h5 className="text-center mt-3">{item.menuItemName}</h5>
                                        <p className="text-center">{item._id}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Imagescan;
