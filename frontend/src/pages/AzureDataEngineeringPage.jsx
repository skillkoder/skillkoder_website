import React, { useEffect } from 'react';
import AzureDataEngineering from '../components/AzureDataEngineering';
import { applySEOMeta } from '../utils/seo';

const AzureDataEngineeringPage = () => {
  useEffect(() => {
    applySEOMeta({
      title: 'Azure Data Engineering Course Online | SkillKoder',
      description: 'Build modern Azure data pipelines and analytics solutions with Azure Data Factory, Databricks, Synapse, Python and Power BI through SkillKoder’s placement-focused program.',
      keywords: 'azure data engineering course online,azure data engineer training,azure data factory course,databricks course,azure synapse analytics course',
      canonical: 'https://skillkoder.com/courses/azure-data-engineering',
      ogImage: '/logo512.png',
    });
  }, []);

  return <AzureDataEngineering />;
};

export default AzureDataEngineeringPage;
