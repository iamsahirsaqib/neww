"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
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

const LuxuryDashboard = () => {
  const router = useRouter();
  const [activePage, setActivePage] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const handlePageChange = (path) => {
    setActivePage(path);
    setMenuOpen(false); // Close menu on mobile when selecting an item
  };


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

// Fetch categories from backend when categories page is active
useEffect(() => {
  if (activePage === 'categories') {
    fetchCategories();
  }
}, [activePage]);

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

// Handle file upload
const handleFileChangeCat = (e) => {
  const file = e.target.files?.[0];
  if (file) {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    const imageUrl = URL.createObjectURL(file);
    setNewCategoryImage(imageUrl);
  }
};

// Drag and drop handlers
const handleDragEventsCat = (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (e.type === 'dragenter' || e.type === 'dragover') {
    setDragActiveCat(true);
  } else if (e.type === 'dragleave') {
    setDragActiveCat(false);
  }
};

const handleDropCat = (e) => {
  e.preventDefault();
  e.stopPropagation();
  setDragActiveCat(false);
  
  const file = e.dataTransfer.files?.[0];
  if (file && file.type.startsWith('image/')) {
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    const imageUrl = URL.createObjectURL(file);
    setNewCategoryImage(imageUrl);
  }
};

// Add category to backend
const addNewCategory = async () => {
  if (!newCategoryName || !newCategoryImage) {
    alert('Please provide both category name and image');
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
      alert('Failed to add category: ' + (result.message || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error adding category:', error);
    alert('Failed to add category. Please try again.');
  } finally {
    setCategoryUploading(false);
  }
};

// Delete category from backend
const handleConfirmCategoryDelete = async () => {
  if (confirmDeleteIndex === null || confirmDeleteId === null) return;

  try {
    const response = await fetch(`${API_URL}/delete-category.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        id: confirmDeleteId 
      }),
    });

    const result = await response.json();

    if (result.status === 'success') {
      // Remove from local state
      setCategoryList(prev => prev.filter((_, i) => i !== confirmDeleteIndex));
      alert('Category deleted successfully!');
    } else {
      alert('Failed to delete category: ' + (result.message || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error deleting category:', error);
    alert('Failed to delete category. Please try again.');
  } finally {
    setStepTwoConfirm(false);
    setConfirmDeleteIndex(null);
    setConfirmDeleteId(null);
  }
};
  // add product

  const [discountPercent, setDiscountPercent] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(100);
    const [stock, setStock] = useState(""); 

  const handleDiscountChange = (e) => {
    const value = e.target.value;
    setDiscountPercent(value === '' ? '' : parseFloat(value));
  };

  const discountedPrice = originalPrice - (originalPrice * (discountPercent / 100));

const handleStockChange = (e) => {
  const value = e.target.value;

  // block negative numbers
  if (value < 0) return;

  // only whole numbers
  setStock(value === "" ? "" : parseInt(value));
};





  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    salePrice: '',
    deliveryCharges: 0,
    category: '',
    tags: []
  });

  const [media, setMedia] = useState([]);
  const [colors, setColors] = useState(['']);
  const [sizes, setSizes] = useState(['']);
  const [newTag, setNewTag] = useState('');

  // Categories Options
  const categories = [
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Sports',
    'Books',
    'Beauty',
    'Jewelry',
    'Automotive',
    'Health',
    'Toys'
  ];

  // Media Handlers
  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setMedia(prev => [...prev, {
          id: Date.now() + Math.random(),
          url: event.target.result,
          name: file.name,
          type: file.type
        }]);
      };
      reader.readAsDataURL(file);
    });
  };







  // Color Handlers
  const addColor = () => {
    setColors(prev => [...prev, '']);
  };

  const updateColor = (index, value) => {
    setColors(prev => prev.map((color, i) => i === index ? value : color));
  };

  const removeColor = (index) => {
    if (colors.length > 1) {
      setColors(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Size Handlers
  const addSize = () => {
    setSizes(prev => [...prev, '']);
  };

  const updateSize = (index, value) => {
    setSizes(prev => prev.map((size, i) => i === index ? value : size));
  };

  const removeSize = (index) => {
    if (sizes.length > 1) {
      setSizes(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Tag Handlers
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Form Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      media,
      colors: colors.filter(color => color.trim()),
      sizes: sizes.filter(size => size.trim())
    };
    console.log('Product Data:', productData);
    // Here you can send data to your API
    alert('Product added successfully!');
  };



  // preview



  const [showPreview, setShowPreview] = useState(false);

  const handlePreview = () => {
    setShowPreview(true);
  };






  // product



  const [products, setProducts] = useState([
    {
      id: 1,
      title: "Watch",
      description: "Luxury gold watch",
      price: 300,
      salePrice: 250,
      color: "Gold",
      size: "M",
      stock: 20,
      tags: "luxury,watch",
      deliveryCharges: 13,
      image: "/images/watch1.webp",
    },
    {
      id: 2,
      title: "Headphones",
      description: "Noise-cancelling wireless headphones",
      price: 150,
      salePrice: 120,
      color: "Black",
      size: "Standard",
      stock: 65,
      tags: "electronics,audio",
      deliveryCharges: 13,
      image: "/images/hp.webp",
    },
    {
      id: 3,
      title: "Running Shoes",
      description: "Premium handmade leather wallet",
      price: 80,
      salePrice: 60,
      color: "Brown",
      size: "One Size",
      stock: 35,
      tags: "accessories,wallet",
      deliveryCharges: 13,
      image: "/images/rs.webp",
    },
    {
      id: 4,
      title: "Sunglasses",
      description: "Comfortable and stylish sneakers",
      price: 200,
      salePrice: 180,
      color: "White",
      size: "42",
      stock: 48,
      tags: "fashion,shoes",
      deliveryCharges: 13,
      image: "/images/sg.webp",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStock, setFilterStock] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);

  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState(null);

  const handleSelectProduct = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleEditProduct = (id) => {
    const product = products.find((p) => p.id === id);
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const handleDeleteProduct = (id) => {
    setDeletingProductId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteProduct = () => {
    setProducts(products.filter((p) => p.id !== deletingProductId));
    setShowDeleteConfirm(false);
  };

  const handleBulkEdit = () => {
    const product = products.find((p) => p.id === selectedProducts[0]);
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const handleBulkDelete = () => {
    setProducts(products.filter((p) => !selectedProducts.includes(p.id)));
    setSelectedProducts([]);
  };

  const handleSaveEdit = () => {
    const updatedList = products.map((p) =>
      p.id === editingProduct.id ? editingProduct : p
    );
    setProducts(updatedList);
    setShowEditModal(false);
  };

  const filteredProducts = products.filter((product) => {
    const matchSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchStock =
      filterStock === "low"
        ? product.stock < 50
        : filterStock === "high"
          ? product.stock >= 50
          : true;
    return matchSearch && matchStock;
  });




  // order

// -------------------------
  // ORDER STATE & API LOGIC
  // -------------------------

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState('latest');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  // API URL (Ensure this matches your setup)


  // Fetch Orders from Backend when page loads or sort changes
  useEffect(() => {
    if (activePage === 'orders') {
      fetchOrders();
    }
  }, [activePage, sortOrder]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      // Pass the sort order to the backend
      const response = await fetch(`${API_URL}/get_orders.php?sort=${sortOrder}`);
      const data = await response.json();
      
      if (data.success) {
        // Map backend data to frontend structure
        const mappedOrders = data.data.map(order => ({
          ...order,
          orderDate: order.created_at, // Backend uses created_at, UI uses orderDate
          // Ensure product object exists to prevent crashes
          product: order.product || { 
            title: 'Unknown Product', 
            image: '/images/placeholder.png', 
            description: 'N/A',
            originalPrice: 0,
            salePrice: 0,
            color: '-',
            size: '-',
            quantity: 0
          }
        }));
        setOrders(mappedOrders);
      } else {
        console.error("Failed to fetch orders:", data.message);
      }
    } catch (error) {
      console.error("Error connecting to server:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Confirm Order API Call
  const handleConfirmOrder = async (orderId) => {
    try {
      const response = await fetch(`${API_URL}/confirm_order.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId }),
      });
      const data = await response.json();

      if (data.success) {
        // Update local state to show 'Confirmed' checkmark
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, confirmed: true } : o))
        );
      } else {
        alert("Failed to confirm order: " + data.message);
      }
    } catch (error) {
      console.error("Error confirming order:", error);
    }
  };

  // Open confirmation modal
  const confirmDelete = (orderId) => {
    setOrderToDelete(orderId);
    setShowDeleteModal(true);
  };

  // Delete Order API Call
  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;

    try {
      const response = await fetch(`${API_URL}/delete_order.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderToDelete }),
      });
      const data = await response.json();

      if (data.success) {
        // Remove from local list
        setOrders((prev) => prev.filter(order => order.id !== orderToDelete));
        setShowDeleteModal(false);
        setOrderToDelete(null);
      } else {
        alert("Failed to delete order: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setOrderToDelete(null);
  };

  // Use 'orders' directly for rendering instead of 'sortedOrders' 
  // because the backend now handles the sorting.
  const sortedOrders = orders;





  // banners



const [banners, setBanners] = useState([
  "/images/heroi1.png",
  "/images/heroi2.png",
  "/images/heroi3.png",
]);
const [dragActive, setDragActive] = useState(false);
const inputRef = useRef(null);
const [showConfirm, setShowConfirm] = useState(false);
const [removeIndex, setRemoveIndex] = useState(null);
const [loading, setLoading] = useState(false);

// Backend API URL - change to your domain
const API_URL = "https://check.hrgraphics.site";

// Fetch banners from backend on component mount
useEffect(() => {
  fetchBannersFromBackend();
}, []);

const fetchBannersFromBackend = async () => {
  try {
    setLoading(true);
    const response = await fetch(`${API_URL}/get-banners.php`);
    const data = await response.json();
    
    if (data.status === "success" && data.banners) {
      // Use backend banners if available, otherwise keep local ones
      if (data.banners.length > 0) {
        setBanners(data.banners.map(b => b.url || b));
      }
    }
  } catch (error) {
    console.error("Error fetching banners:", error);
    // Keep local banners if backend fails
  } finally {
    setLoading(false);
  }
};

const uploadToBackend = async (file) => {
  const formData = new FormData();
  formData.append("banner", file);

  try {
    const response = await fetch(`${API_URL}/upload-banner.php`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    
    if (result.status === "success") {
      return result.url; // Return uploaded image URL
    } else {
      alert("Upload failed: " + (result.message || "Unknown error"));
      return null;
    }
  } catch (error) {
    console.error("Upload error:", error);
    alert("Error connecting to server");
    return null;
  }
};

const processImageFile = async (file) => {
  if (!file || !file.type.startsWith("image/")) {
    alert("Please upload a valid image (JPG, PNG, GIF, WEBP).");
    return;
  }
  
  // File size validation (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    alert("File size should be less than 5MB.");
    return;
  }
  
  // File type validation
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    alert("Only JPG, PNG, GIF, and WEBP files are allowed.");
    return;
  }
  
  // Upload to backend
  setLoading(true);
  const uploadedUrl = await uploadToBackend(file);
  setLoading(false);
  
  if (uploadedUrl) {
    // Add backend URL to banners
    setBanners((prev) => [...prev, uploadedUrl]);
  } else {
    // Fallback to local URL if backend upload fails
    const localImageURL = URL.createObjectURL(file);
    setBanners((prev) => [...prev, localImageURL]);
  }
  
  // Clear input after upload
  if (inputRef.current) {
    inputRef.current.value = "";
  }
};

const onImageSelect = (e) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;
  
  // Process each file
  Array.from(files).forEach((file) => {
    processImageFile(file);
  });
};

const handleDragEvents = (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (e.type === "dragenter" || e.type === "dragover") {
    setDragActive(true);
  } else if (e.type === "dragleave") {
    setDragActive(false);
  }
};

const handleDrop = async (e) => {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(false);
  const files = e.dataTransfer.files;
  if (files && files.length > 0) {
    // Process dropped files one by one
    for (const file of Array.from(files)) {
      await processImageFile(file);
    }
  }
};

const confirmRemoveBanner = (index) => {
  setRemoveIndex(index);
  setShowConfirm(true);
};

const handleConfirmRemove = async () => {
  if (removeIndex !== null) {
    const bannerToRemove = banners[removeIndex];
    
    // Optional: Delete from backend
    try {
      await fetch(`${API_URL}/delete-banner.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: bannerToRemove }),
      });
    } catch (error) {
      console.error("Error deleting from backend:", error);
    }
    
    // Remove from local state
    setBanners(prev => prev.filter((_, i) => i !== removeIndex));
  }
  setShowConfirm(false);
  setRemoveIndex(null);
};

