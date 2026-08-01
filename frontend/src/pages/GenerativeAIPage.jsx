import React, { useEffect } from 'react';
import GenerativeAI from '../components/GenerativeAI';
import { applySEO } from '../utils/seo';

const GenerativeAIPage = () => {
  useEffect(() => {
    applySEO('/courses/generative-ai');
  }, []);

  return <GenerativeAI />;
};

export default GenerativeAIPage;
