from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import json
import os
from datetime import datetime

from fake_review_detector import FakeReviewDetector
from review_summarizer import ReviewSummarizer
from sentiment_analyzer import SentimentAnalyzer

app = Flask(__name__)
CORS(app)

fake_detector = FakeReviewDetector()
summarizer = ReviewSummarizer()
sentiment_analyzer = SentimentAnalyzer()

DATA_PATH = 'product_reviews_dataset.csv'

class SmartReviewAnalyzer:
    def __init__(self):
        self.df = None
        self.load_data()

    def load_data(self):
        try:
            if os.path.exists(DATA_PATH):
                self.df = pd.read_csv(DATA_PATH)
                print(f"✓ Loaded {len(self.df)} reviews from dataset")
            else:
                print("⚠ Dataset not found. Please ensure product_reviews_dataset.csv exists")
        except Exception as e:
            print(f"Error loading data: {e}")

    def get_product_list(self):
        if self.df is None:
            return []
        return self.df['product_name'].unique().tolist()

    def get_reviews_for_product(self, product_name):
        if self.df is None:
            return []
        product_reviews = self.df[self.df['product_name'] == product_name]
        return product_reviews.to_dict('records')

    def analyze_product(self, product_name):
        reviews = self.get_reviews_for_product(product_name)

        if not reviews:
            return {'error': 'No reviews found for this product'}

        genuine_reviews = [r for r in reviews if r['is_fake'] == 0]
        fake_reviews = [r for r in reviews if r['is_fake'] == 1]

        all_texts = [r['review_text'] for r in reviews]
        genuine_texts = [r['review_text'] for r in genuine_reviews]

        sentiment_results = sentiment_analyzer.analyze_reviews(genuine_texts)

        summary = summarizer.generate_summary(genuine_texts, sentiment_results)

        fake_stats = {
            'total_reviews': len(reviews),
            'genuine_reviews': len(genuine_reviews),
            'fake_reviews': len(fake_reviews),
            'fake_percentage': (len(fake_reviews) / len(reviews) * 100) if reviews else 0,
            'avg_rating': float(np.mean([r['rating'] for r in reviews])),
            'genuine_avg_rating': float(np.mean([r['rating'] for r in genuine_reviews])) if genuine_reviews else 0
        }

        return {
            'product_name': product_name,
            'summary': summary,
            'sentiment': sentiment_results,
            'fake_stats': fake_stats,
            'reviews': reviews[:20]
        }

analyzer = SmartReviewAnalyzer()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/dashboard')
def dashboard():
    products = analyzer.get_product_list()
    return render_template('dashboard.html', products=products)

@app.route('/api/products')
def get_products():
    try:
        products = analyzer.get_product_list()
        return jsonify({
            'success': True,
            'products': products,
            'count': len(products)
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/analyze', methods=['POST'])
def analyze_product():
    try:
        data = request.json
        product_name = data.get('product_name')

        if not product_name:
            return jsonify({'success': False, 'error': 'Product name required'}), 400

        result = analyzer.analyze_product(product_name)

        if 'error' in result:
            return jsonify({'success': False, 'error': result['error']}), 404

        return jsonify({
            'success': True,
            'data': result
        })
    except Exception as e:
        print(f"Error in /api/analyze: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/detect-fake', methods=['POST'])
def detect_fake_review():
    try:
        data = request.json
        review_text = data.get('review_text', '')

        if not review_text:
            return jsonify({'success': False, 'error': 'Review text required'}), 400

        # Detect if review is fake
        is_fake, confidence, features = fake_detector.predict_single(review_text)

        return jsonify({
            'success': True,
            'is_fake': bool(is_fake),
            'confidence': float(confidence),
            'features': features,
            'verdict': 'FAKE' if is_fake else 'GENUINE'
        })
    except Exception as e:
        print(f"Error in /api/detect-fake: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/stats')
def get_statistics():
    try:
        if analyzer.df is None:
            return jsonify({'success': False, 'error': 'No data loaded'}), 500

        df = analyzer.df

        
        total_reviews = int(len(df))
        total_products = int(df['product_name'].nunique()) if 'product_name' in df.columns else 0
        fake_reviews = int((df['is_fake'] == 1).sum()) if 'is_fake' in df.columns else 0
        genuine_reviews = int((df['is_fake'] == 0).sum()) if 'is_fake' in df.columns else 0
        fake_percentage = float(fake_reviews / total_reviews * 100) if total_reviews > 0 else 0
        avg_rating = float(df['rating'].mean()) if 'rating' in df.columns else 0.0

        stats = {
            'total_reviews': total_reviews,
            'total_products': total_products,
            'fake_reviews': fake_reviews,
            'genuine_reviews': genuine_reviews,
            'fake_percentage': round(fake_percentage, 1),
            'avg_rating': round(avg_rating, 1),
            'categories': df['category'].value_counts().to_dict() if 'category' in df.columns else {},
            'verified_purchases': int((df['verified_purchase'] == 1).sum()) if 'verified_purchase' in df.columns else 0
        }

        return jsonify({
            'success': True,
            'stats': stats
        })
    except Exception as e:
        print(f"❌ Error in /api/stats: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    print("=" * 70)
    print("Smart Product Review Analyzer with Fake Review Detection")
    print("=" * 70)
    print("Starting Flask application...")
    print("Access dashboard at: http://localhost:5000/dashboard")
    print("=" * 70)

    app.run(debug=True, host='0.0.0.0', port=5000)