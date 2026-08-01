import React, { useEffect } from 'react';
import DataAnalytics from '../components/DataAnalytics';
import { applySEO } from '../utils/seo';

const DataAnalyticsPage = () => {
  useEffect(() => {
    applySEO('/courses/data-analytics');
  }, []);

  return <DataAnalytics />;
};

export default DataAnalyticsPage;
