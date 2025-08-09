import { createSelector } from '@reduxjs/toolkit';
import { selectAllMyProjects } from './myProjectsSlice';
import authSelector from '../auth/authSelector';

const selectMyOwnedProjects = createSelector(
  [selectAllMyProjects, authSelector.selectUser],
  (projects, user) =>
    projects.filter((project) => (user ? project.ownerId === user.id : [])),
);

const myProjectsSelector = {
  selectMyOwnedProjects,
};
export default myProjectsSelector;
