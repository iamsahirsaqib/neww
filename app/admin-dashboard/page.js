const fetchAnalytics = async () => {
  try {
    const response = await fetch(`${API_URL}/get_analytics.php`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    if (!text) return; // Safety check

    const data = JSON.parse(text);

    if (data.success) {
      setSummaryMetrics({
        products: data.summary.total_products || 0,
        orders: data.summary.total_orders || 0,
        revenue: data.summary.total_revenue || 0,
        reach: data.summary.store_reach || 0
      });

      if (data.chart_data && data.chart_data.length > 0) {
        // Calculate conversion rate for each data point
        const chartDataWithConversion = data.chart_data.map(item => ({
          ...item,
          // Conversion rate = (orders ÷ visits) × 100
          conversion: item.visits > 0 ? ((item.orders / item.visits) * 100).toFixed(2) : 0
        }));
        setAnalyticsData(chartDataWithConversion);
      }
    }
  } catch (error) {
    console.error("Error fetching analytics:", error);
  }
};

  // Fetch when page loads
  useEffect(() => {
    if (activePage === 'analytics' || activePage === 'home') {
      fetchAnalytics();
    }
  }, [activePage]);
