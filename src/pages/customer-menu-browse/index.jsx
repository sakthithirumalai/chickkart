import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import CustomerFlowNavigator from '../../components/ui/CustomerFlowNavigator';
import { useCart } from '../../components/ui/CartStateManager';
import CategoryTabs from './components/CategoryTabs';
import SearchBar from './components/SearchBar';
import ProductGrid from './components/ProductGrid';
import ProductDetailModal from './components/ProductDetailModal';
import FloatingCartSummary from './components/FloatingCartSummary';
import Icon from '../../components/AppIcon';
import menuService from '../../utils/menuService';

const CustomerMenuBrowse = () => {
  const navigate = useNavigate();
  const { addToCart, getCartSummary } = useCart();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [realtimeSubscription, setRealtimeSubscription] = useState(null);

  // Load categories and products from Supabase
  useEffect(() => {
    let isMounted = true;

    const loadMenuData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load categories
        const categoriesResult = await menuService.getCategories();
        if (categoriesResult?.success && isMounted) {
          const allCategory = { 
            id: 'all', 
            name: 'All Items', 
            icon_name: 'Grid3X3', 
            slug: 'all',
            count: 0 
          };
          setCategories([allCategory, ...categoriesResult.data]);
        } else if (isMounted) {
          setError(categoriesResult?.error || 'Failed to load categories');
        }

        // Load menu items
        const productsResult = await menuService.getMenuItems();
        if (productsResult?.success && isMounted) {
          const transformedProducts = productsResult.data.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: parseFloat(item.price),
            originalPrice: item.original_price ? parseFloat(item.original_price) : null,
            image: item.image_webp_url || item.image_url,
            thumbnailImage: item.image_thumbnail_url,
            category: item.category_slug,
            categoryName: item.category_name,
            rating: parseFloat(item.rating || 0),
            reviews: item.review_count || 0,
            isPopular: item.is_popular,
            isVeg: item.is_vegetarian,
            preparationTime: item.preparation_time,
            calories: item.calories,
            allergens: item.allergens || [],
            ingredients: item.ingredients || []
          }));
          setProducts(transformedProducts);

          // Update category counts
          setCategories(prevCategories => 
            prevCategories.map(cat => ({
              ...cat,
              count: cat.id === 'all' 
                ? transformedProducts.length 
                : transformedProducts.filter(p => p.category === cat.slug).length
            }))
          );
        } else if (isMounted) {
          setError(productsResult?.error || 'Failed to load menu items');
        }

      } catch (error) {
        if (isMounted) {
          setError('Failed to load menu data');
          console.log('Menu loading error:', error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadMenuData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Set up real-time subscription for menu updates
  useEffect(() => {
    const subscription = menuService.subscribeToMenuUpdates((payload) => {
      // Handle real-time updates
      if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
        // Reload menu items when changes occur
        menuService.getMenuItems().then(result => {
          if (result?.success) {
            const transformedProducts = result.data.map(item => ({
              id: item.id,
              name: item.name,
              description: item.description,
              price: parseFloat(item.price),
              originalPrice: item.original_price ? parseFloat(item.original_price) : null,
              image: item.image_webp_url || item.image_url,
              thumbnailImage: item.image_thumbnail_url,
              category: item.category_slug,
              categoryName: item.category_name,
              rating: parseFloat(item.rating || 0),
              reviews: item.review_count || 0,
              isPopular: item.is_popular,
              isVeg: item.is_vegetarian,
              preparationTime: item.preparation_time,
              calories: item.calories,
              allergens: item.allergens || [],
              ingredients: item.ingredients || []
            }));
            setProducts(transformedProducts);
          }
        });
      }
    });

    setRealtimeSubscription(subscription);

    return () => {
      if (subscription) {
        menuService.unsubscribeFromMenuUpdates(subscription);
      }
    };
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const cartSummary = getCartSummary();

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <Icon name="AlertCircle" size={48} className="text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Failed to Load Menu</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CustomerFlowNavigator />
      
      {/* Main Content */}
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Delicious Menu
                </h1>
                <p className="text-muted-foreground">
                  Discover our mouth-watering selection of fresh food
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="Clock" size={16} />
                  <span>Delivery in 15-30 mins</span>
                </div>
                {realtimeSubscription && (
                  <div className="flex items-center space-x-2 text-sm text-success">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                    <span>Live Updates</span>
                  </div>
                )}
              </div>
            </div>

            {/* Search Bar */}
            <div className="max-w-md">
              <SearchBar onSearch={setSearchTerm} />
            </div>
          </div>

          {/* Category Tabs */}
          {categories.length > 0 && (
            <CategoryTabs
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          )}

          {/* Results Header */}
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  {activeCategory === 'all' ? 'All Items' : 
                   categories.find(c => c.slug === activeCategory)?.name || 'Menu Items'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {filteredProducts.length} items available
                </p>
              </div>
              {searchTerm && (
                <div className="text-sm text-muted-foreground">
                  Searching for "{searchTerm}"
                </div>
              )}
            </div>
          </div>

          {/* Product Grid */}
          <ProductGrid
            products={filteredProducts}
            loading={loading}
            onAddToCart={handleAddToCart}
            onProductClick={handleProductClick}
          />
        </div>
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onAddToCart={handleAddToCart}
      />

      {/* Floating Cart Summary */}
      <FloatingCartSummary
        cartSummary={cartSummary}
        isVisible={!cartSummary.isEmpty}
      />
    </div>
  );
};

export default CustomerMenuBrowse;