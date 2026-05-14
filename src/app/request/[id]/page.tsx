"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { UploadCloud, CheckCircle2, ShieldCheck, FileIcon } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function FileRequestPage() {
  const params = useParams();
  const requestId = params?.id as string;
  
  const [requestData, setRequestData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequest = async () => {
      if (!requestId) return;
      const { data, error } = await supabase
        .from('file_requests')
        .select('*')
        .eq('id', requestId)
        .single();
      
      if (data) {
        setRequestData(data);
      } else {
        setError("Invalid or expired file request link.");
      }
      setIsLoading(false);
    };
    
    fetchRequest();
  }, [requestId]);

  const handleUpload = async () => {
    if (!file || !requestData) return;
    setIsUploading(true);
    
    try {
      // 1. Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${requestData.client_tag}/requests/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('client-vault')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;

      // 2. Add to vault_files
      const { error: dbError } = await supabase.from('vault_files').insert({
        client_id: requestData.client_tag,
        name: file.name,
        size: file.size,
        type: file.type,
        folder: "Requested Files",
        storage_path: filePath,
        is_internal: false
      });
      
      if (dbError) throw dbError;

      // 3. Mark request as fulfilled
      await supabase.from('file_requests').update({ status: 'fulfilled' }).eq('id', requestId);

      setIsSuccess(true);
    } catch (err: any) {
      alert("Upload failed: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white">
        <div className="w-6 h-6 border-2 border-zinc-700 border-t-zinc-300 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !requestData) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-white p-6 text-center">
        <ShieldCheck className="w-12 h-12 text-zinc-600 mb-4" />
        <h2 className="text-xl font-bold mb-2">Request Not Found</h2>
        <p className="text-zinc-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col text-white selection:bg-[#F0564A]/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#F0564A]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-[#111111] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
        >
          {requestData.status === 'fulfilled' || isSuccess ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Upload Complete!</h2>
              <p className="text-zinc-400 mb-8">
                Your file has been securely transmitted to MSC. You can safely close this window.
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-center mb-8">
                <Image
                  src="/images/MSC LOGO BITTERSWEET VECTOR (1).svg"
                  alt="MSC Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-3">Secure File Request</h1>
                <p className="text-zinc-400 text-sm">
                  MSC is requesting a file from <span className="font-semibold text-zinc-200">{requestData.client_tag}</span>.
                </p>
              </div>

              <div className="bg-black/40 border border-white/5 p-4 rounded-xl mb-8">
                <p className="text-sm font-medium text-zinc-300 mb-1">Message from MSC:</p>
                <p className="text-zinc-400 italic">"{requestData.message}"</p>
              </div>

              {!file ? (
                <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:bg-white/5 transition-colors group cursor-pointer relative">
                  <input 
                    type="file" 
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-16 h-16 bg-[#F0564A]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-8 h-8 text-[#F0564A]" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Click or drag file here</h3>
                  <p className="text-sm text-zinc-500">Maximum file size: 50MB</p>
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center">
                  <FileIcon className="w-12 h-12 text-zinc-400 mb-3" />
                  <p className="text-sm font-medium text-white truncate max-w-full mb-1">{file.name}</p>
                  <p className="text-xs text-zinc-500 mb-6">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  
                  <div className="flex w-full gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setFile(null)}
                      disabled={isUploading}
                      className="flex-1 border-white/10 hover:bg-white/5 text-zinc-300"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleUpload}
                      disabled={isUploading}
                      className="flex-1 bg-[#F0564A] hover:bg-[#D94D42] text-white"
                    >
                      {isUploading ? "Uploading..." : "Secure Upload"}
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="mt-8 flex items-center justify-center gap-2 text-xs text-zinc-500">
                <ShieldCheck className="w-4 h-4 text-emerald-500/70" />
                End-to-end encrypted transfer
              </div>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}