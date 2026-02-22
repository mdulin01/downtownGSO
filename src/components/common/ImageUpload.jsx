import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';

export default function ImageUpload({ onImageSelected, existingUrl }) {
  const [preview, setPreview] = useState(existingUrl || null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target.result);
      };
      reader.readAsDataURL(file);

      // For now, return the file directly
      // In production, you might compress using browser-image-compression
      onImageSelected(file);
    } catch (error) {
      console.error('Error processing image:', error);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>
      ) : (
        <label className="block border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-slate-500 hover:bg-slate-800/50 transition">
          <Upload className="mx-auto mb-2 text-slate-400" size={32} />
          <p className="text-slate-300 font-medium">Click to upload an image</p>
          <p className="text-slate-400 text-sm">PNG, JPG up to 10MB</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}
