'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Download,
  X,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BulkUploadPage() {
  const [isDragging, setIsDragging] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/csv') {
      setFile(droppedFile);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tighter uppercase">Bulk CSV Upload</h1>
        <p className="text-muted-foreground">Upload multiple products at once using our CSV template.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Area */}
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 relative overflow-hidden",
              isDragging ? "border-primary bg-primary/5" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-workshop-dark",
              file && "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/10"
            )}
          >
            <div className="absolute inset-0 opacity-5 industrial-grid pointer-events-none" />
            
            <div className="relative z-10 space-y-6">
              <div className={cn(
                "w-20 h-20 rounded-2xl flex items-center justify-center mx-auto transition-transform duration-500",
                isDragging ? "scale-110" : "scale-100",
                file ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-slate-100 dark:bg-slate-800"
              )}>
                {file ? (
                  <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                ) : (
                  <Upload className={cn("h-10 w-10", isDragging ? "text-primary" : "text-muted-foreground")} />
                )}
              </div>

              {file ? (
                <div className="space-y-4">
                  <div>
                    <div className="text-xl font-bold">{file.name}</div>
                    <div className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</div>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="industrial" className="h-12 px-8">
                      Start Processing
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setFile(null)} className="text-red-500">
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Drag and drop your CSV file here</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto">
                    Only .csv files are supported. Max file size is 10MB.
                  </p>
                  <div className="pt-4">
                    <Button variant="outline" className="h-12 px-8 font-bold uppercase tracking-widest">
                      Browse Files
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-slate-50 dark:bg-slate-900/50 border rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
              <Info className="h-4 w-4 text-primary" />
              Upload Guidelines
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                Ensure all required columns (Name, Price, SKU, Category) are filled.
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                Image URLs must be publicly accessible.
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                Categories must match the existing marketplace structure.
              </li>
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-workshop-dark border rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="font-bold uppercase tracking-tighter border-b pb-2">Templates</h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border flex items-center justify-between group cursor-pointer hover:border-primary transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm font-bold">Standard Template</div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">CSV Format</div>
                  </div>
                </div>
                <Download className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border flex items-center justify-between group cursor-pointer hover:border-primary transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm font-bold">Sample Data</div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">CSV Format</div>
                  </div>
                </div>
                <Download className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
          </div>

          <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-tighter">
              <AlertCircle className="h-5 w-5" />
              Need Help?
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              If you&apos;re having trouble with the bulk upload, our technical support team can help you format your data.
            </p>
            <Button variant="link" className="h-auto p-0 text-xs font-bold uppercase tracking-widest text-primary">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
