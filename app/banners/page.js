"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaBars, FaHome, FaPlusSquare, FaBoxOpen, FaClipboardList, FaImages, FaStar, FaChartLine, FaThLarge, FaFire, FaUserAlt, FaCog } from 'react-icons/fa';
import { FaPlus, FaTrash, FaUpload, FaImage, FaTimes, FaTag, FaPalette, FaRuler, FaSave, FaEye } from 'react-icons/fa';
// import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, LineChart, Line } from "recharts";
// Make sure you have these imports at the top of your file
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
const AdminDashboard = () => {
  // ========== PAGE NAVIGATION STATE ==========
  const [activePage, setActivePage] = useState('categories'); // ADD THIS
  
  // ========== CATEGORY STATES ==========
  const [categoryList, setCategoryList] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryUploading, setCategoryUploading] = useState(false);
  const [newCategoryImage, setNewCategoryImage] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [dragActiveCat, setDragActiveCat] = useState(false);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [stepOneConfirm, setStepOneConfirm] = useState(false);
  const [stepTwoConfirm, setStepTwoConfirm] = useState(false);
  const catUploadInputRef = useRef(null);

  // Backend API URL
  const API_URL = "https://check.hrgraphics.site";

  // ========== CATEGORY EFFECTS ==========
  // Fetch categories when page loads
  useEffect(() => {
    if (activePage === 'categories') {
      fetchCategories();
    }
  }, [activePage]);

  // ========== CATEGORY FUNCTIONS ==========
  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      setCategoryLoading(true);
      const response = await fetch(`${API_URL}/get-categories.php`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setCategoryList(data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setCategoryLoading(false);
    }
  };

  // Handle file change
  const handleFileChangeCat = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      const imageURL = URL.createObjectURL(file);
      setNewCategoryImage(imageURL);
    }
  };

  // Drag events
  const handleDragEventsCat = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActiveCat(true);
    } else if (e.type === 'dragleave') {
      setDragActiveCat(false);
    }
  };

  // Drop event
  const handleDropCat = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveCat(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      const imageURL = URL.createObjectURL(file);
      setNewCategoryImage(imageURL);
    }
  };

  // Add new category
  const addNewCategory = async () => {
    if (!newCategoryName || !newCategoryImage) {
      alert('Please provide category name and image');
      return;
    }

    try {
      setCategoryUploading(true);
      
      // Convert image URL to blob
      const response = await fetch(newCategoryImage);
      const blob = await response.blob();
      const file = new File([blob], 'category.jpg', { type: blob.type });

      // Upload to backend
      const formData = new FormData();
      formData.append('category_image', file);
      formData.append('category_name', newCategoryName);

      const uploadResponse = await fetch(`${API_URL}/upload-category.php`, {
        method: 'POST',
        body: formData,
      });

      const result = await uploadResponse.json();

      if (result.status === 'success') {
        // Refresh categories
        await fetchCategories();
        
        // Reset form
        setNewCategoryName('');
        setNewCategoryImage(null);
        if (catUploadInputRef.current) {
          catUploadInputRef.current.value = '';
        }
        
        alert('Category added successfully!');
      } else {
        alert('Failed to add category: ' + result.message);
      }
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Error adding category');
    } finally {
      setCategoryUploading(false);
    }
  };

  // Confirm remove category
  const confirmRemoveCategory = (index) => {
    setConfirmDeleteIndex(index);
    setConfirmDeleteId(categoryList[index].id);
    setStepOneConfirm(true);
  };

  // Handle final category delete
  const handleConfirmCategoryDelete = async () => {
    if (confirmDeleteIndex === null || confirmDeleteId === null) return;

    try {
      const response = await fetch(`${API_URL}/delete-category.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: confirmDeleteId }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        // Remove from local state
        setCategoryList(prev => prev.filter((_, i) => i !== confirmDeleteIndex));
        alert('Category deleted successfully!');
      } else {
        alert('Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error deleting category');
    } finally {
      setStepTwoConfirm(false);
      setConfirmDeleteIndex(null);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="admin-dashboard p-6">
      {/* Navigation Tabs */}
      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => setActivePage('banners')}
          className={`px-4 py-2 font-medium ${activePage === 'banners' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Manage Banners
        </button>
        <button
          onClick={() => setActivePage('categories')}
          className={`px-4 py-2 font-medium ${activePage === 'categories' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Manage Categories
        </button>
      </div>

      <div className="main-content">
        {/* Banners Section - You can add this later */}
        {activePage === 'banners' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Manage Banners</h2>
            <p className="text-gray-500">Banner management will go here</p>
          </div>
        )}

        {/* Categories Section */}
        {activePage === 'categories' && (
          <div className="category-admin-wrapper">
            <h2 className="text-2xl font-bold mb-6">Manage Categories</h2>

            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 ${
                dragActiveCat ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
              onDragEnter={handleDragEventsCat}
              onDragOver={handleDragEventsCat}
              onDragLeave={handleDragEventsCat}
              onDrop={handleDropCat}
            >
              <input
                type="file"
                ref={catUploadInputRef}
                onChange={handleFileChangeCat}
                accept="image/*"
                className="hidden"
              />
              
              <div className="space-y-4">
                <div className="text-gray-600">
                  <p className="text-lg font-medium">Drag & drop category image here</p>
                  <p className="text-sm">or</p>
                </div>
                
                <button
                  onClick={() => catUploadInputRef.current?.click()}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                  Browse Image
                </button>
                
                <p className="text-xs text-gray-500">
                  Supports JPG, PNG, GIF. Max 5MB per image.
                </p>
              </div>
            </div>

            {/* Category Name Input */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Enter Category Name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Add Category Button */}
            <button
              onClick={addNewCategory}
              className="w-full mb-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-blue-300"
              disabled={!newCategoryName || !newCategoryImage}
            >
              {categoryUploading ? "Uploading..." : "Add Category"}
            </button>

            {/* Loading indicator */}
            {categoryLoading && (
              <div className="mb-4 p-4 bg-blue-50 rounded-md">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <p className="text-blue-600">Loading categories...</p>
                </div>
              </div>
            )}

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryList.map((category, index) => (
                <div key={category.id || index} className="relative group bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                  <div className="aspect-square">
                    <img
                      src={category.image || category.image_url}
                      alt={category.title || category.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='16' text-anchor='middle' dy='.3em' fill='%236b7280'%3ECategory%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">
                        {category.title || category.name}
                      </span>
                      <button
                        onClick={() => confirmRemoveCategory(index)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Categories Message */}
            {categoryList.length === 0 && !categoryLoading && (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <p className="text-gray-500">No categories added yet.</p>
                <p className="text-sm text-gray-400 mt-2">Upload an image and add a name to create categories</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {stepOneConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirm Removal</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to remove this category?</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setStepOneConfirm(false);
                    setStepTwoConfirm(true);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                  Yes, Continue
                </button>
                <button
                  onClick={() => {
                    setStepOneConfirm(false);
                    setConfirmDeleteIndex(null);
                    setConfirmDeleteId(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Final Confirmation Modal */}
      {stepTwoConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Final Confirmation</h3>
              <p className="text-gray-600 mb-6">This will permanently remove the category. This action cannot be undone.</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleConfirmCategoryDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                >
                  Yes, Remove Permanently
                </button>
                <button
                  onClick={() => {
                    setStepTwoConfirm(false);
                    setConfirmDeleteIndex(null);
                    setConfirmDeleteId(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;