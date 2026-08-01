import React, { useEffect } from 'react';
import AzureDataEngineering from '../components/AzureDataEngineering';
import { applySEO } from '../utils/seo';

const AzureDataEngineeringPage = () => {
  useEffect(() => {
    applySEO('/courses/azure-data-engineering');
  }, []);

  return <AzureDataEngineering />;
};

export default AzureDataEngineeringPage;