const handleCancelRemove = () => {
  setShowConfirm(false);
  setRemoveIndex(null);
};

// Refresh banners from backend
const refreshBanners = () => {
  fetchBannersFromBackend();
};







  // reviws 









// -------------------------
  // REVIEWS SECTION LOGIC
  // -------------------------

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  
  // Renamed to avoid conflict with Category/Product delete states
  const [reviewToDeleteId, setReviewToDeleteId] = useState(null); 
  const [reviewStep, setReviewStep] = useState(0);

  // Fetch reviews when the page is active
  useEffect(() => {
    if (activePage === 'reviews') {
      fetchAdminReviews();
    }
  }, [activePage]);

  const fetchAdminReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await fetch(`${API_URL}/get_all_reviews.php`);
      const data = await response.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Triggered when clicking "Delete" button
  const handleReviewDeleteClick = (reviewId) => {
    setReviewToDeleteId(reviewId);
    setReviewStep(1);
  };

  // Triggered when confirming inside modal
  const handleReviewConfirm = async () => {
    if (reviewStep === 1) {
      setReviewStep(2); // Move to final "Are you sure?"
    } else if (reviewStep === 2 && reviewToDeleteId !== null) {
      
      // Call Backend API to delete
      try {
        const response = await fetch(`${API_URL}/delete_review.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: reviewToDeleteId })
        });
        const result = await response.json();

        if (result.success) {
            // Update UI
            setReviews((prev) => prev.filter((r) => r.id !== reviewToDeleteId));
        } else {
            alert("Failed to delete review");
        }
      } catch (error) {
        console.error("Error deleting review:", error);
      }

      setReviewToDeleteId(null);
      setReviewStep(0);
    }
  };

  const handleReviewCancel = () => {
    setReviewToDeleteId(null);
    setReviewStep(0);
  };



// Add Product States
// Add Product States
const [productData, setProductData] = useState({
  title: '',
  description: '',
  price: '',
  salePrice: '',
  deliveryCharges: '',
  discountPercent: '',
  stock: '',
  category: '',
  tags: []
});
const [productMedia, setProductMedia] = useState([]);
const [productColors, setProductColors] = useState(['']);
const [productSizes, setProductSizes] = useState(['']);
const [newProductTag, setNewProductTag] = useState('');
const [showProductPreview, setShowProductPreview] = useState(false);
const [productUploading, setProductUploading] = useState(false);
const [productCategories, setProductCategories] = useState([]); // Categories for product form

// Fetch product categories when addProduct page is active
useEffect(() => {
  if (activePage === 'addProduct') {
    fetchProductCategories();
  }
}, [activePage]);

// Fetch categories for product form
const fetchProductCategories = async () => {
  try {
    console.log('Fetching product categories...');
    const response = await fetch(`${API_URL}/get-categories.php`);
    const data = await response.json();
    
    if (data.status === 'success') {
      setProductCategories(data.categories || []);
      console.log('Product categories loaded:', data.categories);
    } else {
      console.error('Failed to fetch categories:', data.message);
    }
  } catch (error) {
    console.error('Error fetching product categories:', error);
  }
};

// Product Functions
const handleProductInputChange = (e) => {
  const { name, value } = e.target;
  setProductData(prev => ({
    ...prev,
    [name]: value
  }));
};

const handleProductMediaUpload = (e) => {
  const files = Array.from(e.target.files);
  const newMedia = files.map(file => ({
    id: Date.now() + Math.random(),
    name: file.name,
    type: file.type,
    url: URL.createObjectURL(file),
    file: file
  }));
  setProductMedia(prev => [...prev, ...newMedia]);
};

const removeProductMedia = (id) => {
  setProductMedia(prev => prev.filter(item => item.id !== id));
};

const addProductColor = () => {
  setProductColors(prev => [...prev, '']);
};

const updateProductColor = (index, value) => {
  const newColors = [...productColors];
  newColors[index] = value;
  setProductColors(newColors);
};

const removeProductColor = (index) => {
  setProductColors(prev => prev.filter((_, i) => i !== index));
};

const addProductSize = () => {
  setProductSizes(prev => [...prev, '']);
};

const updateProductSize = (index, value) => {
  const newSizes = [...productSizes];
  newSizes[index] = value;
  setProductSizes(newSizes);
};

const removeProductSize = (index) => {
  setProductSizes(prev => prev.filter((_, i) => i !== index));
};

const addProductTag = () => {
  if (newProductTag.trim()) {
    setProductData(prev => ({
      ...prev,
      tags: [...prev.tags, newProductTag.trim()]
    }));
    setNewProductTag('');
  }
};

const removeProductTag = (tagToRemove) => {
  setProductData(prev => ({
    ...prev,
    tags: prev.tags.filter(tag => tag !== tagToRemove)
  }));
};

const handleProductPreview = () => {
  setShowProductPreview(true);
};

const handleProductSubmit = async (e) => {
  e.preventDefault();
  
  if (!productData.title || !productData.description || !productData.price || !productData.stock || !productData.category) {
    alert('Please fill all required fields');
    return;
  }

  if (productMedia.length === 0) {
    alert('Please upload at least one product image');
    return;
  }

  try {
    setProductUploading(true);
    
    // Upload media files
    const uploadedMedia = [];
    for (const item of productMedia) {
      const mediaUrl = await uploadProductMediaToBackend(item.file);
      if (mediaUrl) {
        uploadedMedia.push(mediaUrl);
      }
    }

    if (uploadedMedia.length === 0) {
      alert('Failed to upload media files');
      return;
    }

    // Prepare product data
    const productPayload = {
      title: productData.title,
      description: productData.description,
      price: parseFloat(productData.price),
      sale_price: productData.salePrice ? parseFloat(productData.salePrice) : null,
      delivery_charges: productData.deliveryCharges ? parseFloat(productData.deliveryCharges) : 0,
      discount_percent: productData.discountPercent ? parseFloat(productData.discountPercent) : null,
      stock: parseInt(productData.stock),
      category_id: parseInt(productData.category),
      colors: productColors.filter(c => c.trim()),
      sizes: productSizes.filter(s => s.trim()),
      tags: productData.tags,
      images: uploadedMedia
    };

    // Send to backend
    const response = await fetch(`${API_URL}/add-product.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productPayload),
    });

    const result = await response.json();

    if (result.status === 'success') {
      alert('Product added successfully!');
      resetProductForm();
    } else {
      alert('Failed to add product: ' + result.message);
    }
  } catch (error) {
    console.error('Error adding product:', error);
    alert('Error adding product');
  } finally {
    setProductUploading(false);
  }
};

