from langchain_core.tools import tool

@tool
def calculate_micro_loan(daily_sales: float, monthly_expenses: float) -> str:
    """Calculates safe loan capacity for informal rural businesses based on daily cash flow."""
    monthly_revenue = daily_sales * 26  # assuming 26 working days
    net_profit = monthly_revenue - monthly_expenses
    
    if net_profit <= 0:
        return "Warning: Monthly net profit is zero or negative. Focus on expense optimization before borrowing."
        
    safe_monthly_repayment = net_profit * 0.35  # Keep debt under 35% net profit
    recommended_max_loan = safe_monthly_repayment * 12  # 1-year loan
    
    return (
        f"Estimated Monthly Revenue: ${monthly_revenue:.2f}. "
        f"Net Monthly Profit: ${net_profit:.2f}. "
        f"Recommended maximum monthly loan repayment: ${safe_monthly_repayment:.2f}. "
        f"Estimated safe 12-month loan capacity: ${recommended_max_loan:.2f}."
    )

@tool
def search_rural_subsidies(business_type: str, region: str) -> str:
    """Finds regional government schemes, grants, and credit facilities for micro-enterprises."""
    subsidies_db = {
        "agriculture": "Agricultural Modernization Grant: Up to 35% capital subsidy for irrigation and small tools.",
        "retail": "Micro-Retail Credit Facility: 4% interest rate subvention on working capital loans.",
        "handicrafts": "Artisan Empowerment Scheme: Direct grant up to $1,000 for raw material procurement."
    }
    return subsidies_db.get(
        business_type.lower(), 
        "General Rural Credit Scheme: Collateral-free micro-loans up to $3,000 with flexible repayment terms."
    )
