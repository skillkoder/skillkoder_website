import React, { useEffect } from 'react';
import DataScience from '../components/DataScience';
import { applySEO } from '../utils/seo';

const DataSciencePage = () => {
  useEffect(() => {
    applySEO('/courses/data-science');
  }, []);

  return <DataScience />;
};

export default DataSciencePage;
