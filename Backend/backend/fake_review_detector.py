import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import re
import joblib
import os

class FakeReviewDetector:
    def __init__(self):
        self.model = None
        self.vectorizer = None
        self.scaler = None
        self.is_trained = False
        self.load_or_train_model()

    def extract_features(self, review_text):
        """Extract linguistic and behavioral features from review text"""

        features = {}

        features['review_length'] = len(review_text.split())
        features['char_count'] = len(review_text)

        features['exclamation_count'] = review_text.count('!')
        features['question_count'] = review_text.count('?')

        
        if len(review_text) > 0:
            features['capital_ratio'] = sum(1 for c in review_text if c.isupper()) / len(review_text)
        else:
            features['capital_ratio'] = 0

        
        words = review_text.lower().split()
        if len(words) > 0:
            word_counts = {}
            for word in words:
                word_counts[word] = word_counts.get(word, 0) + 1
            max_repetition = max(word_counts.values()) if word_counts else 1
            features['repetition_ratio'] = max_repetition / len(words)
        else:
            features['repetition_ratio'] = 0

        generic_words = ['best', 'perfect', 'amazing', 'great', 'excellent', 'worst', 'terrible', 'awful']
        features['generic_word_count'] = sum(1 for word in words if word in generic_words)

        features['all_caps_words'] = sum(1 for word in review_text.split() if word.isupper() and len(word) > 1)

        return features

    def prepare_training_data(self, df):

        X_text = df['review_text'].tolist()

        feature_dicts = [self.extract_features(text) for text in X_text]
        X_features = pd.DataFrame(feature_dicts)

        self.vectorizer = TfidfVectorizer(max_features=100, ngram_range=(1, 2))
        X_tfidf = self.vectorizer.fit_transform(X_text)
        X_tfidf_df = pd.DataFrame(X_tfidf.toarray(), 
                                   columns=[f'tfidf_{i}' for i in range(X_tfidf.shape[1])])

        X_combined = pd.concat([X_features.reset_index(drop=True), 
                               X_tfidf_df.reset_index(drop=True)], axis=1)

        self.scaler = StandardScaler()
        X_scaled = self.scaler.fit_transform(X_combined)

        y = df['is_fake'].values

        return X_scaled, y, X_combined.columns.tolist()

    def train_model(self, df):
        """Train the fake review detection model"""

        print("Training fake review detection model...")

        X, y, feature_names = self.prepare_training_data(df)

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )

        self.model = GradientBoostingClassifier(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=5,
            random_state=42
        )

        self.model.fit(X_train, y_train)

        y_pred = self.model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)

        print(f"✓ Model trained with accuracy: {accuracy:.4f}")
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred, target_names=['Genuine', 'Fake']))

        self.save_model()

        self.is_trained = True

        return accuracy

    def predict_single(self, review_text):

        if not self.is_trained:
            return False, 0.0, {}

        features_dict = self.extract_features(review_text)

        tfidf_features = self.vectorizer.transform([review_text]).toarray()
        tfidf_df = pd.DataFrame(tfidf_features, 
                                columns=[f'tfidf_{i}' for i in range(tfidf_features.shape[1])])

        X_features = pd.DataFrame([features_dict])
        X_combined = pd.concat([X_features.reset_index(drop=True), 
                               tfidf_df.reset_index(drop=True)], axis=1)

        
        X_scaled = self.scaler.transform(X_combined)

        
        prediction = self.model.predict(X_scaled)[0]
        probability = self.model.predict_proba(X_scaled)[0]
        confidence = probability[prediction]

        return prediction, confidence, features_dict

    def save_model(self):
        """Save trained model to disk"""
        os.makedirs('models', exist_ok=True)
        joblib.dump(self.model, 'models/fake_detector_model.pkl')
        joblib.dump(self.vectorizer, 'models/fake_detector_vectorizer.pkl')
        joblib.dump(self.scaler, 'models/fake_detector_scaler.pkl')
        print("✓ Model saved to models/")

    def load_model(self):
        """Load trained model from disk"""
        try:
            self.model = joblib.load('models/fake_detector_model.pkl')
            self.vectorizer = joblib.load('models/fake_detector_vectorizer.pkl')
            self.scaler = joblib.load('models/fake_detector_scaler.pkl')
            self.is_trained = True
            print("✓ Model loaded from models/")
            return True
        except:
            return False

    def load_or_train_model(self):
        """Load existing model or train new one"""
        if self.load_model():
            return

        # Train new model if dataset exists
        if os.path.exists('product_reviews_dataset.csv'):
            df = pd.read_csv('product_reviews_dataset.csv')
            self.train_model(df)
        else:
            print("⚠ No dataset found. Model will be trained when data is available.")

if __name__ == "__main__":
    detector = FakeReviewDetector()

    test_reviews = [
        "Great product! Really satisfied with the quality. Worth the money.",
        "Best product ever!!! Amazing!!! 5 stars!!!",
        "Excellent purchase. Works perfectly as described."
    ]

    for review in test_reviews:
        is_fake, confidence, features = detector.predict_single(review)
        print(f"\nReview: {review}")
        print(f"Prediction: {'FAKE' if is_fake else 'GENUINE'}")
        print(f"Confidence: {confidence:.2%}")
        print(f"Features: {features}")