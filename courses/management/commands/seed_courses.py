"""
Management command: seed_courses
Usage:  python manage.py seed_courses
        python manage.py seed_courses --reset   # wipe & re-seed

Seeds the database with the three SkillKoder courses exactly as they
appear on the live website (Data Analytics, Data Science, Generative AI),
including all curriculum topics, tools, SEO metadata, and FAQ schema.
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from courses.models import Course, Tool, SEOMetadata


# ---------------------------------------------------------------------------
# Course data — mirrored from the React components
# ---------------------------------------------------------------------------

TOOLS_DATA = {
    # Data Analytics tools
    'Python (pandas, NumPy)': {
        'alt_text': 'Python with pandas and NumPy libraries logo',
        'website_url': 'https://www.python.org',
    },
    'SQL (MySQL / PostgreSQL)': {
        'alt_text': 'SQL database logo',
        'website_url': 'https://www.postgresql.org',
    },
    'Power BI': {
        'alt_text': 'Microsoft Power BI logo',
        'website_url': 'https://powerbi.microsoft.com',
    },
    'Tableau': {
        'alt_text': 'Tableau data visualization logo',
        'website_url': 'https://www.tableau.com',
    },
    'Excel (Advanced)': {
        'alt_text': 'Microsoft Excel logo',
        'website_url': 'https://www.microsoft.com/excel',
    },
    'Jupyter Notebooks': {
        'alt_text': 'Jupyter Notebooks logo',
        'website_url': 'https://jupyter.org',
    },
    'scikit-learn': {
        'alt_text': 'scikit-learn machine learning library logo',
        'website_url': 'https://scikit-learn.org',
    },
    'Git & GitHub': {
        'alt_text': 'Git and GitHub version control logo',
        'website_url': 'https://github.com',
    },
    'VS Code': {
        'alt_text': 'Visual Studio Code editor logo',
        'website_url': 'https://code.visualstudio.com',
    },
    # Data Science tools
    'TensorFlow': {
        'alt_text': 'TensorFlow deep learning framework logo',
        'website_url': 'https://www.tensorflow.org',
    },
    'PyTorch': {
        'alt_text': 'PyTorch deep learning framework logo',
        'website_url': 'https://pytorch.org',
    },
    'Docker': {
        'alt_text': 'Docker containerization logo',
        'website_url': 'https://www.docker.com',
    },
    'MLflow': {
        'alt_text': 'MLflow ML lifecycle management logo',
        'website_url': 'https://mlflow.org',
    },
    # Generative AI tools
    'Hugging Face Transformers': {
        'alt_text': 'Hugging Face Transformers library logo',
        'website_url': 'https://huggingface.co',
    },
    'Weights & Biases (W&B)': {
        'alt_text': 'Weights and Biases ML tracking logo',
        'website_url': 'https://wandb.ai',
    },
    'OpenAI / API clients': {
        'alt_text': 'OpenAI API logo',
        'website_url': 'https://openai.com',
    },
    'LangChain': {
        'alt_text': 'LangChain LLM framework logo',
        'website_url': 'https://www.langchain.com',
    },
    # Azure Data Engineering tools
    'Azure Data Factory': {
        'alt_text': 'Azure Data Factory logo',
        'website_url': 'https://azure.microsoft.com/en-us/products/data-factory/',
    },
    'Azure Databricks': {
        'alt_text': 'Azure Databricks logo',
        'website_url': 'https://azure.microsoft.com/en-us/products/databricks/',
    },
    'Synapse Analytics': {
        'alt_text': 'Azure Synapse Analytics logo',
        'website_url': 'https://azure.microsoft.com/en-us/products/synapse-analytics/',
    },
    'Azure Data Lake': {
        'alt_text': 'Azure Data Lake Storage logo',
        'website_url': 'https://azure.microsoft.com/en-us/products/storage/data-lake-storage/',
    },
    'PySpark': {
        'alt_text': 'Apache Spark / PySpark logo',
        'website_url': 'https://spark.apache.org/docs/latest/api/python/',
    },
}

COURSES_DATA = [
    # ------------------------------------------------------------------
    # 1. DATA ANALYTICS
    # ------------------------------------------------------------------
    {
        'title': 'Data Analytics',
        'slug': 'data-analytics-course-online',
        'niche': 'data-analytics',
        'tagline': 'Turn Data Into Decisions',
        'difficulty': 'beginner-to-advanced',
        'duration_weeks': 12,
        'is_active': True,
        'is_featured': True,
        'description': (
            "Transform your career with our industry-focused Data Analytics program, "
            "designed to turn raw data into powerful business insights. Learn to analyze, "
            "visualize, and interpret data using tools like Excel, SQL, Power BI, and Tableau. "
            "Master the essentials of statistics, data cleaning, and reporting through "
            "real-world projects. Develop the analytical mindset needed to make data-driven "
            "decisions confidently. Step into the world of opportunities as a skilled Data "
            "Analyst ready for today's data-driven industry.\n\n"
            "Work with industry-standard tools like Python, SQL, Tableau, and Power BI while "
            "building real-world projects that showcase your expertise to employers.\n\n"
            "Our Data Analytics curriculum is designed to take you from zero to job-ready "
            "in 12 weeks. You will learn Power BI from scratch — creating reports, dashboards, "
            "and data models — then progress through Python programming, SQL databases, "
            "statistics, and machine learning fundamentals. Each module is packed with "
            "hands-on exercises drawn from real business scenarios so you finish the program "
            "with a portfolio that impresses recruiters.\n\n"
            "Data Analytics professionals are in high demand across every industry. "
            "Whether you want to work in finance, healthcare, e-commerce, or tech, "
            "the skills you gain here are universally valued. Our graduates have landed "
            "roles as Business Analysts, Data Analysts, BI Developers, and Reporting "
            "Engineers at companies of all sizes."
        ),
        'salary_insights': (
            "Data Analysts in India earn ₹4–12 LPA at entry to mid level. "
            "With Power BI + Python expertise, senior roles reach ₹18–25 LPA. "
            "In the US market, Data Analysts earn $65,000–$110,000 per year. "
            "BI Developers and Senior Analysts command $90,000–$130,000. "
            "The demand for data professionals is growing 25% year-over-year, "
            "with over 100,000 open Data Analyst positions in India alone."
        ),
        'curriculum': [
            'Power BI Course',
            'Power BI Ecosystem & Report Design',
            'Visual Interaction, Grouping & Hierarchies',
            'Data Transformation with Power Query',
            'Power BI Service & Cloud Features',
            'Data Analysis Expressions (DAX) & Data Modeling',
            'Power BI Administration & Security',
            'Introduction to Python',
            'Core Python Concepts',
            'Essential Libraries for AI & Data Science',
            'Data Handling & Preprocessing',
            'Introduction to SQL',
            'Working with Multiple Tables',
            'Probability for Data Analysis',
            'Inferential Statistics for Decision Making',
            'Exploratory Data Analysis (EDA) for Better Insights',
            'Statistical Methods for Data Modeling',
            'Introduction to Machine Learning in Data Analytics',
            'Supervised Learning for Data Analytics',
            'Unsupervised Learning for Data Exploration & Insights',
            'Model Evaluation & Optimization in Analytics',
            'Feature Engineering for Improved Data Insights',
        ],
        'tools': [
            'Python (pandas, NumPy)',
            'SQL (MySQL / PostgreSQL)',
            'Power BI',
            'Tableau',
            'Excel (Advanced)',
            'Jupyter Notebooks',
            'scikit-learn',
            'Git & GitHub',
            'VS Code',
        ],
        'seo': {
            'meta_title': 'Data Analytics Course Online | SkillKoder',
            'meta_description': (
                'Learn Data Analytics online with Power BI, Python & SQL. '
                '12-week job-ready program. Real-world projects. Enroll at SkillKoder.'
            ),
            'og_title': 'Data Analytics Course Online — SkillKoder',
            'og_description': (
                'Master Power BI, Python, SQL & Tableau in 12 weeks. '
                'Industry-focused Data Analytics training with live projects.'
            ),
            'schema_keywords': (
                'data analytics course, power bi training, python for data analysis, '
                'sql course online, tableau training, data analyst certification'
            ),
            'faq_schema': [
                {
                    'question': 'Who is the Data Analytics course for?',
                    'answer': (
                        'This course is designed for beginners with no prior experience '
                        'as well as working professionals who want to upskill. '
                        'If you can use a computer and are comfortable with basic math, '
                        'you are ready to start.'
                    ),
                },
                {
                    'question': 'What tools will I learn in the Data Analytics course?',
                    'answer': (
                        'You will learn Power BI, Python (pandas, NumPy), SQL, Tableau, '
                        'Advanced Excel, Jupyter Notebooks, scikit-learn, Git & GitHub, '
                        'and VS Code — the exact tools used by data professionals every day.'
                    ),
                },
                {
                    'question': 'How long is the Data Analytics course?',
                    'answer': (
                        'The course is 12 weeks long with live sessions, recorded lectures, '
                        'and hands-on projects. You can also access the material at your own pace.'
                    ),
                },
                {
                    'question': 'What salary can I expect after completing this course?',
                    'answer': (
                        'Entry-level Data Analysts in India earn ₹4–8 LPA. '
                        'With 1–2 years of experience and Power BI + Python skills, '
                        'you can expect ₹10–18 LPA. Senior roles reach ₹20–25 LPA.'
                    ),
                },
                {
                    'question': 'Do I get a certificate after completing the course?',
                    'answer': (
                        'Yes. SkillKoder provides an industry-recognised certificate of completion '
                        'that you can add to your LinkedIn profile and resume.'
                    ),
                },
            ],
        },
    },

    # ------------------------------------------------------------------
    # 2. DATA SCIENCE
    # ------------------------------------------------------------------
    {
        'title': 'Data Science',
        'slug': 'data-science-course-online',
        'niche': 'data-science',
        'tagline': 'Build Intelligent Systems',
        'difficulty': 'intermediate',
        'duration_weeks': 16,
        'is_active': True,
        'is_featured': True,
        'description': (
            "Transform your career with our comprehensive Data Science program, designed "
            "to take you from beginner to expert. Learn the complete data workflow — from "
            "data collection and cleaning to visualization and machine learning. Master "
            "essential tools like Python, SQL, Power BI, and Tableau while building "
            "real-world projects that showcase your skills. Gain the confidence to analyze, "
            "interpret, and present data-driven insights effectively. Step into the future "
            "of tech as a skilled and industry-ready Data Scientist.\n\n"
            "Our 16-week curriculum covers the full data science stack: Python programming, "
            "statistics, classical machine learning, deep learning (ANNs, CNNs, RNNs), and "
            "natural language processing. You will work with PyTorch, TensorFlow, and "
            "scikit-learn on projects that mirror what data scientists do at top tech companies.\n\n"
            "By the end of the program you will have built a complete ML portfolio including "
            "a supervised classification model, an unsupervised clustering project, a neural "
            "network image classifier, and an NLP text analysis pipeline. These projects are "
            "designed to be shown to hiring managers as proof of your practical skills.\n\n"
            "Data Science is one of the fastest-growing and highest-paying fields in tech. "
            "Our graduates work as Data Scientists, ML Engineers, AI Researchers, and "
            "Analytics Engineers at startups, MNCs, and research institutions worldwide."
        ),
        'salary_insights': (
            "Data Scientists in India earn ₹8–20 LPA. "
            "ML Engineers at product companies reach ₹25–40 LPA. "
            "AI Researchers at top firms earn ₹30–60 LPA. "
            "In the US, Data Scientists earn $110,000–$160,000 and ML Engineers "
            "$130,000–$200,000 on average. "
            "The global demand for Data Scientists is projected to grow 36% by 2031 "
            "(US Bureau of Labor Statistics), making this one of the most in-demand "
            "tech skills worldwide."
        ),
        'curriculum': [
            'Understanding AI',
            'Application Life Cycle',
            'Data Fundamentals',
            'Computing for AI',
            'AI Applications',
            'Introduction to Python',
            'Core Python Concepts',
            'Object-Oriented Programming (OOP) in Python',
            'Essential Libraries for AI & Data Science',
            'Data Handling & Preprocessing',
            'Introduction to Statistics for AI & Data Science',
            'Descriptive Statistics',
            'Probability Basics',
            'Inferential Statistics',
            'Exploratory Data Analysis (EDA)',
            'Statistical Foundations for Machine Learning & Project',
            'Introduction to Machine Learning',
            'Supervised Learning',
            'Unsupervised Learning',
            'Model Evaluation & Optimization',
            'Feature Engineering & Project',
            'Neural Networks Basics',
            'Artificial Neural Networks (ANNs)',
            'Convolutional Neural Networks (CNNs)',
            'Natural Language Processing (NLP)',
            'Recurrent Neural Networks (RNNs)',
        ],
        'tools': [
            'Python (pandas, NumPy)',
            'TensorFlow',
            'PyTorch',
            'scikit-learn',
            'Jupyter Notebooks',
            'Docker',
            'MLflow',
            'Git & GitHub',
            'VS Code',
        ],
        'seo': {
            'meta_title': 'Data Science Course Online | SkillKoder',
            'meta_description': (
                'Master Data Science with Python, ML & Deep Learning. '
                '16-week program. NLP, CNNs, RNNs & real projects. Enroll at SkillKoder.'
            ),
            'og_title': 'Data Science Course Online — SkillKoder',
            'og_description': (
                'Learn Python, Machine Learning, Deep Learning & NLP in 16 weeks. '
                'Industry-grade Data Science training with hands-on projects.'
            ),
            'schema_keywords': (
                'data science course, machine learning training, deep learning course, '
                'python for data science, nlp course, neural networks training, '
                'data scientist certification'
            ),
            'faq_schema': [
                {
                    'question': 'What is the difference between Data Analytics and Data Science?',
                    'answer': (
                        'Data Analytics focuses on interpreting existing data to answer '
                        'specific business questions using tools like Power BI and SQL. '
                        'Data Science goes further — it involves building predictive models, '
                        'machine learning systems, and deep learning pipelines that can '
                        'generate new insights and automate decisions.'
                    ),
                },
                {
                    'question': 'Do I need prior coding experience for the Data Science course?',
                    'answer': (
                        'Basic Python knowledge is recommended, but not mandatory. '
                        'The first two weeks of the course cover all the Python and '
                        'statistics fundamentals you need to succeed in the program.'
                    ),
                },
                {
                    'question': 'What machine learning frameworks will I learn?',
                    'answer': (
                        'You will learn scikit-learn for classical ML, PyTorch and TensorFlow '
                        'for deep learning, and work with real datasets throughout the program. '
                        'You will also use MLflow for experiment tracking and Docker for '
                        'containerising your models.'
                    ),
                },
                {
                    'question': 'How long is the Data Science course?',
                    'answer': (
                        'The program is 16 weeks long with live instructor-led sessions, '
                        'weekly assignments, and capstone projects. '
                        'Recordings are available for self-paced learning.'
                    ),
                },
                {
                    'question': 'What jobs can I apply for after completing the Data Science course?',
                    'answer': (
                        'Our graduates work as Data Scientists, ML Engineers, AI Engineers, '
                        'NLP Engineers, Computer Vision Engineers, and Analytics Engineers. '
                        'The skills you develop apply to virtually every industry — '
                        'from fintech and healthcare to e-commerce and manufacturing.'
                    ),
                },
            ],
        },
    },

    # ------------------------------------------------------------------
    # 3. GENERATIVE AI
    # ------------------------------------------------------------------
    {
        'title': 'Generative AI',
        'slug': 'generative-ai-course-online',
        'niche': 'generative-ai',
        'tagline': 'Create with AI Power',
        'difficulty': 'advanced',
        'duration_weeks': 10,
        'is_active': True,
        'is_featured': True,
        'description': (
            "Transform your future with our cutting-edge Generative AI program, crafted "
            "to help you master the power of intelligent creation. Learn how to build AI "
            "models that generate text, images, code, and more using tools like Python, "
            "TensorFlow, and OpenAI APIs. Explore deep learning, NLP, and diffusion models "
            "through real-world, hands-on projects. Gain the expertise to innovate with AI "
            "across industries and solve complex challenges creatively. Step confidently into "
            "the world of Generative AI and advanced machine intelligence.\n\n"
            "This program starts with the statistical and machine learning foundations you "
            "need, then rapidly progresses to the most in-demand Generative AI skills: "
            "transformer architectures, large language models (LLMs), prompt engineering, "
            "retrieval-augmented generation (RAG), AI agents, and production deployment.\n\n"
            "You will build real Generative AI applications — a custom chatbot powered by an "
            "LLM, an AI agent that uses tools, and a RAG pipeline that answers questions over "
            "your own documents. These projects demonstrate production-level AI engineering "
            "skills that are in extremely high demand right now.\n\n"
            "Generative AI is the fastest-growing area in technology. Companies worldwide "
            "are urgently hiring engineers who can build with LLMs, create AI agents, and "
            "integrate Generative AI into products. This course gives you exactly those skills."
        ),
        'salary_insights': (
            "Generative AI Engineers are among the highest paid in tech globally. "
            "In India, entry-level AI Engineers earn ₹10–18 LPA, "
            "mid-level roles reach ₹20–40 LPA, "
            "and specialist LLM Engineers at product companies earn ₹40–80 LPA. "
            "In the US, AI Engineers earn $140,000–$200,000 and "
            "LLM/Generative AI specialists earn $180,000–$300,000 at top firms. "
            "The World Economic Forum lists AI and Machine Learning Specialists as "
            "the fastest-growing job role of the decade. "
            "Companies like Google, Meta, Microsoft, and thousands of AI startups "
            "are actively hiring Generative AI talent with skills in LangChain, "
            "RAG, fine-tuning, and AI agent development."
        ),
        'curriculum': [
            'Introduction to Statistics for AI & Data Science',
            'Descriptive Statistics',
            'Probability Basics',
            'Inferential Statistics',
            'Exploratory Data Analysis (EDA)',
            'Statistical Foundations for Machine Learning',
            'Introduction to Machine Learning',
            'Supervised Learning',
            'Unsupervised Learning',
            'Model Evaluation & Optimization',
            'Feature Engineering',
            'Neural Networks Basics',
            'Artificial Neural Networks (ANNs)',
            'Convolutional Neural Networks (CNNs)',
            'Natural Language Processing (NLP)',
            'Recurrent Neural Networks (RNNs)',
            'Introduction to Generative AI',
            'Prompt Engineering',
            'Transformer Architecture, LLMs & Other Generative Models',
            'Tools and Frameworks for Generative AI',
            'Introduction to AI Agents',
            'AI Agent Frameworks',
            'Building AI Agents',
        ],
        'tools': [
            'Python (pandas, NumPy)',
            'PyTorch',
            'Hugging Face Transformers',
            'TensorFlow',
            'Jupyter Notebooks',
            'Docker',
            'Weights & Biases (W&B)',
            'OpenAI / API clients',
            'LangChain',
            'Git & GitHub',
        ],
        'seo': {
            'meta_title': 'Generative AI Course Online | SkillKoder',
            'meta_description': (
                'Learn Generative AI, prompt engineering, LangChain & AI agents. '
                '10-week expert program. Build production AI apps. Enroll at SkillKoder.'
            ),
            'og_title': 'Generative AI Course Online — SkillKoder',
            'og_description': (
                'Master LLMs, prompt engineering, RAG & AI agents in 10 weeks. '
                'Build real Generative AI applications with LangChain and OpenAI.'
            ),
            'schema_keywords': (
                'generative ai course, llm training, prompt engineering course, '
                'langchain tutorial, ai agents course, chatgpt training, '
                'large language models course, rag pipeline, generative ai certification'
            ),
            'faq_schema': [
                {
                    'question': 'What prior knowledge do I need for the Generative AI course?',
                    'answer': (
                        'You should be comfortable with Python programming and have a basic '
                        'understanding of machine learning concepts. The course begins with '
                        'a statistics and ML refresher, but prior exposure to Python and '
                        'numpy/pandas will help you get the most from the program.'
                    ),
                },
                {
                    'question': 'What is prompt engineering and why does it matter?',
                    'answer': (
                        'Prompt engineering is the skill of crafting inputs to large language '
                        'models (like GPT-4 or Claude) to get the best possible outputs. '
                        'It is one of the most in-demand skills in AI right now because '
                        'it lets you control AI behaviour without needing to retrain a model.'
                    ),
                },
                {
                    'question': 'Will I learn to build AI agents in this course?',
                    'answer': (
                        'Yes. The last three modules of the course are dedicated to AI agents — '
                        'what they are, the major frameworks (LangChain, AutoGen, CrewAI), '
                        'and how to build agents that can browse the web, write and run code, '
                        'and interact with external APIs.'
                    ),
                },
                {
                    'question': 'What is RAG and will I learn it in this course?',
                    'answer': (
                        'RAG (Retrieval-Augmented Generation) is a technique that allows an '
                        'LLM to answer questions based on your own private documents or database. '
                        'It is one of the most widely used Generative AI patterns in production. '
                        'Yes — you will build a complete RAG pipeline during the course.'
                    ),
                },
                {
                    'question': 'What salary can I expect as a Generative AI Engineer?',
                    'answer': (
                        'Generative AI is the highest-paying specialisation in tech right now. '
                        'In India, experienced AI Engineers earn ₹20–60 LPA. '
                        'In the US, LLM Engineers earn $160,000–$280,000 at top companies. '
                        'The demand far exceeds the supply of qualified engineers, '
                        'making this an exceptional career investment.'
                    ),
                },
            ],
        },
    },

    # ------------------------------------------------------------------
    # 4. AZURE DATA ENGINEERING
    # ------------------------------------------------------------------
    {
        'title': 'Azure Data Engineering',
        'slug': 'azure-data-engineering-course-online',
        'niche': 'azure-data-engineering',
        'tagline': 'Master the Cloud Data Ecosystem',
        'difficulty': 'intermediate-to-advanced',
        'duration_weeks': 14,
        'is_active': True,
        'is_featured': True,
        'description': (
            "Become a specialist in cloud data solutions with our Azure Data Engineering program. "
            "Learn to design, build, and manage scalable data pipelines using the Microsoft Azure stack. "
            "Master essential services like Azure Data Factory, Databricks, Synapse Analytics, and "
            "Azure Data Lake. Develop expertise in big data processing with PySpark and SQL in the cloud. "
            "Build real-world production-grade data architectures that transform raw data into "
            "business intelligence at scale. Step into high-demand roles as a Cloud Data Engineer "
            "at top enterprises and tech companies worldwide.\n\n"
            "This course follows a hands-on approach, where you will build complete end-to-end "
            "data ETL/ELT pipelines. You will start with the fundamentals of cloud computing "
            "and Azure storage, then move into advanced data orchestration, streaming analytics, "
            "and lakehouse architectures. By the end of this 14-week program, you will have a "
            "portfolio of projects demonstrating your ability to handle massive datasets and "
            "optimize cloud costs.\n\n"
            "Azure is the preferred cloud platform for thousands of enterprises. As companies "
            "migrate their data infrastructure to the cloud, the demand for certified "
            "Azure Data Engineers has skyrocketed. Our curriculum is aligned with industry "
            "requirements and helps prepare you for certification while giving you the "
            "practical skills to excel from day one on the job."
        ),
        'salary_insights': (
            "Azure Data Engineers are among the most sought-after professionals in the cloud domain. "
            "In India, mid-level Azure Data Engineers earn ₹12–25 LPA, "
            "while senior architects can command ₹30–50+ LPA. "
            "In the US market, average salaries range from $120,000 to $175,000 per year. "
            "Growth in cloud-based data roles is projected at 30% annually as more "
            "businesses abandon on-premise solutions for Azure's powerful data ecosystem."
        ),
        'curriculum': [
            'Introduction to Azure Cloud Fundamentals',
            'Azure Data Lake Storage (ADLS) Gen2',
            'SQL in the Cloud: Azure SQL Database',
            'Data Orchestration with Azure Data Factory (ADF)',
            'Building ETL/ELT Pipelines with ADF',
            'Introduction to Apache Spark & PySpark',
            'Data Processing with Azure Databricks',
            'Big Data Analytics with Azure Synapse Analytics',
            'Stream Analytics & Real-time Data Processing',
            'Implementing the Medallion Architecture (Bronze, Silver, Gold)',
            'Azure Key Vault & Security Best Practices',
            'Monitoring & Optimization of Azure Data Services',
            'CI/CD for Data Pipelines using Azure DevOps',
            'Capstone Project: End-to-End Cloud Data Warehouse',
        ],
        'tools': [
            'Azure Data Factory',
            'Azure Databricks',
            'Synapse Analytics',
            'Azure Data Lake',
            'SQL (MySQL / PostgreSQL)',
            'Python (pandas, NumPy)',
            'PySpark',
            'Git & GitHub',
            'VS Code',
        ],
        'seo': {
            'meta_title': 'Azure Data Engineering Course Online | SkillKoder',
            'meta_description': (
                'Master Azure Data Factory, Databricks & Synapse Analytics. '
                '14-week Cloud Data Engineering program with live projects. Enroll at SkillKoder.'
            ),
            'og_title': 'Azure Data Engineering Course Online — SkillKoder',
            'og_description': (
                'Learn to build scalable data pipelines on Microsoft Azure. '
                'Master ADF, Spark, Databricks & Synapse in 14 weeks.'
            ),
            'schema_keywords': (
                'azure data engineering course, azure data factory training, '
                'databricks course, synapse analytics tutorial, cloud data engineer certification, '
                'pyspark training on azure'
            ),
            'faq_schema': [
                {
                    'question': 'What are the prerequisites for the Azure Data Engineering course?',
                    'answer': (
                        'A basic understanding of SQL and Python is recommended. '
                        'While prior cloud experience is helpful, we start with Azure '
                        'fundamentals to ensure everyone is on the same page.'
                    ),
                },
                {
                    'question': 'Which Azure certifications does this course align with?',
                    'answer': (
                        'Our curriculum is closely aligned with the requirements for '
                        'the DP-203 (Microsoft Certified: Azure Data Engineer Associate) exam.'
                    ),
                },
                {
                    'question': 'What is the Medallion Architecture?',
                    'answer': (
                        'It is a data design pattern used to organize data in a lakehouse, '
                        'moving from raw (Bronze) to filtered (Silver) to business-ready (Gold) layers. '
                        'You will implement this architecture in your projects.'
                    ),
                },
                {
                    'question': 'Will I get hands-on experience with real Azure accounts?',
                    'answer': (
                        'Yes, we guide you through setting up Azure free-tier or student '
                        'accounts and perform all projects in a live cloud environment.'
                    ),
                },
            ],
        },
    },
]


# ---------------------------------------------------------------------------
# Command
# ---------------------------------------------------------------------------

class Command(BaseCommand):
    help = 'Seed the database with all SkillKoder courses, tools, and SEO metadata.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--reset',
            action='store_true',
            help='Delete all existing courses and tools before seeding.',
        )

    @transaction.atomic
    def handle(self, *args, **options):
        if options['reset']:
            self.stdout.write(self.style.WARNING('Deleting all existing courses and tools...'))
            SEOMetadata.objects.all().delete()
            Course.objects.all().delete()
            Tool.objects.all().delete()
            self.stdout.write(self.style.WARNING('Cleared.'))

        # -- Create / update all tools first
        self.stdout.write('Creating tools...')
        tool_objects = {}
        for name, data in TOOLS_DATA.items():
            tool, created = Tool.objects.get_or_create(
                name=name,
                defaults={
                    'alt_text': data['alt_text'],
                    'website_url': data.get('website_url', ''),
                }
            )
            if not created:
                # Update in case data changed
                tool.alt_text = data['alt_text']
                tool.website_url = data.get('website_url', '')
                tool.save()
            tool_objects[name] = tool
            status = 'Created' if created else 'Updated'
            self.stdout.write(f'  {status} tool: {name}')

        self.stdout.write('')

        # -- Create / update each course
        for course_data in COURSES_DATA:
            seo_data = course_data.pop('seo')
            tool_names = course_data.pop('tools')

            course, created = Course.objects.update_or_create(
                slug=course_data['slug'],
                defaults=course_data,
            )

            # Assign tools
            course.tools.set([tool_objects[name] for name in tool_names if name in tool_objects])

            # Create or update SEO metadata
            SEOMetadata.objects.update_or_create(
                course=course,
                defaults=seo_data,
            )

            status = 'Created' if created else 'Updated'
            self.stdout.write(
                self.style.SUCCESS(
                    f'  {status} course: {course.title} '
                    f'(slug: {course.slug}, {len(tool_names)} tools, '
                    f'{len(course_data["curriculum"])} curriculum topics, '
                    f'{len(seo_data["faq_schema"])} FAQs)'
                )
            )

        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS(
            f'Done. Seeded {len(COURSES_DATA)} courses and {len(TOOLS_DATA)} tools.'
        ))
        self.stdout.write(
            'Visit http://127.0.0.1:8000/admin/login to manage them in the admin portal.'
        )
        self.stdout.write(
            'Visit http://127.0.0.1:8000/api/v1/courses/ to see the API output.'
        )
