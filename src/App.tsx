import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCategory, saveCategories, loadCategories } from './store/categorySlice';
import { CategoryList } from './components/CategoryList';
import { RootState, AppDispatch } from './store/store';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector((state: RootState) => state.categories.categories);

  useEffect(() => {
    dispatch(loadCategories());
  }, [dispatch]);

  useEffect(() => {
    if (categories.length > 0) {
      dispatch(saveCategories(categories));
    }
  }, [categories, dispatch]);

  return (
    <div>
      <h1>Category Tree</h1>
      <button onClick={() => dispatch(addCategory({ parentId: null }))}>Add Root Category</button>
      <CategoryList />
    </div>
  );
};

export default App;
