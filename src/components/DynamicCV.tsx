import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';

// Dynamic imports for better error handling
const loadJsPDF = async () => {
  const { default: jsPDF } = await import('jspdf');
  return jsPDF;
};

const loadHtml2Canvas = async () => {
  const { default: html2canvas } = await import('html2canvas');
  return html2canvas;
};

const DynamicCV: React.FC = () => {
  const { t, i18n } = useTranslation();
  const cvRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    if (!cvRef.current) {
      console.error('CV ref bulunamadı');
      return;
    }

    try {
      console.log('PDF oluşturma başlıyor...');
      
      // Dynamic imports
      const [jsPDF, html2canvas] = await Promise.all([
        loadJsPDF(),
        loadHtml2Canvas()
      ]);

      console.log('Kütüphaneler yüklendi');

      // Alternatif: Basit PDF oluşturma (OKLCH olmadan)
      const generateSimplePDF = () => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        // Başlık
        pdf.setFontSize(24);
        pdf.setTextColor(37, 99, 235); // Blue
        pdf.text('Tolga Çavga', 20, 30);
        
        pdf.setFontSize(16);
        pdf.setTextColor(55, 65, 81); // Gray
        pdf.text('Frontend Developer', 20, 40);
        
        // İletişim
        pdf.setFontSize(10);
        pdf.text('📧 cavgaa228@gmail.com', 20, 50);
        pdf.text('🌐 www.tolgacavga.com', 20, 55);
        pdf.text('📍 İzmir, Türkiye', 20, 60);
        pdf.text('🔗 GitHub: github.com/Cavga1903', 20, 65);
        pdf.text('💼 LinkedIn: linkedin.com/in/tolgaacavgaa', 20, 70);
        
        // Profesyonel Özet
        pdf.setFontSize(14);
        pdf.setTextColor(37, 99, 235);
        pdf.text('Profesyonel Özet', 20, 85);
        
        pdf.setFontSize(10);
        pdf.setTextColor(55, 65, 81);
        const summary = t('cv.summaryText');
        const splitSummary = pdf.splitTextToSize(summary, 170);
        pdf.text(splitSummary, 20, 95);
        
        // Teknik Yetenekler
        pdf.setFontSize(14);
        pdf.setTextColor(37, 99, 235);
        pdf.text('Teknik Yetenekler', 20, 120);
        
        pdf.setFontSize(10);
        pdf.setTextColor(55, 65, 81);
        pdf.text('Frontend: React, TypeScript, JavaScript, HTML5, CSS3, TailwindCSS', 20, 130);
        pdf.text('Tools: Git, npm, Vite, Framer Motion, React Router', 20, 135);
        
        // İş Deneyimi
        pdf.setFontSize(14);
        pdf.setTextColor(37, 99, 235);
        pdf.text('İş Deneyimi', 20, 150);
        
        pdf.setFontSize(10);
        pdf.setTextColor(31, 41, 55);
        pdf.text('Müşteri Hizmetleri Temsilcisi', 20, 160);
        pdf.setTextColor(37, 99, 235);
        pdf.text('Turkcell Global Bilgi', 20, 165);
        pdf.setTextColor(107, 114, 128);
        pdf.text('Ağustos 2025 - Devam Ediyor', 150, 165);
        
        pdf.setTextColor(55, 65, 81);
        const turkcellDesc = t('cv.turkcellDescription');
        const splitTurkcell = pdf.splitTextToSize(turkcellDesc, 170);
        pdf.text(splitTurkcell, 20, 175);
        
        // Eğitim
        pdf.setFontSize(14);
        pdf.setTextColor(37, 99, 235);
        pdf.text('Eğitim', 20, 200);
        
        pdf.setFontSize(10);
        pdf.setTextColor(31, 41, 55);
        pdf.text('Computer Science', 20, 210);
        pdf.setTextColor(37, 99, 235);
        pdf.text('University of the People', 20, 215);
        pdf.setTextColor(107, 114, 128);
        pdf.text('2022 - 2026', 150, 215);
        
        pdf.setTextColor(31, 41, 55);
        pdf.text('Computer Programming', 20, 225);
        pdf.setTextColor(37, 99, 235);
        pdf.text('Anadolu Üniversitesi', 20, 230);
        pdf.setTextColor(107, 114, 128);
        pdf.text('2021 - 2023', 150, 230);
        
        // Sertifikalar
        pdf.setFontSize(14);
        pdf.setTextColor(37, 99, 235);
        pdf.text('Sertifikalar', 20, 250);
        
        pdf.setFontSize(10);
        pdf.setTextColor(55, 65, 81);
        pdf.text('• React Native Bootcamp - Siliconmade Academy (2024)', 20, 260);
        pdf.text('• Frontend Development Certificate - Online Platform', 20, 265);
        pdf.text('• JavaScript Fundamentals - Codecademy', 20, 270);
        
        return pdf;
      };

      // Önce basit PDF'i dene
      try {
        const pdf = generateSimplePDF();
        pdf.save(`Tolga_Cavga_CV_${i18n.language}.pdf`);
        console.log('Basit PDF başarıyla oluşturuldu');
        return;
      } catch (simpleError) {
        console.log('Basit PDF başarısız, html2canvas deneniyor...', simpleError);
      }

      // HTML'i canvas'a çevir
      const canvas = await html2canvas(cvRef.current, {
        scale: 2, // Yüksek kalite için
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794, // A4 genişliği (pixel)
        height: 1123, // A4 yüksekliği (pixel)
        onclone: (clonedDoc) => {
          // Tüm OKLCH renklerini temizle
          const elements = clonedDoc.querySelectorAll('*');
          elements.forEach((element: any) => {
            const computedStyle = window.getComputedStyle(element);
            const elementStyle = element.style;
            
            // Tüm CSS özelliklerini kontrol et
            const allProperties = [
              'color', 'backgroundColor', 'borderColor', 'borderTopColor', 
              'borderRightColor', 'borderBottomColor', 'borderLeftColor',
              'outlineColor', 'textDecorationColor', 'textShadow',
              'boxShadow', 'filter', 'backdropFilter'
            ];
            
            allProperties.forEach(prop => {
              const value = computedStyle.getPropertyValue(prop);
              if (value && value.includes('oklch')) {
                elementStyle.setProperty(prop, '');
              }
            });
            
            // Inline style'ları da kontrol et
            if (elementStyle.cssText) {
              elementStyle.cssText = elementStyle.cssText.replace(/oklch\([^)]+\)/g, '#000000').replace(/#0000/g, '#000000');
            }
          });
          
          // CSS stillerini de temizle
          const styleSheets = clonedDoc.styleSheets;
          for (let i = 0; i < styleSheets.length; i++) {
            try {
              const rules = styleSheets[i].cssRules;
              for (let j = 0; j < rules.length; j++) {
                const rule = rules[j] as CSSStyleRule;
                if (rule.style && rule.style.cssText) {
                  rule.style.cssText = rule.style.cssText.replace(/oklch\([^)]+\)/g, '#000000').replace(/#0000/g, '#000000');
                }
              }
            } catch (e) {
              // Cross-origin stylesheet hatası olabilir, devam et
            }
          }
        }
      });

      console.log('Canvas oluşturuldu');

      // Canvas'ı PDF'e çevir
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // PDF boyutları (mm)
      const pdfWidth = 210;
      const pdfHeight = 297;
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      // Sayfa sığmazsa yeni sayfa ekle
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      // PDF'i indir
      pdf.save(`Tolga_Cavga_CV_${i18n.language}.pdf`);
      console.log('PDF başarıyla oluşturuldu ve indirildi');
    } catch (error) {
      console.error('PDF oluşturma hatası:', error);
      alert('PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="p-6">
      {/* CV Preview */}
      <div 
        ref={cvRef}
        className="bg-white text-black p-8 max-w-4xl mx-auto shadow-lg"
        style={{ width: '794px', minHeight: '1123px' }}
      >
        {/* Header */}
        <div className="text-center mb-8 border-b-2 border-blue-500 pb-6">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#2563eb' }}>Tolga Çavga</h1>
          <h2 className="text-2xl mb-4" style={{ color: '#374151' }}>Frontend Developer</h2>
          <div className="flex justify-center gap-6 text-sm">
            <span>📧 cavgaa228@gmail.com</span>
            <span>🌐 www.tolgacavga.com</span>
            <span>📍 İzmir, Türkiye</span>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            <span>🔗 GitHub: github.com/Cavga1903</span>
            <span>💼 LinkedIn: linkedin.com/in/tolgaacavgaa</span>
          </div>
        </div>

        {/* Professional Summary */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-3 border-l-4 border-blue-500 pl-3" style={{ color: '#2563eb' }}>
            {t('cv.professionalSummary')}
          </h3>
          <p className="leading-relaxed" style={{ color: '#374151' }}>
            {t('cv.summaryText')}
          </p>
        </div>

        {/* Technical Skills */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-3 border-l-4 border-blue-500 pl-3" style={{ color: '#2563eb' }}>
            {t('cv.technicalSkills')}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2" style={{ color: '#1f2937' }}>Frontend Technologies:</h4>
              <p style={{ color: '#374151' }}>React, TypeScript, JavaScript, HTML5, CSS3, TailwindCSS</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2" style={{ color: '#1f2937' }}>Tools & Libraries:</h4>
              <p style={{ color: '#374151' }}>Git, npm, Vite, Framer Motion, React Router</p>
            </div>
          </div>
        </div>

        {/* Work Experience */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-3 border-l-4 border-blue-500 pl-3" style={{ color: '#2563eb' }}>
            {t('cv.workExperience')}
          </h3>
          
          <div className="mb-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold" style={{ color: '#1f2937' }}>Müşteri Hizmetleri Temsilcisi</h4>
              <span className="text-sm" style={{ color: '#6b7280' }}>Ağustos 2025 - Devam Ediyor</span>
            </div>
            <p className="font-medium" style={{ color: '#2563eb' }}>Turkcell Global Bilgi</p>
            <p className="text-sm mt-1" style={{ color: '#374151' }}>
              {t('cv.turkcellDescription')}
            </p>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold" style={{ color: '#1f2937' }}>React Native Developer | Freelance Frontend Developer</h4>
              <span className="text-sm" style={{ color: '#6b7280' }}>Temmuz 2025 - Devam Ediyor</span>
            </div>
            <p className="font-medium" style={{ color: '#2563eb' }}>Upwork</p>
            <p className="text-sm mt-1" style={{ color: '#374151' }}>
              {t('cv.upworkDescription')}
            </p>
          </div>
        </div>

        {/* Education */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-3 border-l-4 border-blue-500 pl-3" style={{ color: '#2563eb' }}>
            {t('cv.education')}
          </h3>
          
          <div className="mb-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold" style={{ color: '#1f2937' }}>Computer Science</h4>
              <span className="text-sm" style={{ color: '#6b7280' }}>2022 - 2026</span>
            </div>
            <p className="font-medium" style={{ color: '#2563eb' }}>University of the People</p>
            <p className="text-sm" style={{ color: '#374151' }}>Bachelor's Degree</p>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold" style={{ color: '#1f2937' }}>Computer Programming</h4>
              <span className="text-sm" style={{ color: '#6b7280' }}>2021 - 2023</span>
            </div>
            <p className="font-medium" style={{ color: '#2563eb' }}>Anadolu Üniversitesi</p>
            <p className="text-sm" style={{ color: '#374151' }}>Associate Degree</p>
          </div>
        </div>

        {/* Certificates */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-3 border-l-4 border-blue-500 pl-3" style={{ color: '#2563eb' }}>
            {t('cv.certificates')}
          </h3>
          <ul className="list-disc list-inside space-y-1" style={{ color: '#374151' }}>
            <li>React Native Bootcamp - Siliconmade Academy (2024)</li>
            <li>Frontend Development Certificate - Online Platform</li>
            <li>JavaScript Fundamentals - Codecademy</li>
          </ul>
        </div>

        {/* Languages */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-3 border-l-4 border-blue-500 pl-3" style={{ color: '#2563eb' }}>
            {t('cv.languages')}
          </h3>
          <div className="grid grid-cols-2 gap-4" style={{ color: '#374151' }}>
            <div>
              <span className="font-semibold">Turkish:</span> Native
            </div>
            <div>
              <span className="font-semibold">English:</span> Advanced
            </div>
            <div>
              <span className="font-semibold">German:</span> Intermediate
            </div>
            <div>
              <span className="font-semibold">Azerbaijani:</span> Native
            </div>
          </div>
        </div>
      </div>

      {/* Generate PDF Button */}
      <div className="text-center mt-8 space-y-4">
        <button
          onClick={generatePDF}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mr-4"
        >
          📄 {t('cv.generatePDF')}
        </button>
        
        <button
          onClick={() => window.print()}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          🖨️ {t('cv.printCV')}
        </button>
      </div>
    </div>
  );
};

export default DynamicCV;
