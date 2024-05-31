import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { CategoryType } from '../types/CategoryType';

interface CategoryState {
  categories: CategoryType[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

export const loadCategories = createAsyncThunk(
  'categories/loadCategories',
  async () => {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    let categories: CategoryType[] = [];
    querySnapshot.forEach((doc) => {
      categories = doc.data().categories;
    });
    return categories;
  }
);

export const saveCategories = createAsyncThunk(
  'categories/saveCategories',
  async (categories: CategoryType[]) => {
    await setDoc(doc(db, 'categories', 'categoryTree'), { categories });
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory: (
      state,
      action: PayloadAction<{ parentId: string | null }>
    ) => {
      const parentId = action.payload.parentId;
      const newCategory: CategoryType = {
        id: Date.now().toString(),
        name: generateCategoryName(
          state.categories,
          parentId ? findCategoryById(state.categories, parentId) : null
        ),
        children: [],
        isExpanded: true,
      };

      if (parentId === null) {
        state.categories.push(newCategory);
      } else {
        const addCategoryRecursively = (
          items: CategoryType[]
        ): CategoryType[] => {
          return items.map((item) => {
            if (item.id === parentId) {
              return { ...item, children: [...item.children, newCategory] };
            } else if (item.children.length) {
              return {
                ...item,
                children: addCategoryRecursively(item.children),
              };
            }
            return item;
          });
        };
        state.categories = addCategoryRecursively(state.categories);
      }
    },
    updateCategory: (
      state,
      action: PayloadAction<{ id: string; newName: string }>
    ) => {
      const { id, newName } = action.payload;
      const updateCategoryRecursively = (
        items: CategoryType[]
      ): CategoryType[] => {
        return items.map((item) => {
          if (item.id === id) {
            return { ...item, name: newName };
          } else if (item.children.length) {
            return {
              ...item,
              children: updateCategoryRecursively(item.children),
            };
          }
          return item;
        });
      };
      state.categories = updateCategoryRecursively(state.categories);
    },
    deleteCategory: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      const deleteCategoryRecursively = (
        items: CategoryType[]
      ): CategoryType[] => {
        return items.filter((item) => {
          if (item.id === id) {
            return false;
          } else if (item.children.length) {
            item.children = deleteCategoryRecursively(item.children);
          }
          return true;
        });
      };
      state.categories = deleteCategoryRecursively(state.categories);
    },
    toggleExpand: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      const toggleExpandRecursively = (
        items: CategoryType[]
      ): CategoryType[] => {
        return items.map((item) => {
          if (item.id === id) {
            return { ...item, isExpanded: !item.isExpanded };
          } else if (item.children.length) {
            return {
              ...item,
              children: toggleExpandRecursively(item.children),
            };
          }
          return item;
        });
      };
      state.categories = toggleExpandRecursively(state.categories);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.loading = false;
      })
      .addCase(loadCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load categories';
      });
  },
});

const findCategoryById = (
  items: CategoryType[],
  id: string
): CategoryType | null => {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.children.length) {
      const found = findCategoryById(item.children, id);
      if (found) return found;
    }
  }
  return null;
};

const generateCategoryName = (
  categories: CategoryType[],
  parentCategory: CategoryType | null
): string => {
  if (parentCategory === null) {
    return categories.length === 0 ? 'Cat' : `Cat-${categories.length + 1}`;
  }
  const subCategoryCount = parentCategory.children.length + 1;
  const parentName = parentCategory.name;
  return `${parentName}-${subCategoryCount}`;
};

export const { addCategory, updateCategory, deleteCategory, toggleExpand } =
  categorySlice.actions;
export default categorySlice.reducer;
