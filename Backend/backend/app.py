from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Global variables for data
df = None
products_list = []

# Load dataset
try:
    dataset_path = 'product_reviews_dataset.csv'
    if os.path.exists(dataset_path):
        df = pd.read_csv(dataset_path)
        products_list = df['product_name'].unique().tolist() if 'product_name' in df.columns else []
        print(f"✓ Dataset loaded: {len(df)} reviews, {len(products_list)} products")
    else:
        print("⚠ Dataset not found. Creating sample data...")
        # Create sample data
        df = pd.DataFrame({
            'product_name': ['Electronics - Smartphone', 'Electronics - Laptop', 'Clothing - T-Shirt'] * 100,
            'rating': np.random.randint(1, 6, 300),
            'review_text': ['Sample review'] * 300,
            'is_fake': np.random.choice([0, 1], 300, p=[0.7, 0.3]),
            'sentiment': ['positive'] * 200 + ['negative'] * 100
        })
        products_list = df['product_name'].unique().tolist()
        print("✓ Sample data created")
except Exception as e:
    print(f"Error loading data: {e}")
    df = pd.DataFrame()
    products_list = []

@app.route('/')
def home():
    return jsonify({"message": "Backend API is running", "status": "ok"})

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/api/stats')
def get_stats():
    try:
        if df is None or df.empty:
            return jsonify({
                "success": True,
                "stats": {
                    "total_reviews": 0,
                    "total_products": 0,
                    "fake_reviews": 0,
                    "genuine_reviews": 0,
                    "fake_percentage": 0,
                    "avg_rating": 0
                }
            })
        
        total_reviews = len(df)
        fake_reviews = int(df['is_fake'].sum()) if 'is_fake' in df.columns else 0
        genuine_reviews = total_reviews - fake_reviews
        fake_percentage = round((fake_reviews / total_reviews * 100), 2) if total_reviews > 0 else 0
        avg_rating = round(df['rating'].mean(), 2) if 'rating' in df.columns else 0
        
        stats = {
            "total_reviews": total_reviews,
            "total_products": len(products_list),
            "fake_reviews": fake_reviews,
            "genuine_reviews": genuine_reviews,
            "fake_percentage": fake_percentage,
            "avg_rating": float(avg_rating)
        }
        
        return jsonify({"success": True, "stats": stats})
    except Exception as e:
        print(f"Error in get_stats: {e}")
        return jsonify({"success": False, "error": str(e)})

@app.route('/api/products')
def get_products():
    try:
        return jsonify({
            "success": True,
            "products": products_list,
            "count": len(products_list)
        })
    except Exception as e:
        print(f"Error in get_products: {e}")
        return jsonify({"success": False, "error": str(e)})

@app.route('/api/analyze', methods=['POST'])
def analyze_product():
    try:
        data = request.get_json()
        product_name = data.get('product_name')
        
        if not product_name or df is None or df.empty:
            return jsonify({"success": False, "error": "Invalid product or no data"})
        
        product_reviews = df[df['product_name'] == product_name]
        
        if product_reviews.empty:
            return jsonify({"success": False, "error": "No reviews found for this product"})
        
        fake_count = int(product_reviews['is_fake'].sum())
        genuine_count = len(product_reviews) - fake_count
        
        response = {
            "success": True,
            "data": {
                "product_name": product_name,
                "summary": {
                    "total_reviews": len(product_reviews),
                    "avg_rating": float(product_reviews['rating'].mean()),
                    "pros": ["Good quality", "Fast shipping"],
                    "cons": ["Price could be better"]
                },
                "sentiment": {
                    "positive_count": int((product_reviews['sentiment'] == 'positive').sum()) if 'sentiment' in product_reviews.columns else 0,
                    "negative_count": int((product_reviews['sentiment'] == 'negative').sum()) if 'sentiment' in product_reviews.columns else 0
                },
                "fake_stats": {
                    "total_reviews": len(product_reviews),
                    "genuine_reviews": genuine_count,
                    "fake_reviews": fake_count,
                    "fake_percentage": round((fake_count / len(product_reviews) * 100), 2)
                }
            }
        }
        
        return jsonify(response)
    except Exception as e:
        print(f"Error in analyze_product: {e}")
        return jsonify({"success": False, "error": str(e)})

@app.route('/api/detect-fake', methods=['POST'])
def detect_fake():
    try:
        data = request.get_json()
        review_text = data.get('review_text', '')
        
        # Simple fake detection logic
        exclamation_count = review_text.count('!')
        capital_ratio = sum(1 for c in review_text if c.isupper()) / max(len(review_text), 1)
        
        is_fake = exclamation_count > 3 or capital_ratio > 0.5
        confidence = 0.85 if is_fake else 0.92
        
        return jsonify({
            "success": True,
            "is_fake": is_fake,
            "confidence": confidence,
            "verdict": "FAKE" if is_fake else "GENUINE"
        })
    except Exception as e:
        print(f"Error in detect_fake: {e}")
        return jsonify({"success": False, "error": str(e)})

if __name__ == '__main__':
    print("="*70)
    print("Smart Product Review Analyzer with Fake Review Detection")
    print("="*70)
    print("Starting Flask application...")
    print("Access dashboard at: http://localhost:5000/dashboard")
    print("="*70)
    app.run(debug=True, host='0.0.0.0', port=5000)
