import React, { useEffect } from 'react';
import DataScience from '../components/DataScience';
import { applySEOMeta } from '../utils/seo';

const DataSciencePage = () => {
  useEffect(() => {
    applySEOMeta({
      title: 'Data Science Course Online | SkillKoder',
      description: 'Master Data Science with Python, machine learning, NLP and real-world projects. SkillKoder prepares you for data science careers with expert mentorship.',
      keywords: 'data science course online,data science with python,python data science course,machine learning course online,data scientist training program',
      canonical: 'https://skillkoder.com/courses/data-science',
      ogImage: '/logo512.png',
    });
  }, []);

  return <DataScience />;
};

export default DataSciencePage;
