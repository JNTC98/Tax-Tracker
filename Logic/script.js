document.addEventListener('DOMContentLoaded', () => {
    bindNavigationButton('indexGetStarted', 'main.html');
    bindNavigationButton('indexTryCalculator', 'tax-calculator.html');
    bindNavigationButton('mainGetStartedTax101', 'tax-101.html');
    bindNavigationButton('mainTryCalculator', 'tax-calculator.html');
    bindNavigationButton('tax101Calculator', 'tax-calculator.html');
    bindNavigationButton('tax101BackServices', 'main.html');

    const exploreBtn = document.getElementById('mainExploreServices');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            const servicesSection = document.querySelector('.services-section');
            servicesSection?.scrollIntoView({ behavior: 'smooth' });
        });
    }

    const gstCheckbox = document.getElementById('gstRegistered');
    if (gstCheckbox) {
        gstCheckbox.addEventListener('change', toggleGstFields);
    }

    const calculateButton = document.getElementById('calculateButton');
    if (calculateButton) {
        calculateButton.addEventListener('click', calculateTax);
    }

    const downloadButton = document.getElementById('downloadResults');
    if (downloadButton) {
        downloadButton.addEventListener('click', downloadResults);
    }

    const resetButton = document.getElementById('resetCalculator');
    if (resetButton) {
        resetButton.addEventListener('click', resetCalculator);
    }
});

function bindNavigationButton(buttonId, url) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.addEventListener('click', () => {
            window.location.href = url;
        });
    }
}

function toggleGstFields() {
    const checked = this.checked;
    const gstGroup = document.getElementById('gstGroup');
    const salesGroup = document.getElementById('salesWithGstGroup');

    if (gstGroup) {
        gstGroup.style.display = checked ? 'block' : 'none';
    }
    if (salesGroup) {
        salesGroup.style.display = checked ? 'block' : 'none';
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-NZ', {
        style: 'currency',
        currency: 'NZD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

function calculateTax() {
    const revenue = parseFloat(document.getElementById('totalRevenue')?.value) || 0;
    const cogs = parseFloat(document.getElementById('costOfGoods')?.value) || 0;
    const salaries = parseFloat(document.getElementById('salaries')?.value) || 0;
    const rent = parseFloat(document.getElementById('rent')?.value) || 0;
    const utilities = parseFloat(document.getElementById('utilities')?.value) || 0;
    const supplies = parseFloat(document.getElementById('supplies')?.value) || 0;
    const professional = parseFloat(document.getElementById('professional')?.value) || 0;
    const marketing = parseFloat(document.getElementById('marketing')?.value) || 0;
    const vehicle = parseFloat(document.getElementById('vehicle')?.value) || 0;
    const other = parseFloat(document.getElementById('other')?.value) || 0;
    const taxRate = parseFloat(document.getElementById('taxRate')?.value) || 20;
    const gstRegistered = document.getElementById('gstRegistered')?.checked || false;
    const gstRate = parseFloat(document.getElementById('gstRate')?.value) || 15;
    const salesWithGst = parseFloat(document.getElementById('salesWithGst')?.value) || 0;

    const totalExpenses = cogs + salaries + rent + utilities + supplies + professional + marketing + vehicle + other;
    const taxableProfit = revenue - totalExpenses;
    const incomeTax = taxableProfit > 0 ? (taxableProfit * taxRate) / 100 : 0;

    let gstLiability = 0;
    if (gstRegistered && salesWithGst > 0) {
        gstLiability = (salesWithGst * gstRate) / 100;
    }

    const totalTax = incomeTax + gstLiability;

    const estimatedTaxEl = document.getElementById('estimatedTax');
    const displayRevenueEl = document.getElementById('displayRevenue');
    const displayExpensesEl = document.getElementById('displayExpenses');
    const displayProfitEl = document.getElementById('displayProfit');
    const displayIncomeTaxEl = document.getElementById('displayIncomeTax');
    const displayGstEl = document.getElementById('displayGst');
    const gstDisplayGroup = document.getElementById('gstDisplayGroup');

    if (estimatedTaxEl) {
        estimatedTaxEl.textContent = formatCurrency(totalTax);
    }
    if (displayRevenueEl) {
        displayRevenueEl.textContent = formatCurrency(revenue);
    }
    if (displayExpensesEl) {
        displayExpensesEl.textContent = formatCurrency(totalExpenses);
    }
    if (displayProfitEl) {
        displayProfitEl.textContent = formatCurrency(taxableProfit);
    }
    if (displayIncomeTaxEl) {
        displayIncomeTaxEl.textContent = formatCurrency(incomeTax);
    }
    if (displayGstEl) {
        displayGstEl.textContent = formatCurrency(gstLiability);
    }

    if (gstDisplayGroup) {
        gstDisplayGroup.style.display = gstRegistered ? 'block' : 'none';
    }

    const resultsSection = document.getElementById('resultsSection');
    if (resultsSection) {
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function downloadResults() {
    const displayRevenue = document.getElementById('displayRevenue')?.textContent || '';
    const displayExpenses = document.getElementById('displayExpenses')?.textContent || '';
    const displayProfit = document.getElementById('displayProfit')?.textContent || '';
    const displayIncomeTax = document.getElementById('displayIncomeTax')?.textContent || '';
    const estimatedTax = document.getElementById('estimatedTax')?.textContent || '';
    const gstDisplayGroup = document.getElementById('gstDisplayGroup');
    const displayGst = document.getElementById('displayGst')?.textContent || '';

    const gstLine = gstDisplayGroup?.style.display === 'block' ? `GST Liability: ${displayGst}\n` : '';

    const results = `Tax Calculation Summary
========================
Revenue: ${displayRevenue}
Expenses: ${displayExpenses}
Taxable Profit: ${displayProfit}

Income Tax: ${displayIncomeTax}
${gstLine}TOTAL TAX ESTIMATE: ${estimatedTax}

Generated on: ${new Date().toLocaleDateString()}

Note: This is an estimate for planning purposes only. Consult a tax professional for accurate calculations.
`;

    const blob = new Blob([results], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tax-calculation.txt';
    a.click();
    URL.revokeObjectURL(url);
}

function resetCalculator() {
    const form = document.getElementById('taxForm');
    if (form) {
        form.reset();
    }

    const resultsSection = document.getElementById('resultsSection');
    if (resultsSection) {
        resultsSection.style.display = 'none';
    }

    const gstGroup = document.getElementById('gstGroup');
    if (gstGroup) {
        gstGroup.style.display = 'none';
    }

    const salesGroup = document.getElementById('salesWithGstGroup');
    if (salesGroup) {
        salesGroup.style.display = 'none';
    }
}
