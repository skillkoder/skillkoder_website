import React, { useEffect } from 'react';
import DataAnalytics from '../components/DataAnalytics';
import { applySEOMeta } from '../utils/seo';

const DataAnalyticsPage = () => {
  useEffect(() => {
    applySEOMeta({
      title: 'Data Analytics Course Online | SkillKoder',
      description: 'Learn Data Analytics online with Python, Power BI, SQL, Tableau and get placement-focused training with real-world projects at SkillKoder.',
      keywords: 'data analytics course online,data analyst course with placement,learn data analytics for beginners,power bi course,sql for data analytics',
      canonical: 'https://skillkoder.com/courses/data-analytics',
      // ogImage: '/logo512.png',
      ogImage: '/course2.webp',
    });
  }, []);

  return <DataAnalytics />;
};

export default DataAnalyticsPage;
