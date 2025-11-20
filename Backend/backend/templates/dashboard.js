// Dashboard JavaScript for Smart Product Review Analyzer

let currentProduct = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard loaded');
    loadStatistics();
    loadProducts();
    setupEventListeners();
});

function setupEventListeners() {
    // Analyze Product Button
    const analyzeBtn = document.getElementById('analyze-btn');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', analyzeProduct);
    }

    // Detect Fake Review Button
    const detectBtn = document.getElementById('detect-fake-btn');
    if (detectBtn) {
        detectBtn.addEventListener('click', detectFakeReview);
    }
}

async function loadStatistics() {
    try {
        showLoading('stats-container');

        const response = await fetch('/api/stats');
        const data = await response.json();

        if (data.success) {
            updateStatisticsDisplay(data.stats);
        } else {
            showError('Failed to load statistics');
        }
    } catch (error) {
        console.error('Error loading statistics:', error);
        showError('Failed to load statistics');
    }
}

function updateStatisticsDisplay(stats) {
    // Update stat cards
    document.getElementById('total-reviews').textContent = stats.total_reviews.toLocaleString();
    document.getElementById('total-products').textContent = stats.total_products;
    document.getElementById('fake-reviews').textContent = stats.fake_reviews.toLocaleString();
    document.getElementById('fake-percentage').textContent = stats.fake_percentage.toFixed(1) + '%';
    document.getElementById('avg-rating').textContent = stats.avg_rating.toFixed(1);
}

async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        const data = await response.json();

        if (data.success) {
            populateProductDropdown(data.products);
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function populateProductDropdown(products) {
    const select = document.getElementById('product-select');
    if (!select) return;

    select.innerHTML = '<option value="">Select a product...</option>';

    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product;
        option.textContent = product;
        select.appendChild(option);
    });
}

async function analyzeProduct() {
    const productSelect = document.getElementById('product-select');
    const productName = productSelect.value;

    if (!productName) {
        showToast('Please select a product', 'warning');
        return;
    }

    try {
        showLoading('analysis-results');

        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ product_name: productName })
        });

        const data = await response.json();

        if (data.success) {
            displayAnalysisResults(data.data);
            currentProduct = productName;
        } else {
            showError(data.error || 'Analysis failed');
        }
    } catch (error) {
        console.error('Error analyzing product:', error);
        showError('Failed to analyze product');
    }
}

function displayAnalysisResults(data) {
    const resultsDiv = document.getElementById('analysis-results');

    const html = `
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0"><i class="fas fa-chart-bar me-2"></i>${data.product_name}</h5>
            </div>
            <div class="card-body">
                <!-- Fake Review Statistics -->
                <div class="row mb-4">
                    <div class="col-md-6">
                        <div class="alert alert-info">
                            <h6><i class="fas fa-shield-alt me-2"></i>Fake Review Detection</h6>
                            <p class="mb-1"><strong>Total Reviews:</strong> ${data.fake_stats.total_reviews}</p>
                            <p class="mb-1"><strong>Genuine Reviews:</strong> ${data.fake_stats.genuine_reviews}</p>
                            <p class="mb-1"><strong>Fake Reviews:</strong> ${data.fake_stats.fake_reviews}</p>
                            <p class="mb-0"><strong>Fake Percentage:</strong> <span class="badge ${data.fake_stats.fake_percentage > 30 ? 'bg-danger' : 'bg-success'}">${data.fake_stats.fake_percentage.toFixed(1)}%</span></p>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="alert alert-success">
                            <h6><i class="fas fa-star me-2"></i>Rating Information</h6>
                            <p class="mb-1"><strong>Average Rating:</strong> ${data.fake_stats.avg_rating.toFixed(1)}/5 ⭐</p>
                            <p class="mb-0"><strong>Genuine Avg Rating:</strong> ${data.fake_stats.genuine_avg_rating.toFixed(1)}/5 ⭐</p>
                        </div>
                    </div>
                </div>

                <!-- Summary -->
                <div class="mb-4">
                    <h6><i class="fas fa-file-alt me-2"></i>Summary</h6>
                    <div class="alert alert-light">
                        <p>${data.summary.summary_text}</p>
                        <p class="mb-0"><strong>Positive:</strong> ${data.summary.positive_percentage.toFixed(1)}% | 
                        <strong>Negative:</strong> ${data.summary.negative_percentage.toFixed(1)}%</p>
                    </div>
                </div>

                <!-- Pros and Cons -->
                <div class="row mb-4">
                    <div class="col-md-6">
                        <h6><i class="fas fa-thumbs-up me-2 text-success"></i>Pros</h6>
                        <ul class="pros-list">
                            ${data.summary.pros.map(pro => `<li>${pro}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="col-md-6">
                        <h6><i class="fas fa-thumbs-down me-2 text-danger"></i>Cons</h6>
                        <ul class="cons-list">
                            ${data.summary.cons.map(con => `<li>${con}</li>`).join('')}
                        </ul>
                    </div>
                </div>

                <!-- Sentiment Analysis -->
                <div class="mb-4">
                    <h6><i class="fas fa-smile me-2"></i>Sentiment Analysis</h6>
                    <div class="alert alert-light">
                        <p><strong>Overall Sentiment:</strong> 
                            <span class="badge ${data.sentiment.overall_sentiment === 'positive' ? 'bg-success' : data.sentiment.overall_sentiment === 'negative' ? 'bg-danger' : 'bg-secondary'}">
                                ${data.sentiment.overall_sentiment.toUpperCase()}
                            </span>
                        </p>
                        <p class="mb-0">
                            <strong>Positive:</strong> ${data.sentiment.positive_count} | 
                            <strong>Negative:</strong> ${data.sentiment.negative_count} | 
                            <strong>Neutral:</strong> ${data.sentiment.neutral_count}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;

    resultsDiv.innerHTML = html;
    resultsDiv.style.display = 'block';
}

