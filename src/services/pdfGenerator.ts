import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface AnalysisData {
    feasibilityColor: string;
    feasibilityTitle: string;
    feasibilityExplanation: string;
    executiveSummary: string;
    projectedOutcome: string;
    investmentStrategy: Array<{
        title: string;
        allocationPercentage?: number;
        description: string;
        assets: string[];
    }>;
    riskAssessment: string;
    nextSteps: string[];
    formData?: any;
}

export const generatePDF = async (analysisData: AnalysisData, elementId: string = 'report-content'): Promise<void> => {
    try {
        // Method 1: Capture the actual report content (best quality)
        const element = document.getElementById(elementId);
        if (element) {
            // Hide any interactive elements before capture
            const buttons = element.querySelectorAll('button, a');
            buttons.forEach(btn => {
                (btn as HTMLElement).style.display = 'none';
            });

            const canvas = await html2canvas(element, {
                scale: 2, // Higher quality
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                windowWidth: 1200, // Wider capture
            });

            const imgData = canvas.toDataURL('image/png', 1.0);
            const pdf = new jsPDF('p', 'mm', 'a4');

            const pageWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const margin = 10; // Reduced margin for more content
            const imgWidth = pageWidth - (2 * margin); // Full width with margins
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let position = margin;
            let heightLeft = imgHeight;

            // Add first page
            pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
            heightLeft -= (pageHeight - (2 * margin));

            // Add additional pages if content is long
            while (heightLeft > 0) {
                position = -heightLeft + margin;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            // Restore buttons
            buttons.forEach(btn => {
                (btn as HTMLElement).style.display = '';
            });

            pdf.save(`financial-report-${new Date().toISOString().split('T')[0]}.pdf`);
            return;
        }

        // Method 2: Generate beautiful PDF from scratch
        generateBeautifulPDF(analysisData);

    } catch (error) {
        console.error('PDF generation failed:', error);
        // Fallback to simple but clean PDF
        generateCleanPDF(analysisData);
    }
};

const generateBeautifulPDF = (data: AnalysisData) => {
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Colors based on feasibility
    const colorMap: Record<string, [number, number, number]> = {
        'GREEN': [16, 185, 129], // #10B981
        'YELLOW': [245, 158, 11], // #F59E0B
        'RED': [239, 68, 68], // #EF4444
    };

    const [r, g, b] = colorMap[data.feasibilityColor] || [59, 130, 246]; // Default blue

    const pageWidth = 210;
    const margin = 15;
    const contentWidth = pageWidth - (2 * margin);
    let yPos = margin;

    // ========== HEADER ==========
    pdf.setFillColor(r, g, b);
    pdf.rect(0, 0, pageWidth, 40, 'F');

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(28);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Financial Analysis Report', pageWidth / 2, 25, { align: 'center' });

    pdf.setFontSize(11);
    pdf.text(`Generated: ${new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })}`, pageWidth / 2, 35, { align: 'center' });

    yPos = 50;

    // ========== FEASIBILITY BADGE ==========
    pdf.setFillColor(r, g, b, 20); // Light background
    pdf.roundedRect(margin, yPos, contentWidth, 20, 3, 3, 'F');

    pdf.setTextColor(r, g, b);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text(data.feasibilityTitle, margin + 10, yPos + 12);

    pdf.setTextColor(100, 100, 100);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const feasibilityLines = pdf.splitTextToSize(data.feasibilityExplanation, contentWidth - 20);
    pdf.text(feasibilityLines, margin + 10, yPos + 25);

    yPos += 20 + (feasibilityLines.length * 4) + 10;

    // ========== EXECUTIVE SUMMARY ==========
    yPos = addSection(pdf, '📋 Executive Summary', data.executiveSummary, margin, yPos, contentWidth, r, g, b) + 8;

    // Page break check
    if (yPos > 250) {
        pdf.addPage();
        yPos = margin;
    }

    // ========== FINANCIAL PROJECTION ==========
    yPos = addSection(pdf, '💰 Financial Projection', data.projectedOutcome, margin, yPos, contentWidth, r, g, b) + 8;

    // ========== INVESTMENT STRATEGY ==========
    pdf.setFontSize(16);
    pdf.setTextColor(r, g, b);
    pdf.setFont('helvetica', 'bold');
    pdf.text('📊 Investment Strategy', margin, yPos);
    yPos += 10;

    data.investmentStrategy.forEach((strategy, index) => {
        if (yPos > 250) {
            pdf.addPage();
            yPos = margin;
        }

        // Strategy card
        pdf.setDrawColor(229, 231, 235);
        pdf.setFillColor(249, 250, 251);
        pdf.roundedRect(margin, yPos, contentWidth, 45, 3, 3, 'FD');

        // Title and percentage
        pdf.setFontSize(12);
        pdf.setTextColor(31, 41, 55);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${strategy.title}`, margin + 10, yPos + 8);

        if (strategy.allocationPercentage) {
            pdf.setTextColor(r, g, b);
            pdf.text(`${strategy.allocationPercentage}%`, pageWidth - margin - 20, yPos + 8, { align: 'right' });
        }

        // Description
        pdf.setFontSize(9);
        pdf.setTextColor(75, 85, 99);
        pdf.setFont('helvetica', 'normal');
        const descLines = pdf.splitTextToSize(strategy.description, contentWidth - 20);
        pdf.text(descLines, margin + 10, yPos + 16);

        // Assets
        if (strategy.assets && strategy.assets.length > 0) {
            pdf.setFontSize(8);
            pdf.setTextColor(79, 70, 229);
            const assetsText = strategy.assets.slice(0, 3).join(' • ');
            pdf.text(assetsText, margin + 10, yPos + 38);
        }

        yPos += 50;
    });

    // Page break check
    if (yPos > 220) {
        pdf.addPage();
        yPos = margin;
    }

    // ========== RISK ASSESSMENT ==========
    yPos = addSection(pdf, '⚠️ Risk Assessment', data.riskAssessment, margin, yPos, contentWidth, r, g, b) + 8;

    // ========== ACTION PLAN ==========
    pdf.setFontSize(16);
    pdf.setTextColor(r, g, b);
    pdf.setFont('helvetica', 'bold');
    pdf.text('✅ Action Plan', margin, yPos);
    yPos += 10;

    data.nextSteps.forEach((step, index) => {
        if (yPos > 270) {
            pdf.addPage();
            yPos = margin;
        }

        pdf.setFontSize(10);
        pdf.setTextColor(31, 41, 55);

        // Checkmark and step
        pdf.text('✓', margin + 5, yPos + 5);
        const stepLines = pdf.splitTextToSize(` ${step}`, contentWidth - 15);
        pdf.text(stepLines, margin + 10, yPos + 5);

        yPos += (stepLines.length * 5) + 8;
    });

    // ========== FOOTER ==========
    pdf.setFontSize(8);
    pdf.setTextColor(156, 163, 175);
    pdf.setFont('helvetica', 'italic');
    pdf.text('Generated by Financial Advisor AI • For educational purposes only • Consult a certified financial advisor for professional advice',
        pageWidth / 2, 290, { align: 'center' });

    pdf.text(`Report ID: ${Date.now().toString(36).toUpperCase()}`, pageWidth / 2, 295, { align: 'center' });

    // Save the PDF
    pdf.save(`financial-report-${new Date().toISOString().split('T')[0]}-${data.feasibilityColor.toLowerCase()}.pdf`);
};

const addSection = (pdf: jsPDF, title: string, content: string, x: number, y: number, maxWidth: number, r: number, g: number, b: number) => {
    pdf.setFontSize(16);
    pdf.setTextColor(r, g, b);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, x, y);
    y += 7;

    pdf.setFontSize(10);
    pdf.setTextColor(75, 85, 99);
    pdf.setFont('helvetica', 'normal');
    const lines = pdf.splitTextToSize(content, maxWidth);
    pdf.text(lines, x, y);

    return y + (lines.length * 4) + 10;
};

const generateCleanPDF = (data: AnalysisData) => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const margin = 20;
    const contentWidth = 210 - (2 * margin);
    let yPos = 20;

    // Title
    pdf.setFontSize(24);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Financial Analysis Report', margin, yPos);
    yPos += 15;

    // Date
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPos);
    yPos += 15;

    // Divider
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPos, 210 - margin, yPos);
    yPos += 15;

    // Feasibility
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Status: ${data.feasibilityTitle}`, margin, yPos);
    yPos += 10;

    pdf.setFontSize(11);
    pdf.setTextColor(80, 80, 80);
    const feasibilityLines = pdf.splitTextToSize(data.feasibilityExplanation, contentWidth);
    pdf.text(feasibilityLines, margin, yPos);
    yPos += (feasibilityLines.length * 6) + 15;

    // Executive Summary
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Executive Summary', margin, yPos);
    yPos += 10;

    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);
    const summaryLines = pdf.splitTextToSize(data.executiveSummary, contentWidth);
    pdf.text(summaryLines, margin, yPos);
    yPos += (summaryLines.length * 5) + 15;

    // Page break check
    if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
    }

    // Investment Strategy
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Investment Strategy', margin, yPos);
    yPos += 10;

    data.investmentStrategy.forEach((strategy, index) => {
        if (yPos > 250) {
            pdf.addPage();
            yPos = 20;
        }

        pdf.setFontSize(11);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`${strategy.title} (${strategy.allocationPercentage || 0}%)`, margin + 5, yPos);
        yPos += 6;

        pdf.setFontSize(9);
        pdf.setTextColor(80, 80, 80);
        const descLines = pdf.splitTextToSize(strategy.description, contentWidth - 10);
        pdf.text(descLines, margin + 10, yPos);
        yPos += (descLines.length * 4) + 8;
    });

    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text('Generated by Financial Advisor AI • For educational purposes only', margin, 290);

    pdf.save(`financial-report-simple-${Date.now()}.pdf`);
};

// Add this function to ensure the report content is visible for capture
export const prepareForPDFCapture = () => {
    const element = document.getElementById('report-content');
    if (element) {
        // Ensure content is visible and properly sized
        element.style.width = '800px';
        element.style.maxWidth = '800px';
        element.style.margin = '0 auto';
        element.style.padding = '20px';
        element.style.backgroundColor = 'white';
    }
};

// Call this before generating PDF
export const restoreAfterPDFCapture = () => {
    const element = document.getElementById('report-content');
    if (element) {
        element.style.width = '';
        element.style.maxWidth = '';
        element.style.margin = '';
        element.style.padding = '';
        element.style.backgroundColor = '';
    }
};