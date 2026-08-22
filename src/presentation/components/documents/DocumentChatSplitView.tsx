'use client';

import React, { useState } from 'react';

interface DocumentChatSplitViewProps {
  documentTitle?: string;
  pdfUrl?: string;
}

export const DocumentChatSplitView: React.FC<DocumentChatSplitViewProps> = ({ 
  documentTitle = "Laporan_Evaluasi_Jaringan_Kuartal_3.pdf", 
  pdfUrl 
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'metadata'>('chat');
  const [chatInput, setChatInput] = useState('');

  return (
    <div className="flex h-[calc(100vh-64px)] w-full bg-slate-50 overflow-hidden">
      
      {/* LEFT PANEL: Document Viewer */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-slate-200 bg-slate-100/50 relative shadow-[inset_-10px_0_15px_-10px_rgba(0,0,0,0.05)]">
        
        {/* Document Viewer Header */}
        <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <i className="fas fa-file-pdf"></i>
            </div>
            <h2 className="text-sm font-semibold text-slate-800 truncate" title={documentTitle}>
              {documentTitle}
            </h2>
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-bold tracking-wide uppercase shrink-0">
              Disetujui
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="w-8 h-8 rounded flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
              <i className="fas fa-search text-sm"></i>
            </button>
            <button className="w-8 h-8 rounded flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
              <i className="fas fa-download text-sm"></i>
            </button>
            <button className="w-8 h-8 rounded flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
              <i className="fas fa-expand text-sm"></i>
            </button>
          </div>
        </div>

        {/* Document Viewer Body (Placeholder) */}
        <div className="flex-1 p-6 overflow-y-auto flex justify-center items-start">
          {pdfUrl ? (
            <iframe src={pdfUrl} className="w-full max-w-4xl h-[1200px] bg-white shadow-md rounded-sm border border-slate-200" title="PDF Viewer" />
          ) : (
            <div className="w-full max-w-3xl bg-white shadow-md rounded-md border border-slate-200 min-h-[800px] p-12 relative">
              {/* Skeleton content representing PDF */}
              <div className="w-1/2 h-8 bg-slate-100 rounded mb-8"></div>
              <div className="w-full h-4 bg-slate-50 rounded mb-3"></div>
              <div className="w-full h-4 bg-slate-50 rounded mb-3"></div>
              <div className="w-11/12 h-4 bg-slate-50 rounded mb-3"></div>
              <div className="w-full h-4 bg-slate-50 rounded mb-8"></div>
              
              <div className="w-1/3 h-6 bg-slate-100 rounded mb-6 mt-10"></div>
              <div className="w-full h-4 bg-slate-50 rounded mb-3"></div>
              <div className="w-10/12 h-4 bg-slate-50 rounded mb-3"></div>
              <div className="w-full h-4 bg-slate-50 rounded mb-3"></div>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm">
                <i className="fas fa-file-pdf text-4xl text-slate-300 mb-3"></i>
                <p className="text-sm font-medium text-slate-500">Document Viewer Placeholder</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: AI Assistant */}
      <div className="w-96 flex flex-col bg-white shrink-0 shadow-[-5px_0_15px_-10px_rgba(0,0,0,0.05)]">
        
        {/* Assistant Header */}
        <div className="h-14 border-b border-slate-200 flex items-center px-4 shrink-0 bg-white z-10">
          <div className="w-8 h-8 rounded-full bg-[var(--color-navy)] text-white flex items-center justify-center mr-3 shadow-xs">
            <i className="fas fa-robot text-sm"></i>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 leading-tight">AI Assistant</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Online (SignalR)</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-4 pt-3 bg-slate-50/50 shrink-0">
          <button 
            className={`pb-2.5 px-3 text-xs font-bold transition-colors border-b-2 ${activeTab === 'chat' ? 'border-[var(--color-navy)] text-[var(--color-navy)]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            onClick={() => setActiveTab('chat')}
          >
            Tanya AI
          </button>
          <button 
            className={`pb-2.5 px-3 text-xs font-bold transition-colors border-b-2 ${activeTab === 'metadata' ? 'border-[var(--color-navy)] text-[var(--color-navy)]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            onClick={() => setActiveTab('metadata')}
          >
            Metadata Dokumen
          </button>
        </div>

        {/* Assistant Body */}
        <div className="flex-1 overflow-y-auto p-4 bg-white relative">
          {activeTab === 'chat' ? (
            <div className="space-y-6">
              <div className="text-center my-4">
                <span className="text-[10px] bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-medium tracking-wide">Hari Ini</span>
              </div>
              
              {/* AI Message */}
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 mt-1">
                  <i className="fas fa-robot text-[10px] text-indigo-600"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="bg-slate-50 border border-slate-100 text-slate-700 text-sm p-3.5 rounded-2xl rounded-tl-sm shadow-sm">
                    <p>Halo! Saya sudah selesai memindai dokumen <strong>{documentTitle}</strong>.</p>
                    <p className="mt-2">Dokumen ini membahas tentang optimalisasi jaringan untuk kuartal ketiga. Ada yang ingin Anda tanyakan terkait isi dokumen ini?</p>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1.5 ml-1 block">09:41 AM</span>
                </div>
              </div>

              {/* User Message */}
              <div className="flex items-start gap-3 flex-row-reverse">
                <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-1">
                  <span className="text-[10px] font-bold text-slate-600">JS</span>
                </div>
                <div className="flex-1 min-w-0 flex flex-col items-end">
                  <div className="bg-[var(--color-navy)] text-white text-sm p-3.5 rounded-2xl rounded-tr-sm shadow-sm">
                    Tolong buatkan ringkasan 3 poin utama dari dokumen tersebut.
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1.5 mr-1 block">09:42 AM</span>
                </div>
              </div>
              
              {/* AI Typing Indicator */}
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                  <i className="fas fa-robot text-[10px] text-indigo-600"></i>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5 w-16">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Informasi Sistem</h4>
                <div className="space-y-3">
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase">Diupload Oleh</span>
                    <span className="text-sm font-medium text-slate-800">Joko Santoso (Tenaga Ahli IT)</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase">Tanggal Upload</span>
                    <span className="text-sm font-medium text-slate-800">22 Agustus 2026</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase">Ukuran File</span>
                    <span className="text-sm font-medium text-slate-800">2.4 MB</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        {activeTab === 'chat' && (
          <div className="p-4 border-t border-slate-200 bg-white shrink-0">
            <div className="relative flex items-end gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200 focus-within:border-indigo-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-50/50 transition-all shadow-inner">
              <button className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 shrink-0 transition-colors">
                <i className="fas fa-paperclip text-sm"></i>
              </button>
              
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Tanyakan sesuatu pada dokumen ini..."
                className="flex-1 max-h-32 min-h-[36px] bg-transparent border-none focus:ring-0 resize-none py-2 text-sm text-slate-700 placeholder-slate-400"
                rows={1}
                style={{ scrollbarWidth: 'none' }}
              />
              
              <button 
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                  chatInput.trim() 
                    ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <i className="fas fa-paper-plane text-sm ml-0.5"></i>
              </button>
            </div>
            <p className="text-[9px] text-center text-slate-400 mt-3 font-medium">
              AI dapat membuat kesalahan. Harap periksa kembali informasi penting.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
