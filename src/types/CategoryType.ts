export interface CategoryType {
  id: string;
  name: string;
  children: CategoryType[];
  isExpanded: boolean;
}