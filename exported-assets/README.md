Smart Product Review Analyzer with Fake Review Detection
Overview
This project is an AI-powered platform designed to enhance online shopping by providing advanced product review analysis combined with fake review detection. It utilizes Natural Language Processing (NLP), Machine Learning, and Sentiment Analysis to assist consumers in making informed purchasing decisions.

Key Features
Fake Review Detection with over 95% accuracy

Aspect-based Sentiment Analysis for detailed opinion mining

AI-generated summarization highlighting pros and cons

Real-time interactive dashboard with visual analytics

Transparent and explainable AI decision models

Fast processing capable of analyzing thousands of reviews quickly

Installation
Prerequisites
Python 3.9 or higher

pip package manager

Minimum 4 GB RAM

Modern web browser

Steps
bash
git clone https://github.com/Shreshth-Ghub/Project-Review-Summarizer-with-Fake-Review-Detector.git
cd Project-Review-Summarizer-with-Fake-Review-Detector
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
pip install -r requirements.txt
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"
python app.py
Access the platform at:

Landing Page: http://localhost:5000/

Dashboard: http://localhost:5000/dashboard

API Documentation: http://localhost:5000/api/stats

Project Structure
text
Project-Review-Summarizer-with-Fake-Review-Detector/
│
├── app.py                      # Main Flask application
├── fake_review_detector.py     # Fake review detection module
├── sentiment_analyzer.py       # Sentiment analysis module
├── review_summarizer.py        # Review summarization module
├── product_reviews_dataset.csv # Dataset file
├── requirements.txt            # Project dependencies
├── README.md                   # Project documentation
│
├── templates/                  # HTML templates
│   ├── index.html
│   └── dashboard.html
│
├── static/                     # Static files like CSS and JS
│
├── models/                     # Machine learning models
│
└── docs/                       # Additional project documentation
Features & Capabilities
Fake Review Detection
Uses a Gradient Boosting Classifier trained on 108 linguistic and behavioral features

Real-time predictions with confidence scores

Accuracy: 95.3%

Sentiment Analysis
Multi-level sentiment scoring (overall and aspect-based)

Provides normalized sentiment scores from -1 to +1

Review Summarization
Extracts key pros and cons automatically

Generates concise summaries filtered for fake reviews

Dashboard
Displays interactive charts and detailed analytics for product reviews

Dataset
Total samples: 5,000 reviews

Genuine reviews: 3,564 (71.3%)

Fake reviews: 1,436 (28.7%)

Product categories include Electronics, Clothing, Home, Books, and Sports

Model Performance
Metric	Fake Review Detection	Sentiment Analysis
Accuracy	95.3%	92.1%
Precision	93.8%	—
Recall	94.6%	—
F1-Score	94.2%	—
Aspect Detection	—	88.4%
Technology Stack
Backend: Python 3.9+, Flask 3.0, Scikit-learn, XGBoost

Frontend: HTML5, CSS3, Bootstrap 5, JavaScript, Plotly.js

Machine Learning: Gradient Boosting, TF-IDF, Feature Engineering

Contribution Guidelines
Fork the repository

Create a feature branch

Commit changes with descriptive messages

Push the branch

Submit a pull request

Please follow PEP 8 style guides and include tests and documentation where applicable.

License
This project is licensed under the MIT License. See the LICENSE file for details.

Contact
For inquiries or collaboration, please email: shreshthgupt@gmail.com
GitHub repository: https://github.com/Shreshth-Ghub/Project-Review-Summarizer-with-Fake-Review-Detector