const uploadProductMediaToBackend = async (file) => {
  const formDataObj = new FormData();
  formDataObj.append('product_image', file);

  try {
    const response = await fetch(`${API_URL}/upload-product-image.php`, {
      method: 'POST',
      body: formDataObj,
    });

    const result = await response.json();
    
    if (result.status === 'success') {
      return result.url;
    } else {
      console.error('Upload failed:', result.message);
      return null;
    }
  } catch (error) {
    console.error('Error uploading media:', error);
    return null;
  }
};

const resetProductForm = () => {
  setProductData({
    title: '',
    description: '',
    price: '',
    salePrice: '',
    deliveryCharges: '',
    discountPercent: '',
    stock: '',
    category: '',
    tags: []
  });
  setProductColors(['']);
  setProductSizes(['']);
  setProductMedia([]);
  setNewProductTag('');
};
 

  // --------------------------------------------
  // 1. ANALYTICS STATE (Fixes your errors)
  // --------------------------------------------
  
  // Fix: Define the filter state first
  const [analyticsFilter, setAnalyticsFilter] = useState("month");
const ANALYTICS_COLORS = ["#8e44ad", "#3498db", "#2ecc71", "#e74c3c", "#f39c12", "#1abc9c"];
  // Fix: Define summary metrics state
  const [summaryMetrics, setSummaryMetrics] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
    reach: 0
  });

  // Fix: Define chart data state
  const [analyticsData, setAnalyticsData] = useState([
     { name: "Jan", sales: 0, orders: 0, revenue: 0, visits: 0, range: "month" },
     { name: "Feb", sales: 0, orders: 0, revenue: 0, visits: 0, range: "month" },
  ]);

  // Fix: Define the computed property after the states exist
  const filteredAnalyticsData = useMemo(() => {
    // Return the data directly since the backend now handles the filtering/grouping
    // or apply client-side filtering if you fetch all data at once.
    // For now, we return the fetched data which defaults to "month"
    return analyticsData; 
  }, [analyticsData]);

  // --------------------------------------------
  // FETCH ANALYTICS FUNCTION
  // --------------------------------------------
  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${API_URL}/get_analytics.php`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      if (!text) return; // Safety check

      const data = JSON.parse(text);

      if (data.success) {
        setSummaryMetrics({
          products: data.summary.total_products || 0,
          orders: data.summary.total_orders || 0,
          revenue: data.summary.total_revenue || 0,
          reach: data.summary.store_reach || 0
        });

        if (data.chart_data && data.chart_data.length > 0) {
           setAnalyticsData(data.chart_data);
        }
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  // Fetch when page loads
  useEffect(() => {
    if (activePage === 'analytics' || activePage === 'home') {
      fetchAnalytics();
    }
  }, [activePage]);





  // catagories




  // const [categoryList, setCategoryList] = useState([
  //   { title: "Headphones", image: "/images/hp.webp" },
  //   { title: "Watches", image: "/images/watch1.webp" },
  // ]);
  // const [newCategoryName, setNewCategoryName] = useState("");
  // const [newCategoryImage, setNewCategoryImage] = useState(null);
  // const [dragActiveCat, setDragActiveCat] = useState(false);
  // const catUploadInputRef = useRef(null);

  // const handleDragEventsCat = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   if (e.type === "dragenter" || e.type === "dragover") {
  //     setDragActiveCat(true);
  //   } else if (e.type === "dragleave") {
  //     setDragActiveCat(false);
  //   }
  // };

  // const handleDropCat = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   setDragActiveCat(false);
  //   const file = e.dataTransfer.files?.[0];
  //   if (file && file.type.startsWith("image/")) {
  //     const imageUrl = URL.createObjectURL(file);
  //     setNewCategoryImage(imageUrl);
  //   }
  // };

  // const handleFileChangeCat = (e) => {
  //   const file = e.target.files?.[0];
  //   if (file && file.type.startsWith("image/")) {
  //     const imageUrl = URL.createObjectURL(file);
  //     setNewCategoryImage(imageUrl);
  //   }
  // };

  // const addNewCategory = () => {
  //   if (!newCategoryName.trim() || !newCategoryImage) return;
  //   if (categoryList.length >= 3) return;

  //   setCategoryList([
  //     ...categoryList,
  //     {
  //       title: newCategoryName.trim(),
  //       image: newCategoryImage,
  //     },
  //   ]);
  //   setNewCategoryName("");
  //   setNewCategoryImage(null);
  //   if (catUploadInputRef.current) catUploadInputRef.current.value = null;
  // };

  // const removeCategoryCard = (indexToRemove) => {
  //   setCategoryList((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  // };





  





  // trending product





  // -------------------------
  // TRENDING PRODUCTS SECTION
  // -------------------------

  const [trendingList, setTrendingList] = useState([]); // Products where is_trending = 1
  const [availableProducts, setAvailableProducts] = useState([]); // Products where is_trending = 0
  const [trendingLoading, setTrendingLoading] = useState(false);
  
  const [showDeleteTrending, setShowDeleteTrending] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);

  // Use the API_URL defined at the top of your component
  // const API_URL = "https://check.hrgraphics.site"; 

  // Fetch Data when Trending Page is active
  useEffect(() => {
    if (activePage === 'trending') {
      fetchTrendingData();
    }
  }, [activePage]);

  const fetchTrendingData = async () => {
    setTrendingLoading(true);
    try {
      // Reusing your existing get_products endpoint
      // Ensure get_products.php selects the 'is_trending' column!
      const response = await fetch(`${API_URL}/get_products.php`);
      const data = await response.json();

      if (data.success) {
        // Map DB columns to UI expected keys
        const formattedProducts = data.products.map(p => ({
            id: p.id,
            title: p.title,
            description: p.description,
            price: parseFloat(p.price),
            salePrice: parseFloat(p.sale_price),
            deliveryCost: parseFloat(p.delivery_charges),
            tags: p.tags ? p.tags.split(',') : [], // Assuming tags are comma-separated string in DB
            stock: p.stock,
            image: p.image || '/images/placeholder.png',
            is_trending: p.is_trending // The new column
        }));

        // Separate into two lists
        setTrendingList(formattedProducts.filter(p => p.is_trending == 1));
        // For "All Products" list, we usually show items that are NOT yet trending
        setAvailableProducts(formattedProducts.filter(p => p.is_trending == 0));
      }
    } catch (error) {
      console.error("Error fetching trending data:", error);
    } finally {
      setTrendingLoading(false);
    }
  };

  // Add to Trending (Set is_trending = 1)
  const handleAddToTrending = async (product) => {
    // Optimistic UI Update
    setTrendingList([...trendingList, { ...product, is_trending: 1 }]);
    setAvailableProducts(availableProducts.filter(p => p.id !== product.id));

    try {
      await fetch(`${API_URL}/update_trending.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product.id, status: 1 })
      });
      // Optionally refetch to ensure sync
    } catch (error) {
      console.error("Error adding to trending:", error);
      fetchTrendingData(); // Revert on error
    }
  };

  // Prepare to remove (Open Modal)
  const openDeleteModalTrending = (productId) => {
    setDeleteProductId(productId);
    setShowDeleteTrending(true);
  };

  // Remove from Trending (Set is_trending = 0)
  const confirmDeleteTrending = async () => {
    if (!deleteProductId) return;

    // Find the product to move back
    const productToRemove = trendingList.find(p => p.id === deleteProductId);
    
    // Optimistic UI Update
    setTrendingList(trendingList.filter(p => p.id !== deleteProductId));
    if (productToRemove) {
        setAvailableProducts([...availableProducts, { ...productToRemove, is_trending: 0 }]);
    }
    setShowDeleteTrending(false);

    try {
      await fetch(`${API_URL}/update_trending.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteProductId, status: 0 })
      });
    } catch (error) {
      console.error("Error removing from trending:", error);
      fetchTrendingData(); // Revert on error
    } finally {
      setDeleteProductId(null);
    }
  };

  const cancelDeleteTrending = () => {
    setDeleteProductId(null);
    setShowDeleteTrending(false);
  };


// State variables - Add z prefix to avoid conflicts
const [zProducts, setZProducts] = useState([]);
const [zFilteredProducts, setZFilteredProducts] = useState([]);
const [zSearchQuery, setZSearchQuery] = useState("");
const [zFilterStock, setZFilterStock] = useState("");
const [zSelectedProducts, setZSelectedProducts] = useState([]);
const [zShowEditModal, setZShowEditModal] = useState(false);
const [zShowDeleteConfirm, setZShowDeleteConfirm] = useState(false);
const [zEditingProduct, setZEditingProduct] = useState(null);
const [zProductToDelete, setZProductToDelete] = useState(null);

// API base URL - Replace with your Hostinger API URL
const API_BASE_URL = "https://check.hrgraphics.site";

// Fetch products function
const zFetchProducts = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/get_products.php?search=${zSearchQuery}&filterStock=${zFilterStock}`
    );
    const data = await response.json();
    if (data.success) {
      setZProducts(data.products);
      setZFilteredProducts(data.products);
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

// Handle edit product
const zHandleEditProduct = (id) => {
  const product = zProducts.find(p => p.id === id);
  setZEditingProduct(product);
  setZShowEditModal(true);
};

// Save edit
const zHandleSaveEdit = async () => {
  try {
    // Map your frontend field names to backend expected names
    const updateData = {
      id: zEditingProduct.id,
      title: zEditingProduct.title,
      description: zEditingProduct.description,
      price: zEditingProduct.price,
      sale_price: zEditingProduct.salePrice || zEditingProduct.sale_price, // Map to snake_case
      delivery_charges: zEditingProduct.deliveryCharges || zEditingProduct.delivery_charges,
      discount_percent: zEditingProduct.discountPercent || zEditingProduct.discount_percent,
      stock: zEditingProduct.stock,
      category_id: zEditingProduct.categoryId || zEditingProduct.category_id,
      colors: zEditingProduct.colors || [],
      sizes: zEditingProduct.sizes || [],
      tags: zEditingProduct.tags || [],
      images: zEditingProduct.images || []
    };
    
    console.log('Sending update data:', updateData);
    
    const response = await fetch(`${API_BASE_URL}/update_product.php`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    });
    
    // First check if response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const responseText = await response.text();
    console.log('Raw response:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse JSON:', e);
      alert('Server returned invalid response');
      return;
    }
    
    console.log('Parsed response:', data);
    
    // Check for success - adjust based on your PHP response format
    if (data.status === 'success' || data.success === true) {
      setZShowEditModal(false);
      zFetchProducts(); // Refresh the list
      alert('Product updated successfully!');
    } else {
      alert('Error: ' + (data.message || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error updating product:', error);
    alert('Failed to update product: ' + error.message);
  }
};

// Handle delete product
const zHandleDeleteProduct = (id) => {
  setZProductToDelete(id);
  setZShowDeleteConfirm(true);
};

// Confirm delete
const zConfirmDeleteProduct = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/delete_product.php`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: zProductToDelete })
    });
    
    const data = await response.json();
    if (data.success) {
      setZShowDeleteConfirm(false);
      zFetchProducts(); // Refresh the list
    } else {
      alert('Error deleting product');
    }
  } catch (error) {
    console.error('Error deleting product:', error);
  }
};

// Bulk delete
const zHandleBulkDelete = async () => {
  if (zSelectedProducts.length === 0) return;
  
  if (window.confirm(`Are you sure you want to delete ${zSelectedProducts.length} products?`)) {
    try {
      const response = await fetch(`${API_BASE_URL}/bulk_delete.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: zSelectedProducts })
      });
      
      const data = await response.json();
      if (data.success) {
        setZSelectedProducts([]);
        zFetchProducts(); // Refresh the list
      } else {
        alert('Error deleting products');
      }
    } catch (error) {
      console.error('Error deleting products:', error);
    }
  }
};

