import { useState } from 'react';

export const useSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  return {
    sidebarOpen,
    toggleSidebar,
    closeSidebar,
    openSidebar
  };
};

export default useSidebar;