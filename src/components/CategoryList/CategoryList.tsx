import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import {
  addCategory,
  updateCategory,
  deleteCategory,
  toggleExpand,
} from '../../store/categorySlice';
import { CategoryItem } from '../CategoryItem';

export const CategoryList: React.FC = () => {
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const dispatch = useDispatch();

  return (
    <ul>
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          onAddCategory={(parentId) => dispatch(addCategory({ parentId }))}
          onUpdateCategory={(id, newName) =>
            dispatch(updateCategory({ id, newName }))
          }
          onDeleteCategory={(id) => dispatch(deleteCategory({ id }))}
          onToggleExpand={(id) => dispatch(toggleExpand({ id }))}
        />
      ))}
    </ul>
  );
};
