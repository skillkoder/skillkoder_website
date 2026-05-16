import React, { useEffect } from 'react';
import GenerativeAI from '../components/GenerativeAI';
import { applySEOMeta } from '../utils/seo';

const GenerativeAIPage = () => {
  useEffect(() => {
    applySEOMeta({
      title: 'Generative AI Course Online | SkillKoder',
      description: 'Learn generative AI, ChatGPT, prompt engineering and AI tool development with hands-on projects and career support from SkillKoder.',
      keywords: 'generative ai course online,chatgpt course india,ai tools course for beginners,prompt engineering course,generative ai training',
      canonical: 'https://skillkoder.com/courses/generative-ai',
      ogImage: '/logo512.png',
    });
  }, []);

  return <GenerativeAI />;
};

export default GenerativeAIPage;
