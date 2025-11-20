import pandas as pd
import numpy as np
from collections import Counter
import re

class SentimentAnalyzer:
    def __init__(self):
        self.positive_words = {
            'excellent', 'great', 'good', 'amazing', 'perfect', 'love', 'best',
            'fantastic', 'wonderful', 'awesome', 'satisfied', 'happy', 'recommend',
            'quality', 'worth', 'impressed', 'exceeded', 'superb', 'outstanding'
        }

        self.negative_words = {
            'bad', 'poor', 'terrible', 'worst', 'awful', 'disappointed', 'waste',
            'horrible', 'broken', 'defective', 'useless', 'fraud', 'scam', 'cheap',
            'misleading', 'damaged', 'low', 'hate', 'never', 'avoid'
        }

        self.aspects = {
            'quality': ['quality', 'build', 'material', 'construction', 'durability'],
            'price': ['price', 'value', 'cost', 'expensive', 'cheap', 'affordable'],
            'delivery': ['delivery', 'shipping', 'packaging', 'arrived', 'delivered'],
            'performance': ['works', 'performance', 'function', 'speed', 'efficiency'],
            'design': ['design', 'look', 'appearance', 'style', 'color'],
            'service': ['service', 'support', 'customer', 'response', 'seller']
        }

    def calculate_sentiment_score(self, text):
        """Calculate sentiment score from -1 (negative) to +1 (positive)"""

        words = re.findall(r'\b\w+\b', text.lower())

        positive_count = sum(1 for word in words if word in self.positive_words)
        negative_count = sum(1 for word in words if word in self.negative_words)

        total_words = len(words) if words else 1

        score = (positive_count - negative_count) / total_words

        return np.clip(score, -1, 1)

    def classify_sentiment(self, text):
        """Classify sentiment as positive, negative, or neutral"""

        score = self.calculate_sentiment_score(text)

        if score > 0.1:
            return 'positive'
        elif score < -0.1:
            return 'negative'
        else:
            return 'neutral'

    def aspect_based_sentiment(self, text):
        """Extract sentiment for different product aspects"""

        text_lower = text.lower()
        aspect_sentiments = {}

        for aspect, keywords in self.aspects.items():

            mentioned = any(keyword in text_lower for keyword in keywords)

            if mentioned:
                
                sentences = text.split('.')
                aspect_sentences = [s for s in sentences 
                                  if any(k in s.lower() for k in keywords)]

                if aspect_sentences:
                    aspect_text = ' '.join(aspect_sentences)
                    sentiment = self.classify_sentiment(aspect_text)
                    score = self.calculate_sentiment_score(aspect_text)

                    aspect_sentiments[aspect] = {
                        'sentiment': sentiment,
                        'score': float(score),
                        'mentioned': True
                    }

        return aspect_sentiments

    def analyze_reviews(self, reviews):


        if not reviews:
            return {
                'overall_sentiment': 'neutral',
                'positive_count': 0,
                'negative_count': 0,
                'neutral_count': 0,
                'avg_score': 0.0,
                'aspect_analysis': {}
            }

        sentiments = []
        scores = []
        all_aspect_sentiments = {}

        for review in reviews:
            sentiment = self.classify_sentiment(review)
            score = self.calculate_sentiment_score(review)

            sentiments.append(sentiment)
            scores.append(score)

            aspects = self.aspect_based_sentiment(review)
            for aspect, data in aspects.items():
                if aspect not in all_aspect_sentiments:
                    all_aspect_sentiments[aspect] = []
                all_aspect_sentiments[aspect].append(data['score'])

        sentiment_counts = Counter(sentiments)

        aspect_summary = {}
        for aspect, scores_list in all_aspect_sentiments.items():
            avg_score = np.mean(scores_list)
            if avg_score > 0.1:
                sentiment = 'positive'
            elif avg_score < -0.1:
                sentiment = 'negative'
            else:
                sentiment = 'neutral'

            aspect_summary[aspect] = {
                'sentiment': sentiment,
                'score': float(avg_score),
                'mention_count': len(scores_list)
            }

        avg_score = np.mean(scores)
        if avg_score > 0.1:
            overall = 'positive'
        elif avg_score < -0.1:
            overall = 'negative'
        else:
            overall = 'neutral'

        return {
            'overall_sentiment': overall,
            'positive_count': sentiment_counts.get('positive', 0),
            'negative_count': sentiment_counts.get('negative', 0),
            'neutral_count': sentiment_counts.get('neutral', 0),
            'avg_score': float(avg_score),
            'aspect_analysis': aspect_summary,
            'total_reviews': len(reviews)
        }

    def extract_pros_cons(self, reviews):
        """Extract key pros and cons from reviews"""

        pros = []
        cons = []

        for review in reviews:
            sentiment = self.classify_sentiment(review)

            sentences = review.split('.')

            for sentence in sentences:
                sentence = sentence.strip()
                if len(sentence) < 10:
                    continue

                sent_sentiment = self.classify_sentiment(sentence)

                if sent_sentiment == 'positive' and sentiment == 'positive':
                    pros.append(sentence)
                elif sent_sentiment == 'negative' and sentiment == 'negative':
                    cons.append(sentence)

        return {
            'pros': pros[:5] if pros else ['Generally positive feedback'],
            'cons': cons[:5] if cons else ['No major issues reported']
        }

if __name__ == "__main__":
    analyzer = SentimentAnalyzer()

    test_reviews = [
        "Great product! Really satisfied with the quality. Worth the money.",
        "Not as described. Quality is poor. Disappointed with purchase.",
        "Excellent purchase. Works perfectly as described. Fast delivery."
    ]

    results = analyzer.analyze_reviews(test_reviews)
    print("Sentiment Analysis Results:")
    print(results)

    pros_cons = analyzer.extract_pros_cons(test_reviews)
    print("\nPros & Cons:")
    print(pros_cons)