// Handle select product
const zHandleSelectProduct = (id) => {
  if (zSelectedProducts.includes(id)) {
    setZSelectedProducts(zSelectedProducts.filter(productId => productId !== id));
  } else {
    setZSelectedProducts([...zSelectedProducts, id]);
  }
};

// Bulk edit
const zHandleBulkEdit = () => {
  // Implement bulk edit logic here
  console.log("Bulk edit selected:", zSelectedProducts);
};

// Fetch products on component mount and when filters change
useEffect(() => {
  zFetchProducts();
}, [zSearchQuery, zFilterStock]);


  // settings





  const [step, setStep] = useState("enterInfo");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmitInfo = () => {
    if (!email || !phone || !password) {
      setMessage("Please enter email, phone number and password.");
      setStep("error");
      return;
    }
    setMessage("");
    setStep("otpSent");
  };

  const handleVerifyOTP = () => {
    if (otp === "1234") {
      setMessage("");
      setStep("verified");
    } else {
      setMessage("Incorrect OTP.");
      setStep("error");
    }
  };

  const handleChangePassword = () => {
    if (!newPassword || newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      setStep("error");
      return;
    }
    setMessage("Password changed successfully!");
    setStep("success");
  };

const [stats, setStats] = useState({
    orders: 0,
    products: 0,
    revenue: 0,
    reach: 0
  });

  // 2. Fetch Stats on Load
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('https://check.hrgraphics.site/get_dashboard_stats.php');
        const data = await response.json();
        
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchStats();
  }, []);



  return (
    <div className="shazie-dashboard">
      {/* Add the menu toggle button */}
      <button
        className="shazie-menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <FaBars />
      </button>

      <div>
        <ul className={`shazie-menu-items ${menuOpen ? 'active' : ''}`}>
          <li onClick={() => handlePageChange('home')}><FaHome /> Dashboard</li>
          <li onClick={() => handlePageChange('addProduct')}><FaPlusSquare /> Add Product</li>
          <li onClick={() => handlePageChange('products')}><FaBoxOpen /> All Products</li>
          <li onClick={() => handlePageChange('orders')}><FaClipboardList /> Orders</li>
          <li onClick={() => handlePageChange('banners')}><FaImages /> Manage Banners</li>
          <li onClick={() => handlePageChange('reviews')}><FaStar /> Product Reviews</li>
          <li onClick={() => handlePageChange('analytics')}><FaChartLine /> Analytics</li>
          <li onClick={() => handlePageChange('categories')}><FaThLarge /> Manage Categories</li>
          <li onClick={() => handlePageChange('trending')}><FaFire /> Trending Products</li>
          <li onClick={() => handlePageChange('settings')}><FaCog /> Settings</li>
        </ul>
      </div>

      <div className="shazie-main-content">
        <div className="shazie-top-bar">
          <h2>Admin Dashboard</h2>
        </div>

        <div className="shazie-content">
          {activePage === 'home' && (
            <div className="shazie-card shazie-home-card">
              <h3>Welcome to the Dashboard!</h3>
              <p>Manage your products, track sales, and more.</p>
              
              <div className="shazie-order-summary">
                
                {/* Orders Card */}
                <div className="shazie-order-stat">
                  <h3>{stats.orders}</h3>
                  <p> Orders</p>
                </div>

                {/* Products Card */}
                <div className="shazie-order-stat">
                  <h3>{stats.products}</h3>
                  <p>Products</p>
                </div>

                {/* Revenue Card */}
                <div className="shazie-order-stat">
                  <h3>AED: {parseFloat(stats.revenue).toLocaleString()}</h3>
                  <p>Revenue Summary</p>
                </div>

                {/* Reach Card */}
                <div className="shazie-order-stat">
                  <h3>{stats.reach}</h3>
                  <p>Store Reach</p>
                </div>

              </div>
            </div>
          )}




{activePage === 'addProduct' && (
  <div className="add-product-container">
    <div className="add-product-header">
      <h2><FaPlus /> Add New Product</h2>
      <div className="header-actions">
        <button type="button" className="preview-btn" onClick={handleProductPreview}>
          <FaEye /> Preview
        </button>
      </div>
    </div>

    <form onSubmit={handleProductSubmit} className="add-product-form">
      {/* Media Upload Section */}
      <div className="form-section">
        <h3><FaImage /> Product Media</h3>
        <div className="media-upload-area">
          <input
            type="file"
            id="media-upload"
            multiple
            accept="image/*,video/*"
            onChange={handleProductMediaUpload}
            className="hidden-input"
          />
          <label htmlFor="media-upload" className="upload-label">
            <FaUpload />
            <span>Click to upload images/videos</span>
            <small>Support: JPG, PNG, MP4, WebM</small>
          </label>
        </div>

        {productMedia.length > 0 && (
          <div className="media-preview-grid">
            {productMedia.map((item) => (
              <div key={item.id} className="media-item">
                {item.type.startsWith('image') ? (
                  <img src={item.url} alt={item.name} />
                ) : (
                  <video src={item.url} controls />
                )}
                <button
                  type="button"
                  className="remove-media"
                  onClick={() => removeProductMedia(item.id)}
                >
                  <FaTimes />
                </button>
                <span className="media-name">{item.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Basic Information */}
      <div className="form-section">
        <h3>Basic Information</h3>
        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="productTitle">Product Title *</label>
            <input
              type="text"
              id="productTitle"
              name="title"
              value={productData.title}
              onChange={handleProductInputChange}
              placeholder="Enter product title"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="productDescription">Description *</label>
            <textarea
              id="productDescription"
              name="description"
              value={productData.description}
              onChange={handleProductInputChange}
              placeholder="Enter detailed product description"
              rows="4"
              required
            />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="form-section">
        <h3>Pricing (AED)</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="productPrice">Regular Price (AED) *</label>
            <input
              type="number"
              id="productPrice"
              name="price"
              value={productData.price}
              onChange={handleProductInputChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="productSalePrice">Sale Price (AED)</label>
            <input
              type="number"
              id="productSalePrice"
              name="salePrice"
              value={productData.salePrice}
              onChange={handleProductInputChange}
              placeholder="0.00"
              step="0.01"
              min="0"
            />

            <label htmlFor="productDeliveryCharges">Delivery Charges (AED)</label>
            <input
              type="number"
              id="productDeliveryCharges"
              name="deliveryCharges"
              value={productData.deliveryCharges}
              onChange={handleProductInputChange}
              placeholder="0.00"
              step="0.01"
              min="0"
            />

            <label htmlFor="productDiscountPercent">Sale Percentage (%)</label>
            <input
              type="number"
              id="productDiscountPercent"
              name="discountPercent"
              value={productData.discountPercent}
              onChange={handleProductInputChange}
              placeholder="e.g. 25"
              min="0"
              max="100"
              step="0.1"
            />
            
            <label htmlFor="productStock">Stock *</label>
            <input
              type="number"
              id="productStock"
              name="stock"
              value={productData.stock}
              onChange={handleProductInputChange}
              placeholder="Enter quantity"
              min="0"
              step="1"
              required
            />
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="form-section">
        <h3><FaPalette /> Available Colors</h3>
        <div className="dynamic-list">
          {productColors.map((color, index) => (
            <div key={index} className="dynamic-item">
              <input
                type="text"
                value={color}
                onChange={(e) => updateProductColor(index, e.target.value)}
                placeholder="Enter color name"
              />
              <input
                type="color"
                value={color.startsWith('#') ? color : '#000000'}
                onChange={(e) => updateProductColor(index, e.target.value)}
                className="color-picker"
              />
              {productColors.length > 1 && (
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeProductColor(index)}
                >
                  <FaTimes />
                </button>
              )}
            </div>
          ))}
          <button type="button" className="add-btn" onClick={addProductColor}>
            <FaPlus /> Add Color
          </button>
        </div>
      </div>

      {/* Sizes */}
      <div className="form-section">
        <h3><FaRuler /> Available Sizes</h3>
        <div className="dynamic-list">
          {productSizes.map((size, index) => (
            <div key={index} className="dynamic-item">
              <input
                type="text"
                value={size}
                onChange={(e) => updateProductSize(index, e.target.value)}
                placeholder="Enter size (S, M, L, XL, etc.)"
              />
              {productSizes.length > 1 && (
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeProductSize(index)}
                >
                  <FaTimes />
                </button>
              )}
            </div>
          ))}
          <button type="button" className="add-btn" onClick={addProductSize}>
            <FaPlus /> Add Size
          </button>
        </div>
      </div>

<div className="form-section">
  <h3>Category & Tags</h3>
  <div className="form-row">
    <div className="form-group">
      <label htmlFor="productCategory">Category *</label>
      <select
        id="productCategory"
        name="category"
        value={productData.category}
        onChange={handleProductInputChange}
        required
      >
        <option value="">Select Category</option>
        {productCategories.length > 0 ? (
          productCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))
        ) : (
          <option value="" disabled>Loading categories...</option>
        )}
      </select>
    </div>
  </div>
</div>
      {/* Tags */}
      <div className="form-section">
        <h3><FaTag /> Tags</h3>
        <div className="tag-input-container">
          <input
            type="text"
            value={newProductTag}
            onChange={(e) => setNewProductTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addProductTag())}
            placeholder="Enter tag and press Enter"
          />
          <button type="button" onClick={addProductTag} className="add-tag-btn">
            <FaPlus />
          </button>
        </div>

        {productData.tags.length > 0 && (
          <div className="tags-display">
            {productData.tags.map((tag, index) => (
              <span key={index} className="tag-item">
                {tag}
                <button
                  type="button"
                  onClick={() => removeProductTag(tag)}
                  className="remove-tag"
                >
                  <FaTimes />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="form-actions">
        <button type="submit" className="submit-btn" disabled={productUploading}>
          {productUploading ? 'Uploading...' : <><FaSave /> Save Product</>}
        </button>
      </div>
    </form>

    {/* Preview Modal */}
    {showProductPreview && (
      <div className="product-preview-modal">
        <div className="preview-content">
          <button className="close-preview" onClick={() => setShowProductPreview(false)}>
            <FaTimes />
          </button>

          <div className="shopify-product-preview">
            {/* Main Image */}
            {productMedia[0] && (
              <div className="preview-image">
                {productMedia[0].type.startsWith('image') ? (
                  <img src={productMedia[0].url} alt="Preview" />
                ) : (
                  <video src={productMedia[0].url} controls />
                )}
              </div>
            )}

            {/* Product Info */}
            <div className="preview-details">
              <h2>{productData.title || 'Product Title'}</h2>
              <p className="preview-price">
                AED {productData.salePrice || productData.price || '0.00'}
                {productData.salePrice && (
                  <span className="original-price">AED {productData.price}</span>
                )}
              </p>
              <p className="preview-description">{productData.description}</p>

              {/* Colors */}
              {productColors.length > 0 && (
                <div className="preview-colors">
                  <p>Colors:</p>
                  <div className="color-dots">
                    {productColors.map((clr, i) => (
                      <span
                        key={i}
                        className="color-dot"
                        style={{ backgroundColor: clr }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {productSizes.length > 0 && (
                <div className="preview-sizes">
                  <p>Sizes:</p>
                  <div className="size-options">
                    {productSizes.map((sz, i) => (
                      <span key={i} className="size-badge">{sz}</span>
                    ))}
                  </div>
                </div>
              )}

              <button className="preview-section-cart-btn">Add to Cart</button>
              <button className="preview-section-buy-btn">Buy Now</button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
)}
          {/* product */}




      {activePage === "products" && (
  <div className="zproducts-container">
    <h1 className="zpage-title">Products</h1>

    <div className="zsearch-bar">
      <input
        type="text"
        placeholder="Search products..."
        value={zSearchQuery}
        onChange={(e) => setZSearchQuery(e.target.value)}
      />
    </div>

    <div className="zfilter-stock">
      <label>Filter by Stock:</label>
      <select
        value={zFilterStock}
        onChange={(e) => setZFilterStock(e.target.value)}
      >
        <option value="">All</option>
        <option value="low">Low Stock</option>
        <option value="high">High Stock</option>
      </select>
    </div>

    <div className="zbulk-actions">
      <button onClick={zHandleBulkEdit} disabled={zSelectedProducts.length === 0}>
        Edit Selected
      </button>
      <button onClick={zHandleBulkDelete} disabled={zSelectedProducts.length === 0}>
        Delete Selected
      </button>
    </div>

    <div className="zproducts-list">
      {zFilteredProducts.length > 0 ? (
        zFilteredProducts.map((product) => (
          <div key={product.id} className="zproduct-item">
            <img src={product.image} alt={product.title} className="zproduct-image" />
            <div className="zproduct-info">
              <p><strong>Title:</strong> {product.title}</p>
              <p><strong>Description:</strong> {product.description}</p>
              <p><strong>Price:</strong> AED {product.price}</p>
              <p><strong>Sale Price:</strong> AED {product.sale_price}</p>
              <p><strong>Tags:</strong> {product.tags}</p>
              <p><strong>Delivery:</strong> AED {product.delivery_charges}</p>
              <p><strong>Stock:</strong> {product.stock}</p>
            </div>
            <div className="zproduct-actions">
              <input
                type="checkbox"
                checked={zSelectedProducts.includes(product.id)}
                onChange={() => zHandleSelectProduct(product.id)}
              />
              <button onClick={() => zHandleEditProduct(product.id)}>Edit</button>
              <button onClick={() => zHandleDeleteProduct(product.id)}>Delete</button>
            </div>
          </div>
        ))
      ) : (
        <p style={{ color: "#fff" }}>No products available.</p>
      )}
    </div>

    {/* Edit Modal */}
    {zShowEditModal && (
      <div className="zmodal-overlay">
        <div className="zmodal">
          <h2>Edit Product</h2>
          <input
            type="text"
            placeholder="Title"
            value={zEditingProduct?.title || ''}
            onChange={(e) =>
              setZEditingProduct({ ...zEditingProduct, title: e.target.value })
            }
          />
          <textarea
            placeholder="Description"
            value={zEditingProduct?.description || ''}
            onChange={(e) =>
              setZEditingProduct({ ...zEditingProduct, description: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Price"
            value={zEditingProduct?.price || ''}
            onChange={(e) =>
              setZEditingProduct({ ...zEditingProduct, price: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Sale Price"
            value={zEditingProduct?.sale_price || ''}
            onChange={(e) =>
              setZEditingProduct({ ...zEditingProduct, sale_price: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Tags"
            value={zEditingProduct?.tags || ''}
            onChange={(e) =>
              setZEditingProduct({ ...zEditingProduct, tags: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Delivery Charges"
            value={zEditingProduct?.delivery_charges || ''}
            onChange={(e) =>
              setZEditingProduct({ ...zEditingProduct, delivery_charges: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Image URL"
            value={zEditingProduct?.image || ''}
            onChange={(e) =>
              setZEditingProduct({ ...zEditingProduct, image: e.target.value })
            }
          />
          <div className="zmodal-buttons">
            <button onClick={() => setZShowEditModal(false)}>Cancel</button>
            <button onClick={zHandleSaveEdit}>Save</button>
          </div>
        </div>
      </div>
    )}

    {/* Delete Confirmation */}
    {zShowDeleteConfirm && (
      <div className="zmodal-overlay">
        <div className="zmodal">
          <h3>Are you sure you want to delete this product?</h3>
          <div className="zmodal-buttons">
            <button onClick={() => setZShowDeleteConfirm(false)}>Cancel</button>
            <button onClick={zConfirmDeleteProduct}>Yes, Delete</button>
          </div>
        </div>
      </div>
    )}
  </div>
)}
          {/* order */}





          {activePage === 'orders' && (
            <div className="orders-container">
              <h1 className="orders-title">Orders</h1>

              <div className="orders-filter">
                <label>Sort by:</label>
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                  <option value="latest">Latest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>

              <div className="orders-list">
                {sortedOrders.length === 0 ? (
                  <p>No orders found.</p>
                ) : (
                  sortedOrders.map((order) => (
                    <div key={order.id} className="order-card">
                      <div className="customer-info">
                        <h3>Customer Details</h3>
                        <p><strong>Name:</strong> {order.customer.firstName} {order.customer.lastName}</p>
                        <p><strong>Phone:</strong> {order.customer.phone}</p>
                        <p><strong>Email:</strong> {order.customer.email}</p>
                        <p><strong>Address:</strong> {order.customer.address}</p>
                        <p><strong>Emirate:</strong> {order.customer.emirate}</p>
                        <p><strong>City:</strong> {order.customer.city}</p>
                        <p><strong>Zip Code:</strong> {order.customer.zipCode}</p>
                      </div>

                      <div className="product-info">
                        <h3>Product Details</h3>
                        <img src={order.product.image} alt={order.product.title} className="product-image" />
                        <p><strong>Title:</strong> {order.product.title}</p>
                        <p><strong>Description:</strong> {order.product.description}</p>
                        <p><strong>Original Price:</strong> AED {order.product.originalPrice}</p>
                        <p><strong>Sale Price:</strong> AED {order.product.salePrice}</p>
                        <p><strong>Color:</strong> {order.product.color}</p>
                        <p><strong>Size:</strong> {order.product.size}</p>
                        <p><strong>Quantity:</strong> {order.product.quantity}</p>
                      </div>

                      {/* Confirm Order Button */}
                      <div className={`order-card ${order.confirmed ? "order-confirmed" : ""}`}>
                        {!order.confirmed && (
                          <button
                            className="confirm-order-button"
                            onClick={() => handleConfirmOrder(order.id)}
                          >
                            Confirm Order
                          </button>
                        )}

                        {order.confirmed && (
                          <p className="confirmed-text">Order Confirmed ✔</p>
                        )}
                      </div>


                      <button
                        className="delete-order-button"
                        onClick={() => confirmDelete(order.id)}
                      >
                        Delete Order
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Delete Confirmation Modal */}
              {showDeleteModal && (
                <div className="modal-overlay">
                  <div className="modal-card">
                    <h2>Confirm Delete</h2>
                    <p>Are you sure you want to delete this order?</p>
                    <div className="modal-actions">
                      <button className="confirm-btn" onClick={handleDeleteOrder}>Yes, Delete</button>
                      <button className="cancel-btn" onClick={cancelDelete}>Cancel</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}





          {/* banner */}

          {activePage === 'banners' && (
            <div className="upload-wrapper">
              {banners.length > 0 &&
                banners.map((banner, index) => (
                  <div key={index} className="preview-container">
                    <img src={banner} alt={`Banner ${index}`} />
                    <button type="button" onClick={() => confirmRemoveBanner(index)}>
                      Remove
                    </button>
                  </div>
                ))}

              <form
                id="upload-form"
                onDragEnter={handleDragEvents}
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="file-input"
                  onChange={onImageSelect}
                  hidden
                />
                <label
                  htmlFor="upload-form"
                  className={`upload-label ${dragActive ? "drag-active" : ""}`}
                  onClick={() => inputRef.current.click()}
                  onDragEnter={handleDragEvents}
                  onDragOver={handleDragEvents}
                  onDragLeave={handleDragEvents}
                  onDrop={handleDrop}
                >
                  <p>Drag & Drop your banner image here, or click to select</p>
                  <button
                    type="button"
                    className="upload-btn"
                    onClick={() => inputRef.current.click()}
                  >
                    Select Image
                  </button>
                </label>
              </form>

              {/* Confirmation Modal */}
              {showConfirm && (
                <div className="confirm-overlay">
                  <div className="confirm-box">
                    <p>Are you sure you want to remove this banner?</p>
                    <div className="confirm-buttons">
                      <button onClick={handleConfirmRemove} className="confirm-yes">
                        Yes
                      </button>
                      <button onClick={handleCancelRemove} className="confirm-no">
                        No
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}





          {/* reviews */}
{activePage === 'reviews' && (
        <div className="reviews-wrapper">
          <h2>Customer Reviews</h2>
          
          {reviewsLoading ? <p>Loading...</p> : (
            <div className="reviews-list">
              {reviews.map((review, index) => (
                <div key={index} className="review-item">
                  <div className="product-image-wrapper">
                    <img
                      src={review.productImage}
                      alt="Product real"
                      className="product-real-image"
                    />
                    <span className="label">{review.productName || 'Product'}</span>
                  </div>

                  <div className="customer-images-wrapper">
                    {review.customerImages.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`Customer received ${i + 1}`}
                        className="customer-image"
                      />
                    ))}
                  </div>

                  <div className="review-content">
                    <div className="review-stars">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`star ${i < review.rating ? 'filled' : ''}`}
                        >
                          &#9733;
                        </span>
                      ))}
                    </div>
                    <p className="review-text">&quot;{review.comment}&quot;</p>
                    <span className="review-date">{review.date}</span>
                    
                    {/* UPDATED DELETE BUTTON */}
                    <button
                      className="review-delete-btn"
                      onClick={() => handleReviewDeleteClick(review.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* UPDATED MODAL USING NEW VARIABLES */}
      {reviewStep > 0 && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h2>Confirm Deletion</h2>
            <p>
              {reviewStep === 1
                ? 'Are you sure you want to delete this review?'
                : 'This is your last chance! Confirm delete.'}
            </p>
            <div className="confirm-buttons">
              <button className="confirm-yes" onClick={handleReviewConfirm}>
                Yes
              </button>
              <button className="confirm-no" onClick={handleReviewCancel}>
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {step > 0 && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h2>Confirm Deletion</h2>
            <p>
              {step === 1
                ? 'Are you sure you want to delete this review?'
                : 'This is your last chance! Confirm delete.'}
            </p>
            <div className="confirm-buttons">
              <button className="confirm-yes" onClick={handleConfirm}>
                Yes
              </button>
              <button className="confirm-no" onClick={handleCancel}>
                No
              </button>
            </div>
          </div>
        </div>
      )}


          {/* analytics */}


          {activePage === 'analytics' && (
            <div className="dashboard-analytics-dashboard">
              <div className="dashboard-analytics-header-section">
                <h3 className="dashboard-analytics-main-title">Analytics Dashboard</h3>
                <div className="dashboard-analytics-controls">
                  <select
                    value={analyticsFilter}
                    onChange={(e) => setAnalyticsFilter(e.target.value)}
                    className="dashboard-time-filter-select"
                  >
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>
                </div>
              </div>

              {/* Key Metrics Summary */}
              <div className="dashboard--metrics-summary-grid">
                <div className="dashboard-metric-card revenue-card">
                  <h4 className="dashboard-metric-title">Total Revenue</h4>
                  <p className="dashboard--metric-value">
                    AED: {filteredAnalyticsData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
                  </p>
                </div>
                <div className="dashboard-metric-card orders-card">
                  <h4 className="dashboard-metric-title">Total Orders</h4>
                  <p className="dashboard-metric-value">
                    {filteredAnalyticsData.reduce((sum, item) => sum + item.orders, 0).toLocaleString()}
                  </p>
                </div>
                <div className="dashboard-metric-card sales-card">
                  <h4 className="dashboard-metric-title">Total Sales</h4>
                  <p className="dashboard-metric-value">
                    {filteredAnalyticsData.reduce((sum, item) => sum + item.sales, 0).toLocaleString()}
                  </p>
                </div>
                <div className="dashboard-metric-card visits-card">
                  <h4 className="dashboard-metric-title">Total Visits</h4>
                  <p className="dashboard-metric-value">
                    {filteredAnalyticsData.reduce((sum, item) => sum + item.visits, 0).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="dashboard-charts-grid-layout">
                {/* Revenue Trend Line Chart */}
                <div className="dashboard-chart-container revenue-chart">
                  <h4 className="dashboard-chart-title">Revenue Trend</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={filteredAnalyticsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="name" stroke="#e0e0e0" />
                      <YAxis stroke="#e0e0e0" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#2a2a2a",
                          border: "1px solid #333",
                          borderRadius: "8px",
                          color: "#e0e0e0",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#ad4e01"
                        strokeWidth={3}
                        dot={{ r: 5 }}
                        activeDot={{ r: 8 }}
                        name="Revenue (AED)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Orders Bar Chart */}
                <div className="dashboard-chart-container orders-chart">
                  <h4 className="dashboard-chart-title">Orders Analysis</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={filteredAnalyticsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="name" stroke="#e0e0e0" />
                      <YAxis stroke="#e0e0e0" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#2a2a2a",
                          border: "1px solid #333",
                          borderRadius: "8px",
                          color: "#e0e0e0",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="orders" fill="#ad4e01" name="Orders" />
                      <Bar dataKey="sales" fill="#3498db" name="Sales" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Sales Distribution Pie Chart */}
                <div className="dashboard-chart-container sales-pie-chart">
                  <h4 className="dashboard-chart-title">Sales Distribution</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={filteredAnalyticsData}
                        dataKey="sales"
                        outerRadius={100}
                        innerRadius={60}
                        paddingAngle={5}
                        label
                      >
                        {filteredAnalyticsData.map((entry, index) => (
                          <Cell
                            key={`mera-cell-${index}`}
                            fill={ANALYTICS_COLORS[index % ANALYTICS_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#2a2a2a",
                          border: "1px solid #333",
                          borderRadius: "8px",
                          color: "#e0e0e0",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Ratio/Performance Chart */}
                <div className="dashboard-chart-container ratio-chart">
                  <h4 className="dashboard-chart-title">Conversion Ratio</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={filteredAnalyticsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="name" stroke="#e0e0e0" />
                      <YAxis stroke="#e0e0e0" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#2a2a2a",
                          border: "1px solid #333",
                          borderRadius: "8px",
                          color: "#e0e0e0",
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="ratio"
                        stroke="#2ecc71"
                        fill="#2ecc71"
                        fillOpacity={0.3}
                        name="Conversion Ratio"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Visits Analytics */}
                <div className="dashboard-chart-container visits-chart">
                  <h4 className="dashboard-chart-title">Website Visits</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={filteredAnalyticsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="name" stroke="#e0e0e0" />
                      <YAxis stroke="#e0e0e0" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#2a2a2a",
                          border: "1px solid #333",
                          borderRadius: "8px",
                          color: "#e0e0e0",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="visits" fill="#8e44ad" name="Visits" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}









          {/* catagory */}



         {activePage === 'categories' && (

  <div className="category-admin-wrapper">
    <h2 className="category-heading">Manage Categories</h2>

    {/* Loading State */}
    {categoryLoading && (
      <div className="loading-state">
        <p>Loading categories...</p>
      </div>
    )}

    <div className="category-grid">
      {categoryList.map((item, index) => (
        <div className="category-card" key={item.id || index}>
          <img 
            src={item.image || item.image_url} 
            alt={item.title || item.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150' viewBox='0 0 200 150'%3E%3Crect width='200' height='150' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='14' text-anchor='middle' dy='.3em' fill='%236b7280'%3ECategory%3C/text%3E%3C/svg%3E";
            }}
          />
          <p>{item.title || item.name}</p>

          {/* REMOVE BUTTON */}
          <button
            onClick={() => {
              setConfirmDeleteIndex(index);
              setConfirmDeleteId(item.id); // Store ID for backend deletion
              setStepOneConfirm(true);
            }}
            className="remove-btn"
          >
            Remove
          </button>
        </div>
      ))}
    </div>

    <div
      className={`cat-upload-area ${dragActiveCat ? "drag-active" : ""} ${categoryUploading ? "uploading" : ""}`}
      onClick={() => !categoryUploading && catUploadInputRef.current?.click()}
      onDragEnter={handleDragEventsCat}
      onDragOver={handleDragEventsCat}
      onDragLeave={handleDragEventsCat}
      onDrop={handleDropCat}
    >
      <input
        ref={catUploadInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFileChangeCat}
        disabled={categoryUploading}
      />

      {categoryUploading ? (
        <div className="uploading-state">
          <p>Uploading image...</p>
        </div>
      ) : newCategoryImage ? (
        <img src={newCategoryImage} className="cat-preview-img" />
      ) : (
        <p>Click or Drag & Drop to Upload Category Image</p>
      )}
    </div>

    <input
      type="text"
      placeholder="Enter Category Name"
      value={newCategoryName}
      onChange={(e) => setNewCategoryName(e.target.value)}
      className="cat-name-input"
      disabled={categoryUploading}
    />

    <button 
      onClick={addNewCategory} 
      className="cat-add-btn"
      disabled={!newCategoryName || !newCategoryImage || categoryUploading}
    >
      {categoryUploading ? "Uploading..." : "Add Category"}
    </button>
  </div>
)}

{/* STEP 1 CONFIRMATION */}
{stepOneConfirm && (
  <div className="confirm-overlay">
    <div className="confirm-card">
      <h3>Are you sure?</h3>
      <p>Do you really want to remove this category?</p>

      <div className="confirm-row">
        <button
          onClick={() => {
            setStepOneConfirm(false);
            setStepTwoConfirm(true);
          }}
          className="confirm-yes"
        >
          Yes
        </button>

        <button
          onClick={() => {
            setStepOneConfirm(false);
            setConfirmDeleteIndex(null);
            setConfirmDeleteId(null);
          }}
          className="confirm-cancel"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

{/* STEP 2 CONFIRMATION */}
{stepTwoConfirm && (
  <div className="confirm-overlay">
    <div className="confirm-card">
      <h3>Final Confirmation</h3>
      <p>This action cannot be undone.</p>

      <div className="confirm-row">
        <button
          onClick={handleConfirmCategoryDelete}
          className="confirm-delete"
        >
          Yes, Remove
        </button>

        <button
          onClick={() => {
            setStepTwoConfirm(false);
            setConfirmDeleteIndex(null);
            setConfirmDeleteId(null);
          }}
          className="confirm-cancel"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}



          {/* trending */}




          {activePage === 'trending' && (
            <div className="trending-products-section">
              
              {/* AVAILABLE PRODUCTS (Not yet trending) */}
              <div className="trending-products-header">
                <h3>Available Products</h3>
              </div>

              {trendingLoading ? <p>Loading...</p> : (
                <div className="trending-product-grid">
                  {availableProducts.length > 0 ? availableProducts.map((item) => (
                    <div className="trending-product-card" key={item.id}>
                      <img src={item.image} alt={item.title} className="trending-product-image" />
                      <div className="trending-product-info">
                        <h4>{item.title}</h4>
                        <p className="truncate-text">{item.description}</p>
                        <p><strong>Price:</strong> AED {item.price.toFixed(2)}</p>
                        <p><strong>Stock:</strong> {item.stock}</p>
                      </div>
                      <button onClick={() => handleAddToTrending(item)} className="trending-action-button">
                        Add to Trending
                      </button>
                    </div>
                  )) : <p>No products available to add.</p>}
                </div>
              )}

              {/* CURRENT TRENDING PRODUCTS */}
              <div className="trending-products-header" style={{marginTop: '40px'}}>
                 <h3>Currently Trending</h3>
              </div>
              
              <div className="trending-product-grid">
                {trendingList.length > 0 ? trendingList.map((item) => (
                  <div className="trending-product-card" key={item.id}>
                    <img src={item.image} alt={item.title} className="trending-product-image" />
                    <div className="trending-product-info">
                      <h4>{item.title}</h4>
                      <p className="truncate-text">{item.description}</p>
                      <p><strong>Price:</strong> AED {item.price.toFixed(2)}</p>
                      <p><strong>Stock:</strong> {item.stock}</p>
                    </div>
                    <button onClick={() => openDeleteModalTrending(item.id)} className="trending-delete-button">
                      Remove
                    </button>
                  </div>
                )) : <p>No trending products selected.</p>}
              </div>

              {/* DELETE CONFIRMATION MODAL */}
              {showDeleteTrending && (
                <div className="trending-delete-modal">
                  <div className="trending-delete-card">
                    <p>Remove this product from Trending list?</p>
                    <div className="trending-button-group">
                      <button onClick={confirmDeleteTrending} className="trending-confirm-button">
                        Yes, Remove
                      </button>
                      <button onClick={cancelDeleteTrending} className="trending-cancel-button">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}


          {/* settings */}



          {activePage === 'settings' && (
            <div className="password-page">
              <h2>Password Management</h2>

              {step === "error" && (
                <div className="card error-card">
                  <p>{message}</p>
                </div>
              )}

              {step === "success" && (
                <div className="card success-card">
                  <p>{message}</p>
                </div>
              )}

              {step === "enterInfo" && (
                <div className="card">
                  <h4>Verify Your Details</h4>
                  <input
                    type="email"
                    placeholder="Enter Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Enter Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <input
                    type="password"
                    placeholder="Enter Current Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button onClick={handleSubmitInfo}>Send OTP</button>
                </div>
              )}

              {step === "otpSent" && (
                <div className="card">
                  <h4>Enter OTP</h4>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <button onClick={handleVerifyOTP}>Verify OTP</button>
                </div>
              )}

              {step === "verified" && (
                <div className="card">
                  <h4>Change Password</h4>
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button onClick={handleChangePassword}>Update Password</button>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>



  );
};

export default LuxuryDashboard;
