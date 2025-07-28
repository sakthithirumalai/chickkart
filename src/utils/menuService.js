import { supabase } from './supabase';

const menuService = {
  // Get all menu categories
  getCategories: async () => {
    try {
      const { data, error } = await supabase
        .from('menu_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted.' 
        };
      }
      return { success: false, error: 'Failed to load categories' };
    }
  },

  // Get all menu items with category info
  getMenuItems: async (categoryId = null, searchTerm = '') => {
    try {
      let query = supabase
        .from('menu_items_with_category')
        .select('*')
        .eq('is_available', true);

      if (categoryId && categoryId !== 'all') {
        query = query.eq('category_id', categoryId);
      }

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query.order('display_order', { ascending: true });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted.' 
        };
      }
      return { success: false, error: 'Failed to load menu items' };
    }
  },

  // Get single menu item by ID
  getMenuItem: async (itemId) => {
    try {
      const { data, error } = await supabase
        .from('menu_items_with_category')
        .select('*')
        .eq('id', itemId)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted.' 
        };
      }
      return { success: false, error: 'Failed to load menu item' };
    }
  },

  // Subscribe to real-time menu updates
  subscribeToMenuUpdates: (callback) => {
    const subscription = supabase
      .channel('menu-updates')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'menu_items' 
        },
        (payload) => {
          callback(payload);
        }
      )
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'menu_updates' 
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    return subscription;
  },

  // Unsubscribe from real-time updates
  unsubscribeFromMenuUpdates: (subscription) => {
    if (subscription) {
      supabase.removeChannel(subscription);
    }
  },

  // Admin: Update menu item availability
  updateItemAvailability: async (itemId, isAvailable) => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .update({ 
          is_available: isAvailable,
          updated_at: new Date().toISOString()
        })
        .eq('id', itemId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to update item availability' };
    }
  },

  // Admin: Update menu item price
  updateItemPrice: async (itemId, price) => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .update({ 
          price: price,
          updated_at: new Date().toISOString()
        })
        .eq('id', itemId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to update item price' };
    }
  },

  // Get menu update history
  getMenuUpdateHistory: async (limit = 50) => {
    try {
      const { data, error } = await supabase
        .from('menu_updates')
        .select(`
          *,
          menu_items!inner(name),
          user_profiles(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to load update history' };
    }
  }
};

export default menuService;