async function detectFakeReview() {
    const textarea = document.getElementById('review-text');
    const reviewText = textarea.value.trim();

    if (!reviewText) {
        showToast('Please enter a review text', 'warning');
        return;
    }

    try {
        showLoading('fake-detection-result');

        const response = await fetch('/api/detect-fake', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ review_text: reviewText })
        });

        const data = await response.json();

        if (data.success) {
            displayFakeDetectionResult(data);
        } else {
            showError(data.error || 'Detection failed');
        }
    } catch (error) {
        console.error('Error detecting fake review:', error);
        showError('Failed to detect fake review');
    }
}

function displayFakeDetectionResult(data) {
    const resultDiv = document.getElementById('fake-detection-result');

    const verdictClass = data.is_fake ? 'danger' : 'success';
    const verdictIcon = data.is_fake ? 'fa-times-circle' : 'fa-check-circle';
    const confidencePercent = (data.confidence * 100).toFixed(1);

    const html = `
        <div class="result-box">
            <div class="alert alert-${verdictClass}">
                <h5><i class="fas ${verdictIcon} me-2"></i>Verdict: ${data.verdict}</h5>
                <p class="mb-0">This review appears to be <strong>${data.verdict}</strong> with ${confidencePercent}% confidence.</p>
            </div>

            <div class="mt-3">
                <h6>Confidence Level:</h6>
                <div class="confidence-bar">
                    <div class="confidence-fill bg-${verdictClass}" style="width: ${confidencePercent}%">
                        ${confidencePercent}%
                    </div>
                </div>
            </div>

            <div class="mt-3">
                <h6>Analysis Details:</h6>
                <table class="table table-sm">
                    <tr>
                        <td>Review Length:</td>
                        <td>${data.features.review_length} words</td>
                    </tr>
                    <tr>
                        <td>Exclamation Marks:</td>
                        <td>${data.features.exclamation_count}</td>
                    </tr>
                    <tr>
                        <td>Capital Letter Ratio:</td>
                        <td>${(data.features.capital_ratio * 100).toFixed(1)}%</td>
                    </tr>
                </table>
            </div>
        </div>
    `;

    resultDiv.innerHTML = html;
    resultDiv.style.display = 'block';
}

function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2 text-muted">Loading...</p>
            </div>
        `;
        element.style.display = 'block';
    }
}

function showError(message) {
    showToast(message, 'danger');
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} position-fixed`;
    toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px; animation: slideIn 0.3s;';
    toast.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-info-circle me-2"></i>
            <span>${message}</span>
            <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 5000);
}

// Export functions for global access
window.analyzeProduct = analyzeProduct;
window.detectFakeReview = detectFakeReview;