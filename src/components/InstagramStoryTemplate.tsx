import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaInstagram } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode';

interface InstagramStoryTemplateProps {
  isOpen: boolean;
  onClose: () => void;
}

const InstagramStoryTemplate: React.FC<InstagramStoryTemplateProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      generateStoryTemplate();
    }
  }, [isOpen]);

  const generateStoryTemplate = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Instagram Story dimensions (1080x1920)
    canvas.width = 1080;
    canvas.height = 1920;

    // Background gradient (Dark theme matching website)
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1f2937'); // gray-800
    gradient.addColorStop(0.5, '#111827'); // gray-900
    gradient.addColorStop(1, '#000000'); // black
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Animated circles (matching website design)
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)'; // blue-500/10
    ctx.beginPath();
    ctx.arc(200, 300, 300, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(168, 85, 247, 0.1)'; // purple-500/10
    ctx.beginPath();
    ctx.arc(880, 1400, 400, 0, Math.PI * 2);
    ctx.fill();

    // Website mockup frame
    const mockupY = 350;
    const mockupHeight = 600;
    
    // Phone frame (glassmorphism style)
    ctx.fillStyle = 'rgba(31, 41, 55, 0.8)';
    ctx.strokeStyle = 'rgba(75, 85, 99, 0.5)';
    ctx.lineWidth = 2;
    roundRect(ctx, 190, mockupY, 700, mockupHeight, 30);
    ctx.fill();
    ctx.stroke();

    // Screen glow effect
    ctx.shadowBlur = 40;
    ctx.shadowColor = 'rgba(59, 130, 246, 0.5)';
    ctx.fillStyle = 'rgba(17, 24, 39, 0.95)';
    roundRect(ctx, 210, mockupY + 20, 660, mockupHeight - 40, 20);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Website preview text
    ctx.fillStyle = '#60A5FA'; // blue-400
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('www.tolgacavga.com', 540, mockupY + 100);

    // Portfolio title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 50px Arial';
    ctx.fillText('Frontend Developer', 540, mockupY + 200);

    // Tech stack icons simulation
    const techY = mockupY + 280;
    const techItems = ['⚛️ React', '📘 TypeScript', '🎨 Tailwind'];
    ctx.font = '32px Arial';
    ctx.fillStyle = '#E5E7EB';
    techItems.forEach((tech, index) => {
      ctx.fillText(tech, 540, techY + (index * 60));
    });

    // Projects preview
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = '#14F195'; // emerald-400
    ctx.fillText('✨ Modern Portfolio', 540, mockupY + 520);

    // Title at top
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 70px Arial';
    ctx.fillText('Tolga Çavga', 540, 200);

    ctx.font = '40px Arial';
    ctx.fillStyle = '#60A5FA';
    ctx.fillText('Portfolio', 540, 270);

    // QR Code
    try {
      const qrCodeDataUrl = await QRCode.toDataURL('https://www.tolgacavga.com', {
        width: 250,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      const qrImage = new Image();
      qrImage.onload = () => {
        // QR code background (white circle)
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(540, 1550, 140, 0, Math.PI * 2);
        ctx.fill();

        // Draw QR code
        ctx.drawImage(qrImage, 415, 1425, 250, 250);

        // QR code label
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Scan to Visit', 540, 1730);
      };
      qrImage.src = qrCodeDataUrl;
    } catch (error) {
      console.error('QR Code generation error:', error);
    }

    // Call to action
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 42px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🚀 Check out my projects!', 540, 1050);

    // Hashtags
    ctx.font = '30px Arial';
    ctx.fillStyle = '#A78BFA'; // purple-400
    ctx.fillText('#FrontendDeveloper #React #WebDev', 540, 1820);
  };

  // Helper function for rounded rectangles
  const roundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  const downloadStory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'tolgacavga-portfolio-story.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const shareToInstagram = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Mobilde Instagram'ı aç
      window.location.href = 'instagram://story-camera';
      
      setTimeout(() => {
        downloadStory(); // Story template'i indir
      }, 500);
    } else {
      // Desktop'ta önce indir, sonra Instagram'ı aç
      downloadStory();
      setTimeout(() => {
        window.open('https://www.instagram.com/codewithcavga', '_blank');
      }, 1000);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <FaInstagram className="text-pink-500" />
            Instagram Story
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Story Preview */}
        <div className="mb-6">
          <canvas
            ref={canvasRef}
            className="w-full h-auto rounded-lg shadow-2xl border border-gray-700"
          />
        </div>

        {/* Instructions */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-300 mb-2">
            📱 <strong>Mobil:</strong> Story kamerası açılır, template otomatik indirilir
          </p>
          <p className="text-sm text-gray-300">
            💻 <strong>Desktop:</strong> Template'i indir ve Instagram'da paylaş
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={downloadStory}
            className="flex-1 btn btn-outline border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white hover:border-blue-500 flex items-center justify-center gap-2 py-3 rounded-lg transition-all duration-300 hover:scale-105"
          >
            <FaDownload />
            İndir
          </button>
          <button
            onClick={shareToInstagram}
            className="flex-1 btn bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 border-none text-white flex items-center justify-center gap-2 py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/50"
          >
            <FaInstagram />
            Paylaş
          </button>
        </div>

        {/* Tips */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            💡 QR kod ile direkt siteye ulaşılabilir
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InstagramStoryTemplate;

