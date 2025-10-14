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

      // HTML'i canvas'a çevir
      const canvas = await html2canvas(cvRef.current, {
        scale: 2, // Yüksek kalite için
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794, // A4 genişliği (pixel)
        height: 1123, // A4 yüksekliği (pixel)
        ignoreElements: (element) => {
          // OKLCH renklerini içeren elementleri atla
          const style = window.getComputedStyle(element);
          const color = style.color;
          const backgroundColor = style.backgroundColor;
          return color.includes('oklch') || backgroundColor.includes('oklch');
        },
        onclone: (clonedDoc) => {
          // OKLCH renklerini hex'e çevir
          const elements = clonedDoc.querySelectorAll('*');
          elements.forEach((element: any) => {
            const style = element.style;
            if (style.color && style.color.includes('oklch')) {
              style.color = '#000000'; // Siyah yap
            }
            if (style.backgroundColor && style.backgroundColor.includes('oklch')) {
              style.backgroundColor = '#ffffff'; // Beyaz yap
            }
          });
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
