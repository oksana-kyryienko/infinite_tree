import React from 'react';
import { CategoryType } from '../../types/CategoryType';

interface CategoryItemProps {
  category: CategoryType;
  onAddCategory: (parentId: string) => void;
  onUpdateCategory: (id: string, newName: string) => void;
  onDeleteCategory: (id: string) => void;
  onToggleExpand: (id: string) => void;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onToggleExpand,
}) => {
  const handleRename = () => {
    const newName = prompt('Enter new name:', category.name);
    if (newName) {
      onUpdateCategory(category.id, newName);
    }
  };

  return (
    <li>
      <span
        onClick={() => onToggleExpand(category.id)}
        style={{ cursor: 'pointer', marginRight: '8px' }}
      >
        {category.isExpanded ? '-' : '+'}
      </span>
      {category.name}
      <button onClick={handleRename}>Rename</button>
      <button onClick={() => onAddCategory(category.id)}>
        Add Subcategory
      </button>
      <button onClick={() => onDeleteCategory(category.id)}>Delete</button>
      {category.isExpanded && category.children.length > 0 && (
        <ul>
          {category.children.map((child) => (
            <CategoryItem
              key={child.id}
              category={child}
              onAddCategory={onAddCategory}
              onUpdateCategory={onUpdateCategory}
              onDeleteCategory={onDeleteCategory}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </ul>
      )}
    </li>
  );
};
