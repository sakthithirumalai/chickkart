import React from 'react';
import Icon from '../../../components/AppIcon';

const CategoryTabs = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="mb-6">
      <div className="flex overflow-x-auto scrollbar-hide space-x-2 pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.slug || category.id)}
            className={`
              flex items-center space-x-2 px-4 py-3 rounded-lg whitespace-nowrap transition-all duration-200
              ${activeCategory === (category.slug || category.id)
                ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                : 'bg-card text-muted-foreground hover:bg-muted hover:text-foreground border border-border'
              }
            `}
          >
            {category.icon_name && (
              <Icon 
                name={category.icon_name} 
                size={18} 
                className={activeCategory === (category.slug || category.id) ? 'text-primary-foreground' : 'text-muted-foreground'} 
              />
            )}
            <span className="font-medium">{category.name}</span>
            {category.count !== undefined && (
              <span className={`
                text-xs px-2 py-1 rounded-full font-medium
                ${activeCategory === (category.slug || category.id)
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
                }
              `}>
                {category.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;