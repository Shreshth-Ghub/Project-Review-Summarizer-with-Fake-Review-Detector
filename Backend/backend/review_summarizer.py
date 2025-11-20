import pandas as pd
import numpy as np
from collections import Counter
import re

class ReviewSummarizer:
    def __init__(self):
        pass

    def extract_key_phrases(self, reviews, max_phrases=10):

        all_text = ' '.join(reviews).lower()

        words = re.findall(r'\b\w+\b', all_text)

        bigrams = [' '.join(words[i:i+2]) for i in range(len(words)-1)]
        trigrams = [' '.join(words[i:i+3]) for i in range(len(words)-2)]


        phrase_counts = Counter(bigrams + trigrams)

        stopwords = {'is', 'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for'}
        filtered_phrases = {phrase: count for phrase, count in phrase_counts.items() 
                          if not any(word in stopwords for word in phrase.split())}

        top_phrases = sorted(filtered_phrases.items(), key=lambda x: x[1], reverse=True)[:max_phrases]

        return [phrase for phrase, count in top_phrases]

    def generate_summary(self, reviews, sentiment_results):

        if not reviews:
            return {
                'summary_text': 'No reviews available for this product.',
                'key_points': [],
                'pros': [],
                'cons': [],
                'overall_rating': 0
            }

        overall_sentiment = sentiment_results.get('overall_sentiment', 'neutral')
        avg_score = sentiment_results.get('avg_score', 0)
        positive_count = sentiment_results.get('positive_count', 0)
        negative_count = sentiment_results.get('negative_count', 0)
        total_reviews = sentiment_results.get('total_reviews', len(reviews))

        summary_parts = []

        if overall_sentiment == 'positive':
            summary_parts.append(f"Based on {total_reviews} genuine reviews, this product has received overwhelmingly positive feedback.")
        elif overall_sentiment == 'negative':
            summary_parts.append(f"Based on {total_reviews} genuine reviews, this product has received mostly negative feedback.")
        else:
            summary_parts.append(f"Based on {total_reviews} genuine reviews, customer opinions about this product are mixed.")

        if positive_count > 0 and negative_count > 0:
            pos_percent = (positive_count / total_reviews * 100)
            neg_percent = (negative_count / total_reviews * 100)
            summary_parts.append(f"{pos_percent:.0f}% of customers were satisfied, while {neg_percent:.0f}% reported issues.")

        summary_text = ' '.join(summary_parts)

        positive_reviews = [r for r in reviews if self._is_positive(r)]
        negative_reviews = [r for r in reviews if self._is_negative(r)]

        pros = self._extract_highlights(positive_reviews, sentiment='positive')
        cons = self._extract_highlights(negative_reviews, sentiment='negative')

        key_points = []
        aspect_analysis = sentiment_results.get('aspect_analysis', {})
        for aspect, data in aspect_analysis.items():
            sentiment = data.get('sentiment', 'neutral')
            if data.get('mention_count', 0) > 2:  # Only include frequently mentioned aspects
                if sentiment == 'positive':
                    key_points.append(f"Customers praised the {aspect}")
                elif sentiment == 'negative':
                    key_points.append(f"Customers had concerns about the {aspect}")

        return {
            'summary_text': summary_text,
            'key_points': key_points[:5],
            'pros': pros[:5],
            'cons': cons[:5],
            'overall_rating': self._calculate_overall_rating(avg_score),
            'review_count': total_reviews,
            'positive_percentage': (positive_count / total_reviews * 100) if total_reviews > 0 else 0,
            'negative_percentage': (negative_count / total_reviews * 100) if total_reviews > 0 else 0
        }

    def _is_positive(self, review):
        """Quick check if review is positive"""
        positive_words = {'great', 'excellent', 'good', 'love', 'best', 'perfect', 'amazing'}
        words = set(review.lower().split())
        return len(words & positive_words) > 0

    def _is_negative(self, review):
        """Quick check if review is negative"""
        negative_words = {'bad', 'poor', 'terrible', 'worst', 'awful', 'disappointed'}
        words = set(review.lower().split())
        return len(words & negative_words) > 0

    def _extract_highlights(self, reviews, sentiment='positive'):
        """Extract key highlights from reviews"""

        if not reviews:
            return []

        highlights = []

        for review in reviews[:10]:  # Analyze top 10 reviews
            sentences = [s.strip() for s in review.split('.') if len(s.strip()) > 15]

            for sentence in sentences:
                # Clean and add
                if sentence and len(sentence) > 20 and len(sentence) < 150:
                    highlights.append(sentence)

        unique_highlights = list(set(highlights))
        return unique_highlights[:5]

    def _calculate_overall_rating(self, avg_score):

        rating = 3 + (avg_score * 2)
        return round(np.clip(rating, 1, 5), 1)

if __name__ == "__main__":

    summarizer = ReviewSummarizer()

    test_reviews = [
        "Great product! Really satisfied with the quality. Worth the money.",
        "Excellent purchase. Works perfectly as described. Fast delivery.",
        "Very good quality. Exceeded my expectations. Will buy again."
    ]

    from sentiment_analyzer import SentimentAnalyzer
    analyzer = SentimentAnalyzer()
    sentiment_results = analyzer.analyze_reviews(test_reviews)

    summary = summarizer.generate_summary(test_reviews, sentiment_results)
    print("Review Summary:")
    for key, value in summary.items():
        print(f"{key}: {value}")